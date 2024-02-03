export const Actions = {
    USER_ACTIONS:{
        JOINING_CHAT:'joining',
        CHAT:'chat',
        JOINING_VIDEO_CHAT:'waiting',
        VIDEO_CHAT:'videochat',
        IDLE:'nothing'
    },
    CALL_ACTIONS: {
        OFFER: "offer",
        ANSWER: "answer",
        NEW_JOIN: "newmem",
        NEGO_INIT: "negoinitiated",
        NEGO_DONE: 'negodone',
        ICE: 'icecandidate',
        MEDIA: 'media',
        LEFT: 'leftcall',
        LEAVE: 'leavecall',
        R_OFFER: 'reconnect_offer',
        R_ANSWER: 'reconnect_answer',
    },

    REDUCER_ACTIONS: {
        CREATE: "create",
        UPDATETRACK: "update",
        UPDATEVISIBILITY: "updatemedia",
        DELETE: "delete",
        CLEAR: "clear"
    },
    PACKUP_ACTIONS: {
        CAM: "only_camera",
        MIC: "only_microphone",
        ALL: "both"
    },
    TRANSPORT_LOCATIONS: {
        HOME:'homepage',
        LANDING_PAGE:'landingpage',
        CHAT:'chat',
        JOIN_CHAT:'join',
        WAITING_ROOM:'waiting',
        VIDEO_CHAT:'video',
        MEMBERS:'members',
        REJOIN:'rejoin'
    }
}