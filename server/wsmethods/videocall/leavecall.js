module.exports.leavecall = async(data, ROOM) => {
    try {
        const { roomid, name } = data;
        let Room = ROOM.get(roomid);
        let copy = Room.call;
        if (copy.find(c => c.name === name)) {
            copy = copy.filter((c) => c.name != name);
            copy.forEach((c) => {
                c.ws.send({
                    command: 'leftcall',
                    name
                })
            })
            // console.log(copy)
            // users_in_videocall.set(roomid, copy);
            Room.call = copy;
            ROOM.set(roomid,Room)
        }


    } catch (err) {
        console.log(err);
    }
}