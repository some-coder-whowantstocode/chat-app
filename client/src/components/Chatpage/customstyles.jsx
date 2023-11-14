import styled from 'styled-components';
import { AiOutlineSend } from "react-icons/ai";


const min = 750

export const Chatroom = styled.div`
width: 100%;
height: calc(100vh - 160px);
background-color: #ebebeb;
padding-top: 40px;
padding-bottom: 80px;

`

export const CustomInput = styled.input`
  
  height: 35px;
  position: fixed;
  bottom: 10px;
  left: 1%;
  font-size: 17px;
  box-shadow: rgba(189, 189, 189, 0.12)0px 2px 4px 0px, rgba(147, 147, 147, 0.32) 0px 2px 16px 0px;
  border: none;
  border-radius: 20px;
  padding: 7px;
  background-color: white;
  ${
    innerWidth<min 
    ?
    ` 
    width:98%;
    box-sizing: border-box;
    `
    :
    `
    width: 600px;
    `
  }

  &:focus{
    outline:none;
  }
`

export const Send = styled(AiOutlineSend)`
  position: fixed;
  bottom: 18px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
`

export const Chatbox = styled.div`
  display: flex;
  flex-direction: column;
`

export const Chathead = styled.div`
  background-color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-weight: 800;
  font-size: 20px;
  position: fixed;
  top: 0;
`

export const Leave = styled.div`
  color: #a70303;
  position: fixed;
  top: 6px;
  right: 10px;
  padding: 4px ;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  &:hover{
    color: white;
    background-color: #a70303;
  }
`

export const Requestcard = styled.div`
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

export const Nameholder = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`

export const Logo = styled.p`
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
export const Name = styled.p`
  font-weight:500;
`

export const Req = styled.div`
  color: gray;
  span{
    font-weight: bold;
    color: black;
  }
`

export const Res = styled.div`
display: flex;
width: 100%;
justify-content: space-evenly;
margin-top: 8px;
`

export const Resbtn = styled.button`
  color:${props=>props.clr};
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  &:hover{
    /* filter: grayscale(0.1); */
    background-color: #acacac;
  }

  
`