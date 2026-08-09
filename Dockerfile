# Use official Node.js image
FROM node:24-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the app
COPY . .

# Build CSS
RUN npx postcss public/css/input.css -o public/css/output.css

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
