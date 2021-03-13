FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node backend.js
EXPOSE 3000