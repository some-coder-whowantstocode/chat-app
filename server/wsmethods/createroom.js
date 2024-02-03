const { CUSTOM_RESPONSE } = require("../responses");

module.exports.Createroom = (data, ws, ROOM) => {

    try {
        const { roomid, name } = data;
        console.log(data)

        if (!roomid || !name || roomid == '' || name == '') {
            ws.send(CUSTOM_RESPONSE.CREATE_ROOM.REJECT.INVALID_CREDINTIALS);
            return;
        }
        if (ROOM.has(roomid)) {
            ws.send(CUSTOM_RESPONSE.CREATE_ROOM.REJECT.ROOM_EXISTS);
            return;
        }

        const key = Date.now().toString(36) + Math.random().toString(36).slice(2);

        let mem = new Array()
        mem.push( {
            name,
            incall:false,
            active:true,
            ws
        })
        ROOM.set(roomid,
            {
                key,
                users:1,
                members:mem,
                admin:{
                    name,
                    ws
                },
                call:[],
                requesters:[]
            }
        )
        let res = {...CUSTOM_RESPONSE.CREATE_ROOM.ACCEPT}
        res.name = name;
        res.roomid = roomid;
        res.key = key;
        console.log(res)
        ws.send(res);
       
    } catch (err) {
        throw new Error(`Error while creating the room - ${ err.message}`, );
    }

}

//add key