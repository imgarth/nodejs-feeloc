/*!
 * todo - controllers/todo.js
 * feeloc http://feeloc.cn
 *
 */
"use strict";

var config = require('../config');
var db = require('../common/db');
var urlString = ['todo'].toString();

/**
 * 首页
 * @param req
 * @param res
 * @param next
 */
exports.index = function (req, res, next) {
    res.render('index.html', {url: 'index'});
};

/**
 * 获取TODO List
 * @param req
 * @param res
 * @param next
 */
exports.getTodo = function (req, res, next) {
    var url = req.query.url;
    db.todo.findItems({'url.name': url, title: {'$ne': undefined}}, { sort: {_id: 1}}, function (err, rows) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(rows));
    });
};

/**
 * 新建一个TODO
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.newTodo = function (req, res, next) {
    var title = req.body.title || '';
    var url = req.body.url.name || '';
    var id = req.body._id;
    var completed = req.body.completed;
    if (!title || !url) {
        return res.render('error.html', {message: 'url'});
    }
    db.todo.findById(id, function (err, row) {
        if (row != null) {
            db.todo.updateById(id, {$set: {title: title, completed: completed}}, function (err, result) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({status: 'success'}));
            });
        } else {
            db.todo.save({title: title, post_date: new Date(), url: {
                name: url
            }}, function (err) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({status: 'success'}));
            });
        }
    });
};

/**
 * 新建一个URL
 * @param req
 * @param res
 * @param next
 */
exports.newUrl = function (req, res, next) {
    var url = req.body.url || '';
    res.setHeader('Content-Type', 'application/json');
    if (!url) {
        res.end(JSON.stringify({error: 'url已经存在'}));
    } else {
        db.todo.findItems({'url.name': url}, function (err, rows) {
            if (rows.length > 0 || (urlString.indexOf(url) > 0)) {
                res.end(JSON.stringify({error: 'url已经存在'}));
            } else {
                db.todo.save({url: {name: url, post_date: new Date()}}, function (err) {
                    if (err) {
                        res.end(JSON.stringify({error: err}));
                    }
                    res.end(JSON.stringify({url: url}));
                });
            }
        });
    }
};

/**
 * 路由规则，进入私有TODO List
 * @param req
 * @param res
 * @param next
 */
exports.router = function (req, res, next) {
    var url = req.params.url;
    db.todo.findItems({'url.name': url}, function (err, rows) {
        if (rows.length > 0 && !(urlString.indexOf(url) > 0)) {
            res.render('index.html', {url: url});
        } else {
            res.render('error.html', {message: '请输入一个有效的URL'});
        }
    });
};

/**
 * 删除TODO
 * @param req
 * @param res
 * @param next
 */
exports.delete = function (req, res, next) {
    var id = req.params.id;
    db.todo.removeById(id, function (err) {
        if (err) {
            return next(err);
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({status: 'success'}));
    });
};