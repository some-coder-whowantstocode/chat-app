const { CUSTOM_RESPONSE } = require('../responses.js');
const { joinroom } = require('../wsmethods/index.js');
const { ROOM, USER_LIMIT, clearmaps } = require('./t_essentials.js')

let sentData;

const mws = {
    send: jest.fn((data) => { sentData = data; })
}

describe('joinroom', () => {

    beforeEach(() => {
        clearmaps();
    });

    test('If room does not exist send error.', () => {
        const data = { name: 'rohit', roomid: '123' };
        joinroom(data, mws, ROOM, USER_LIMIT);
        expect(ROOM.size).toEqual(0);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.NOT_EXISTS);
    });

    test('If room exists but is full, send error.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { users: USER_LIMIT, members: [], requesters: [] };
        ROOM.set(data.roomid, Room);
        joinroom(data, mws, ROOM, USER_LIMIT);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.FULL);
    });

    test('If room exists but a member with same name exists send error.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { users: 0, members: [{ name: 'rohit' }], requesters: [], admin: {name:'null',ws:mws} };
        ROOM.set(data.roomid, Room);
        joinroom(data, mws, ROOM, USER_LIMIT);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.EXISTING_NAME);
    });
    
    test('If room exists but a requester with same name exists send error.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { users: 0, members: [], requesters: [{ name: 'rohit' }], admin: {name:'null',ws:mws} };
        ROOM.set(data.roomid, Room);
        joinroom(data, mws, ROOM, USER_LIMIT);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual(CUSTOM_RESPONSE.JOIN_ROOM.REJECT.EXISTING_NAME);
    });
    
    test('If room exists and no requester or member with same name exists send request to admin.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { users: 0, members: [], requesters: [], admin: {name:'null',ws:mws} };
        ROOM.set(data.roomid, Room);
        joinroom(data, mws, ROOM, USER_LIMIT);
        expect(mws.send).toHaveBeenCalled();
        let sample = {...CUSTOM_RESPONSE.JOIN_ROOM.ACCEPT.ASK_TO_ADMIN}
        sample.name = data.name;
        sample.roomid = data.roomid;
        expect(sentData).toEqual(
            sample
        );
    });
    

});
