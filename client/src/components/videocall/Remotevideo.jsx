import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSocket } from '../../context/SocketProvider';
import { Actions } from '../../utils/Actions';
import PropTypes from 'prop-types'

// ... (Your styled components here)


const Remoteuser = styled.video`
  max-height: 100vh;
  min-height: inherit;
  width: 100%;
  border: 2px solid black;
`

const Remoteuser_poster = styled.div`
  background-color: gray;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  div{
    background-color: black;
    color: white;
    border-radius: 50%;
    padding: 10px;
  }
`

const Remotevideo = (props) => {
  const {r} = props;
  const [camAvailable, setCamAvailable] = useState(r.media_availability.cam);
  const {socket} = useSocket();
  const [rvideo,setvideo] = useState(r.stream);


  useEffect(()=>{
    if(r)
    {
      
      r.peer.ontrack = async({ streams }) => {
        console.log('ice')
  
        const newstream = streams[0];
        if (r.stream !== null) {
            let incomingTracks = newstream.getTracks();
  
            let existingTracks = r.stream.getTracks();
  
            let audioexists = false,
                videoexists = false;
            for (let i = 0; i < incomingTracks.length; i++) {
                if (incomingTracks[i].kind === "audio") {
                    audioexists = true;
                }
                if (incomingTracks[i].kind === "video") {
                    videoexists = true;
                }
            }
            for (let i = 0; i < existingTracks.length; i++) {
                if (
                    (existingTracks[i].kind === "audio" && audioexists) ||
                    (existingTracks[i].kind === "video" && videoexists)
                )
                    r.stream.removeTrack(existingTracks[i]);
            }
  
            r.stream = new MediaStream([...incomingTracks, ...existingTracks]);
        } else {
            r.stream = newstream;
        }
        setvideo(r.stream);
        // console.log(r.stream)
  
    };
  
    }
   
  },[r])

  console.log('hi from rv')

  useEffect(()=>{
    setvideo(r.stream);
    console.log(r.stream,'this ran')
  },[])

  useEffect(()=>{

    const handlecall =async(data)=>{
      try{
        console.log('media in remote')
        //console.log(data,data.command)
          switch(data.command){
      
              case Actions.CALL_ACTIONS.MEDIA:
                {               
                  console.log()
                  if(data.from === r.name){
                    setCamAvailable(data.video);
                  }
              }
              break;
  
              default:
                 //console.log(data);
              break;
          }
       
      
      }catch(err){
          console.log(err);
      }
     
  }

    if(socket){
      socket.addEventListener('message',handlecall)

      return()=>{
          socket.removeEventListener('message',handlecall)
      }
  }
  },[socket])

  return (
    <div>
      {
        camAvailable ?
          <Remoteuser
            ref={(video) => {
              try {
                if (video) {
                  video.srcObject = rvideo;
                  video.autoPlay = true
                  video.onloadedmetadata = () => {
                    video.play();
                  };
                }
              } catch (err) {
                console.log('error while using remotevideo : ', err);
              }
            }}
          >
            <div style={{ color: "white" }}>hi</div>
          </Remoteuser>
          :
          <Remoteuser_poster>
            <div>
              {r.name.substr(0, 2)}
            </div>
          </Remoteuser_poster>
      }
    </div>
  );
}

Remotevideo.propTypes = {
 r:PropTypes.object, 
}

export default Remotevideo;
