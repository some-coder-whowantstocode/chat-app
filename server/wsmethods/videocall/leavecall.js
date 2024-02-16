module.exports.leavecall = async(data, ROOM) => {
    try {
        const { roomid, name } = data;
        let Room = ROOM.get(roomid);
        let copy = Room.call;
        if (copy.find(c => c.name === name)) {
            copy = copy.filter((c) => c.name != name);
            Room.call = copy;
            ROOM.set(roomid,Room)
        }


    } catch (err) {
        console.log(err);
    }
}