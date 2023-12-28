import React from 'react'
import styled from 'styled-components'



const Remoteuser = styled.video`
  height: 100px;
  width: 100px;
`

const RemoteVideos = (props) => {
  return (
    <div>
        {
        props.remoteVideo.map(({stream},index)=>(
          <>
         { console.log(stream.getTracks())}
         
         <Remoteuser key={index}
           
         ref={(video)=>{
          try{
            if (video) {
              stream.getTracks().forEach((track)=>{
                track.enabled = true;
              })
              video.srcObject = stream
              video.autoPlay = true
              video.onloadedmetadata = () => {
                video.play();
              };
           
            }
          }catch(err){
            console.log('error while using remotevideo : ',err)
          }
        }}/>
         
         {/* } */}
          
          </>
        ))
    }
    </div>
  )
}

export default React.memo(RemoteVideos)
// export default RemoteVideos

