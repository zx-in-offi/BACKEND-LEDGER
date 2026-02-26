// iss file se server run kr sakte hai

require('dotenv').config(); // .env file se environment variables ko load karne ke liye
const app = require('./src/app'); // app.js se app ko import kar rahe hai

const connectDB = require('./src/config/db'); // db.js se connectDB function ko import kar rahe hai

connectDB(); // MongoDB se connect karne ke liye connectDB function ko call kar rahe hai   


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})