const createRoom = (socket, name, roomid) => {
    try {
        if (socket) {
            socket.send({ type: 'create', roomid: roomid, name: name })
        }
    } catch (err) {
        console.log(err);
    }

}

const joinRoom = (socket, name, roomid) => {
    try {
        if (socket) {
            socket.send({ type: 'join', roomid: roomid, name: name })

        }

    } catch (error) {
        console.log(error)
    }

}

const leaveRoom = async(socket, temp) => {
    try {
        await socket.send({
            type: 'leave',
            name: sessionStorage.getItem('name'),
            roomid: sessionStorage.getItem('room'),
            key: sessionStorage.getItem('roomkey')
        });


    } catch (err) {
        console.log(err);
    }
}

const cancelrequest = async(socket) => {
    try{
        await socket.send({
            type: "cancel",
            name: sessionStorage.getItem('name'),
            roomid: sessionStorage.getItem('room')
        })
        sessionStorage.removeItem('room');
        sessionStorage.removeItem('name');
    }catch(err){
        console.log(err);
    }
  
}



export {
    createRoom,
    joinRoom,
    leaveRoom,
    cancelrequest
};