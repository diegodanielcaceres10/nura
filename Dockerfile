# ------------------------------------------------------------
# Base image with Node.js runtime
# We use the Debian Bullseye variant for better compatibility
# with native dependencies compared to Alpine.
# ------------------------------------------------------------
FROM node:20-bullseye

# ------------------------------------------------------------
# Set the working directory inside the container
# All subsequent commands will run from /app
# ------------------------------------------------------------
WORKDIR /app

# ------------------------------------------------------------
# Install Angular CLI globally
# This allows us to run ng commands inside the container
# ------------------------------------------------------------
RUN npm install -g @angular/cli

# ------------------------------------------------------------
# Copy only package.json and package-lock.json first
# This leverages Docker layer caching to avoid reinstalling
# dependencies on every code change.
# ------------------------------------------------------------
COPY frontend/package*.json ./

# ------------------------------------------------------------
# Install project dependencies
# ------------------------------------------------------------
RUN npm install

# ------------------------------------------------------------
# Copy the rest of the frontend source code
# ------------------------------------------------------------
COPY frontend/ ./

# ------------------------------------------------------------
# Disable Angular CLI analytics to prevent interactive prompts
# when the container starts (important for non-TTY environments)
# ------------------------------------------------------------
RUN ng analytics disable

# ------------------------------------------------------------
# Expose Angular development server port
# Default Angular port is 4200
# ------------------------------------------------------------
EXPOSE 4200

# ------------------------------------------------------------
# Start the Angular development server
# npm start should map to: ng serve --host 0.0.0.0
# ------------------------------------------------------------
CMD ["npm", "start"]