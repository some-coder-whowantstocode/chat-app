import  React,{ useEffect } from 'react'
import styled from 'styled-components'
import Remotevideo from './Remotevideo'
import { useSocket } from '../../context/SocketProvider'

const Videoholder =styled.div`
  height: 100vh;
  max-width: inherit;
  overflow: hidden;
  display: flex;
  background-color: #1f1f1f;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-gap: 10px;
`


const RemoteVideos = () => {

  const {pc} = useSocket()

  return (
    <Videoholder>
     
     {
  pc.map((r, index) => 
   <Remotevideo key={index} r={r}/>
  )
}
    </Videoholder>
  )
}

export default React.memo(RemoteVideos);
