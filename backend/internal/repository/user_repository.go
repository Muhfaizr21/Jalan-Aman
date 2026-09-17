package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"golang.org/x/crypto/bcrypt"
)

// UserRepository adalah interface data access untuk entitas User
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id string) (*model.User, error)
	Create(ctx context.Context, user *model.User) error
	AutoMigrateAndSeed(ctx context.Context, superName, superEmail, superPass string) error
}

type postgresUserRepository struct {
	db *sql.DB
}

// NewPostgresUserRepository membuat instance baru UserRepository
func NewPostgresUserRepository(db *sql.DB) UserRepository {
	return &postgresUserRepository{db: db}
}

// AutoMigrateAndSeed membuat tabel users jika belum ada dan menginjeksi akun Superadmin default
func (r *postgresUserRepository) AutoMigrateAndSeed(ctx context.Context, superName, superEmail, superPass string) error {
	queryDDL := `
	CREATE TABLE IF NOT EXISTS users (
		id VARCHAR(64) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		role VARCHAR(32) NOT NULL DEFAULT 'User',
		status VARCHAR(32) NOT NULL DEFAULT 'Active',
		trust_score INT NOT NULL DEFAULT 100,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	`
	if _, err := r.db.ExecContext(ctx, queryDDL); err != nil {
		return fmt.Errorf("gagal migrasi tabel users: %w", err)
	}

	// Cek apakah akun superadmin sudah ada
	var count int
	checkQuery := `SELECT COUNT(*) FROM users WHERE email = $1`
	if err := r.db.QueryRowContext(ctx, checkQuery, superEmail).Scan(&count); err != nil {
		return fmt.Errorf("gagal memeriksa akun superadmin: %w", err)
	}

	if count == 0 {
		hash, err := bcrypt.GenerateFromPassword([]byte(superPass), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("gagal hash password superadmin: %w", err)
		}

		insertQuery := `
		INSERT INTO users (id, name, email, password_hash, role, status, trust_score, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`
		now := time.Now()
		_, err = r.db.ExecContext(ctx, insertQuery,
			"USR-SA-001",
			superName,
			superEmail,
			string(hash),
			string(model.RoleSuperadmin),
			"Active",
			100,
			now,
			now,
		)
		if err != nil {
			return fmt.Errorf("gagal seeding akun superadmin: %w", err)
		}
		log.Printf("[Seeder] Akun Superadmin berhasil dibuat -> Email: %s | Password: %s\n", superEmail, superPass)
	} else {
		log.Printf("[Seeder] Akun Superadmin (%s) sudah tersedia di database.\n", superEmail)
	}

	return nil
}

func (r *postgresUserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	query := `
	SELECT id, name, email, password_hash, role, status, trust_score, created_at, updated_at
	FROM users
	WHERE email = $1
	LIMIT 1
	`
	var u model.User
	var roleStr string
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.PasswordHash,
		&roleStr,
		&u.Status,
		&u.TrustScore,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("pengguna tidak ditemukan")
		}
		return nil, err
	}
	u.Role = model.UserRole(roleStr)
	return &u, nil
}

func (r *postgresUserRepository) FindByID(ctx context.Context, id string) (*model.User, error) {
	query := `
	SELECT id, name, email, password_hash, role, status, trust_score, created_at, updated_at
	FROM users
	WHERE id = $1
	LIMIT 1
	`
	var u model.User
	var roleStr string
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.PasswordHash,
		&roleStr,
		&u.Status,
		&u.TrustScore,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("pengguna tidak ditemukan")
		}
		return nil, err
	}
	u.Role = model.UserRole(roleStr)
	return &u, nil
}

func (r *postgresUserRepository) Create(ctx context.Context, user *model.User) error {
	query := `
	INSERT INTO users (id, name, email, password_hash, role, status, trust_score, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	_, err := r.db.ExecContext(ctx, query,
		user.ID,
		user.Name,
		user.Email,
		user.PasswordHash,
		string(user.Role),
		user.Status,
		user.TrustScore,
		user.CreatedAt,
		user.UpdatedAt,
	)
	return err
}
