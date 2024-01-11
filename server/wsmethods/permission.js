const { sendtoall } = require('./senttoall.js')

module.exports.permission = (data, rooms_id, users_in_rooms, requesters, connections, room_key) => {
    try {
        const { response, roomid, name, admin } = data;
        if (response == "Dec") {

            let reqs = requesters.get(roomid)
            let w = reqs.filter((a) => a.name === name);
            if (w.length == 1) {
                w[0].ws.send({
                    type: 'response',
                    permission: 'Dec',
                    roomid: roomid,
                    name: name
                });
            }
            connections.delete(w[0].ws.id);
            requesters.set(roomid, reqs.filter((a) => a.name !== name));

        } else {
            let users = Array.from(users_in_rooms.get(roomid));
            let room = rooms_id.get(roomid);
            const key = room_key.get(roomid);
            let reqs = requesters.get(roomid)
            let w = reqs.filter((a) => a.name === name);
            room.push(w[0].ws);
            users.push(name)
            w[0].ws.send({
                type: 'response',
                permission: 'Acc',
                roomid: roomid,
                name: name,
                Admin: admin,
                mems: users,
                key
            });
            requesters.set(roomid, reqs.filter((a) => a.name !== name));
            users_in_rooms.set(roomid, users);
            rooms_id.set(roomid, room)

            if (connections.has(w[0].ws.id)) {
                let c = connections.get(w[0].ws.id);
                c.requester = false;
                c.key = key
                connections.set(w[0].ws.id, c);

                let msg = {
                    type: 'Announcement',
                    joined: true,
                    name: name,
                    msg: `${name} joined the room.`
                }
                sendtoall(room, msg)

            }


        }
    } catch (err) {
        throw new Error(`Error while getting permission to join room - ${ err.message}`, );
    }

}



/*
data={
    roomid
    ws
    name
    
}
*/