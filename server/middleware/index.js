const { defaultPage } = require("./defaultpage");
const { bodyParser } = require('./bodyParser');
const { errorHandler } = require('./errorhandleerror');
const { applicationHeader } = require('./headerhandler');
const { generatetoken } = require('./tokengenerator')


module.exports = {
    defaultPage,
    bodyParser,
    errorHandler,
    applicationHeader,
    generatetoken
}