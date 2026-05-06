# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose service port
EXPOSE 5001

# Start service
CMD ["node", "app.js"]