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

// ShelterRepository adalah interface data access untuk Safe Haven
type ShelterRepository interface {
	FindAll(ctx context.Context) ([]*model.Shelter, error)
	FindByID(ctx context.Context, id string) (*model.Shelter, error)
	Create(ctx context.Context, shelter *model.Shelter) error
	Count(ctx context.Context) (int, error)
	AutoMigrateAndSeed(ctx context.Context) error
}

type postgresShelterRepository struct {
	db *sql.DB
}

// NewPostgresShelterRepository membuat instance baru ShelterRepository
func NewPostgresShelterRepository(db *sql.DB) ShelterRepository {
	return &postgresShelterRepository{db: db}
}

// AutoMigrateAndSeed membuat tabel shelters dan menginjeksi safe haven awal Indramayu
func (r *postgresShelterRepository) AutoMigrateAndSeed(ctx context.Context) error {
	queryDDL := `
	CREATE TABLE IF NOT EXISTS shelters (
		id VARCHAR(64) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		category VARCHAR(64) NOT NULL,
		address VARCHAR(255) NOT NULL,
		latitude DOUBLE PRECISION NOT NULL,
		longitude DOUBLE PRECISION NOT NULL,
		phone VARCHAR(64) NOT NULL DEFAULT '',
		distance VARCHAR(64) NOT NULL DEFAULT '',
		eta VARCHAR(64) NOT NULL DEFAULT '',
		is_active BOOLEAN NOT NULL DEFAULT true,
		is_24h BOOLEAN NOT NULL DEFAULT true,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_shelters_coords ON shelters(latitude, longitude);
	`
	if _, err := r.db.ExecContext(ctx, queryDDL); err != nil {
		return fmt.Errorf("gagal migrasi tabel shelters: %w", err)
	}

	var count int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM shelters").Scan(&count); err != nil {
		return fmt.Errorf("gagal memeriksa jumlah shelter: %w", err)
	}

	if count == 0 {
		seeds := []*model.Shelter{
			{
				ID:        "sh_01",
				Name:      "Polsek Jatibarang (Siaga 24 Jam)",
				Category:  model.ShelterPolice,
				Address:   "Jl. Mayor Dasuki No. 12, Jatibarang",
				Latitude:  -6.4712,
				Longitude: 108.3120,
				Phone:     "+62 234-351110",
				Distance:  "320 m",
				Eta:       "2 mnt",
				IsActive:  true,
				Is24H:     true,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			{
				ID:        "sh_02",
				Name:      "Indomaret 24 Jam Bulak",
				Category:  model.ShelterStore24,
				Address:   "Jl. Raya Bulak No. 45, Jatibarang",
				Latitude:  -6.4690,
				Longitude: 108.3145,
				Phone:     "+62 812-9988-7766",
				Distance:  "580 m",
				Eta:       "4 mnt",
				IsActive:  true,
				Is24H:     true,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			{
				ID:        "sh_03",
				Name:      "Pos Satpam Perum Griya Jatibarang",
				Category:  model.ShelterPosSatpam,
				Address:   "Gerbang Utama Griya Asri, Jatibarang",
				Latitude:  -6.4780,
				Longitude: 108.3035,
				Phone:     "+62 853-2211-0099",
				Distance:  "850 m",
				Eta:       "6 mnt",
				IsActive:  true,
				Is24H:     true,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			{
				ID:        "sh_04",
				Name:      "RSUD Indramayu",
				Category:  model.ShelterHospital,
				Address:   "Jl. Murah Nara No. 7, Sindang, Indramayu",
				Latitude:  -6.3361,
				Longitude: 108.3204,
				Phone:     "+62 234-272655",
				Distance:  "15.8 km",
				Eta:       "22 mnt",
				IsActive:  true,
				Is24H:     true,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
		}

		insertQuery := `
		INSERT INTO shelters (id, name, category, address, latitude, longitude, phone, distance, eta, is_active, is_24h, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		`
		for _, sh := range seeds {
			if _, err := r.db.ExecContext(ctx, insertQuery,
				sh.ID, sh.Name, string(sh.Category), sh.Address,
				sh.Latitude, sh.Longitude, sh.Phone, sh.Distance, sh.Eta,
				sh.IsActive, sh.Is24H, sh.CreatedAt, sh.UpdatedAt,
			); err != nil {
				log.Printf("[Seeder Warning] Gagal memasukkan shelter seed %s: %v\n", sh.ID, err)
			}
		}
		log.Println("[Seeder] 4 Safe Haven awal Indramayu berhasil dimigrasi ke database PostgreSQL.")
	}

	return nil
}

func (r *postgresShelterRepository) FindAll(ctx context.Context) ([]*model.Shelter, error) {
	query := `
	SELECT id, name, category, address, latitude, longitude, phone, distance, eta, is_active, is_24h, created_at, updated_at
	FROM shelters
	WHERE is_active = true
	ORDER BY id ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*model.Shelter
	for rows.Next() {
		var s model.Shelter
		var cat string
		if err := rows.Scan(
			&s.ID,
			&s.Name,
			&cat,
			&s.Address,
			&s.Latitude,
			&s.Longitude,
			&s.Phone,
			&s.Distance,
			&s.Eta,
			&s.IsActive,
			&s.Is24H,
			&s.CreatedAt,
			&s.UpdatedAt,
		); err != nil {
			return nil, err
		}
		s.Category = model.ShelterCategory(cat)
		list = append(list, &s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return list, nil
}

func (r *postgresShelterRepository) FindByID(ctx context.Context, id string) (*model.Shelter, error) {
	query := `
	SELECT id, name, category, address, latitude, longitude, phone, distance, eta, is_active, is_24h, created_at, updated_at
	FROM shelters
	WHERE id = $1
	LIMIT 1
	`
	var s model.Shelter
	var cat string
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&s.ID,
		&s.Name,
		&cat,
		&s.Address,
		&s.Latitude,
		&s.Longitude,
		&s.Phone,
		&s.Distance,
		&s.Eta,
		&s.IsActive,
		&s.Is24H,
		&s.CreatedAt,
		&s.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("shelter tidak ditemukan")
		}
		return nil, err
	}
	s.Category = model.ShelterCategory(cat)
	return &s, nil
}

func (r *postgresShelterRepository) Create(ctx context.Context, shelter *model.Shelter) error {
	query := `
	INSERT INTO shelters (id, name, category, address, latitude, longitude, phone, distance, eta, is_active, is_24h, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	`
	_, err := r.db.ExecContext(ctx, query,
		shelter.ID,
		shelter.Name,
		string(shelter.Category),
		shelter.Address,
		shelter.Latitude,
		shelter.Longitude,
		shelter.Phone,
		shelter.Distance,
		shelter.Eta,
		shelter.IsActive,
		shelter.Is24H,
		shelter.CreatedAt,
		shelter.UpdatedAt,
	)
	return err
}

func (r *postgresShelterRepository) Count(ctx context.Context) (int, error) {
	var count int
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM shelters WHERE is_active = true").Scan(&count)
	return count, err
}
