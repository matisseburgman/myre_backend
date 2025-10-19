const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
};

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required',
                error: 'MISSING_FIELDS'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters',
                error: 'PASSWORD_TOO_SHORT'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email',
                error: 'USER_EXISTS'
            });
        }

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return user data and token
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'User already exists with this email',
                error: 'USER_EXISTS'
            });
        }

        res.status(500).json({
            message: 'Server error during registration',
            error: 'SERVER_ERROR'
        });
    }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                error: 'MISSING_FIELDS'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
                error: 'INVALID_CREDENTIALS'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password',
                error: 'INVALID_CREDENTIALS'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data and token
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: 'SERVER_ERROR'
        });
    }
});

// @route   GET /auth/validate
// @desc    Validate token and get user info
// @access  Private
router.get('/validate', authenticateToken, async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({
            message: 'Server error during token validation',
            error: 'SERVER_ERROR'
        });
    }
});

// @route   GET /auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: 'Server error getting profile',
            error: 'SERVER_ERROR'
        });
    }
});

module.exports = router;
