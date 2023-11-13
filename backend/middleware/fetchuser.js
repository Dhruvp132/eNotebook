const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Harryisagoodb$oy';

//req has user already
//req, res n next takes a middleware and calls next middleware
//here async function in Routes 3 will be called in auth.js
const fetchuser = (req, res, next) => {
    //gET THE USER from the JWT token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    
}
module.exports = fetchuser;
