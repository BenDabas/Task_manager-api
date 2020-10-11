// Ben\ Dabas/Desktop/desktop/mongodb/bin/mongod.exe --dbpath=Ben\ Dabas/Desktop/desktop/mongodb-data . This is the command to run the server , when  in  /c/Users
const express = require('express');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     console.log(req.method, req.path);
//     next();
// });

//Without middleware : new request --->  run route handler
//With middleware : new request ---> do something --> run route handler

// app.use((req, res, next) => {
//     res.status(503).send('The site is under maintenance . Please come back soon');
// });

app.use(express.json()); // listen for incoming request
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ', port);
});

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'asdd' }, 'Thisismyprojectinnodejs', { expiresIn: '1 hour' }); //The first argument is the unique identify and the second is secret use with the algorithm of the token like signature .
//     //Token is the identify of the user , no one can understand what write in the token , with the token the user can delete create is own task , the token has iat - its number that all the time change in every sign
//     const data = jwt.verify(token, 'Thisismyprojectinnodejs'); // its decode the token
//     console.log(data);
// };

// myFunction();
