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
const SaveProjectHandler = require('../api/saveProjectHandler');
const DeleteProjectHandler = require('../api/deleteProjectHandler');
const AllProjectsHandler = require('../api/allProjectsHandler');
const AllTimeEntriesHandler = require("../api/allTimeEntriesHandler");
const PaginatedTimeEntriesHandler = require("../api/paginatedTimeEntriesHandler");
const DeleteTimeEntryHandler = require("../api/deleteTimeEntryHandler");
const GetTaskHandler = require("../api/getTaskHandler");
const SetTaskStatusHandler = require('../api/setTaskStatusHandler');
const UpdateTimeEntryHandler = require('../api/updateTimeEntryHandler');

const Response = require("../model/response/response");
const GenerateReportHandler = require('../api/generateReportHandler');
const AllInvoiceHandler = require('../api/allInvoiceHandler');
const SaveInvoiceHandler = require('../api/saveInvoiceHandler');
const GenerateInvoicePDFHandler = require('../api/generateInvoicePDFHandler');
const GetInvoiceHandler = require('../api/getInvoiceHandler');
const GetProjectHandler = require('../api/getProjectHandler');
const DataAccessHandlerFactory = require('../api/dataAccessHandlerFactory');

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
        this.app.use(bodyParser.json({ limit: '50mb', extended: true }))
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
                maxAge: process.env.SESSION_DURATION
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

        // Get paginated time entries for a user
        this.app.post('/api/report/', this.isAuthenticated, async function (req, res) {
            let handler = new GenerateReportHandler();
            await handler.handle(req, res);
        });

        /*// Get all time entries for a user
        this.app.get('/api/time/all/:userid', this.isAuthenticated, async function(req, res) {
            let handler = new AllTimeEntriesHandler(req, res);
            await handler.handle(req, res);
        });

        // Get paginated time entries for a user
        this.app.post('/api/time/', this.isAuthenticated, async function(req, res) {
            let handler = new PaginatedTimeEntriesHandler(req, res);
            await handler.handle(req, res);
        });

        // Delete a time entry
        this.app.delete('/api/time/:id', this.isAuthenticated, async function(req, res) {
            let handler = new DeleteTimeEntryHandler(req, res);
            await handler.handle(req, res);
        });

        // Update a time entry
        this.app.post('/api/time/update', this.isAuthenticated, async function(req, res) {
            let handler = new UpdateTimeEntryHandler(req, res);
            await handler.handle(req, res);
        });*/

        // // Add a task
        // this.app.post('/api/task', this.isAuthenticated, async function(req, res) {
        //     let handler = new AddTaskHandler(req, res);
        //     await handler.handle(req, res);
        // });

        // Set the status of a task
        this.app.post('/api/task/status', this.isAuthenticated, async function(req, res) {
            let handler = new SetTaskStatusHandler(req, res);
            await handler.handle(req, res);
        });

        // Delete a task
        /*this.app.delete('/api/task/:id', this.isAuthenticated, async function(req, res) {
            let handler = new DeleteTaskHandler(req, res);
            await handler.handle(req, res);
        });*/
        
        // Get the users active running task.
        this.app.get('/api/task/active', this.isAuthenticated, async function(req, res) {
            let handler = new GetActiveTaskHandler(req, res);
            await handler.handle(req, res);
        });

        // // Get all tasks for a user
        // this.app.get('/api/task/all/:userid', this.isAuthenticated, async function(req, res) {
        //     let handler = new AllTasksHandler(req, res);
        //     await handler.handle(req, res);
        // });

        // // Get all tasks for current user
        // this.app.get('/api/task/all', this.isAuthenticated, async function(req, res) {
        //     let handler = new AllTasksHandler(req, res);
        //     await handler.handle(req, res);
        // });

        // // Get a task
        // this.app.get('/api/task/:userid/:taskid', this.isAuthenticated, async function(req, res) {
        //     let handler = new GetTaskHandler(req, res);
        //     await handler.handle(req, res);
        // });
    

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

        // Get all projects for the current user
        // this.app.get('/api/project/all/', this.isAuthenticated, async function(req, res) {
        //     let handler = new AllProjectsHandler(req, res);
        //     await handler.handle(req, res);
        // });

        // //Get a project
        // this.app.get('/api/project/:id', this.isAuthenticated, async function(req, res) {
        //     let handler = new GetProjectHandler(req, res);
        //     await handler.handle(req, res);
        // });

        // // Add/update a project
        // this.app.post('/api/project', this.isAuthenticated, async function(req, res) {
        //     let handler = new SaveProjectHandler(req, res);
        //     await handler.handle(req, res);
        // });

        // // Delete a project
        // this.app.delete('/api/project/:id', this.isAuthenticated, async function(req, res) {
        //     let handler = new DeleteProjectHandler(req, res);
        //     await handler.handle(req, res);
        // });

        this.app.get('/api/invoice/pdf/:id', this.isAuthenticated, async function(req, res) {
            let handler = new GenerateInvoicePDFHandler();
            await handler.handle(req, res);
        });

        //TODO: Have all data access routes use this factory.
        this.dataAccessRouteFactory('entry');
        this.dataAccessRouteFactory('task');
        this.dataAccessRouteFactory('project');
        this.dataAccessRouteFactory('address');
        this.dataAccessRouteFactory('invoice');
    }

    dataAccessRouteFactory(schema, routes=['get', 'all', 'add', 'update', 'delete']) {
        let baseUrl = '/api/'+schema+'/';
        let dataAccessHandler = DataAccessHandlerFactory.createHandler(schema);

        if(routes.includes('all')) {
            this.app.get(baseUrl + 'all/', this.isAuthenticated, dataAccessHandler.all.bind(dataAccessHandler));
        }

        if(routes.includes('get')) {
            this.app.get(baseUrl+':id', this.isAuthenticated, dataAccessHandler.get.bind(dataAccessHandler));
        }

        if(routes.includes('add')) {
            this.app.post(baseUrl, this.isAuthenticated, dataAccessHandler.add.bind(dataAccessHandler));
        }

        if(routes.includes('update')) {
            this.app.post(baseUrl+'update/:id', this.isAuthenticated, dataAccessHandler.update.bind(dataAccessHandler));
        }

        if(routes.includes('delete')) {
            this.app.delete(baseUrl+':id', this.isAuthenticated, dataAccessHandler.delete.bind(dataAccessHandler));
        }
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