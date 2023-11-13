module.exports.defaultPage =(res)=>{
    res.setHeader('content-type','application/json')
    res.statusCode = 404;
    res.end('Page not found.')
}