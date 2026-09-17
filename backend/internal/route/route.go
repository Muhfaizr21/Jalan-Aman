package route

import (
	"net/http"

	_ "github.com/Muhfaizr21/Jalan-Aman/backend/docs"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/controller"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/middleware"
	httpSwagger "github.com/swaggo/http-swagger/v2"
)

// Handlers menampung seluruh controller yang akan diregistrasikan ke router
type Handlers struct {
	Health    *controller.HealthController
	Incident  *controller.IncidentController
	Auth      *controller.AuthController
	JWTSecret string
}

// SetupRouter mengonfigurasi dan mengembalikan http.Handler utama aplikasi
func SetupRouter(h Handlers) http.Handler {
	mux := http.NewServeMux()

	// Swagger Documentation UI
	mux.HandleFunc("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/index.html", http.StatusMovedPermanently)
	})
	mux.Handle("/swagger/", httpSwagger.WrapHandler)

	// Health Check
	mux.HandleFunc("GET /api/v1/health", h.Health.Check)

	// Auth Routes
	mux.HandleFunc("POST /api/v1/auth/login", h.Auth.Login)
	mux.HandleFunc("POST /api/v1/auth/logout", h.Auth.Logout)
	mux.Handle("GET /api/v1/auth/me", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Auth.Me)))

	// Incident Routes (RESTful)
	mux.HandleFunc("GET /api/v1/incidents", h.Incident.GetAll)
	mux.HandleFunc("POST /api/v1/incidents", h.Incident.Create)
	mux.HandleFunc("GET /api/v1/incidents/{id}", h.Incident.GetByID)

	// Terapkan Middleware global: Recovery, CORS, Logger
	return middleware.Chain(
		mux,
		middleware.Recovery,
		middleware.CORS,
		middleware.Logger,
	)
}
