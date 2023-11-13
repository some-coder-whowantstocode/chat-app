import {
    rotating,
    moveanimateX,
    moveanimateY
} from './animations'
import { AiOutlineLoading } from "react-icons/ai";
import styled,{css, keyframes} from 'styled-components'


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
height: 50px ;
width: 50px;
animation: ${rotating} infinite 1s;
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
        opacity: 0;
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

        animation:${
            
            props=> props.adir 
            ?
            css`
            ${moveanimateX('-100px','30px','-20px','10px','0')} ${props=>props.time} linear forwards
            `
            :
            css`
            ${moveanimateX('0px','-130px','-80px','-110px',"-100px")} ${props=>props.time} linear forwards 
            `
            
        } ;
        animation-delay: 0.2s;
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
           ${moveanimateY('100px','20px','-20px','10px','0px')} ${props=>props.time} linear forwards 
            `
            :
            css`
            ${moveanimateY('0px','130px','90px','110px','100px')} ${props=>props.time} linear forwards 
            `
            
        } ;
        animation-delay: 0.2s;
    }
`


export const Backimg = styled.img`
      max-width: 100%;
    width: 100vw;
    max-height: 100%;
    height: 100vh;
    z-index: 99;
    filter: contrast(1);
    position: absolute;
    top: 0;
    left: 0;
`