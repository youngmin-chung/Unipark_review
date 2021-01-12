FROM node

WORKDIR /client

COPY package.json /client/

RUN CI=true

RUN npm install

COPY . /client/

EXPOSE 3000
CMD [ "npm", "start" ]