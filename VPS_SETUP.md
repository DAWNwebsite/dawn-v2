# 🖥️ VPS Setup Guide for DAWN LMS

## 📋 Prerequisites on VPS

- Ubuntu 20.04 or newer (recommended)
- At least 2GB RAM, 20GB storage
- Root or sudo access
- Domain name pointed to VPS IP (optional but recommended)

## 🔧 Step 1: Initial VPS Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git nano htop ufw

# Set up firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 🐳 Step 2: Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

## 📥 Step 3: Get Application Code

### Method A: From GitHub (Recommended)
```bash
# Clone your repository
git clone https://github.com/yourusername/dawn-lms.git
cd dawn-lms
```

### Method B: Upload from Local Machine
```bash
# On your local machine
scp -r . user@your-vps-ip:/opt/dawn-lms

# SSH to VPS
ssh user@your-vps-ip
cd /opt/dawn-lms
```

## ⚙️ Step 4: Configure Environment Variables

### Create the .env file:
```bash
# Copy the example file
cp .env.example .env

# Edit with nano (or vim if you prefer)
nano .env
```

### 🔑 Required Environment Variables

#### **Essential Variables (Must Change):**
```env
# Database - Change these passwords!
POSTGRES_PASSWORD=your_very_secure_password_123
REDIS_PASSWORD=your_redis_secure_password_456

# Security - Generate strong secrets!
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-characters-long

# Domain (if you have one)
NEXTAUTH_URL=https://yourdomain.com
# OR for testing: NEXTAUTH_URL=http://your-vps-ip:3000
```

#### **AI Services (Required for full functionality):**
```env
# OpenAI for AI features
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Pinecone for vector database (knowledge base)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=us-east-1-aws  # or your environment
PINECONE_INDEX=dawn-lms-knowledge
```

#### **Optional Variables:**
```env
# OAuth providers (for social login)
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🚀 Step 5: Deploy the Application

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Deploy in production mode
./scripts/deploy.sh production

# Or manually:
docker-compose up -d --build
```

## 🧪 Step 6: Test Your Deployment

### Health Checks:
```bash
# Test frontend health
curl http://localhost:3000/api/health

# Test backend health
curl http://localhost:8080/health

# Check container status
docker-compose ps
```

### Test API Endpoints:
```bash
# Test user registration
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test user login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🌐 Step 7: Access Your Application

- **Frontend**: `http://your-vps-ip:3000`
- **Backend API**: `http://your-vps-ip:8080`
- **With domain**: `https://yourdomain.com` (after SSL setup)

## 🔒 Step 8: SSL Setup (Production)

### Option A: Using Certbot (Free SSL)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Restart nginx container
docker-compose restart nginx
```

### Option B: Upload Your Own Certificates
```bash
# Copy your certificates to nginx/ssl/
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem

# Restart nginx
docker-compose restart nginx
```

## 🔧 Essential Commands for Management

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Restart Services:
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart frontend

# Rebuild and restart
docker-compose up -d --build
```

### Database Management:
```bash
# Backup database
docker-compose exec postgres pg_dump -U dawn_user dawn_lms > backup.sql

# Access database
docker-compose exec postgres psql -U dawn_user dawn_lms
```

### Update Application:
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run database migrations
docker-compose exec frontend npx prisma migrate deploy
```

## 🚨 Troubleshooting

### Check if services are running:
```bash
docker-compose ps
docker stats
```

### Common issues:
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Memory issues**: Increase swap or VPS RAM
3. **SSL errors**: Check certificate paths and permissions
4. **Database connection**: Verify DATABASE_URL in .env

### Get help:
```bash
# Check logs for errors
docker-compose logs -f

# Check container resources
docker stats

# Restart everything fresh
docker-compose down && docker-compose up -d --build
```

## 🎯 Quick Reference Commands

```bash
# Deploy fresh
./scripts/deploy.sh production

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Start everything
docker-compose up -d

# Restart single service
docker-compose restart frontend

# Update application
git pull && docker-compose up -d --build
```

Your DAWN LMS should now be running at `http://your-vps-ip:3000`! 🎉 