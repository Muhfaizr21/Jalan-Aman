package controller

import (
	"database/sql"
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// HealthController menangani pemeriksaan kesehatan server dan database
type HealthController struct {
	db *sql.DB
}

// NewHealthController membuat instance HealthController baru
func NewHealthController(db *sql.DB) *HealthController {
	return &HealthController{db: db}
}

// Check menangani HTTP endpoint GET /api/v1/health
// @Summary      Pemeriksaan Status Layanan & Database
// @Description  Memeriksa ketersediaan API Gateway dan koneksi aktif ke database PostgreSQL
// @Tags         System & Health
// @Accept       json
// @Produce      json
// @Success      200  {object}  response.APIResponse
// @Router       /health [get]
func (h *HealthController) Check(w http.ResponseWriter, r *http.Request) {
	dbStatus := "connected"
	if h.db != nil {
		if err := h.db.PingContext(r.Context()); err != nil {
			dbStatus = "disconnected: " + err.Error()
		}
	} else {
		dbStatus = "uninitialized"
	}

	response.Success(w, http.StatusOK, "JalanAman API Gateway is operational", map[string]any{
		"status":   "UP",
		"database": dbStatus,
		"version":  "v1.0.0",
	})
}
