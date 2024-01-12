import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format

import configenv from "../config/env.config.js"

// import dotenv from 'dotenv'
// dotenv.config()

// const customLevelsOptions = {
//     levels: {
//         fatal: 0,
//         error: 1,
//         warning: 2,
//         info: 3,
//         debug: 4,
//     },
//     colors: {
//         fatal: 'red',
//         error: 'orange',
//         warning: 'yellow',
//         info: 'blue',
//         debug: 'white'

//     }
// }

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const config = {

    PRODUCTION: {
        
        format: combine(label({ label: 'logs' }),
            timestamp(), myFormat),
        // levels: customLevelsOptions.levels,
        transports: [
            new transports.Console({
                level: "info",
            }),

            new transports.File(
                {
                    filename: "./errors.log",
                    level: "error",
                    format: format.simple()
                }
            )
        ]

    }, DEVELOPMENT: {
        format: combine(label({ label: 'logs' }),
            timestamp(), myFormat),
        // levels: customLevelsOptions.levels,
        transports: [
            new transports.Console({
                level: "debug",
            }),

            new transports.File(
                {
                    filename: "./errors.log",
                    level: "error",
                  
                }
            )
        ]
    },
}


export const logger = createLogger(config[process.env.ENVIROMENT])
