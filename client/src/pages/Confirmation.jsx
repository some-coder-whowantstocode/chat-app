import React, { useEffect } from 'react';
import styled from 'styled-components';
import {NavLink, useNavigate} from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';
import CustomErrbox from '../components/CustomErrbox';
import Reqprocessing from '../components/landingpage/Reqprocessing';

const Rejoinpage = styled.div`
  height: 100vh;
  width: 100vw;
  max-height: 100%;
  max-width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Custombox = styled.div`
  
`

const Btn = styled(NavLink)`
  border: none;
  text-decoration: none;
  padding: 5px 8px;
  ${props=> props.colour ? `
  background:#0087ed;
  color:white;
  ` : `
  background:white;
  color:black;
  `};
  margin:5px;
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

&:active{
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px inset;
}

`

const Styledtext = styled.p`
  margin: 10px;
`

const Confirmation = () => {

  const {room_status,wanttorejoin,errmsg,rejoinmsg,leavecall} = useSocket()
  const navigate = useNavigate();

  useEffect(() => {
    if (room_status === "in room" && !leavecall) {
      navigate("/chat");
    }
  }, [room_status,leavecall]);
  return (
    <Rejoinpage>
        {
        errmsg.map((em,index)=>(
          
          <CustomErrbox key={index} msg={em.msg}/>
        ))
      }
      <Reqprocessing />
      

      <Custombox>
        <Styledtext>{rejoinmsg}</Styledtext>
        <Btn colour={'blue'} onClick={()=>{
          wanttorejoin()
          }}>Rejoin</Btn>
        <Btn onClick={()=>{
          sessionStorage.removeItem('name');
          sessionStorage.removeItem('joinname');
          sessionStorage.removeItem('room');
          sessionStorage.removeItem('joinroom');
        }} to={'/landingpage'}>Go back to Landing page</Btn>
      </Custombox>
    </Rejoinpage>
  )
}

export default Confirmation
