const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // nincs token
    jwt.verify(token, ACCESS_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // érvénytelen token
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;