const { cancelrequest } = require('../wsmethods/index.js'); 
const { ROOM, clearmaps } = require('./t_essentials.js')

let sentData;

const mws = {
    send: jest.fn((data) => { sentData = data; })
}

describe('cancelrequest', () => {

    beforeEach(() => {
        clearmaps();
    });

    test('when a requests wants to cancel request remove him from waiting list.', () => {
        const data = { name: 'rohit', roomid: '123' };
        const Room = { admin: {name:'null',ws:mws}, requesters: [{ name: 'rohit', ws: mws }] };
        ROOM.set(data.roomid, Room);
        cancelrequest(data, ROOM);
        expect(Room.requesters.length).toBe(0);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type: 'cancelrequest',
            name: data.name
        });
    });

    test('If room does not exist do nothing and do not throw any error.', () => {
        const data = { name: 'rohit', roomid: '123' };
        cancelrequest(data, ROOM);
    });
});
