module.exports.errorHandler =(err,res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = err.statusCode||500;
    res.end(err.message);
}