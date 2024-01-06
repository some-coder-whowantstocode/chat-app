import { useCallback, useEffect, useRef, useState } from 'react'
import { useVideo } from '../context/Videochatcontroller';
import { MdCallEnd } from "react-icons/md";
import { IoVideocam , IoVideocamOff } from "react-icons/io5";
import { IoMdMic , IoIosMicOff } from "react-icons/io";
import styled from 'styled-components';
import RemoteVideos from '../components/videocall/RemoteVideos';
import { useSocket } from '../context/SocketProvider';

const Page = styled.div`
width: 50vw;
height: 100vh;
position: relative;
`


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

const Myvideo = styled.video`
  position: absolute;
    bottom: 10px;
    right: 10px;
    height: 100px;
    width: 160px;

    &:hover{
      cursor: move;
    }
`

const CustomPoster = styled.div`
  position: absolute;
    bottom: 10px;
    right: 10px;
     height: 100px;
    width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d1cece;
    border-radius: 20px;
    div{
        color: white;
        height: 50%;
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        background-color: gray;
        border-radius: 50%;
    }

    &:hover{
      cursor: move;
    }
`


const VideochatPage = () => {
  const {Mediacontroller,media,gonnaleave} = useVideo();
  const {myvideo,myaudio} = useSocket();
  const username = sessionStorage.getItem('name')
  const videoref = useRef(null);
  const audioref = useRef(null);
  const posterref = useRef(null);
  const lastpos = useRef({x:innerWidth,y:innerHeight});
  const Drag = useRef(false);


console.log('why are you rerenderning')
useEffect(()=>{
  if(videoref.current && myaudio){
    const audio = audioref.current;
    console.log(myaudio);
    audio.srcObject = myaudio
    audio.autoPlay = true
    audio.onloadedmetadata = () => {
        audio.play();
      };
}
},[audioref,myaudio]);

  const backtochat =async()=>{
    videoref.current = null;
    audioref.current = null;
    posterref.current = null;
    gonnaleave(true);
}


const handleMousemove = (animationId,element)=>{
  console.log(element)
  return function(e){
    if(element){
      if(Drag.current === true){
        // console.log( e.clientX , e.clientY )
        cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(() => {
        lastpos.current.y =  element.style.top = `${e.clientY - (element.offsetHeight/2)}px`;
        lastpos.current.x = element.style.left = `${e.clientX - ((innerWidth /2) + (element.offsetWidth*(3/2)))}px`;
      });
      }else{
  
        if(Number(element.style.top.slice(0,-2)) < 0) element.style.top = '0px';
        if(Number((element.style.top ).slice(0,-2) )+ element.offsetHeight > window.innerHeight) element.style.top = `${window.innerHeight - element.offsetHeight}px`;
        if(Number(element.style.left.slice(0,2)) < 0) element.style.left = '0px';
        if(Number((element.style.left).slice(0,-2) ) + element.offsetWidth > window.innerWidth) element.style.left = `${window.innerWidth - element.offsetWidth}px`;
      }
    }
 
  }

};

useEffect(()=>{
  const releasevideo =()=>{
    Drag.current = false;
  }


  window.addEventListener('mouseup',releasevideo);
  window.addEventListener('mouseleave',releasevideo);

  return(()=>{
    window.removeEventListener('mouseup',releasevideo);
    window.removeEventListener('mouseleave',releasevideo);
    })
   
  
},[])


useEffect(()=>{
  if(videoref.current)
  {
    if(myvideo){
      const video = videoref.current;
      console.log(myvideo);
      video.srcObject = myvideo
      video.autoPlay = true
      video.onloadedmetadata = () => {
          video.play();
        };
  }
    console.log('video')
    const lockvideo =()=>{
      Drag.current = true;
    }
    let videoelement = videoref.current
  
    videoelement.style.top = lastpos.current.y;
    videoelement.style.left = lastpos.current.x;
  
  
   
    window.addEventListener('mousemove',handleMousemove(null,videoelement));
    videoelement.addEventListener('mousedown',lockvideo);
  
    return(()=>{
    window.removeEventListener('mousemove',handleMousemove);
    videoelement.removeEventListener('mousedown',lockvideo);
    videoref.current = null;
    })
   
  
  }
 
 
  
},[videoref,myvideo])



useEffect(()=>{
  if(posterref.current){
    console.log('poster')
    const lockvideo =()=>{
      Drag.current = true;
    }
    let videoelement = posterref.current
  
    videoelement.style.top = lastpos.current.y;
    videoelement.style.left = lastpos.current.x;
  
  
   
    window.addEventListener('mousemove',handleMousemove(null,videoelement));
    videoelement.addEventListener('mousedown',lockvideo);
  
    return(()=>{
    window.removeEventListener('mousemove',handleMousemove);
    videoelement.removeEventListener('mousedown',lockvideo);
    posterref.current = null
    })
   
  
   
  }
 
  
},[posterref])


 
  return (
    <Page>
      {
        media.current.cam ?
        <Myvideo ref={videoref} poster=''>
        </Myvideo>
        :
        <CustomPoster
        ref={posterref}
        ><div>{username.slice(0,2)}</div></CustomPoster>
      }
     <audio ref={audioref}/>

      <Controls>
        {
          media.current.cam ?
          <Cam 
          onClick={()=>{
            // change(!toggle);
            Mediacontroller("remove_video")
          }}
          />
          :
          <Camoff
          onClick={()=>{
            // change(!toggle);
            Mediacontroller("add_video")
        }}
          />
        }
        <Quit
        onClick={()=>backtochat()}
        />
        {
          media.current.mic ?
          <Mic 
          onClick={()=>Mediacontroller("remove_audio")}
          />
          :
          <Micoff
          onClick={()=>Mediacontroller("add_audio")}
          />
        }    

      </Controls>
      {
        <RemoteVideos/>

      }
    </Page>
  )
}

export default VideochatPage
