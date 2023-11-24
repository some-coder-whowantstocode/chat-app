const sendtoall =(arr,msg)=>{
    arr.map((a)=>{
        a.send(msg)
    })
    return;
}

module.exports = {sendtoall}
