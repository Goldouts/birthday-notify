const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../firebase');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userRef = db.collection('users').doc(username);
        const doc = await userRef.get();
        if (doc.exists) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRef.set({ username, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userRef = db.collection('users').doc(username);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = doc.data();
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Sign in successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
