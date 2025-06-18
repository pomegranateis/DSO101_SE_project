# Use Node 18 Alpine base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install all deps (dev included for tsc)
RUN npm ci

# Install TypeScript globally
RUN npm install -g typescript

# Copy app source code
COPY tsconfig.json ./
COPY database ./database
COPY src ./src

# Compile TypeScript
RUN tsc

# Remove dev dependencies to slim down
RUN npm prune --production

# Start the app
CMD ["node", "dist/index.js"]
