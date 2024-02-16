const { CUSTOM_RESPONSE } = require("../responses");
const { sendtoall } = require("./senttoall");
const { leavecall } = require("./videocall/leavecall");

module.exports.leaveroom = async(data, ws, ROOM ) => {
    try {
        const { 
            roomid, 
            name, 
            key 
        } = data;
        if (!ROOM.has(roomid)) {
            const msg = {...CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.SUCCESSFUL};
            msg.name = name;
            msg.roomid = roomid;
            ws.send(msg);
            return;
        }

        const Room = ROOM.get(roomid);
        if (Room.key === key) {
        leavecall(data,ROOM)

            let all_mem = Room.members;
            if (all_mem.length > 1) {

                all_mem = all_mem.filter((mem)=>{if (mem.name != name) return mem})
                Room.members = all_mem;
               

                const leavemsg = {...CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.ANNOUNCEMENT};
                leavemsg.name = name;
                leavemsg.roomid = roomid;
                leavemsg.msg = `${name} left the room `
                leavemsg.key = Room.key;


                if(name === Room.admin.name){
                    let random_Admin_index = Math.floor(Math.random() * ((all_mem.length-1) + 1));
                    let random_Admin = all_mem[random_Admin_index];
                    Room.admin = {
                        name:random_Admin.name,
                        ws:random_Admin.ws
                    }

                    let msg = {...CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.NEW_ADMIN}
                    msg.newAdmin = random_Admin.name;
                    msg.roomid = roomid;
                    msg.msg = `${random_Admin.name} is now the new Admin.`
                    msg.key = key
                    sendtoall(Room.members, msg);
                }
               

                sendtoall(Room.members, leavemsg);
                Room.users -=1;
                ROOM.set(roomid,Room);

            } else {
                if(name !== all_mem[0].name){
                    return;
                }
               let reqs = Room.requesters;
                reqs.map((req) => {
                    const msg = {...CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.DECLINE_ALL_REQUESTS};
                    msg.name = name;
                    msg.roomid = roomid;
                    req.ws.send((msg));

                })
            ROOM.delete(roomid);
            }
        }

        let msg = {...CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.SUCCESSFUL};
        msg.key = Room.key;
        msg.name = name;
        msg.roomid = roomid;
        ws.send(msg);


    } catch (err) {
        console.log(`Error while leaving the room - ${ err.message}`)
    }


}