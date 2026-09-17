package auth

import (
	"errors"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	"github.com/golang-jwt/jwt/v5"
)

// CustomClaims memuat payload identitas dalam token JWT
type CustomClaims struct {
	UserID string         `json:"user_id"`
	Email  string         `json:"email"`
	Name   string         `json:"name"`
	Role   model.UserRole `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken membuat JWT string baru yang ditandatangani dengan HMAC-SHA256
func GenerateToken(user *model.User, secret string, expireHours int) (string, time.Time, error) {
	if expireHours <= 0 {
		expireHours = 24
	}

	expiresAt := time.Now().Add(time.Duration(expireHours) * time.Hour)
	claims := CustomClaims{
		UserID: user.ID,
		Email:  user.Email,
		Name:   user.Name,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "jalanaman-auth",
			Subject:   user.ID,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", time.Time{}, err
	}

	return signedToken, expiresAt, nil
}

// ValidateToken memvalidasi dan mem-parse JWT string
func ValidateToken(tokenString string, secret string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("algoritma signing JWT tidak valid")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, errors.New("token JWT tidak valid atau telah kedaluwarsa")
	}

	return claims, nil
}
