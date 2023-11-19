import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { MdOutlineErrorOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useSocket } from '../context/SocketProvider';

const comein = keyframes`
  0%{
    transform: translateX(1);
  }
  100%{
    transform: translateX(0);
  }
`

const Errbox = styled.div`
     display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 80px;
    background-color: #000000;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 10px 0 10px 10px;
    z-index: 10001;
    flex-direction: column;
    div{
      display: flex;
      align-items: center;
      justify-content: center;
    }
`



const Content = styled.div`
   position: relative;
  color: orange;
  font-size: 20px;
 
   
`

const Stop = styled(RxCross2)`
    color: black;
    top: 10px;
    right: 10px;
    position: absolute;
    transform: scale(1.4);
    cursor: pointer;
`

const Timer = styled.div`
  background-color: gray;
  height: 5px;
  width: 100%;


  div {
    width: 100%;
    height: 100%;
    background-color: #ffbf00;
    transform-origin: right;
    box-sizing: border-box;
  }
`;


const CustomErrbox = ({msg}) => {
  const timerRef = useRef(null);
  useEffect(() => {
    // timerRef.current.style.backgroundColor = 'red';
    timerRef.current.animate(
      [
        // keyframes
        { transform: `scaleX(1)` },
        { transform: `scaleX(0)` }
      ], 
      {
        // timing options
        duration: 3000,
        iterations: 1,
        fill: 'forwards'
      }
    );
  }, []);

  return (
    <>
    {
          <Errbox>
          {/* <Stop onClick={()=>updateerr()}/> */}
          <div>
          {/* <Logo/> */}
          <Content >
            {msg}
          </Content>
          </div>
         
          <Timer>
            <div
             ref={timerRef}
             ></div>
          </Timer>
        </Errbox>
      
    }
   
    </>
  )
}

export default CustomErrbox
