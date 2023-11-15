import styled from 'styled-components';
import {
    moveimg
} from './animations'


const min = 750;


export const Input = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition-duration: 1s;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    input{
        width: 300px;
        height: 30px;
        padding-left: 3px;
        background-color: transparent;
        border: none;
        border: 2px solid #696969;
        border-radius: 5px;
        color: white;
        &:focus{
            transition-delay: 0.1s;
            color: black;
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
            color: #696969;
            pointer-events: none;

        }
    }
   
`

export const Page = styled.div`
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
    background-color: #0077ff;
    color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    margin-right: 10px;
    text-decoration: none;
`

export const Imgcover = styled.div`
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