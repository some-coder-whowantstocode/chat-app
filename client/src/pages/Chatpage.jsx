import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import RequestBox from "../components/Chatpage/RequestBox";
import Chat from "../components/Chatpage/Chat";
import notification from "../assets/notification.wav";
import {
  Leave,
  Chathead,
  Chatbox,
  Send,
  CustomInput,
  Chatroom,
  Room
} from "../components/Chatpage/customstyles";
import Loading from "../components/Loading";
import { json, useNavigate } from "react-router-dom";
import Members from "../components/Chatpage/Members";

const Chatpage = () => {
  const { socket, state, wanttoleave, Admin, reconnect, creation, entry , members } =
    useSocket();

  const [username, setname] = useState();
  const [roomid, setroomid] = useState();
  const [msgs, setmsgs] = useState([]);
  const [msg, setmsg] = useState();
  const [reqdata, setreqdata] = useState([]);
  const [notificationsound] = useState(new Audio(notification));
  const [mem, setmem] = useState([]);

  const key = useRef(0);

  const inputref = useRef(null);

  useEffect(() => {
    setname(sessionStorage.getItem("name"));
    setroomid(sessionStorage.getItem("room"));
    setmem(members);
  }, []);



  useEffect(() => {
    const handleMessage = (jsondata) => {
      if (jsondata.type == `message`) {
        let msg = { ...jsondata };
        msg.key = key.current;
        key.current += 1;
        setmsgs((prevmsg) => [...prevmsg, jsondata]);
      } else if (jsondata.type == "request") {
        notificationsound.play();
        setreqdata((prevreqdata) => [jsondata, ...prevreqdata]);
      } else if (jsondata.type == "removereq") {
        setreqdata((prevreqdata) => {
          let arr = prevreqdata.filter((r) => r.name != jsondata.name);
          return arr;
        });
      } else if (jsondata.type == "cancelrequest") {
        setreqdata((prevreqdata) => {
          let arr = prevreqdata.filter((r) => r.name != jsondata.name);
          return arr;
        });
      } else if (jsondata.type == "Announcement") {
        if(jsondata.joined){
          console.log(jsondata.name)
          setmem(prevdata=>[...prevdata,jsondata.name]);
        }
        if(jsondata.left){
          console.log(jsondata.name)

          setmem(prevdata=> prevdata.filter((d)=>d !== jsondata.name));
          
        }
        setmsgs((prevmsg) => [...prevmsg, jsondata]);
      }else if(jsondata.type = 'Alert'){
        if(jsondata.action_required) wanttoleave(true);
        navigate("/rejoin");
      }
    };

    if (socket) {
      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket]);

  useEffect(()=>{
    console.log(mem)
  },[mem])

  const navigate = useNavigate();

  useEffect(() => {
    if (creation !== true && entry !== true) {
      navigate("/landingpage");
    }
  }, [creation, entry]);

  useEffect(() => {
    const handler = async () => {
      await wanttoleave(false);
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, []);

  const sendmsg = async () => {
    try {
      if (msg != "") {
        socket.send({
          create: false,
          msg: msg,
          Admin: Admin,
          name: sessionStorage.getItem("name"),
          roomid: sessionStorage.getItem("room"),
        });
        setmsg("");
        inputref.current.value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (state == "Authfailed" || state == "ConnectionLost") {
      reconnect();
    }
  }, [state]);

  return (
    <Room>
     <Members mems={mem}/>
    <Chatroom>
     
      
      <Chathead>{roomid}
      
      <Leave
        onClick={async () => {
          await wanttoleave(true);
          navigate("/rejoin");
        }}
      />
      
      </Chathead>
      <Loading />

      
      {reqdata.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}
      <Chatbox>
        {msgs.map((msg) => (
          <Chat key={msg.key} m={msg} me={username == msg.name} />
        ))}
      </Chatbox>
      <CustomInput
        placeholder="write here.."
        ref={inputref}
        defaultValue={msg}
        onChange={(e) => setmsg(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendmsg()}
      />
      <Send onClick={() => sendmsg()} />
    </Chatroom>

    </Room>
  );
};

export default Chatpage;
