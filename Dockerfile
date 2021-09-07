#REF https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:15 AS builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .

ENV NODE_ENV production

# install node modules and build assets
RUN yarn install 
RUN yarn run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]