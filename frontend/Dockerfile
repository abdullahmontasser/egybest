FROM node:18-alpine as build
WORKDIR /app

# Declare build argument for the API URL
ARG VITE_API_URL

# Set the environment variable for the build process
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Build the application (Vite will use VITE_API_URL here)
RUN npm run build

# Production environment
FROM nginx:alpine
# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
