package controller

import (
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// MapController menangani endpoint pengunduhan paket peta offline & koridor
type MapController struct {
	mapService service.MapService
}

// NewMapController membuat instance MapController baru
func NewMapController(mapSvc service.MapService) *MapController {
	return &MapController{mapService: mapSvc}
}

// GetIndramayuOfflinePack menangani GET /api/v1/maps/offline-pack/indramayu
func (c *MapController) GetIndramayuOfflinePack(w http.ResponseWriter, r *http.Request) {
	pack, err := c.mapService.GetIndramayuOfflinePack(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memuat paket peta offline", err.Error())
		return
	}

	w.Header().Set("Cache-Control", "public, max-age=86400") // Cache 24 jam di sisi client
	response.Success(w, http.StatusOK, "Paket peta offline Indramayu Pantura berhasil diambil", pack)
}
