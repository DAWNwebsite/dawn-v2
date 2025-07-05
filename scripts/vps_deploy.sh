#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

# Pull the latest changes from the main branch
git pull origin main

# Rebuild and restart the services with Docker Compose
docker-compose up -d --build

# Optional: Run database migrations if you have a separate migration script
# docker-compose exec backend ./scripts/migrate

echo "Deployment completed successfully!" 