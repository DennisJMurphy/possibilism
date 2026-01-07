import { Logger } from 'tslog';

const tslogger = new Logger({ name: 'possibilism', minLevel: __DEV__ ? 0 : 3 });

export const logger = {
  debug: (msg: string, ...args: unknown[]) => tslogger.debug(msg, ...args),
  info: (msg: string, ...args: unknown[]) => tslogger.info(msg, ...args),
  warn: (msg: string, ...args: unknown[]) => tslogger.warn(msg, ...args),
  error: (msg: string, ...args: unknown[]) => tslogger.error(msg, ...args),
};