FROM node:20-bullseye

WORKDIR /app

RUN npm install -g @angular/cli

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN ng analytics disable

COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 4200

ENTRYPOINT ["/docker-entrypoint.sh"]