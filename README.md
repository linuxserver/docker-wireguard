<p align="center">
    <a href="https://github.com/bubuntux/nordlynx">bubuntux/nordlynx</a>
    <br>
    <a href="https://github.com/bubuntux/nordlynx/blob/master/LICENSE"><img src="https://badgen.net/github/license/bubuntux/nordlynx?color=cyan"/></a>
    <a href="https://cloud.docker.com/u/bubuntux/repository/docker/bubuntux/nordlynx"><img src="https://badgen.net/docker/size/bubuntux/nordlynx?icon=docker&label=size"/></a>
    <a href="https://cloud.docker.com/u/bubuntux/repository/docker/bubuntux/nordlynx"><img src="https://badgen.net/docker/pulls/bubuntux/nordlynx?icon=docker&label=pulls"/></a>
    <a href="https://cloud.docker.com/u/bubuntux/repository/docker/bubuntux/nordlynx"><img src="https://badgen.net/docker/stars/bubuntux/nordlynx?icon=docker&label=stars"/></a>
    <a href="https://github.com/bubuntux/nordlynx"><img src="https://badgen.net/github/forks/bubuntux/nordlynx?icon=github&label=forks&color=black"/></a>
    <a href="https://github.com/bubuntux/nordlynx"><img src="https://badgen.net/github/stars/bubuntux/nordlynx?icon=github&label=stars&color=black"/></a>
</p>

## Quick reference

- **Maintained by**: [Julio Gutierrez](https://github.com/bubuntux)
- **Where to get help**: [Github discussions](https://github.com/bubuntux/nordlynx/discussions)

## Supported tags

- edge (created nightly)
- latest (created monthly or on demand)
- YYYYmmdd (created monthly or on demand)

## Quick reference (cont.)

- **Where to file issues**: [Github issues](https://github.com/bubuntux/nordlynx/issues)
- **Supported architecture**: ([more info](https://github.com/docker-library/official-images#architectures-other-than-amd64)) amd64, arm32v7, arm64, s390x
- **Published image artifact details**: [DockerHub](https://hub.docker.com/r/bubuntux/nordlynx), [Github packages](https://github.com/bubuntux/nordlynx/pkgs/container/nordlynx)
- **Continuous integration**: [Github actions](https://github.com/bubuntux/nordlynx/actions)
- **Source**: [Github](https://github.com/bubuntux/nordlynx)

## What is NordLynx?

NordLynx is a technology built around the WireGuard® VPN protocol. It lets you experience WireGuard’s speed benefits without compromising your privacy. You can find more information about NordLynx in [this blog post](https://nordvpn.com/blog/nordlynx-protocol-wireguard/).
[![nordlynx](https://nordvpn.com/wp-content/uploads/2019/07/nordvpn-nordlynx-infographic.png)](https://nordvpn.com/blog/nordlynx-protocol-wireguard/)

## What is WireGuard?

[WireGuard®](https://www.wireguard.com/) is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster, simpler, leaner, and more useful than IPsec, while avoiding the massive headache. It intends to be considerably more performant than OpenVPN. WireGuard is designed as a general purpose VPN for running on embedded interfaces and super computers alike, fit for many different circumstances. Initially released for the Linux kernel, it is now cross-platform (Windows, macOS, BSD, iOS, Android) and widely deployable. It is currently under heavy development, but already it might be regarded as the most secure, easiest to use, and simplest VPN solution in the industry.

[![wireguard](https://www.wireguard.com/img/wireguard.svg)](https://www.wireguard.com/)


## Road warriors, roaming and returning home

If you plan to use Wireguard both remotely and locally, say on your mobile phone, you will need to consider routing. Most firewalls will not route ports forwarded on your WAN interface correctly to the LAN out of the box. This means that when you return home, even though you can see the Wireguard server, the return packets will probably get lost.

This is not a Wireguard specific issue and the two generally accepted solutions are NAT reflection (setting your edge router/firewall up in such a way as it translates internal packets correctly) or split horizon DNS (setting your internal DNS to return the private rather than public IP when connecting locally).

Both of these approaches have positives and negatives however their setup is out of scope for this document as everyone's network layout and equipment will be different.

## Usage

Here are some example snippets to help you get started creating a container.

### docker-compose (recommended, [click here for more info](https://docs.docker.com/compose/))

```yaml
---
version: "3"
services:
  nordlynx:
    image: ghcr.io/bubuntux/nordlynx
    container_name: nordlynx
    cap_add:
      - NET_ADMIN #required
    environment:
      - PRIVATE_KEY=xxxxxxxxx #required
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1 #required
    restart: unless-stopped
```

### docker cli ([click here for more info](https://docs.docker.com/engine/reference/commandline/cli/))

```bash
docker run -d \
  --name=nordlynx \
  --cap-add=NET_ADMIN `#required` \
  -e PRIVATE_KEY=xxxxxxxxx `#required` \
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" `#required` \
  --restart unless-stopped \
  ghcr.io/bubuntux/nordlynx
```

## Env Variables

| Variable | Description |
| :----: | --- |
| `PRIVATE_KEY` | **[Required]** The private key can be obtained using `docker run --rm -e ... bubuntux/nordvpn nord_private_key` or following these [instructions](https://forum.openwrt.org/t/instruction-config-nordvpn-wireguard-nordlynx-on-openwrt/89976).
| `ADDRESS` | A comma-separated list of IP (v4 or v6) addresses (optionally with CIDR masks) to be assigned to the interface.
|`DNS` | A comma-separated list of IP (v4 or v6) addresses to be set as the interface's DNS servers, or non-IP hostnames to be set as the interface's DNS search domains.
|`ALLOWED_IPS` |  A comma-separated list of IP (v4 or v6) addresses with CIDR masks from which incoming traffic for this peer is allowed and to which outgoing traffic for this peer is directed. Use 0.0.0.0/1 for Synology, read [this](https://github.com/bubuntux/nordlynx/issues/2).
|`PERSISTENT_KEEP_ALIVE` | A second interval, between 1 and 65535 inclusive, of how often to send an authenticated empty packet to the peer for the purpose of keeping a stateful firewall or NAT mapping valid persistently.
|`ALLOW_LIST` | List of domains that are going to be accessible _outside_ vpn (IE rarbg.to,yts.mx).
|`NET_LOCAL`  | CIDR networks (IE 192.168.1.0/24), add a route to allows replies once the VPN is up.
|`NET6_LOCAL` | CIDR IPv6 networks (IE fe00:d34d:b33f::/64), add a route to allows replies once the VPN is up.

## Sysctl 
* `net.ipv4.conf.all.src_valid_mark=1` (Required)
* `net.ipv6.conf.all.disable_ipv6=1` Recommended when only using ipv4.

## Updating Info

### Via Docker Compose

* Update all images: `docker-compose pull`
* or update a single image: `docker-compose pull nordlynx`
* Let compose update all containers as necessary: `docker-compose up -d`
* or update a single container: `docker-compose up -d nordlynx`
* You can also remove the old dangling images: `docker image prune`

### Via Docker Run

* Update the image: `docker pull ghcr.io/bubuntux/nordlynx`
* Stop the running container: `docker stop nordlynx`
* Delete the container: `docker rm nordlynx`
* You can also remove the old dangling images: `docker image prune`

### Via Watchtower auto-updater (only use if you don't remember the original parameters)

* Pull the latest image at its tag and replace it with the same env variables in one run:

  ```bash
  docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --run-once nordlynx
  ```

* You can also remove the old dangling images: `docker image prune`

**Note:** We do not endorse the use of Watchtower as a solution to automated updates of existing Docker containers. In fact we generally discourage automated updates. However, this is a useful tool for one-time manual updates of containers where you have forgotten the original parameters. In the long term, we highly recommend using [Docker Compose](https://docs.docker.com/compose/).

### Image Update Notifications - Diun (Docker Image Update Notifier)

* We recommend [Diun](https://crazymax.dev/diun/) for update notifications. Other tools that automatically update containers unattended are not recommended or supported.