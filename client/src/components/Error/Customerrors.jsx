import React from 'react'
import styled from 'styled-components'
import { useSocket } from '../../context/SocketProvider';
import CustomErrbox from './CustomErrbox';

const Errorcontainer = styled.div`
display:flex;
flex-direction:column-reverse;
position: absolute;
right: 0;
bottom: 80px;s
`


const Customerrors = () => {

    const { errmsg } = useSocket();

  return (
    <Errorcontainer
   >
     {
        errmsg.map((em,i)=>(
          <CustomErrbox key={`${i}th error`} id={em.id}  msg={em.msg}/>
        ))
      }
    </Errorcontainer>
  )
}

export default Customerrors
