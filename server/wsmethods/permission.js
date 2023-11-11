const {sendtoall} = require('./senttoall.js')

module.exports.permission =(data,ws,rooms_id,users_in_rooms)=>{
    if(data.permission == 'Accepted'){
        data.websocket.send(JSON.stringify({
            type:'response',
            permission:false
        }))
    }else{
            let arr = users_in_rooms.get(data.roomid);
        let room = rooms_id.get(data.roomid);
        room.push(ws);
        arr.push(data.name)
        data.websocket.send(JSON.stringify({
            type:'response',
            permission:true
        }))
        let msg = {
            type:'Announcement',
            msg:`${data.name} joined the room.`
        }
      sendtoall(room,msg)
     
    }
}