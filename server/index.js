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

const { 
    sendtoall,
    Createroom,
    joinroom,
    permission,
    leaveroom
 } = require('./wsmethods/index.js');
const {Admin, cancelrequest } = require('./wsmethods/cancelrequest.js')

 const PORT = process.env.PORT || 9310

 
const server = http.createServer(async(req,res)=>{
   
    try{
        res.setHeader('Access-Control-Allow-Origin','http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // preflight is only send with custom headers like application/json
    
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const body = await bodyParser(req);
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
       errorHandler(error,res)
    }
});

const io = socketIo(server,{ transports: ['websocket'] });

io.on('connection', async (socket) => {
  console.log('a user connected');

<<<<<<< HEAD
  const jwtToken = socket.handshake.query.token;
=======
  const jwtToken = req.url.substring(1);
  console.log(jwtToken)
>>>>>>> 0e604c64f1b550af9920cfddf6b3967338992a3e
  try{
    console.log(process.env.JWT_SECRET)
    let data = jwt.verify(jwtToken, process.env.JWT_SECRET)
    console.log(data)
    socket.emit('message', {
      type:'Authentication',
      status:'passed'
    });
  } catch(err) {
    console.log(err)
    
    socket.emit('message', {
      type:'Authentication',
      status:'failed'
    });
    socket.disconnect();
  }

  socket.on('message', (data) => {
    try{
      if(data.create){
        console.log(data)
        Createroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, jwtToken);
      }
      else if(data.join){
        joinroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, jwtToken);
      }
      else if(data.response){
        permission(data, rooms_id, users_in_rooms, requesters, jwtToken);
        socket.emit('message', {
          type:'removereq',
          name:data.name
        });
      }
      else if(data.leave){
        leaveroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, jwtToken);
      }
      else if(data.cancel){
        console.log(data)
        cancelrequest(data, roomAdmin, requesters);
      }
      else{
        let msg = {
          type:'message',
          msg:data.msg,
          name:data.name,
          Admin:data.Admin
        }
        // console.log(data)
        sendtoall(Array.from(rooms_id.get(data.roomid)), msg);
      }
    } catch(err) {
      console.log(err)
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT,()=>console.log(`server is listening at ${PORT}`))
