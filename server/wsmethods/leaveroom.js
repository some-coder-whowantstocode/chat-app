const { sendtoall } = require("./senttoall");
const { leavecall } = require("./videocall/leavecall");

module.exports.leaveroom = async(data, ws, rooms_id, users_in_rooms, roomAdmin, requesters, users_in_videocall, timeout) => {
    try {
        let room = rooms_id.get(data.roomid);

        if (!room) {
            ws.send({
                type: 'Announcement',
                left: true,
                msg: `You left the room ${data.roomid} ${timeout=== true && 'due to timeout'}`
            });
            return;
        }
        console.log('this', ws)

        if (room.length > 1) {
            let users = users_in_rooms.get(data.roomid);
            let index = room.indexOf(ws);
            room.splice(index, 1);
            users.splice(index, 1);

            rooms_id.set(data.roomid, room);
            users_in_rooms.set(data.roomid, users);

            let leavemsg = {
                type: 'Announcement',
                leftroom: true,
                name: data.name,
                msg: `${data.name} left the room ${timeout=== true && 'due to timeout'}`
            };

            sendtoall(room, leavemsg);
            console.log('then this', room)


            if (roomAdmin.has(data.roomid) && roomAdmin.get(data.roomid) === ws) {

                roomAdmin.delete(data.roomid);
                console.log('may be this')
                let s = 0;

                let e = room.length - 1;
                let randomadmin = Math.floor(Math.random() * (e - s + 1)) + s;
                roomAdmin.set(data.roomid, room[randomadmin]);

                let msg = {
                    type: 'Announcement',
                    change: true,
                    newAdmin: users[randomadmin],
                    msg: `${users[randomadmin]} is now the new Admin.${timeout=== true && 'due to timeout'}`
                }
                sendtoall(room, msg);


            }

        } else {
            roomAdmin.delete(data.roomid);
            rooms_id.delete(data.roomid);
            users_in_rooms.delete(data.roomid);
            await leavecall(data, users_in_videocall);
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
            console.log('else this')
            requesters.delete(data.roomid)

        }

        ws.send({
            type: 'Announcement',
            left: true,
            msg: `You left the room ${data.roomid}${timeout=== true && 'due to timeout'}`
        });


    } catch (err) {
        throw new Error(`Error while leaving the room - ${ err.message}`, );
    }


}