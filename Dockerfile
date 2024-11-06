FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
# ENV VITE_API_URL http://sethapi.duckdns.org
RUN npm run build

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

# Step 1: Build the React application
# FROM node:20-alpine AS build
# WORKDIR /app

# # Copy package.json and package-lock.json to install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Pass the environment variable during the build
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# # Build the React application (output will be in the 'dist' folder for Vite)
# RUN npm run build

# # Step 2: Serve the application using Nginx
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose port 80 (the default for Nginx)
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
