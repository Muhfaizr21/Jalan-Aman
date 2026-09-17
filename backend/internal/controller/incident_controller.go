package controller

import (
	"encoding/json"
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/view"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// IncidentController adalah Controller (C dalam MVC) untuk endpoint insiden
type IncidentController struct {
	service service.IncidentService
}

// NewIncidentController menginjeksi IncidentService interface ke controller
func NewIncidentController(svc service.IncidentService) *IncidentController {
	return &IncidentController{service: svc}
}

// Create menangani POST /api/v1/incidents
// @Summary      Laporkan Insiden Baru
// @Description  Membuat dan mencatat laporan insiden jalan baru (begal, jalan rusak, lampu padam, kecelakaan)
// @Tags         Incidents
// @Accept       json
// @Produce      json
// @Param        request  body      model.Incident  true  "Data Laporan Insiden"
// @Success      201      {object}  response.APIResponse{data=view.IncidentResponse}
// @Failure      400      {object}  response.APIResponse
// @Failure      422      {object}  response.APIResponse
// @Router       /incidents [post]
func (c *IncidentController) Create(w http.ResponseWriter, r *http.Request) {
	var req model.Incident
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON request tidak valid", err.Error())
		return
	}

	created, err := c.service.ReportIncident(r.Context(), &req)
	if err != nil {
		response.Error(w, http.StatusUnprocessableEntity, "Validasi insiden gagal", err.Error())
		return
	}

	// Meneruskan ke View layer (V dalam MVC)
	viewData := view.FormatIncident(created)
	response.Success(w, http.StatusCreated, "Laporan insiden berhasil dibuat", viewData)
}

// GetAll menangani GET /api/v1/incidents
// @Summary      Daftar Seluruh Insiden
// @Description  Mengambil seluruh catatan insiden yang dilaporkan masyarakat
// @Tags         Incidents
// @Accept       json
// @Produce      json
// @Success      200  {object}  response.APIResponse{data=[]view.IncidentResponse}
// @Failure      500  {object}  response.APIResponse
// @Router       /incidents [get]
func (c *IncidentController) GetAll(w http.ResponseWriter, r *http.Request) {
	list, err := c.service.GetIncidents(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil daftar insiden", err.Error())
		return
	}

	// Meneruskan ke View layer (V dalam MVC)
	viewList := view.FormatIncidentList(list)
	response.Success(w, http.StatusOK, "Daftar insiden berhasil diambil", viewList)
}

// GetByID menangani GET /api/v1/incidents/{id}
// @Summary      Detail Insiden Berdasarkan ID
// @Description  Mengambil data spesifik insiden berdasarkan ID laporan
// @Tags         Incidents
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "ID Insiden"
// @Success      200  {object}  response.APIResponse{data=view.IncidentResponse}
// @Failure      400  {object}  response.APIResponse
// @Failure      404  {object}  response.APIResponse
// @Router       /incidents/{id} [get]
func (c *IncidentController) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.Error(w, http.StatusBadRequest, "Parameter ID insiden wajib diisi")
		return
	}

	item, err := c.service.GetIncidentByID(r.Context(), id)
	if err != nil {
		response.Error(w, http.StatusNotFound, "Insiden tidak ditemukan", err.Error())
		return
	}

	viewData := view.FormatIncident(item)
	response.Success(w, http.StatusOK, "Data insiden ditemukan", viewData)
}
