package controller

import (
	"net/http"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// AdminController menangani endpoint administratif Command Center untuk Superadmin
type AdminController struct {
	adminService service.AdminService
}

// NewAdminController membuat instance baru AdminController dengan injeksi AdminService
func NewAdminController(adminSvc service.AdminService) *AdminController {
	return &AdminController{adminService: adminSvc}
}

// GetStats menangani GET /api/v1/admin/stats
func (c *AdminController) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, err := c.adminService.GetDashboardStats(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memuat statistik platform", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Statistik platform berhasil diambil", stats)
}

// GetUsers menangani GET /api/v1/admin/users
func (c *AdminController) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.adminService.GetAllUsers(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal memuat daftar pengguna", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Daftar pengguna berhasil diambil", users)
}
