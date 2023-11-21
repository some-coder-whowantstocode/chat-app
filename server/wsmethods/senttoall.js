const sendtoall =(arr,msg)=>{
    arr.map((a)=>{
        a.send(msg)
    })
}

module.exports = {sendtoall}
