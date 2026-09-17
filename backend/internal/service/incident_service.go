package service

import (
	"context"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

// IncidentService adalah interface layer bisnis/usecase (SOLID: Dependency Inversion)
type IncidentService interface {
	ReportIncident(ctx context.Context, incident *model.Incident) (*model.Incident, error)
	GetIncidents(ctx context.Context) ([]*model.Incident, error)
	GetIncidentByID(ctx context.Context, id string) (*model.Incident, error)
}

// incidentService adalah implementasi konkrit IncidentService
type incidentService struct {
	repo repository.IncidentRepository
}

// NewIncidentService menginjeksi repository interface ke service (Dependency Injection)
func NewIncidentService(repo repository.IncidentRepository) IncidentService {
	return &incidentService{repo: repo}
}

func (s *incidentService) ReportIncident(ctx context.Context, incident *model.Incident) (*model.Incident, error) {
	if err := incident.Validate(); err != nil {
		return nil, err
	}
	if err := s.repo.Create(ctx, incident); err != nil {
		return nil, err
	}
	return incident, nil
}

func (s *incidentService) GetIncidents(ctx context.Context) ([]*model.Incident, error) {
	return s.repo.FindAll(ctx)
}

func (s *incidentService) GetIncidentByID(ctx context.Context, id string) (*model.Incident, error) {
	return s.repo.FindByID(ctx, id)
}
