const mongoose = require('mongoose'); // mongoose ko import kar rahe hai

const connectDB = async () => {
    // try {
    //     await mongoose.connect(process.env.MONGO_URI); // .env file se MONGO_URI ko access kar rahe hai
    //     console.log('MongoDB connected successfully'); // agar connection successful ho jata hai to message print karega
    // } catch (error) {
    //     console.error('MongoDB connection failed:', error); // agar connection fail ho jata hai to error message print karega
    //     process.exit(1); // process ko exit kar dega with failure code
    // }
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('MongoDB connected successfully')
        }) // agar connection successful ho jata hai to message print karega

        .catch((err) => {
            console.log("Error connecting to MongoDB:", err); // agar connection fail ho jata hai to error message print karega
            process.exit(1); // process ko exit kar dega with failure code
        }   );
};

module.exports = connectDB; // connectDB function ko export kar rahe hai taaki use kar sakein