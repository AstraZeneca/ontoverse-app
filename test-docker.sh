#!/bin/bash


# Allow DB_PASSWORD to be passed as a parameter, default to 'testtest' if not provided
DB_PASSWORD="${1:-testtest}"
IMAGE_NAME="odsp-ontoverse:latest"
CONTAINER_NAME="ontoverse-test"

echo "Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "Stopping any existing container..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
    
    echo "Starting container with environment variables..."
    docker run -d -p 80:80 \
        -e DB_SCHEME=neo4j \
        -e DB_HOST=host.docker.internal \
        -e DB_PORT=7687 \
        -e DB_USERNAME=neo4j \
        -e DB_PASSWORD="$DB_PASSWORD" \
        -e DB_DATABASE=neo4j \
        -e CONFIG_ID=SMALL \
        --name $CONTAINER_NAME $IMAGE_NAME
    
    echo "Waiting for container to start (this may take 10-30 seconds)..."
    MAX_WAIT=30
    WAIT_COUNT=0
    while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
        if curl -f http://localhost > /dev/null 2>&1; then
            echo "✅ Application is ready!"
            break
        fi
        sleep 1
        WAIT_COUNT=$((WAIT_COUNT + 1))
        if [ $((WAIT_COUNT % 5)) -eq 0 ]; then
            echo "  Still waiting... ($WAIT_COUNT/$MAX_WAIT seconds)"
        fi
    done
    
    echo "Testing application..."
    if curl -f http://localhost > /dev/null 2>&1; then
        echo "✅ Application is running successfully!"
        echo "Access it at: http://localhost"
        echo ""
        echo "To view logs: docker logs -f $CONTAINER_NAME"
        echo "To stop: docker stop $CONTAINER_NAME"
    else
        echo "❌ Application failed to start. Check logs:"
        docker logs $CONTAINER_NAME
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi


