var app = app || {};

(function () {
    'use strict';

    /**
     * Todo Controller
     * @type {*}
     */
    var TodoList = Backbone.Collection.extend({
        url: '/todo',

        // 绑定到todo Model
        model: app.Todo,

        // 过滤出已完成的数目w
        completed: function () {
            return this.filter(function (todo) {
                return todo.get('completed');
            });
        },

        // 未完成的数目
        remaining: function () {
            return this.without.apply(this, this.completed());
        }
    });

    app.Todos = new TodoList();

}());
