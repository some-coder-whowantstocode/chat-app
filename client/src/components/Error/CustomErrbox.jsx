import React from 'react'
import styled from 'styled-components'
import { useSocket } from '../../context/SocketProvider'


const Errbox = styled.div`
     display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
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
  color: white;
  font-size: 20px;
 
   
`


const CustomErrbox = ({id,msg}) => {

  const { errmsg, seterrmsg } = useSocket();

  return (
    <>
    {
          <Errbox 
          onClick={()=>{
            let copy = [...errmsg];
            copy = copy.filter(element =>{
              if( element.id !== id){
                return element;
              }else{
               clearInterval(element.timeoutId)
              }
              
              });
            seterrmsg(copy);
          }}
          >
          <div>
          <Content >
            {msg}
          </Content>
          </div>
        </Errbox>
    }
   
    </>
  )
}

export default CustomErrbox
