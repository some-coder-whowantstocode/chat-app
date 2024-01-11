module.exports.joincall = (data, ws, users_in_videocall) => {
    console.log('data', data)
    const { roomid, name } = data;
    let roomoffer = users_in_videocall.get(roomid);
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
    users_in_videocall.set(roomid, roomoffer)
    console.log(users_in_videocall)
    ws.send({
        type: 'videocall',
        msg: 'you joined the call'
    })
}