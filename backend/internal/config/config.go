package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config menyimpan konfigurasi aplikasi dan database
type Config struct {
	Port        string
	Environment string
	AppName     string

	// Database Configurations
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// JWT & Auth
	JWTSecret      string
	JWTExpireHours int

	// Superadmin Seeder
	SuperadminName     string
	SuperadminEmail    string
	SuperadminPassword string
}

// Load membaca konfigurasi dari file .env (jika ada) dan environment variables
func Load() *Config {
	// Memuat .env jika ada
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	env := getEnv("APP_ENV", "development")
	appName := getEnv("APP_NAME", "JalanAman API Gateway")

	return &Config{
		Port:               port,
		Environment:        env,
		AppName:            appName,
		DBHost:             getEnv("DB_HOST", "localhost"),
		DBPort:             getEnv("DB_PORT", "5432"),
		DBUser:             getEnv("DB_USER", "muhfaiizr"),
		DBPassword:         getEnv("DB_PASSWORD", ""),
		DBName:             getEnv("DB_NAME", "jalanaman"),
		DBSSLMode:          getEnv("DB_SSLMODE", "disable"),
		JWTSecret:          getEnv("JWT_SECRET", "jalanaman-super-secret-key-2026-production"),
		JWTExpireHours:     24,
		SuperadminName:     getEnv("SUPERADMIN_NAME", "Superadmin Utama"),
		SuperadminEmail:    getEnv("SUPERADMIN_EMAIL", "admin@gmail.com"),
		SuperadminPassword: getEnv("SUPERADMIN_PASSWORD", "admin123"),
	}
}

// DSN mengembalikan Data Source Name untuk koneksi PostgreSQL
func (c *Config) DSN() string {
	if c.DBPassword == "" {
		return fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=%s",
			c.DBHost, c.DBPort, c.DBUser, c.DBName, c.DBSSLMode)
	}
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
