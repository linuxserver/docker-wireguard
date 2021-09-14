FROM ghcr.io/bubuntux/s6-alpine
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

COPY /rootfs /

RUN apk add --no-cache -U wireguard-tools curl jq patch && \
	patch --verbose -p0 < /patch/wg-quick.patch && \
    apk del --purge patch && \
	rm -rf /tmp/* /patch