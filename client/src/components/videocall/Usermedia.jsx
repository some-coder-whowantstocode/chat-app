import { useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketProvider';
import styled from 'styled-components';
import { MdCallEnd } from "react-icons/md";
import { IoVideocam , IoVideocamOff } from "react-icons/io5";
import { IoMdMic , IoIosMicOff } from "react-icons/io";
import { useState } from 'react';
import { useVideo } from '../../context/Videochatcontroller';
import { Mediacontroller } from '../../utils/mediahandler';
import { MdOutlinePushPin } from "react-icons/md";



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

const Userpack = styled.div`


${
  props=>props.float ?
  `
  position:relative;
  height:${props.height}px;
  width:${props.width}px;
  top:0px;
  left:0px;
  `
  :
  `

  position:absolute;
  height: 100px;
  width: 200px;
  `
}
position:absolute;
height: 100px;
width: 200px;
bottom: 50px;
right: 70px;
background:black;
overflow:hidden;
z-index:100;
border-radius: 20px;
draggable:true;
touch-action:none;//for removing the block sign while dragging
span{
  transition:0.2s;
  opacity:0;
 
}

&:hover{
  span{
    opacity:1;
  }
}
`

const Optbtn = styled(MdOutlinePushPin)`
position:absolute;
top:7px;
right:4px;
color:brown;
cursor:pointer;
z-index:101;
height:25px;
width:25px;
padding:2px;
&:hover{
  background:#80808082;
  border-radius: 50%;
}
` 

const Myvideo = styled.video`
    height:inherit;
    width:inherit;

`

const CustomPoster = styled.div`
    height:inherit;
    width:inherit;
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

`


const Usermedia = () => {

    const {media,gonnaleave} = useVideo();
 
  const [toggle,change] = useState(false);
  const [float,setfloat] = useState(false);
 

    const videoref = useRef(null);
    const audioref = useRef(null);
    const posterref = useRef(null);

    const {myvideo,myaudio,setmyaudio,setmyvideo,socket,pc,media_size,setpinned,pinned} = useSocket();
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
            func_leave()
        }

        window.addEventListener('beforeunload',func_leave)
    },[leave,audio,video])


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
        window.addEventListener('touchend',releasevideo);
        return(()=>{
          window.removeEventListener('mouseup',releasevideo);
          window.removeEventListener('mouseleave',releasevideo);
        window.removeEventListener('touchend',releasevideo);
          })
         
        
      },[])

    const handleMove = (animationId,element)=>{
      return function(e){
        if(element){
          const {type} = e;
          let x,y;
          if(type === 'mousemove'){
            x = e.clientX;
            y = e.clientY;
          }
          if(type === 'touchmove'){
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
          }
            if(Drag.current === true){
              cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(() => {
              lastpos.current.y =  element.style.top = `${y - (element.offsetHeight/2)}px`;
              lastpos.current.x = element.style.left = `${x -  (element.offsetWidth/2)}px`;
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
      const playVideo =(video)=>{
        const playpromise = video.play();
        if(playpromise !== undefined ){
          playpromise
         
        }
      }
    if (videoref.current) {
        let videoelement = videoref.current
        if (video) {
            videoelement.srcObject = video
            videoelement.onloadedmetadata = () => playVideo(videoelement)
            videoelement.onloadeddata = () => playVideo(videoelement)
            videoelement.onpause = () => playVideo(videoelement)
            videoelement.oncanplay = () => playVideo(videoelement)
            videoelement.disablePictureInPicture = true

        }
       
  
  
        return (() => {
            videoelement.srcObject = null
        })
    }
    }, [videoref, video, toggle])

    useEffect(()=>{
    if(posterref.current){
      if(!float){

      const lockvideo =()=>{
          Drag.current = true;
      }
      let videoelement = posterref.current
    
      videoelement.style.top = lastpos.current.y;
      videoelement.style.left = lastpos.current.x;
    
    
     
      window.addEventListener('mousemove',handleMove(null,videoelement));
      window.addEventListener('touchmove',handleMove(null,videoelement));
      videoelement.addEventListener('mousedown',lockvideo);
      videoelement.addEventListener('touchstart',lockvideo)

      return(()=>{
      window.removeEventListener('mousemove',handleMove);
      window.removeEventListener('touchmove',handleMove);
      videoelement.removeEventListener('mousedown',lockvideo);
      videoelement.removeEventListener('touchstart',lockvideo)
      })
    }
     
    
     
    }
   
    
    },[posterref,toggle,float])


    useEffect(()=>{
      if(posterref.current){
        const element = posterref.current;
        if(float){
      
          element.style =  `
          position:relative;
          height:${media_size.height}px;
          width:${media_size.width}px;
          `
        }else{
          element.style = `
           
         

        
                  `
        }
      }
    },[float,posterref,media_size])

  return (
    <>
       <Userpack
       float={float}
       height={media_size.height}
       width = {media_size.width}
        ref={posterref}

       >
        <span>
       <Optbtn 
       onClick={()=>{
        setpinned(!pinned);
        setfloat(!float);
       }}
       />
       {/* <div>
        <p>pin</p>
       </div> */}
        </span>

       {
        media.current.cam ?
       
        <Myvideo ref={videoref} poster=''>
        </Myvideo>
        :
        <CustomPoster
        ><div>{username.slice(0,2)}</div></CustomPoster>
       
      }
      </Userpack>
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

    </>
  )
}

export default Usermedia
