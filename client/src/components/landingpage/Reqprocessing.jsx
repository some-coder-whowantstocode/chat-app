import React from 'react'
import { 
    Probox,
    Contentbox,
    Btn,
    Loader
 } from './customstyles';
import { useSocket } from '../../context/SocketProvider';

const Reqprocessing = () => {

    const {waiting,wanttocancel} = useSocket();


  return (
    <>
    {
        waiting == true && 
        <Probox>
        <Contentbox>
            <Loader/>
            waiting for someone to let in...
            <Btn onClick={()=>wanttocancel()}>cancel</Btn>
        </Contentbox>
    </Probox>
    }
    </>
  )
}

export default Reqprocessing
