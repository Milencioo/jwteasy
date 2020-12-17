const jwt = require('jsonwebtoken')


module.exports = function(req, res, next){
    const token = req.header('login-token')
    const secret = "asdaddsdaad"
    if(!token) return res.status(401).send("cant access to the server")
    
    try{
        const verified = jwt.verify(token, secret)
        req.user = verified;
        next();

    }catch(err){
        res.status(400).send("Wrong token")
    }
}
    