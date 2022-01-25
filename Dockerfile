FROM node:16

WORKDIR /usr/src/app

COPY packege*.json ./

# RUN npm i

COPY . .

EXPOSE 5000

CMD ["npm", "start"]

# docker build . -t yanukhous1710/dockertest