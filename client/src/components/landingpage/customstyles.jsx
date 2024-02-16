import styled from 'styled-components';
import {
    moveimg
} from './animations'
import { rotating } from '../Auth/animations';
import { AiOutlineLoading } from "react-icons/ai";


const min = 750;


export const Input = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition-duration: 1s;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    position:relative;
    


    input{
        width: 300px;
        height: 30px;
        color: #535353 !important;
        padding-left: 3px;
        background-color: transparent;
        border: 2px solid #ffffff;
        border-radius: 5px;
        &:focus{
            transition-delay: 0.1s;
            outline: none;
        }
    }

    div{
        width: 300px;
        position: relative;
        p{
            position: absolute;
            top: 3px;
            left:0;
            transition-duration: 0.3s;
            font-size: 20px;
            color: white;
            pointer-events: none;

        }
    }
   
`

export const Page = styled.div`
background: linear-gradient(to right, rgb(200, 190, 210), rgb(190, 200, 210)); 
    ${innerWidth > min 
    ?
    `
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content:space-evenly;
    height:100vh;
    `
    :

    `
    width: 100vw;
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content:center ;
    height:100dvh;
     
    `
    
    } 
`

export const Imagechat = styled.img`
${innerWidth>min
    ?
    `
    height: 400px;
    width: 400px;
    `
    :
    `
    width: 80vw;
    `

}

animation: ${moveimg('10px','0px')} 3s linear infinite;
    
`

export const Controls = styled.div`
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const Custombtn = styled.div`
    padding: 2px 8px;
    font-size: 17px;
    cursor: pointer;
    border: none;
    background-color: rgb(0, 112, 217);
    background-color:${props=>props.color} ;
    ${props=>props.color ?
    `
    color: white;
      
    `
  :
  `
    
  `
  
  }
    color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    margin-right: 10px;
    text-decoration: none;
`

export const Imgcover = styled.div`
background: linear-gradient(to right, rgb(200, 190, 210), rgb(190, 200, 210)); 
    ${innerWidth>min
    ?
    `
    height: 500px;
    width: 500px;
    `
    :
    `
    width: 80vw;
    `

}
`


export const Probox = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    max-width: 100%;
    height: 100vh;
    max-height: 100%;
    z-index: 10000;
    background-color: #0000007a;
`

export const Contentbox = styled.div`
    width: 300px;
    height: 200px;
    background-color: #303030;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
`

export const Btn = styled.button`
    background-color: #80808021;
    border: none;
    transition-duration: 0.2s;
    margin: 10px 0;
    padding: 8px 10px;
    color: white;
    cursor: pointer;
    &:hover{
        background-color: #c20000;
    }
    &:active{
        background-color: #670101;
    }
`

export const Loader = styled(AiOutlineLoading)`
    animation: ${rotating} infinite 0.5s linear;
    height: 30px;
    width: 30px;
    color: #000000;
    z-index:10001;
`
