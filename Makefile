# Makefile

.PHONY: start-mock start

start-mock:
	@echo "Starting Mock Service..."
	json-server --watch db.json --port 3000 &

start:
	@echo "Installing dependencies..."
	pnpm install
	@echo "Starting the project..."
	pnpm dev

all: start-mock start