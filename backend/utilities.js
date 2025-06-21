const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Debug
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token); // Debug

    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification error:', err.message);
            return res.sendStatus(403); // Use 403 for invalid token (401 is for missing auth)
        }
        
        console.log('Decoded User:', user); // Debug
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
}