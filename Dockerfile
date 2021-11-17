FROM s6on/alpine:3
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

COPY /patch /patch
RUN apk add --no-cache -U wireguard-tools curl jq patch && \
    patch --verbose -p0 < /patch/wg-quick.patch && \
    apk del --purge patch && \
    rm -rf /tmp/* /patch
COPY /rootfs /