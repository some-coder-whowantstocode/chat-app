import { useEffect, useRef,useState } from 'react';
import { useVideo } from '../context/Videochatcontroller';
import defaultimage from  '../assets/default.png';
import styled from 'styled-components';
import { IoVideocam,IoVideocamOff  } from "react-icons/io5";
import { IoIosMic,IoIosMicOff } from "react-icons/io";
import { useSocket } from '../context/SocketProvider';
import Loading from '../components/Loading';
import { Mediapackup, Mediacontroller } from '../utils/mediahandler';
import { Actions } from '../utils/Actions';
import RequestBox from '../components/Chatpage/RequestBox';
// import { useNavigate } from 'react-router-dom';
import notification from "../assets/notification.wav";




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
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 100vw;
    flex-direction: column;
    background:black;
 
 
`

const Videoholder = styled.div`
 height: 50%;
    width: 60%;
    position: relative;
`

const Waitingroom = () => {

    const { goback , media , joincall  } = useVideo();
    const { myvideo,Transport, myaudio , setmyaudio ,setmyvideo , pc , socket , curr_poss, requests} =useSocket()
    const videoref = useRef(null);
    const audioref = useRef(null);
    const username = sessionStorage.getItem('name');
    const [ medialoading , setmediaload ] = useState(true);
    const [video,setvideo] = useState();
    const [audio,setaudio] = useState();

  useEffect(() => {
    if (curr_poss.activity.main_act !== Actions.TRANSPORT_LOCATIONS.CHAT ) {
      Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
    }
  }, []);
    

    // const navigate = useNavigate()

    

    const Getmedia =()=>{
      const {cam,mic} = media.current;
      const copyaudio = myaudio;
      const copyviddeo = myvideo;
      
      return new Promise((resolve,reject)=>{
        
        navigator.mediaDevices.getUserMedia({audio:mic,video:cam})
        .then((stream)=>{
          for(const track of  stream.getTracks()){
            let trac = new MediaStream([track])
            if(track.kind === 'audio'){
              setmyaudio(trac);
              setaudio(trac);

            }
            else{
              setmyvideo(trac);
              setvideo(trac);

            }
          }
          Mediapackup(Actions.PACKUP_ACTIONS.ALL,{audio:copyaudio,video:copyviddeo})

          resolve(stream);
        
        })
        .catch((err)=>{
          if(err.name === 'TypeError'){
              media.current.cam = false;
              media.current.mic = false;
              setmyaudio();
              setmyvideo();
          }else{
              reject("Error while getting media in Getmedia : " + err);

          }
        
        })
        .finally(()=>{
          setmediaload(false)
        })
       })
    }


    useEffect(()=>{
      Getmedia();
    },[])

   
    useEffect(()=>{
        if(videoref.current && video){
            const videoelement = videoref.current;
            videoelement.srcObject = video
            videoelement.autoPlay = true
            videoelement.onloadedmetadata = () => {
              videoelement.play();
              };
        }
    },[videoref,video])

    useEffect(()=>{
      if(videoref.current && audio){
        const audioelement = audioref.current;
        audioelement.srcObject = audio
        audioelement.autoPlay = true
        audioelement.onloadedmetadata = () => {
          audioelement.play();
          };
    }
    },[audioref,audio]);
   


    const backtochat =()=>{
      if(videoref.current){
        videoref.current = null;
    }
    Mediapackup(Actions.PACKUP_ACTIONS.ALL,{audio:audio,video:video})
    setmyaudio();
    setmyvideo();
    setaudio();
    setvideo()
        goback();
       

    }

  

  return (
    <WaitingRoom >
   
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
            onClick={()=>{
              Mediacontroller("remove_video",pc,socket,media,video,true) 
              .then((stream)=>{
                setmyvideo(stream);
                setvideo(stream);
              })
            }}
            />
            :
            <IoVideocamOff
            size={30}
            onClick={()=>{
              Mediacontroller("add_video",pc,socket,media,video,true) 
              .then((stream)=>{
                setmyvideo(stream);
                setvideo(stream);
              })
            }}
            />
        }
         
      {requests.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}
      </VideoOption>
      <VideoOption
            pos ={{bottom:`20px`,right:`35%`}}
      
      >
        {
            media.current.mic === true ?
            <IoIosMic
            size={30}
            onClick={()=>{
              Mediacontroller("remove_audio",pc,socket,media,audio,true) 
              .then((stream)=>{
                setmyaudio(stream);
                setaudio(stream);
              })
            }}

            />
            :
            <IoIosMicOff
            size={30}
            onClick={()=>{
              Mediacontroller("add_audio",pc,socket,media,audio,true) 
              .then((stream)=>{
                setmyaudio(stream);
                setaudio(stream);
              })
            }}

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
          Transport(Actions.TRANSPORT_LOCATIONS.VIDEO_CHAT)
        }}>
          join now
      </CustomJoin>
      <CustomJoin color='#949494'
      onClick={()=>{
        backtochat()
        Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
      }}
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
