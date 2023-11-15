const {sendtoall} = require('./senttoall.js')

module.exports.permission =(data,rooms_id,users_in_rooms,requesters)=>{
    if(data.response=="Dec"){
        let arr = requesters.get(data.roomid)
        let w = arr.filter((a)=>a.name === data.name);
        w[0].ws.send(JSON.stringify({
            type:'response',
            permission:'Dec',
            roomid:data.roomid,
            name:data.name
        }))


        requesters.set(data.roomid, arr.filter((a)=>a.name !== data.name));
    }else{
            let arr = users_in_rooms.get(data.roomid);
            let room = rooms_id.get(data.roomid);
            let req = requesters.get(data.roomid)
            let w = req.filter((a)=>a.name === data.name);
        room.push(w[0].ws);
        arr.push(data.name)
        w[0].ws.send(JSON.stringify({
            type:'response',
            permission:'Acc',
            roomid:data.roomid,
            name:data.name
        }))
        requesters.set(data.roomid, req.filter((a)=>a.name !== data.name));
        let msg = {
            type:'Announcement',
            msg:`${data.name} joined the room.`
        }
      sendtoall(room,msg)
     
    }
}



/*
data={
    roomid
    ws
    name
    
}
*/