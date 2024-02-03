const sendtoall =(arr,msg)=>{
    try{
        arr.map((a)=>{
            a.ws.send(msg)
        })
        return;
    }
   catch(err){
    console.log("Error while sending to all ",err)
   }
}

module.exports = {sendtoall}
