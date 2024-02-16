import {
    rotating,
    moveanimateX,
    moveanimateY
} from './animations'
import { AiOutlineLoading } from "react-icons/ai";
import styled,{css, keyframes} from 'styled-components'
import back from '../../assets/back.jpg'



export const Loading =styled.div`
    max-width: 100%;
    width: 100vw;
    max-height: 100%;
    height: 100vh;
    background-color: #00000066;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    font-size: 20px;
`


export const Loader = styled(AiOutlineLoading)`

animation: ${rotating} infinite 1s linear;
color: black;

`


export const Passed =styled.div`
      max-width: 100%;
    width: 100vw;
    max-height: 100%;
    height: 100vh;
 position: absolute;
 top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`


export const Text = styled.div`
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    h1{
    color: #fdfefe99;
        font-size: 70px;
        animation:${
            
            props=> props.adir 
            ?
            css`
            ${moveanimateY('-100px','30px','-20px','10px',"0")} ${props=>props.time} linear forwards
            `
            :
            css`
            ${moveanimateY('0px','-240px','-180px','-220px','-200px')} ${props=>props.time} linear forwards 
            `
            
        } ;
    }
    p{
        opacity: 0;
        color: rgb(235, 235, 235); 
        animation:${
            
            props=> props.adir 
            ?
            css`
            ${moveanimateX('-100px','30px','-20px','10px','0')} ${props=>props.time} linear forwards 0.2s
            `
            :
            css`
            ${moveanimateX('0','-130px','-90px','-110px',"-100px")} ${props=>props.time} linear forwards 
            `
            
        } ;
    }
    button{
        opacity: 0;

        border: none;
        color: white;
        font-size: 24px;
        padding: 5px 8px;
        border-radius:10px;
        background-color: #00c8ff;
        margin-top: 5px;
        cursor: pointer;
        animation:${
            
            props=> props.adir 
            ?
            css`
           ${moveanimateY('100px','20px','-20px','10px','0')} ${props=>props.time} linear forwards 0.2s
            `
            :
            css`
            ${moveanimateY('0','130px','90px','110px','100px')} ${props=>props.time} linear forwards 
            `
            
        } ;
    }
`




export const Backimg = styled.div`
      max-width: 100%;
    width: 100vw;
    max-height: 100%;
    height: 100vh;
    z-index: 99;
    /* filter: contrast(1); */
    /* background: linear-gradient(270deg, rgba(221,147,239,1) 0%, rgba(222,194,235,1) 29%, rgba(193,133,232,1) 57%, rgba(221,166,231,1) 100%); */
    background:linear-gradient(to right, rgb(150, 123, 182), rgb(123, 145, 182));
    position: absolute;
    top: 0;
    left: 0;
`

export const Failed = styled.div`
height: 100vh;
width: 100vw;
max-height: 100%;
max-width: 100%;
background: url(${back});
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;

h1{
    font-size: 150px;
    color: #ffffff;
    text-shadow: 2px 2px red;
}
p{
    font-size: 30px;
    color: white;

}
button{
    font-size: 19px;
    padding: 6px 10px;
    border-radius: 10px;
    background: linear-gradient(to right, rgb(80, 60, 120), rgb(60, 80, 120)); /* Dark Purple to Dark Blue */
    border: none;
    color: #ffffff;
    margin-top: 10px;
    box-shadow: rgba(255, 255, 255, 0.16) 0px 3px 6px, rgba(255, 255, 255, 0.23) 0px 3px 6px;
    transition-duration: 0.2s;
    cursor: pointer;
    &:hover{
        box-shadow: rgba(255, 255, 255, 0.19) 0px 10px 20px, rgba(255, 255, 255, 0.23) 0px 6px 6px;

    }
    &:active{
        box-shadow: rgba(255, 255, 255, 0.19) 0px 10px 20px, rgba(255, 255, 255, 0.23) 0px 6px 6px inset;

    }
    
}
    
`