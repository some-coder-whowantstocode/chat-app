import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSocket } from '../../context/SocketProvider';
import { Actions } from '../../utils/Actions';
import PropTypes from 'prop-types'



const Remoteuser = styled.video`
  ${
    props=> `
    height:${props.height}px;
    width:${props.width}px;
    `
  }
`

const Remoteuser_poster = styled.div`
  background-color: gray;
  ${
    props=> `
    height:${props.height}px;
    width:${props.width}px;
    `
  }
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
  const {socket,media_size,pc} = useSocket();
  const [rvideo,setvideo] = useState(r.stream);


  useEffect(()=>{
    if(r)
    {
      
      r.peer.ontrack = async({ streams }) => {
  
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
  
    };
  
    }
   
  },[r])


  useEffect(()=>{
    setvideo(r.stream);
  },[pc])

  useEffect(()=>{

    const handlecall =async(data)=>{
      try{
          switch(data.command){
      
              case Actions.CALL_ACTIONS.MEDIA:
                {               
                  if(data.from === r.name){
                    setCamAvailable(data.video);
                  }
              }
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

  const playVideo =(video)=>{
    video.play();
  }

  return (
    <>
      {
        camAvailable ?
          <Remoteuser
          height={media_size.height}
          width={media_size.width}
            ref={(video) => {
              try {
                if (video) {
                  video.srcObject = rvideo;
                  video.autoPlay = true
                  video.onloadedmetadata = () => playVideo(video)
                  video.onloadeddata = () => playVideo(video)
                  video.onpause = () => playVideo(video)
                  video.oncanplay = () => playVideo(video)
                  video.disablePictureInPicture = true
                }
              } catch (err) {
                console.log('error while using remotevideo : ', err);
              }
            }}
          >
            <div style={{ color: "white" }}>hi</div>
          </Remoteuser>
          :
          <Remoteuser_poster
          height={media_size.height}
          width={media_size.width}
          >
            <div>
              {r.name.substr(0, 2)}
            </div>
          </Remoteuser_poster>
      }
    </>
  );
}

Remotevideo.propTypes = {
 r:PropTypes.object, 
}

export default Remotevideo;
