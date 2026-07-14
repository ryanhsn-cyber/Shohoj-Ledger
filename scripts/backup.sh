#!/bin/bash
# Backup Automation Script for Shohoj Ledger
# Dumps the PostgreSQL database and uploads it to MinIO

set -e

BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="db_backup_${TIMESTAMP}.sql"
FILEPATH="${BACKUP_DIR}/${FILENAME}"

echo "Starting Postgres Database Dump..."
# Run pg_dump via the docker-compose postgres service
# Using the credentials from docker-compose.yml (crm / crm_finance)
docker compose exec -T postgres pg_dump -U crm crm_finance > "$FILEPATH"

if [ -s "$FILEPATH" ]; then
    echo "Database dump successful: ${FILEPATH}"
else
    echo "Database dump failed or is empty!"
    exit 1
fi

echo "Uploading to MinIO..."
# Use a temporary minio/mc docker container to copy the file to MinIO
# We use the host network to access localhost:9000
MINIO_URL="http://localhost:9000"
MINIO_USER="minioadmin"
MINIO_PASS="minioadmin"
BUCKET_NAME="backups"

# Configure MinIO Alias
docker run --rm --network host minio/mc alias set myminio $MINIO_URL $MINIO_USER $MINIO_PASS

# Create Bucket if it doesn't exist
docker run --rm --network host minio/mc mb myminio/$BUCKET_NAME --ignore-existing

# Upload the file
docker run --rm --network host -v $(pwd)/backups:/backups minio/mc cp "/backups/${FILENAME}" myminio/$BUCKET_NAME/

echo "Backup uploaded successfully to MinIO (myminio/${BUCKET_NAME}/${FILENAME})"

# Optional: Rotate local backups (Keep last 7 days)
find "$BACKUP_DIR" -type f -name "*.sql" -mtime +7 -exec rm {} \;
echo "Old local backups cleaned up."

echo "Backup process complete."
