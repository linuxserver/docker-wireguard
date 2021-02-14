FROM node:12 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run clean
RUN npm run build
# Our Second stage, that creates an image for production
FROM node:12-alpine
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package* ./
RUN npm install --production
CMD npm start
