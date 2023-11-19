import React from 'react'
import styled from 'styled-components'
import { Logo } from './customstyles'

const Chatbox = styled.div`
    display: flex;
    flex-direction:${props =>props.me===true ? 'row-reverse' :'row'} ;
`

const Smallbox = styled.div`
  display: flex;
  ${props=>props.left && 'flex-direction: row-reverse;'}

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
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    ${props=>props.Admin === true && `
  background:linear-gradient(to right, gold, deepskyblue);
  color:navy;

  `}; 
    div{
      display:flex;

      span{

      }
    }
`

const Announcement = styled.div`
  background-color: #acaaaa;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  max-width: 100%;
`

const Nameholder = styled.div`
  display: flex;
  flex-direction:${props =>props.left===true ? 'row-reverse' :'row'} ;

  
`

const Chat = ({m,me}) => {
  return (
    <Chatbox me={me}>
    {
      m.type === 'Announcement' ?

      <Announcement>
        {m.msg}
      </Announcement>

      :

        me === true 
        ? 
        
        <Smallbox left>
          
            <Logo right  >
            {String(m.name).substring(0,2)}
            <div>
              <div></div>
              {
                m.name
              }
            </div>
            </Logo>
          
         
          <Chatblock left Admin={m.Admin}>

        {m.msg}
          </Chatblock>
      </Smallbox>
      
      :
      <Smallbox>
      <Logo >{String(m.name).substring(0,2)}
      <div>
      <div></div>

              {
                m.name
              }
            </div>
            </Logo>
      <Chatblock Admin={m.Admin}>
    {m.msg}
      </Chatblock>
  </Smallbox>
    }
   </Chatbox>
  )
}

export default Chat
