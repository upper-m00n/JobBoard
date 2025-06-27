const jwt = require('jsonwebtoken')

const authMiddleware = (req,res, next)=>{
    const authHeader =req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error : 'Access denied. No token provided.'})
    }

    const token= authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user =  decoded
        next()
    } catch (error) {
        res.status(401).json({error:'Invalid or expired token'})
    }
}

const requireRole = (role)=>{
    return (req,res,next)=>{
        if(req.user?.role !== role){
            return res.status(403).json({ error: `Only ${role}s are allowed to perform this action.`})
        }
        next()
    }
} 

module.exports= {authMiddleware,requireRole}