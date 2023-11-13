const http = require('http')
const {shakeHand} = require('./Controller/TokenController.js')
const {
  bodyParser,
  defaultPage,
  errorHandler,
  applicationHeader
}  = require('./middleware/index.js')
require('dotenv').config()

const jwt = require('jsonwebtoken')

const rooms_id = new Map(); //<id,[ws,ws.....]>
const users_in_rooms = new Map(); //<id,[name,name.....]>
const roomAdmin = new Map(); //<id,ws>
const requesters = new Map(); //<id,[{name,ws},{name,ws}....]>

const wss = require('./socket.js');
const { 
    sendtoall,
    Createroom,
    joinroom,
    permission,
    leaveroom
 } = require('./wsmethods/index.js');

 const PORT = process.env.PORT || 3000

 
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

        const body = await bodyParser(req);
        const {method} = req;

      
        // if(method == 'POST'){
        //     switch(req.url){

        //         default : 
        //         defaultPage(res);
        //     }
        // }
        // else if(method =='DELETE'){
        //     switch(req.url){

        //         default : 
        //         defaultPage(res);
        //     }
        // }
        // else if(method == 'PUT'){
        //   switch(req.url){

        //     default : 
        //     defaultPage(res);
        // }
        // }
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


wss.on('connection',async(ws,req)=>{

  const jwtToken = req.url.substring(1);
  // console.log(jwtToken)
  try{
    console.log(process.env.JWT_SECRET)
    let data =await jwt.verify(jwtToken,process.env.JWT_SECRET)
    console.log(data)
    ws.send(JSON.stringify({
      type:'Authentication',
      status:'passed'
    }))
  }catch(err){
    console.log(err)
    ws.send(JSON.stringify({
      type:'Authentication',
      status:'failed'
    }))
    ws.close()
  }
  // console.log(jwtToken)
    ws.onopen = () => {
      console.log('WebSocket is connected');
      ws.send('Hello, server!');
    };
    
    ws.onmessage = ({data}) => {
        try{
            data = JSON.parse(data)

            if(data.create){
            Createroom(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters,jwtToken);
            }
            else if(data.join){
              // console.log(data)
            joinroom(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters,jwtToken);
            }
            else if(data.response){
            permission(data,ws,rooms_id,users_in_rooms,requesters,jwtToken);
            ws.send(JSON.stringify({
              type:'removereq',
              name:data.name
            }))
            }
            else if(data.leave){
              leaveroom(data,ws,rooms_id,users_in_rooms,roomAdmin,jwtToken)
            }
            else{
                let msg = {
                    type:'message',
                    msg:data.msg,
                    name:data.name
                }
               sendtoall(Array.from(rooms_id.get(data.roomid)),msg);
            }
            
        }catch(err){
            console.log(err)
        }
        
    
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
    };
    
    ws.onclose = (event) => {
      // console.log('WebSocket is closed with event:', event);
      
    };
      })








server.listen(PORT,()=>console.log(`server is listening at ${PORT}`))


