module.exports.joinroom =(data,ws,rooms_id,users_in_rooms,roomAdmin)=>{
    if(rooms_id.has(data.roomid)){
        const Admin = roomAdmin.get(data.roomid);
        const request ={
            type:'request',
            name:data.name,
            websocket:ws,
        };
        Admin.send(JSON.stringify(request))
  
    }else{
        rooms_id.set(data.roomid,[ws]);
        let arr = [data.name]
        users_in_rooms.set(data.roomid,arr)

        ws.send(JSON.stringify({
                msg:`${data.name} created room ${data.roomid}`,
                type:`announcement`
    }))
    
    }
}