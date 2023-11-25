const { Customerr } = require("../Errors");
const { errorHandler } = require("../middleware/errorhandleerror");
const { applicationHeader } = require("../middleware/headerhandler");


module.exports.roomCreate = async (req, res,wss,rooms_id,users_in_rooms,jsonbody) => {
    try {
     let correctheader = applicationHeader(req);
     if(!correctheader){
      throw new Customerr('Please provide correct type of data and header.',400)
     }
              res.setHeader('Content-Type', 'application/json');
        
              if (!jsonbody.name || !jsonbody.roomcode) {
                throw new Customerr('Missing credentials.',400);
              }
              if(rooms_id.has(jsonbody.roomcode)){
                throw new Customerr('Room already exists.',409);
              }else{
                  let array = [];
                  array.push(jsonbody.name)
                  rooms_id.set(jsonbody.roomcode,wss);
                  users_in_rooms.set(jsonbody.roomcode,array);
  
              res.statusCode = 200;
              res.end(JSON.stringify({name:jsonbody.name,room:jsonbody.roomcode}));
          }
      
    } catch (err) {
      errorHandler(err,res)
    }
  };


module.exports.roomJoin = async (req, res,rooms_id,users_in_rooms,jsonbody) => {
  try {
   let correctheader = applicationHeader(req);
   if(!correctheader){
    throw new Customerr('Please provide correct type of data and header.',400)
   }
            res.setHeader('Content-Type', 'application/json');
      
            if (!jsonbody.name || !jsonbody.roomcode) {
              throw new Customerr('Missing credentials.',400)
            }
            if(rooms_id.has(jsonbody.roomcode)){
                const members = users_in_rooms.get(jsonbody.roomcode);

                if(members.find(m=>m==jsonbody.name)){
                   throw new Customerr(`${jsonbody.name} already exists in room ${jsonbody.roomcode} please choose another name.`,409)
                }
                
                members.push(jsonbody.name)
                res.statusCode = 200;
                res.end(JSON.stringify({name:jsonbody.name,room:rooms_id.get(jsonbody.roomcode)}));
            }else{
            throw new Customerr(`No such room exists.`,404)
        }
    
  } catch (err) {
    errorHandler(err,res)
  }
};

module.exports.roomLeave = async(req,res,rooms_id,users_in_rooms,jsonbody)=>{
    try{

        let correctheader = applicationHeader(req);
        if(!correctheader){
         throw new Customerr('Please provide correct type of data and header.',400)
        }
        if (!jsonbody.name || !jsonbody.roomcode) {
            throw new Customerr('Missing credentials.',400)
        }
        if(rooms_id.has(jsonbody.roomcode)){
            let members = users_in_rooms.get(jsonbody.roomcode);
            if(members.length == 1){
                users_in_rooms.delete(jsonbody.roomcode);
                rooms_id.delete(jsonbody.roomcode);
                
            }else{
                members = members.filter(m=>m!=jsonbody.name);
            }

        }

        res.statusCode = 200;
        res.end(`${jsonbody.name} left the room ${jsonbody.roomcode}.`)

    }catch(err){
        errorHandler(err,res);
    }
}
