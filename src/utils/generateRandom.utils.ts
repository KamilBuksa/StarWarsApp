export class GenerateRandomUtils {
  static generateRandomNumber(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static generateRandomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static generateRandomNumberBetweenOneAndParam(param: number): number {
    return Math.floor(Math.random() * param) + 1;
  }

  static transformNumberIntoString(randomId: number): string {
    const str = '' + randomId;
    const pad = '000000';
    return pad.substring(0, pad.length - str.length) + str;
  }

  static generatePaymentSessionId(
    length: number,
    onlyNumbers: boolean,
    onlyLetters: boolean,
  ) {
    let result = '';
    const characters = onlyNumbers
      ? '0123456789'
      : onlyLetters
      ? 'ABCDEFGHIJKLMNOPRSTUWXYZ'
      : '0123456789ABCDEFGHIJKLMNOPRSTUWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static randomCoordinatesNear([longitude, latitude]: [number, number]): [
    number,
    number,
  ] {
    const r = 100 / 111300; // = 100 meters
    const y0 = longitude;
    const x0 = latitude;
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y1 = w * Math.sin(t);
    const x1 = x / Math.cos(y0);

    return [y0 + y1, x0 + x1];
  }
}
