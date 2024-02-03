import styled from 'styled-components';
import RemoteVideos from '../components/videocall/RemoteVideos';
import Usermedia from '../components/videocall/Usermedia';
import React, { useState,useEffect } from 'react';
import { useSocket } from '../context/SocketProvider';
import RequestBox from '../components/Chatpage/RequestBox';
import notification from "../assets/notification.wav";
import { Actions } from '../utils/Actions';


const Page = styled.div`
width:100vw;
}

height: 100dvh;
position: relative;
`



const VideochatPage = () => {

  const [reqdata, setreqdata] = useState([]);
  const [notificationsound] = useState(new Audio(notification));
  const {socket,curr_poss,Transport} = useSocket()

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
          console.log('recieved',jsondata)
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
      
    <RemoteVideos/>   
      
      
    {reqdata.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}

    </Page>
  )
}

export default React.memo(VideochatPage)
