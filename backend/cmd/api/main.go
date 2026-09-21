package main

//go:generate swag init -g cmd/api/main.go -o docs

// @title           JalanAman API Gateway
// @version         1.0.0
// @description     Dokumentasi interaktif OpenAPI/Swagger untuk API Gateway JalanAman.
// @termsOfService  https://github.com/Muhfaizr21/Jalan-Aman

// @contact.name    Tim Pengembang JalanAman
// @contact.url     https://github.com/Muhfaizr21/Jalan-Aman
// @contact.email   dev@jalanaman.id

// @license.name    Apache 2.0
// @license.url     http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api/v1

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/config"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/controller"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/database"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/route"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
)

// autoGenerateSwagger menjalankan 'swag init' secara otomatis saat mode development
func autoGenerateSwagger() {
	swagBin := "swag"
	if _, err := exec.LookPath(swagBin); err != nil {
		home, _ := os.UserHomeDir()
		fallback := filepath.Join(home, "go", "bin", "swag")
		if _, err := os.Stat(fallback); err == nil {
			swagBin = fallback
		} else {
			return
		}
	}

	cmd := exec.Command(swagBin, "init", "-g", "cmd/api/main.go", "-o", "docs")
	if out, err := cmd.CombinedOutput(); err != nil {
		log.Printf("[Swagger Warning] Gagal mengupdate dokumentasi otomatis: %v (%s)\n", err, string(out))
	} else {
		log.Println("[Swagger] Dokumentasi OpenAPI/Swagger berhasil diupdate otomatis.")
	}
}

func main() {
	// 1. Inisialisasi Konfigurasi dari .env
	cfg := config.Load()
	log.Printf("[Bootstrap] Memulai %s di mode %s\n", cfg.AppName, cfg.Environment)

	// Update dokumentasi Swagger otomatis jika di development
	if cfg.Environment == "development" {
		autoGenerateSwagger()
	}

	// 2. Inisialisasi Koneksi Database PostgreSQL
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("[Database Error] Gagal terhubung ke database: %v\n", err)
	}
	defer func() {
		if closeErr := db.Close(); closeErr != nil {
			log.Printf("[Database Error] Gagal menutup koneksi database: %v\n", closeErr)
		}
	}()

	// 3. Database Migration & Seeding (Users, Incidents, Shelters)
	userRepo := repository.NewPostgresUserRepository(db)
	if err := userRepo.AutoMigrateAndSeed(context.Background(), cfg.SuperadminName, cfg.SuperadminEmail, cfg.SuperadminPassword); err != nil {
		log.Fatalf("[Database Migration Error] Gagal migrasi & seeding users: %v\n", err)
	}

	incidentRepo := repository.NewPostgresIncidentRepository(db)
	if err := incidentRepo.AutoMigrateAndSeed(context.Background()); err != nil {
		log.Fatalf("[Database Migration Error] Gagal migrasi & seeding incidents: %v\n", err)
	}

	shelterRepo := repository.NewPostgresShelterRepository(db)
	if err := shelterRepo.AutoMigrateAndSeed(context.Background()); err != nil {
		log.Fatalf("[Database Migration Error] Gagal migrasi & seeding shelters: %v\n", err)
	}

	notificationRepo := repository.NewPostgresNotificationRepository(db)
	if err := notificationRepo.AutoMigrateAndSeed(context.Background()); err != nil {
		log.Fatalf("[Database Migration Error] Gagal migrasi & seeding notifications: %v\n", err)
	}

	settingsRepo := repository.NewPostgresSettingsRepository(db)
	if err := settingsRepo.AutoMigrateAndSeed(context.Background()); err != nil {
		log.Fatalf("[Database Migration Error] Gagal migrasi user_settings: %v\n", err)
	}

	tripRepo := repository.NewPostgresTripRepository(db)
	if err := tripRepo.AutoMigrate(context.Background()); err != nil {
		log.Fatalf("[Database Migration Error] Gagal migrasi trip_history: %v\n", err)
	}

	// 4. Dependency Injection (SOLID: Inversion of Control & Clean Architecture)
	// Service Layer (Business Logic)
	incidentService := service.NewIncidentService(incidentRepo, userRepo, notificationRepo, settingsRepo)
	shelterService := service.NewShelterService(shelterRepo)
	authService := service.NewAuthService(userRepo, notificationRepo, cfg.JWTSecret, cfg.JWTExpireHours)
	adminService := service.NewAdminService(userRepo, incidentRepo, shelterRepo)
	notificationService := service.NewNotificationService(notificationRepo)
	settingsService := service.NewSettingsService(settingsRepo)
	mapService := service.NewMapService()
	tripService := service.NewTripService(tripRepo, settingsRepo, cfg.JWTSecret)

	// Controller Layer (HTTP Transport)
	incidentController := controller.NewIncidentController(incidentService)
	shelterController := controller.NewShelterController(shelterService)
	healthController := controller.NewHealthController(db)
	authController := controller.NewAuthController(authService)
	adminController := controller.NewAdminController(adminService)
	notificationController := controller.NewNotificationController(notificationService)
	settingsController := controller.NewSettingsController(settingsService)
	mapController := controller.NewMapController(mapService)
	tripController := controller.NewTripController(tripService)

	// 5. Setup Routing & Middleware
	handlers := route.Handlers{
		Health:       healthController,
		Incident:     incidentController,
		Shelter:      shelterController,
		Auth:         authController,
		Admin:        adminController,
		Notification: notificationController,
		Settings:     settingsController,
		Map:          mapController,
		Trip:         tripController,
		JWTSecret:    cfg.JWTSecret,
	}
	router := route.SetupRouter(handlers)

	// 5. Inisialisasi HTTP Server
	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:         serverAddr,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 6. Jalankan Server di goroutine terpisah
	go func() {
		log.Printf("[Server] Server aktif dan siap menerima request di port http://localhost%s\n", serverAddr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("[Server Error] Gagal menjalankan server: %v\n", err)
		}
	}()

	// 7. Graceful Shutdown (Menangkap sinyal SIGINT / SIGTERM)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[Server] Menerima sinyal shutdown, mematikan server secara aman...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("[Server Error] Server dipaksa berhenti: %v\n", err)
	}

	log.Println("[Server] Server berhenti dengan aman.")
}
