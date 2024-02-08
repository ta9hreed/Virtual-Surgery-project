const logger =(req,res,next) =>{
    //type of method
    console.log(`${req.method} ${req.protocol}://${req.get('host')} ${req.originalUrl} `);
    
    next();
}
module.exports= logger;