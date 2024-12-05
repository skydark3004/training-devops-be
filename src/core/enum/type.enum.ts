/* export enum EnumGenderTypes {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
 */
export enum EnumTokenType {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}

/**
 *@description Các loại bài tập
 */
export enum EnumExcerciseType {
  MUSCLE_PC = 'MUSCLE_PC',
  REEL = 'REEL',
  VIDEO = 'VIDEO',
  INFORMATION = 'INFORMATION',
}

/**
 *@description Loại màn hình của loại bài tập Cơ PC
 */
export enum EnumMusclePcType {
  VIBRATE = 'VIBRATE',
  REST = 'REST',
}

/**
 *@description Loại màn hình của loại bài tập Reel
 */
export enum EnumScreenTypeOfReel {
  GUIDE = 'GUIDE',
  PRACTICE = 'PRACTICE',
}

/**
 *@description Loại màn hình của loại bài tập video
 */
export enum EnumScreenTypeOfVideo {
  VIDEO = 'VIDEO',
  ANSWER_CONTINOUSLY = 'ANSWER_CONTINOUSLY',
  ANSWER = 'ANSWER',
}

/**
 *@description Loại màn hình của loại bài tập thông tin
 */
export enum EnumScreenTypeOfInformation {
  FLEXIBLE = 'FLEXIBLE',
  MULTIPLE_CHOICES = 'MULTIPLE_CHOICES',
  POINT_ANALYZE = 'POINT_ANALYZE',
  REMOVE_NAGATIVE_THINKING = 'REMOVE_NAGATIVE_THINKING',
  AUDIO = 'AUDIO',
}

/**
 *@description Loại thành phần của loại màn hình linh hoạt
 */
export enum EnumTypeComponentOfFlexibleScreen {
  TEXT_BOLD = 'TEXT_BOLD',
  TEXT_NORMAL = 'TEXT_NORMAL',
  TEXT_LARGE = 'TEXT_LARGE',
  IMAGE = 'IMAGE',
  SPACE = 'SPACE',
  BACK = 'BACK',
}

/**
 *@description Kiểu hiển thị audio của loại màn hình thông tin
 */
export enum EnumTypeDisplayOfInformationScreen {
  AUDIO_FIRST = 'AUDIO_FIRST',
  CONTENT_FIRST = 'CONTENT_FIRST',
}

export enum EnumTypeRegisterUser {
  ANONYMOUS = 'ANONYMOUS',
  OTP = 'OTP',
}

export enum EnumTypeOfLevelOfCustomer {
  LEVEL_PC = 'LEVEL_PC',
  LEVEL_SEXOLOGY = 'LEVEL_SEXOLOGY',
}

export enum EnumTypeOfFaq {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  URL = 'URL',
}

export enum EnumTypeOfShowFaq {
  LARGE_THUMBNAIL = 'LARGE_THUMBNAIL',
  SMALL_THUMBNAIL = 'SMALL_THUMBNAIL',
  NO_THUMBNAIL = 'NO_THUMBNAIL',
}

/* căn giữa / trái / phải của loại màn hình linh hoạt  */
export enum EnumTypeOfAlignOfFlexibleScreen {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
}

export enum EnumTypeOfNotification {
  NEWS = 'NEWS',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  // URL = 'URL',
}

export enum EnumTypeOfPurchase {
  IN_APP = 'IN_APP',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum EnumTypeOfContent {
  ARTICLE = 'ARTICLE',
  URL = 'URL',
}

export enum EnumTypeOfPractice {
  PER_DAY = 'PER_DAY',
  PER_WEEK = 'PER_WEEK',
  EVERY_TIME = 'EVERY_TIME',
}
