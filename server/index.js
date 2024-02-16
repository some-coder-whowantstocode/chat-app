const http = require('http');
const { shakeHand } = require('./Controller/TokenController.js')
const {
    defaultPage,
    errorHandler,
} = require('./middleware/index.js');
require('dotenv').config();
const socketIo = require('socket.io');

const jwt = require('jsonwebtoken')

const USER_LIMIT = 4;

const ROOM = new Map();
/*
Room=
Room_id:[
-Room_key,
-USERS:number(must be less than limit)
-Members:[
    -member:{
        name,
        incall:bool,
        active,
        ws
    }
],
-Admin:{
    name,
    ws
},
call:[
    {
        name,
        ws
    }
]

-Requestors:[
    {
        name,
        ws
    }
]
]
*/

// const rooms_id = new Map(); //<id,[ws,ws.....]>
// const users_in_rooms = new Map(); //<id,[name,name.....]>
// const roomAdmin = new Map(); //<id,ws>


/* to handle room admins */

// const requesters = new Map(); //<id,[{name,ws},{name,ws}....]>


/*to handle users requesting to join room */
// const blocklist = new Map(); //<id,[ws,ws,ws,ws]>

// const connections = new Map(); //<ws.id,{roomid,name,key,active,ws}>
// const users_in_videocall = new Map(); //<id,[{name,ws},{name,ws}]>


/*to handle all the users for video call */

// const room_key = new Map(); //<id,key>

const {
    sendtoall,
    Createroom,
    joinroom,
    permission,
    leaveroom,
    message,
    kickout,
    joincall,
    forward,
    leavecall
} = require('./wsmethods/index.js');
const { Admin, cancelrequest } = require('./wsmethods/cancelrequest.js');
const chatLogger = require('./Logger/index.js');
const { CUSTOM_RESPONSE } = require('./responses.js');


const Logger = chatLogger();

const PORT = process.env.PORT || 9310


const server = http.createServer(async(req, res) => {

    try {
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT);
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // preflight is only send with custom headers like application/json

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const { method } = req;

        if (method == 'GET') {
            switch (req.url) {

                case '/handshake':
                    shakeHand(req, res);
                    break;

                default:
                    defaultPage(res)
            }
        } else {
            defaultPage(res);
        }

    } catch (error) {
        Logger.log({
            level: 'error',
            label: 'handshake',
            message: error
        })
        errorHandler(error, res)
    }
});

const io = socketIo(server);
try {

    io.on('connection', async(socket) => {


        const jwtToken = socket.handshake.query.token;
        try {
            jwt.verify(jwtToken, process.env.JWT_SECRET)
            socket.emit('message', {
                type: 'Authentication',
                status: 'passed'
            });
        } catch (err) {


            await socket.emit('message', {
                type: 'Authentication',
                status: 'failed'
            });
            socket.disconnect();

            Logger.log({
                level: 'error',
                label: 'Authentication',
                message: err
            })
        }

        try {

            socket.on('message', async(data) => {
                active = true;

                try {
                    switch (data.type) {
                        case 'create':

                            Createroom(data, socket, ROOM);

                            break;

                        case 'join':
                            joinroom(data, socket,ROOM, USER_LIMIT);
                            break;

                        case 'response':
                            permission(data,ROOM,USER_LIMIT);
                            socket.emit('message', {
                                type: 'removereq',
                                name: data.name
                            });
                            break;

                        case 'leave':
                            leaveroom(data, socket,ROOM);
                            break;

                        case 'cancel':
                            cancelrequest(data, ROOM);
                            break;

                        case 'kickout':
                            kickout(data, socket, ROOM);

                            break;

                        case 'videocall':

                            if (data.enter) {
                                joincall(data, socket, ROOM);
                            }
                            if (data.command === 'leavecall') {
                                leavecall(data, ROOM);
                            } else {
                                if (data.command === 'media') {
                                    let list = ROOM.get(data.roomid).call;
                                    list && list.map(({ name, ws }) => {
                                            if (name !== data.from) {
                                                ws.send(data)
                                            }

                                        })
                                        // sendtoall(, data)
                                } else {
                                    forward(data, ROOM);

                                }
                            }
                            break;

                        default:
                            message(data, ROOM);
                            break;

                    }
                } catch (err) {
                    console.log(err)
                    Logger.log({
                        level: 'error',
                        label: 'socket',
                        message: err.stack.split('\n')
                    })
                }
            });




            socket.on('disconnecting', (err) => {
                socket.send({
                    type: 'Alert',
                    action_required: true,
                    msg: `server disconnected`
                })
            })
            socket.on('error', (err) => {
                Logger.log({
                    level: 'error',
                    label: 'socket',
                    message: err
                })
            })

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            socket.on('ping', ({ key, roomid, name }) => {
                if (roomid && key) {
                    const Room = ROOM.get(roomid);
                    let remove = false;
                    if(Room){

                        if (Room.key === key) {
                            Room.members = Room.members.map((m)=> {
                                if(m.name === name) m.active = true;
                                return m;
                            })
                            ROOM.set(roomid,Room);
                        }
                        else{
                            remove = true;
                            

                        }
                    }else{
                        remove = true;
                    }
                  if(remove){
                    let msg = {...CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.SUCCESSFUL};
                    msg.key = key;
                    msg.name = name;
                    msg.roomid = roomid;
                    socket.send(msg)
                  }
                }


            });
         

        } catch (err) {
            const stackLines = err.stack.split('\n');
            const firstLine = stackLines[1];
            const match = firstLine.match(/\((.*):(\d+):(\d+)\)/);
            if (match) {
                const filename = match[1];
                const lineNumber = match[2];
                console.log(`Error occurred in file ${filename} at line ${lineNumber}`);
            }
            Logger.log({
                level: 'error',
                label: 'socket',
                message: err
            })

        }



    })

} catch (err) {
    Logger.log({
        level: 'error',
        label: 'io',
        message: err
    })
}

server.listen(PORT, () => console.log(`server is listening at ${PORT}`))


//check for active or not active connections 
const inspector = () => {
    try{
        interval = setInterval(() => {
        
            ROOM.forEach((values, key) => {
               let Room = values;
               Room.members?.forEach((m)=>{
                    if(m.active === true){
                        m.active = false;
                    ROOM.set(key,Room)
                    }else{
                        const {ws} = m;
                        const data ={name:m.name,roomid:key,key:values.key}
                        leaveroom(data,ws,ROOM);
                    }
                })
             
            })
    
             
        }, [1000 * 60]);
    }catch(err){
        console.log(err);
    }
  
}
inspector()



// some isssue with ping pong