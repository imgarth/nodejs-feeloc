var app = app || {};

(function () {
    'use strict';

    /**
     * TODO Model
     * @type {*}
     */
    app.Todo = Backbone.Model.extend({
        urlRoot: '',

        defaults: {
            title: '',
            post_date: '',
            _id: '',
            completed: false,
            url: {
                name: ''
            }
        },

        // 点击变为相反状态
        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }

    });

}());
