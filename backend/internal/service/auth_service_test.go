package service_test

import (
	"context"
	"testing"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/config"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/database"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
)

func TestAuthService_Login(t *testing.T) {
	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		t.Fatalf("Gagal koneksi database: %v", err)
	}
	defer db.Close()

	userRepo := repository.NewPostgresUserRepository(db)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret, cfg.JWTExpireHours)

	// Test 1: Password Benar
	resp, err := authSvc.Login(context.Background(), &model.LoginRequest{
		Email:    "admin@gmail.com",
		Password: "admin123",
	})
	if err != nil {
		t.Fatalf("Ekspektasi login sukses, dapat error: %v", err)
	}
	if resp.Token == "" {
		t.Errorf("Ekspektasi token JWT tidak kosong")
	}
	if resp.User.Role != model.RoleSuperadmin {
		t.Errorf("Ekspektasi role Superadmin, dapat %s", resp.User.Role)
	}

	// Test 2: Password Salah
	_, err = authSvc.Login(context.Background(), &model.LoginRequest{
		Email:    "admin@gmail.com",
		Password: "wrongpassword",
	})
	if err == nil {
		t.Errorf("Ekspektasi login gagal untuk password salah")
	}
}
