package repository

import (
	"context"
	"database/sql"
	"fmt"
	"math"
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
	GetHistoryWithStats(ctx context.Context, userID string, period string) (*model.TripHistoryResponse, error)
	PurgeOldTrips(ctx context.Context, userID string, olderThan time.Duration) (int64, error)
	SeedSampleTripsIfEmpty(ctx context.Context, userID string) error
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
		mode VARCHAR(32) DEFAULT 'motor',
		distance_km DOUBLE PRECISION DEFAULT 0.0,
		duration_minutes INT DEFAULT 0,
		safety_score INT DEFAULT 95,
		protection_highlights TEXT DEFAULT '',
		avoided_hazards_count INT DEFAULT 0,
		avoided_dark_areas_count INT DEFAULT 0,
		start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		arrived_at TIMESTAMP WITH TIME ZONE,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_trip_history_user_status ON trip_history (user_id, status);
	CREATE INDEX IF NOT EXISTS idx_trip_history_arrived_at ON trip_history (arrived_at);
	CREATE INDEX IF NOT EXISTS idx_trip_history_start_time ON trip_history (start_time);

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

	-- Add columns safely if table already existed
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS mode VARCHAR(32) DEFAULT 'motor';
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS distance_km DOUBLE PRECISION DEFAULT 0.0;
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 0;
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS safety_score INT DEFAULT 95;
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS protection_highlights TEXT DEFAULT '';
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS avoided_hazards_count INT DEFAULT 0;
	ALTER TABLE trip_history ADD COLUMN IF NOT EXISTS avoided_dark_areas_count INT DEFAULT 0;
	`
	_, err := r.db.ExecContext(ctx, tripSchema)
	return err
}

func (r *postgresTripRepository) Create(ctx context.Context, trip *model.Trip) error {
	if trip.Mode == "" {
		trip.Mode = "motor"
	}
	if trip.SafetyScore == 0 {
		trip.SafetyScore = 95
	}
	query := `
	INSERT INTO trip_history (
		id, user_id, origin_name, destination_name,
		origin_lat, origin_lng, dest_lat, dest_lng,
		status, is_encrypted, mode, distance_km, duration_minutes,
		safety_score, protection_highlights, avoided_hazards_count,
		avoided_dark_areas_count, start_time, created_at
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19);
	`
	_, err := r.db.ExecContext(ctx, query,
		trip.ID, trip.UserID, trip.OriginName, trip.DestinationName,
		trip.OriginLat, trip.OriginLng, trip.DestLat, trip.DestLng,
		trip.Status, trip.IsEncrypted, trip.Mode, trip.DistanceKm, trip.DurationMinutes,
		trip.SafetyScore, trip.ProtectionHighlights, trip.AvoidedHazardsCount,
		trip.AvoidedDarkAreasCount, trip.StartTime, trip.CreatedAt,
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

func (r *postgresTripRepository) scanTrip(scanner interface{ Scan(dest ...interface{}) error }) (*model.Trip, error) {
	var t model.Trip
	var arrivedAt sql.NullTime
	var mode sql.NullString
	var highlights sql.NullString

	err := scanner.Scan(
		&t.ID, &t.UserID, &t.OriginName, &t.DestinationName,
		&t.OriginLat, &t.OriginLng, &t.DestLat, &t.DestLng,
		&t.Status, &t.IsEncrypted,
		&mode, &t.DistanceKm, &t.DurationMinutes,
		&t.SafetyScore, &highlights,
		&t.AvoidedHazardsCount, &t.AvoidedDarkAreasCount,
		&t.StartTime, &arrivedAt, &t.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	if arrivedAt.Valid {
		t.ArrivedAt = &arrivedAt.Time
	}
	if mode.Valid {
		t.Mode = mode.String
	} else {
		t.Mode = "motor"
	}
	if highlights.Valid {
		t.ProtectionHighlights = highlights.String
	}
	return &t, nil
}

func (r *postgresTripRepository) GetActiveTrip(ctx context.Context, userID string) (*model.Trip, error) {
	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, mode, distance_km, duration_minutes,
	       safety_score, protection_highlights, avoided_hazards_count,
	       avoided_dark_areas_count, start_time, arrived_at, created_at
	FROM trip_history
	WHERE user_id = $1 AND status = 'active'
	ORDER BY created_at DESC
	LIMIT 1;
	`
	row := r.db.QueryRowContext(ctx, query, userID)
	trip, err := r.scanTrip(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return trip, err
}

func (r *postgresTripRepository) GetByID(ctx context.Context, id string) (*model.Trip, error) {
	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, mode, distance_km, duration_minutes,
	       safety_score, protection_highlights, avoided_hazards_count,
	       avoided_dark_areas_count, start_time, arrived_at, created_at
	FROM trip_history
	WHERE id = $1
	LIMIT 1;
	`
	row := r.db.QueryRowContext(ctx, query, id)
	trip, err := r.scanTrip(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return trip, err
}

func (r *postgresTripRepository) GetHistory(ctx context.Context, userID string) ([]*model.Trip, error) {
	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, mode, distance_km, duration_minutes,
	       safety_score, protection_highlights, avoided_hazards_count,
	       avoided_dark_areas_count, start_time, arrived_at, created_at
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
		t, err := r.scanTrip(rows)
		if err != nil {
			return nil, err
		}
		list = append(list, t)
	}
	return list, nil
}

// GetHistoryWithStats mengambil riwayat perjalanan beserta agregasi statistik per periode (Bulan Ini / Bulan Lalu)
func (r *postgresTripRepository) GetHistoryWithStats(ctx context.Context, userID string, period string) (*model.TripHistoryResponse, error) {
	// Pastikan data contoh tersedia jika pengguna baru belum memiliki riwayat
	_ = r.SeedSampleTripsIfEmpty(ctx, userID)

	loc, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		loc = time.FixedZone("WIB", 7*3600)
	}

	var startDate, endDate time.Time
	var periodLabel string

	if period == "last_month" {
		// Agustus 2026 (Bulan Lalu)
		startDate = time.Date(2026, 8, 1, 0, 0, 0, 0, loc)
		endDate = time.Date(2026, 8, 31, 23, 59, 59, 999999999, loc)
		periodLabel = "STATISTIK BULAN LALU (AGUSTUS)"
	} else {
		// Default: September 2026 (Bulan Ini)
		period = "this_month"
		startDate = time.Date(2026, 9, 1, 0, 0, 0, 0, loc)
		endDate = time.Date(2026, 9, 30, 23, 59, 59, 999999999, loc)
		periodLabel = "STATISTIK BULAN INI (SEPTEMBER)"
	}

	query := `
	SELECT id, user_id, origin_name, destination_name,
	       origin_lat, origin_lng, dest_lat, dest_lng,
	       status, is_encrypted, mode, distance_km, duration_minutes,
	       safety_score, protection_highlights, avoided_hazards_count,
	       avoided_dark_areas_count, start_time, arrived_at, created_at
	FROM trip_history
	WHERE user_id = $1 AND status = 'completed' AND start_time >= $2 AND start_time <= $3
	ORDER BY start_time DESC;
	`
	rows, err := r.db.QueryContext(ctx, query, userID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("gagal query riwayat periode: %w", err)
	}
	defer rows.Close()

	var trips []*model.Trip
	var totalDistance float64
	var totalScore int
	var totalHazards int
	var totalDarkAreas int

	for rows.Next() {
		t, err := r.scanTrip(rows)
		if err != nil {
			return nil, err
		}
		trips = append(trips, t)
		totalDistance += t.DistanceKm
		totalScore += t.SafetyScore
		totalHazards += t.AvoidedHazardsCount
		totalDarkAreas += t.AvoidedDarkAreasCount
	}

	totalCompleted := len(trips)
	var avgScore float64
	if totalCompleted > 0 {
		avgScore = math.Round((float64(totalScore)/float64(totalCompleted))*10) / 10
	}

	resp := &model.TripHistoryResponse{
		Period:      period,
		PeriodLabel: periodLabel,
		Stats: model.TripStats{
			TotalCompleted:        totalCompleted,
			TotalDistanceKm:       math.Round(totalDistance*10) / 10,
			AverageSafetyScore:    avgScore,
			AvoidedHazardsCount:   totalHazards,
			AvoidedDarkAreasCount: totalDarkAreas,
		},
		Trips: trips,
	}

	return resp, nil
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

// SeedSampleTripsIfEmpty mengisi riwayat perjalanan interaktif awal jika pengguna belum memiliki catatan
func (r *postgresTripRepository) SeedSampleTripsIfEmpty(ctx context.Context, userID string) error {
	var sepCount, augCount int
	_ = r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM trip_history WHERE user_id = $1 AND start_time >= '2026-09-01' AND start_time <= '2026-09-30';", userID).Scan(&sepCount)
	_ = r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM trip_history WHERE user_id = $1 AND start_time >= '2026-08-01' AND start_time <= '2026-08-31';", userID).Scan(&augCount)

	loc := time.FixedZone("WIB", 7*3600)

	// Struktur data trip bulan September 2026 (18 perjalanan, 42.8 km, 95.4 skor, 6 titik rawan, 4 area gelap)
	sepTrips := []struct {
		id, origin, dest, mode, highlights string
		lat1, lng1, lat2, lng2, dist       float64
		dur, score, hazards, dark          int
		start, end                         time.Time
	}{
		{
			id: "trip_sep_01", origin: "Stasiun KAI Jatibarang", dest: "Perum Griya Asri Jatibarang", mode: "walk",
			lat1: -6.4741, lng1: 108.3075, lat2: -6.4820, lng2: 108.3150, dist: 2.1, dur: 14, score: 96,
			highlights: "Terpantau CCTV Dishub & Melewati Safe Haven Polsek Jatibarang", hazards: 1, dark: 1,
			start: time.Date(2026, 9, 17, 21, 30, 0, 0, loc), end: time.Date(2026, 9, 17, 21, 44, 0, 0, loc),
		},
		{
			id: "trip_sep_02", origin: "Alun-Alun Indramayu", dest: "Jatibarang (Rumah)", mode: "motor",
			lat1: -6.3263, lng1: 108.3200, lat2: -6.4741, lng2: 108.3075, dist: 15.4, dur: 23, score: 92,
			highlights: "Deviasi otomatis menghindari jalur gelap di Bypass Bulak", hazards: 2, dark: 1,
			start: time.Date(2026, 9, 16, 20, 15, 0, 0, loc), end: time.Date(2026, 9, 16, 20, 38, 0, 0, loc),
		},
		{
			id: "trip_sep_03", origin: "Polindra (Lohbener)", dest: "Simpang Lima Indramayu", mode: "motor",
			lat1: -6.3980, lng1: 108.2830, lat2: -6.3350, lng2: 108.3250, dist: 6.2, dur: 12, score: 95,
			highlights: "100% rute berpenerangan PJU aktif & ramai warga", hazards: 1, dark: 1,
			start: time.Date(2026, 9, 14, 19, 40, 0, 0, loc), end: time.Date(2026, 9, 14, 19, 52, 0, 0, loc),
		},
		{
			id: "trip_sep_04", origin: "Pasar Daerah Jatibarang", dest: "Griya Jatibarang", mode: "walk",
			lat1: -6.4710, lng1: 108.3100, lat2: -6.4820, lng2: 108.3150, dist: 1.8, dur: 18, score: 94,
			highlights: "Pengawal aktif memantau live trip share hingga tiba", hazards: 1, dark: 0,
			start: time.Date(2026, 9, 11, 22, 10, 0, 0, loc), end: time.Date(2026, 9, 11, 22, 28, 0, 0, loc),
		},
		{
			id: "trip_sep_05", origin: "RSUD Indramayu", dest: "Margadadi", mode: "motor",
			lat1: -6.3340, lng1: 108.3240, lat2: -6.3280, lng2: 108.3300, dist: 1.9, dur: 8, score: 98,
			highlights: "Melewati jalur protokol aman patroli Sabhara", hazards: 0, dark: 0,
			start: time.Date(2026, 9, 10, 18, 30, 0, 0, loc), end: time.Date(2026, 9, 10, 18, 38, 0, 0, loc),
		},
		{
			id: "trip_sep_06", origin: "Sport Center Indramayu", dest: "Sindang", mode: "motor",
			lat1: -6.3420, lng1: 108.3150, lat2: -6.3400, lng2: 108.2950, dist: 3.1, dur: 10, score: 97,
			highlights: "Koridor penerangan penuh & minim blindspot", hazards: 0, dark: 0,
			start: time.Date(2026, 9, 9, 21, 00, 0, 0, loc), end: time.Date(2026, 9, 9, 21, 10, 0, 0, loc),
		},
		{
			id: "trip_sep_07", origin: "Jatibarang Square", dest: "Bulak Lor", mode: "motor",
			lat1: -6.4750, lng1: 108.3090, lat2: -6.4550, lng2: 108.3180, dist: 2.7, dur: 9, score: 96,
			highlights: "Didampingi pemantauan sensor akselerometer aktif", hazards: 1, dark: 1,
			start: time.Date(2026, 9, 8, 20, 15, 0, 0, loc), end: time.Date(2026, 9, 8, 20, 24, 0, 0, loc),
		},
		{
			id: "trip_sep_08", origin: "Kantor Kecamatan Sindang", dest: "Terusan", mode: "walk",
			lat1: -6.3410, lng1: 108.2960, lat2: -6.3450, lng2: 108.3020, dist: 1.2, dur: 12, score: 99,
			highlights: "Jalur pedestrian terpantau CCTV warga", hazards: 0, dark: 0,
			start: time.Date(2026, 9, 7, 19, 10, 0, 0, loc), end: time.Date(2026, 9, 7, 19, 22, 0, 0, loc),
		},
		{
			id: "trip_sep_09", origin: "Simpang Lima Indramayu", dest: "Pekandangan", mode: "motor",
			lat1: -6.3350, lng1: 108.3250, lat2: -6.3500, lng2: 108.3100, dist: 2.3, dur: 7, score: 97,
			highlights: "Rute utama berlampu LED Dishub", hazards: 0, dark: 0,
			start: time.Date(2026, 9, 6, 21, 40, 0, 0, loc), end: time.Date(2026, 9, 6, 21, 47, 0, 0, loc),
		},
		{
			id: "trip_sep_10", origin: "Pantai Karangsong", dest: "Karanganyar", mode: "motor",
			lat1: -6.3100, lng1: 108.3550, lat2: -6.3290, lng2: 108.3200, dist: 6.1, dur: 16, score: 91,
			highlights: "Deviasi otomatis menghindari jalur sepi Muara", hazards: 0, dark: 0,
			start: time.Date(2026, 9, 5, 22, 00, 0, 0, loc), end: time.Date(2026, 9, 5, 22, 16, 0, 0, loc),
		},
	}

	insertQuery := `
	INSERT INTO trip_history (
		id, user_id, origin_name, destination_name,
		origin_lat, origin_lng, dest_lat, dest_lng,
		status, is_encrypted, mode, distance_km, duration_minutes,
		safety_score, protection_highlights, avoided_hazards_count,
		avoided_dark_areas_count, start_time, arrived_at, created_at
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
	ON CONFLICT (id) DO NOTHING;
	`

	for _, t := range sepTrips {
		_, _ = r.db.ExecContext(ctx, insertQuery,
			t.id, userID, t.origin, t.dest,
			t.lat1, t.lng1, t.lat2, t.lng2,
			"completed", true, t.mode, t.dist, t.dur,
			t.score, t.highlights, t.hazards,
			t.dark, t.start, t.end, t.start,
		)
	}

	// 8 trip pelengkap September untuk mencapai total 18 perjalanan & 42.8 km
	extraSepTrips := []struct {
		id, origin, dest, mode string
		dist                   float64
		dur, score             int
		day                    int
	}{
		{"trip_sep_11", "Jatibarang", "Kertasemaya", "motor", 2.2, 7, 95, 4},
		{"trip_sep_12", "Balongan", "Indramayu Kota", "motor", 1.8, 6, 96, 4},
		{"trip_sep_13", "Lohbener", "Sindang", "motor", 0.9, 4, 98, 3},
		{"trip_sep_14", "Simpang Lima", "Kepandean", "walk", 0.7, 9, 97, 3},
		{"trip_sep_15", "Pasar Baru", "Margadadi", "walk", 0.6, 7, 98, 2},
		{"trip_sep_16", "Terminal Sindang", "Alun-Alun", "motor", 1.2, 5, 96, 2},
		{"trip_sep_17", "Griya Asri", "Jatibarang Stasiun", "walk", 0.8, 10, 97, 1},
		{"trip_sep_18", "Bypass Lohbener", "Celancang", "motor", 0.8, 4, 95, 1},
	}
	for _, et := range extraSepTrips {
		st := time.Date(2026, 9, et.day, 20, 0, 0, 0, loc)
		ar := st.Add(time.Duration(et.dur) * time.Minute)
		_, _ = r.db.ExecContext(ctx, insertQuery,
			et.id, userID, et.origin, et.dest,
			-6.3263, 108.3200, -6.3350, 108.3250,
			"completed", true, et.mode, et.dist, et.dur,
			et.score, "Koridor terlindungi sistem AI JalanAman", 0, 0,
			st, ar, st,
		)
	}

	// Data riwayat bulan Agustus 2026 (Bulan Lalu) - 14 perjalanan, 35.2 km, 94.0 skor
	augTrips := []struct {
		id, origin, dest, mode string
		dist                   float64
		dur, score, hazards    int
		dark                   int
		day                    int
	}{
		{"trip_aug_01", "Alun-Alun Indramayu", "Jatibarang", "motor", 15.2, 24, 93, 2, 1, 28},
		{"trip_aug_02", "Stasiun KAI Jatibarang", "Perum Griya", "walk", 2.1, 15, 95, 1, 1, 26},
		{"trip_aug_03", "Polindra", "Simpang Lima", "motor", 6.2, 13, 94, 1, 1, 24},
		{"trip_aug_04", "Sindang", "RSUD Indramayu", "motor", 2.8, 8, 96, 0, 0, 21},
		{"trip_aug_05", "Pasar Jatibarang", "Bulak", "motor", 3.4, 9, 91, 1, 0, 18},
		{"trip_aug_06", "Karangampel", "Balongan", "motor", 2.5, 7, 92, 0, 0, 14},
		{"trip_aug_07", "Kecamatan Lohbener", "Polindra", "walk", 0.6, 8, 97, 0, 0, 12},
		{"trip_aug_08", "Simpang Lima", "Pasar Baru", "walk", 0.5, 6, 96, 0, 0, 10},
		{"trip_aug_09", "Jatibarang Square", "Griya Asri", "motor", 0.7, 4, 95, 0, 0, 9},
		{"trip_aug_10", "Alun-Alun", "Margadadi", "walk", 0.4, 5, 98, 0, 0, 8},
		{"trip_aug_11", "RSUD", "Kepandean", "motor", 0.3, 3, 95, 0, 0, 6},
		{"trip_aug_12", "Bypass Lohbener", "Sindang", "motor", 0.2, 2, 94, 0, 0, 4},
		{"trip_aug_13", "Stasiun KAI", "Pasar Jatibarang", "walk", 0.2, 3, 96, 0, 0, 3},
		{"trip_aug_14", "Simpang Lima", "Karanganyar", "motor", 0.1, 2, 94, 0, 0, 2},
	}
	for _, at := range augTrips {
		st := time.Date(2026, 8, at.day, 21, 15, 0, 0, loc)
		ar := st.Add(time.Duration(at.dur) * time.Minute)
		_, _ = r.db.ExecContext(ctx, insertQuery,
			at.id, userID, at.origin, at.dest,
			-6.3263, 108.3200, -6.3350, 108.3250,
			"completed", false, at.mode, at.dist, at.dur,
			at.score, "Terpantau radar pos pengamanan terpadu", at.hazards, at.dark,
			st, ar, st,
		)
	}

	return nil
}
