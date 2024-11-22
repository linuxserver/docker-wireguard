FROM ghcr.io/linuxserver/baseimage-alpine:3.20
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

HEALTHCHECK CMD [ $(( $(date -u +%s) - $(wg show wg0 latest-handshakes | awk '{print $2}') )) -le 120 ] || exit 1

COPY /root /
RUN apk add --no-cache -U iptables wireguard-tools curl jq patch && \
	patch --verbose -d / -p 0 -i /patch/wg-quick.patch && \
    apk del --purge patch && \
	rm -rf /tmp/* /patch
