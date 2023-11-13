module.exports.Createroom =(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters)=>{
    rooms_id.set(data.roomid,[ws]);
    let arr = [data.name]
    users_in_rooms.set(data.roomid,arr)
    roomAdmin.set(data.roomid,ws)
    requesters.set(data.roomid,[]);
    ws.send(JSON.stringify({
            msg:`${data.name} created room ${data.roomid}`,
            type:`announcement`
}))
}

/*
data={
name
ws
roomid
}
*/