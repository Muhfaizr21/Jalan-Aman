package response

import (
	"encoding/json"
	"net/http"
)

// APIResponse merepresentasikan struktur standar respons JSON
type APIResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
	Errors  any    `json:"errors,omitempty"`
}

// JSON menulis response JSON umum
func JSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(payload)
}

// Success mengirim respons sukses standar
func Success(w http.ResponseWriter, statusCode int, message string, data any) {
	JSON(w, statusCode, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Error mengirim respons error standar
func Error(w http.ResponseWriter, statusCode int, message string, errors ...string) {
	var errPayload any
	if len(errors) == 1 {
		errPayload = errors[0]
	} else if len(errors) > 1 {
		errPayload = errors
	}

	JSON(w, statusCode, APIResponse{
		Success: false,
		Message: message,
		Errors:  errPayload,
	})
}
