# Base image
FROM node:14 as builder

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Use distroless base image
FROM gcr.io/distroless/nodejs:14

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app/build ./build

# Set environment variables
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the app port
EXPOSE $PORT

# Start the app
CMD ["node", "build/index.js"]