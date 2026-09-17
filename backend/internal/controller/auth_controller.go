package controller

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/middleware"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/service"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// AuthController menangani endpoint autentikasi
type AuthController struct {
	authService service.AuthService
}

// NewAuthController membuat instance AuthController baru
func NewAuthController(svc service.AuthService) *AuthController {
	return &AuthController{authService: svc}
}

// Login menangani POST /api/v1/auth/login
// @Summary      Login Pengguna & Superadmin
// @Description  Autentikasi dengan email dan password, menghasilkan token JWT dan cookie sesi
// @Tags         Authentication
// @Accept       json
// @Produce      json
// @Param        request  body      model.LoginRequest  true  "Kredensial Login"
// @Success      200      {object}  response.APIResponse{data=model.AuthResponse}
// @Failure      400      {object}  response.APIResponse
// @Failure      401      {object}  response.APIResponse
// @Router       /auth/login [post]
func (c *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req model.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	authResp, err := c.authService.Login(r.Context(), &req)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "Autentikasi gagal", err.Error())
		return
	}

	// Simpan token ke Cookie HttpOnly untuk keamanan otomatis di browser
	http.SetCookie(w, &http.Cookie{
		Name:     "jalanaman_token",
		Value:    authResp.Token,
		Path:     "/",
		Expires:  authResp.ExpiresAt,
		HttpOnly: false, // Diperbolehkan dibaca Next.js middleware di port/domain sama
		SameSite: http.SameSiteLaxMode,
	})

	response.Success(w, http.StatusOK, "Login berhasil", authResp)
}

// Me menangani GET /api/v1/auth/me
// @Summary      Profil Pengguna Saat Ini
// @Description  Mengambil profil pengguna/superadmin yang sedang login berdasarkan token JWT
// @Tags         Authentication
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  response.APIResponse{data=model.User}
// @Failure      401  {object}  response.APIResponse
// @Router       /auth/me [get]
func (c *AuthController) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak valid atau telah berakhir")
		return
	}

	user, err := c.authService.GetProfile(r.Context(), claims.UserID)
	if err != nil {
		response.Error(w, http.StatusNotFound, "Data pengguna tidak ditemukan")
		return
	}

	response.Success(w, http.StatusOK, "Profil pengguna ditemukan", user)
}

// Logout menangani POST /api/v1/auth/logout
// @Summary      Logout Pengguna
// @Description  Menghapus cookie sesi autentikasi pengguna
// @Tags         Authentication
// @Produce      json
// @Success      200  {object}  response.APIResponse
// @Router       /auth/logout [post]
func (c *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "jalanaman_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteLaxMode,
	})

	response.Success(w, http.StatusOK, "Berhasil logout", nil)
}
