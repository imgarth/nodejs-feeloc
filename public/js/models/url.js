var app = app || {};

(function() {
	'use strict';

	//Url 实体
	app.Url = Backbone.Model.extend({
        urlRoot:'',

		// 实体模型
		defaults: {
			url: '',
            post_date:''
		}

	});
}());
