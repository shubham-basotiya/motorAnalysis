#backend/Dockerfile

FROM node:18-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]