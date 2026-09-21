package model

import (
	"errors"
	"strings"
	"time"
)

// UserSettings merepresentasikan konfigurasi sistem keselamatan & telemetri pengguna di PostgreSQL
type UserSettings struct {
	UserID                string    `json:"user_id"`
	AnomalyDetection      bool      `json:"anomaly_detection"`
	AutoDeadmanSwitch     bool      `json:"auto_deadman_switch"`
	ShockSensitivity      string    `json:"shock_sensitivity"` // 'low', 'medium', 'high'
	EndToEndEncryption    bool      `json:"end_to_end_encryption"`
	ObfuscateFeedLocation bool      `json:"obfuscate_feed_location"`
	AutoPurgeHistory      bool      `json:"auto_purge_history"`
	MaxSirenVolume        bool      `json:"max_siren_volume"`
	HapticFeedback        bool      `json:"haptic_feedback"`
	UpdatedAt             time.Time `json:"updated_at"`
}

// UpdateSettingsRequest adalah DTO request body untuk mengubah pengaturan sistem pengguna
type UpdateSettingsRequest struct {
	AnomalyDetection      *bool   `json:"anomaly_detection"`
	AutoDeadmanSwitch     *bool   `json:"auto_deadman_switch"`
	ShockSensitivity      *string `json:"shock_sensitivity"`
	EndToEndEncryption    *bool   `json:"end_to_end_encryption"`
	ObfuscateFeedLocation *bool   `json:"obfuscate_feed_location"`
	AutoPurgeHistory      *bool   `json:"auto_purge_history"`
	MaxSirenVolume        *bool   `json:"max_siren_volume"`
	HapticFeedback        *bool   `json:"haptic_feedback"`
}

// Validate memvalidasi nilai dari UpdateSettingsRequest
func (r *UpdateSettingsRequest) Validate() error {
	if r.ShockSensitivity != nil {
		val := strings.ToLower(strings.TrimSpace(*r.ShockSensitivity))
		if val != "low" && val != "medium" && val != "high" {
			return errors.New("sensitivitas guncangan harus bernilai 'low', 'medium', atau 'high'")
		}
	}
	return nil
}
