import { createLogger, format, transports } from "winston";


const logger =  createLogger({
    level: "info", 
    format : format.combine(
        format.timestamp({format: "HH:mm:ss"}),
        format.colorize(),
        format.printf(({timestamp, level, message})=>{
            return `[${timestamp}]:${message}`;
        })
    ),
    transports:[
        new transports.Console(),
        new transports.File({filename: "logs/app.log" }),
    ],
});

export default logger;