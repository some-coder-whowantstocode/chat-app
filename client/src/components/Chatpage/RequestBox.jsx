import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useSocket } from '../../context/SocketProvider';
const min = 750

const Requestcard = styled.div`
height:140px ;
width: 230px;
background-color: white;
position: fixed;
top: 50%;
left: 50%;
transform: translateX(-50%) translateY(-50%);
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
padding:8px;

`

const Nameholder = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`

const Logo = styled.p`
  font-size: 20px;
  border: 2px solid gray;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right:8px;

`
const Name = styled.p`
  font-weight:500;
`

const Req = styled.div`
  color: gray;
  span{
    font-weight: bold;
    color: black;
  }
`

const Res = styled.div`
display: flex;
width: 100%;
justify-content: space-evenly;
margin-top: 8px;
`

const Resbtn = styled.button`
  color:${props=>props.clr};
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  &:hover{
    /* filter: grayscale(0.1); */
    background-color: #acacac;
  }

  
`

const RequestBox = ({data}) => {

  const {socket} = useSocket()


    const sendresponse =(res)=>{
        try{
            const resp = {
                
                name:data.name,
                roomid:data.roomid,
                response:res?'Acc' :'Dec'
            }
            socket.send(JSON.stringify(resp));
        }catch(err){
            console.log(err)
        }
    }


  return (
    <>
      {(data.name) &&
        <Requestcard>
          <Nameholder> 
            <Logo>{String(data.name).slice(0,1).toUpperCase()}</Logo>
            <Name>{data.name}</Name>
          </Nameholder>
          <Req>
           <span> {data.name} </span>requests to join would you like to Accept ?
          </Req>
          <Res>
            <Resbtn clr={'#af1818'} onClick={()=>sendresponse(false)} >NO</Resbtn>
            <Resbtn clr={'#036cef'} onClick={()=>sendresponse(true)}>YES</Resbtn>
          </Res>
          </Requestcard>
          }
    </>
  )
}

export default RequestBox
