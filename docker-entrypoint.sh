#!/bin/sh

# 1. Ensure the persistent storage subdirectories exist
mkdir -p /var/www/html/storage/app/public
mkdir -p /var/www/html/storage/app/private

# 2. Copy default assets if they are missing in the persistent volume
if [ ! -f /var/www/html/storage/app/public/default_logo.png ] && [ -f /var/www/html/storage_backup/public/default_logo.png ]; then
    echo "Initializing default logo in persistent storage..."
    cp /var/www/html/storage_backup/public/default_logo.png /var/www/html/storage/app/public/default_logo.png
fi

# 3. Ensure proper permissions on the volume
chown -R www-data:www-data /var/www/html/storage/app

# 4. Generate symlink, run migrations, and start server
php artisan storage:link --force
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=8080
