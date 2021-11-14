FROM s6on/ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

COPY /patch /patch
RUN apt-get update -y && \
    apt-get install -y curl jq patch net-tools iproute2 iptables openresolv iputils-ping wireguard && \
	patch --verbose -p0 < /patch/wg-quick.patch && \
    rm -rf \
        /patch \
        /tmp/* \
        /var/cache/apt/archives/* \
        /var/lib/apt/lists/* \
        /var/tmp/*
COPY /rootfs /