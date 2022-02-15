FROM ghcr.io/linuxserver/baseimage-alpine:3.15
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

COPY /root /
RUN apk add --no-cache -U wireguard-tools curl jq patch && \
	patch --verbose -d / -p 0 -i /patch/wg-quick.patch && \
    apk del --purge patch && \
	rm -rf /tmp/* /patch