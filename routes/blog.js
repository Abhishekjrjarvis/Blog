const express = require('express');
const router = express.Router({mergeParams: true})
const Blog = require('../models/blog');
const catchAsync = require('../utilities/CatchAsync');
const { isLoggedIn } = require('../middleware');

router.get('/', async(req, res) =>{
    const blogs = await Blog.find({});
    res.render('blog', { blogs: blogs });
});

router.get('/new', isLoggedIn,  (req, res)=>{
    res.render('new');
});

router.post('/', isLoggedIn,  catchAsync(async(req, res, next) =>{
    const blog = await new Blog(req.body);
    blog.author = req.user._id;
    await blog.save()
    res.redirect('/blog');
}));

router.get('/:id', async(req, res) =>{
    const blogs = await Blog.find({});
    const view = await Blog.findById(req.params.id).populate('author');
    res.render('view_blog', { view: view , blogs });
})

module.exports = router;