const { CUSTOM_RESPONSE } = require('../responses.js');
const { leaveroom } = require('../wsmethods/index.js'); 
const { ROOM, clearmaps } = require('./t_essentials.js')

let sentData;

const mws = {
    send: jest.fn((data) => { sentData = data; })
}

describe('leaveroom', () => {

    beforeEach(() => {
        clearmaps();
    });

    test('if room has one member remove him and close the room and decline if any requests are made.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { admin: mws, members: [{ name: 'rohit', ws: mws }], requesters: [{ name: 'hi', ws: mws }] };
        ROOM.set(data.roomid, Room);
        leaveroom(data, mws, ROOM);
        expect(ROOM.size).toBe(0);
        expect(sentData).toEqual(CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.SUCCESSFUL);
    });

    test('if room has more than one member and the player to be removed is not the admin remove the member', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { admin: mws, members: [{ name: 'rohit', ws: mws }, { name: 'vicky', ws: mws }], requesters: [] };
        ROOM.set(data.roomid, Room);
        leaveroom(data, mws, ROOM);
        expect(Room.members.length).toBe(1);
        expect(sentData).toEqual(CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.SUCCESSFUL);
    });

    test('if room has more than one member and is the admin remove the member and appoint a random person as admin.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { admin: { name: 'rohit', ws: mws },users:2, members: [{ name: 'rohit', ws: mws }, { name: 'vicky', ws: mws }], requesters: [] };
        ROOM.set(data.roomid, Room);
        leaveroom(data, mws, ROOM);
        expect(Room.users).toBe(1);
        expect(Room.admin).not.toEqual(mws);
        expect(sentData).toEqual(CUSTOM_RESPONSE.LEAVE_ROOM.ACCEPT.SUCCESSFUL);
    });

});
