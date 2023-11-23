module.exports.Createroom =(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters)=>{
    console.log(data)
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
    let arr = [data.name];
    users_in_rooms.set(data.roomid,arr);
    roomAdmin.set(data.roomid,ws);
    requesters.set(data.roomid,[]);
    ws.send({
            type:'create',
            Admin:true,
            name:data.name,
            roomid:data.roomid,
            mems:arr
})
}

/*
data={
name
ws
roomid
}
*/