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
	ID                string    `json:"id"`
	Name              string    `json:"name"`
	Email             string    `json:"email"`
	PasswordHash      string    `json:"-"` // Tidak pernah diserialisasi ke JSON
	Phone             string    `json:"phone"`
	Domicile          string    `json:"domicile"`
	BloodType         string    `json:"blood_type"`
	Allergies         string    `json:"allergies"`
	MedicalNotes      string    `json:"medical_notes"`
	EmergencyHospital string    `json:"emergency_hospital"`
	GuardianName      string    `json:"guardian_name"`
	GuardianPhone     string    `json:"guardian_phone"`
	AvatarURL         string    `json:"avatar_url"`
	Role              UserRole  `json:"role"`
	Status            string    `json:"status"` // Active, Suspended
	TrustScore        int       `json:"trust_score"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
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

// RegisterRequest merepresentasikan payload pendaftaran pengguna baru (User role)
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Phone    string `json:"phone,omitempty"`
}

// Validate memvalidasi kelengkapan payload pendaftaran
func (req *RegisterRequest) Validate() error {
	if strings.TrimSpace(req.Name) == "" {
		return errors.New("nama lengkap wajib diisi")
	}
	if strings.TrimSpace(req.Email) == "" {
		return errors.New("email wajib diisi")
	}
	if len(req.Password) < 6 {
		return errors.New("password minimal 6 karakter")
	}
	return nil
}

// UpdateProfileRequest merepresentasikan payload pembaruan profil dan ID Medis pengguna
type UpdateProfileRequest struct {
	Name              string `json:"name"`
	Phone             string `json:"phone"`
	Domicile          string `json:"domicile"`
	BloodType         string `json:"blood_type"`
	Allergies         string `json:"allergies"`
	MedicalNotes      string `json:"medical_notes"`
	EmergencyHospital string `json:"emergency_hospital"`
	GuardianName      string `json:"guardian_name"`
	GuardianPhone     string `json:"guardian_phone"`
	AvatarURL         string `json:"avatar_url,omitempty"`
}

// Validate memvalidasi kelengkapan data pembaruan profil
func (req *UpdateProfileRequest) Validate() error {
	if strings.TrimSpace(req.Name) == "" {
		return errors.New("nama lengkap tidak boleh kosong")
	}
	return nil
}

// AuthResponse adalah payload respons setelah autentikasi sukses
type AuthResponse struct {
	Token     string    `json:"token"`
	User      User      `json:"user"`
	ExpiresAt time.Time `json:"expires_at"`
}
