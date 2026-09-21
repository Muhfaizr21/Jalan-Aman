package service

import (
	"context"
	"fmt"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

// SettingsService mendefinisikan logika bisnis pengelolaan pengaturan sistem keselamatan pengguna
type SettingsService interface {
	GetSettings(ctx context.Context, userID string) (*model.UserSettings, error)
	UpdateSettings(ctx context.Context, userID string, req *model.UpdateSettingsRequest) (*model.UserSettings, error)
	ResetSettings(ctx context.Context, userID string) (*model.UserSettings, error)
}

type settingsService struct {
	repo repository.SettingsRepository
}

// NewSettingsService membuat instance baru SettingsService
func NewSettingsService(repo repository.SettingsRepository) SettingsService {
	return &settingsService{repo: repo}
}

func (s *settingsService) GetSettings(ctx context.Context, userID string) (*model.UserSettings, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID tidak valid")
	}
	return s.repo.GetByUserID(ctx, userID)
}

func (s *settingsService) UpdateSettings(ctx context.Context, userID string, req *model.UpdateSettingsRequest) (*model.UserSettings, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID tidak valid")
	}
	if err := req.Validate(); err != nil {
		return nil, err
	}

	current, err := s.repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if req.AnomalyDetection != nil {
		current.AnomalyDetection = *req.AnomalyDetection
	}
	if req.AutoDeadmanSwitch != nil {
		current.AutoDeadmanSwitch = *req.AutoDeadmanSwitch
	}
	if req.ShockSensitivity != nil {
		current.ShockSensitivity = *req.ShockSensitivity
	}
	if req.EndToEndEncryption != nil {
		current.EndToEndEncryption = *req.EndToEndEncryption
	}
	if req.ObfuscateFeedLocation != nil {
		current.ObfuscateFeedLocation = *req.ObfuscateFeedLocation
	}
	if req.AutoPurgeHistory != nil {
		current.AutoPurgeHistory = *req.AutoPurgeHistory
	}
	if req.MaxSirenVolume != nil {
		current.MaxSirenVolume = *req.MaxSirenVolume
	}
	if req.HapticFeedback != nil {
		current.HapticFeedback = *req.HapticFeedback
	}
	current.UpdatedAt = time.Now()

	if err := s.repo.Upsert(ctx, current); err != nil {
		return nil, err
	}
	return current, nil
}

func (s *settingsService) ResetSettings(ctx context.Context, userID string) (*model.UserSettings, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID tidak valid")
	}
	return s.repo.Reset(ctx, userID)
}
