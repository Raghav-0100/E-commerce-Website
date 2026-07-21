FROM node:20-alpine

WORKDIR /app

# Install dependencies first so Docker can cache this layer
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the backend source (client/ is excluded via .dockerignore)
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
