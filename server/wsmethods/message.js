const { sendtoall } = require("./senttoall");

const badword = ['fuck','dick','ass','rape']


const checkword =(message,ind,word,tempmsg)=>{
    let j = ind;
    for(let i=0;i<word.length;i++){
        if(tempmsg[j] == word[i]){
            j++;
        }else{
            return;
        }
    }
    let k = ind;
    for(let i=0;i<word.length;i++){
        message[k]='*';
        k++;
    }
}

const  findwords =(message,i,tempmsg)=>{
    if(i >= tempmsg.length){
        return;
    }
    for(let j=0;j<badword.length;j++){
        if(badword[j][0] == tempmsg[i]){
            checkword(message,i,badword[j],tempmsg);
        };
    };
    findwords(message,i+1,tempmsg);
}

module.exports.message =(data,rooms_id)=>{
   
      let message = Array.from(data.msg);
      let tempmsg = Array.from(data.msg.toLowerCase());
    findwords(message,0,tempmsg);
     message = message.join('');


      let msg = {
        type:'message',
        msg:message,
        name:data.name,
        Admin:data.Admin
      }
      sendtoall(Array.from(rooms_id.get(data.roomid)), msg);
    
}