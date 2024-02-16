const { CUSTOM_RESPONSE } = require("../responses");
const { sendtoall } = require("./senttoall");

module.exports.kickout = async(data, ws, ROOM) => {
    try {
        const { roomid, name, Admin } = data;
        if (!roomid || !name || !Admin) {
            ws.send(CUSTOM_RESPONSE.KICKOUT.REJECT.INVALID_CREDINTIALS)
            return;
        }

        const Room = ROOM.get(roomid);
        let users = Room.members;
        const actualAdmin = Room.admin.name;

        if (actualAdmin !== Admin) {
            ws.send(CUSTOM_RESPONSE.KICKOUT.REJECT.IMPOSTER)
            return;
        }
        const user = users.find(u=>u.name === name);
        if(!user) return;
        users = users.filter((user)=>user.name !== name);

      
        let news = {...CUSTOM_RESPONSE.KICKOUT.ACCEPT.BAD_NEWS};
        news.name = name;
        news.roomid = roomid;
        news.key = Room.key;
        user.ws.send(news);

        const msg = {...CUSTOM_RESPONSE.KICKOUT.ACCEPT.ANNOUNCEMENT};
        msg.name = name;
        msg.msg = `${name} was kicked out by Admin.`;
        msg.roomid = roomid;
        msg.key = Room.key;

        sendtoall(users, msg);
        Room.members = users;
        Room.users = Room.users-1;
        ROOM.set(roomid,Room);
    } catch (err) {
        console.log(err)
        // throw new Error(`Error while kicking out member - ${ err.message}`, );
    }

}