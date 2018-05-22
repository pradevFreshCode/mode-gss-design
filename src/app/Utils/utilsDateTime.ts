import * as moment from 'moment';

export class UtilsDateTime {
  public static DateDisplayFormat = 'DD.MM.YYYY';
  public static DateTimeDisplayFormat = 'DD.MM.YYYY HH:mm:ss';

  public static TimeDisplayFormat = 'HH:mm:ss';
  public static DateRequestFormat = 'YYYY-MM-DD';

  public static GetDateFromStringFormatted(inputStr: string): Date {
    if (!inputStr) {
      return null;
    }
    const momentRes = this.GetMomentFromDateRequestString(inputStr);
    return momentRes ? momentRes.toDate() : null;
  }

  public static GetMomentFromDateRequestString(inputStr: string): moment.Moment {
    return UtilsDateTime.GetMomentFromString(inputStr, UtilsDateTime.DateRequestFormat);
  }

  public static GetMomentFromString(inputStr: string,
                                    format: string = null): moment.Moment {
    if (!inputStr) {
      return null;
    }
    const res = format ? moment(inputStr, format) : moment(inputStr);
    return res.isValid() ? res : null;
  }

  public static AreEqual(date1: Date, date2: Date): boolean {
    if (!date1 && !date2) {
      return true;
    }
    if (!date1 || !date2) {
      return false;
    }
    return date1.getTime() === date2.getTime();
  }
}
