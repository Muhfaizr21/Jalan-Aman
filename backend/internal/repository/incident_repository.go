package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// IncidentRepository adalah kontrak interface untuk akses data insiden (SOLID: Interface Segregation & Dependency Inversion)
type IncidentRepository interface {
	Create(ctx context.Context, incident *model.Incident) error
	FindAll(ctx context.Context) ([]*model.Incident, error)
	FindByID(ctx context.Context, id string) (*model.Incident, error)
}

// postgresIncidentRepository adalah implementasi konkrit IncidentRepository menggunakan database PostgreSQL
type postgresIncidentRepository struct {
	db *sql.DB
}

// NewPostgresIncidentRepository membuat instance baru IncidentRepository
func NewPostgresIncidentRepository(db *sql.DB) IncidentRepository {
	return &postgresIncidentRepository{db: db}
}

func (r *postgresIncidentRepository) Create(ctx context.Context, incident *model.Incident) error {
	// Arsitektur contract - query akan diisi saat implementasi tabel & migrasi
	return nil
}

func (r *postgresIncidentRepository) FindAll(ctx context.Context) ([]*model.Incident, error) {
	// Arsitektur contract - return slice kosong untuk saat ini
	return []*model.Incident{}, nil
}

func (r *postgresIncidentRepository) FindByID(ctx context.Context, id string) (*model.Incident, error) {
	// Arsitektur contract
	return nil, errors.New("data tidak ditemukan")
}
