/*!
 * todo - server.js
 * feeloc http://feeloc.cn
 *
 */

"use strict";

require('./lib/patch');
var connect = require('connect');
var render = require('connect-render');
var urlrouter = require('urlrouter');
var config = require('./config');
var todo = require('./controllers/todo');

var app = connect();

app.use('/public', connect.static(__dirname + '/public', {maxAge: 3600000 * 24 * 30}));
app.use(connect.cookieParser());
app.use(connect.query());
app.use(connect.bodyParser());
app.use(connect.session({secret: config.session_secret}));
app.use(render({
    root: __dirname + '/views',
    cache: config.debug,
    helpers: {
        config: config,
        _csrf: function (req, res) {
            return req.session._csrf;
        }
    }
}));

/**
 * Routing
 */
var router = urlrouter(function (app) {
    app.get('/', todo.index);
    app.get('/todo', todo.getTodo);
    app.post('/todo', todo.newTodo);
    app.delete('/todo/:id/delete', todo.delete);
    //url的一些操作
    app.post('/url', todo.newUrl);
    //匹配url
    app.get('/:url', todo.router);
});
app.use(router);
app.listen(config.port);