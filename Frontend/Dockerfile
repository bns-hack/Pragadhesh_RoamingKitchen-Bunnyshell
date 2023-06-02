# Stage 1: Build the React app
FROM node:14-alpine as build

WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy app source code
COPY . .

# Set environment variable for build
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY

# Build the React app
RUN npm run build

# Stage 2: Create the final runtime image
FROM node:14-alpine

WORKDIR /app

# Copy the built app from the previous stage
COPY --from=build /app/build ./build

# Set environment variables for runtime
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the app port
EXPOSE $PORT

# Start the app
CMD ["npx", "serve", "-s", "build","--silent"]