import * as log4js from 'log4js';

log4js.configure({
  appenders: {
    appender: {
      type: 'file',
      filename: 'log/log',
      keepFileExt: true,
      compress: true,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: {
      appenders: ['appender'],
      level: 'all',
    },
  },
});

export const logToFile = log4js;
