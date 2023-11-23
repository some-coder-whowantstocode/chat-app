const { sendtoall } = require("./senttoall");

module.exports.kickout =async(data,ws,roomAdmin,rooms_id,users_in_rooms,blocklist)=>{
    const {roomid,name,Admin} = data;
    if(!roomid || !name || !Admin){
        ws.send({
            type:'error',
            msg:'some data are not valid.'
        })
        return;
    }

    const room = rooms_id.get(roomid);
    const users = users_in_rooms.get(roomid);
    const givenAdminindex = users.indexOf(Admin);
    const givenAdmin = room[givenAdminindex];
    const actualAdmin = roomAdmin.get(roomid);

    if(actualAdmin !== givenAdmin){
        ws.send({
            type:'error',
            msg:'you are not admin.'
        })
        return;
    }

    const userindex = users.indexOf(name);
    const user = room[userindex];
    users.splice(userindex,1);
    room.splice(userindex,1);
    user.send({
        type:'Alert',
        msg:'Admin kicked you out.'
    })
    
    const msg ={
        type:'Announcement',
        msg:`${name} was kicked out by Admin.`
    }

    sendtoall(room,msg);

    rooms_id.set(roomid,room);
    users_in_rooms.set(roomid,users);

}