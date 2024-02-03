import styled from 'styled-components';
import { useSocket } from '../context/SocketProvider';
import Reqprocessing from '../components/landingpage/Reqprocessing';
import { Actions } from '../utils/Actions';
import Customerrors from '../components/Error/Customerrors';

const Rejoinpage = styled.div`
  height: 100vh;
  width: 100vw;
  max-height: 100%;
  max-width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Custombox = styled.div`
  
`

const Btn = styled.button`
  border: none;
  text-decoration: none;
  padding: 5px 8px;
  ${props=> props.colour ? `
  background:#0087ed;
  color:white;
  ` : `
  background:white;
  color:black;
  `};
  margin:5px;
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

&:active{
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px inset;
}

`

const Styledtext = styled.p`
  margin: 10px;
`

const Confirmation = () => {

  const {wanttorejoin,errmsg,rejoinmsg,Transport} = useSocket()


  return (
    <Rejoinpage>
      <Customerrors/>
      <Reqprocessing />
      

      <Custombox>
        <Styledtext>{rejoinmsg}</Styledtext>
        <Btn colour={'blue'} onClick={()=>{
          wanttorejoin(true)
          }}>Rejoin</Btn>
        <Btn onClick={()=>{
          sessionStorage.removeItem('name');
          sessionStorage.removeItem('joinname');
          sessionStorage.removeItem('room');
          sessionStorage.removeItem('joinroom');
          sessionStorage.removeItem('roomkey');
          Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
        }} >Go back to Landing page</Btn>
      </Custombox>
    </Rejoinpage>
  )
}

export default Confirmation
