module.exports.Createroom =(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters,connections)=>{
    if(data.roomid =='' || data.name =='' ){
        ws.send({
            type:`error`,
            msg:`please provide valid roomid and name.`
            
        })
        return;
    }
    if(rooms_id.has(data.roomid)){
        ws.send({
            type:`error`,
            msg:`${data.roomid} already exists.`
        })
        return;
    }



    rooms_id.set(data.roomid,[ws]);
    users_in_rooms.set(data.roomid,[data.name]);
    roomAdmin.set(data.roomid,ws);
    requesters.set(data.roomid,[]);
    connections.set(ws.id,{roomid:data.roomid,name:data.name,requester:false})
    ws.send({
            type:'create',
            response:true,
            name:data.name,
            roomid:data.roomid
})
}
