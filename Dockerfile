FROM node:16

WORKDIR /usr/src/app

COPY packege*.json .

# RUN npm i

COPY . .

EXPOSE 7000

CMD ["node", "bin/server.js"]