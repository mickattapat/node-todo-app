const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
var createError = require('http-errors');
var { default : logger, api: loggerApi, apiOutPut: loggerApiOut } = require('./services/logger')

// Start express app
const app = express();
logger.debug('Create application server.')
// logger
app.use((req, res, next) => {
    loggerApi.addContext('ip', req.ip)
    loggerApi.addContext('method', req.method)
    loggerApi.addContext('url', req.url)

    loggerApiOut.addContext('ip', req.ip)
    loggerApiOut.addContext('method', req.method)
    loggerApiOut.addContext('url', req.url)
    next()
});
// .env
require('dotenv').config({ path : '.env'})
// db
const db = require('./db/index');
db.sequelize.sync();
logger.debug('migrate db successfully.')
// cors
const cors = require('cors');
// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Locales Languages
var i18n = require('i18n')
i18n.configure({ locales: ['th', 'en'], directory: __dirname + '/locales', queryParameter: 'lang', defaultLocale: 'th' })
app.use(i18n.init)

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use(require('./routes'))
// app.use('/api/v1', viewRouter);
// logger.info('Install api route path successfully.')
logger.info('Install api route path successfully.')
// Upload file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
logger.info('Install upload route path successfully.')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const { name, message } = err
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({ error: { name, message } });
});

module.exports = app;