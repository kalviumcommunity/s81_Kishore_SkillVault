# Stage 1: Build React Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for optimal caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source code and compile
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight, secure Nginx
FROM nginx:1.27-alpine

# Copy Nginx SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
