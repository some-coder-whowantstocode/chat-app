const { Createroom } = require("./createroom");
const { joinroom } = require("./joinroom");
const { permission } = require("./permission");
const { sendtoall } = require("./senttoall");
const {leaveroom} = require('./leaveroom')

module.exports ={
    Createroom,
    joinroom,
    permission,
    sendtoall,
    leaveroom
}