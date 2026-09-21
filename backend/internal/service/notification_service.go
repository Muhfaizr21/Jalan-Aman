package service

import (
	"context"
	"fmt"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/repository"
)

// NotificationService adalah interface business logic untuk notifikasi keselamatan
type NotificationService interface {
	GetNotifications(ctx context.Context, userID string) ([]*model.Notification, int, error)
	MarkAsRead(ctx context.Context, id string, userID string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	CreateNotification(ctx context.Context, notif *model.Notification) error
}

type notificationService struct {
	repo repository.NotificationRepository
}

// NewNotificationService membuat instance baru NotificationService
func NewNotificationService(repo repository.NotificationRepository) NotificationService {
	return &notificationService{repo: repo}
}

// GetNotifications mengambil seluruh notifikasi dan menghitung jumlah unread
func (s *notificationService) GetNotifications(ctx context.Context, userID string) ([]*model.Notification, int, error) {
	list, err := s.repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, 0, err
	}

	unreadCount := 0
	for _, item := range list {
		if !item.IsRead {
			unreadCount++
		}
	}

	return list, unreadCount, nil
}

// MarkAsRead menandai satu notifikasi telah dibaca di database
func (s *notificationService) MarkAsRead(ctx context.Context, id string, userID string) error {
	if id == "" {
		return fmt.Errorf("id notifikasi tidak boleh kosong")
	}
	return s.repo.MarkAsRead(ctx, id, userID)
}

// MarkAllAsRead menandai seluruh notifikasi telah dibaca di database
func (s *notificationService) MarkAllAsRead(ctx context.Context, userID string) error {
	return s.repo.MarkAllAsRead(ctx, userID)
}

// CreateNotification menambahkan notifikasi baru ke database
func (s *notificationService) CreateNotification(ctx context.Context, notif *model.Notification) error {
	return s.repo.Create(ctx, notif)
}
