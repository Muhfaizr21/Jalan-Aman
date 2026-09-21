package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// IncidentRepository adalah kontrak interface untuk akses data insiden (SOLID: Interface Segregation & Dependency Inversion)
type IncidentRepository interface {
	Create(ctx context.Context, incident *model.Incident) error
	FindAll(ctx context.Context) ([]*model.Incident, error)
	FindByID(ctx context.Context, id string) (*model.Incident, error)
	UpdateStatus(ctx context.Context, id string, status model.IncidentStatus) error
	CountStats(ctx context.Context) (total int, verified int, pending int, err error)
	AutoMigrateAndSeed(ctx context.Context) error
}

// postgresIncidentRepository adalah implementasi konkrit IncidentRepository menggunakan database PostgreSQL
type postgresIncidentRepository struct {
	db *sql.DB
}

// NewPostgresIncidentRepository membuat instance baru IncidentRepository
func NewPostgresIncidentRepository(db *sql.DB) IncidentRepository {
	return &postgresIncidentRepository{db: db}
}

// AutoMigrateAndSeed membuat tabel incidents dan menginjeksi insiden awal Indramayu
func (r *postgresIncidentRepository) AutoMigrateAndSeed(ctx context.Context) error {
	queryDDL := `
	CREATE TABLE IF NOT EXISTS incidents (
		id VARCHAR(64) PRIMARY KEY,
		category VARCHAR(64) NOT NULL,
		title VARCHAR(255) NOT NULL,
		description TEXT NOT NULL,
		latitude DOUBLE PRECISION NOT NULL,
		longitude DOUBLE PRECISION NOT NULL,
		address VARCHAR(255) NOT NULL,
		severity VARCHAR(32) NOT NULL DEFAULT 'Low',
		status VARCHAR(32) NOT NULL DEFAULT 'Verified',
		reporter_id VARCHAR(64) NOT NULL DEFAULT '',
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_incidents_coords ON incidents(latitude, longitude);
	CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
	`
	if _, err := r.db.ExecContext(ctx, queryDDL); err != nil {
		return fmt.Errorf("gagal migrasi tabel incidents: %w", err)
	}

	var count int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM incidents").Scan(&count); err != nil {
		return fmt.Errorf("gagal memeriksa jumlah insiden: %w", err)
	}

	if count == 0 {
		seeds := []*model.Incident{
			{
				ID:          "inc_indramayu_01",
				Category:    "Penerangan Jalan",
				Title:       "Lampu PJU Padam 150m",
				Description: "Dua titik tiang lampu jalan padam di lajur kiri arah Lohbener. Kondisi gelap saat malam hari.",
				Latitude:    -6.4675,
				Longitude:   108.3160,
				Address:     "Bypass Bulak Jatibarang, Indramayu",
				Severity:    model.SeverityModerate,
				Status:      model.StatusVerified,
				ReporterID:  "system_seed",
				CreatedAt:   time.Now().Add(-2 * time.Hour),
				UpdatedAt:   time.Now().Add(-2 * time.Hour),
			},
			{
				ID:          "inc_indramayu_02",
				Category:    "Infrastruktur Jalan",
				Title:       "Jalan Berlubang Dalam (Rawan Terjatuh)",
				Description: "Lubang jalan sedalam ±8cm di dekat persimpangan menuju stasiun.",
				Latitude:    -6.4720,
				Longitude:   108.3110,
				Address:     "Simpang Tiga Jl. Mayor Dasuki, Jatibarang",
				Severity:    model.SeverityLow,
				Status:      model.StatusVerified,
				ReporterID:  "system_seed",
				CreatedAt:   time.Now().Add(-5 * time.Hour),
				UpdatedAt:   time.Now().Add(-5 * time.Hour),
			},
			{
				ID:          "inc_indramayu_03",
				Category:    "Rawan Kejahatan",
				Title:       "Area Sepi & Rawan Begal Malam",
				Description: "Jalur sepi minim aktivitas warga di atas jam 22.00 WIB. Disarankan melintas beriringan.",
				Latitude:    -6.4690,
				Longitude:   108.3145,
				Address:     "Jl. Raya Bulak No. 45, Jatibarang",
				Severity:    model.SeverityHigh,
				Status:      model.StatusVerified,
				ReporterID:  "system_seed",
				CreatedAt:   time.Now().Add(-12 * time.Hour),
				UpdatedAt:   time.Now().Add(-12 * time.Hour),
			},
		}

		insertQuery := `
		INSERT INTO incidents (id, category, title, description, latitude, longitude, address, severity, status, reporter_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		`
		for _, inc := range seeds {
			if _, err := r.db.ExecContext(ctx, insertQuery,
				inc.ID, inc.Category, inc.Title, inc.Description,
				inc.Latitude, inc.Longitude, inc.Address,
				string(inc.Severity), string(inc.Status), inc.ReporterID,
				inc.CreatedAt, inc.UpdatedAt,
			); err != nil {
				log.Printf("[Seeder Warning] Gagal memasukkan data insiden seed %s: %v\n", inc.ID, err)
			}
		}
		log.Println("[Seeder] 3 Insiden awal Indramayu berhasil dimigrasi ke database PostgreSQL.")
	}

	return nil
}

func (r *postgresIncidentRepository) Create(ctx context.Context, incident *model.Incident) error {
	query := `
	INSERT INTO incidents (id, category, title, description, latitude, longitude, address, severity, status, reporter_id, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`
	_, err := r.db.ExecContext(ctx, query,
		incident.ID,
		incident.Category,
		incident.Title,
		incident.Description,
		incident.Latitude,
		incident.Longitude,
		incident.Address,
		string(incident.Severity),
		string(incident.Status),
		incident.ReporterID,
		incident.CreatedAt,
		incident.UpdatedAt,
	)
	return err
}

func (r *postgresIncidentRepository) FindAll(ctx context.Context) ([]*model.Incident, error) {
	query := `
	SELECT id, category, title, description, latitude, longitude, address, severity, status, reporter_id, created_at, updated_at
	FROM incidents
	ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var incidents []*model.Incident
	for rows.Next() {
		var inc model.Incident
		var sev, stat string
		if err := rows.Scan(
			&inc.ID,
			&inc.Category,
			&inc.Title,
			&inc.Description,
			&inc.Latitude,
			&inc.Longitude,
			&inc.Address,
			&sev,
			&stat,
			&inc.ReporterID,
			&inc.CreatedAt,
			&inc.UpdatedAt,
		); err != nil {
			return nil, err
		}
		inc.Severity = model.IncidentSeverity(sev)
		inc.Status = model.IncidentStatus(stat)
		incidents = append(incidents, &inc)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return incidents, nil
}

func (r *postgresIncidentRepository) FindByID(ctx context.Context, id string) (*model.Incident, error) {
	query := `
	SELECT id, category, title, description, latitude, longitude, address, severity, status, reporter_id, created_at, updated_at
	FROM incidents
	WHERE id = $1
	LIMIT 1
	`
	var inc model.Incident
	var sev, stat string
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&inc.ID,
		&inc.Category,
		&inc.Title,
		&inc.Description,
		&inc.Latitude,
		&inc.Longitude,
		&inc.Address,
		&sev,
		&stat,
		&inc.ReporterID,
		&inc.CreatedAt,
		&inc.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("insiden tidak ditemukan")
		}
		return nil, err
	}
	inc.Severity = model.IncidentSeverity(sev)
	inc.Status = model.IncidentStatus(stat)
	return &inc, nil
}

func (r *postgresIncidentRepository) UpdateStatus(ctx context.Context, id string, status model.IncidentStatus) error {
	query := `
	UPDATE incidents
	SET status = $1, updated_at = $2
	WHERE id = $3
	`
	res, err := r.db.ExecContext(ctx, query, string(status), time.Now(), id)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("insiden tidak ditemukan")
	}
	return nil
}

func (r *postgresIncidentRepository) CountStats(ctx context.Context) (total int, verified int, pending int, err error) {
	query := `
	SELECT 
		COUNT(*),
		COALESCE(COUNT(*) FILTER (WHERE status = 'Verified'), 0),
		COALESCE(COUNT(*) FILTER (WHERE status = 'Pending'), 0)
	FROM incidents
	`
	err = r.db.QueryRowContext(ctx, query).Scan(&total, &verified, &pending)
	return
}

