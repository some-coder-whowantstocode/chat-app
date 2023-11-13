import React from 'react'
import styled from 'styled-components'

const Chatbox = styled.div`
    display: flex;
    flex-direction:${props =>props.me===true ? 'row-reverse' :'row'} ;
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
`

const Chat = ({m,me}) => {
  return (
    <Chatbox me={me}>
    {
        me === true 
        ? 
        <Chatblock left >
        {m}
      </Chatblock>
      
      :
        <Chatblock >
        {m}
      </Chatblock>
    }
   </Chatbox>
  )
}

export default Chat
