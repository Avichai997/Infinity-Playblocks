FROM node:20-alpine

# Install netcat for database health check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Create entrypoint script in /entrypoint.sh (outside /app so it won't be overridden by volumes)
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'cd /app' >> /entrypoint.sh && \
    echo '# Wait for database to be ready' >> /entrypoint.sh && \
    echo 'until nc -z ${DB_HOST:-localhost} ${DB_PORT:-5432}; do' >> /entrypoint.sh && \
    echo '  echo "Waiting for database..."' >> /entrypoint.sh && \
    echo '  sleep 1' >> /entrypoint.sh && \
    echo 'done' >> /entrypoint.sh && \
    echo '# Run migrations' >> /entrypoint.sh && \
    echo 'if [ "$NODE_ENV" = "production" ]; then' >> /entrypoint.sh && \
    echo '  npm run build' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'npm run migration:run || echo "Migration failed or already applied"' >> /entrypoint.sh && \
    echo 'if [ "$NODE_ENV" = "development" ]; then' >> /entrypoint.sh && \
    echo '  exec npm run start:dev' >> /entrypoint.sh && \
    echo 'else' >> /entrypoint.sh && \
    echo '  exec npm run start:prod' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Expose port
EXPOSE 3001

CMD ["/entrypoint.sh"]
