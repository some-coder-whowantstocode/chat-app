import styled from 'styled-components';
import RemoteVideos from '../components/videocall/RemoteVideos';
import Usermedia from '../components/videocall/Usermedia';
import React, { useState,useEffect } from 'react';
import { useSocket } from '../context/SocketProvider';
import RequestBox from '../components/Chatpage/RequestBox';
import notification from "../assets/notification.wav";
import { Actions } from '../utils/Actions';
import Remotevideo from '../components/videocall/Remotevideo';


const Page = styled.div`
width:100vw;
}

height: 100dvh;
position: relative;
overflow:hidden;
max-width: inherit;
overflow: hidden;
background-color: #1f1f1f;
display: grid;
grid-template-columns:  repeat(2, 1fr);;
grid-auto-rows: ${innerHeight/2};
grid-gap: 10px;
`



const VideochatPage = () => {

  const {curr_poss,Transport,pc,requests} = useSocket()

  useEffect(() => {
    if (curr_poss.activity.main_act !== Actions.TRANSPORT_LOCATIONS.CHAT ) {
      Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
    }
  }, []);

  

  
  return (
    <Page>
     
    <Usermedia/>
      
    {/* <RemoteVideos/>    */}
    {
      pc.map((r,index)=> 
          ( <Remotevideo key={index} r={r}/>)
           
        )
      }   
      
    {requests.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}

    </Page>
  )
}

export default VideochatPage
