module.exports.joinroom =(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters)=>{
    
    if(rooms_id.has(data.roomid)){
        let members = users_in_rooms.get(data.roomid);
        let already_exists = members.find(m=>m === data.name);
        let requester = requesters.get(data.roomid);
        let existreq = requester.find(r=>r.name === data.name);

        if(already_exists || existreq){
            ws.send({
                type:'error',
                msg:`some one with name ${data.name} already exists in this room please choose another name.`
            });
            return;
        }

        const Admin = roomAdmin.get(data.roomid);
        const request ={
            type:'request',
            name:data.name,
            roomid:data.roomid
        };
        // store requesters who want to join so that you can accept or decline when more than one wants to join

            requester.push({name:data.name,ws:ws});

        Admin.send(request);
  
    }else{
        ws.send({
            type:`error`,
            msg:`room ${data.roomid} does not exist.`
    })


    
    }
}


/*
data={
    roomid
    ws
    name

}
*/