module.exports.cancelrequest =(data,roomAdmin,requesters)=>{
    const {name,roomid} = data;
    let admin = roomAdmin.get(roomid);
    
    if(admin){
        admin.send(JSON.stringify({
            type:'cancelrequest',
            name:name
        }));
    }
    let reqs = requesters.get(roomid);
    if(reqs){
        reqs = reqs.filter((r)=>r.name !== name);
        requesters.set(roomid,reqs);
    }
   
}