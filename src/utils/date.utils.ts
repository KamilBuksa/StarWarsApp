import moment from 'moment';

export class DateUtils {
  static dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';
  static dateTimeNewFormat = 'YYYY-MM-DD HH:mm';
  static timeFormat = 'HH:mm';

  static dateFormant = 'YYYY-MM-DD';

  static getNextDay(_date: Date): Date {
    const date: Date = new Date(_date);
    date.setDate(date.getDate() + 1);

    return date;
  }

  static getDayInXDays(days: number): Date {
    const date: Date = new Date();
    date.setDate(date.getDate() + days);

    return date;
  }

  static getPlusHours(_date: Date, hours: number): Date {
    const date: Date = new Date(_date);
    date.setHours(date.getHours() + hours);

    return date;
  }

  static setEndOfDay(date: Date): Date {
    const _date: Date = new Date(date);
    _date.setHours(23, 59, 0, 0);
    return _date;
  }

  static setBeginingOfDay = (date: Date): Date => {
    const _date: Date = new Date(date);
    _date.setHours(0, 1, 0, 0);
    return _date;
  };

  static formatDate(date: Date): string {
    let dd: number | string = date.getDate();
    let mm: number | string = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return `${dd}.${mm}.${yyyy}`;
  }

  static formatDateToGetOnlyTime(date: Date): string {
    return moment(date).format(this.timeFormat);
  }

  static isValidTime(hourToValid: string) {
    // Regex to check valid
    // time in 24-hour format
    const regex = new RegExp(
      /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/,
    );

    //  if str
    // is empty return false
    if (hourToValid == null) {
      return false;
    }
    const str: string = hourToValid.toString();

    // Return true if the str
    // matched the ReGex
    if (regex.test(str) == true) {
      return true;
    } else {
      return false;
    }
  }

  static convertHourAndMinutesToTime(minutes: number, hours: number) {
    return `${hours ? (hours > 9 ? hours : '0' + hours) : '00'}:${
      minutes > 9 ? minutes : '0' + minutes
    }`;
  }

  static addHourAndMinutesToDate(time: string, date?: Date): moment.Moment {
    // time format: hh:mm
    const timeValues = time.split(':');
    const hours = timeValues[0];
    const minutes = timeValues[1];

    return date
      ? moment(date).add(hours, 'h').add(minutes, 'm')
      : moment().add(hours, 'h').add(minutes, 'm');
  }
}
