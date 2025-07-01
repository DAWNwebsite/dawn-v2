# DAWN LMS - Personalized Learning Management System

DAWN is an AI-powered Learning Management System designed to support students with learning differences including ADHD, Dyslexia, and Autism. It provides personalized learning paths, accessibility features, and comprehensive diagnostic tools.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)
- Go 1.21+ (for backend development)

### 🔧 Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd DAWN
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Deploy with Docker:**
   ```bash
   # For production deployment
   ./scripts/deploy.sh production

   # For development
   ./scripts/deploy.sh dev
   ```

## 🏗️ Architecture

### Services

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Prisma ORM
- **Backend**: Go with Gin framework, JWT authentication
- **Database**: PostgreSQL (production) / SQLite (development)
- **Cache/Sessions**: Redis
- **Reverse Proxy**: Nginx (production)
- **AI Services**: OpenAI, Pinecone Vector DB

### Ports

- **Frontend**: 3000
- **Backend API**: 8080  
- **Database**: 5432
- **Redis**: 6379
- **Nginx**: 80/443

## 🐳 Docker Deployment

### Local Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Deployment

```bash
# Deploy to production
./scripts/deploy.sh production

# Or manually:
docker-compose up -d --build

# Scale services
docker-compose up -d --scale frontend=2 --scale backend=2
```

## ☁️ VPS Deployment

### Method 1: GitHub + Docker Hub (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Set up GitHub Actions (Optional):**
   - Creates automatic Docker Hub builds
   - Enables CI/CD pipeline
   - See `.github/workflows/` for examples

3. **Deploy on VPS:**
   ```bash
   # On your VPS
   git clone <your-github-repo>
   cd DAWN
   cp .env.example .env
   # Edit .env with production values
   ./scripts/deploy.sh production
   ```

### Method 2: Direct VPS Deployment

```bash
# Transfer files to VPS
scp -r . user@your-vps-ip:/path/to/dawn

# SSH into VPS
ssh user@your-vps-ip
cd /path/to/dawn

# Deploy
./scripts/deploy.sh production
```

## 🔧 Testing Your Application

### Local Testing

```bash
# Health checks
curl http://localhost:3000/api/health
curl http://localhost:8080/health

# Frontend
open http://localhost:3000

# API endpoints
curl http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Load Testing

```bash
# Install dependencies
npm install -g artillery

# Run load tests
cd load-tests
artillery run api-load-test.js
```

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend/dawn-lms
go mod download
go run main.go
```

### Database Migrations

```bash
# Run migrations
docker-compose exec frontend npx prisma migrate dev

# Reset database
docker-compose exec frontend npx prisma migrate reset

# Generate Prisma client
docker-compose exec frontend npx prisma generate
```

## 📋 Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dawn_lms
POSTGRES_DB=dawn_lms
POSTGRES_USER=dawn_user
POSTGRES_PASSWORD=your_secure_password

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# AI Services
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
```

## 🔒 Security

- SSL/TLS encryption (production)
- JWT authentication
- Rate limiting
- CORS configuration
- Input validation
- Security headers

## 📊 Monitoring

### Health Checks

- Frontend: `GET /api/health`
- Backend: `GET /health`  
- Database: Built-in health checks
- Redis: Built-in health checks

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8080, 5432, 6379 are available
2. **Database connection**: Check DATABASE_URL and credentials
3. **SSL issues**: Replace self-signed certificates for production
4. **Memory issues**: Increase Docker memory allocation

### Debug Commands

```bash
# Check container status
docker-compose ps

# Restart specific service
docker-compose restart frontend

# Rebuild and restart
docker-compose up -d --build frontend

# Access container shell
docker-compose exec frontend sh
docker-compose exec backend sh
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /user/profile` - Get user profile

### Student Endpoints

- `POST /student/new` - Create student profile
- `GET /student/all` - Get all students
- `GET /student/:id` - Get specific student

### Course Endpoints

- `POST /course/new` - Create course
- `GET /course/all` - Get all courses
- `GET /course/:id` - Get specific course

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` directory
- **Discord**: [Community Server]
- **Email**: support@dawn-lms.com 