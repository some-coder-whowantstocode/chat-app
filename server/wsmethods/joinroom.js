const { CUSTOM_RESPONSE } = require("../responses");

module.exports.joinroom = (data, ws, ROOM, USER_LIMIT) => {
    try {
        const { roomid, name, rejoin, key } = data;
        if (!ROOM.has(roomid)) {
            ws.send(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.NOT_EXISTS)
            return;
        }
        const Room = ROOM.get(roomid);

        if(Room.users === USER_LIMIT){
            ws.send(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.FULL);
            return;
        } 
        if (rejoin) {
            if (Room.key !== key) {
                ws.send(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.ANOTHER_ROOM)
                return;
            }
        }
        let members = Room.members;
        let already_exists = members.find(m => m.name === name);
        let requester = Room.requesters;
        let existreq = requester.find(r => r.name === name);

        if (already_exists || existreq) {
            ws.send(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.EXISTING_NAME);
            return;
        }

        const Admin = Room.admin;
        const request = {...CUSTOM_RESPONSE.JOIN_ROOM.ACCEPT.ASK_TO_ADMIN};
        request.name = name;
        request.roomid = roomid;
       
            // store requesters who want to join so that you can accept or decline when more than one wants to join

        requester.push({ name: name, ws: ws });
        Room.requesters = requester;
        ROOM.set(roomid,Room);

        Admin.ws.send(request);
    } catch (err) {
        throw new Error(`Error while joining the room - ${ err.message}`, );
    }

}


/*
data={
    roomid
    ws
    name

}
*/