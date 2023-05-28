# Stage 1: Build the React app
FROM node:14-alpine as build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create a minimal production image
FROM node:14-alpine
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build-stage /app/build ./build

# Set environment variables
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
ENV PORT=3000
ENV HOST=0.0.0.0

# Install serve for serving static files
RUN npm install -g serve

# Expose the app port
EXPOSE $PORT

# Start the app using serve, redirecting logs to /dev/null
CMD ["sh", "-c", "serve -s build > /dev/null 2>&1"]
