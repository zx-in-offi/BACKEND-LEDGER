const userModel = require('../models/user.model'); // User model ko import kar rahe hai

const jwt = require('jsonwebtoken'); // jsonwebtoken library ko import kar rahe hai token generation ke liye

/**
 * user register controller
 * POST /api/auth/register
 * @param {*} req 
 * @param {*} res 
 */

async function userRegisterController(req, res) { // userRegisterController function ko define kar rahe hai
    const { name, email, password } = req.body; // request body se name, email aur password ko destructure kar rahe hai 

    const isExist = await userModel.findOne({ email }); // database me email ke basis par user ko find kar rahe hai

    if(isExist) { // agar user exist karta hai to error response bhej rahe hai
        return res.status(400).json({ // 400 status code ke saath error message bhej rahe hai
            message: "User already exists", // error message
            status: "failed" // status field me "failed" set kar rahe hai   
        })
    }

    const user = await userModel.create({ 
        name, email, password 
    }) // agar user exist nahi karta hai to naya user create kar rahe hai

    const token = jwt.sign( // JWT token generate kar rahe hai
        { id: user._id }, // token payload me user id set kar rahe hai
        process.env.JWT_SECRET, // JWT secret key ko .env file se access kar rahe hai
        { expiresIn: '3d' } // token ki expiry time 3 day set kar rahe hai 

    );

    res.cookie('token', token,);

    res.status(201).json({ // 201 status code ke saath success response bhej rahe hai
        user: { // user information ko data field me bhej rahe hai
            id: user._id, // user id
            email: user.email, // user email
            name: user.name // user name
        },
        token // response me token bhi bhej rahe hai
    })


    return res.status(201).json({ // 201 status code ke saath success response bhej rahe hai
        message: "User registered successfully", // success message
        status: "success", // status field me "success" set kar rahe hai
        data: { // data field me user information bhej rahe hai
            id: user._id, // user id
            name: user.name, // user name
            email: user.email // user email
        }
    })

}

module.exports = { // userRegisterController function ko export kar rahe hai taaki use kar sakein
    userRegisterController
}

