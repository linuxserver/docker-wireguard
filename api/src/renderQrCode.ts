import qrcode from "qrcode-terminal";

export function renderQrCode(data: string): Promise<string> {
  return new Promise((resolve) => {
    qrcode.setErrorLevel("L");
    qrcode.generate(data, { small: false }, resolve);
  });
}
