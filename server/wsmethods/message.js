const { CUSTOM_RESPONSE } = require("../responses");
const { sendtoall } = require("./senttoall");

const badword = ['fuck', 'dick', 'ass', 'rape']


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
        let message = Array.from(data.msg);
        let tempmsg = Array.from(data.msg.toLowerCase());
        findwords(message, 0, tempmsg);
        message = message.join('');
        

        const msg = {...CUSTOM_RESPONSE.MESSAGE}
        msg.Admin = data.Admin;
        msg.name = data.name ;
        msg.msg = message;
        const Room = ROOM.get(data.roomid)
        sendtoall(Room.members, msg);
    } catch (err) {
        throw new Error(`Error while sending message - ${ err.message}`, );
    }


}