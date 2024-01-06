const http = require('http');
const { shakeHand } = require('./Controller/TokenController.js')
const {
    bodyParser,
    defaultPage,
    errorHandler,
    applicationHeader
} = require('./middleware/index.js');
require('dotenv').config();
const socketIo = require('socket.io');

const jwt = require('jsonwebtoken')

const rooms_id = new Map(); //<id,[ws,ws.....]>
const users_in_rooms = new Map(); //<id,[name,name.....]>
const roomAdmin = new Map(); //<id,ws>
/* to handle room admins */
const requesters = new Map(); //<id,[{name,ws},{name,ws}....]>
/*to handle users requesting to join room */
// const blocklist = new Map(); //<id,[ws,ws,ws,ws]>
const connections = new Map(); //<ws,{roomid,name}>
const users_in_videocall = new Map(); //<id,[{name,ws},{name,ws}]>
/*to handle all the users for video call */

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
                    // console.log(data)

                    switch (data.type) {
                        case 'create':
                            Createroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, connections, users_in_videocall);
                            break;

                        case 'join':
                            joinroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, connections);
                            break;

                        case 'response':
                            permission(data, rooms_id, users_in_rooms, requesters, connections);
                            socket.emit('message', {
                                type: 'removereq',
                                name: data.name
                            });
                            break;

                        case 'leave':
                            leaveroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, users_in_videocall, false);
                            break;

                        case 'cancel':
                            cancelrequest(data, socket, roomAdmin, requesters, connections);
                            break;

                        case 'rejoin':
                            rejoin(data, rooms_id, users_in_rooms);
                            break;

                        case 'kickout':
                            kickout(data, socket, roomAdmin, rooms_id, users_in_rooms);

                            break;

                        case 'videocall':

                            if (data.enter) {
                                joincall(data, socket, users_in_videocall);
                            }
                            if (data.command === 'leavecall') {
                                leavecall(data, users_in_videocall);
                            } else {
                                if (data.command === 'media') {
                                    console.log(data)
                                    let list = users_in_videocall.get(data.roomid);
                                    list.map(({ name, ws }) => {
                                            if (name !== data.from) {
                                                console.log(name)
                                                ws.send(data)
                                            }

                                        })
                                        // sendtoall(, data)
                                } else {
                                    forward(data, users_in_videocall);

                                }
                            }
                            break;

                        default:
                            message(data, rooms_id);
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
            let active;

            socket.on('ping', () => {
                active = true;
                console.log(active)
            });
            let interid;

            interid = setInterval(async() => {
                console.log("check : ", active)

                if (active) {
                    active = false;

                } else {
                    if (connections.has(socket.id)) {
                        const data = connections.get(socket.id);
                        if (data.requester) {
                            cancelrequest(data, socket, roomAdmin, requesters, connections)
                        } else {
                            leaveroom(data, socket, rooms_id, users_in_rooms, roomAdmin, requesters, users_in_videocall, true)
                        }

                    }
                    setTimeout(() => {
                        clearInterval(interid)
                    }, (1));
                }

            }, 1000 * 15);

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


// some isssue with ping pong