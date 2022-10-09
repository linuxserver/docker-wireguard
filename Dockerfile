FROM ghcr.io/linuxserver/baseimage-alpine:3.16
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

HEALTHCHECK CMD [ $(( $(date -u +%s) - $(wg show wg0 latest-handshakes | awk '{print $2}') )) -le 120 ] || exit 1

COPY /root /
RUN apk add --no-cache -U wireguard-tools curl jq patch shadow-login && \
	patch --verbose -d / -p 0 -i /patch/wg-quick.patch && \
	addgroup -S vpn && \
	apk del --purge patch && \
	rm -rf /tmp/* /patch
