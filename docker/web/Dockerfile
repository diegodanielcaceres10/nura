FROM node:20-bullseye

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

EXPOSE 4200

CMD ["npm", "start"]