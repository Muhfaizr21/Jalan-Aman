package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/auth"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

type contextKey string

const claimsContextKey contextKey = "jwt_claims"

// GetClaimsFromContext mengambil claims JWT dari request context
func GetClaimsFromContext(ctx context.Context) (*auth.CustomClaims, bool) {
	claims, ok := ctx.Value(claimsContextKey).(*auth.CustomClaims)
	return claims, ok
}

// RequireAuth memverifikasi token JWT dari header Authorization atau Cookie
func RequireAuth(jwtSecret string) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := ""

			// 1. Coba baca dari header Authorization: Bearer <token>
			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") {
					tokenString = parts[1]
				}
			}

			// 2. Jika tidak ada di header, baca dari cookie jalanaman_token
			if tokenString == "" {
				if cookie, err := r.Cookie("jalanaman_token"); err == nil {
					tokenString = cookie.Value
				}
			}

			if tokenString == "" {
				response.Error(w, http.StatusUnauthorized, "Autentikasi diperlukan. Silakan login terlebih dahulu.")
				return
			}

			claims, err := auth.ValidateToken(tokenString, jwtSecret)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "Token autentikasi tidak valid atau telah kedaluwarsa.")
				return
			}

			// Simpan claims ke request context
			ctx := context.WithValue(r.Context(), claimsContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequireRole memverifikasi bahwa peran pengguna dalam token sesuai
func RequireRole(role model.UserRole) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := GetClaimsFromContext(r.Context())
			if !ok || claims == nil {
				response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi.")
				return
			}

			if claims.Role != role {
				response.Error(w, http.StatusForbidden, "Akses ditolak. Peran "+string(role)+" diperlukan.")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
