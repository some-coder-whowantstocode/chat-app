module.exports.forward = async(data, users_in_videocall) => {
    try {
        const { to, roomid } = data;
        const room = users_in_videocall.get(roomid);
        let person = room.find(r => r.name == to);
        if (person) {
            person.ws.send(data)
        }
    } catch (err) {
        console.log(err);
    }

}