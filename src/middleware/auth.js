const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    //Check if the user login
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'Thisismyprojectinnodejs');
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user; // To give the "next" function the current user to save time that the next function try to find the user
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate!' });
    }
};

module.exports = auth;
