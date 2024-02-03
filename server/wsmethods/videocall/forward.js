module.exports.forward = async(data, ROOM) => {
    try {
        const { to, roomid } = data;
        const Room = ROOM.get(roomid);
        const room = Room.call;
        let person = room.find(r => r.name == to);
        if (person) {
            person.ws.send(data);
        }
    } catch (err) {
        console.log(err);
    }

}