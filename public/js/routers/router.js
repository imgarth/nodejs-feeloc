var app = app || {};

(function() {
	'use strict';

    /**
     * TODO Router
     * @type {*}
     */
	var Workspace = Backbone.Router.extend({
		routes:{
			'*filter': 'setFilter'
		},

		setFilter: function( param ) {
			// 过滤条件
			window.app.TodoFilter = param.trim() || '';

            // 过滤
			window.app.Todos.trigger('filter');
		}
	});

	app.TodoRouter = new Workspace();
	Backbone.history.start();

}());
