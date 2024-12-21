FROM ghcr.io/linuxserver/baseimage-alpine:3.20

LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

HEALTHCHECK CMD [ $(( $(date -u +%s) - $(wg show wg0 latest-handshakes | awk '{print $2}') )) -le 120 ] || exit 1

COPY /root /

RUN apk add --no-cache -U iptables wireguard-tools curl jq patch && \
    patch --verbose -d / -p 0 -i /patch/wg-quick.patch && \
    apk del --purge patch && \
    rm -rf /tmp/* /patch

# Update iptables and ip6tables symbolic links for compatibility with iptables-legacy
RUN for suffix in "" "-save" "-restore"; do \
        rm -rf "iptables${suffix}" && \
        rm -rf "ip6tables${suffix}" && \
        ln -s "iptables-legacy${suffix}" "iptables${suffix}" && \
        ln -s "ip6tables-legacy${suffix}" "ip6tables${suffix}"; \
    done
