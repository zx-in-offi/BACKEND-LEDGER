const express = require('express');

const cookieParser = require('cookie-parser'); // cookie-parser middleware ko import kar rahe hai

const authRouter = require('./routes/auth.routes'); // auth routes ko import kar rahe hai
const app = express(); // server ka instance crete kar rahe hai

app.use(express.json()); // JSON request body ko parse karne ke liye middleware use kar rahe hai
app.use(cookieParser()); // cookie-parser middleware ko use kar rahe hai

app.use("/api/auth", authRouter); // auth routes ko /api/auth path par use kar rahe hai

module.exports = app; // app ko export kar rahe hai taki server.js me use kar sake