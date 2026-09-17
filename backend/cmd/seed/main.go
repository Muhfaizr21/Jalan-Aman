package main

import (
	"context"
	"log"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/config"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/database"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

func main() {
	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Gagal terhubung ke database: %v\n", err)
	}
	defer db.Close()

	userRepo := repository.NewPostgresUserRepository(db)
	if err := userRepo.AutoMigrateAndSeed(context.Background(), cfg.SuperadminName, cfg.SuperadminEmail, cfg.SuperadminPassword); err != nil {
		log.Fatalf("Gagal migrasi dan seeding: %v\n", err)
	}

	log.Println("Migrasi dan Seeding Superadmin selesai 100%!")
}
