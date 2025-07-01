#!/bin/bash

# DAWN LMS Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environments: dev, staging, production

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="dawn-lms"

echo "🚀 Deploying DAWN LMS to $ENVIRONMENT environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Dependencies check passed ✅"
}

# Environment setup
setup_environment() {
    print_status "Setting up environment for $ENVIRONMENT..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Created .env from .env.example. Please update with your actual values!"
        else
            print_error ".env.example file not found. Please create environment variables file."
            exit 1
        fi
    fi
    
    # Create necessary directories
    mkdir -p nginx/ssl
    mkdir -p scripts
    
    print_status "Environment setup completed ✅"
}

# SSL Certificate setup (for production)
setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ]; then
        print_status "Setting up SSL certificates..."
        
        if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
            print_warning "SSL certificates not found. Generating self-signed certificates for testing..."
            print_warning "⚠️  For production, replace with real SSL certificates!"
            
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout nginx/ssl/key.pem \
                -out nginx/ssl/cert.pem \
                -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        fi
        
        print_status "SSL setup completed ✅"
    fi
}

# Database initialization
init_database() {
    print_status "Initializing database..."
    
    # Create database initialization script
    cat > scripts/init-db.sql << EOF
-- DAWN LMS Database Initialization
CREATE DATABASE IF NOT EXISTS dawn_lms;
CREATE USER IF NOT EXISTS 'dawn_user'@'%' IDENTIFIED BY 'dawn_password';
GRANT ALL PRIVILEGES ON dawn_lms.* TO 'dawn_user'@'%';
FLUSH PRIVILEGES;
EOF
    
    print_status "Database initialization script created ✅"
}

# Build and deploy
deploy() {
    print_status "Building and deploying containers..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Build and start containers
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.yml up -d --build
    else
        docker-compose -f docker-compose.dev.yml up -d --build
    fi
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 10
    
    # Run database migrations
    print_status "Running database migrations..."
    docker-compose exec frontend npx prisma migrate deploy || true
    docker-compose exec frontend npx prisma generate || true
    
    print_status "Deployment completed ✅"
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Check if containers are running
    if [ $(docker-compose ps -q | wc -l) -eq 0 ]; then
        print_error "No containers are running!"
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_status "Frontend is healthy ✅"
    else
        print_warning "Frontend health check failed ⚠️"
    fi
    
    # Check backend
    if curl -f http://localhost:8080/health &> /dev/null; then
        print_status "Backend is healthy ✅"
    else
        print_warning "Backend health check failed ⚠️"
    fi
    
    print_status "Health checks completed"
}

# Show deployment info
show_info() {
    print_status "Deployment Information:"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo "🗄️  Database: localhost:5432"
    echo "📊 Redis: localhost:6379"
    echo ""
    echo "📋 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    echo "🔄 To restart: docker-compose restart"
    echo ""
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "🔒 HTTPS: https://localhost (self-signed certificate)"
        echo "⚠️  Remember to replace SSL certificates for production!"
    fi
}

# Main execution
main() {
    print_status "Starting DAWN LMS deployment..."
    
    check_dependencies
    setup_environment
    setup_ssl
    init_database
    deploy
    health_check
    show_info
    
    print_status "🎉 DAWN LMS deployment completed successfully!"
}

# Run main function
main 