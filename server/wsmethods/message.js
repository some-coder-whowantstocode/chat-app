const { CUSTOM_RESPONSE } = require("../responses");
const { sendtoall } = require("./senttoall");

const badword = ['fuck', 'dick', 'ass', 'rape','badword']


const checkword = (message, ind, word, tempmsg) => {
    let j = ind;
    for (let i = 0; i < word.length; i++) {
        if (tempmsg[j] == word[i]) {
            j++;
        } else {
            return;
        }
    }
    let k = ind + 1;
    for (let i = 1; i < word.length - 1; i++) {
        message[k] = '*';
        k++;
    }
}

const findwords = (message, i, tempmsg) => {
    if (i >= tempmsg.length) {
        return;
    }
    for (let j = 0; j < badword.length; j++) {
        if (badword[j][0] == tempmsg[i]) {
            checkword(message, i, badword[j], tempmsg);
        };
    };
    findwords(message, i + 1, tempmsg);
}

module.exports.message = (data, ROOM) => {
    try {
        const { msg, roomid, name, Admin } = data;
        let message = Array.from(msg);
        let tempmsg = Array.from(msg.toLowerCase());
        findwords(message, 0, tempmsg);
        message = message.join('');
        

        const res = {...CUSTOM_RESPONSE.MESSAGE}
        res.Admin = Admin;
        res.name = name ;
        res.msg = message;
        const Room = ROOM.get(roomid)
        sendtoall(Room.members, res);
    } catch (err) {
        throw new Error(`Error while sending message - ${ err.message}`, );
    }


}