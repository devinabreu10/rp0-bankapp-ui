# Multi-stage Build: 
# Efficiently creates a smaller final image by separating the build and runtime environments.

# build stage
FROM node:20.9.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

# Angular compatibility compiler command
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .

RUN npm run build

# runtime stage (setting up nginx)
FROM nginx:stable

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/rp0-bankapp-ui/browser /usr/share/nginx/html

EXPOSE 80