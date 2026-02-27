const mongoose = require('mongoose'); // mongoose library ko import kar rahe hai

const bcrypt = require('bcryptjs'); // bcrypt library ko import kar rahe hai password hashing ke liye
const { use } = require('react');

const userSchema = new mongoose.Schema({ // userSchema ko define kar rahe hai
    email:{
        type: String, // email ka type string hoga
        required: [true, 'Email is required'], // email field required hai
        trim: true, // email ke aage aur peeche ke spaces ko remove kar dega
        lowercase: true, // email ko lowercase me convert kar dega
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'], // email format ko validate karega
        unique: [true, 'Email already exists'] // email unique hona chahiye
    },
    name: {
        type: String, // name ka type string hoga
        required: [true, 'Name is required'] // name field required hai

    },
    password: {
        type: String, // password ka type string hoga
        required: [true, 'Password is required'], // password field required hai
        minlength: [6, 'Password must be at least 6 characters long'], // password ki minimum length 6 characters honi chahiye
        select: false // password ko query results me include nahi karega by default
    }

}, { 
    timestamps: true 
}
); // timestamps option se createdAt aur updatedAt fields automatically add ho jayenge

userSchema.pre('save', async function (next) { // save operation se pehle ye function execute hoga
    if(!this.isModified('password')) { // agar password field modify nahi hui hai to next() call karega
        return 
    }

    const hash = await bcrypt.hash(this.password, 10); // password ko hash karega with a salt round of 10
    this.password = hash; // hashed password ko user document me set karega

    return

    // return next(); // next() call karega taaki save operation continue ho sake
    // but yaha pe hum next() use nahi kar sakte kyuki humne async function 
    // banaya hai to hum directly return kar sakte hai without calling next() 
    // kyuki async function me agar hum return karte hai to wo automatically next() ko call kar deta hai

});

userSchema.methods.comparePassword = async function (candidatePassword) { // comparePassword method ko define kar rahe hai
    return await bcrypt.compare(candidatePassword, this.password); // candidate password ko hashed password ke saath compare karega

};

const User = mongoose.model('User', userSchema); // userSchema se User model create kar rahe hai

module.exports = User; // User model ko export kar rahe hai taaki use kar sakein

