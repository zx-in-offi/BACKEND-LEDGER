const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const tokenBlacklistModel = require('../models/blacklist.model');

async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // token ko cookies se ya headers se extract kar rahe hai

    if(!token){
        return res.status(401).json({
            message: 'Unauthorized, token is missing'

        })
    }


    const isBlacklisted = await tokenBlacklistModel.findOne({ token })
 
    if(isBlacklisted)
    {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // token ko verify kar rahe hai

        const user = await userModel.findById(decoded.id); // token se user id ko extract kar ke database se user ko find kar rahe hai

        req.user = user; // user ko request object me attach kar rahe hai taki aage ke middleware ya controllers me use kar sake

        return next(); // next middleware ya controller ko call kar rahe hai

    }catch (error) {
        return res.status(401).json({
            message: 'Unauthorized, invalid token'
        })
    }   

}

async function authMiddlewareSystemUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1] ; // token ko cookies se ya headers se extract kar rahe hai

    if(!token){
        return res.status(401).json({
            message: 'Unauthorized, token is missing'
        })
    }


    const isBlacklisted = tokenBlacklistModel.findOne({ token });

    if(isBlacklisted)
    {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET); // token ko verify kar rahe hai

        const user = await userModel.findById(decoded.id).select("+systemUser"); // system user flag ko select kar rahe hai

        if(!user){
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        if(!user.systemUser){
            return res.status(403).json({
                message: 'Forbidden, user is not a system user'
            })
        }
        req.user = user; // user ko request object me attach kar rahe hai taki aage ke middleware ya controllers me use kar sake

        return next(); // next middleware ya controller ko call kar rahe hai // what happens if we write next() without return ? if we write next() without return then it will call the next middleware or controller but it will also continue to execute the code after next() which can lead to unexpected behavior, so it's better to use return next() to ensure that the function exits after calling the next middleware or controller.

    }
    catch (error) {
        return res.status(401).json({
            message: 'Unauthorized, invalid token'
        })
    }
}

module.exports = {
    authMiddleware,
    authMiddlewareSystemUser
}