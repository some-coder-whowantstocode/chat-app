const { sendtoall } = require("./senttoall");

module.exports.leaveroom =(data,ws,rooms_id,users_in_rooms,roomAdmin)=>{
    
  console.log('hi')
    const room = rooms_id.get(data.roomid);
   
    if(room.length>1){
       
        const users = users_in_rooms.get(data.roomid);
    
            
            let index = room.indexOf(ws);
            room.splice(index,1);
    
            let i = users.indexOf(data.name);
            users.splice(i,1);
            console.log(index,i)
            
            let msg = {
                type:'Announcement',
                msg:'Left the room.'
            }
            sendtoall(room,msg)

            if(roomAdmin.has(data.roomid) && roomAdmin.get(data.roomid)===ws){

                roomAdmin.delete(data.roomid);
        
                let s = 0;
                
                let e = room.length-1;
                let randomadmin = Math.floor(Math.random() * (e - s + 1)) + s;
                console.log(randomadmin)
                roomAdmin.set(data.roomid,room[randomadmin]);
                let msg = {
                    type:'Announcement',
                    msg:`${users[randomadmin]} is now the new Admin.`
                }
                sendtoall(room,msg)
            }
        
    }
    else{
        roomAdmin.delete(data.roomid);
        rooms_id.delete(data.roomid);
        users_in_rooms.delete(data.roomid);
    }
   
    
}