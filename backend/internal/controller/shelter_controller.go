package controller

import (
	"encoding/json"
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// ShelterController menangani endpoint Safe Haven / Shelter
type ShelterController struct {
	service service.ShelterService
}

// NewShelterController membuat instance baru ShelterController
func NewShelterController(svc service.ShelterService) *ShelterController {
	return &ShelterController{service: svc}
}

// GetAll menangani GET /api/v1/shelters
func (c *ShelterController) GetAll(w http.ResponseWriter, r *http.Request) {
	shelters, err := c.service.GetAllShelters(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data shelter", err.Error())
		return
	}
	response.Success(w, http.StatusOK, "Daftar safe haven berhasil diambil", shelters)
}

// GetByID menangani GET /api/v1/shelters/{id}
func (c *ShelterController) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.Error(w, http.StatusBadRequest, "ID shelter wajib disertakan")
		return
	}

	sh, err := c.service.GetShelterByID(r.Context(), id)
	if err != nil {
		response.Error(w, http.StatusNotFound, "Safe haven tidak ditemukan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Detail safe haven berhasil ditemukan", sh)
}

// Create menangani POST /api/v1/shelters (Admin/Superadmin only)
func (c *ShelterController) Create(w http.ResponseWriter, r *http.Request) {
	var req model.Shelter
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON request tidak valid", err.Error())
		return
	}

	created, err := c.service.CreateShelter(r.Context(), &req)
	if err != nil {
		response.Error(w, http.StatusUnprocessableEntity, "Validasi safe haven gagal", err.Error())
		return
	}

	response.Success(w, http.StatusCreated, "Safe haven baru berhasil didaftarkan", created)
}
