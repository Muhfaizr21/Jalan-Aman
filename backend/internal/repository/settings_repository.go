package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// SettingsRepository mendefinisikan kontrak akses data untuk pengaturan sistem pengguna di PostgreSQL
type SettingsRepository interface {
	AutoMigrateAndSeed(ctx context.Context) error
	GetByUserID(ctx context.Context, userID string) (*model.UserSettings, error)
	Upsert(ctx context.Context, s *model.UserSettings) error
	Reset(ctx context.Context, userID string) (*model.UserSettings, error)
}

type postgresSettingsRepository struct {
	db *sql.DB
}

// NewPostgresSettingsRepository membuat instance baru SettingsRepository
func NewPostgresSettingsRepository(db *sql.DB) SettingsRepository {
	return &postgresSettingsRepository{db: db}
}

func (r *postgresSettingsRepository) AutoMigrateAndSeed(ctx context.Context) error {
	queryDDL := `
	CREATE TABLE IF NOT EXISTS user_settings (
		user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
		anomaly_detection BOOLEAN NOT NULL DEFAULT true,
		auto_deadman_switch BOOLEAN NOT NULL DEFAULT true,
		shock_sensitivity VARCHAR(16) NOT NULL DEFAULT 'medium',
		end_to_end_encryption BOOLEAN NOT NULL DEFAULT true,
		obfuscate_feed_location BOOLEAN NOT NULL DEFAULT true,
		auto_purge_history BOOLEAN NOT NULL DEFAULT false,
		max_siren_volume BOOLEAN NOT NULL DEFAULT true,
		haptic_feedback BOOLEAN NOT NULL DEFAULT true,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);
	`
	if _, err := r.db.ExecContext(ctx, queryDDL); err != nil {
		return fmt.Errorf("gagal migrasi tabel user_settings: %w", err)
	}
	return nil
}

func (r *postgresSettingsRepository) GetByUserID(ctx context.Context, userID string) (*model.UserSettings, error) {
	query := `
		SELECT user_id, anomaly_detection, auto_deadman_switch, shock_sensitivity,
		       end_to_end_encryption, obfuscate_feed_location, auto_purge_history,
		       max_siren_volume, haptic_feedback, updated_at
		FROM user_settings
		WHERE user_id = $1
	`
	s := &model.UserSettings{}
	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&s.UserID,
		&s.AnomalyDetection,
		&s.AutoDeadmanSwitch,
		&s.ShockSensitivity,
		&s.EndToEndEncryption,
		&s.ObfuscateFeedLocation,
		&s.AutoPurgeHistory,
		&s.MaxSirenVolume,
		&s.HapticFeedback,
		&s.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		// Standar bawaan jika belum ada di database
		defaultSettings := &model.UserSettings{
			UserID:                userID,
			AnomalyDetection:      true,
			AutoDeadmanSwitch:     true,
			ShockSensitivity:      "medium",
			EndToEndEncryption:    true,
			ObfuscateFeedLocation: true,
			AutoPurgeHistory:      false,
			MaxSirenVolume:        true,
			HapticFeedback:        true,
			UpdatedAt:             time.Now(),
		}
		_ = r.Upsert(ctx, defaultSettings)
		return defaultSettings, nil
	}
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil pengaturan pengguna: %w", err)
	}
	return s, nil
}

func (r *postgresSettingsRepository) Upsert(ctx context.Context, s *model.UserSettings) error {
	query := `
		INSERT INTO user_settings (
			user_id, anomaly_detection, auto_deadman_switch, shock_sensitivity,
			end_to_end_encryption, obfuscate_feed_location, auto_purge_history,
			max_siren_volume, haptic_feedback, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		ON CONFLICT (user_id) DO UPDATE SET
			anomaly_detection = EXCLUDED.anomaly_detection,
			auto_deadman_switch = EXCLUDED.auto_deadman_switch,
			shock_sensitivity = EXCLUDED.shock_sensitivity,
			end_to_end_encryption = EXCLUDED.end_to_end_encryption,
			obfuscate_feed_location = EXCLUDED.obfuscate_feed_location,
			auto_purge_history = EXCLUDED.auto_purge_history,
			max_siren_volume = EXCLUDED.max_siren_volume,
			haptic_feedback = EXCLUDED.haptic_feedback,
			updated_at = EXCLUDED.updated_at
	`
	s.UpdatedAt = time.Now()
	_, err := r.db.ExecContext(ctx, query,
		s.UserID,
		s.AnomalyDetection,
		s.AutoDeadmanSwitch,
		s.ShockSensitivity,
		s.EndToEndEncryption,
		s.ObfuscateFeedLocation,
		s.AutoPurgeHistory,
		s.MaxSirenVolume,
		s.HapticFeedback,
		s.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("gagal menyimpan pengaturan pengguna: %w", err)
	}
	return nil
}

func (r *postgresSettingsRepository) Reset(ctx context.Context, userID string) (*model.UserSettings, error) {
	defaults := &model.UserSettings{
		UserID:                userID,
		AnomalyDetection:      true,
		AutoDeadmanSwitch:     true,
		ShockSensitivity:      "medium",
		EndToEndEncryption:    true,
		ObfuscateFeedLocation: true,
		AutoPurgeHistory:      false,
		MaxSirenVolume:        true,
		HapticFeedback:        true,
		UpdatedAt:             time.Now(),
	}
	if err := r.Upsert(ctx, defaults); err != nil {
		return nil, err
	}
	return defaults, nil
}
