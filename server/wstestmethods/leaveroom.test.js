const { leaveroom,sendtoall} = require('../wsmethods/index.js'); 

const {
    rooms_id,
    users_in_rooms,
    roomAdmin,
    requesters,
    clearmaps
} = require('./testmaps.js')

let sentData;

const mws = {
    send:jest.fn((data) => { sentData = JSON.parse(data); })
}

describe('Test leave room operations', () => {
    
});
