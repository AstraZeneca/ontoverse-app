# Docker Build and Test Guide

## Prerequisites
- Docker installed and running

## Building the Docker Image

### Basic Build
```bash
docker build -t odsp-ontoverse:latest .
```

### Build with a specific tag
```bash
docker build -t odsp-ontoverse:v1.0.0 .
```

## Running the Docker Container

### Basic Run (Port 80 - nginx)
```bash
docker run -p 80:80 odsp-ontoverse:latest
```

### Run with Environment Variables
```bash
docker run -p 80:80 \
  -e CONFIG_ID=SMALL \
  odsp-ontoverse:latest
```

### Run in Detached Mode (Background)
```bash
docker run -d -p 80:80 --name ontoverse-app odsp-ontoverse:latest
```

### Run with Environment File (Recommended)

**Option 1: Use your existing `.env.local` file**
```bash
docker run -p 80:80 --env-file .env.local --name ontoverse-app odsp-ontoverse:latest
```

**Option 2: Create a `.env.docker` file**
Create a `.env.docker` file with required variables:
```bash
# Neo4j Database Configuration (Required)
DB_SCHEME=neo4j
DB_HOST=your-neo4j-host
DB_PORT=7687
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database

# Application Configuration (Optional)
CONFIG_ID=MEDIUM
```

Then run:
```bash
docker run -p 80:80 --env-file .env.docker --name ontoverse-app odsp-ontoverse:latest
```

**Required Environment Variables:**
- `DB_SCHEME` - Neo4j connection scheme (neo4j, neo4j+s, neo4j+ssc)
- `DB_HOST` - Neo4j host address (see below for important notes)
- `DB_PORT` - Neo4j port (default: 7687)
- `DB_USERNAME` - Neo4j username
- `DB_PASSWORD` - Neo4j password
- `DB_DATABASE` - Neo4j database name

**Important: DB_HOST Configuration**

The `DB_HOST` value depends on where your Neo4j database is running:

1. **If Neo4j is running on your local machine (host):**
   - Use `host.docker.internal` (works on Mac, Windows, and modern Linux)
   - Example: `DB_HOST=host.docker.internal`
   - This allows the Docker container to connect to services on your host machine

2. **If Neo4j is in another Docker container:**
   - Use the container name or service name
   - Make sure both containers are on the same Docker network
   - Example: `DB_HOST=neo4j-container` or `DB_HOST=neo4j-service`

3. **If Neo4j is on a remote server:**
   - Use the actual hostname or IP address
   - Example: `DB_HOST=neo4j.example.com` or `DB_HOST=192.168.1.100`

4. **If Neo4j is in the same Docker network:**
   - Use Docker Compose service name or container name
   - Example: `DB_HOST=neo4j` (if service is named "neo4j")

**Optional Environment Variables:**
- `CONFIG_ID` - Configuration ID (default: MEDIUM). Options: SMALL, MEDIUM

## Testing the Container

### 1. Check if Container is Running
```bash
docker ps
```

### 2. View Container Logs
```bash
# If running in detached mode
docker logs ontoverse-app

# Follow logs in real-time
docker logs -f ontoverse-app
```

### 3. Test the Application
Once the container is running, test it:

```bash
# Check if the server is responding
curl http://localhost

# Or open in browser
open http://localhost
```

### 4. Execute Commands Inside Container
```bash
# Open a shell in the running container
docker exec -it ontoverse-app sh

# Check if Next.js files are present
docker exec ontoverse-app ls -la .next
```

### 5. Check Container Health
```bash
# View container stats
docker stats ontoverse-app

# Inspect container details
docker inspect ontoverse-app
```

## Stopping and Cleaning Up

### Stop the Container
```bash
docker stop ontoverse-app
```

### Remove the Container
```bash
docker rm ontoverse-app
```

### Remove the Image
```bash
docker rmi odsp-ontoverse:latest
```

## Troubleshooting

### View Build Logs
If the build fails, check the output for errors:
```bash
docker build -t odsp-ontoverse:latest . 2>&1 | tee build.log
```

### Test Build Without Cache
```bash
docker build --no-cache -t odsp-ontoverse:latest .
```

### Check Image Size
```bash
docker images odsp-ontoverse
```

### Run with Different Port
If port 80 is already in use:
```bash
docker run -p 8080:80 odsp-ontoverse:latest
# Then access at http://localhost:8080
```

**Note:** The application uses nginx as a reverse proxy to the Next.js server. Nginx listens on port 80 inside the container and proxies requests to the Next.js server running on port 3000 internally.

## Quick Test Script

Save this as `test-docker.sh`:

```bash
#!/bin/bash

IMAGE_NAME="odsp-ontoverse:latest"
CONTAINER_NAME="ontoverse-test"

echo "Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    echo "Stopping any existing container..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
    
    echo "Starting container..."
    docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME
    
    echo "Waiting for container to start..."
    sleep 5
    
    echo "Testing application..."
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application is running successfully!"
        echo "Access it at: http://localhost:3000"
    else
        echo "❌ Application failed to start. Check logs:"
        docker logs $CONTAINER_NAME
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
```

Make it executable and run:
```bash
chmod +x test-docker.sh
./test-docker.sh
```


