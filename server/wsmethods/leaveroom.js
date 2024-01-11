const { sendtoall } = require("./senttoall");
const { leavecall } = require("./videocall/leavecall");

module.exports.leaveroom = async(data, ws, rooms_id, users_in_rooms, roomAdmin, requesters, users_in_videocall, timeout, room_key, connections) => {
    try {
        console.log('hmm came here')
        const { roomid, name, key } = data;
        let room = rooms_id.get(roomid);

        if (!room) {
            ws.send({
                type: 'Announcement',
                left: true,
                msg: `You left the room ${roomid} ${timeout=== true && 'due to timeout'}`
            });
            return;
        }

        const Roomkey = room_key.get(roomid);
        if (Roomkey === key) {
            console.log('room matched')
            if (room.length > 1) {
                console.log('room length big')
                let users = users_in_rooms.get(roomid);
                let index = room.indexOf(ws);
                console.log(index);
                room.splice(index, 1);
                users.splice(index, 1);

                rooms_id.set(roomid, room);
                users_in_rooms.set(roomid, users);

                let leavemsg = {
                    type: 'Announcement',
                    leftroom: true,
                    name: name,
                    msg: `${name} left the room ${timeout=== true && 'due to timeout'}`
                };

                sendtoall(room, leavemsg);


                if (roomAdmin.has(roomid) && roomAdmin.get(roomid) === ws) {

                    roomAdmin.delete(roomid);
                    let s = 0;

                    let e = room.length - 1;
                    let randomadmin = Math.floor(Math.random() * (e - s + 1)) + s;
                    roomAdmin.set(roomid, room[randomadmin]);

                    let msg = {
                        type: 'Announcement',
                        change: true,
                        newAdmin: users[randomadmin],
                        msg: `${users[randomadmin]} is now the new Admin.${timeout=== true && 'due to timeout'}`
                    }
                    sendtoall(room, msg);


                }

            } else {
                console.log('clear the fucking room')
                roomAdmin.delete(roomid);
                rooms_id.delete(roomid);
                users_in_rooms.delete(roomid);
                await leavecall(data, users_in_videocall);
                let reqs = requesters.get(roomid);
                reqs.map((req) => {
                    let msg = {
                        type: 'response',
                        permission: 'Dec',
                        roomid: roomid,
                        name: name
                    }
                    req.ws.send((msg));

                })
                console.log('else this')
                requesters.delete(roomid)

            }
        }

        connections.delete(ws.id)

        ws.send({
            type: 'Announcement',
            left: true,
            msg: `You left the room ${roomid}${timeout=== true && 'due to timeout'}`
        });


    } catch (err) {
        throw new Error(`Error while leaving the room - ${ err.message}`, );
    }


}