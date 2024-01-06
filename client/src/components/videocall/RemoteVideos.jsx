import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useVideo } from '../../context/Videochatcontroller'

const Videoholder =styled.div`
  height: 100vh;
  max-width: inherit;
  overflow: hidden;
  display: flex;
  background-color: black;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-gap: 10px;
`

const Remoteuser = styled.video`
  max-height: 100vh;
  width: 100%;
  border: 2px solid black;
`

const Remoteuser_poster = styled.div`
  background-color: gray;
  max-height: 100vh;
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

const RemoteVideos = () => {

  const { remoteVideo  } = useVideo();

  useEffect(()=>{

    if(remoteVideo.length >0){

      console.log(remoteVideo[0].stream?.getTracks())
    }
  },[remoteVideo])

  return (
    <Videoholder>
      {
      remoteVideo.map((r,index)=> {
          console.log(r)
          return (
           
            r.cam ?
            <Remoteuser key={index}
              ref={(video)=>{
                try{
                  if (video) {
                   
                  
                    video.srcObject = r.stream
                    video.autoPlay = true
                    video.onloadedmetadata = () => {
                      video.play();
                    };
                  }
                }catch(err){
                  console.log('error while using remotevideo : ',err)
                }
              }}
            />
            :
            <Remoteuser_poster> 
            <div>
            {r.name.substr(0,2)}
            </div>
            </Remoteuser_poster>
          )
        })
      }
    </Videoholder>
  )
}

export default React.memo(RemoteVideos)
