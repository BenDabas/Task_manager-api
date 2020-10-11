const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    // Because "auth" - middleware function this function create task just when user login

    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(error);
    }

    // task.save()
    //     .then(() => {
    //         res.status(201).send(task);
    //     })
    //     .catch((error) => {
    //         res.status(500).send(error);
    //     });
});

//Read all tasks
//Get /tasks?completed=true
//Get /tasks?limit=10&skip=20 --> Show me 10 results between 20 to 30 from the results
//     ---> Pagination ->limit is the number of results in 1 page , skip is how many results i want to skip
//Get /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id }); The same like the next line with the populate
        const match = {};
        const sort = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'; //The params is string no boolean ---> return boolean with ===
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        await req.user
            .populate({
                path: 'userTasks',
                match,
                options: { limit: parseInt(req.query.limit), skip: parseInt(req.query.skip), sort },
            })
            .execPopulate();
        res.send(req.user.userTasks);
    } catch (e) {
        res.status(404).send(error);
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks).catch((error) => {
    //         res.status(404).send(error);
    //     });
    // });
});

//Read task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id }); //Find the task of the user

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(error);
    }

    // Task.findById(_id)
    //     .then((task) => {
    //         if (!task) {
    //             return res.status(404).send();
    //         }
    //         res.send(task);
    //     })
    //     .catch((error) => {
    //         res.status(500).send(error);
    //     });
});

//Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });

        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id }); // task's id && owner's id
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
