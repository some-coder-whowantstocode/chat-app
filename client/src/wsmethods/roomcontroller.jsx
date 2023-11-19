const createRoom =(socket,name,roomid)=>{
    try{
        if(socket){
            socket.send({create:true,roomid:roomid,name:name})
        }
    }catch(err){
        console.log(err);
    }
  
}

const joinRoom =(socket,name,roomid)=>{
    try{
        
             if(socket){
                socket.send({join:true,roomid:roomid,name:name})
    
             }
              
            }catch(error){
               console.log(error)
            }
            
}

const leaveRoom = async(socket)=>{
    try {
         await socket.send({
              leave: true,
              name: sessionStorage.getItem('name'),
              roomid: sessionStorage.getItem('room')
          });
          sessionStorage.removeItem('name');
          sessionStorage.removeItem('room');
      } catch (err) {
          console.log(err);
      }
}

const cancelrequest =async(socket)=>{
    await socket.send({
        cancel:true,
        name:sessionStorage.getItem('joinname'),
        roomid:sessionStorage.getItem('joinroom')
    })
    sessionStorage.removeItem('joinroom');
    sessionStorage.removeItem('joinname');
}


export {
    createRoom,
    joinRoom,
    leaveRoom,
    cancelrequest
};