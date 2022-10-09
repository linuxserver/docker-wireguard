FROM ghcr.io/linuxserver/baseimage-alpine:3.16

# set version label
ARG BUILD_DATE
ARG VERSION
ARG WIREGUARD_RELEASE
LABEL build_version="Linuxserver.io version:- ${VERSION} Build-date:- ${BUILD_DATE}"
LABEL maintainer="thespad"

RUN \
  echo "**** install dependencies ****" && \
  apk add --no-cache --virtual=build-dependencies \
    bc \
    build-base \
    coredns \
    elfutils-dev \
    gcc \
    git \
    linux-headers && \
  apk add --no-cache \
    bc \
    coredns \
    gnupg \ 
    iproute2 \
    iptables \
    iputils \
    libqrencode \
    net-tools \
    openresolv \
    perl && \
  echo "wireguard" >> /etc/modules && \
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
  sed -i '/\[\[ $proto == -4 \]\] && cmd sysctl -q net\.ipv4\.conf\.all\.src_valid_mark=1/d' /usr/bin/wg-quick && \
  echo "**** clean up ****" && \
  apk del --no-network build-dependencies && \
  rm -rf \
    /tmp/*

# add local files
COPY /root /

# ports and volumes
EXPOSE 51820/udp
