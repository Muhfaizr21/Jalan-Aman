package controller

import (
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/middleware"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// NotificationController menangani HTTP request untuk notifikasi
type NotificationController struct {
	service service.NotificationService
}

// NewNotificationController membuat instance baru NotificationController
func NewNotificationController(svc service.NotificationService) *NotificationController {
	return &NotificationController{service: svc}
}

// GetAll menangani GET /api/v1/notifications
func (c *NotificationController) GetAll(w http.ResponseWriter, r *http.Request) {
	userID := ""
	if claims, ok := middleware.GetClaimsFromContext(r.Context()); ok && claims != nil {
		userID = claims.UserID
	}

	list, unread, err := c.service.GetNotifications(r.Context(), userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data notifikasi", err.Error())
		return
	}

	res := model.NotificationListResponse{
		Notifications: list,
		UnreadCount:   unread,
		TotalCount:    len(list),
	}
	response.Success(w, http.StatusOK, "Daftar notifikasi berhasil diambil", res)
}

// MarkAsRead menangani PUT /api/v1/notifications/{id}/read
func (c *NotificationController) MarkAsRead(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.Error(w, http.StatusBadRequest, "ID notifikasi wajib disertakan")
		return
	}

	userID := ""
	if claims, ok := middleware.GetClaimsFromContext(r.Context()); ok && claims != nil {
		userID = claims.UserID
	}

	if err := c.service.MarkAsRead(r.Context(), id, userID); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menandai notifikasi dibaca", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Notifikasi berhasil ditandai telah dibaca", map[string]interface{}{
		"id":      id,
		"is_read": true,
	})
}

// MarkAllAsRead menangani PUT /api/v1/notifications/read-all
func (c *NotificationController) MarkAllAsRead(w http.ResponseWriter, r *http.Request) {
	userID := ""
	if claims, ok := middleware.GetClaimsFromContext(r.Context()); ok && claims != nil {
		userID = claims.UserID
	}

	if err := c.service.MarkAllAsRead(r.Context(), userID); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menandai seluruh notifikasi", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Seluruh notifikasi berhasil ditandai telah dibaca", map[string]interface{}{
		"is_read_all": true,
	})
}
