import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm';
import { logToFile } from '../libs/utils/logger.util';

const log = logToFile.getLogger('LOGGING_DATABASE');

export class MyCustomLogger extends AbstractLogger {
  /**
   * Write log to specific output.
   */
  protected writeLog(level: LogLevel, logMessage: LogMessage | string | number | (LogMessage | string | number)[], queryRunner?: QueryRunner) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false,
    });

    console.log('logMessage::', logMessage);
    console.log('messages::', messages);

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          console.log(message.message);
          break;

        case 'info':
        case 'query':
          if (message.prefix) {
            console.info(message.prefix, message.message);
          } else {
            console.info(message.message);
          }
          break;

        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            console.warn(message.prefix, message.message);
          } else {
            console.warn(message.message);
          }
          break;

        case 'error':
        case 'query-error':
          if (message.prefix) {
            console.error(message.prefix, message.message);
          } else {
            console.error(message.message);
          }
          break;
      }
    }
  }

  logQuery(query: string, parameters?: any[]): any {
    console.log('log from logQuery');
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
    log.info(sql);
  }

  /*   log(level: 'log' | 'info' | 'warn', message: any): any {
    console.log('log from method log');
    console.log(level);
    console.log(message);
  } */
}
