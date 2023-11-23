import styled from 'styled-components';
import { AiOutlineSend } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa";



const min = 750

export const Room = styled.div`
width: 100svw;
max-width: 100%;
display: flex;
overflow-x: hidden;

::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`

export const Chatroom = styled.div`
width: 69.5vw;
display: flex;
position: relative;
height: 100vh;
max-height: 100%;
/* background-color: #d1d1d1; */
flex-direction: column;
box-sizing: border-box;
flex-grow: 1;


`


export const Chatbox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
  min-height: calc(100vh - 75px);
  overflow-y: scroll;
  
::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`

export const CustomInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  height: 35px;
  bottom: 0px;
  font-size: 17px;
  box-shadow: rgba(189, 189, 189, 0.12)0px 2px 4px 0px, rgba(147, 147, 147, 0.32) 0px 2px 16px 0px;
  border: none;
  padding: 7px;
  background-color: #dbd4d4;
  ${
    innerWidth<min 
    ?
    ` 
    box-sizing: border-box;
    `
    :
    `
    `
  }

  &:focus{
    outline:none;
  }
`


export const Send = styled(AiOutlineSend)`
  position: fixed;
  ${
 innerWidth<min ?
 `
 bottom: 8px;
 `
 :
 `
  bottom:23px
 `
  }
 
  right: 25px;
  font-size: 20px;
  cursor: pointer;
`

export const Chathead = styled.div`
  box-shadow: rgb(38,57,77) 0px 3px 14px -5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  font-weight: 800;
  font-size: 20px;
  width: 100%;
  background-color: white;
  padding: 0px 10px;
  box-sizing: border-box;
`

export const Leave = styled(FaPowerOff)`
  color: #a70303;
  /* position: fixed; */
  top: 6px;
  right: 10px;
  padding: 4px ;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  z-index: 1001;
  &:hover{
    color: white;
    background-color: #a70303;
  }
`




export const Requestcard = styled.div`
height:140px ;
width: 230px;
background-color: white;
box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
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
box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  font-size: 16px;
  border: 2px solid gray;
  border-radius: 50%;
  height: 26px;
  width: 26px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background-color: gray;
  position: relative;
  /* z-index: 0; */
  transition: ease-in-out;
  transition-duration: 0.6s;
  cursor: pointer;
  div{
    opacity: 0;
    position: absolute;
    background-color: #999696;
    padding: 3px 10px;
    z-index: 100;
    ${
      props=>props.right ?
      `
      right: 27px;
    top: -5px;
    
     
    
      `
      :
      `
      left: 29px;
    top: -5px;
 
      `
    };

    div{
      height: 10px;
      width: 0px;
      background-color: #9e9999;
      transform:rotate(46deg);
      display:flex;
      ${
      props=>props.right ?
      `
      right: -3px;
    top: 4px;
    
      `
      :
      `
      left: -3px;
    top: 4px;
      `
    };

      z-index:-1;
      position:absolute;
    }
  
  }
  &:hover{
    div{
      opacity: 1;
    }

  }
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