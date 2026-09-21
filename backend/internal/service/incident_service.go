package service

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

// IncidentService adalah interface layer bisnis/usecase (SOLID: Dependency Inversion)
type IncidentService interface {
	ReportIncident(ctx context.Context, incident *model.Incident) (*model.Incident, error)
	GetIncidents(ctx context.Context) ([]*model.Incident, error)
	GetIncidentByID(ctx context.Context, id string) (*model.Incident, error)
	UpdateStatus(ctx context.Context, id string, status model.IncidentStatus) (*model.Incident, error)
}

// incidentService adalah implementasi konkrit IncidentService
type incidentService struct {
	repo         repository.IncidentRepository
	userRepo     repository.UserRepository
	notifRepo    repository.NotificationRepository
	settingsRepo repository.SettingsRepository
}

// NewIncidentService menginjeksi repository interface ke service (Dependency Injection)
func NewIncidentService(
	repo repository.IncidentRepository,
	userRepo repository.UserRepository,
	notifRepo repository.NotificationRepository,
	settingsRepo repository.SettingsRepository,
) IncidentService {
	return &incidentService{
		repo:         repo,
		userRepo:     userRepo,
		notifRepo:    notifRepo,
		settingsRepo: settingsRepo,
	}
}

// obfuscateCoordinatesServer mengacak koordinat latitude dan longitude radius 75-100 meter di level server
func obfuscateCoordinatesServer(lat, lng float64) (float64, float64) {
	radiusMeters := 75.0 + rand.Float64()*25.0
	angle := rand.Float64() * 2 * math.Pi

	deltaLat := (radiusMeters * math.Cos(angle)) / 111320.0
	deltaLng := (radiusMeters * math.Sin(angle)) / (111320.0 * math.Cos(lat*math.Pi/180.0))

	return math.Round((lat+deltaLat)*1000000) / 1000000, math.Round((lng+deltaLng)*1000000) / 1000000
}

func (s *incidentService) ReportIncident(ctx context.Context, incident *model.Incident) (*model.Incident, error) {
	if incident.ID == "" {
		incident.ID = fmt.Sprintf("inc_%d", time.Now().UnixNano())
	}
	if incident.Status == "" {
		incident.Status = model.StatusVerified
	}
	if incident.Severity == "" {
		incident.Severity = model.SeverityModerate
	}
	if incident.CreatedAt.IsZero() {
		incident.CreatedAt = time.Now()
	}
	if incident.UpdatedAt.IsZero() {
		incident.UpdatedAt = time.Now()
	}

	// 1. Penegakan Privasi: Periksa apakah pelapor menyalakan opsi "Samarkan Lokasi di Feed Komunitas"
	if s.settingsRepo != nil && incident.ReporterID != "" && incident.ReporterID != "system_seed" {
		if userSettings, err := s.settingsRepo.GetByUserID(ctx, incident.ReporterID); err == nil && userSettings != nil {
			if userSettings.ObfuscateFeedLocation {
				fuzzedLat, fuzzedLng := obfuscateCoordinatesServer(incident.Latitude, incident.Longitude)
				incident.Latitude = fuzzedLat
				incident.Longitude = fuzzedLng
			}
		}
	}

	if err := incident.Validate(); err != nil {
		return nil, err
	}
	if err := s.repo.Create(ctx, incident); err != nil {
		return nil, err
	}

	// Reward reporter jika user terdaftar
	if s.userRepo != nil && incident.ReporterID != "" && incident.ReporterID != "system_seed" {
		if user, err := s.userRepo.FindByID(ctx, incident.ReporterID); err == nil && user != nil {
			newScore := user.TrustScore + 5
			if newScore > 100 {
				newScore = 100
			}
			_ = s.userRepo.UpdateTrustScore(ctx, user.ID, newScore)
			_ = s.userRepo.AddReputationLog(ctx, &model.ReputationLog{
				ID:           fmt.Sprintf("rep_%d", time.Now().UnixNano()),
				UserID:       user.ID,
				ChangeAmount: 5,
				CurrentScore: newScore,
				Reason:       fmt.Sprintf("Pelaporan kondisi jalan: %s", incident.Title),
				CreatedAt:    time.Now(),
			})
		}
	}

	// Buat notifikasi bahaya spasial otomatis di PostgreSQL
	if s.notifRepo != nil {
		sev := "warning"
		if incident.Severity == model.SeverityHigh || incident.Severity == model.SeverityCritical {
			sev = "urgent"
		}
		_ = s.notifRepo.Create(ctx, &model.Notification{
			ID:          fmt.Sprintf("notif_%d", time.Now().UnixNano()),
			UserID:      "broadcast",
			Title:       fmt.Sprintf("Peringatan Bahaya Baru: %s", incident.Title),
			Message:     fmt.Sprintf("%s. Lokasi: %s.", incident.Description, incident.Address),
			Category:    "spatial",
			Severity:    sev,
			ActionType:  "map",
			ActionLabel: "Lihat di Peta",
			IsRead:      false,
			CreatedAt:   time.Now(),
		})
	}

	return incident, nil
}

func (s *incidentService) GetIncidents(ctx context.Context) ([]*model.Incident, error) {
	return s.repo.FindAll(ctx)
}

func (s *incidentService) GetIncidentByID(ctx context.Context, id string) (*model.Incident, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *incidentService) UpdateStatus(ctx context.Context, id string, status model.IncidentStatus) (*model.Incident, error) {
	existing, _ := s.repo.FindByID(ctx, id)

	if err := s.repo.UpdateStatus(ctx, id, status); err != nil {
		return nil, err
	}

	// Update user reputation on admin verification / rejection
	if s.userRepo != nil && existing != nil && existing.ReporterID != "" && existing.ReporterID != "system_seed" {
		if user, err := s.userRepo.FindByID(ctx, existing.ReporterID); err == nil && user != nil {
			delta := 0
			reason := ""
			if status == model.StatusVerified {
				delta = 10
				reason = fmt.Sprintf("Laporan insiden diverifikasi petugas (%s)", existing.Title)
			} else if status == model.StatusRejected {
				delta = -15
				reason = fmt.Sprintf("Laporan insiden tidak valid / ditolak (%s)", existing.Title)
			}

			if delta != 0 {
				newScore := user.TrustScore + delta
				if newScore > 100 {
					newScore = 100
				} else if newScore < 0 {
					newScore = 0
				}
				_ = s.userRepo.UpdateTrustScore(ctx, user.ID, newScore)
				_ = s.userRepo.AddReputationLog(ctx, &model.ReputationLog{
					ID:           fmt.Sprintf("rep_%d", time.Now().UnixNano()),
					UserID:       user.ID,
					ChangeAmount: delta,
					CurrentScore: newScore,
					Reason:       reason,
					CreatedAt:    time.Now(),
				})
			}
		}
	}

	return s.repo.FindByID(ctx, id)
}


