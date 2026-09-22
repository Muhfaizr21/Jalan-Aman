package controller

import (
	"encoding/json"
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/middleware"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// TripController menangani endpoint siklus perjalanan dan privasi telemetri
type TripController struct {
	service service.TripService
}

// NewTripController membuat instance TripController baru
func NewTripController(svc service.TripService) *TripController {
	return &TripController{service: svc}
}

// StartTrip menangani POST /api/v1/trips/start
func (c *TripController) StartTrip(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	var req model.StartTripRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	trip, err := c.service.StartTrip(r.Context(), claims.UserID, &req)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Gagal memulai sesi perjalanan", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Sesi proteksi perjalanan berhasil diaktifkan", trip)
}

// RecordTelemetry menangani POST /api/v1/trips/telemetry
func (c *TripController) RecordTelemetry(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	var req model.RecordTelemetryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	telemetry, err := c.service.RecordTelemetry(r.Context(), claims.UserID, &req)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Gagal menyimpan telemetri rute", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Telemetri rute berhasil diperbarui", telemetry)
}

// CompleteTrip menangani POST /api/v1/trips/complete
func (c *TripController) CompleteTrip(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	var req struct {
		TripID string `json:"trip_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	trip, err := c.service.CompleteTrip(r.Context(), claims.UserID, req.TripID)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Gagal menyelesaikan perjalanan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Status perjalanan dinyatakan selamat (completed)", trip)
}

// GetActiveTrip menangani GET /api/v1/trips/active
func (c *TripController) GetActiveTrip(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	trip, err := c.service.GetActiveTrip(r.Context(), claims.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil perjalanan aktif", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Perjalanan aktif berhasil diambil", trip)
}

// GetHistory menangani GET /api/v1/trips/history
func (c *TripController) GetHistory(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi")
		return
	}

	period := r.URL.Query().Get("period")
	if period == "" {
		period = "this_month"
	}

	historyWithStats, err := c.service.GetHistoryWithStats(r.Context(), claims.UserID, period)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil riwayat perjalanan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Riwayat perjalanan berhasil diambil", historyWithStats)
}
