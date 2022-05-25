const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csurf = require('csurf');
const compression = require('compression');
const child_process = require('child_process');

var passport = require('passport');
const passportLocal = require('passport-local');

const bcrypt = require('bcrypt');
const fs = require('fs');
const crypto = require('crypto');
const database = require('./db.js');

const host = process.env.HOST || 'localhost';
const port = process.env.LISTEN_PORT;
const master = process.env.MASTER_THREAD;
const num_process = process.env.NUM_PROCESS;

// For multiple instances of Node
/*
if (master) {
    for (let i = 1; i < num_process || 0; i = i + 1) {
        child_process.fork(__filename, [], { env: { LISTEN_PORT: port + i} } );
    }
}
*/
    
database.init();
if (master) { database.init_database() }


const passportStrategy = new passportLocal(function verify(user, password, cb) {
    database.checkUserPassword(user, password).then(
        function(value) { if (value >= 0) {
            cb(null, {id: value, username: user});
        } else {
            cb(null, false)
        }},
        function(err) { console.log(err);   }
    )
})

const app = express();
//app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(session({
    secret: 'a_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
    },
    genid: function(req) { return require('uuid').v1() }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(passportStrategy);
app.use('/static', express.static(__dirname + '/../../public'));
app.use('/dist', express.static(__dirname + '/../../dist'));

app.get('/', function(req, res) {
    fs.readFile(__dirname + "/../views/app.html", 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
});
app.post('/comment_message', function(req, res) {
    if (req.user === undefined) { res.send("Not ok"); return }
    const date = new Date();
    const hash = crypto.createHash('sha256').update(req.body.message + req.user.id + date.getMilliseconds() + Math.random()).digest('hex');
    database.insertComment(req.body.message, req.body.message_id, req.user.id || "anonymous", date);
    res.send("Ok");
});
app.post('/new_message', function(req, res) {
    if (req.user === undefined) { res.send("Not ok"); return }
    const date = new Date();
    const hash = crypto.createHash('sha256').update(req.body.message + req.user.id + date.getMilliseconds() + Math.random()).digest('hex');
    database.insertMessage(req.body.message, req.user.id || "anonymous", date, hash);
    res.send("Ok");
});
app.post('/like_message', function(req, res) {
    if (req.user === undefined) { res.send("Not ok"); return }
    if (req.body.set) {
        database.setLike(req.user.id || -1, req.body.message_id);
    } else {
        database.unsetLike(req.user.id || -1, req.body.message_id);
    }
    res.send("Ok");
});
app.post('/dislike_message', function(req, res) {
    if (req.user === undefined) { res.send("Not ok"); return }
    if (req.body.set) {
        database.setDislike(req.user.id || -1, req.body.message_id);
    } else {
        database.unsetDislike(req.user.id || -1, req.body.message_id);
    }
    res.send("Ok");
});
app.get('/get_comments', function(req, res) {
    var user_id = -1;
    if (req.user !== undefined) { user_id = req.user.id }
    if (req.query.message_id) {
        database.getComments(req.query.message_id, user_id).then(
            (c) => { res.send(c) }
        )
    } else {
        res.send("Not ok")
    }
});
app.get('/get_messages', function(req, res) {
    var user_id = -1;
    if (req.user !== undefined) { user_id = req.user.id }
    const messages = database.getTableMessagesCount(100, user_id || -1);
    
    messages.then((m) => res.send(m))
});
app.get('/get_username', function(req, res) {
    if (req.user) { res.send(req.user.username) }
    else { res.send(false) }
});
app.post('/signup', function(req, res) {
    database.insertUser(req.body.username, req.body.password).then((bool) =>
        res.send(bool))
});
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: "/"
    })
);
app.post('/logout', function(req, res) {
    req.logout();
    res.send("Ok");
});

app.use((err, req, res, next) => {
    console.log(err);
})

app.listen(port, host);