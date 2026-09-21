package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Muhfaizr21/Jalan-Aman/backend/internal/model"
)

// TripRepository adalah interface data access layer untuk sesi perjalanan dan GPS telemetri
type TripRepository interface {
	AutoMigrate(ctx context.Context) error
	Create(ctx context.Context, trip *model.Trip) error
	AddTelemetry(ctx context.Context, telemetry *model.TripTelemetry) error
	CompleteTrip(ctx context.Context, tripID string, arrivedAt time.Time) error
	GetActiveTrip(ctx context.Context, userID string) (*model.Trip, error)
	GetByID(ctx context.Context, id string) (*model.Trip, error)
	GetHistory(ctx context.Context, userID string) ([]*model.Trip, error)
	PurgeOldTrips(ctx context.Context, userID string, olderThan time.Duration) (int64, error)
}

type postgresTripRepository struct {
	db *sql.DB
}

// NewPostgresTripRepository membuat instance PostgreSQL TripRepository baru
func NewPostgresTripRepository(db *sql.DB) TripRepository {
	return &postgresTripRepository{db: db}
}

func (r *postgresTripRepository) AutoMigrate(ctx context.Context) error {
	tripSchema := `
	CREATE TABLE IF NOT EXISTS trip_history (
		id VARCHAR(64) PRIMARY KEY,
		user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		origin_name VARCHAR(128) NOT NULL,
		destination_name VARCHAR(128) NOT NULL,
		origin_lat DOUBLE PRECISION NOT NULL,
		origin_lng DOUBLE PRECISION NOT NULL,
		dest_lat DOUBLE PRECISION NOT NULL,
		dest_lng DOUBLE PRECISION NOT NULL,
		status VARCHAR(32) NOT NULL DEFAULT 'active',
		is_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
		start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		arrived_at TIMESTAMP WITH TIME ZONE,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_trip_history_user_status ON trip_history (user_id, status);
	CREATE INDEX IF NOT EXISTS idx_trip_history_arrived_at ON trip_history (arrived_at);

	CREATE TABLE IF NOT EXISTS trip_telemetry (
		id VARCHAR(64) PRIMARY KEY,
		trip_id VARCHAR(64) NOT NULL REFERENCES trip_history(id) ON DELETE CASCADE,
		user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		latitude DOUBLE PRECISION NOT NULL,
		longitude DOUBLE PRECISION NOT NULL,
		encrypted_payload TEXT,
		speed_kmh DOUBLE PRECISION NOT NULL DEFAULT 0.0,
		recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_trip_telemetry_trip_id ON trip_telemetry (trip_id);
	`
	_, err := r.db.ExecContext(ctx, tripSchema)
	return err
}

func (r *postgresTripRepository) Create(ctx context.Context, trip *model.Trip) error {
	query := `
	INSERT INTO trip_history (
		id, user_id, origin_name, destination_name,
		origin_lat, origin_lng, dest_lat, dest_lng,
		status, is_encrypted, start_time, created_at
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
	`
	_, err := r.db.ExecContext(ctx, query,
		trip.ID, trip.UserID, trip.OriginName, trip.DestinationName,
		trip.OriginLat, trip.OriginLng, trip.DestLat, trip.DestLng,
		trip.Status, trip.IsEncrypted, trip.StartTime, trip.CreatedAt,
	)
	return err
}

func (r *postgresTripRepository) AddTelemetry(ctx context.Context, telemetry *model.TripTelemetry) error {
	query := `
	INSERT INTO trip_telemetry (
		id, trip_id, user_id, latitude, longitude,
		encrypted_payload, speed_kmh, recorded_at
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
	`
	_, err := r.db.ExecContext(ctx, query,
		telemetry.ID, telemetry.TripID, telemetry.UserID,
		telemetry.Latitude, telemetry.Longitude,
		telemetry.EncryptedPayload, telemetry.SpeedKmh, telemetry.RecordedAt,
	)
	return err
}

func (r *postgresTripRepository) CompleteTrip(ctx context.Context, tripID string, arrivedAt time.Time) error {
	query := `
	UPDATE trip_history
	SET status = 'completed', arrived_at = $2
	WHERE id = $1;
	`
	_, err := r.db.ExecContext(ctx, query, tripID, arrivedAt)
	return err
}

func (r *postgresTripRepository) GetActiveTrip(ctx context.Context, userID string) (*model.Trip, error) {
	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, start_time, arrived_at, created_at
	FROM trip_history
	WHERE user_id = $1 AND status = 'active'
	ORDER BY created_at DESC
	LIMIT 1;
	`
	row := r.db.QueryRowContext(ctx, query, userID)
	var t model.Trip
	var arrivedAt sql.NullTime

	err := row.Scan(
		&t.ID, &t.UserID, &t.OriginName, &t.DestinationName,
		&t.OriginLat, &t.OriginLng, &t.DestLat, &t.DestLng,
		&t.Status, &t.IsEncrypted, &t.StartTime, &arrivedAt, &t.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if arrivedAt.Valid {
		t.ArrivedAt = &arrivedAt.Time
	}
	return &t, nil
}

func (r *postgresTripRepository) GetByID(ctx context.Context, id string) (*model.Trip, error) {
	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, start_time, arrived_at, created_at
	FROM trip_history
	WHERE id = $1
	LIMIT 1;
	`
	row := r.db.QueryRowContext(ctx, query, id)
	var t model.Trip
	var arrivedAt sql.NullTime

	err := row.Scan(
		&t.ID, &t.UserID, &t.OriginName, &t.DestinationName,
		&t.OriginLat, &t.OriginLng, &t.DestLat, &t.DestLng,
		&t.Status, &t.IsEncrypted, &t.StartTime, &arrivedAt, &t.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if arrivedAt.Valid {
		t.ArrivedAt = &arrivedAt.Time
	}
	return &t, nil
}

func (r *postgresTripRepository) GetHistory(ctx context.Context, userID string) ([]*model.Trip, error) {
	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, start_time, arrived_at, created_at
	FROM trip_history
	WHERE user_id = $1
	ORDER BY created_at DESC
	LIMIT 50;
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*model.Trip
	for rows.Next() {
		var t model.Trip
		var arrivedAt sql.NullTime
		if err := rows.Scan(
			&t.ID, &t.UserID, &t.OriginName, &t.DestinationName,
			&t.OriginLat, &t.OriginLng, &t.DestLat, &t.DestLng,
			&t.Status, &t.IsEncrypted, &t.StartTime, &arrivedAt, &t.CreatedAt,
		); err != nil {
			return nil, err
		}
		if arrivedAt.Valid {
			t.ArrivedAt = &arrivedAt.Time
		}
		list = append(list, &t)
	}
	return list, nil
}

// PurgeOldTrips membersihkan rekam jejak rute GPS yang telah selesai (status: completed) lebih lama dari olderThan
func (r *postgresTripRepository) PurgeOldTrips(ctx context.Context, userID string, olderThan time.Duration) (int64, error) {
	threshold := time.Now().Add(-olderThan)
	query := `
	DELETE FROM trip_history
	WHERE user_id = $1 AND status = 'completed' AND arrived_at <= $2;
	`
	res, err := r.db.ExecContext(ctx, query, userID, threshold)
	if err != nil {
		return 0, fmt.Errorf("gagal mengeksekusi purge riwayat: %w", err)
	}
	return res.RowsAffected()
}
