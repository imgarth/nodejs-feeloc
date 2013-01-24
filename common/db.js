/*!
 * todo - common/db.js
 * feeloc http://feeloc.cn
 *
 */

"use strict";

var mongoskin = require('mongoskin');
var config = require('../config');

var noop = function () {
};

var db = mongoskin.db(config.db);
db.bind('todo');
//建两个索引
db.todo.ensureIndex({complete: 1}, noop);
db.todo.ensureIndex({'url.name': 1}, noop);

module.exports = db;