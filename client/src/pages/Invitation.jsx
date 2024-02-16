import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controls, Custombtn, Input, Page } from '../components/landingpage/customstyles';
import styled from 'styled-components';
import { useSocket } from '../context/SocketProvider';
import Customerrors from '../components/Error/Customerrors';
import { Actions } from '../utils/Actions';
import Reqprocessing from '../components/landingpage/Reqprocessing';

const InvitationPage =styled.div`
display:flex;
align-items:center;
justify-content:center;
background: linear-gradient(to right, rgb(200, 190, 210), rgb(190, 200, 210)); 
height:100vh;
width:100vw;
flex-direction:column;

`

const Invitation =()=>{
    const [name , setname] = useState('');
    const { roomid } = useParams();
    const pageref = useRef();
    const { wanttojoin, Transport, wanttocancel } = useSocket();

    useEffect(() => {
      if (pageref.current) {
        const children = pageref.current;
        const titles = children.children[0];
        const inputs = children.children[1];
      
        console.log(titles,inputs)
        const handleclick = () => {
            if (document.activeElement === inputs) {
              titles.style = `
                          position: absolute;
                          top: -2px;
                          font-size: 15px;
                          transition-duration: 0.5s;
                          background-blend-mode: multiply;
                          color:white;
                          `;
  
              inputs.style = `
                      color:black;
                  `;
            } else {
              if(inputs.value === ''){
                titles.style = `
                position: absolute;
                top:13px;
                font-size: 20px;
                transition-duration: 0.5s;
  
                `;
    inputs.style = `
                color:transparent;
  
            `;
              }

            
            }
          }
        window.addEventListener("click", handleclick);
  
        return () => window.removeEventListener("click", handleclick);
      };
      
    }, [pageref]);


    useEffect(() => {
      const handler = () => {
        wanttocancel();
      };
  
      window.addEventListener('beforeunload', handler);
  
      
  
      return () => {
          window.removeEventListener('beforeunload', handler);
      };
  }, []);
 
    return(
      <>
      <Customerrors/>
      <Reqprocessing/>
        <InvitationPage >
        <Input ref={pageref}>
            <div>
              <p
              style={{
                transitionDuration:'0.5s',
                background: 'linear-gradient(to right, rgb(200, 190, 210), rgb(190, 200, 210))'
              }}
              >Name</p>
            </div>
            <input autoComplete="off" value={name} onChange={(e)=>setname(e.target.value)} type="text" />
          </Input>
          <div
          style={{
            marginBottom:'10px',
          }}
          >Select a name to join the room...</div>
          <Controls>
            <Custombtn
            color='rgb(0, 112, 217)'
              onClick={() =>
                wanttojoin(
                 name,
                 roomid
                )
              }
            >
             JOIN
            </Custombtn>
            <Custombtn
            color='gray'
              onClick={() =>
                Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
              }
            >
              GO BACK
            </Custombtn>
          </Controls>
        </InvitationPage>
        </>
    )
}

export default Invitation;