#!/bin/sh
# Exit immediately if a command exits with a non-zero status
set -e

# Print startup message
echo "Starting Nura frontend..."

# Example: replace env variables in JS config files (optional)
# Uncomment if you have a template JS file:
# envsubst < /usr/share/nginx/html/assets/config.template.js > /usr/share/nginx/html/assets/config.js

# Execute the command provided in CMD
exec "$@"