FROM node:12-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

RUN rm -rf node_modules && yarn --production


# Our Second stage, that creates an image for production
FROM alpine
WORKDIR /app

RUN apk add --update --no-cache nodejs

COPY --from=builder /app/dist/ ./
COPY --from=builder /app/node_modules/ ./node_modules

# Prepare external executables
RUN chmod +x /app/src/executables/getWireguardCredentialsLocal.js && \
    chmod +x /app/src/executables/getWireguardCredentialsRemote.js && \
    ln -s /app/src/executables/getWireguardCredentialsLocal.js /usr/local/bin/getWireguardCredentialsLocal && \
    ln -s /app/src/executables/getWireguardCredentialsRemote.js /usr/local/bin/getWireguardCredentialsRemote

ENTRYPOINT [ "node", "src/index" ]
