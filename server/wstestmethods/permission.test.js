const { CUSTOM_RESPONSE } = require('../responses.js');
const { permission } = require('../wsmethods/index.js'); 
const { ROOM, USER_LIMIT, clearmaps } = require('./t_essentials.js')

let sentData;

const mws = {
    send: jest.fn((data) => { sentData = data; })
}

describe('permission', () => {

    beforeEach(() => {
        clearmaps();
    });

    test('If admin declines the request.', () => {
        const data = { response: 'Dec', name: 'rohit', roomid: '123' };
        const Room = { admin: mws, members: [], requesters: [{ name: 'rohit', ws: mws }] };
        ROOM.set(data.roomid, Room);
        permission(data, ROOM, USER_LIMIT);
        expect(Room.requesters.length).toEqual(0);
        let sample ={...CUSTOM_RESPONSE.PERMISSION.REJECT.DECLINED};
        sample.name = data.name;
        sample.roomid = data.roomid;
        expect(sentData).toEqual(sample);
    });

    test('User joins room and announcement is sent', () => {
        const data = { response: 'Acc', name: 'testUser', roomid: '125', admin: 'null' };
        const Room = { admin: {name:'null',ws:mws},key:'a legendary key', members: [{name:'null',ws:mws}], requesters: [{ name: 'testUser', ws: mws }] };
        ROOM.set(data.roomid, Room);
        permission(data, ROOM, USER_LIMIT);
        expect(Room.members).toEqual([{name:'null',ws:mws},{active:true,incall:false, name: 'testUser', ws: mws }]);
        expect(Room.requesters.length).toEqual(0);
        let sample ={...CUSTOM_RESPONSE.PERMISSION.ACCEPT.JOIN};
        sample.name = data.name;
        sample.Admin = data.admin;
        sample.roomid = data.roomid;
        sample.key = expect.anything();
        sample.mems = [data.admin,data.name];
        expect(sentData).toEqual(sample);
    });

});
