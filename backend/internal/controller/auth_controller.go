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

// Register menangani POST /api/v1/auth/register (Role: User)
func (c *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req model.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	authResp, err := c.authService.Register(r.Context(), &req)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Pendaftaran gagal", err.Error())
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "jalanaman_token",
		Value:    authResp.Token,
		Path:     "/",
		Expires:  authResp.ExpiresAt,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	})

	response.Success(w, http.StatusCreated, "Registrasi berhasil", authResp)
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

// UpdateProfile menangani PUT /api/v1/users/profile
// @Summary      Perbarui Profil Pengguna
// @Description  Memperbarui data diri, kontak, ID Medis, dan kontak pengawal darurat
// @Tags         Authentication
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        request  body      model.UpdateProfileRequest  true  "Payload Profil"
// @Success      200      {object}  response.APIResponse{data=model.User}
// @Failure      400      {object}  response.APIResponse
// @Failure      401      {object}  response.APIResponse
// @Router       /users/profile [put]
func (c *AuthController) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak valid atau telah berakhir")
		return
	}

	var req model.UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Format JSON tidak valid", err.Error())
		return
	}

	updatedUser, err := c.authService.UpdateProfile(r.Context(), claims.UserID, &req)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Gagal memperbarui profil", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Profil berhasil diperbarui", updatedUser)
}

// DeleteAccount menangani DELETE /api/v1/users/account
// @Summary      Hapus Akun Pengguna
// @Description  Menghapus akun pengguna secara permanen dari basis data
// @Tags         Authentication
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  response.APIResponse
// @Failure      401  {object}  response.APIResponse
// @Router       /users/account [delete]
func (c *AuthController) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak valid atau telah berakhir")
		return
	}

	if err := c.authService.DeleteAccount(r.Context(), claims.UserID); err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menghapus akun", err.Error())
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "jalanaman_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteLaxMode,
	})

	response.Success(w, http.StatusOK, "Akun berhasil dihapus", nil)
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

// Reputation menangani GET /api/v1/users/reputation
// @Summary      Reputasi & Tingkat Kepercayaan Pengguna
// @Description  Mengambil skor reputasi, tier keamanan, dan log riwayat audit dari PostgreSQL
// @Tags         Authentication
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  response.APIResponse{data=model.UserReputationResponse}
// @Failure      401  {object}  response.APIResponse
// @Router       /users/reputation [get]
func (c *AuthController) Reputation(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetClaimsFromContext(r.Context())
	if !ok || claims == nil {
		response.Error(w, http.StatusUnauthorized, "Sesi tidak valid atau telah berakhir")
		return
	}

	rep, err := c.authService.GetUserReputation(r.Context(), claims.UserID)
	if err != nil {
		response.Error(w, http.StatusNotFound, "Data reputasi pengguna tidak ditemukan", err.Error())
		return
	}

	response.Success(w, http.StatusOK, "Data reputasi pengguna ditemukan", rep)
}


