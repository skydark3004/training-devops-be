import moment, { unitOfTime } from 'moment';
import 'moment-timezone';

interface IDurationTime {
  second?: number;
  minute?: number;
  hour?: number;
}

interface IDurationDate {
  day: number;
  week?: number;
  month?: number;
  year?: number;
}

export function addTimeWithDuration(data: { time: Date; duration: IDurationTime }): Date {
  const time = moment(data.time).tz('UTC');
  data.duration.second && time.add(data.duration.second, 'seconds');
  data.duration.minute && time.add(data.duration.minute, 'minutes');
  data.duration.hour && time.add(data.duration.hour, 'hours');
  return time.toDate();
}

export function addDateWithDuration(data: { date: Date; duration: IDurationDate }) {
  const time = moment(data.date).tz('UTC');

  data.duration.day && time.add(data.duration.day, 'days');
  data.duration.week && time.add(data.duration.week, 'weeks');
  data.duration.month && time.add(data.duration.month, 'months');
  data.duration.year && time.add(data.duration.year, 'years');
  return time.toDate();
}

/**
 * @param month là tháng từ 1 -> 12
 */
export function getDaysInMonth(data: { month: number; year: number }, paramsAddToDate?: any) {
  const formatMonth = data.month < 10 ? `0${data.month}` : data.month;

  let date = moment(new Date(`${data.year}-${formatMonth}-01`));
  const daysInMonth = [];

  // date.month() tính từ 0
  while (date.month() + 1 === data.month) {
    daysInMonth.push({ date: date.toDate(), dayInWeek: date.day(), dayInMonth: Number(date.format('DD')), ...(paramsAddToDate || {}) });
    date = date.add(1, 'days');
  }
  return daysInMonth;
}

export function formatHourToText(data: { hour: number }) {
  const hour = Math.floor(data.hour);
  const minute = Math.floor((data.hour - hour) * 60);
  let result = `${hour} giờ`;
  if (minute) result += ` ${minute} phút`;
  return result;
}

export function convertDurationToVietnameseText(duration: IDurationDate) {
  if (duration.day === -1 && duration.month === -1 && duration.week === -1 && duration.year === -1) {
    return 'Vô hạn';
  }
  let text = '';
  if (duration.day) text += `${duration.day} ngày `;
  if (duration.week) text += `${duration.week} tuần `;
  if (duration.month) text += `${duration.month} tháng `;
  if (duration.year) text += `${duration.year} năm `;
  return text.trim();
}

/** @description
 * Check xem có < với value được so sánh không?
 */
export function isLessThanWithTime(data: { input: IDurationTime; comparedValue: IDurationTime }) {
  const formatInput = (data.input.hour || 0) * 3600 + (data.input.minute || 0) * 60 + (data.input.second || 0);
  const formatStart = (data.comparedValue.hour || 0) * 3600 + (data.comparedValue.minute || 0) * 60 + (data.comparedValue.second || 0);
  return formatInput < formatStart;
}

/** @description
 * Check xem có >= và <= với start và end không?
 */
export function isInRangeWithEqualWithTime(data: { value: IDurationTime; start: IDurationTime; end: IDurationTime }) {
  const formatInput = (data.value.hour || 0) * 3600 + (data.value.minute || 0) * 60 + (data.value.second || 0);
  const formatStart = (data.start.hour || 0) * 3600 + (data.start.minute || 0) * 60 + (data.start.second || 0);
  const formatEnd = (data.end.hour || 0) * 3600 + (data.end.minute || 0) * 60 + (data.end.second || 0);

  return formatInput >= formatStart && formatInput <= formatEnd;
}

/** @description
 * Check xem có > và < với start và end không?
 */
export function isInRangeWithoutEqualWithTime(data: { value: IDurationTime; start: IDurationTime; end: IDurationTime }) {
  const formatInput = (data.value.hour || 0) * 3600 + (data.value.minute || 0) * 60 + (data.value.second || 0);
  const formatStart = (data.start.hour || 0) * 3600 + (data.start.minute || 0) * 60 + (data.start.second || 0);
  const formatEnd = (data.end.hour || 0) * 3600 + (data.end.minute || 0) * 60 + (data.end.second || 0);
  return formatInput > formatStart && formatInput < formatEnd;
}

export function isGreaterWithInRangeWithTime(data: { value: IDurationTime; start: IDurationTime; end: IDurationTime }) {
  const formatInput = (data.value.hour || 0) * 3600 + (data.value.minute || 0) * 60 + (data.value.second || 0);
  const formatStart = (data.start.hour || 0) * 3600 + (data.start.minute || 0) * 60 + (data.start.second || 0);
  const formatEnd = (data.end.hour || 0) * 3600 + (data.end.minute || 0) * 60 + (data.end.second || 0);
  return formatInput > formatStart && formatInput > formatEnd;
}

export function isLessWithInRangeWithTime(data: { value: IDurationTime; start: IDurationTime; end: IDurationTime }) {
  const formatInput = (data.value.hour || 0) * 3600 + (data.value.minute || 0) * 60 + (data.value.second || 0);
  const formatStart = (data.start.hour || 0) * 3600 + (data.start.minute || 0) * 60 + (data.start.second || 0);
  const formatEnd = (data.end.hour || 0) * 3600 + (data.end.minute || 0) * 60 + (data.end.second || 0);
  return formatInput < formatStart && formatInput < formatEnd;
}

export function getCurrentTime() {
  return moment().tz('UTC').toDate();
}

export function getListMonthInYear(paramToAdd?: any) {
  const result: any[] = [];
  for (let i = 1; i <= 12; i++) {
    result.push({
      month: i,
      ...(paramToAdd || {}),
    });
  }
  return result;
}

export function getListDayInWeek(paramToAdd?: any) {
  const result: any[] = [];
  for (let i = 0; i <= 6; i++) {
    result.push({
      dayInWeek: i,
      ...(paramToAdd || {}),
    });
  }
  return result;
}

/**
 * @description
 * Tính khoảng cách giữa 2 ngày ( giờ, phút, giây....)
 */
export function subtractBetweenTwoDates(date_1: Date, date_2: Date, unitOfTime?: unitOfTime.Diff) {
  const format_date_1 = moment(date_1).tz('UTC');
  const format_date_2 = moment(date_2).tz('UTC');
  const result = Math.abs(format_date_1.diff(format_date_2, unitOfTime));
  return result;
}

/**
 * @description
 * So sánh 2 `Date`
 */

export function compareBetweenTwoDates(date_1: Date, typeComprare: '==' | '>=' | '>' | '<=' | '<', date_2: Date) {
  const format_date_1 = moment(date_1).tz('UTC');
  const format_date_2 = moment(date_2).tz('UTC');

  switch (typeComprare) {
    case '==':
      return format_date_1.isSame(format_date_2);
    case '>=':
      return format_date_1.isSame(format_date_2) || format_date_1.isAfter(format_date_2);
    case '>':
      return format_date_1.isAfter(format_date_2);
    case '<=':
      return format_date_1.isSame(format_date_2) || format_date_1.isBefore(format_date_2);
    case '<':
      return format_date_1.isBefore(format_date_2);
  }
}

/**
 * @description
 * Kiểm tra điều kiện \
 *  `start <= Date <= end`
 */

export function isInRangeWithEqualWithDate(input: { date: Date; start: Date; end: Date }) {
  const format_date = moment(input.date);
  const format_start = moment(input.start);
  const format_end = moment(input.end);
  return (
    (format_date.isSame(format_start) || format_date.isAfter(format_start)) && (format_date.isSame(format_end) || format_date.isBefore(format_end))
  );
}

/**
 * @description
 * Kiểm tra điều kiện \
 *  `start < Date < end`
 */

export function isInRangeWithoutEqualWithDate(input: { date: Date; start: Date; end: Date }) {
  const format_date = moment(input.date);
  const format_start = moment(input.start);
  const format_end = moment(input.end);
  return format_date.isAfter(format_start) && format_date.isBefore(format_end);
}
