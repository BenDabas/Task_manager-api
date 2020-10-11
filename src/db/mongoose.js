const mongoose = require('mongoose');
// const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api' || process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

// //Create model of User

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true, // "required:true" makes name must field
//         trim: true, //Delete spaces
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true, //makes the String lowercase before save
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 // The validator npm can check if email is correct
//                 throw new Error('Email is invalid');
//             }
//         },
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error('Password cannot contain "password');
//             }
//         },
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must to be a positive number');
//             }
//         },
//     },
// });

// const me = new User({
//     name: '    Ben  ',
//     email: 'BEN@gmail.com           ',
//     password: 'Bbb  bb22222',
// });

// me.save()
//     .then(() => {
//         console.log(me);
//     })
//     .catch((error) => {
//         console.log('Error!', error);
//     });

//Create model of task

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     completed: {
//         type: Boolean,
//         default: false,
//     },
// });

// const task = new Task({
//     description: 'Read book',
// });

// task.save()
//     .then(() => {
//         console.log(task);
//     })
//     .catch((error) => {
//         console.log('Error', error);
//     });
