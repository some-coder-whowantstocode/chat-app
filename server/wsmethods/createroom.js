module.exports.Createroom =(data,ws,rooms_id,users_in_rooms,roomAdmin)=>{
    rooms_id.set(data.roomid,[ws]);
    let arr = [data.name]
    users_in_rooms.set(data.roomid,arr)
    roomAdmin.set(data.roomid,ws)
    ws.send(JSON.stringify({
            msg:`${data.name} created room ${data.roomid}`,
            type:`announcement`
}))
}