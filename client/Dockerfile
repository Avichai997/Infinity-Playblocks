FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create entrypoint script in /entrypoint.sh (outside /app so it won't be overridden by volumes)
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'cd /app' >> /entrypoint.sh && \
    echo 'if [ "$NODE_ENV" = "development" ]; then' >> /entrypoint.sh && \
    echo '  exec npm run dev -- --host --port 5173' >> /entrypoint.sh && \
    echo 'else' >> /entrypoint.sh && \
    echo '  npm run build && exec npm run preview' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Expose port
EXPOSE 5173

CMD ["/entrypoint.sh"]
