package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/config"
	_ "github.com/lib/pq" // PostgreSQL driver
)

// Connect membuka koneksi ke PostgreSQL dan memverifikasi koneksi dengan Ping
func Connect(cfg *config.Config) (*sql.DB, error) {
	dsn := cfg.DSN()

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("gagal membuka koneksi postgres: %w", err)
	}

	// Konfigurasi connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verifikasi koneksi aktif
	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("gagal ping database postgres: %w", err)
	}

	log.Printf("[Database] Terhubung ke PostgreSQL: %s:%s/%s (user: %s)\n",
		cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBUser)

	return db, nil
}
