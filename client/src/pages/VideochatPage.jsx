import { useEffect, useRef } from 'react'
import { useVideo } from '../context/Videochatcontroller';
import { MdCallEnd } from "react-icons/md";
import { IoVideocam , IoVideocamOff } from "react-icons/io5";
import { IoMdMic , IoIosMicOff } from "react-icons/io";
import styled from 'styled-components';
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

const Remoteuser = styled.video`
  height: 100px;
  width: 100px;
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
  const {remoteVideo,Mediacontroller,media,goback,myvideo,myaudio,toggle} = useVideo();
  const username = sessionStorage.getItem('name')
  const videoref = useRef(null);
  const audioref = useRef(null);
  const posterref = useRef(null);
  const lastpos = useRef({x:innerWidth,y:innerHeight});

  

  useEffect(()=>{
    if(videoref.current && myvideo){
        const video = videoref.current;
        console.log(myvideo);
        video.srcObject = myvideo
        video.autoPlay = true
        video.onloadedmetadata = () => {
            video.play();
          };
    }
},[videoref,myvideo])

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

  useEffect(()=>{
  if(videoref.current && posterref.current){
    return(()=>{
      videoref.current = null;
      audioref.current = null;
      posterref.current = null;
      goback()
    })
  }
  },[videoref,posterref])


  const backtochat =async()=>{
    videoref.current = null;
    audioref.current = null;
    posterref.current = null;
    goback();
}


useEffect(()=>{

  let Drag = false;
  let animationId;

  const releasevideo =()=>{
    Drag = false;
  }

  const lockvideo =()=>{
    Drag = true;
  }
 
  
 if(videoref.current  && media.current){
  const videoelement = videoref.current;
  videoelement.style.top = lastpos.current.y;
  videoelement.style.left = lastpos.current.x;
  
  const handlemousemove =(e)=>{
    if(Drag === true){
      // console.log(e.clientX,e.clientY)
      cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(() => {
      lastpos.current.y =  videoelement.style.top = `${e.clientY - (videoelement.offsetHeight/2)}px`;
      lastpos.current.x = videoelement.style.left = `${e.clientX - ((innerWidth /2) + (videoelement.offsetWidth*(3/2)))}px`;
      
    });
    }else{
      if(Number(videoelement.style.top.slice(0,-2)) < 0) videoelement.style.top = '0px'
      if(Number((videoelement.style.top ).slice(0,-2) )+ videoelement.offsetHeight > window.innerHeight) videoelement.style.top = `${window.innerHeight - videoelement.offsetHeight}px`
      if(Number(videoelement.style.left.slice(0,2)) < 0) videoelement.style.left = '0px'
      if(Number((videoelement.style.left).slice(0,-2) ) + videoelement.offsetWidth > window.innerWidth) videoelement.style.left = `${window.innerWidth - videoelement.offsetWidth}px`
    }
  }


  window.addEventListener('mouseup',releasevideo);
  window.addEventListener('mouseleave',releasevideo);
    window.addEventListener('mousemove',handlemousemove);
  videoelement.addEventListener('mousedown',lockvideo);

  return(()=>{
    window.removeEventListener('mouseup',releasevideo);
    window.removeEventListener('mouseleave',releasevideo);
    window.removeEventListener('mousemove',handlemousemove);
    videoelement.removeEventListener('mousedown',lockvideo);
  })
 }

 
  
 },[videoref,media,toggle])


 
  return (
    <Page>
      {
        // media.current.cam ?
        <Myvideo ref={videoref} poster=''>
        </Myvideo>
        // :
        // <CustomPoster
        // ref={videoref}
        // ><div>{username.slice(0,2)}</div></CustomPoster>
      }
     <audio ref={audioref}/>

      <Controls>
        {
          media.current.cam ?
          <Cam 
          onClick={()=>Mediacontroller("remove_video")}
          />
          :
          <Camoff
          onClick={()=>Mediacontroller("add_video")}
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
        remoteVideo.map(({stream},index)=>(
          <>
         { console.log(stream.getTracks())}
          <Remoteuser key={index} ref={(video)=>{
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
          }}/>
          </>
        ))
    }
    </Page>
  )
}

export default VideochatPage
