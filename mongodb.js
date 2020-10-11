// //CRUD create read update delete

// // const mongodb = require('mongodb');
// // const MongoClient = mongodb.MongoClient;
// // const ObjectID = mongodb.ObjectID;

// const { MongoClient, ObjectID } = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const database = 'task=manager';

// // const id = new ObjectID(); //to insert an id to object in the database before we insert the object
// // console.log(id.getTimestamp());

// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database! ');
//     }

//     console.log('Connected correctly!');
//     // const db = client.db(database);

//     // DELETE from DB
//     // db.collection('tasks')
//     //     .deleteOne({
//     //         description: 'Call grandma',
//     //     })
//     //     .then((result) => {
//     //         console.log(result);
//     //     })
//     //     .catch((error) => {
//     //         console.error(error);
//     //     });

//     //UPDATE the DB
//     // db.collection('tasks')
//     //     .updateMany(
//     //         {
//     //             completed: false,
//     //         },
//     //         {
//     //             $set: {
//     //                 completed: true,
//     //             },
//     //         }
//     //     )
//     //     .then((result) => {
//     //         console.log(result);
//     //     })

//     //     .catch((error) => {
//     //         console.log(error);
//     //     });

//     // db.collection('users')
//     //     .updateOne(
//     //         {
//     //             _id: new ObjectID('5f4fb5e671318d0168b002c9'),
//     //         },
//     //         {
//     //             $set: {
//     //                 name: 'Rick',
//     //                 age: 55,
//     //             },
//     //         }
//     //     )
//     //     .then((result) => {
//     //         console.log(result);
//     //     })
//     //     .catch((error) => {
//     //         console.log(error);
//     //     });

//     //READ from DB
//     // db.collection('users').findOne({ _id: new ObjectID('5f4fb160eae2cc2c3c8c3aa3') }, (error, user) => {
//     //     if (error) {
//     //         return console.log('Unable to fetch');
//     //     }
//     //     console.log(user);
//     // });

//     // db.collection('users')
//     //     .find({ age: 24 })
//     //     .toArray((error, users) => {
//     //         console.log(users);
//     //     }); // find return pointer to the data  without a callback function , so we add toArray that has callback function

//     // db.collection('users')
//     //     .find({ age: 24 })
//     //     .count((error, users) => {
//     //         console.log(count);
//     //     });

//     // db.collection('tasks').findOne({ description: 'Call grandma' }, (error, task) => {
//     //     console.log(task);
//     // });

//     // db.collection('tasks')
//     //     .find({ completed: false })
//     //     .toArray((error, tasks) => {
//     //         console.log(tasks);
//     //     });

//     //CREATE elements to DB
//     // db.collection('users').insertOne(
//     //     {
//     //         _id: id,
//     //         name: 'Dana',
//     //         age: 24,
//     //     },
//     //     (error, result) => {
//     //         if (error) {
//     //             return console.log('Unable to insert user');
//     //         }
//     //         console.log(result.ops); //an array of the object inserted
//     //     }
//     // );

//     // db.collection('users').insertMany(
//     //     [
//     //         {
//     //             name: 'Michelle',
//     //             age: 24,
//     //         },
//     //         {
//     //             name: 'Lior',
//     //             age: 50,
//     //         },
//     //     ],
//     //     (error, result) => {
//     //         if (error) {
//     //             return console.log('Unable to insert documents!');
//     //         }
//     //         console.log(result.ops);
//     //     }
//     // );

//     // db.collection('tasks').insertMany(
//     //     [
//     //         {
//     //             description: 'Play with may',
//     //             completed: false,
//     //         },
//     //         {
//     //             description: 'Clean the room',
//     //             completed: true,
//     //         },
//     //         {
//     //             description: 'Call grandma',
//     //             completed: true,
//     //         },
//     //     ],
//     //     (error, result) => {
//     //         if (error) {
//     //             return console.log('Unable to insert tasks!');
//     //         }
//     //         console.log(result.ops);
//     //     }
//     // );
// });
