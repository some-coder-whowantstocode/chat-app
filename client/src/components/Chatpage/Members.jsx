import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { GiHamburgerMenu } from "react-icons/gi";
import { useSocket } from '../../context/SocketProvider';
import { BsThreeDotsVertical } from "react-icons/bs";

const Alter = styled(BsThreeDotsVertical)`
  cursor: pointer;
`

const Mems = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: all;
  transition-duration: 0.5s;
  width:${props=>props.isclicked ? `29.5vw` : `70px`} ;
  overflow-y: scroll;
  ::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
 
`

const Mem = styled.div`
  margin: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  height: 50px;
  justify-content: space-between;
  ${
    props=>props.admin ?
    `
      color:gold;
    `
    :

    `
      color:white;
    `
  }
  transition-duration: 0.5s;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover{
    box-shadow: rgba(20, 20, 20, 0.2) 0px 12px 8px 0px;
    
  }
  ${props=>props.isclicked ? `
  width: 25.5vw;
  
  ` 
  : 
  `
  width:30px;
  height:30px;
  padding:5px;
  justify-content:center;
  border-radius:50%;
  `};
  
`

const MemBox = styled.div`
 max-height: 100vh;
 overflow: scroll;
 background-color: #444444;
 ::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`

const Menu = styled(GiHamburgerMenu)`
  margin-right: 10px;
 
`

const Head = styled.div`
  width: 100%;
  background-color: #444444;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  transition: all;
  transition-delay: 0.2s;
  transition-duration: 1s;
  ${props=>props.isclicked ? `justify-content: end` : `justify-content: center`} ;
  justify-content:end;
  
  
  div{
    cursor: pointer;
    
  }
`

const Members = ({mems}) => {
  const {adminname,Admin,kickout} = useSocket();
  const [mem,setmem] = useState([]);
  const [isclicked,setisclicked] = useState(true);

  useEffect(()=>{
    setmem(mems)
  },[mems])

  useEffect(()=>{
    console.log(isclicked)
  },[isclicked])


  return (
    <MemBox
    >
      <Head
        isclicked={isclicked}
      
      >
        <Menu
        size={30}
        onClick={()=>{
          setisclicked(!isclicked)
        }}
        />
      </Head>
    <Mems
    isclicked={isclicked}
    >
      {
        mem.map((me)=>(
          <>
          {
            me === adminname 
            
            ?
            <Mem 
            admin
            isclicked={isclicked}
            key={Date.now()}
            >{me}</Mem>
            :
           <>
           {
            Admin 
            
            ?
            <Mem 
            isclicked={isclicked}
            key={Date.now()}
            >{me}
            <Alter onClick={()=>{
              kickout(me);
            }}/>
            </Mem>
            :

            <Mem 
            key={Date.now()}
            isclicked={isclicked}
            >{me}</Mem>
           }
         
           </>
          
          }
          </>
         
        ))
      }
    </Mems>
    </MemBox>
  )
}

export default Members
