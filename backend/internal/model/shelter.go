package model

import (
	"errors"
	"strings"
	"time"
)

// ShelterCategory mendefinisikan jenis safe haven
type ShelterCategory string

const (
	ShelterPolice    ShelterCategory = "police"
	ShelterStore24   ShelterCategory = "store24"
	ShelterPosSatpam ShelterCategory = "pos_satpam"
	ShelterHospital  ShelterCategory = "hospital"
)

// Shelter merepresentasikan entitas tempat perlindungan darurat / Safe Haven
type Shelter struct {
	ID        string          `json:"id"`
	Name      string          `json:"name"`
	Category  ShelterCategory `json:"category"`
	Address   string          `json:"address"`
	Latitude  float64         `json:"latitude"`
	Longitude float64         `json:"longitude"`
	Phone     string          `json:"phone"`
	Distance  string          `json:"distance"`
	Eta       string          `json:"eta"`
	IsActive  bool            `json:"is_active"`
	Is24H     bool            `json:"is_24h"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// Validate memvalidasi domain model Shelter
func (s *Shelter) Validate() error {
	if strings.TrimSpace(s.Name) == "" {
		return errors.New("nama shelter wajib diisi")
	}
	if strings.TrimSpace(s.Address) == "" {
		return errors.New("alamat shelter wajib diisi")
	}
	if s.Latitude < -90 || s.Latitude > 90 {
		return errors.New("latitude shelter tidak valid")
	}
	if s.Longitude < -180 || s.Longitude > 180 {
		return errors.New("longitude shelter tidak valid")
	}
	return nil
}
