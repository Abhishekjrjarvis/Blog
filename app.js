if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const catchAsync = require('./utilities/CatchAsync');
const BlogError = require('./utilities/BlogError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const mongoStore = require('connect-mongo');

const db_url = 'mongodb://localhost:27017/blog_app_demo'

mongoose.connect(db_url,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DataBase Connected');
});

const secret = `${process.env.SECRET}` || 'Thisismyblogpage'

const store = new mongoStore({
    mongoUrl: db_url,
    touchAfter: 24*60*60
})

app.use(session({
    name: 'blog',
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 + 60 * 60 * 24 * 7
    }
}))

app.use(flash());


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);


app.get('/homepage', (req, res) =>{
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new BlogError('Page Not Found', '404'));
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'SOMETHING WENT WRONG....' } = err
    res.status(status).render('error', { err });
})


const port = process.env.PORT || 3000;
app.listen(port,(req, res)=>{
    console.log(`listening on port ${3000}`)
})



