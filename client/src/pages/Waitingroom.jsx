import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../context/Videochatcontroller';
import defaultimage from  '../assets/default.png'
import styled from 'styled-components';
import { IoVideocam,IoVideocamOff  } from "react-icons/io5";
import { IoIosMic,IoIosMicOff } from "react-icons/io";
import { CustomPoster } from '../components/videocall/Customstyles';
import { useSocket } from '../context/SocketProvider';



const CustomVideo =styled.video`
    height: 50vh;
    width: 60vw;
    border-radius: 18px;
`

const VideoHolder = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
  
    
`

const VideoOption = styled.div`
    position: absolute;
    ${
        props=>`
            bottom:${props.pos.bottom};
            right:${props.pos.right};
        `
    }
    padding: 5px;
    border-radius: 50%;
    height: fit-content;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #80808066;
    &:hover{
        background-color: gray;
    }
`


const Join = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: max-content;

  p{
    font-size: 20px;
    color: gray;
    margin-bottom: 8px;
  }
  div{
    display: flex;
  }

  
`

const CustomJoin = styled.div`
   width: 70px;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    padding: 10px 5px;
    border: none;
    background-color:${props=>props.color} ;
    ${props=>props.color ?
    `
    color: white;
      
    `
  :
  `
    
  `
  
  }
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active{
      box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px inset;
    }
`

const Waitingroom = () => {

    const { goback , handlevideo , media , joincall , mystreams , Getmedia } = useVideo();
    const { wanttoleave } = useSocket();
    const videoref = useRef(null);
    const username = sessionStorage.getItem('name');


    useEffect(()=>{
      Getmedia();
      const handler = async () => {
        await wanttoleave(false);
      };
  
      window.addEventListener("beforeunload", handler);
  
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    },[])
   

    useEffect(()=>{
        if(videoref.current){
            const video = videoref.current;
            video.srcObject = mystreams
            video.autoPlay = true
            video.onloadedmetadata = () => {
                video.play();
              };
        }
    },[videoref,mystreams])

    useEffect(()=>{

    },[media]);
   
    const navigate = useNavigate();


    const backtochat =()=>{

        goback();
        if(videoref.current){
            videoref.current.srcObject = null;
        }
        navigate('/chat')

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
      
       
        
       if(videoref.current){
        const element = videoref.current;
      
        const handlemousemove =(e)=>{
          if(Drag === true){
            cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(() => {
            element.style.top = `${e.clientY - element.offsetHeight / 2}px`;
            element.style.left = `${e.clientX - element.offsetWidth / 2}px`;
          });
          }else{
            if(Number(element.style.top.slice(0,-2)) < 0) element.style.top = '0px'
            if(Number((element.style.top ).slice(0,-2) )+ element.offsetHeight > window.innerHeight) element.style.top = `${window.innerHeight - element.offsetHeight}px`
            if(Number(element.style.left.slice(0,2)) < 0) element.style.left = '0px'
            if(Number((element.style.left).slice(0,-2) ) + element.offsetWidth > window.innerWidth) element.style.left = `${window.innerWidth - element.offsetWidth}px`
          }
        }
      
      
        window.addEventListener('mouseup',releasevideo);
        window.addEventListener('mouseleave',releasevideo);
          window.addEventListener('mousemove',handlemousemove);
        element.addEventListener('mousedown',lockvideo);
      
        return(()=>{
          window.removeEventListener('mouseup',releasevideo);
          window.removeEventListener('mouseleave',releasevideo);
          window.removeEventListener('mousemove',handlemousemove);
          element.removeEventListener('mousedown',lockvideo);
        })
       }
      
       
        
       },[videoref])
      
      
  

  return (
    <>
   
    <VideoHolder>
      
        {
            media.current.cam ?
            <CustomVideo ref={videoref} poster={defaultimage} />
            :
            <CustomPoster><div>{username.slice(0,2)}</div></CustomPoster>
            
        }
    
      <VideoOption
      pos ={{bottom:`20px`,right:`50%`}}
      >
        {
            media.current.cam ?
            <IoVideocam
            size={30}
            onClick={()=>handlevideo(true)}
            />
            :
            <IoVideocamOff
            size={30}
            onClick={()=>handlevideo(true)}
            />
        }
       
      </VideoOption>
      <VideoOption
            pos ={{bottom:`20px`,right:`40%`}}
      
      >
        {
            media.current.mic === true ?
            <IoIosMic
            size={30}
            onClick={()=>handlevideo(false)}
            />
            :
            <IoIosMicOff
            size={30}
            onClick={()=>handlevideo(false)}
            />
        }
      </VideoOption>
    <Join>
      <p>Ready to join ?</p>
      <div>
      <CustomJoin color='#009dff' onClick={()=>{
        joincall()
        navigate('/videochat')
      }}>
        join now
    </CustomJoin>
    <CustomJoin color='#949494'
    onClick={()=>backtochat()}
    >
      cancel
    </CustomJoin>
      </div>
    

    </Join>
    
    </VideoHolder>
    </>
  )
}

export default Waitingroom
