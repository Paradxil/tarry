const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var cors = require('cors');

const Database = require('../data/database');
const UserDAO = require('../data/userDAO');

const LoginHandler = require('../api/loginHandler');
const CaptchaHandler = require('../api/captchaHandler');
const RegisterHandler = require('../api/registerHandler');
const AllTasksHandler = require('../api/allTasksHandler');
const AddTaskHandler = require('../api/addTaskHandler');
const DeleteTaskHandler = require('../api/deleteTaskHandler');
const StartTaskHandler = require('../api/startTaskHandler');
const StopTaskHandler = require('../api/stopTaskHandler');
const GetActiveTaskHandler = require('../api/getActiveTaskHandler');
const AddProjectHandler = require('../api/addProjectHandler');
const DeleteProjectHandler = require('../api/deleteProjectHandler');
const AllProjectsHandler = require('../api/allProjectsHandler');
const AllTimeEntriesHandler = require("../api/allTimeEntriesHandler");
const PaginatedTimeEntriesHandler = require("../api/paginatedTimeEntriesHandler");

const Response = require("../model/response/response");

class Server {
    constructor() {
        this.app = express();
        this.initMiddleware();
        this.initHandlers();
    }

    start(port) {
        this.app.listen(port, () => {
            console.log(`Time Tracker listening at http://localhost:${port}`);
        });
    }

    async initMiddleware() {
        this.useBodyParser();
        this.useSessions();
        this.usePassport();

        this.app.use(cors({
            origin: true,
            credentials: true
        }));

        //Connect to the mongoDB
        await Database.connect();
    }

    useBodyParser() {
        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }))
        
        // parse application/json
        this.app.use(bodyParser.json())
    }

    useSessions() {
        var store = MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/timetracker',
            ttl: 14 * 24 * 60 * 60, // = 14 days. Default
            touchAfter: 3600, // time period in seconds
            autoRemove: 'interval',
            autoRemoveInterval: 10, // In minutes. Default
            crypto: {
                secret: process.env.SESSION_SECRET
            }
        });
        
        this.app.use(session({ 
            secret: process.env.SESSION_SECRET,
            cookie: {
                maxAge: 1000 * 60 * 60 * 5 // 5 hours
            },
            saveUninitialized: false,
            resave: false,
            store: store
        }));
    }

    usePassport() {
        passport.use("local", new LocalStrategy(
            async function(username, password, done) {
                let handler = new LoginHandler;
                return await handler.handle(username, password, done);
            }
        ));

        passport.serializeUser(function(user, cb) {
            cb(null, user._id);
        });
          
        passport.deserializeUser(async function(id, cb) {
            let userDAO = new UserDAO();
            let user = await userDAO.getUserById(id);
            if(user !== null) {
                cb(null, user);
            }
            else {
                cb(null, null);
            }
        });

        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    initHandlers() {
        this.initLoginHandler();

        // Register a user
        this.app.post('/api/register', CaptchaHandler.handle, async function(req, res) {
            let handler = new RegisterHandler(req, res);
            await handler.handle(req, res);
        });

        // Register a user
        this.app.post('/api/logout', this.isAuthenticated, async function(req, res) {
            req.session.destroy(function (err) {
                if(err) {
                    res.send(Response.Error("Error logging out."));
                    return;
                }
                req.logout();
                res.send(Response.Success());
            });
        });

        // Get the logged in user
        this.app.get('/api/user', this.isAuthenticated, async function(req, res) {
            if(req.user) {
                res.send(Response.Success(req.user));
            }
            else {
                res.send(Response.Error("Error getting user."));
            }
        });

        // Send the server status
        this.app.get('/api/status', async function(req, res) {
            res.send(Response.Success(
                {
                    loggedin: req.isAuthenticated()
                }
            ));
        });

        // Get all time entries for a user
        this.app.get('/api/time/all/:userid', this.isAuthenticated, async function(req, res) {
            let handler = new AllTimeEntriesHandler(req, res);
            await handler.handle(req, res);
        });

        // Get paginated time entries for a user
        this.app.post('/api/time/', this.isAuthenticated, async function(req, res) {
            let handler = new PaginatedTimeEntriesHandler(req, res);
            await handler.handle(req, res);
        });

        // Add a task
        this.app.post('/api/task', this.isAuthenticated, async function(req, res) {
            let handler = new AddTaskHandler(req, res);
            await handler.handle(req, res);
        });

        // Delete a task
        this.app.delete('/api/task/:id', this.isAuthenticated, async function(req, res) {
            let handler = new DeleteTaskHandler(req, res);
            await handler.handle(req, res);
        });

        // Get all tasks for a user
        this.app.get('/api/task/all/:userid', this.isAuthenticated, async function(req, res) {
            let handler = new AllTasksHandler(req, res);
            await handler.handle(req, res);
        });

        // Start a task. Each user can only have one running active task at a time.
        this.app.post('/api/start', this.isAuthenticated, async function(req, res) {
            let handler = new StartTaskHandler(req, res);
            await handler.handle(req, res);
        });

        // Stop the users running task.
        this.app.post('/api/stop', this.isAuthenticated, async function(req, res) {
            let handler = new StopTaskHandler(req, res);
            await handler.handle(req, res);
        });

        // Get the users active running task.
        this.app.get('/api/task/active/:userid', this.isAuthenticated, async function(req, res) {
            let handler = new GetActiveTaskHandler(req, res);
            await handler.handle(req, res);
        });

        // Add a project
        this.app.post('/api/project', this.isAuthenticated, async function(req, res) {
            let handler = new AddProjectHandler(req, res);
            await handler.handle(req, res);
        });

        // Delete a project
        this.app.delete('/api/project/:id', this.isAuthenticated, async function(req, res) {
            let handler = new DeleteProjectHandler(req, res);
            await handler.handle(req, res);
        });

        // Get all projects for a user
        this.app.get('/api/project/all/:userid', this.isAuthenticated, async function(req, res) {
            let handler = new AllProjectsHandler(req, res);
            await handler.handle(req, res);
        });
    }

    initLoginHandler() {
        // Login user
        this.app.post('/api/login', CaptchaHandler.handle, passport.authenticate('local', {failureRedirect: "/api/login/failure"}), function(req, res) {
            if(req.user !== null && req.user !== undefined) {
                res.send(Response.Success({user: req.user}));
            }
            else {
                res.send(Response.Error("Invalid username or password."));
            }
        });

        this.app.get('/api/login/failure', (req, res) => {
            res.send(Response.Error("Invalid username or password."));
        });
    }

    isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.send(Response.Unauthorized());
        }
    }
}

module.exports = Server;