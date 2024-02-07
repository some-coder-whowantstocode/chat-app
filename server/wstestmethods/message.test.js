const { message } = require('../wsmethods/message'); 
const { CUSTOM_RESPONSE } = require("../responses");

// Mock data

const data = {
    msg: 'Hello, this is a test message',
    name: 'Test User',
    Admin: false,
    roomid: '123'
};
let sentData;
const ws = {
    send:jest.fn((data) => { sentData = data })
}


const ROOM = new Map();
ROOM.set('123', { members: [{ name: 'Test User', ws: ws }], requesters: [] });

// Test suite
describe("message function", () => {
    beforeEach(() => {
        ws.send.mockClear();
    });

    test("should not censor a message without bad words", () => {
        const data = {roomid:'123',name:'null',Admin:'null',msg:'Hello, this is a test message with goodword'}
       
        message(data, ROOM);
        let sample = {...CUSTOM_RESPONSE.MESSAGE};
        sample.Admin = data.Admin;
        sample.name = data.name ;
        sample.msg = data.msg;
        expect(sentData).toEqual(sample);
    });

    test("should censor a message with bad words", () => {
        const data = {roomid:'123',name:'null',Admin:'null',msg:'Hello, this is a test message with badword fuck'}
        
        message(data, ROOM);
        let sample = {...CUSTOM_RESPONSE.MESSAGE};
        sample.Admin = data.Admin;
        sample.name = data.name ;
        sample.msg = 'Hello, this is a test message with b*****d f**k';
        expect(sentData).toEqual(sample);
    });
});
