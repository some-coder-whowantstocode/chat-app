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

  const [reqdata, setreqdata] = useState([]);
  const [notificationsound] = useState(new Audio(notification));
  const {socket,curr_poss,Transport,pc} = useSocket()

  useEffect(() => {
    if (curr_poss.activity.main_act !== Actions.TRANSPORT_LOCATIONS.CHAT ) {
      Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
    }
  }, []);

  useEffect(() => {
    const handleMessage = (jsondata) => {
      switch(jsondata.type){

        case 'request':
          notificationsound.play();
          setreqdata((prevreqdata) => [jsondata, ...prevreqdata]);
        break;

        case 'removereq':
          setreqdata((prevreqdata) => {
            let arr = prevreqdata.filter((r) => r.name != jsondata.name);
            return arr;
          });
        break;

      
     

      }
    }


    if (socket) {
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket]);

  
  return (
    <Page>
     
    <Usermedia/>
      
    {/* <RemoteVideos/>    */}
    {
      pc.map((r,index)=> 
          ( <Remotevideo key={index} r={r}/>)
           
        )
      }   
      
    {reqdata.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}

    </Page>
  )
}

export default React.memo(VideochatPage)
