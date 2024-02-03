module.exports.joincall = (data, ws, ROOM) => {
    const { roomid, name } = data;
    let Room = ROOM.get(roomid);
    let roomoffer = Room.call;
    let clientoffer = {
        ws,
        name
    }
    roomoffer.map((r) => {

        r.ws.send({
            type: 'videocall',
            command: 'newmem',
            name
        })
    })

    roomoffer.push(clientoffer);
    Room.call = roomoffer;
    ROOM.set(roomid,Room);
    // users_in_videocall.set(roomid, roomoffer)
    // console.log(users_in_videocall)
    ws.send({
        type: 'videocall',
        msg: 'you joined the call'
    })
}