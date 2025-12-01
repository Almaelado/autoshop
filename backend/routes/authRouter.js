var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();   


const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

function generateAccessToken(user) {
    // Implementation for generating access token using ACCESS_SECRET
    //Pl. user = { id:user.id, username: user.username, role: user.role }
    return jwt.sign(user, ACCESS_SECRET, { expiresIn: '15m' }); 
}

function generateRefreshToken(user) {
    // Implementation for generating refresh token using REFRESH_SECRET
    return jwt.sign(user, REFRESH_SECRET, { expiresIn: '7d' }); 
}

//auth middleware
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

//Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;    
    // Validate user credentials (this is just a placeholder, implement your own logic)
    if (username === 'admin' && password === 'admin') {
        const user = { id: 1, username: 'testuser', role: 'user' }; 
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ accessToken, refreshToken });
    } else {
        res.status(401).send('Érvénytelen belépés');
    }
});

//Védett útvonal példa
router.get('/profile', authenticateToken, (req, res) => {
    console.log('Authenticated user:', req.user);
    
    const iat = new Date(req.user.iat * 1000); // UNIX timestamp másodpercek -> milliszekundum
    const exp = new Date(req.user.exp * 1000);

    console.log("Generálás ideje:", iat.toLocaleString());
    console.log("Lejárati idő:", exp.toLocaleString());

    res.send('Ez egy védett útvonal, hozzáfértél!'+ JSON.stringify(req.user));

});

//{"id":1,"username":"testuser","role":"user","iat":1763381221,"exp":1763382121}


module.exports = router;