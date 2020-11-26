import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './models/User';
import jwt from 'jsonwebtoken';
import config from 'config';
import auth from './middleware/auth';
import List from './models/List';
import mongoose from 'mongoose';

// Initialize express application
const app = express();

connectDatabase();

app.use(express.json({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

/**
 * @route GET api/auth
 * @desc Authenticate user
 */

app.get('/api/auth', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Unknown server error');
    }
});

/**
 * @route GET /
 * @desc Test endpoint
 */

app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route GET api/lists
 * @desc Get lists
 */
app.get('/api/lists', auth, async (req, res) => {
    try {
        const lists = await List.find({ user: req.user.id });

        res.json(lists);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

/**
 * @route POST api/lists
 * @desc Create list
 */
app.post(
    '/api/lists',
    [
        auth,
        [
            check('title', 'Title text is required')
                .not()
                .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array() });
        } else {
            const { title } = req.body;
            try {
                const user = await User.findById(req.user.id);

                const list = new List({
                    user: user.id,
                    title: title,
                });

                await list.save();

                res.json(list);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server error');
            }
        }
    }
);

/**
 * @route POST api/lists/:id
 * @desc Create listItem
 */
app.post(
    '/api/lists/:id',
    [
        auth,
        [
            check('desc', 'Description text is required')
                .not()
                .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array() });
        } else {
            const { desc } = req.body;
            try {
                const list = await List.findById(req.params.id);

                const listItem = { _id: mongoose.Types.ObjectId(), desc: desc };
                list.items.push(listItem);

                await list.save();

                res.json(listItem);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server error');
            }
        }
    }
);
/**
 * @route PUT api/lists/:listId/:itemId
 * @desc Update a list item
 */
app.put('/api/lists/:listId/:itemId', auth, async (req, res) => {
    try {
        const { desc } = req.body;

        const list = await List.findById(req.params.listId);

        if (!list) {
            return res.status(404).json({ msg: 'List not found'});
        }

        if (list.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        const item = list.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({ msg: 'List not found'});
        }

        item.desc = desc || item.desc;

        await list.save();

        res.json(item);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
/**
 * @route PUT api/lists/:id
 * @desc Update a list
 */
app.put('/api/lists/:id', auth, async (req, res) => {
    try {
        const { title } = req.body;
        const list = await List.findById(req.params.id);

        if (!list) {
            return res.status(404).json({ msg: 'List not found'});
        }

        if (list.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        list.title = title || list.title;

        await list.save();

        res.json(list);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
/**
 * @route DELETE api/lists/:listId/:itemId
 * @desc Delete a list item
 */
app.delete('/api/lists/:listId/:itemId', auth, async (req, res) => {
    try {
        const list = await List.findById(req.params.listId);

        if (!list) {
            return res.status(404).json({ msg: 'List not found'});
        }

        if (list.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        list.items.id(req.params.itemId).remove();
        await list.save();

        res.json({ msg: 'List item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
/**
 * @route DELETE api/lists/:listId/
 * @desc Delete a list
 */
app.delete('/api/lists/:listId', auth, async (req, res) => {
    try {
        const list = await List.findById(req.params.listId);

        if (!list) {
            return res.status(404).json({ msg: 'List not found'});
        }

        if (list.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        await list.remove();

        res.json({ msg: 'List removed' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
/**
 * @route POST api/login
 * @desc Login user
 */
app.post(
    '/api/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'A password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { email, password } = req.body;
            try {
                let user = await User.findOne({ email: email });
                if (!user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid email or password' }] });
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid email or password' }] });
                }

                returnToken(user, res);
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

/**
 * @route POST api/users
 * @desc Register user
 */

app.post('/api/users', 
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;
            try {
                let user = await User.findOne({ email: email });
                if (user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'User already exists'}] });
                }
                user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                
                await user.save();

                returnToken(user, res);
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);
const returnToken = (user, res) => {
    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '10hr' },
        (err, token) => {
            if (err) throw err;
            res.json({ token: token });
        }
    );
};
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));
