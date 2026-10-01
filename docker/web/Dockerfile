FROM node:20-bullseye

WORKDIR /app

COPY web/package*.json ./

RUN npm ci

COPY web/ .

EXPOSE 4200

CMD ["npm", "start"]