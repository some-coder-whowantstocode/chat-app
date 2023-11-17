import React from 'react'
import { 
    Probox,
    Contentbox,
    Btn,
    Loader
 } from './customstyles';
import { useSocket } from '../../context/SocketProvider';

const Reqprocessing = () => {

    const {socket,waiting,updatewait} = useSocket();

    const cancelrequest =()=>{
        socket.send(JSON.stringify( {
            cancel:true,
            name:localStorage.getItem('name'),
            roomid:localStorage.getItem('roomid')
        }))
        updatewait();
       
    }

    


  return (
    <>
    {
        waiting && 
        <Probox>
        <Contentbox>
            <Loader/>
            waiting for someone to let in...
            <Btn onClick={()=>cancelrequest()}>cancel</Btn>
        </Contentbox>
    </Probox>
    }
    </>
  )
}

export default Reqprocessing
