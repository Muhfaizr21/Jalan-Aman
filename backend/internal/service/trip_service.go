package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/crypto"
)

// TripService mengelola siklus perjalanan dan penegakan enkripsi & auto-purge
type TripService interface {
	StartTrip(ctx context.Context, userID string, req *model.StartTripRequest) (*model.Trip, error)
	RecordTelemetry(ctx context.Context, userID string, req *model.RecordTelemetryRequest) (*model.TripTelemetry, error)
	CompleteTrip(ctx context.Context, userID string, tripID string) (*model.Trip, error)
	GetActiveTrip(ctx context.Context, userID string) (*model.Trip, error)
	GetHistory(ctx context.Context, userID string) ([]*model.Trip, error)
}

type tripService struct {
	tripRepo      repository.TripRepository
	settingsRepo  repository.SettingsRepository
	encryptionKey string
}

// NewTripService membuat instance TripService baru
func NewTripService(tripRepo repository.TripRepository, settingsRepo repository.SettingsRepository, encryptionKey string) TripService {
	return &tripService{
		tripRepo:      tripRepo,
		settingsRepo:  settingsRepo,
		encryptionKey: encryptionKey,
	}
}

func (s *tripService) StartTrip(ctx context.Context, userID string, req *model.StartTripRequest) (*model.Trip, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	// Periksa preferensi enkripsi pengguna dari database PostgreSQL
	isEncrypted := false
	if s.settingsRepo != nil {
		if st, err := s.settingsRepo.GetByUserID(ctx, userID); err == nil && st != nil {
			isEncrypted = st.EndToEndEncryption
		}
	}

	trip := &model.Trip{
		ID:              fmt.Sprintf("trip_%d", time.Now().UnixNano()),
		UserID:          userID,
		OriginName:      req.OriginName,
		DestinationName: req.DestinationName,
		OriginLat:       req.OriginLat,
		OriginLng:       req.OriginLng,
		DestLat:         req.DestLat,
		DestLng:         req.DestLng,
		Status:          model.TripStatusActive,
		IsEncrypted:     isEncrypted,
		StartTime:       time.Now(),
		CreatedAt:       time.Now(),
	}

	if err := s.tripRepo.Create(ctx, trip); err != nil {
		return nil, fmt.Errorf("gagal membuat sesi perjalanan: %w", err)
	}

	return trip, nil
}

func (s *tripService) RecordTelemetry(ctx context.Context, userID string, req *model.RecordTelemetryRequest) (*model.TripTelemetry, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	// 1. Cek apakah user mengaktifkan enkripsi rute End-to-End (Mil-Grade 256)
	isEncrypted := false
	if s.settingsRepo != nil {
		if st, err := s.settingsRepo.GetByUserID(ctx, userID); err == nil && st != nil {
			isEncrypted = st.EndToEndEncryption
		}
	}

	var encryptedPayload string
	if isEncrypted {
		rawCoords := fmt.Sprintf(`{"lat":%.6f,"lng":%.6f,"speed":%.2f,"timestamp":"%s"}`,
			req.Latitude, req.Longitude, req.SpeedKmh, time.Now().Format(time.RFC3339))

		cipher, err := crypto.EncryptAES256GCM(rawCoords, s.encryptionKey)
		if err != nil {
			return nil, fmt.Errorf("gagal mengenkripsi telemetri rute: %w", err)
		}
		encryptedPayload = cipher
	}

	telemetry := &model.TripTelemetry{
		ID:               fmt.Sprintf("tel_%d", time.Now().UnixNano()),
		TripID:           req.TripID,
		UserID:           userID,
		Latitude:         req.Latitude,
		Longitude:        req.Longitude,
		EncryptedPayload: encryptedPayload,
		SpeedKmh:         req.SpeedKmh,
		RecordedAt:       time.Now(),
	}

	if err := s.tripRepo.AddTelemetry(ctx, telemetry); err != nil {
		return nil, fmt.Errorf("gagal menyimpan telemetri: %w", err)
	}

	return telemetry, nil
}

func (s *tripService) CompleteTrip(ctx context.Context, userID string, tripID string) (*model.Trip, error) {
	if tripID == "" {
		return nil, errors.New("trip_id wajib diisi")
	}

	now := time.Now()
	if err := s.tripRepo.CompleteTrip(ctx, tripID, now); err != nil {
		return nil, fmt.Errorf("gagal menandai perjalanan selesai: %w", err)
	}

	// 2. Cek apakah pengguna mengaktifkan "Hapus Riwayat Perjalanan Otomatis (24 Jam Pasca-Selamat)"
	if s.settingsRepo != nil {
		if st, err := s.settingsRepo.GetByUserID(ctx, userID); err == nil && st != nil {
			if st.AutoPurgeHistory {
				// Otomatis bersihkan rekam jejak GPS yang sudah selesai lebih dari 24 jam
				_, _ = s.tripRepo.PurgeOldTrips(ctx, userID, 24*time.Hour)
			}
		}
	}

	return s.tripRepo.GetByID(ctx, tripID)
}

func (s *tripService) GetActiveTrip(ctx context.Context, userID string) (*model.Trip, error) {
	return s.tripRepo.GetActiveTrip(ctx, userID)
}

func (s *tripService) GetHistory(ctx context.Context, userID string) ([]*model.Trip, error) {
	return s.tripRepo.GetHistory(ctx, userID)
}
