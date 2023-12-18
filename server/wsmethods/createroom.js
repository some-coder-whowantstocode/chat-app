module.exports.Createroom = (data, ws, rooms_id, users_in_rooms, roomAdmin, requesters, connections, users_in_videocall) => {

    try {
        if (data.roomid == '' || data.name == '') {
            ws.send({
                type: `error`,
                msg: `please provide valid roomid and name.`

            })
            return;
        }
        const { roomid, name } = data;
        if (rooms_id.has(roomid)) {
            ws.send({
                type: `error`,
                msg: `${roomid} already exists.`
            })
            return;
        }



        rooms_id.set(roomid, [ws]);
        users_in_rooms.set(roomid, [name]);
        roomAdmin.set(roomid, ws);

        connections.set(ws.id, { roomid: roomid, name: name, requester: false })
        users_in_videocall.set(roomid, []);
        requesters.set(roomid, []);
        ws.send({
            type: 'create',
            response: true,
            name: name,
            roomid: roomid
        })
    } catch (err) {
        throw new Error(`Error while creating the room - ${ err.message}`, );
    }

}