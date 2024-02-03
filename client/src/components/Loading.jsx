import React from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import styled from 'styled-components'
import { useSocket } from '../context/SocketProvider'
import { Loader } from './landingpage/customstyles'


const Loadingbox = styled.div`
    height: 100vh;
    max-height: 100%;
    width: 100vw;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    background:white;
    z-index:10000;
    opacity:0.5;
    
`



const Loading = () => {
    const {loading} = useSocket()
  return (
    <>
    {
        loading && 
        <Loadingbox>
      <Loader/>
    </Loadingbox>
    }
    </>
    
  )
}

export default Loading
