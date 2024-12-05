/**
 * @attention
 * Giờ phải được viết dưới dạng giờ server (giờ UTC = lấy giờ VN trừ 7h) nếu không pass timeZone
 */
export enum EnumCronJobTime {
  EVERY_DAY_AT_23h59_IN_TIMEZONE_VN = '59 23 * * *',
  EVERY_SUNDAY_AT_20H_IN_TIMEZONE_VN = '0 20 * * 0',
  EVERY_DAY_AT_12h_10_IN_TIMEZONE_VN = '10 12 * * *',
}
