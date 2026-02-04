FROM node:18-alpine AS builder

RUN apk update && \
    apk upgrade --no-cache && \
    apk --no-cache add libc6-compat curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application files
COPY . .

# Build Next.js application
RUN yarn build

# Verify build succeeded
RUN if [ -d ".next/" ]; then echo "build succeeded!"; else echo "**** build failed! ****" && exit 1; fi;

# Stage 2: Setup the runtime environment with nginx
FROM node:18-alpine

# Update the system and install nginx, gettext (for envsubst), and netcat (for health checks)
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache nginx gettext netcat-openbsd && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./
COPY .env.example ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy env-config template and update script
COPY public/env-config.js.template /usr/share/nginx/html/env-config.js.template
COPY updateconfigvars.sh /updateconfigvars.sh
RUN chmod +x /updateconfigvars.sh

# Create nginx directories
RUN mkdir -p /var/log/nginx /var/cache/nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /usr/share/nginx/html

# Expose port 80 (nginx)
EXPOSE 80

# Set environment variable
ENV NODE_ENV=production

# Use the update script as entrypoint, which will inject env vars and start both Next.js and nginx
ENTRYPOINT ["/updateconfigvars.sh"]
CMD ["nginx", "-g", "daemon off;"]

