FROM node:20-bullseye

WORKDIR /app

RUN npm install -g @angular/cli

COPY analytics-dashboard/package*.json ./

RUN npm ci

COPY analytics-dashboard/ .

EXPOSE 4200

CMD ["npm", "start"]
