import * as _ from 'lodash';


export class UtilsString {
  public static readonly MONEY_INT_PART_SEPARATOR = ',';
  public static readonly MONEY_BLOCK_SEPARATOR = ' ';

  public static readonly DIGITS_ONLY_REGEXP = '^\\d+$';

  public static StringHasNumbers(inputStr: string, countNumbers: number = null): boolean {
    if (!inputStr) {
      return false;
    }
    if (!countNumbers) {
      const regexp = new RegExp('[0-9]+');
      return regexp.test(inputStr);
    } else {
      return countNumbers === this.GetStringJustNumbers(inputStr).length;
    }
  }

  public static GetStringJustNumbers(inputStr: string): string {
    let resStr = '';
    const regex = new RegExp('[0-9]', 'g');
    let match;
    while ((match = regex.exec(inputStr)) != null) {
      resStr += match[0];
    }
    return resStr;
  }

  public static ParseResponseErrorMessage(error: string): string {
    // '400 - Bad Request {"status":"error","data":{"message":"Сообщение"}}';
    const separator = '"message":"';
    if (!error || !_.includes(error, separator)) {
      return '';
    }
    const substr = _.split(error, separator)[1];
    return _.split(substr, '"')[0];
  }

  public static GetRouteWithoutQueryParams(route: String) {
    console.log(route);

    const withoutQueryParams = route.match(/.+?(?=\?|$)/g);

    return withoutQueryParams && withoutQueryParams.length > 0 ? withoutQueryParams[0] : '';
  }

  public static IsNormalInteger(str) {
    const n = Math.floor(Number(str));

    return String(n) === str && n > 0;
  }
}
