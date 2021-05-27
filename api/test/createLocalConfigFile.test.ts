import "mocha";
import { expect } from "chai";
import { setLocalEndpoint } from "../src/createLocalConfigFile";

describe("Config files", function () {
  it("Create localConfig file from remoteConfigFile with local endpoint", function () {
    const remoteConfig = `[Interface]
Address = AX032NVGI2RIB4
PrivateKey = HIgo9xNzJMWLKASShiTqIybxZ0U3wGLiUeJ1PKf8ykw=
ListenPort = 51820
DNS = 172.33.1.2

[Peer]
PublicKey = gI6EdUSYvn8ugXOt8QQD6Yc+JyiZxIhp3GInSWRfWGE=
Endpoint = ff0239facf453517.dyndns.dappnode.io:51820
AllowedIPs = 0.0.0.0/0`;

    const expextedLocalConfig = `[Interface]
Address = AX032NVGI2RIB4
PrivateKey = HIgo9xNzJMWLKASShiTqIybxZ0U3wGLiUeJ1PKf8ykw=
ListenPort = 51820
DNS = 172.33.1.2

[Peer]
PublicKey = gI6EdUSYvn8ugXOt8QQD6Yc+JyiZxIhp3GInSWRfWGE=
Endpoint = 192.168.1.45:51820
AllowedIPs = 0.0.0.0/0`;

    const localEndpoint = `192.168.1.45:51820`;

    expect(setLocalEndpoint(remoteConfig, localEndpoint)).to.deep.equal(expextedLocalConfig);
  });
});
