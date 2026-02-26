import "mocha";
import { expect } from "chai";
import { setLocalhostConfig } from "../src/setLocalhostConfig";

describe("setLocalhostConfig", function () {
  it("removes ListenPort and sets localhost endpoint", function () {
    const remoteConfig = `[Interface]
Address = AX032NVGI2RIB4
PrivateKey = HIgo9xNzJMWLKASShiTqIybxZ0U3wGLiUeJ1PKf8ykw=
ListenPort = 51820
DNS = 172.33.1.2

[Peer]
PublicKey = gI6EdUSYvn8ugXOt8QQD6Yc+JyiZxIhp3GInSWRfWGE=
Endpoint = ff0239facf453517.dyndns.dappnode.io:51820
AllowedIPs = 0.0.0.0/0`;

    const expectedLocalhostConfig = `[Interface]
Address = AX032NVGI2RIB4
PrivateKey = HIgo9xNzJMWLKASShiTqIybxZ0U3wGLiUeJ1PKf8ykw=
DNS = 172.33.1.2

[Peer]
PublicKey = gI6EdUSYvn8ugXOt8QQD6Yc+JyiZxIhp3GInSWRfWGE=
Endpoint = localhost:51820
AllowedIPs = 0.0.0.0/0`;

    expect(setLocalhostConfig(remoteConfig)).to.deep.equal(
      expectedLocalhostConfig,
    );
  });

  it("replaces endpoint when spacing around equal sign varies", function () {
    const remoteConfig = `[Peer]
Endpoint    = ff0239facf453517.dyndns.dappnode.io:51820`;

    const expectedLocalhostConfig = `[Peer]
Endpoint = localhost:51820`;

    expect(setLocalhostConfig(remoteConfig)).to.deep.equal(
      expectedLocalhostConfig,
    );
  });
});
