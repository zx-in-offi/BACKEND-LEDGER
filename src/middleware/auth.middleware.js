const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // token ko cookies se ya headers se extract kar rahe hai

    if(!token){
        return res.status(401).json({
            message: 'Unauthorized, token not found'

        })

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // token ko verify kar rahe hai

        const user = await userModel.findById(decoded.id); // token se user id ko extract kar ke database se user ko find kar rahe hai

        req.user = user; // user ko request object me attach kar rahe hai taki aage ke middleware ya controllers me use kar sake

        next(); // next middleware ya controller ko call kar rahe hai

    }catch (error) {
        return res.status(401).json({
            message: 'Unauthorized, invalid token'
        })
    }    

}

module.exports = {
    authMiddleware
}