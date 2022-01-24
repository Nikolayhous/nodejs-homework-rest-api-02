FROM node:16

WORKDIR /usr/src/app

COPY packege*.json ./

COPY . .

EXPOSE 8000

CMD ["node", "bin/server.js"]