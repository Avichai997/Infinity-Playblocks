FROM node:20-alpine

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
    echo 'if [ "$NODE_ENV" = "development" ]; then' >> /entrypoint.sh && \
    echo '  exec npm run start:dev' >> /entrypoint.sh && \
    echo 'else' >> /entrypoint.sh && \
    echo '  npm run build && exec npm run start:prod' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Expose port
EXPOSE 3001

CMD ["/entrypoint.sh"]
