#!/bin/bash

# Configuration
EC2_USER="ec2-user"
EC2_HOST="54.166.214.16"
KEY_PATH="./terraform-ec2-key-pair.pem"
REMOTE_DIR="~/profile_app"

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Copy only necessary files
echo "Copying necessary files..."
rsync -av --exclude 'node_modules' \
          --exclude '.next' \
          --exclude '.git' \
          --exclude 'coverage' \
          --exclude '.env*' \
          --exclude '*.log' \
          --exclude '.DS_Store' \
          --exclude '*.pem' \
          ./ "$TEMP_DIR/"

# Copy to EC2
echo "Copying to EC2..."
scp -i "$KEY_PATH" -r "$TEMP_DIR"/* "$EC2_USER@$EC2_HOST:$REMOTE_DIR"

# Clean up
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Deployment package created and uploaded successfully!"
echo "Now SSH into your EC2 instance and run:"
echo "cd $REMOTE_DIR"
echo "npm install"
echo "npm run build"
echo "pm2 start npm --name 'profile_app' -- start"