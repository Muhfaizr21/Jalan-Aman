package service

import (
	"context"
	"fmt"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

// ShelterService adalah interface logika bisnis Safe Haven
type ShelterService interface {
	GetAllShelters(ctx context.Context) ([]*model.Shelter, error)
	GetShelterByID(ctx context.Context, id string) (*model.Shelter, error)
	CreateShelter(ctx context.Context, s *model.Shelter) (*model.Shelter, error)
}

type shelterService struct {
	repo repository.ShelterRepository
}

// NewShelterService membuat instance baru ShelterService
func NewShelterService(repo repository.ShelterRepository) ShelterService {
	return &shelterService{repo: repo}
}

func (s *shelterService) GetAllShelters(ctx context.Context) ([]*model.Shelter, error) {
	return s.repo.FindAll(ctx)
}

func (s *shelterService) GetShelterByID(ctx context.Context, id string) (*model.Shelter, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *shelterService) CreateShelter(ctx context.Context, shelter *model.Shelter) (*model.Shelter, error) {
	if err := shelter.Validate(); err != nil {
		return nil, err
	}

	if shelter.ID == "" {
		shelter.ID = fmt.Sprintf("sh_%d", time.Now().UnixNano())
	}
	shelter.IsActive = true
	shelter.CreatedAt = time.Now()
	shelter.UpdatedAt = time.Now()

	if err := s.repo.Create(ctx, shelter); err != nil {
		return nil, err
	}

	return shelter, nil
}
