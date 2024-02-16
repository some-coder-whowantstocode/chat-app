const { CUSTOM_RESPONSE } = require("../responses");
const { sendtoall } = require("./senttoall");

module.exports.permission = async(data, ROOM, USER_LIMIT) => {
    try {
        const { response, roomid, name, admin } = data;

        let Room = ROOM.get(roomid);
        let reqs = Room.requesters;
        let requester = reqs.find(r=>r.name === name) ;
        reqs = reqs.filter((a) => a.name !== name);

        const reject = {...CUSTOM_RESPONSE.PERMISSION.REJECT.DECLINED}
        reject.roomid = roomid;
        reject.name = name;
       
        const mem = Room.members;

        if(requester){
            if(response === "Dec" ){
                requester.ws.send(reject)

              
            }else if(mem.length === USER_LIMIT){
                    requester.ws.send(reject)
                    requester.ws.send(CUSTOM_RESPONSE.PERMISSION.REJECT.FULL);
                    Room.admin.ws.send(CUSTOM_RESPONSE.PERMISSION.REJECT.FULL);
                }
            else{   
                mem.push({
                    name:name,
                    incall:false,
                    active:true,
                    ws:requester.ws
                })
                let names = new Array();
                mem.map((m)=>{names.push(m.name)})

                const accept ={...CUSTOM_RESPONSE.PERMISSION.ACCEPT.JOIN}
                accept.roomid = roomid;
                accept.name = name;
                accept.Admin = admin;
                accept.mems = names;
                accept.key = Room.key;

                const message = {...CUSTOM_RESPONSE.PERMISSION.ACCEPT.ANNOUNCEMENT};
                message.name = name;
                message.msg = `${name} joined the room.`
                message.roomid = roomid;
                message.key = Room.key;
                sendtoall(mem,message);
                requester.ws.send(accept);
               
                Room.members = mem;
                Room.users += 1;
            }
              
        }      
            Room.requesters = reqs;
            ROOM.set(roomid,Room);
    } catch (err) {
        throw new Error(`Error while getting permission to join room - ${ err.message}`, );
    }

}



/*
data={
    roomid
    ws
    name
    
}
*/