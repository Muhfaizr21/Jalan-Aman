package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/auth"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

// AuthService adalah interface untuk logika bisnis otentikasi dan manajemen profil pengguna
type AuthService interface {
	Login(ctx context.Context, req *model.LoginRequest) (*model.AuthResponse, error)
	Register(ctx context.Context, req *model.RegisterRequest) (*model.AuthResponse, error)
	GetProfile(ctx context.Context, userID string) (*model.User, error)
	UpdateProfile(ctx context.Context, userID string, req *model.UpdateProfileRequest) (*model.User, error)
	DeleteAccount(ctx context.Context, userID string) error
	GetUserReputation(ctx context.Context, userID string) (*model.UserReputationResponse, error)
	AdjustTrustScore(ctx context.Context, userID string, delta int, reason string) error
}

type authService struct {
	userRepo       repository.UserRepository
	notifRepo      repository.NotificationRepository
	jwtSecret      string
	jwtExpireHours int
}

// NewAuthService membuat instance baru AuthService
func NewAuthService(repo repository.UserRepository, notifRepo repository.NotificationRepository, jwtSecret string, jwtExpireHours int) AuthService {
	return &authService{
		userRepo:       repo,
		notifRepo:      notifRepo,
		jwtSecret:      jwtSecret,
		jwtExpireHours: jwtExpireHours,
	}
}

func (s *authService) Register(ctx context.Context, req *model.RegisterRequest) (*model.AuthResponse, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	existing, _ := s.userRepo.FindByEmail(ctx, req.Email)
	if existing != nil {
		return nil, errors.New("email sudah terdaftar dalam sistem")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("gagal memproses enkripsi kata sandi")
	}

	newUser := &model.User{
		ID:                fmt.Sprintf("usr_%d", time.Now().UnixNano()),
		Name:              req.Name,
		Email:             req.Email,
		PasswordHash:      string(hash),
		Phone:             req.Phone,
		Domicile:          "Indramayu",
		BloodType:         "B+",
		Allergies:         "",
		MedicalNotes:      "",
		EmergencyHospital: "RSUD Indramayu",
		GuardianName:      "",
		GuardianPhone:     "",
		AvatarURL:         "",
		Role:              model.RoleUser,
		Status:            "Active",
		TrustScore:        100,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	if err := s.userRepo.Create(ctx, newUser); err != nil {
		return nil, errors.New("gagal menyimpan data pengguna ke database")
	}

	token, expiresAt, err := auth.GenerateToken(newUser, s.jwtSecret, s.jwtExpireHours)
	if err != nil {
		return nil, errors.New("gagal menerbitkan token sesi")
	}

	return &model.AuthResponse{
		Token:     token,
		User:      *newUser,
		ExpiresAt: expiresAt,
	}, nil
}

func (s *authService) Login(ctx context.Context, req *model.LoginRequest) (*model.AuthResponse, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("email atau password salah")
	}

	token, expiresAt, err := auth.GenerateToken(user, s.jwtSecret, s.jwtExpireHours)
	if err != nil {
		return nil, errors.New("gagal menerbitkan token sesi")
	}

	return &model.AuthResponse{
		Token:     token,
		User:      *user,
		ExpiresAt: expiresAt,
	}, nil
}

func (s *authService) GetProfile(ctx context.Context, userID string) (*model.User, error) {
	return s.userRepo.FindByID(ctx, userID)
}

func (s *authService) UpdateProfile(ctx context.Context, userID string, req *model.UpdateProfileRequest) (*model.User, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("pengguna tidak ditemukan")
	}

	oldGuardianName := user.GuardianName
	user.Name = req.Name
	user.Phone = req.Phone
	user.Domicile = req.Domicile
	user.BloodType = req.BloodType
	user.Allergies = req.Allergies
	user.MedicalNotes = req.MedicalNotes
	user.EmergencyHospital = req.EmergencyHospital
	user.GuardianName = req.GuardianName
	user.GuardianPhone = req.GuardianPhone
	if req.AvatarURL != "" {
		user.AvatarURL = req.AvatarURL
	}
	user.UpdatedAt = time.Now()

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, fmt.Errorf("gagal memperbarui profil: %w", err)
	}

	// Trigger real-time persistent notification for Guardian Link/Unlink
	if s.notifRepo != nil {
		if req.GuardianName != "" && req.GuardianName != oldGuardianName {
			_ = s.notifRepo.Create(ctx, &model.Notification{
				ID:          fmt.Sprintf("notif_g_%d", time.Now().UnixNano()),
				UserID:      user.ID,
				Title:       "Pengawal Utama Terhubung",
				Message:     fmt.Sprintf("%s (%s) berhasil dikaitkan ke Lingkaran Pengawal Anda di database JalanAman.", req.GuardianName, req.GuardianPhone),
				Category:    "guardian",
				Severity:    "info",
				ActionType:  "track",
				ActionLabel: "Lihat Pengawal",
				IsRead:      false,
				CreatedAt:   time.Now(),
			})
		} else if oldGuardianName != "" && req.GuardianName == "" {
			_ = s.notifRepo.Create(ctx, &model.Notification{
				ID:          fmt.Sprintf("notif_g_%d", time.Now().UnixNano()),
				UserID:      user.ID,
				Title:       "Pengawal Dilepas",
				Message:     fmt.Sprintf("Kontak pengawal %s telah dilepas dari Lingkaran Pengawal Anda.", oldGuardianName),
				Category:    "guardian",
				Severity:    "warning",
				ActionType:  "track",
				ActionLabel: "Atur Pengawal",
				IsRead:      false,
				CreatedAt:   time.Now(),
			})
		}
	}

	return user, nil
}

func (s *authService) DeleteAccount(ctx context.Context, userID string) error {
	return s.userRepo.Delete(ctx, userID)
}

func (s *authService) GetUserReputation(ctx context.Context, userID string) (*model.UserReputationResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("pengguna tidak ditemukan")
	}

	logs, err := s.userRepo.GetReputationLogs(ctx, userID)
	if err != nil {
		logs = []*model.ReputationLog{}
	}

	// Dynamic readiness score
	readiness := 70.0
	if user.Phone != "" {
		readiness += 10.0
	}
	if user.GuardianName != "" {
		readiness += 10.0
	}
	if user.BloodType != "" {
		readiness += 10.0
	}
	if readiness > 100.0 {
		readiness = 100.0
	}

	score := user.TrustScore
	var tierLabel, tierStatus, tierColor, description string
	var benefits []string

	if score >= 85 {
		tierLabel = "Penjaga Lingkungan (Tier Emas)"
		tierStatus = "Sangat Terpercaya"
		tierColor = "#416900"
		description = "Laporan bahaya Anda memiliki bobot tertinggi dan langsung memengaruhi rute aman AI JalanAman."
		benefits = []string{
			"Laporan insiden bahaya otomatis tayang tanpa penundaan",
			"Kalkulasi rute navigasi prioritas dengan tingkat akurasi maksimal",
			"Hak suara penuh dalam konfirmasi titik bahaya komunitas",
		}
	} else if score >= 70 {
		tierLabel = "Warga Terpercaya (Tier Perak)"
		tierStatus = "Terpercaya"
		tierColor = "#0284C7"
		description = "Laporan insiden Anda mendapat prioritas peninjauan otomatis cepat oleh sistem analitik AI JalanAman."
		benefits = []string{
			"Prioritas peninjauan otomatis oleh sistem AI",
			"Lencana warga terpercaya aktif pada setiap laporan",
			"Peringatan dini zona rawan berjarak 250 meter",
		}
	} else {
		tierLabel = "Warga Baru (Tier Perunggu)"
		tierStatus = "Perlu Verifikasi"
		tierColor = "#DC2626"
		description = "Laporan insiden Anda memerlukan verifikasi ganda dari tim relawan sebelum diteruskan ke peta warga."
		benefits = []string{
			"Akses navigasi rute aman berlampu",
			"Tombol darurat SOS terhubung pos terdekat 24 jam",
		}
	}

	return &model.UserReputationResponse{
		UserID:               user.ID,
		TrustScore:           score,
		TierLabel:            tierLabel,
		TierStatus:           tierStatus,
		TierColor:            tierColor,
		Description:          description,
		Benefits:             benefits,
		SosReadinessRate:     readiness,
		VerifiedReportsCount: len(logs),
		ViolationsCount:      0,
		History:              logs,
	}, nil
}

func (s *authService) AdjustTrustScore(ctx context.Context, userID string, delta int, reason string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	newScore := user.TrustScore + delta
	if newScore > 100 {
		newScore = 100
	} else if newScore < 0 {
		newScore = 0
	}

	if err := s.userRepo.UpdateTrustScore(ctx, userID, newScore); err != nil {
		return err
	}

	logEntry := &model.ReputationLog{
		ID:           fmt.Sprintf("rep_%d", time.Now().UnixNano()),
		UserID:       userID,
		ChangeAmount: delta,
		CurrentScore: newScore,
		Reason:       reason,
		CreatedAt:    time.Now(),
	}

	return s.userRepo.AddReputationLog(ctx, logEntry)
}

