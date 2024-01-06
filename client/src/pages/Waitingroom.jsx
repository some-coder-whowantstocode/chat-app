import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../context/Videochatcontroller';
import defaultimage from  '../assets/default.png'
import styled from 'styled-components';
import { IoVideocam,IoVideocamOff  } from "react-icons/io5";
import { IoIosMic,IoIosMicOff } from "react-icons/io";
// import { CustomPoster } from '../components/videocall/Customstyles';
import { useSocket } from '../context/SocketProvider';
import Loading from '../components/Loading';



const CustomVideo =styled.video`
    height: 100%;
    width: 100%;
    border-radius: 18px;
    background-color: #d1cece;
`


 const CustomPoster = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d1cece;
    border-radius: 20px;
    div{
        color: white;
        height: 100px;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        background-color: gray;
        border-radius: 50%;
    }
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

const WaitingRoom = styled.div`
  position: relative;
  height: 100vh;
  width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Videoholder = styled.div`
 height: 50%;
    width: 60%;
    position: relative;
`

const Waitingroom = () => {

    const { goback , Mediacontroller ,medialoading, media , joincall } = useVideo();
    const {changestatus, myvideo , myaudio} =useSocket()
    const videoref = useRef(null);
    const audioref = useRef(null);
    const username = sessionStorage.getItem('name');

   

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
   
    // const navigate = useNavigate();


    const backtochat =()=>{

        goback();
        if(videoref.current){
            videoref.current.srcObject = null;
        }
        console.log('is this runnerd')
        changestatus('not_in_call')

    }

      // console.log('hi waiting mf')
  

  return (
    <WaitingRoom>
   
      <Videoholder>

      {
            media.current.cam ?
            <CustomVideo ref={videoref} poster={defaultimage} />
            :
            <>
            <CustomPoster><div>{username.slice(0,2)}</div></CustomPoster>
            </>
            
        }
            <audio ref={audioref}/>
    
      <VideoOption
      pos ={{bottom:`20px`,right:`53%`}}
      >
        {
            media.current.cam ?
            <IoVideocam
            size={30}
            onClick={()=>Mediacontroller("remove_video")}
            />
            :
            <IoVideocamOff
            size={30}
            onClick={()=>Mediacontroller("add_video")}
            />
        }
       
      </VideoOption>
      <VideoOption
            pos ={{bottom:`20px`,right:`35%`}}
      
      >
        {
            media.current.mic === true ?
            <IoIosMic
            size={30}
            onClick={()=>Mediacontroller("remove_audio")}
            />
            :
            <IoIosMicOff
            size={30}
            onClick={()=>Mediacontroller("add_audio")}
            />
        }
      </VideoOption>

      </Videoholder>
       
    <Join>
      <p>Ready to join ?</p>
      <div>
        {
          medialoading ? 

          <Loading/>

          :
          <>
          <CustomJoin color='#009dff' onClick={()=>{
          joincall()
          changestatus('in_video_call')
          // navigate('/videochat')
        }}>
          join now
      </CustomJoin>
      <CustomJoin color='#949494'
      onClick={()=>backtochat()}
      >
        cancel
      </CustomJoin>
        </>
      
        }
    
      </div>
    

    </Join>
    
    </WaitingRoom>
  )
}

export default Waitingroom
