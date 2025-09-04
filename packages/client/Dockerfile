# Stage 1: Builder - Install dependencies and build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Copy the environment file for build-time variables
# Make sure your .env.local has NEXT_PUBLIC_API_BASE_URL defined
COPY .env.local .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Runner - Create a smaller production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install production dependencies only
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]
