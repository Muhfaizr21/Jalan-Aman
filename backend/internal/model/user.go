package model

import (
	"errors"
	"strings"
	"time"
)

// UserRole mendefinisikan peran pengguna
type UserRole string

const (
	RoleUser       UserRole = "User"
	RoleAdmin      UserRole = "Admin"
	RoleSuperadmin UserRole = "Superadmin"
)

// User merepresentasikan entitas domain Pengguna (M dalam MVC)
type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Tidak pernah diserialisasi ke JSON
	Role         UserRole  `json:"role"`
	Status       string    `json:"status"` // Active, Suspended
	TrustScore   int       `json:"trust_score"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// LoginRequest merepresentasikan payload body saat pengguna melakukan login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validate memvalidasi kelengkapan payload login
func (req *LoginRequest) Validate() error {
	if strings.TrimSpace(req.Email) == "" {
		return errors.New("email wajib diisi")
	}
	if strings.TrimSpace(req.Password) == "" {
		return errors.New("password wajib diisi")
	}
	return nil
}

// AuthResponse adalah payload respons setelah autentikasi sukses
type AuthResponse struct {
	Token     string    `json:"token"`
	User      User      `json:"user"`
	ExpiresAt time.Time `json:"expires_at"`
}
