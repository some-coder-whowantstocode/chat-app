import React from 'react'
import styled from 'styled-components'
import { Logo } from './customstyles'

const Chatbox = styled.div`
    display: flex;
    flex-direction:${props =>props.me===true ? 'row-reverse' :'row'} ;
`

const Smallbox = styled.div`
  display: flex;
  flex-direction: column;
`

const Chatblock = styled.span`
    background-color:${props =>props.left ?  `#00aeff`:'#06f187'} ;
    padding: 4px 8px;
    margin: 4px;
    border-radius:${props =>props.left ? `9px 0px 9px 9px` : `0px 9px 9px 9px`} ;
    max-width: 50vw;
    color: white;
    width: fit-content;
    text-overflow: clip;
    word-break: break-all;
    div{
      display:flex;

      span{

      }
    }
`
const Nameholder = styled.div`
  display: flex;
  flex-direction:${props =>props.left===true ? 'row-reverse' :'row'} ;
  
  
`

const Chat = ({m,me}) => {
  console.log(m,me)
  return (
    <Chatbox me={me}>
    {
        me === true 
        ? 
        
        <Smallbox>
          <Nameholder left>
          {m.name}
          </Nameholder>
          <Chatblock left>

        {m.msg}
          </Chatblock>
      </Smallbox>
      
      :
      <Smallbox>
      <Nameholder>{m.name}</Nameholder>
      <Chatblock>
    {m.msg}
      </Chatblock>
  </Smallbox>
    }
   </Chatbox>
  )
}

export default Chat
