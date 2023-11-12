const jwt = require('jsonwebtoken');

// authenticateToken function
function authenticateToken(req, res, next){
    const authHeder = req.headers['authorization'];
    const token = authHeder && authHeder.split(' ')[0]
    if (token == null ) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err)return res.sendStatus(403)
        req.user = user
        next()            
    })
}
module.exports = {
    authenticateToken
}

