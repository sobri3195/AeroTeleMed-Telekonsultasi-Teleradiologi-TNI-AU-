# Deployment Guide - AeroTeleMed

## Prerequisites

- Node.js >= 18.x
- npm or yarn
- Web server (Nginx/Apache) or Docker
- SSL certificate for HTTPS

## Environment Configuration

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.aerotelemed.tni.mil.id/api

# Feature Flags
VITE_ENABLE_AI_TRIAGE=true
VITE_ENABLE_VIDEO_CALLS=true

# Video Service Configuration
VITE_VIDEO_SERVICE_URL=https://meet.aerotelemed.tni.mil.id
VITE_VIDEO_SERVICE_TYPE=jitsi

# PACS Configuration
VITE_PACS_URL=https://pacs.aerotelemed.tni.mil.id
VITE_DICOM_VIEWER_URL=https://viewer.aerotelemed.tni.mil.id

# Environment
VITE_APP_ENV=production
```

## Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# The production-ready files will be in the `dist` directory
```

## Deployment Options

### Option 1: Static Web Server (Nginx)

1. **Build the application**
```bash
npm run build
```

2. **Configure Nginx**

Create `/etc/nginx/sites-available/aerotelemed`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name aerotelemed.tni.mil.id;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name aerotelemed.tni.mil.id;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/aerotelemed.crt;
    ssl_certificate_key /etc/ssl/private/aerotelemed.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

    root /var/www/aerotelemed/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy (optional, if backend is on same server)
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Access and Error Logs
    access_log /var/log/nginx/aerotelemed-access.log;
    error_log /var/log/nginx/aerotelemed-error.log;
}
```

3. **Enable the site and restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/aerotelemed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Docker Deployment

1. **Create Dockerfile**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **Create docker-compose.yml**

```yaml
version: '3.8'

services:
  aerotelemed-frontend:
    build: .
    container_name: aerotelemed-frontend
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - aerotelemed-network

networks:
  aerotelemed-network:
    driver: bridge
```

4. **Build and run**
```bash
docker-compose up -d --build
```

### Option 3: Cloud Deployment (AWS S3 + CloudFront)

1. **Build the application**
```bash
npm run build
```

2. **Create S3 bucket**
```bash
aws s3 mb s3://aerotelemed-frontend
```

3. **Configure bucket for static website hosting**
```bash
aws s3 website s3://aerotelemed-frontend \
  --index-document index.html \
  --error-document index.html
```

4. **Upload files**
```bash
aws s3 sync dist/ s3://aerotelemed-frontend \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.html"

aws s3 cp dist/index.html s3://aerotelemed-frontend/index.html \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate"
```

5. **Create CloudFront distribution** (via AWS Console or CLI)

## Security Considerations

### 1. HTTPS Only
Always use HTTPS in production. Obtain SSL certificates from:
- Let's Encrypt (free)
- Internal TNI AU PKI
- Commercial CA

### 2. Content Security Policy
Configure CSP headers to prevent XSS attacks:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.aerotelemed.tni.mil.id wss://api.aerotelemed.tni.mil.id;
```

### 3. IP Whitelisting
Restrict access to TNI AU networks only:
```nginx
allow 10.0.0.0/8;
allow 172.16.0.0/12;
allow 192.168.0.0/16;
deny all;
```

### 4. Authentication
Ensure proper OAuth2.0/JWT configuration:
- Short token expiry (1 hour for access tokens)
- Secure refresh token storage
- 2FA enforcement
- Strong password policies

### 5. Audit Logging
Enable comprehensive logging:
- Access logs (nginx/server)
- Application logs
- Error tracking (Sentry, etc.)
- Security events

## Performance Optimization

### 1. Enable Compression
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. Set Cache Headers
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 3. Enable HTTP/2
```nginx
listen 443 ssl http2;
```

### 4. CDN Integration
Use CDN for static assets:
- CloudFlare
- AWS CloudFront
- Azure CDN

## Monitoring

### 1. Application Monitoring
- Use PM2 for process management (if using Node.js server)
- Set up health checks
- Monitor uptime

### 2. Server Monitoring
- CPU, Memory, Disk usage
- Network traffic
- Response times

### 3. Log Aggregation
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Grafana + Prometheus
- CloudWatch (AWS)

### 4. Error Tracking
- Sentry
- Rollbar
- Custom error logging

## Backup & Recovery

### 1. Regular Backups
```bash
# Backup script
#!/bin/bash
BACKUP_DIR=/backups/aerotelemed
DATE=$(date +%Y%m%d_%H%M%S)

# Backup application files
tar -czf $BACKUP_DIR/aerotelemed-$DATE.tar.gz /var/www/aerotelemed

# Backup configuration
cp /etc/nginx/sites-available/aerotelemed $BACKUP_DIR/nginx-config-$DATE.conf

# Keep only last 30 days of backups
find $BACKUP_DIR -type f -mtime +30 -delete
```

### 2. Disaster Recovery Plan
- Document recovery procedures
- Test restore procedures regularly
- Maintain off-site backups

## Scaling

### Horizontal Scaling
1. Load balancer (Nginx, HAProxy, AWS ELB)
2. Multiple frontend instances
3. Session management (Redis)

### Example Load Balancer Config
```nginx
upstream aerotelemed {
    least_conn;
    server frontend1.internal:80;
    server frontend2.internal:80;
    server frontend3.internal:80;
}

server {
    listen 443 ssl http2;
    server_name aerotelemed.tni.mil.id;

    location / {
        proxy_pass http://aerotelemed;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Maintenance

### Zero-Downtime Deployment
1. Build new version
2. Deploy to staging
3. Test thoroughly
4. Deploy to production with rolling update
5. Monitor for errors
6. Rollback if needed

### Example Deployment Script
```bash
#!/bin/bash
set -e

echo "Building application..."
npm run build

echo "Creating backup..."
tar -czf /backups/aerotelemed-$(date +%Y%m%d_%H%M%S).tar.gz /var/www/aerotelemed

echo "Deploying..."
rsync -av --delete dist/ /var/www/aerotelemed/

echo "Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment complete!"
```

## Troubleshooting

### Common Issues

1. **Blank page after deployment**
   - Check browser console for errors
   - Verify API_BASE_URL in .env
   - Check nginx error logs

2. **API calls failing**
   - Verify CORS configuration on backend
   - Check API endpoint URL
   - Verify SSL certificates

3. **WebSocket connection fails**
   - Check nginx WebSocket proxy configuration
   - Verify firewall rules
   - Check browser console for errors

4. **Performance issues**
   - Enable compression
   - Optimize images
   - Use CDN for static assets
   - Enable caching

## Support

For deployment support:
- Technical Team: tech-support@aerotelemed.tni.mil.id
- DevOps Team: devops@aerotelemed.tni.mil.id
- Emergency Hotline: (021) xxx-xxxx

---

**Last Updated**: December 2024
**Version**: 1.0.0
