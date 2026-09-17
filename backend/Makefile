.PHONY: all build run swag test clean

SWAG := $(shell which swag 2>/dev/null || echo $(HOME)/go/bin/swag)

all: build

# Generate Swagger / OpenAPI docs
swag:
	@echo "==> Generating Swagger documentation..."
	@$(SWAG) init -g cmd/api/main.go -o docs
	@echo "==> Swagger docs generated successfully in ./docs"

# Build binary
build: swag
	@echo "==> Building JalanAman API Gateway binary..."
	@go build -o bin/api cmd/api/main.go

# Run server with auto-regeneration
run: swag
	@echo "==> Starting backend server..."
	@go run cmd/api/main.go

# Clean compiled artifacts
clean:
	@rm -rf bin docs/docs.go docs/swagger.json docs/swagger.yaml
