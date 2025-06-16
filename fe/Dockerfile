# First stage builds the project
FROM node:20-alpine AS build

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Second stage only copies the final build
# and omits dev dependencies
FROM nginx:stable-alpine

# This also sets up nginex to serve the
# static html of the generated app
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
