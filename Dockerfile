FROM ghcr.io/linuxserver/baseimage-ubuntu:bionic

LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"
ENV DEBIAN_FRONTEND="noninteractive"
ARG WIREGUARD_RELEASE

COPY /patch /patch

RUN \
 echo "**** install dependencies ****" && \
 apt-get update && \
 apt-get install -y --no-install-recommends \
	bc \
	build-essential \
	curl \
	dkms \
	git \
	gnupg \
	ifupdown \
	iproute2 \
	iptables \
	iputils-ping \
	jq \
	libc6 \
	libelf-dev \
	net-tools \
    openresolv \
    patch \
	perl \
	pkg-config && \
 echo "**** install wireguard-tools ****" && \
 if [ -z ${WIREGUARD_RELEASE+x} ]; then \
	WIREGUARD_RELEASE=$(curl -sX GET "https://api.github.com/repos/WireGuard/wireguard-tools/tags" | jq -r .[0].name); \
 fi && \
 cd /app && \
 git clone https://git.zx2c4.com/wireguard-linux-compat && \
 git clone https://git.zx2c4.com/wireguard-tools && \
 cd wireguard-tools && \
 git checkout "${WIREGUARD_RELEASE}" && \
 make -C src -j$(nproc) && \
 make -C src install && \
 patch --verbose -d / -p 0 -i /patch/wg-quick.patch && \
 echo "**** clean up ****" && \
 rm -rf \
    /patch \
	/tmp/* \
	/var/lib/apt/lists/* \
	/var/tmp/*

COPY /root /