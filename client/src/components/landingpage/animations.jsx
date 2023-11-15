import styled,{keyframes} from "styled-components";

export const moveimg =(a,b)=>keyframes`
0%{
    transform: translateY(${a});
}
50%{
    transform: translateY(${b});
}
100%{
    transform: translateY(${a});
}

`