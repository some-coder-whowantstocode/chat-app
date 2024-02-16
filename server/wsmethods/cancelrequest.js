module.exports.cancelrequest = (data, ROOM) => {
    try {
        const { name, roomid } = data;
        let Room = ROOM.get(roomid);
        if(!Room){
            return;
        }
        let admin = Room.admin;
        if (admin) {

            admin.ws.send({
                type: 'cancelrequest',
                name: name,
                key:Room.key
            });
        }
        let reqs = Room.requesters;
        if (reqs) {
            reqs = reqs.filter((r) => r.name !== name);
            Room.requesters = reqs;
            ROOM.set(roomid,Room)
        }

    } catch (err) {
        throw new Error(`Error while cancelling the request - ${ err.message}`, );
    }

}