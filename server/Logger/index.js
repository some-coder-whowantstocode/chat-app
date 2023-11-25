const {createLogger,format,transports} = require('winston');
const {combine,timestamp,printf,label} = format;

const myFormat = printf(({level,message,label,timestamp})=>{
    return `${timestamp} [${level}] <${label}> : ${message}`;
})

const chatLogger =()=>{
    return createLogger({
        level: 'info',
        format: combine(
            timestamp({format:'HH : mm : ss'}),
            myFormat
        ),
        // defaultMeta: { service: 'user-service' },
        transports: [
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'combined.log' }),
        ],
      });
}

module.exports = chatLogger;