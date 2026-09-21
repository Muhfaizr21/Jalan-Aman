package model

import "time"

// ReputationLog merepresentasikan riwayat perubahan skor reputasi pengguna
type ReputationLog struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	ChangeAmount int       `json:"change_amount"`
	CurrentScore int       `json:"current_score"`
	Reason       string    `json:"reason"`
	CreatedAt    time.Time `json:"created_at"`
}

// UserReputationResponse adalah DTO untuk respon endpoint reputasi pengguna
type UserReputationResponse struct {
	UserID               string           `json:"user_id"`
	TrustScore           int              `json:"trust_score"`
	TierLabel            string           `json:"tier_label"`
	TierStatus           string           `json:"tier_status"`
	TierColor            string           `json:"tier_color"`
	Description          string           `json:"description"`
	Benefits             []string         `json:"benefits"`
	SosReadinessRate     float64          `json:"sos_readiness_rate"`
	VerifiedReportsCount int              `json:"verified_reports_count"`
	ViolationsCount      int              `json:"violations_count"`
	History              []*ReputationLog `json:"history"`
}
