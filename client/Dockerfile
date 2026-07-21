FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Runs the CRA dev server, matching your normal `npm start` workflow.
# WDS_SOCKET_PORT keeps hot-reload working when accessed via the mapped port.
ENV WDS_SOCKET_PORT=0
CMD ["npm", "start"]
