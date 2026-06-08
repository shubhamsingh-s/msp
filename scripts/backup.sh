#!/bin/bash

# ==============================================================================
# Maa Sukriti Pharmaceuticals - Hostinger VPS Automated Backup Script
# ==============================================================================
# This script performs a full backup of the MySQL database and compresses the
# application directory. It keeps a rolling history of the last 7 backups.
#
# To automate this script daily, add it to crontab:
# 1. Run: crontab -e
# 2. Add this line (to run daily at 2:00 AM):
#    0 2 * * * /bin/bash /var/www/msp/scripts/backup.sh >> /var/www/msp/scripts/backup.log 2>&1
# ==============================================================================

# Configurations
APP_NAME="msp-nextgen"
BACKUP_DIR="/var/backups/msp"
SOURCE_DIR="/var/www/msp"
RETENTION_DAYS=7

# Load Database variables from .env file if it exists
if [ -f "$SOURCE_DIR/.env" ]; then
    export $(grep -v '^#' "$SOURCE_DIR/.env" | xargs)
fi

DB_USER=${DB_USER:-"msp_user"}
DB_NAME=${DB_NAME:-"msp_db"}
DB_PASS=${DB_PASSWORD:-"your_secure_password"}
DB_HOST=${DB_HOST:-"localhost"}

# Get Current Date/Time
DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$DATE"

# Create backup directory
mkdir -p "$BACKUP_PATH"

echo "=== Backup Started: $(date) ==="

# 1. Dump MySQL Database
echo "Backing up database ($DB_NAME)..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_PATH/db_backup_$DB_NAME.sql"

if [ $? -eq 0 ]; then
    echo "Database backup completed successfully."
else
    echo "ERROR: Database backup failed!" >&2
fi

# 2. Archive Application Source Code (excluding node_modules and .git)
echo "Archiving application files..."
tar --exclude="$SOURCE_DIR/node_modules" \
    --exclude="$SOURCE_DIR/.git" \
    --exclude="$SOURCE_DIR/.env" \
    -czf "$BACKUP_PATH/source_backup_$APP_NAME.tar.gz" -C "$SOURCE_DIR" .

if [ $? -eq 0 ]; then
    echo "Source code archive completed successfully."
else
    echo "ERROR: Source code archive failed!" >&2
fi

# 3. Compress the entire backup folder
cd "$BACKUP_DIR"
tar -czf "$DATE.tar.gz" "$DATE"
rm -rf "$DATE"

echo "Backup file created: $BACKUP_DIR/$DATE.tar.gz"

# 4. Retention Policy: Remove backups older than X days
echo "Applying retention policy (deleting backups older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "=== Backup Completed: $(date) ==="
echo "=========================================="
