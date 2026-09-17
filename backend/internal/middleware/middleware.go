package middleware

import (
	"log"
	"net/http"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/pkg/response"
)

// Middleware merepresentasikan fungsi wrapper http.Handler
type Middleware func(http.Handler) http.Handler

// Chain menggabungkan multiple middleware ke dalam satu handler
func Chain(h http.Handler, middlewares ...Middleware) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}
	return h
}

// Logger mencatat setiap request HTTP yang masuk beserta durasi eksekusinya
func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("[%s] %s %s | %v\n", r.Method, r.URL.Path, r.RemoteAddr, time.Since(start))
	})
}

// CORS mengizinkan request cross-origin dari frontend dan mobile
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Recovery menangani panic agar server tidak mengalami crash
func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				log.Printf("[PANIC RECOVERED] %v\n", rec)
				response.Error(w, http.StatusInternalServerError, "Terjadi kesalahan internal pada server")
			}
		}()
		next.ServeHTTP(w, r)
	})
}
