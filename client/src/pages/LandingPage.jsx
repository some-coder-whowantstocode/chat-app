import { useEffect, useRef } from "react";
import Nav from "../components/landingpage/Nav";
import image from "../assets/chatgroup.jpg";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import {
  Custombtn,
  Controls,
  Imagechat,
  Page,
  Input,
  Imgcover,
} from "../components/landingpage/customstyles";
import Reqprocessing from "../components/landingpage/Reqprocessing";
import CustomErrbox from "../components/CustomErrbox";

const LandingPage = () => {
 
  const pageref = useRef(null);
  const nameref = useRef(null);
  const roomidref = useRef(null);

  const navigate = useNavigate();

  const { wanttojoin,errmsg,handleconnection,wanttocancel , wanttocreate, creation, entry, state } = useSocket();

 
  useEffect(()=>{
    if (state == "Authfailed" || state == "ConnectionLost") {
      handleconnection()
    }
  },[state,handleconnection])

  useEffect(() => {
    if (pageref.current) {
      const children = pageref.current.children[0].children;
      const titles = [];
      const inputs = [];
      let childs = Array.from(children);
      for (let i = 0; i < 2; i++) {
        inputs.push(childs[i].children[1]);
        titles.push(childs[i].children[0].children[0]);
      }

      const handleclick = () => {
        for (let i = 0; i < inputs.length; i++) {
          if (document.activeElement === inputs[i]) {
            titles[i].style = `
                        position: absolute;
                        top: -10px;
                        font-size: 15px;
                        background-color: white;
                        color:gray;
                        `;

            inputs[i].style = `
                    color:black;
                `;
          } else {
            titles[i].style = `
                        position: absolute;
                        top: 3px;
                        left:0;
                        transition-duration: 0.5s;
                        font-size: 20px;

                        `;
            inputs[i].style = `
                        color:transparent;

                    `;
          }
        }
      };
      window.addEventListener("click", handleclick);

      return () => window.removeEventListener("click", handleclick);
    }
  }, [pageref]);

  useEffect(() => {
    if (creation === true || entry === true) {
      navigate("/chat");
    }
  }, [creation,entry,navigate]);

  useEffect(() => {
    const handler = () => {
      wanttocancel();
    };

    window.addEventListener('beforeunload', handler);

    

    return () => {
        window.removeEventListener('beforeunload', handler);
    };
}, []);

  return (
    <>
      {
        errmsg.map((em,i)=>(
          
          <CustomErrbox key={`${i}th error`} msg={em.msg}/>
        ))
      }
      <Reqprocessing />

      <Nav />
      <Page ref={pageref}>
        <div>
          <Input>
            <div>
              <p>Name</p>
            </div>
            <input autoComplete="off" ref={nameref} type="text" />
          </Input>
          <Input>
            <div>
              <p>Room Id</p>
            </div>
            <input autoComplete="off" ref={roomidref} type="text" />
          </Input>
          <Controls>
            <Custombtn
              onClick={() =>
                wanttocreate(
                  nameref.current.value,
                  roomidref.current.value
                )
              }
            >
              CREATE
            </Custombtn>
            <Custombtn
              onClick={() =>
                wanttojoin(
                    nameref.current.value, 
                    roomidref.current.value
                    )
              }
            >
              JOIN
            </Custombtn>
          </Controls>
        </div>
        <Imgcover>
          <Imagechat src={image} alt="" />
        </Imgcover>
      </Page>
    </>
  );
};

export default LandingPage;
