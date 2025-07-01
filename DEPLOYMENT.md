# 🚀 DAWN LMS Deployment Guide

## Overview

DAWN LMS consists of:
- **Frontend**: Next.js (Port 3000)
- **Backend**: Go API (Port 8080) 
- **Database**: PostgreSQL (Port 5432)
- **Cache**: Redis (Port 6379)
- **Proxy**: Nginx (Ports 80/443)

## ✅ Prerequisites

- Docker & Docker Compose
- Git
- Domain name (for production)
- SSL certificates (for production)

## 🔧 Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values:**
   ```env
   # Database
   POSTGRES_PASSWORD=your_secure_password
   
   # Authentication  
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_SECRET=your-nextauth-secret
   
   # AI Services
   OPENAI_API_KEY=your_openai_key
   PINECONE_API_KEY=your_pinecone_key
   ```

## 🏠 Local Development

```bash
# Start development environment
./scripts/deploy.sh dev

# Or manually:
docker-compose -f docker-compose.dev.yml up -d

# Check health
curl http://localhost:3000/api/health
curl http://localhost:8080/health
```

## ☁️ VPS Production Deployment

### Method 1: GitHub → VPS (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **On your VPS:**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/dawn-lms.git
   cd dawn-lms
   
   # Setup environment
   cp .env.example .env
   nano .env  # Edit with production values
   
   # Deploy
   ./scripts/deploy.sh production
   ```

### Method 2: Direct Upload

```bash
# Upload to VPS
scp -r . user@your-vps:/opt/dawn-lms

# SSH and deploy
ssh user@your-vps
cd /opt/dawn-lms
./scripts/deploy.sh production
```

## 🧪 Testing Your Deployment

### Health Checks
```bash
# Frontend
curl https://yourdomain.com/api/health

# Backend  
curl https://yourdomain.com/api/v1/health

# Direct container access
curl http://localhost:3000/api/health
curl http://localhost:8080/health
```

### Functional Tests
```bash
# Test signup
curl -X POST https://yourdomain.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔧 Troubleshooting

### Check Container Status
```bash
docker-compose ps
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **SSL issues**: Update certificates in `nginx/ssl/`
3. **Database errors**: Check DATABASE_URL in .env
4. **Memory issues**: Increase Docker resources

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart frontend

# Rebuild and restart
docker-compose up -d --build frontend
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Resource Usage
```bash
docker stats
docker-compose top
```

## 🔒 Security for Production

1. **Update SSL certificates** in `nginx/ssl/`
2. **Change default passwords** in `.env`
3. **Enable firewall** on VPS
4. **Regular backups** of database
5. **Update Docker images** regularly

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run migrations if needed
docker-compose exec frontend npx prisma migrate deploy
```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U dawn_user dawn_lms > backup.sql

# Restore
docker-compose exec -T postgres psql -U dawn_user dawn_lms < backup.sql
```

## 🚀 Production Optimizations

1. **Use a CDN** for static assets
2. **Configure Redis persistence**
3. **Set up log rotation**
4. **Monitor with tools like Prometheus**
5. **Use environment-specific configs**

## 📞 Support

- Check logs: `docker-compose logs -f`
- Health endpoints: `/api/health` and `/health`
- Database connection: Check `.env` file
- Port conflicts: Update docker-compose ports 