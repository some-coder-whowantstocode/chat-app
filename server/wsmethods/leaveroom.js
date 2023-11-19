const { sendtoall } = require("./senttoall");

module.exports.leaveroom =(data,ws,rooms_id,users_in_rooms,roomAdmin,requesters,jwtToken)=>{


    let room = Array.from(rooms_id.get(data.roomid));
   
    if(room.length>1){
       
        const users = users_in_rooms.get(data.roomid); 
    
            
            let index = room.indexOf(ws); 
            room.splice(index,1); 
    
            let i = users.indexOf(data.name);
            users.splice(i,1);
            
            let msg = {
                type:'Announcement',
                msg:`${data.name} Left the room.`
            };
            sendtoall(Array.from(room),msg);
            rooms_id.set(data.roomid,room);
            users_in_rooms.set(data.roomid,users);

            if(roomAdmin.has(data.roomid) && roomAdmin.get(data.roomid)===ws){

                roomAdmin.delete(data.roomid);
        
                let s = 0;
                
                let e = room.length-1;
                let randomadmin = Math.floor(Math.random() * (e - s + 1)) + s;
                roomAdmin.set(data.roomid,room[randomadmin]);
                
                let msg = {
                    type:'Announcement',
                    msg:`${users[randomadmin]} is now the new Admin.`
                }
                let users = users_in_rooms.get(data.roomid);
                room[randomadmin].send(JSON.stringify({
                    type:'create',
                    roomid:data.roomid,
                    name:users[randomadmin],
                    Admin:true
        }))
                sendtoall(room,msg)
            }
        
    }
    else{
        roomAdmin.delete(data.roomid);
        rooms_id.delete(data.roomid);
        users_in_rooms.delete(data.roomid);
        let reqs = requesters.get(data.roomid);
        reqs.map((req)=>{
            let msg = {
                type:'response',
                permission:'Dec',
                roomid:data.roomid,
                name:req.name
            }
            req.ws.send((JSON.stringify(msg)));
            
        })
       requesters.clear(data.roomid)
        ws.send(JSON.stringify({
            type:'Announcement',
            msg:`You left the room ${data.roomid}`
        }));
    }
   console.log(room.length)
    
}