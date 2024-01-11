module.exports.joinroom = (data, ws, rooms_id, users_in_rooms, roomAdmin, requesters, connections, room_key) => {
    try {
        const { roomid, name, rejoin, key } = data;
        if (!rooms_id.has(roomid)) {
            ws.send({
                type: `error`,
                msg: `room ${roomid} does not exist.`
            })
            return;
        }
        console.log(data)
        if (rejoin) {
            console.log('rejoining')
            let roomkey = room_key.get(roomid);
            if (roomkey !== key) {
                ws.send({
                    type: `error`,
                    msg: `old room does not exist.`
                })
                return;
            }
        }

        let members = users_in_rooms.get(roomid);
        let already_exists = members.find(m => m === name);
        let requester = requesters.get(roomid);
        let existreq = requester.find(r => r.name === name);

        if (already_exists || existreq) {
            ws.send({
                type: 'error',
                msg: `some one with name ${name} already exists in this room please choose another name.`
            });
            return;
        }

        const Admin = roomAdmin.get(roomid);
        const request = {
            type: 'request',
            name: name,
            roomid: roomid
        };
        connections.set(ws.id, { roomid, name, requester: true, ws, active: true })
            // store requesters who want to join so that you can accept or decline when more than one wants to join

        requester.push({ name: name, ws: ws });
        requesters.set(roomid, requester);


        Admin.send(request);
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