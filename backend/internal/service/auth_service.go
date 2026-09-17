package service

import (
	"context"
	"errors"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/auth"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

// AuthService adalah interface untuk logika bisnis otentikasi
type AuthService interface {
	Login(ctx context.Context, req *model.LoginRequest) (*model.AuthResponse, error)
	GetProfile(ctx context.Context, userID string) (*model.User, error)
}

type authService struct {
	userRepo       repository.UserRepository
	jwtSecret      string
	jwtExpireHours int
}

// NewAuthService membuat instance baru AuthService
func NewAuthService(repo repository.UserRepository, jwtSecret string, jwtExpireHours int) AuthService {
	return &authService{
		userRepo:       repo,
		jwtSecret:      jwtSecret,
		jwtExpireHours: jwtExpireHours,
	}
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
