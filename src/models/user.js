const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//Create model of User

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // "required:true" makes name must field
            trim: true, //Delete spaces
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true, //makes the String lowercase before save
            validate(value) {
                if (!validator.isEmail(value)) {
                    // The validator npm can check if email is correct
                    throw new Error('Email is invalid');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password');
                }
            },
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must to be a positive number');
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    {
        timestamps: true,
    }
);

//Virtual functions is way to mongoose to figure out how these to things are related , This is not store in the database as field at all.
userSchema.virtual('userTasks', {
    //This is the userTasks
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner', // The field related in Task
});

userSchema.methods.toJSON = function () {
    // When we sends the user objects as JSON (this return to the user in "send({user})") its automatics call the function toJSON to stringify the object(user) so here returns userObject
    //With arrow functions i cant use "this"
    const user = this;
    const userObject = this.toObject();
    delete userObject.password; // return to the user his profile without the passwords and his tokens --> more security
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
};

//Statics methods are Model methods and "methods" are accessible on instance of the Model
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'Thisismyprojectinnodejs' || process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token }); // Add more token to the current tokens
    await user.save();

    return token;
};

//Statics methods are Model methods and methods are accessible on instance of the Model
//Create function "User.findByCredentials"
userSchema.statics.findByCredentials = async (email, password) => {
    //Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user; // If there is a match
};

// Hash the plain text before saving
//This is a middleware function that start just before (pre) save action
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        // Check if password changing
        user.password = await bcrypt.hash(user.password, 8); //This will hash the password 8 times
    }

    next();
});

//Delete user tasks when user is removed . This is a middleware function
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
