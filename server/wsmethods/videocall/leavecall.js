module.exports.leavecall = async(data, users_in_videocall) => {
    try {
        const { roomid, name } = data;
        let copy = Array.from(users_in_videocall.get(roomid));
        if (copy.find(c => c.name === name)) {
            copy = copy.filter((c) => c.name != name);
            copy.forEach((c) => {
                c.ws.send({
                    command: 'leftcall',
                    name
                })
            })
            console.log(copy)
            users_in_videocall.set(roomid, copy);
        }


    } catch (err) {
        console.log(err);
    }
}