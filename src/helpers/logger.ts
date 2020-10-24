import pino, { Logger } from "pino";

const logger: Logger = pino({ level: process.env.LOG_LEVEL });
export default logger;
