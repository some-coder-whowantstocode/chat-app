module.exports.joincall = (data, ws, ROOM) => {
    try {
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
        ws.send({
            type: 'videocall',
            msg: 'you joined the call'
        })
    } catch (error) {
        console.log(error)
    }
  
}