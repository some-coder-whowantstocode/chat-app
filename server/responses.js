module.exports.CUSTOM_RESPONSE = {
    CREATE_ROOM:{
        ACCEPT:{
                type: 'create',
                response: true,
                name: null,
                roomid: null,
                key:null
        },
        REJECT:{
            ROOM_EXISTS:{ 
                type: `error`,
                msg: `Room already exists.`
            },
            INVALID_CREDINTIALS:{
                type: `error`,
                msg: `please provide valid roomid and name.`

            }
        }
    },
    JOIN_ROOM:{
        ACCEPT:{
            ASK_TO_ADMIN:{
                type: 'request',
                name: null,
                roomid: null
            }
        },
        REJECT:{
            NOT_EXISTS:{
                type: `error`,
                msg: `Room does not exists.`
            },
            FULL:{
                type: `error`,
                msg: `Room is full.`
            },
            ANOTHER_ROOM:{
                type: `error`,
                msg: `Old room does not exist.`
            },
            EXISTING_NAME:{
                type: 'error',
                msg: `Name already taken.`
            }
        }
    },
    LEAVE_ROOM:{
        ACCEPT:{
            SUCCESSFUL:{
                type: 'Announcement',
                left: true,
                msg: `You left the room.`
            },
            ANNOUNCEMENT:{
                type: 'Announcement',
                leftroom: true,
                name: null,
                msg: null
            },
            DECLINE_ALL_REQUESTS:{
                type: 'response',
                permission: 'Dec',
                roomid: null,
                name: null
            },
            NEW_ADMIN:{
                type: 'Announcement',
                change: true,
                newAdmin: null,
                msg: null
            }
        }
    },
    PERMISSION:{
        ACCEPT:{
            JOIN:{
                type: 'response',
                permission: 'Acc',
                roomid: null,
                name: null,
                Admin: null,
                mems: null,
                key:null
            },
            ANNOUNCEMENT:{
                type:'Announcement',
                joined:true,
                name:null,
                msg:null,
            }
        },
        REJECT:{
            FULL:{
                type: `error`,
                msg: `Room is full.`
            },
            DECLINED:{
                type: 'response',
                permission: 'Dec',
                roomid: null,
                name: null
            }
        }
    },
    MESSAGE:{
        type: 'message',
        msg: null,
        name: null,
        Admin: null
    },
    REJECT:{    
    }
}

