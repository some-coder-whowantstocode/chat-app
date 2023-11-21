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

  const {entry,wanttorejoin,errmsg,rejoinmsg} = useSocket()
  const navigate = useNavigate();

  useEffect(() => {
    if (entry === true) {
      navigate("/chat");
    }
  }, [entry]);
  return (
    <Rejoinpage>
        {
        errmsg.map((em)=>(
          
          <CustomErrbox msg={em.msg}/>
        ))
      }
      <Reqprocessing />
      

      <Custombox>
        <Styledtext>{rejoinmsg}</Styledtext>
        <Btn colour={'blue'} onClick={()=>{
          wanttorejoin()
          console.log('hi')
          }}>Rejoin</Btn>
        <Btn  to={'/landingpage'}>Go back to Landing page</Btn>
      </Custombox>
    </Rejoinpage>
  )
}

export default Confirmation
