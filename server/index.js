const http = require('http');
const {shakeHand} = require('./Controller/TokenController.js')
const {
  bodyParser,
  defaultPage,
  errorHandler,
  applicationHeader
}  = require('./middleware/index.js');
require('dotenv').config();
const socketIo = require('socket.io');

const jwt = require('jsonwebtoken')

const rooms_id = new Map(); //<id,[ws,ws.....]>
const users_in_rooms = new Map(); //<id,[name,name.....]>
const roomAdmin = new Map(); //<id,ws>
const requesters = new Map(); //<id,[{name,ws},{name,ws}....]>
const blocklist = new Map(); //<id,[ws,ws,ws,ws]>
const connections = new Map(); //<ws,{roomid,name}>

const { 
    sendtoall,
    Createroom,
    joinroom,
    permission,
    leaveroom,
    message,
    kickout
 } = require('./wsmethods/index.js');
const {Admin, cancelrequest } = require('./wsmethods/cancelrequest.js');
const chatLogger = require('./Logger/index.js');


const Logger = chatLogger();

 const PORT = process.env.PORT || 9310

 
const server = http.createServer(async(req,res)=>{
   
    try{
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT);
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // preflight is only send with custom headers like application/json
    
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const {method} = req;

        if(method == 'GET'){
          switch(req.url){

            case '/handshake':
              shakeHand(req,res);
              break;

              default:
                defaultPage(res)
          }
        }
        else{
           defaultPage(res);
        }

    }catch(error){
      Logger.log({
        level:'error',
        label: 'handshake',
        message:error
      })
       errorHandler(error,res)
    }
});

const io = socketIo(server);
try{

  io.on('connection', async (socket) => {
  let active = true;

    const jwtToken = socket.handshake.query.token;
    try{
      jwt.verify(jwtToken, process.env.JWT_SECRET)
      socket.emit('message', {
        type:'Authentication',
        status:'passed'
      });
    } catch(err) {
     

     await socket.emit('message', {
        type:'Authentication',
        status:'failed'
      });
      socket.disconnect();

      Logger.log({
        level:'error',
        label: 'Authentication',
        message:err
      })
    }

    try{

      socket.on('message', async(data) => {
        active = true;

        try{
          switch(data.type){
            case 'create':
            Createroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters,connections);
            break;
    
            case 'join':
            joinroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters,connections);
            break;
    
            case 'response':
            permission(data, rooms_id, users_in_rooms, requesters, connections);
            socket.emit('message', {
              type:'removereq',
              name:data.name
            });
            break;
    
            case 'leave':
            leaveroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters);
            break;
    
            case 'cancel':
            cancelrequest(data,socket, roomAdmin, requesters,connections);
            break;
    
            case 'rejoin':
            rejoin(data,rooms_id,users_in_rooms);
            break;

            case 'kickout':
            kickout(data,socket,roomAdmin,rooms_id,users_in_rooms);
    
            default:
            message(data,rooms_id);
            break;
    
          }
        } catch(err) {
          Logger.log({
            level:'error',
            label: 'socket',
            message:err
          })
        }
      });

      

      socket.on('ping', () => {
       active = true;
      });
    
      socket.on('disconnecting',(err)=>{
        socket.send({
          type:'Alert',
          action_required:true,
          msg:`server disconnected`
        })
      })
      socket.on('error',(err)=>{
        Logger.log({
          level:'error',
          label: 'socket',
          message:err
        })
      })
    
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });

    let interid =   setInterval(async() => {
       if(active){
        active = false;
       }else{
         if(connections.has(socket.id)){
          const data = connections.get(socket.id);
          if(data.requester){
            cancelrequest(data,socket, roomAdmin, requesters,connections)
          }else{
            leaveroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters)
          }
          await socket.send({
            type:'Alert',
            action_required:true,
            msg:`server disconnected`
          })
            connections.delete(socket.id);
            socket.disconnect();
            setTimeout(() => {
              clearInterval(interid)
            }, (1000*2));
         }
       }
      }, 1000 * 60);
    
    }catch(err){
      Logger.log({
        level:'error',
        label: 'socket',
        message:err
      })
      
    }
  
  
    
  })
  
}catch(err){
  Logger.log({
    level:'error',
    label: 'io',
    message:err
  })
}

server.listen(PORT,()=>console.log(`server is listening at ${PORT}`))