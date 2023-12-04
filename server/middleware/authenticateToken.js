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

const verifyRole = (requiredRole) => (req, res, next) => {
    const token = req.headers.authorization;
  
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        // console.log(req.user.user.userRole);
        // Check user role
        if (req.user.user.userRole === requiredRole) {
          // User has the required role, allow access
          next();
        } else {
          // User does not have the required role, deny access
          return res
            .status(403)
            .json({ success: false, message: "Permission denied" });
        }
      } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
  };
module.exports = {
    authenticateToken,
    verifyRole,
}

