const createRoom =(socket,name,roomid)=>{
    try{
        if(socket){
            socket.send({type:'create',roomid:roomid,name:name})
        }
    }catch(err){
        console.log(err);
    }
  
}

const joinRoom =(socket,name,roomid)=>{
    try{
             if(socket){
                socket.send({type:'join',roomid:roomid,name:name})
    
             }
              
            }catch(error){
               console.log(error)
            }
            
}

const leaveRoom = async(socket,temp)=>{
    try {
         await socket.send({
              type: 'leave',
              name: sessionStorage.getItem('name'),
              roomid: sessionStorage.getItem('room')
          });
          if(!temp){
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('room');
          }
          
      } catch (err) {
          console.log(err);
      }
}

const cancelrequest =async(socket)=>{
    await socket.send({
        type:"cancel",
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