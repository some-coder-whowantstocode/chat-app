import React, { useEffect, useRef } from 'react'
import { useVideo } from '../context/Videochatcontroller';
import { MdCallEnd } from "react-icons/md";
import { IoVideocam , IoVideocamOff } from "react-icons/io5";
import { IoMdMic , IoIosMicOff } from "react-icons/io";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { CustomPoster } from '../components/videocall/Customstyles';
import { useSocket } from '../context/SocketProvider';



const Controls = styled.div`
position: absolute;
bottom: 0;
left: 50%;
transform: translateX(-50%);
z-index: 100;
`

const Quit = styled(MdCallEnd)`
  background-color: #b70404;
  color: white;
  padding: 10px;
  height: 20px;
  width: 20px;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 10px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  &:active{
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px inset;
  }
`

const Cam = styled(IoVideocam)`
 padding: 8px;
height: 20px;
  width: 20px;
  border-radius: 6px;
  background-color: gray;
  cursor: pointer;
`

const Camoff = styled(IoVideocamOff)`
   padding: 8px;
height: 20px;
  width: 20px;
  border-radius: 6px;
  background-color: gray;
  cursor: pointer;
`

const Mic = styled(IoMdMic)`
   padding: 8px;
height: 20px;
  width: 20px;
  border-radius: 6px;
  background-color: gray;
  cursor: pointer;
`

const Micoff = styled(IoIosMicOff)`
   padding: 8px;
height: 20px;
  width: 20px;
  border-radius: 6px;
  background-color: gray;
  cursor: pointer;
`

const VideochatPage = () => {
  const {remoteVideo,mystreams,handlevideo,media,goback,leavecall} = useVideo();
  const {wanttoleave} = useSocket();
  const username = sessionStorage.getItem('name')
  const videoref = useRef(null);

  useEffect(()=>{
    if(videoref.current){
      const video = videoref.current;
      video.srcObject = mystreams;
      video.autoplay = true;
      video.onloadedmetadata =()=>{
        video.play();
      }
    }
  },[videoref,mystreams])

  useEffect(()=>{
    const handler = async () => {
      await wanttoleave(false);
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  },[])

  const navigate = useNavigate();

  const backtochat =async()=>{

    goback();
    if(videoref.current){
        videoref.current.srcObject = null;
    }
    
    await leavecall()
    navigate('/chat')

}
 
  return (
    <div>
      {
        media.current.cam ?
        <video ref={videoref}>
        </video>
        :
        <CustomPoster><div>{username.slice(0,2)}</div></CustomPoster>
      }
     

      <Controls>
        {
          media.current.cam ?
          <Cam 
          onClick={()=>handlevideo(true)}
          />
          :
          <Camoff
          onClick={()=>handlevideo(true)}
          />
        }
        <Quit
        onClick={()=>backtochat()}
        />
        {
          media.current.mic ?
          <Mic 
          onClick={()=>handlevideo(false)}
          />
          :
          <Micoff
          onClick={()=>handlevideo(false)}
          />
        }    

      </Controls>
       {
        remoteVideo.map(({stream},index)=>{
            return React.createElement('video', { key: index, ref: video => {
                if (video) {
                  stream.getTracks().forEach((track)=>{
                    track.enabled = true;
                  })
                  video.srcObject = stream
                  video.autoPlay = true
                  video.onloadedmetadata = () => {
                    video.play();
                  };
               
                }
              }});
        })
    }
    </div>
  )
}

export default VideochatPage
