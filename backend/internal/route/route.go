package route

import (
	"net/http"

	_ "github.com/Muhfaizr21/Jalan-Aman/backend/docs"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/controller"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/middleware"
	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
	httpSwagger "github.com/swaggo/http-swagger/v2"
)

// Handlers menampung seluruh controller yang akan diregistrasikan ke router
type Handlers struct {
	Health       *controller.HealthController
	Incident     *controller.IncidentController
	Shelter      *controller.ShelterController
	Auth         *controller.AuthController
	Admin        *controller.AdminController
	Notification *controller.NotificationController
	Settings     *controller.SettingsController
	Map          *controller.MapController
	Trip         *controller.TripController
	JWTSecret    string
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

	// =========================================================================
	// JALUR 1: PENGGUNA PUBLIK & MOBILE (ROLE: USER)
	// =========================================================================
	mux.HandleFunc("POST /api/v1/auth/login", h.Auth.Login)
	mux.HandleFunc("POST /api/v1/auth/register", h.Auth.Register)
	mux.HandleFunc("POST /api/v1/auth/logout", h.Auth.Logout)
	mux.Handle("GET /api/v1/auth/me", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Auth.Me)))
	mux.Handle("PUT /api/v1/users/profile", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Auth.UpdateProfile)))
	mux.Handle("GET /api/v1/users/reputation", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Auth.Reputation)))
	mux.Handle("DELETE /api/v1/users/account", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Auth.DeleteAccount)))

	// Incidents (Masyarakat - Pelaporan & Pantauan Peta)
	mux.HandleFunc("GET /api/v1/incidents", h.Incident.GetAll)
	mux.Handle("POST /api/v1/incidents", middleware.OptionalAuth(h.JWTSecret)(http.HandlerFunc(h.Incident.Create)))
	mux.HandleFunc("GET /api/v1/incidents/{id}", h.Incident.GetByID)

	// Shelters (Safe Haven 24 Jam - Titik Evakuasi)
	mux.HandleFunc("GET /api/v1/shelters", h.Shelter.GetAll)
	mux.HandleFunc("GET /api/v1/shelters/{id}", h.Shelter.GetByID)

	// Notifications (Tersimpan di PostgreSQL)
	if h.Notification != nil {
		mux.Handle("GET /api/v1/notifications", middleware.OptionalAuth(h.JWTSecret)(http.HandlerFunc(h.Notification.GetAll)))
		mux.Handle("PUT /api/v1/notifications/{id}/read", middleware.OptionalAuth(h.JWTSecret)(http.HandlerFunc(h.Notification.MarkAsRead)))
		mux.Handle("PUT /api/v1/notifications/read-all", middleware.OptionalAuth(h.JWTSecret)(http.HandlerFunc(h.Notification.MarkAllAsRead)))
	}

	// User System Settings & Telemetry (PostgreSQL)
	if h.Settings != nil {
		mux.Handle("GET /api/v1/users/settings", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Settings.Get)))
		mux.Handle("PUT /api/v1/users/settings", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Settings.Update)))
		mux.Handle("POST /api/v1/users/settings/reset", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Settings.Reset)))
	}

	// Offline Maps & GIS Corridors (Paket Data Luring Pantura Indramayu)
	if h.Map != nil {
		mux.HandleFunc("GET /api/v1/maps/offline-pack/indramayu", h.Map.GetIndramayuOfflinePack)
	}

	// Trip Protection & GPS Telemetry (Enkripsi Mil-Grade & Auto-Purge 24 Jam)
	if h.Trip != nil {
		mux.Handle("POST /api/v1/trips/start", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Trip.StartTrip)))
		mux.Handle("POST /api/v1/trips/telemetry", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Trip.RecordTelemetry)))
		mux.Handle("POST /api/v1/trips/complete", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Trip.CompleteTrip)))
		mux.Handle("GET /api/v1/trips/active", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Trip.GetActiveTrip)))
		mux.Handle("GET /api/v1/trips/history", middleware.RequireAuth(h.JWTSecret)(http.HandlerFunc(h.Trip.GetHistory)))
	}

	// =========================================================================
	// JALUR 2: COMMAND CENTER & ADMINISTRASI (ROLE: SUPERADMIN)
	// =========================================================================
	// 1. Verifikasi Status Insiden (Pending -> Verified / Rejected / Resolved)
	mux.Handle("PATCH /api/v1/admin/incidents/{id}/status",
		middleware.RequireAuth(h.JWTSecret)(
			middleware.RequireRole(model.RoleSuperadmin)(
				http.HandlerFunc(h.Incident.UpdateStatus),
			),
		),
	)

	// 2. Registrasi Safe Haven Baru (Hanya Superadmin)
	mux.Handle("POST /api/v1/shelters",
		middleware.RequireAuth(h.JWTSecret)(
			middleware.RequireRole(model.RoleSuperadmin)(
				http.HandlerFunc(h.Shelter.Create),
			),
		),
	)

	// 3. Statistik Platform & Manajemen Akun Pengguna
	if h.Admin != nil {
		mux.Handle("GET /api/v1/admin/stats",
			middleware.RequireAuth(h.JWTSecret)(
				middleware.RequireRole(model.RoleSuperadmin)(
					http.HandlerFunc(h.Admin.GetStats),
				),
			),
		)
		mux.Handle("GET /api/v1/admin/users",
			middleware.RequireAuth(h.JWTSecret)(
				middleware.RequireRole(model.RoleSuperadmin)(
					http.HandlerFunc(h.Admin.GetUsers),
				),
			),
		)
	}

	// Terapkan Middleware global: Recovery, CORS, Logger
	return middleware.Chain(
		mux,
		middleware.Recovery,
		middleware.CORS,
		middleware.Logger,
	)
}
