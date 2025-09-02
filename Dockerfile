FROM node:22.18

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3001

CMD ["yarn", "dev"]