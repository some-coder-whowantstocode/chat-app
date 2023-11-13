const { errorHandler } = require("./errorhandleerror");

module.exports.applicationHeader = (req)=>{
  try{
    const contentType = req.headers['content-type'];

    if (contentType != 'application/json') {
      return false;
    }
    return true;
  }catch(error){
    errorHandler(error.message||error)
  }
  
}