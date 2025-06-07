# Deployment Architecture Documentation

## Overview
This document provides a comprehensive analysis of the deployment architecture for the Insurance Management System, covering current deployment patterns, production recommendations, and scalability considerations.

## Current Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────────────────┐
│                Development Environment                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐ │
│  │   Frontend      │    │   Backend       │    │Database │ │
│  │   (React)       │    │   (Flask)       │    │(SQLite) │ │
│  │   Port: 5173    │    │   Port: 5000    │    │ File    │ │
│  │   Vite Server   │◄──►│   Dev Server    │◄──►│ Based   │ │
│  └─────────────────┘    └─────────────────┘    └─────────┘ │
│           │                       │                         │
│           └───── localhost ───────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Development Services
- **Frontend**: `npm run dev` → Vite dev server on localhost:5173
- **Backend**: `python kalyan_logic.py` → Flask dev server on localhost:5000
- **Database**: `insurance.db` → Local SQLite file
- **CORS**: Enabled for cross-origin requests between ports

### Production Environment (AWS EC2)

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐ │
│  │   Frontend      │    │   Backend       │    │Database │ │
│  │   (Static)      │    │   (Flask)       │    │(SQLite) │ │
│  │   Port: 3000    │    │   Port: 5000    │    │ File    │ │
│  │   npx serve     │    │   Production    │    │ Based   │ │
│  └─────────────────┘    └─────────────────┘    └─────────┘ │
│           │                       │                         │
│           └── EC2 Internal ──────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Internet Access                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend: http://EC2_PUBLIC_IP:3000                      │
│  Backend:  http://EC2_PUBLIC_IP:5000                      │
│  Security Groups: Ports 3000, 5000 open                  │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Process Analysis

### Current Deployment Steps

#### Manual Deployment Process
```bash
# 1. EC2 Instance Setup
sudo apt update
sudo apt install -y nodejs npm python3 python3-pip

# 2. Application Deployment
git clone <repository>
cd <project>

# 3. Frontend Build & Deploy
npm install
npm run build
npx serve -s dist  # Runs on port 3000

# 4. Backend Deploy
pip3 install flask flask-cors
python3 kalyan_logic.py  # Runs on port 5000

# 5. Security Configuration
# Open ports 3000 and 5000 in EC2 Security Groups
```

#### Deployment Artifacts
- **Frontend**: Static files in `dist/` directory
- **Backend**: Python application files
- **Database**: SQLite file (created on first run)
- **Dependencies**: Node modules, Python packages

### Infrastructure Components

#### AWS EC2 Instance Requirements
- **Operating System**: Linux (Amazon Linux 2 or Ubuntu)
- **Instance Type**: t2.micro (sufficient for development)
- **Storage**: 20GB EBS volume (standard)
- **Network**: VPC with public subnet
- **Security Group**: Inbound rules for ports 80, 3000, 5000

#### Security Group Configuration
```
Inbound Rules:
├── HTTP (80) ──────► 0.0.0.0/0 (for future Nginx)
├── Custom (3000) ──► 0.0.0.0/0 (Frontend access)
├── Custom (5000) ──► 0.0.0.0/0 (Backend API)
└── SSH (22) ───────► <Your IP> (Management)

Outbound Rules:
└── All Traffic ────► 0.0.0.0/0 (Default)
```

## Production Architecture Recommendations

### Recommended Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────────┐                     │
│    Internet ──────►│  Load Balancer  │                     │
│                    │   (ALB/NLB)     │                     │
│                    └─────────┬───────┘                     │
│                              │                             │
│                              ▼                             │
│                    ┌─────────────────┐                     │
│                    │  Nginx Reverse  │                     │
│                    │  Proxy + SSL    │                     │
│                    └─────────┬───────┘                     │
│                              │                             │
│                ┌─────────────┼─────────────┐               │
│                ▼             ▼             ▼               │
│    ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐   │
│    │   Frontend      │  │   Backend       │  │Database │   │
│    │   (Static)      │  │   (Flask)       │  │(SQLite) │   │
│    │   Nginx Served  │  │   WSGI Server   │  │ or RDS  │   │
│    └─────────────────┘  └─────────────────┘  └─────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Nginx Configuration

#### Nginx Setup
```nginx
# /etc/nginx/sites-available/insurance-app
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private-key.pem;
    
    # Frontend (React Static Files)
    location / {
        root /var/www/insurance-app/dist;
        try_files $uri $uri/ /index.html;
        
        # Caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### WSGI Production Server

#### Gunicorn Configuration
```python
# gunicorn_config.py
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

#### Systemd Service
```ini
# /etc/systemd/system/insurance-app.service
[Unit]
Description=Insurance App Flask Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/insurance-app
Environment=PATH=/var/www/insurance-app/venv/bin
ExecStart=/var/www/insurance-app/venv/bin/gunicorn -c gunicorn_config.py kalyan_logic:app
Restart=always

[Install]
WantedBy=multi-user.target
```

## Container-Based Deployment

### Docker Architecture

#### Multi-Container Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=sqlite:///insurance.db
    volumes:
      - ./data:/app/data
    depends_on:
      - database
      
  database:
    image: postgres:13
    environment:
      - POSTGRES_DB=insurance
      - POSTGRES_USER=app_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

#### Frontend Dockerfile
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile
```dockerfile
# Dockerfile.backend
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-c", "gunicorn_config.py", "kalyan_logic:app"]
```

## Scalability Architecture

### Horizontal Scaling Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                 Horizontally Scaled Architecture           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐                │
│   Internet ──┤     Application Load        │                │
│              │     Balancer (ALB)          │                │
│              └─────────────┬───────────────┘                │
│                            │                                │
│              ┌─────────────┼─────────────┐                  │
│              ▼             ▼             ▼                  │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│   │   App Server 1  │ │   App Server 2  │ │   App Server N  ││
│   │   Frontend +    │ │   Frontend +    │ │   Frontend +    ││
│   │   Backend       │ │   Backend       │ │   Backend       ││
│   └─────────┬───────┘ └─────────┬───────┘ └─────────┬───────┘│
│             │                   │                   │        │
│             └─────────┬─────────┼─────────┬─────────┘        │
│                       ▼         ▼         ▼                  │
│              ┌─────────────────────────────────┐             │
│              │      Database Cluster           │             │
│              │   ┌───────────┐ ┌─────────────┐ │             │
│              │   │  Master   │ │   Read      │ │             │
│              │   │ (Write)   │ │ Replicas    │ │             │
│              │   └───────────┘ └─────────────┘ │             │
│              └─────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Scaling Configuration

#### AWS Auto Scaling Group
```yaml
# CloudFormation Template
AutoScalingGroup:
  Type: AWS::AutoScaling::AutoScalingGroup
  Properties:
    MinSize: 2
    MaxSize: 10
    DesiredCapacity: 3
    LaunchTemplate:
      LaunchTemplateId: !Ref LaunchTemplate
      Version: !GetAtt LaunchTemplate.LatestVersionNumber
    TargetGroupARNs:
      - !Ref ApplicationTargetGroup
    HealthCheckType: ELB
    HealthCheckGracePeriod: 300
    
ScalingPolicy:
  Type: AWS::AutoScaling::ScalingPolicy
  Properties:
    PolicyType: TargetTrackingScaling
    TargetTrackingConfiguration:
      TargetValue: 70.0
      PredefinedMetricSpecification:
        PredefinedMetricType: ASGAverageCPUUtilization
```

## Database Deployment Strategies

### SQLite Limitations in Production

#### Current Challenges
- **Concurrency**: Limited write concurrency
- **Backup**: File-based backup complexity
- **Scaling**: No horizontal scaling
- **Network Access**: Local file access only

### Database Migration Options

#### PostgreSQL on RDS
```yaml
# AWS RDS Configuration
DBInstance:
  Type: AWS::RDS::DBInstance
  Properties:
    DBInstanceClass: db.t3.micro
    Engine: postgres
    EngineVersion: '13.7'
    AllocatedStorage: 20
    StorageType: gp2
    DBName: insurance
    MasterUsername: admin
    MasterUserPassword: !Ref DBPassword
    VPCSecurityGroups:
      - !Ref DatabaseSecurityGroup
    MultiAZ: true
    BackupRetentionPeriod: 7
```

#### Database Connection Configuration
```python
# Production database configuration
import os
from sqlalchemy import create_engine

DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///insurance.db')

if DATABASE_URL.startswith('postgres'):
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_recycle=3600
    )
```

## Monitoring and Logging

### Application Monitoring

#### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'insurance-app'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: /metrics
    scrape_interval: 5s
```

#### Flask Metrics Integration
```python
# Add to kalyan_logic.py
from prometheus_flask_exporter import PrometheusMetrics

metrics = PrometheusMetrics(app)
metrics.info('app_info', 'Insurance Application', version='1.0.0')
```

### Centralized Logging

#### ELK Stack Configuration
```yaml
# elasticsearch.yml
cluster.name: insurance-logs
node.name: node-1
network.host: 0.0.0.0
discovery.type: single-node

# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][logtype] == "insurance-app" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "insurance-app-%{+YYYY.MM.dd}"
  }
}
```

## Backup and Disaster Recovery

### Backup Strategy

#### Database Backup
```bash
#!/bin/bash
# SQLite backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_FILE="/app/insurance.db"

# Create backup
sqlite3 $DB_FILE ".backup $BACKUP_DIR/insurance_backup_$DATE.db"

# Upload to S3
aws s3 cp $BACKUP_DIR/insurance_backup_$DATE.db s3://insurance-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "insurance_backup_*.db" -mtime +30 -delete
```

#### Application Backup
```bash
#!/bin/bash
# Application backup script
tar -czf /backups/app_backup_$(date +%Y%m%d).tar.gz \
    /var/www/insurance-app \
    --exclude=/var/www/insurance-app/node_modules \
    --exclude=/var/www/insurance-app/.git
```

### Disaster Recovery Plan

#### Recovery Time Objectives (RTO)
- **Database Recovery**: < 1 hour
- **Application Recovery**: < 30 minutes
- **Full System Recovery**: < 2 hours

#### Recovery Point Objectives (RPO)
- **Database**: < 1 hour (hourly backups)
- **Application**: Daily backups acceptable
- **Configuration**: Version controlled

## Deployment Automation

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        run: |
          # SSH into EC2 and deploy
          ssh -o StrictHostKeyChecking=no ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
          cd /var/www/insurance-app
          git pull origin main
          npm ci
          npm run build
          sudo systemctl restart insurance-app
          sudo systemctl reload nginx
          EOF
```

### Infrastructure as Code

#### Terraform Configuration
```hcl
# main.tf
provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "insurance_app" {
  ami           = "ami-0c55b159cbfafe1d0"
  instance_type = "t3.micro"
  
  security_groups = [aws_security_group.app_sg.name]
  
  user_data = file("userdata.sh")
  
  tags = {
    Name = "Insurance-App"
    Environment = "Production"
  }
}

resource "aws_security_group" "app_sg" {
  name = "insurance-app-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Security Considerations

### Production Security Checklist

#### Application Security
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure proper CORS origins
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Use environment variables for secrets
- [ ] Enable security headers

#### Infrastructure Security
- [ ] Restrict security group rules
- [ ] Use IAM roles and policies
- [ ] Enable CloudTrail logging
- [ ] Configure VPC with private subnets
- [ ] Implement network ACLs
- [ ] Use AWS Secrets Manager

#### Database Security
- [ ] Encrypt data at rest
- [ ] Encrypt data in transit
- [ ] Use strong passwords
- [ ] Implement backup encryption
- [ ] Configure access logging
- [ ] Regular security updates

## Cost Optimization

### AWS Cost Estimation

#### Development Environment
- **EC2 t2.micro**: $8.50/month
- **EBS 20GB**: $2.00/month
- **Data Transfer**: $1.00/month
- **Total**: ~$12/month

#### Production Environment
- **EC2 t3.small (2 instances)**: $30/month
- **RDS t3.micro**: $15/month
- **ALB**: $25/month
- **EBS Storage**: $5/month
- **Total**: ~$75/month

### Cost Optimization Strategies
1. **Reserved Instances**: 30-60% savings for predictable workloads
2. **Spot Instances**: Up to 90% savings for fault-tolerant workloads
3. **Auto Scaling**: Pay only for needed capacity
4. **CloudWatch**: Monitor and optimize resource usage
5. **Storage Optimization**: Use appropriate storage classes