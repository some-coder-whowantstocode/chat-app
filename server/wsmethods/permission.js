const { sendtoall } = require('./senttoall.js')

module.exports.permission = (data, rooms_id, users_in_rooms, requesters, connections) => {
    try {
        if (data.response == "Dec") {

            let reqs = requesters.get(data.roomid)
            let w = reqs.filter((a) => a.name === data.name);
            if (w.length == 1) {
                w[0].ws.send({
                    type: 'response',
                    permission: 'Dec',
                    roomid: data.roomid,
                    name: data.name
                });
            }
            connections.delete(w[0].ws.id);
            requesters.set(data.roomid, reqs.filter((a) => a.name !== data.name));

        } else {
            let users = Array.from(users_in_rooms.get(data.roomid));
            let room = rooms_id.get(data.roomid);
            let reqs = requesters.get(data.roomid)
            let w = reqs.filter((a) => a.name === data.name);
            room.push(w[0].ws);
            users.push(data.name)
            w[0].ws.send({
                type: 'response',
                permission: 'Acc',
                roomid: data.roomid,
                name: data.name,
                Admin: data.admin,
                mems: users
            });
            requesters.set(data.roomid, reqs.filter((a) => a.name !== data.name));
            users_in_rooms.set(data.roomid, users);
            rooms_id.set(data.roomid, room)

            if (connections.has(w[0].ws.id)) {
                let c = connections.get(w[0].ws.id);
                c.requester = false;
                connections.set(w[0].ws.id, c);

                let msg = {
                    type: 'Announcement',
                    joined: true,
                    name: data.name,
                    msg: `${data.name} joined the room.`
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