FROM s6on/ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive
LABEL maintainer="Julio Gutierrez julio.guti+nordlynx@pm.me"

COPY /rootfs /

RUN apt update -y && \
    apt install -y curl jq patch iputils-ping wireguard && \
	patch --verbose -p0 < /patch/wg-quick.patch && \
    apt remove -y patch && \
    apt autoremove -y && \
    apt autoclean -y && \
    rm -rf \
        /patch \
        /tmp/* \
        /var/cache/apt/archives/* \
        /var/lib/apt/lists/* \
        /var/tmp/*

#ENV S6_CMD_WAIT_FOR_SERVICES=1
#CMD 