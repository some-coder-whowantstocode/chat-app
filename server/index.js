
const rooms_id = new Map(); //<id,[ws,ws.....]>
const users_in_rooms = new Map(); //<id,[name,name.....]>
const roomAdmin = new Map(); //<id,ws>

const wss = require('./socket.js');
const { 
    sendtoall,
    Createroom,
    joinroom,
    permission,
 } = require('./wsmethods/index.js');


wss.on('connection',(ws)=>{
    ws.onopen = () => {
      console.log('WebSocket is connected');
      ws.send('Hello, server!');
    };
    
    ws.onmessage = ({data}) => {
        try{
            data = JSON.parse(data)

            if(data.create){
            Createroom(data,ws,rooms_id,users_in_rooms,roomAdmin);
            }
            else if(data.join){
            joinroom(data,ws,rooms_id,users_in_rooms,roomAdmin);
            }
            else if(data.permission){
            permission(data,ws,rooms_id,users_in_rooms);
            }
            else{
                let msg = {
                    type:'message',
                    msg:data.msg
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
      console.log('WebSocket is closed with event:', event);
      
    };
      })









