module.exports.Createroom = (data, ws, rooms_id, users_in_rooms, roomAdmin, requesters, users_in_videocall, room_key, connections) => {

    try {
        const { roomid, name } = data;
        if (!roomid || !name || roomid == '' || name == '') {
            ws.send({
                type: `error`,
                msg: `please provide valid roomid and name.`

            })
            return;
        }

        if (rooms_id.has(roomid)) {
            ws.send({
                type: `error`,
                msg: `${roomid} already exists.`
            })
            return;
        }

        const key = Date.now().toString(36) + Math.random().toString(36).slice(2);


        rooms_id.set(roomid, [ws]);
        users_in_rooms.set(roomid, [name]);
        connections.set(ws.id, { roomid, name, key, requester: false, active: true, ws });
        roomAdmin.set(roomid, ws);
        room_key.set(roomid, key);
        users_in_videocall.set(roomid, []);
        requesters.set(roomid, []);
        ws.send({
            type: 'create',
            response: true,
            name: name,
            roomid: roomid,
            key
        })
    } catch (err) {
        throw new Error(`Error while creating the room - ${ err.message}`, );
    }

}

//add key