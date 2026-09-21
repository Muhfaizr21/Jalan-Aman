package controller

import (
	"encoding/json"
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/middleware"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// SettingsController menangani endpoint konfigurasi sistem dan telemetri perangkat pengguna
type SettingsController struct {
	service service.SettingsService
}

// NewSettingsController membuat instance baru SettingsController
func NewSettingsController(svc service.SettingsService) *SettingsController {
	return &SettingsController{service: svc}
}

// Get menangani GET /api/v1/users/settings
func (c *SettingsController) Get(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	settings, err := c.service.GetSettings(r.Context(), claims.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil pengaturan sistem", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Pengaturan sistem berhasil diambil", settings)
}

// Update menangani PUT /api/v1/users/settings
func (c *SettingsController) Update(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	var req model.UpdateSettingsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	updated, err := c.service.UpdateSettings(r.Context(), claims.UserID, &req)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Gagal memperbarui pengaturan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Pengaturan sistem berhasil diperbarui", updated)
}

// Reset menangani POST /api/v1/users/settings/reset
func (c *SettingsController) Reset(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	resetted, err := c.service.ResetSettings(r.Context(), claims.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mereset pengaturan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Pengaturan sistem berhasil direset ke standar pabrik", resetted)
}
