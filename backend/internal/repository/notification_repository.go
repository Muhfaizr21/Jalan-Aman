package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// NotificationRepository adalah interface data access untuk tabel notifications di PostgreSQL
type NotificationRepository interface {
	AutoMigrateAndSeed(ctx context.Context) error
	GetByUserID(ctx context.Context, userID string) ([]*model.Notification, error)
	Create(ctx context.Context, notif *model.Notification) error
	MarkAsRead(ctx context.Context, id string, userID string) error
	MarkAllAsRead(ctx context.Context, userID string) error
}

type postgresNotificationRepository struct {
	db *sql.DB
}

// NewPostgresNotificationRepository membuat instance baru NotificationRepository
func NewPostgresNotificationRepository(db *sql.DB) NotificationRepository {
	return &postgresNotificationRepository{db: db}
}

// AutoMigrateAndSeed membuat tabel notifications dan mengisi data awal jika kosong
func (r *postgresNotificationRepository) AutoMigrateAndSeed(ctx context.Context) error {
	queryDDL := `
	CREATE TABLE IF NOT EXISTS notifications (
		id VARCHAR(64) PRIMARY KEY,
		user_id VARCHAR(64) NOT NULL DEFAULT 'broadcast',
		title VARCHAR(255) NOT NULL,
		message TEXT NOT NULL,
		category VARCHAR(32) NOT NULL DEFAULT 'spatial',
		severity VARCHAR(32) NOT NULL DEFAULT 'info',
		action_type VARCHAR(32) NOT NULL DEFAULT 'map',
		action_label VARCHAR(64) NOT NULL DEFAULT 'Lihat di Peta',
		is_read BOOLEAN NOT NULL DEFAULT false,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
	CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
	`
	if _, err := r.db.ExecContext(ctx, queryDDL); err != nil {
		return fmt.Errorf("gagal migrasi tabel notifications: %w", err)
	}

	var count int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM notifications").Scan(&count); err != nil {
		return fmt.Errorf("gagal memeriksa jumlah notifikasi: %w", err)
	}

	if count == 0 {
		seeds := []*model.Notification{
			{
				ID:          "notif_seed_01",
				UserID:      "broadcast",
				Title:       "Lampu PJU Padam 150m (Bypass Bulak)",
				Message:     "Dua titik tiang lampu jalan padam di lajur kiri arah Lohbener. Kondisi gelap saat malam hari. Lokasi: Bypass Bulak Jatibarang, Indramayu.",
				Category:    "spatial",
				Severity:    "warning",
				ActionType:  "map",
				ActionLabel: "Lihat di Peta",
				IsRead:      false,
				CreatedAt:   time.Now().Add(-1 * time.Hour),
			},
			{
				ID:          "notif_seed_02",
				UserID:      "broadcast",
				Title:       "Area Sepi & Rawan Begal Malam (Jl. Raya Bulak)",
				Message:     "Jalur sepi minim aktivitas warga di atas jam 22.00 WIB. Disarankan melintas beriringan. Lokasi: Jl. Raya Bulak No. 45, Jatibarang.",
				Category:    "spatial",
				Severity:    "urgent",
				ActionType:  "map",
				ActionLabel: "Lihat di Peta",
				IsRead:      false,
				CreatedAt:   time.Now().Add(-3 * time.Hour),
			},
			{
				ID:          "notif_seed_03",
				UserID:      "broadcast",
				Title:       "Jalan Berlubang Dalam (Simpang Tiga Mayor Dasuki)",
				Message:     "Lubang jalan sedalam ±8cm di dekat persimpangan menuju stasiun. Lokasi: Simpang Tiga Jl. Mayor Dasuki, Jatibarang.",
				Category:    "spatial",
				Severity:    "warning",
				ActionType:  "map",
				ActionLabel: "Lihat di Peta",
				IsRead:      false,
				CreatedAt:   time.Now().Add(-5 * time.Hour),
			},
		}

		stmt, err := r.db.PrepareContext(ctx, `
			INSERT INTO notifications (id, user_id, title, message, category, severity, action_type, action_label, is_read, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		`)
		if err != nil {
			return fmt.Errorf("gagal menyiapkan statement seed notifikasi: %w", err)
		}
		defer stmt.Close()

		for _, item := range seeds {
			if _, err := stmt.ExecContext(ctx, item.ID, item.UserID, item.Title, item.Message, item.Category, item.Severity, item.ActionType, item.ActionLabel, item.IsRead, item.CreatedAt); err != nil {
				return fmt.Errorf("gagal menyimpan seed notifikasi %s: %w", item.ID, err)
			}
		}
		log.Printf("[Database Seeding] %d notifikasi awal keselamatan Indramayu berhasil ditanam di PostgreSQL.\n", len(seeds))
	}

	return nil
}

// GetByUserID mengambil seluruh notifikasi untuk pengguna tertentu dan notifikasi broadcast
func (r *postgresNotificationRepository) GetByUserID(ctx context.Context, userID string) ([]*model.Notification, error) {
	query := `
		SELECT id, user_id, title, message, category, severity, action_type, action_label, is_read, created_at
		FROM notifications
		WHERE user_id = 'broadcast' OR user_id = $1
		ORDER BY created_at DESC
		LIMIT 50
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil notifikasi: %w", err)
	}
	defer rows.Close()

	var list []*model.Notification
	for rows.Next() {
		n := &model.Notification{}
		if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Message, &n.Category, &n.Severity, &n.ActionType, &n.ActionLabel, &n.IsRead, &n.CreatedAt); err != nil {
			return nil, fmt.Errorf("gagal membaca baris notifikasi: %w", err)
		}
		list = append(list, n)
	}

	return list, nil
}

// Create menyimpan notifikasi baru ke database
func (r *postgresNotificationRepository) Create(ctx context.Context, notif *model.Notification) error {
	if notif.ID == "" {
		notif.ID = fmt.Sprintf("notif_%d", time.Now().UnixNano())
	}
	if notif.CreatedAt.IsZero() {
		notif.CreatedAt = time.Now()
	}

	query := `
		INSERT INTO notifications (id, user_id, title, message, category, severity, action_type, action_label, is_read, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	_, err := r.db.ExecContext(ctx, query,
		notif.ID,
		notif.UserID,
		notif.Title,
		notif.Message,
		notif.Category,
		notif.Severity,
		notif.ActionType,
		notif.ActionLabel,
		notif.IsRead,
		notif.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("gagal membuat notifikasi: %w", err)
	}
	return nil
}

// MarkAsRead menandai satu notifikasi sebagai telah dibaca
func (r *postgresNotificationRepository) MarkAsRead(ctx context.Context, id string, userID string) error {
	query := `UPDATE notifications SET is_read = true WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("gagal menandai notifikasi dibaca: %w", err)
	}
	return nil
}

// MarkAllAsRead menandai semua notifikasi pengguna dan broadcast sebagai telah dibaca
func (r *postgresNotificationRepository) MarkAllAsRead(ctx context.Context, userID string) error {
	query := `UPDATE notifications SET is_read = true WHERE user_id = 'broadcast' OR user_id = $1`
	_, err := r.db.ExecContext(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("gagal menandai semua notifikasi dibaca: %w", err)
	}
	return nil
}
