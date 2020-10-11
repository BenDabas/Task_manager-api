const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const Task = require('../models/task');
const { sendWelcomeEmail, sendCanceledEmail } = require('../emails/account');

const router = new express.Router();

//Create new user
router.post('/users', async (req, res) => {
    // I send HTTP request from postman ,here i manipulate the request and insert the request to the database
    // console.log(req.body); // Handle the incoming request that get from line 10 (app.use(exp....))
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token }); // Call toJSON because i send JSON -->toJSON in user.js/models , its being stringify
    } catch (e) {
        res.status(400).send(error);
    }

    // user.save()
    //     .then(() => {
    //         res.send(user);
    //     })
    //     .catch((error) => {
    //         res.status(400).send(error);
    //     });
    // res.send('tasting!');
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token }); // Call toJSON because i send JSON -->toJSON in user.js/models , its being stringify
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token; // This will remove the current token , and logout in this specific phone/computer
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

//The user cant get all details of all the users
// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({}); // Return all the users
//         res.send(users);
//     } catch (e) {
//         res.status(500).send();
//     }

//     // User.find({}) // Return all the users
//     //     .then((users) => {
//     //         res.send(users);
//     //     })
//     //     .catch((error) => {
//     //         res.status(500).send();
//     //     });
// });

// User can return just his profile cant search another users
// Get specific user by id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }

//     // User.findById(_id)
//     //     .then((user) => {
//     //         if (!user) {
//     //             return res.status(404).send();
//     //         }
//     //         res.send(user);
//     //     })
//     //     .catch((error) => {
//     //         res.status(500).send();
//     //     });
// });

//Update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body); // Returns just the keys from JSON example return age and name not 12 and Dani
    const allowedUpdates = ['name', 'email', 'password', 'age']; // The valid keys
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)); // If there is one false return false no matter how many trues
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Change because the middleware function on save

        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        // if (!user) { // I add the auth middleware so i check this
        //     // If there is no user found
        //     return res.status(404).send();
        // }
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        // await Task.deleteMany({owner:req.user._id})
        sendCanceledEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

const update = multer({
    // dest: 'avatars', //Create 'avatars' folder
    limits: {
        fileSize: 1500000, // 1MB
    },
    fileFilter(req, file, cb) {
        //cb = callback
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            // This is regular expressions, $ is the end of the string , | is or, its write between / / , \. is when start with .
            return cb(new Error('Please upload an image'));
        }
        return cb(undefined, true);
    },
});

router.post(
    '/users/me/avatar',
    auth,
    update.single('avatar'),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer(); // Casting to png image, resize... and return the image (toBuffer)

        req.user.avatar = buffer; // req.file.buffer contains the image file , its contains when there is no "dest" in update middleware
        // The value 'avatar' (in update.single('avatar)) is the key of the body request form-data ,and the value i sand (the picture) store in avatars folder
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        // Express know that is function that handle errors
        res.status(400).send({ error: error.message });
    }
);

//Delete avatar image
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// After call this http request in http://localhost:3000/users/5f806e65aa07e635d83abb57/avatar site the profile image appear
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;
