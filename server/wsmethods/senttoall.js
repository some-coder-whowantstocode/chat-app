module.exports.sendtoall =(arr,msg)=>{
    arr.map((a)=>{
        a.send(JSON.stringify(msg))
    })
}