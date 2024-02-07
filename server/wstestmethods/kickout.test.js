// const { kickout } = require('../wsmethods/index'); // replace 'yourModule' with the actual module name
// const {sendtoall } = require('../wsmethods/senttoall');
// const {
//     roomAdmin,
//     rooms_id,
//     users_in_rooms,
// } = require('./t_essentials.js')

// jest.mock('../wsmethods/senttoall', () => ({
//   sendtoall: jest.fn(),
// }));


// const mws = {
//     send:jest.fn((data) => { sentData = data })
// }
// const adws ={
//     send:jest.fn((data) => { sentData = data })
// } 

// describe('kickout function', () => {
//   beforeEach(() => {
//     ws = { send: jest.fn() };
//     data = { roomid: 'room1', name: 'user1', Admin: 'admin1' };
//     roomAdmin.set(data.roomid, adws);
//     rooms_id.set(data.roomid, [adws,mws]);
//     users_in_rooms.set(data.roomid, ['admin1', 'user1']);
//   });

//   it('should send an error if no roomid, name, or Admin', async () => {
//     data = { ...data, roomid: null };
//     await kickout(data, ws, roomAdmin, rooms_id, users_in_rooms);
//     expect(ws.send).toHaveBeenCalledWith({
//       type: 'error',
//       msg: 'some data are not valid.',
//     });
//   });

//   it('should send an error if you are not the admin.', async () => {
//     data = { ...data,  Admin:'user1'};
//     await kickout(data, ws, roomAdmin, rooms_id, users_in_rooms);
//     expect(ws.send).toHaveBeenCalledWith({
//         type:'error',
//         msg:'you are not admin.'
//     });
//   });

//   it('should kickout user if you are the admin.', async () => {
//     await kickout(data, ws, roomAdmin, rooms_id, users_in_rooms);
//     expect(mws.send).toHaveBeenCalledWith({
//         type:'Announcement',
//         kickedout:true,
//         name:data.name,
//         msg:`Admin kicked you out.`
//     });

//     expect(sendtoall).toHaveBeenCalledWith( rooms_id.get(data.roomid) ,msg ={
//         type:'Announcement',
//         left:true,
//         name:data.name,
//         msg:`${data.name} was kicked out by Admin.`
//     })

//     expect(users_in_rooms.get(data.roomid).length).toBe(1);
//     expect(rooms_id.get(data.roomid).length).toBe(1);

//   });


  
// });
