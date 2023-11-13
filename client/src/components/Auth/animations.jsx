import styled,{css, keyframes} from 'styled-components'


export const moveanimateY =(a,b,c,d,e)=> keyframes`
0%{
    opacity: 1;
    transform: translateY(${a});
}
50%{
    opacity: 1;
    transform: translateY(${b});

}
70%{
    opacity: 1;
    transform: translateY(${c});
}
90%{
    opacity: 1;
    transform: translateY(${d});
}
100%{
    opacity: 1;

    transform: translateY(${e});
}
`


export const rotating = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
`



export const moveanimateX =(a,b,c,d,e)=> keyframes`
    0%{
        opacity: 1;

        transform: translateX(${a});
    }
    50%{
        opacity: 1;

        transform: translateX(${b});

    }
    70%{
        opacity: 1;

        transform: translateX(${c});

    }
    90%{
        opacity: 1;

        transform: translateX(${d});

    }
    100%{
        opacity: 1;

        transform: translateX(${e});
    }
`
