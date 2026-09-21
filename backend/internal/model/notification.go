package model

import "time"

// Notification merepresentasikan data notifikasi keselamatan yang tersimpan di PostgreSQL
type Notification struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"` // "broadcast" atau user_id spesifik
	Title       string    `json:"title"`
	Message     string    `json:"message"`
	Category    string    `json:"category"`    // 'spatial', 'guardian', 'report', 'system'
	Severity    string    `json:"severity"`    // 'urgent', 'warning', 'info', 'safe'
	ActionType  string    `json:"action_type"` // 'map', 'track', 'report'
	ActionLabel string    `json:"action_label"`
	IsRead      bool      `json:"is_read"`
	CreatedAt   time.Time `json:"created_at"`
}

// NotificationListResponse adalah DTO untuk daftar notifikasi beserta unread count
type NotificationListResponse struct {
	Notifications []*Notification `json:"notifications"`
	UnreadCount   int             `json:"unread_count"`
	TotalCount    int             `json:"total_count"`
}
