# JalanAman Backend API Gateway (Golang)

Backend service untuk platform keselamatan rute cerdas **JalanAman**, dibangun menggunakan **Go (Golang)** dengan pendekatan **MVC (Model-View-Controller)**, **Clean Code**, dan **SOLID Principles**.

---

## 🏛️ Pola Arsitektur MVC & SOLID

```
backend/
├── cmd/
│   └── api/
│       └── main.go               # [Bootstrap & DI Root] Wire dependencies & start HTTP server
├── internal/
│   ├── config/                   # [Config] Memuat .env dan spesifikasi database PostgreSQL
│   ├── database/                 # [DB Connection Pool] Inisialisasi koneksi postgres dengan ping check
│   ├── model/                    # [M - Model] Domain Entity murni & validasi data internal
│   ├── view/                     # [V - View] Presenter / DTO (Format payload JSON ke client)
│   ├── controller/               # [C - Controller] HTTP Handler transport, parsing params, render View
│   ├── service/                  # [Business Logic] Interface & logika use-case (terisolasi dari HTTP)
│   ├── repository/               # [Data Access] Interface kontrak database (SOLID DIP)
│   ├── route/                    # [Router] Registrasi routing RESTful endpoint
│   └── middleware/               # [Cross-Cutting] Logger, CORS, Recovery middleware
├── pkg/
│   └── response/                 # Standarisasi envelope respons JSON {success, message, data, errors}
├── .env                          # Konfigurasi lokal (PostgreSQL credentials)
├── .env.example                  # Template env
├── .gitignore
├── go.mod
└── go.sum
```

### Penerapan SOLID Principles:
1. **S - Single Responsibility Principle (SRP)**:
   - `model`: Hanya mendefinisikan entitas data domain.
   - `view`: Hanya memformat DTO respons ke client.
   - `controller`: Hanya menangani parsing HTTP request dan memanggil service.
   - `service`: Hanya menangani aturan bisnis (business rules).
   - `repository`: Hanya menangani operasi query ke storage/database.
2. **O - Open/Closed Principle (OCP)**:
   - Penambahan storage baru (mis. Redis cache, Mock DB untuk testing) dilakukan dengan mengimplementasikan `IncidentRepository` tanpa mengubah kode `service` atau `controller`.
3. **L - Liskov Substitution Principle (LSP)**:
   - Setiap implementasi yang memenuhi interface `IncidentRepository` dapat saling menggantikan tanpa merusak fungsionalitas service.
4. **I - Interface Segregation Principle (ISP)**:
   - Interface dibuat terfokus dan modular (mis. `IncidentRepository`, `IncidentService`), tidak ada interface monolitik.
5. **D - Dependency Inversion Principle (DIP)**:
   - `Controller` bergantung pada abstraksi `IncidentService` (bukan struct konkrit).
   - `Service` bergantung pada abstraksi `IncidentRepository` (bukan `*sql.DB` langsung).
   - Seluruh dependency diinjeksi melalui konstruktor di `cmd/api/main.go`.

---

## ⚙️ Konfigurasi Lingkungan (`.env`)

File `.env` telah dikonfigurasi ke PostgreSQL lokal:

```env
PORT=8080
APP_ENV=development
APP_NAME=JalanAman API Gateway

DB_HOST=localhost
DB_PORT=5432
DB_USER=muhfaiizr
DB_PASSWORD=
DB_NAME=jalanaman
DB_SSLMODE=disable

DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=10
DB_CONN_MAX_LIFETIME=5m
```

---

## 🚀 Cara Menjalankan Backend

### 1. Build Project
```bash
go build ./...
```

### 2. Jalankan Server
```bash
go run cmd/api/main.go
```

### 3. Akses Dokumentasi Swagger / OpenAPI (Interaktif)
Buka browser ke:
👉 **[http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)** (atau otomatis redirect dari `http://localhost:8080/swagger`)

File spesifikasi mentah:
- JSON: `http://localhost:8080/swagger/doc.json`
- YAML: `backend/docs/swagger.yaml`

---

## 🔄 Mekanisme Auto-Update Dokumentasi Swagger

Dokumentasi OpenAPI/Swagger akan **selalu terupdate otomatis** melalui 3 mekanisme:
1. **Otomatis Saat Server Dijalankan di Mode Dev**:
   - Fungsi `autoGenerateSwagger()` pada `cmd/api/main.go` otomatis menjalankan `swag init` setiap kali `go run cmd/api/main.go` dimulai pada `APP_ENV=development`.
2. **Via Makefile**:
   ```bash
   make swag   # Generate dokumentasi swagger
   make run    # Auto-generate lalu jalankan server
   ```
3. **Via Go Generate**:
   ```bash
   go generate ./...
   ```
