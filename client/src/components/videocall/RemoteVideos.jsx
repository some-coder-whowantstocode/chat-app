import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useVideo } from '../../context/Videochatcontroller'
import Remotevideo from '../Remotevideo'

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
           <Remotevideo key={index} r={r}/>
           
          )
        })
      }
    </Videoholder>
  )
}

export default React.memo(RemoteVideos)
