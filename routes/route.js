// imports
const { Router } = require('express');
const User = require('../models/model');
const Blog = require("../models/blog");

const router = Router();

// Home Page
router.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user ,
        blogs: allBlogs,
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect('/user');
});

// Sign In page rander
router.get('/signin', (req, res) => {
    res.render('signin');
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);
        
        return res.cookie('token',token).redirect('/user');
    } catch (error) {
        return res.render('signin', {
            error: "Incorrect Email or Password",
        });
    }
});

// Sign Up page rander amd post 
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/user');
});


module.exports = router;