# I'm doing a two stage build here, to get smaller
# and less bloated final image

# Notice the commands are in an order that is
# optimised for cache reuse, from the ones that copy
# content that is changed less frequently to the ones
# that copy content that is changed more frequently
# (i.e. the actual code)

# First stage builds the project
FROM node:20-alpine AS builder

WORKDIR /app

COPY tsconfig.json ./

COPY package*.json ./
RUN npm install

COPY config ./config
COPY src ./src
RUN npm run build

# Second stage only copies the final build
# and omits the dev dependencies
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY config ./config
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:all"]
