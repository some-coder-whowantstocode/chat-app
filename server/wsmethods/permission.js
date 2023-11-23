const {sendtoall} = require('./senttoall.js')

module.exports.permission =(data,rooms_id,users_in_rooms,requesters)=>{
    console.log(data)
    if(data.response=="Dec"){
        let arr = requesters.get(data.roomid)
        let w = arr.filter((a)=>a.name === data.name);
        w[0].ws.send({
            type:'response',
            permission:'Dec',
            roomid:data.roomid,
            name:data.name
        });


        requesters.set(data.roomid, arr.filter((a)=>a.name !== data.name));
    }else{
            let arr = Array.from(users_in_rooms.get(data.roomid));
            let room = rooms_id.get(data.roomid);
            let req = requesters.get(data.roomid)
            let w = req.filter((a)=>a.name === data.name);
        room.push(w[0].ws);
        arr.push(data.name)
        w[0].ws.send({
            type:'response',
            permission:'Acc',
            roomid:data.roomid,
            name:data.name,
            mems:arr
        });
        requesters.set(data.roomid, req.filter((a)=>a.name !== data.name));
        users_in_rooms.set(data.roomid,arr);
        rooms_id.set(data.roomid,room)
        let msg = {
            type:'Announcement',
            joined:true,
            name:data.name,
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