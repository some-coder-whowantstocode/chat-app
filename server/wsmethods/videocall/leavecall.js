module.exports.leavecall = async(data, users_in_videocall) => {
    try {
        const { roomid, name } = data;
        let copy = Array.from(users_in_videocall.get(roomid));
        copy = copy.filter((c) => c.name != name);
        copy.forEach((c) => {
            c.ws.send({
                command: 'left',
                name
            })
        })
        users_in_videocall.set(roomid, copy);
    } catch (err) {
        console.log(err);
    }
}