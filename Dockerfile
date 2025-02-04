FROM node:18.20.2

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm install

CMD ["npm", "start"]

EXPOSE 4000
