FROM ghcr.io/bubuntux/s6-alpine
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

COPY /rootfs /

RUN apt-get install -y \
		curl \
		dkms \
		ifupdown \
		iproute2 \
		iptables \
		iputils-ping \
		jq \
		net-tools \
		wireguard && \
 echo "**** install wireguard-tools ****" && \
 if [ -z ${WIREGUARD_RELEASE+x} ]; then \
	WIREGUARD_RELEASE=$(curl -sX GET "https://api.github.com/repos/WireGuard/wireguard-tools/tags" \
	| jq -r .[0].name); \
 fi && \
 cd /app && \
 git clone https://git.zx2c4.com/wireguard-linux-compat && \
 git clone https://git.zx2c4.com/wireguard-tools && \
 cd wireguard-tools && \
 git checkout "${WIREGUARD_RELEASE}" && \
 make -C src -j$(nproc) && \
 make -C src install && \
 cd / && patch --verbose -p0 < /tmp/wg-quick.patch && \
 echo "**** clean up ****" && \
 rm -rf \
	/tmp/* \
	/var/lib/apt/lists/* \
	/var/tmp/*

