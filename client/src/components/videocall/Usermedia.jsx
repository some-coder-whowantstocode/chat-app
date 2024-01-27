import { useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketProvider';
import styled from 'styled-components';
import { MdCallEnd } from "react-icons/md";
import { IoVideocam , IoVideocamOff } from "react-icons/io5";
import { IoMdMic , IoIosMicOff } from "react-icons/io";
import { useState } from 'react';
import { useVideo } from '../../context/Videochatcontroller';
import { Mediacontroller } from '../../utils/mediahandler';
import { Actions } from '../../utils/Actions';
// import { useNavigate } from 'react-router-dom';



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


const Usermedia = () => {

    const {media,gonnaleave} = useVideo();
 
  const [toggle,change] = useState(false);
 

    const videoref = useRef(null);
    const audioref = useRef(null);
    const posterref = useRef(null);

    const {myvideo,myaudio,setmyaudio,setmyvideo,socket,pc,Transport} = useSocket();
    const username = sessionStorage.getItem('name')
    const [video,setvideo] = useState(myvideo);
    const [audio,setaudio] = useState(myaudio);
    const [leave,setleave] = useState(false);

    useEffect(()=>{
        const func_leave =()=>{
          try{
            videoref.current = null;
            posterref.current = null;
            audioref.current = null;
            if(video){
              let tracks = video.getTracks();
              tracks.forEach((t)=>{
                  t.stop()
              })
            }
          
          if(audio){
            let tracks = audio.getTracks();
            tracks.forEach((t)=>{
                t.stop()
            })
          }
          
                gonnaleave(true)
                setleave(false);
                
        
          }catch(err){
            console.log(err)
          }
        }
        if(leave===true){
          console.log('leving')
            func_leave()
        }

        window.addEventListener('beforeunload',func_leave)
    },[leave,audio,video])

    console.log(media)

    const lastpos = useRef({x:innerWidth,y:innerHeight});
    const Drag = useRef(false);

    useEffect(()=>{
        if(audioref.current && audio){
          const audiodiv = audioref.current;
          audiodiv.srcObject = audio
          audiodiv.autoPlay = true
          audiodiv.onloadedmetadata = () => {
            audiodiv.play();
            };
      }
      },[audioref,audio]);

    useEffect(()=>{
        const releasevideo =()=>{
          Drag.current = false;
        }
      
      
        window.addEventListener('mouseup',releasevideo);
        window.addEventListener('mouseleave',releasevideo);
        // window.addEventListener('beforeunload',)
      
        return(()=>{
          window.removeEventListener('mouseup',releasevideo);
          window.removeEventListener('mouseleave',releasevideo);
          })
         
        
      },[])

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
    
    useEffect(() => {
    if (videoref.current) {
        let videoelement = videoref.current
        if (video) {
            videoelement.srcObject = video
            videoelement.autoPlay = true
            videoelement.onloadedmetadata = () => {
                videoelement.play();
            };
        }
        console.log('video')
        const lockvideo = () => {
            Drag.current = true;
        }
       
  
        videoelement.style.top = lastpos.current.y;
        videoelement.style.left = lastpos.current.x;
  
        const handleMouseMove = handleMousemove(null, videoelement);
  
        window.addEventListener('mousemove', handleMouseMove);
        videoelement.addEventListener('mousedown', lockvideo);
  
        return (() => {
            window.removeEventListener('mousemove', handleMouseMove);
            videoelement.removeEventListener('mousedown', lockvideo);
            videoelement.srcObject = null
        })
    }
    }, [videoref, video, toggle])

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
   
    
    },[posterref,toggle])

    // const navigate = useNavigate()
  return (
    <div>
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
            Mediacontroller("remove_video",pc,socket,media,video) 
            .then((stream)=>{
              setvideo(stream);
              setmyvideo(stream);
              change(!toggle)
              
            })
          }}
          />
          :
          <Camoff
          onClick={()=>{
            Mediacontroller("add_video",pc,socket,media,video) 
            .then((stream)=>{
              setvideo(stream);
              setmyvideo(stream);
              change(!toggle)

            })
          }}
          />
        }
        <Quit
        onClick={async()=>{
          setleave(true)
           
        }}
        />
        {
          media.current.mic ?
          <Mic 
          onClick={()=>{
            Mediacontroller("remove_audio",pc,socket,media,audio) 
            .then((stream)=>{
              setaudio(stream);
              setmyaudio(stream);
              change(!toggle)

            })
          }}
          />
          :
          <Micoff
          onClick={()=>{
            Mediacontroller("add_audio",pc,socket,media,audio) 
            .then((stream)=>{
              setaudio(stream);
              setmyaudio(stream);
              change(!toggle)
            })
          }}
          />
        }    

      </Controls>

    </div>
  )
}

export default Usermedia
