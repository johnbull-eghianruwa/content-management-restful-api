import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { connect }  from 'mongoose';
import Article from './models/article.js';
import User from './models/user.js';
import isAdmin from './models/middleware/admin.js';

const app = express();

mongoose.connect('mongodb://localhost:27017/ContentManagementDB', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
});
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// GET article comments
app.get('/articles/:articleId/comments/:commentId', async (req, res) => {
    const { articleId, commentId } = req.params;
    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        const comment = article.comments.id(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/articles', (req, res) => {
    const { details } = req.query;
    if (details === true) {
        const response = {
            details1: true,
            details2: false
        };
        res.json(response);
    }else {
        res.status(400).json({ error: 'Invalid details parameter' });
    }

});

// POST create new article (admin only)
app.post('/articles', isAdmin, async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        const savedArticle = await newArticle.save();
        res.json(savedArticle);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT update existing article (admin only)
app.put('/articles/:articleId', isAdmin, async (req, res) => {
    const { articleId } = req.params;
    try {
        const updatedArticle = await Article.findByIdAndUpdate(articleId, req.body, { new: true });
        res.json(updatedArticle);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE article (admin only)
app.delete('/articles/:articleId', isAdmin, async (req, res) => {
    const { articleId } = req.params;
    try {
        await Article.findByIdAndRemove(articleId);
        res.json({ deleted: articleId });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// GET all users and log them to console
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get a specific use by ID
app.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Create a new user
app.post('/users', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const newUser = new User({ email, firstName, lastName, password, role: 'user' });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update a specific user by ID
app.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a specific by ID
app.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await User.findByIdAndRemove(userId);
        res.json({ deleted: userId });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
