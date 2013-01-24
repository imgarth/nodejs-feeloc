var app = app || {};

$(function () {
    'use strict';

    // Url 控制器

    var UrlController = Backbone.Collection.extend({
        url: '/url',

        // 控制器与实体绑定
        model: app.Url,

        create: function () {
            $.ajax({
                url: '/url',
                data: {url: $('#url').val().trim()},
                type: 'POST',
                success: function (result) {
                    if (result.error != undefined) {
                        $('#url-res').html('该域名已经存在').show();
                    } else {
                        window.location.href = '/' + result.url;
                    }
                }
            });
        }

    });

    //全局变量
    app.urlController = new UrlController();
}());
