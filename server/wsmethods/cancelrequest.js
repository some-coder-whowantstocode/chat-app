module.exports.cancelrequest =(data,socket,roomAdmin,requesters,connections)=>{
    const {name,roomid} = data;
    let admin = roomAdmin.get(roomid);
    
    if(admin){
        admin.send({
            type:'cancelrequest',
            name:name
        });
    }
    let reqs = requesters.get(roomid);
    connections.delete(socket.id)
    if(reqs){
        reqs = reqs.filter((r)=>r.name !== name);
        requesters.set(roomid,reqs);
    }
   
}