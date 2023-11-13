module.exports.bodyParser =(req)=>{
    return new Promise((resolve,reject)=>{
        let body =[];
        req
        .on('data',(chunk)=>{
            body.push(chunk);
        })
        .on('end',()=>{
            if(body != ''){
            try{
                
                    body = Buffer.concat(body).toString();
                    body = JSON.parse(body);
                    resolve(body);
              
               
            }catch(err){
                reject(err);
            }
        }else{
            resolve({})
        }
        
        })
        .on('error',(err)=>{
            reject(err);
        })
    })
}