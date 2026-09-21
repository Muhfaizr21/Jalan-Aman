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
	FindAll(ctx context.Context) ([]*model.User, error)
	Count(ctx context.Context) (int, error)
	Create(ctx context.Context, user *model.User) error
	Update(ctx context.Context, user *model.User) error
	Delete(ctx context.Context, id string) error
	AutoMigrateAndSeed(ctx context.Context, superName, superEmail, superPass string) error
	AddReputationLog(ctx context.Context, log *model.ReputationLog) error
	GetReputationLogs(ctx context.Context, userID string) ([]*model.ReputationLog, error)
	UpdateTrustScore(ctx context.Context, userID string, newScore int) error
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
		phone VARCHAR(64) DEFAULT '',
		domicile VARCHAR(255) DEFAULT '',
		blood_type VARCHAR(16) DEFAULT '',
		allergies TEXT DEFAULT '',
		medical_notes TEXT DEFAULT '',
		emergency_hospital VARCHAR(255) DEFAULT '',
		guardian_name VARCHAR(255) DEFAULT '',
		guardian_phone VARCHAR(64) DEFAULT '',
		avatar_url TEXT DEFAULT '',
		role VARCHAR(32) NOT NULL DEFAULT 'User',
		status VARCHAR(32) NOT NULL DEFAULT 'Active',
		trust_score INT NOT NULL DEFAULT 100,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

	-- Tambahkan kolom profil tambahan jika tabel sudah pernah dibuat sebelumnya
	ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(64) DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS domicile VARCHAR(255) DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS blood_type VARCHAR(16) DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS allergies TEXT DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS medical_notes TEXT DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_hospital VARCHAR(255) DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS guardian_name VARCHAR(255) DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS guardian_phone VARCHAR(64) DEFAULT '';
	ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';

	CREATE TABLE IF NOT EXISTS reputation_logs (
		id VARCHAR(64) PRIMARY KEY,
		user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		change_amount INT NOT NULL,
		current_score INT NOT NULL,
		reason VARCHAR(255) NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_reputation_logs_user_id ON reputation_logs(user_id);
	`
	if _, err := r.db.ExecContext(ctx, queryDDL); err != nil {
		return fmt.Errorf("gagal migrasi tabel users & reputation_logs: %w", err)
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
		INSERT INTO users (id, name, email, password_hash, phone, domicile, blood_type, allergies, medical_notes, emergency_hospital, guardian_name, guardian_phone, avatar_url, role, status, trust_score, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
		`
		now := time.Now()
		_, err = r.db.ExecContext(ctx, insertQuery,
			"USR-SA-001",
			superName,
			superEmail,
			string(hash),
			"+62 812-0000-9999",
			"Command Center Indramayu",
			"O+",
			"Tidak Ada",
			"Pusat Komando Tanggap Darurat JalanAman",
			"RSUD Indramayu",
			"Posko Terpadu",
			"112",
			"",
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
	SELECT id, name, email, password_hash,
	       COALESCE(phone, ''), COALESCE(domicile, ''), COALESCE(blood_type, ''),
	       COALESCE(allergies, ''), COALESCE(medical_notes, ''), COALESCE(emergency_hospital, ''),
	       COALESCE(guardian_name, ''), COALESCE(guardian_phone, ''), COALESCE(avatar_url, ''),
	       role, status, trust_score, created_at, updated_at
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
		&u.Phone,
		&u.Domicile,
		&u.BloodType,
		&u.Allergies,
		&u.MedicalNotes,
		&u.EmergencyHospital,
		&u.GuardianName,
		&u.GuardianPhone,
		&u.AvatarURL,
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
	SELECT id, name, email, password_hash,
	       COALESCE(phone, ''), COALESCE(domicile, ''), COALESCE(blood_type, ''),
	       COALESCE(allergies, ''), COALESCE(medical_notes, ''), COALESCE(emergency_hospital, ''),
	       COALESCE(guardian_name, ''), COALESCE(guardian_phone, ''), COALESCE(avatar_url, ''),
	       role, status, trust_score, created_at, updated_at
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
		&u.Phone,
		&u.Domicile,
		&u.BloodType,
		&u.Allergies,
		&u.MedicalNotes,
		&u.EmergencyHospital,
		&u.GuardianName,
		&u.GuardianPhone,
		&u.AvatarURL,
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
	INSERT INTO users (id, name, email, password_hash, phone, domicile, blood_type, allergies, medical_notes, emergency_hospital, guardian_name, guardian_phone, avatar_url, role, status, trust_score, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
	`
	_, err := r.db.ExecContext(ctx, query,
		user.ID,
		user.Name,
		user.Email,
		user.PasswordHash,
		user.Phone,
		user.Domicile,
		user.BloodType,
		user.Allergies,
		user.MedicalNotes,
		user.EmergencyHospital,
		user.GuardianName,
		user.GuardianPhone,
		user.AvatarURL,
		string(user.Role),
		user.Status,
		user.TrustScore,
		user.CreatedAt,
		user.UpdatedAt,
	)
	return err
}

func (r *postgresUserRepository) Update(ctx context.Context, user *model.User) error {
	query := `
	UPDATE users SET
		name = $1,
		phone = $2,
		domicile = $3,
		blood_type = $4,
		allergies = $5,
		medical_notes = $6,
		emergency_hospital = $7,
		guardian_name = $8,
		guardian_phone = $9,
		avatar_url = $10,
		updated_at = $11
	WHERE id = $12
	`
	result, err := r.db.ExecContext(ctx, query,
		user.Name,
		user.Phone,
		user.Domicile,
		user.BloodType,
		user.Allergies,
		user.MedicalNotes,
		user.EmergencyHospital,
		user.GuardianName,
		user.GuardianPhone,
		user.AvatarURL,
		time.Now(),
		user.ID,
	)
	if err != nil {
		return err
	}
	rowsAff, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAff == 0 {
		return errors.New("pengguna tidak ditemukan untuk diperbarui")
	}
	return nil
}

func (r *postgresUserRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}
	rowsAff, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAff == 0 {
		return errors.New("pengguna tidak ditemukan untuk dihapus")
	}
	return nil
}

func (r *postgresUserRepository) FindAll(ctx context.Context) ([]*model.User, error) {
	query := `
	SELECT id, name, email, password_hash,
	       COALESCE(phone, ''), COALESCE(domicile, ''), COALESCE(blood_type, ''),
	       COALESCE(allergies, ''), COALESCE(medical_notes, ''), COALESCE(emergency_hospital, ''),
	       COALESCE(guardian_name, ''), COALESCE(guardian_phone, ''), COALESCE(avatar_url, ''),
	       role, status, trust_score, created_at, updated_at
	FROM users
	ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*model.User
	for rows.Next() {
		var u model.User
		var roleStr string
		if err := rows.Scan(
			&u.ID,
			&u.Name,
			&u.Email,
			&u.PasswordHash,
			&u.Phone,
			&u.Domicile,
			&u.BloodType,
			&u.Allergies,
			&u.MedicalNotes,
			&u.EmergencyHospital,
			&u.GuardianName,
			&u.GuardianPhone,
			&u.AvatarURL,
			&roleStr,
			&u.Status,
			&u.TrustScore,
			&u.CreatedAt,
			&u.UpdatedAt,
		); err != nil {
			return nil, err
		}
		u.Role = model.UserRole(roleStr)
		users = append(users, &u)
	}
	return users, rows.Err()
}

func (r *postgresUserRepository) Count(ctx context.Context) (int, error) {
	var count int
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&count)
	return count, err
}

func (r *postgresUserRepository) AddReputationLog(ctx context.Context, log *model.ReputationLog) error {
	query := `
	INSERT INTO reputation_logs (id, user_id, change_amount, current_score, reason, created_at)
	VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.ExecContext(ctx, query,
		log.ID,
		log.UserID,
		log.ChangeAmount,
		log.CurrentScore,
		log.Reason,
		log.CreatedAt,
	)
	return err
}

func (r *postgresUserRepository) GetReputationLogs(ctx context.Context, userID string) ([]*model.ReputationLog, error) {
	query := `
	SELECT id, user_id, change_amount, current_score, reason, created_at
	FROM reputation_logs
	WHERE user_id = $1
	ORDER BY created_at DESC
	LIMIT 25
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []*model.ReputationLog
	for rows.Next() {
		var l model.ReputationLog
		if err := rows.Scan(
			&l.ID,
			&l.UserID,
			&l.ChangeAmount,
			&l.CurrentScore,
			&l.Reason,
			&l.CreatedAt,
		); err != nil {
			return nil, err
		}
		logs = append(logs, &l)
	}
	return logs, rows.Err()
}

func (r *postgresUserRepository) UpdateTrustScore(ctx context.Context, userID string, newScore int) error {
	query := `UPDATE users SET trust_score = $1, updated_at = $2 WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, newScore, time.Now(), userID)
	return err
}

