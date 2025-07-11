# Base image
FROM node:20-alpine 

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Start the application
CMD ["pnpm", "start"]