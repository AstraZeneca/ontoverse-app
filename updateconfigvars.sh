#!/bin/sh
echo "Injecting config..."
echo "CONFIG_ID=$CONFIG_ID"

# This script is used to replace environment variables in a template file with their actual values.
# It uses the envsubst command to perform the substitution and then starts services.
# envsubst is a tool that substitutes environment variables in a file.
# 	•	< reads the template file (env-config.js.template), where you have placeholders like ${CONFIG_ID}.
# 	•	It replaces ${CONFIG_ID} (and any other ${PLACEHOLDER}) with their actual values from environment variables set in Docker (docker run -e).
# 	•	> writes the output to a new file called env-config.js, which the browser will load.
# So effectively it replaces ${CONFIG_ID} with the actual env var
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js

# Additionally, generate a runtime .env file from the copied /app/.env.example using DB_* env vars.
# These vars must be provided via docker run -e or container orchestrator. Missing vars will be substituted with empty strings.
if [ -f /app/.env.example ]; then
    echo "Generating /app/.env from /app/.env.example with envsubst..."
    # Only substitute the listed variables to avoid accidental replacement of other patterns.
    envsubst '$DB_SCHEME,$DB_HOST,$DB_PORT,$DB_USERNAME,$DB_PASSWORD,$DB_DATABASE,$CONFIG_ID' < /app/.env.example > /app/.env
    echo "Generated /app/.env (password masked):"
    # Mask password when echoing to logs
    sed 's/\(DB_PASSWORD=\).*/\1****/' /app/.env || true
else
    echo "Warning: /app/.env.example not found; skipping .env generation"
fi

# show the contents of the generated env-config.js file
echo "Generated env-config.js:"
cat /usr/share/nginx/html/env-config.js

# Start Next.js server in the background
echo "Starting Next.js server..."
cd /app && yarn start &
NEXTJS_PID=$!

# Wait a moment for Next.js to start
sleep 3

# Check if Next.js is running
if ! kill -0 $NEXTJS_PID 2>/dev/null; then
    echo "Error: Next.js server failed to start"
    exit 1
fi

echo "Next.js server started (PID: $NEXTJS_PID)"

# Trap signals to gracefully shutdown both processes
trap "echo 'Shutting down...'; kill $NEXTJS_PID 2>/dev/null; exit" SIGTERM SIGINT

# Start Nginx in foreground
echo "Starting Nginx..."
exec "$@"