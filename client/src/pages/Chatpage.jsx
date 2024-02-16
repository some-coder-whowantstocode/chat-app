import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import RequestBox from "../components/Chatpage/RequestBox";
import Chat from "../components/Chatpage/Chat";
import notification from "../assets/notification.wav";
import { MdCall  } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import {
  Option,
  Chathead,
  Chatbox,
  Send,
  CustomInput,
  Chatroom,
  Room,
  Messagebox,
  Options,
  Copy
} from "../components/Chatpage/customstyles";
import Loading from "../components/Loading";
import Members from "../components/Chatpage/Members";
import { GiHamburgerMenu } from "react-icons/gi";
import { PATH } from "../utils/Paths";
import { Actions } from "../utils/Actions";
import Customerrors from "../components/Error/Customerrors";

const Chatpage = () => {
  const { 
    socket,
    Transport,
    viewport,
    DEVICE_CHART,
    connection_state,
    CONNECTION_STATES, 
    setleave, Admin,
    curr_poss,
    requests
  } = useSocket();

  const [username, setname] = useState();
  const [roomid, setroomid] = useState();
  const [msgs, setmsgs] = useState([]);
  const msg = useRef('');
  const [notificationsound] = useState(new Audio(notification));
  const { popup, copyToclip } = useSocket();
  const inputref = useRef(null);

  useEffect(() => {
    setname(sessionStorage.getItem("name"));
    setroomid(sessionStorage.getItem("room"));
    return ()=>{
    }
  }, []);

  useEffect(() => {
    const handleMessage = (jsondata) => {
      switch(jsondata.type){
        case Actions.CHAT_METHODS.MESSAGE:
          setmsgs((prevmsg) => [...prevmsg,jsondata]);
        break;

      
        case Actions.CHAT_METHODS.ANNOUNCEMENT:
          setmsgs((prevmsg) => [...prevmsg, jsondata]);
        
        
        break;

        case Actions.CHAT_METHODS.ALERT:
          if(jsondata.action_required) setleave(true);
          Transport(Actions.TRANSPORT_LOCATIONS.REJOIN)
        break;


      }
    }


    if (socket) {
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket,notificationsound,setleave]);


  useEffect(() => {
    if (curr_poss.activity.main_act !== Actions.TRANSPORT_LOCATIONS.CHAT ) {
      Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
    }
  }, []);


  const sendmsg = async () => {
    try {
      if (msg.current != "") {
        socket.send({
          create: false,
          msg: msg.current,
          Admin: Admin,
          name: sessionStorage.getItem("name"),
          roomid: sessionStorage.getItem("room"),
        });
        msg.current = '';
        inputref.current.value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (connection_state === CONNECTION_STATES.FAILED || connection_state == CONNECTION_STATES.CONNECTION_LOST) {
      Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
    }
  }, [connection_state]);

  return (

    <Room>
      <Customerrors/>
     {
      viewport === DEVICE_CHART.PC &&<Members />
     }


    <Chatroom>
     
      
      <Chathead>
        
        <div>
        {
          viewport === DEVICE_CHART.MOBILE &&<GiHamburgerMenu onClick={()=>Transport(Actions.TRANSPORT_LOCATIONS.MEMBERS)}/>
        }
        <p>{roomid}</p>
        <Copy 
        title="copy link" 
        onClick={()=>{
          copyToclip();
          popup('Link Copied');
          }}/>
        </div>
   
      <Options>
      <Option colorschema={{col:'black',bac: 'green'}}
      
      onClick={async () => {
        if(curr_poss.location === PATH.CHAT_PAGE && curr_poss.activity.sub_act !== Actions.USER_ACTIONS.VIDEO_CHAT  ){
          Transport(Actions.TRANSPORT_LOCATIONS.WAITING_ROOM)
        }
      
      }}
    >
     
        
        <MdCall/>
    </Option>
      
      <Option colorschema={{col:'#b10e0e',bac:'#b10e0e'}}
      
        onClick={async () => {
          await setleave(true);
          Transport(Actions.TRANSPORT_LOCATIONS.REJOIN)
        }}
      >
        <FaPowerOff/>
      </Option>
      </Options>
      </Chathead>
      <Loading />

      
      {requests.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}
      <Chatbox>
        {msgs.map((msg,i) => (
          <Chat key={`${i}th message`} m={msg} me={username == msg.name} />
        ))}
      </Chatbox>
      <Messagebox>
      <CustomInput
        placeholder="write here.."
        ref={inputref}
        defaultValue={msg.current}
        onChange={(e) => msg.current = e.target.value}
        onKeyUp={(e) => e.key === "Enter" && sendmsg()}
      />
      <Send onClick={() => sendmsg()} />
      </Messagebox>
    
    </Chatroom>
    </Room>
  );
};

export default Chatpage;
