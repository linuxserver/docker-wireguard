<p align="center">
    <a href="https://github.com/bubuntux/nordlynx">bubuntux/nordlynx</a>
    <br>
    <a href="https://github.com/bubuntux/nordlynx/blob/master/LICENSE"><img src="https://badgen.net/github/license/bubuntux/nordlynx?color=cyan"/></a>
    <a href="https://cloud.docker.com/u/bubuntux/repository/docker/bubuntux/nordlynx"><img src="https://badgen.net/docker/size/bubuntux/nordlynx?icon=docker&label=size"/></a>
    <a href="https://cloud.docker.com/u/bubuntux/repository/docker/bubuntux/nordlynx"><img src="https://badgen.net/docker/pulls/bubuntux/nordlynx?icon=docker&label=pulls"/></a>
    <a href="https://cloud.docker.com/u/bubuntux/repository/docker/bubuntux/nordlynx"><img src="https://badgen.net/docker/stars/bubuntux/nordlynx?icon=docker&label=stars"/></a>
    <a href="https://github.com/bubuntux/nordlynx/network/members"><img src="https://badgen.net/github/forks/bubuntux/nordlynx?icon=github&label=forks&color=black"/></a>
    <a href="https://github.com/bubuntux/nordlynx/stargazers"><img src="https://badgen.net/github/stars/bubuntux/nordlynx?icon=github&label=stars&color=black"/></a>
</p>

## Quick reference

- **Maintained by**: [Julio Gutierrez](https://github.com/bubuntux)
- **Where to get help**: [Github discussions](https://github.com/bubuntux/nordlynx/discussions)

## Supported tags

- edge (updated weekly)
- latest (updated monthly)
- YYYYmmdd (created monthly)

## Quick reference (cont.)

- **Where to file issues**: [Github issues](https://github.com/bubuntux/nordlynx/issues)
- **Supported architecture**: ([more info](https://github.com/docker-library/official-images#architectures-other-than-amd64)) amd64, arm32v7, arm64
- **Published image artifact details**: [DockerHub](https://hub.docker.com/r/bubuntux/nordlynx), [Github packages](https://github.com/bubuntux/nordlynx/pkgs/container/nordlynx)
- **Continuous integration**: [Github actions](https://github.com/bubuntux/nordlynx/actions/workflows/docker-image-ci.yml)
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
    cap_add:
      - NET_ADMIN #required
      - NET_RAW #required in some cases
      - SYS_MODULE #requiered to install wireguard module
    environment:
      - PRIVATE_KEY=xxxxxxxxx #required
    volumes:
      - /lib/modules:/lib/modules #requiered to install wireguard module
```

### docker cli ([click here for more info](https://docs.docker.com/engine/reference/commandline/cli/))

```bash
docker run -d \
  --cap-add=NET_ADMIN,NET_RAW,SYS_MODULE #required \
  -e PRIVATE_KEY=xxxxxxxxx #required \
  -v /lib/modules:/lib/modules #requiered to install wireguard module \
  ghcr.io/bubuntux/nordlynx
```

Review the [wiki](https://github.com/bubuntux/nordlynx/wiki) for more practical usages and host specific instructions.

## Module

Wireguard module is required, the container will try to install the module, install [manually](https://www.wireguard.com/install) if need it. 

## Environment

|                 Variable                  | Default | Description |
|:-----------------------------------------:| --- | --- |
|               `PRIVATE_KEY`               | **[Required]** | The private key can be obtained using `docker run --rm --cap-add=NET_ADMIN -e USER=XXX -e PASS=YYY bubuntux/nordvpn nord_private_key` or following these [instructions](https://forum.openwrt.org/t/instruction-config-nordvpn-wireguard-nordlynx-on-openwrt/89976).
|               `LISTEN_PORT`               | 51820 | A 16-bit port for listening.
|                 `ADDRESS`                 | 10.5.0.2/32 | A comma-separated list of IP (v4 or v6) addresses (optionally with CIDR masks) to be assigned to the interface.
|                   `DNS`                   | [103.86.96.100,103.86.99.100](https://support.nordvpn.com/General-info/1047409702/What-are-your-DNS-server-addresses.htm) | A comma-separated list of IP (v4 or v6) addresses to be set as the interface's DNS servers, or non-IP hostnames to be set as the interface's DNS search domains.
|                  `TABLE`                  | auto | Controls the routing table to which routes are added. There are two special values: `off` disables the creation of routes altogether, and `auto` (the default) adds routes to the default table and enables special handling of default routes.
|               `ALLOWED_IPS`               | 0.0.0.0/0 | A comma-separated list of IP (v4 or v6) addresses with CIDR masks from which incoming traffic for this peer is allowed and to which outgoing traffic for this peer is directed. Use 0.0.0.0/1 for Synology, read [this](https://github.com/bubuntux/nordlynx/issues/2).
|          `PERSISTENT_KEEP_ALIVE`          | 25 | A second interval, between 1 and 65535 inclusive, of how often to send an authenticated empty packet to the peer for the purpose of keeping a stateful firewall or NAT mapping valid persistently.
| `PRE_UP`/`POST_UP`/`PRE_DOWN`/`POST_DOWN` | | Script snippets which will be executed by bash before/after setting up/tearing down the interface, most commonly used to configure custom DNS options or firewall rules. The special string `%i` is expanded to INTERFACE.
|                  `QUERY`                  | | Query for the api nordvpn 
|               `PUBLIC_KEY`                | | Public key of the server to connect (auto select base on recommendation api).
|                `END_POINT`                | | Ip address of the server to connect (auto select base on recommendation api).
|               `ALLOW_LIST`                | | List of domains that are going to be accessible _outside_ vpn (IE rarbg.to,yts.mx).
|                `NET_LOCAL`                | | CIDR networks (IE 192.168.1.0/24), add a route to allows replies once the VPN is up.
|               `NET6_LOCAL`                | | CIDR IPv6 networks (IE fe00:d34d:b33f::/64), add a route to allows replies once the VPN is up.
|                `RECONNECT`                | | Time in seconds to re-establish the connection.

## Sysctl 

* `net.ipv4.conf.all.src_valid_mark=1` May be required. (depends on multiple factors)
* `net.ipv6.conf.all.disable_ipv6=1` Recommended when only using ipv4.