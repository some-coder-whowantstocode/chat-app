const { sendtoall } = require("./senttoall");
const { leavecall } = require("./videocall/leavecall");

module.exports.leaveroom = (data, ws, rooms_id, users_in_rooms, roomAdmin, requesters, users_in_videocall) => {
    try {
        let room = rooms_id.get(data.roomid);

        if (!room) {
            ws.send({
                type: 'Announcement',
                msg: `You left the room ${data.roomid}`
            });
            return;
        }


        if (room.length > 1) {
            let users = users_in_rooms.get(data.roomid);
            let index = room.indexOf(ws);
            room.splice(index, 1);
            users.splice(index, 1);

            rooms_id.set(data.roomid, room);
            users_in_rooms.set(data.roomid, users);

            let leavemsg = {
                type: 'Announcement',
                left: true,
                name: data.name,
                msg: `${data.name} left the room `
            };

            sendtoall(room, leavemsg);


            if (roomAdmin.has(data.roomid) && roomAdmin.get(data.roomid) === ws) {

                roomAdmin.delete(data.roomid);

                let s = 0;

                let e = room.length - 1;
                let randomadmin = Math.floor(Math.random() * (e - s + 1)) + s;
                roomAdmin.set(data.roomid, room[randomadmin]);

                let msg = {
                    type: 'Announcement',
                    change: true,
                    newAdmin: users[randomadmin],
                    msg: `${users[randomadmin]} is now the new Admin.`
                }
                sendtoall(room, msg);


            }

        } else {
            roomAdmin.delete(data.roomid);
            rooms_id.delete(data.roomid);
            users_in_rooms.delete(data.roomid);
            leavecall(data, users_in_videocall);
            // connections.find(data.roomid) && connections.delete(data.roomid);
            let reqs = requesters.get(data.roomid);
            reqs.map((req) => {
                let msg = {
                    type: 'response',
                    permission: 'Dec',
                    roomid: data.roomid,
                    name: data.name
                }
                req.ws.send((msg));

            })
            requesters.delete(data.roomid)

        }

        ws.send({
            type: 'Announcement',
            msg: `You left the room ${data.roomid}`
        });


    } catch (err) {
        throw new Error(`Error while leaving the room - ${ err.message}`, );
    }


}