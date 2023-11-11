module.exports = class Customerr extends Error{
    constructor(message,statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode
    }
}