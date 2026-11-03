# Lightweight LTS Node image
FROM node:20-alpine

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package manifests for optimal layer caching
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source
COPY . .

# Set non-root ownership
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose backend port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Start the application
CMD ["npm", "start"]
