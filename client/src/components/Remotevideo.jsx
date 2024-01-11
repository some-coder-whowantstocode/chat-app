import React from 'react'
import styled from 'styled-components'


const Remoteuser = styled.video`
  max-height: 100vh;
  min-height: inherit;
  width: 100%;
  border: 2px solid black;
`

const Remoteuser_poster = styled.div`
  background-color: gray;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  div{
    background-color: black;
    color: white;
    border-radius: 50%;
    padding: 10px;
  }
`
const Remotevideo = ({r}) => {
  return (
    <div>
      {
         r.cam ?
            <Remoteuser
              ref={(video)=>{
                try{
                  if (video) {
                   
                  
                    video.srcObject = r.stream
                    video.autoPlay = true
                    video.onloadedmetadata = () => {
                      video.play();
                    };
                  }
                }catch(err){
                  console.log('error while using remotevideo : ',err)
                }
              }}
            />
            :
            <Remoteuser_poster> 
            <div>
            {r.name.substr(0,2)}
            </div>
            </Remoteuser_poster>
      }
    </div>
  )
}

export default Remotevideo
