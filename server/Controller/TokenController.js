const { Customerr } = require('../Errors');
const { errorHandler } = require('../middleware/errorhandleerror');
const { generatetoken } = require('../middleware');

module.exports.shakeHand =async(req,res)=>{
    try{

        const sessionId = req.sessionID

        const token = await generatetoken(sessionId,'1d')

      res.statusCode = 200;
      res.end(JSON.stringify({jwtToken:token}));
    }catch(err){
        errorHandler(err,res);
    }
}