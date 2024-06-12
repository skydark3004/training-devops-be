import * as crypto from 'crypto';
import * as numeral from 'numeral';
import btoa from 'btoa';
import atob from 'atob';

export class StringUtil {
  /**
   * Converts a string to an url friendly string
   * @function toUrl
   * @param str input
   * @param replaceSymbols replaces all the symbols by a specific symbol
   * @param symbolReplacing the symbol replacing
   */
  public static toUrl(str: string, replaceSymbols?: boolean, symbolReplacing?: string): string {
    symbolReplacing = symbolReplacing || '-';
    if (!str) return '';
    str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
    str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
    str = str.replace(/[ìíịỉĩ]/g, 'i');
    str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
    str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
    str = str.replace(/[ỳýỵỷỹ]/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
    str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E');
    str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
    str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
    str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U');
    str = str.replace(/[ỲÝỴỶỸ]/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/'/g, '');
    if (replaceSymbols) {
      str = str.replace(/[!@$%^*()+=<>?\/,.:' '&#\[]/g, symbolReplacing);
      str = str.replace(/-+-/g, symbolReplacing); // replaces double dash (--) by single (-)
      str = str.replace(/^-+|-+$/g, ''); // removes dash from both sides of string
    }
    return str;
  }

  public static isBase64(str: string) {
    if (str === '' || str.trim() === '') {
      return false;
    }
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  public static isImage(str: string) {
    if (str === '' || str.trim() === '') {
      return false;
    }
    const splitStr: any[] = str.split('.');
    if (!splitStr.length) return false;
    return ['png', 'jpg', 'jpeg', 'gif', 'web'].includes(splitStr.pop());
  }

  /**
   * @method validationSSN
   * @description validate ssn
   * @param {string} value
   * @return {boolean}
   */
  public static validationSSN(value: string) {
    const blacklist = ['078051120', '219099999', '457555462'];
    const expression = /^(?!666|000|9\d{2})\d{3}[- ]{0,1}(?!00)\d{2}[- ]{0,1}(?!0{4})\d{4}$/;
    if (!expression.test(value)) {
      return false;
    }
    return blacklist.indexOf(value.replace(/\D/g, '')) === -1;
  }

  /**
   * generates a random string
   * @function genRandomString
   * @param {number} length - Length of the random string.
   */
  public static genRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * @function genRandomNumber
   * @param length
   */
  public static genRandomNumber(length = 3): string {
    let formater = '';
    for (let i = 0; i < length; i++) {
      formater += '0';
    }
    return numeral(Math.ceil(Math.random() * Math.pow(10, length) - 1)).format(formater);
  }

  /**
   * @method genRandomNumberRanger
   * @description gen random number in ranger
   * @param {number} min ranger min value, default = 100000
   * @param {number} max ranger max value, default = 999999
   * @return {any}
   */
  public static genRandomNumberRanger(min = 100000, max = 999999): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * hashes a string with a specific algorithm.
   * @param {string} input Input string
   * @param {string} salt Salt
   * @param {string} algorithm algorithm uses to hashes(default sha512)
   * @returns {string} hashes string
   */
  public static hashString(input: string, salt: string, algorithm?: string): string {
    algorithm = algorithm || 'sha512';
    const hash = crypto.createHmac(algorithm, salt);
    hash.update(input);
    return hash.digest('hex');
  }

  /**
   * @method convertErrorCodeToMessage
   * @param code
   */
  public static convertErrorCodeToMessage(code: string) {
    const errorPattern = /([A-Z_0-9]+)/g;
    if (!code || !code.match(errorPattern)) return undefined;
    const output: string = code
      .split('_')
      .map((x) => x.toLowerCase())
      .join(' ');
    return output[0].toUpperCase() + output.substr(1);
  }

  /**
   * @method roundNumber
   * @param {number} num value param
   * @param {number} range number round after , => default = '2'
   */
  public static roundNumber(num: number, range = 2) {
    return +`${Math.round(`${num}e+${range}` as any)}e-${range}`;
  }

  public static removeAllSpecialCharacter(str: any) {
    if (!isNaN(Number(str))) {
      return str;
    }
    return str.replace(
      /[^a-zA-Z \- 0-9 ; : àáạảãâầấậẩẫăằắặẳẵ èéẹẻẽêềếệểễ ìíịỉĩ òóọỏõôồốộổỗơờớợởỡ ùúụủũưừứựửữ ỳýỵỷỹ ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ ÈÉẸẺẼÊỀẾỆỂỄ ÌÍỊỈĨ ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ ÙÚỤỦŨƯỪỨỰỬỮ ỲÝỴỶỸ]/g,
      '',
    );
  }
}
