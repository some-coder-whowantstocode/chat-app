const jwt = require('jsonwebtoken');

module.exports.generatetoken = (pl,expiry)=>{
    return new Promise((resolve,reject)=>{
        const payload = {
            data: pl,
          };
          
          const secret = process.env.JWT_SECRET;
          
          const options = {
            expiresIn: expiry,  
          };
          
          try {
            const token = jwt.sign(payload, secret, options);
            resolve(token);
          } catch (err) {
            reject(err);
          }

    })
      
  
}