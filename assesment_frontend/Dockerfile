# Use the official Node.js image as a parent image
FROM node:14-alpine as build

# create root directory for our project in the container
RUN mkdir /frontend

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a minimal web server to serve the static files
FROM nginx:alpine

# Copy the build output to the web server's root directory
COPY --from=build /frontend/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
