module.exports.joinroom =(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters)=>{
    
    if(rooms_id.has(data.roomid)){
        let members = users_in_rooms.get(data.roomid);
        let existsinmem = members.find(m=>m === data.name);
        let requester = requesters.get(data.roomid);
        let existreq = requester.find(r=>r.name === data.name);
        if(existsinmem||existreq){
            ws.send(JSON.stringify({
                type:'error',
                msg:`${data.name} already exists in this room please choose another name.`
            }))
        }
        const Admin = roomAdmin.get(data.roomid);
        const request ={
            type:'request',
            name:data.name,
            roomid:data.roomid
        };
        // store requesters who want to join so that you can accept or decline when more than one wants to join
            let arr = requesters.get(data.roomid);
            arr.push({name:data.name,ws:ws});
         

            // console.log(arr)
        Admin.send(JSON.stringify(request))
  
    }else{
        rooms_id.set(data.roomid,[ws]);
        let arr = [data.name]
        users_in_rooms.set(data.roomid,arr)
        roomAdmin.set(data.roomid,ws)
        ws.send(JSON.stringify({
                msg:`${data.name} created room ${data.roomid}`,
                type:`announcement`
    }))
    
    }
}


/*
data={
    roomid
    ws
    name

}
*/