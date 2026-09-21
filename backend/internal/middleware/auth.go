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

// OptionalAuth mengekstrak claims jika token JWT tersedia tanpa memblokir guest
func OptionalAuth(jwtSecret string) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := ""

			authHeader := r.Header.Get("Authorization")
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") {
					tokenString = parts[1]
				}
			}

			if tokenString == "" {
				if cookie, err := r.Cookie("jalanaman_token"); err == nil {
					tokenString = cookie.Value
				}
			}

			if tokenString != "" {
				if claims, err := auth.ValidateToken(tokenString, jwtSecret); err == nil {
					ctx := context.WithValue(r.Context(), claimsContextKey, claims)
					r = r.WithContext(ctx)
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

// RequireRole memverifikasi bahwa peran pengguna dalam token termasuk dalam daftar peran yang diizinkan (Open/Closed Principle)
func RequireRole(roles ...model.UserRole) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := GetClaimsFromContext(r.Context())
			if !ok || claims == nil {
				response.Error(w, http.StatusUnauthorized, "Sesi tidak terverifikasi.")
				return
			}

			hasRole := false
			for _, role := range roles {
				if claims.Role == role {
					hasRole = true
					break
				}
			}

			if !hasRole {
				response.Error(w, http.StatusForbidden, "Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
