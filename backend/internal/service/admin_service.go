package service

import (
	"context"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

// AdminService adalah interface logika bisnis untuk Command Center Superadmin (SOLID: Interface Segregation)
type AdminService interface {
	GetDashboardStats(ctx context.Context) (*model.DashboardStats, error)
	GetAllUsers(ctx context.Context) ([]*model.User, error)
}

type adminService struct {
	userRepo     repository.UserRepository
	incidentRepo repository.IncidentRepository
	shelterRepo  repository.ShelterRepository
}

// NewAdminService membuat instance baru AdminService dengan injeksi dependensi repositori
func NewAdminService(
	userRepo repository.UserRepository,
	incidentRepo repository.IncidentRepository,
	shelterRepo repository.ShelterRepository,
) AdminService {
	return &adminService{
		userRepo:     userRepo,
		incidentRepo: incidentRepo,
		shelterRepo:  shelterRepo,
	}
}

func (s *adminService) GetDashboardStats(ctx context.Context) (*model.DashboardStats, error) {
	totalUsers, err := s.userRepo.Count(ctx)
	if err != nil {
		return nil, err
	}

	totalInc, verifiedInc, pendingInc, err := s.incidentRepo.CountStats(ctx)
	if err != nil {
		return nil, err
	}

	totalShelters, err := s.shelterRepo.Count(ctx)
	if err != nil {
		return nil, err
	}

	return &model.DashboardStats{
		TotalUsers:        totalUsers,
		TotalIncidents:    totalInc,
		VerifiedIncidents: verifiedInc,
		PendingIncidents:  pendingInc,
		TotalShelters:     totalShelters,
	}, nil
}

func (s *adminService) GetAllUsers(ctx context.Context) ([]*model.User, error) {
	return s.userRepo.FindAll(ctx)
}
