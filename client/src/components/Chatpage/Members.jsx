import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { GiHamburgerMenu } from "react-icons/gi";
import { useSocket } from '../../context/SocketProvider';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

const min = 750;

const Alter = styled(BsThreeDotsVertical)`
  cursor: pointer;
`

const Mems = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: all;
  transition-duration: 0.5s;
 
  ${innerWidth<min ?
  `
  width:${props=>props.isclicked ? `29.5vw` : `10px`};
  `
:
`
width:${props=>props.isclicked ? `29.5vw` : `70px`};
`
}
  overflow-y: scroll;
  ::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
 
`

const Mem = styled.div`
  
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  
  justify-content: space-between;
  overflow: hidden;
  position: relative;
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
  &:hover{
    div{
      ${props=>props.isclicked !==false  && `display:block; `}
    }
  }
  div{
    display:none;
    position:absolute;
    right:2px;
    top:15px;
  }
  transition-duration: 0.5s;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover{
    box-shadow: rgba(20, 20, 20, 0.2) 0px 12px 8px 0px;
    
  }
  ${props=>props.isclicked ? `
  width: 20vw;
  
  ` 
  : 
  `
  width:30px;
  height:30px;
  padding:5px;
  justify-content:center;
  border-radius:50%;
  `};


${
  innerWidth < min
  ?
  `
    margin:5px;
    height:30px;
    font-size:13px;

  `
  :
  `
  margin: 10px;
  height: 50px;
  `
}
  
`

const MemBox = styled.div`
 max-height: 100vh;
 overflow: scroll;
 background-color: #2D2D2D;
 ::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`

const Menu = styled(GiHamburgerMenu)`
  margin-right: 10px;
  cursor: pointer;
  transition: all;
  transition-duration: 0.6s;
 
`

const ActiveMenu = styled(RxCross2)`
  margin-right: 10px;
  cursor: pointer;
  transition: all;
  transition-duration: 0.6s;
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
  const [isclicked,setisclicked] = useState(false);

  useEffect(()=>{
    setmem(mems)
  },[mems])


  return (
    <MemBox
    >
      <Head
        isclicked={isclicked}
      
      >
        {
          isclicked === false ?
          <Menu
          size={30}
          onClick={()=>{
            setisclicked(!isclicked)
          }}
          />
          :
          <ActiveMenu
          size={30}
          onClick={()=>{
            setisclicked(!isclicked)
          }}
          />

        }
       
      </Head>
    <Mems
    isclicked={isclicked}
    >
      {
        mem.map((me,i)=>(
          <React.Fragment
          key={`${i}th mem`}
          
          >
          {
            me === adminname 
            
            ?
            <Mem 
            admin
            isclicked={isclicked}
            >{ isclicked ? me : String(me).slice(0,2) }</Mem>
            :
           <>
           {
            Admin 
            
            ?
            <Mem 
            isclicked={isclicked}
            >{ isclicked ? me : String(me).slice(0,2) }
           <div> <Alter onClick={()=>{
              kickout(me);
            }}/></div>
            </Mem>
            :

            <Mem 
            isclicked={isclicked}
            >{ isclicked ? me : String(me).slice(0,2) }</Mem>
           }
         
           </>
          
          }
          </React.Fragment>
         
        ))
      }
    </Mems>
    </MemBox>
  )
}

export default Members
