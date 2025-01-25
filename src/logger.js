import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'application.log' })
    ]
});

export default logger;

// import winston from 'winston';

// const logger = winston.createLogger({
//     level: process.env.NODE_ENV === 'test' ? 'error' : 'info', // Ajusta el nivel para pruebas
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
//     ),
//     transports: [
//         new winston.transports.Console(),
//     ],
// });

// export default logger;
