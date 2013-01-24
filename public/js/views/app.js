var app = app || {};

$(function () {
    'use strict';

    /**
     * Application View
     * @type {*}
     */
    app.AppView = Backbone.View.extend({

        // 绑定到todoapp DOM
        el: '#todoapp',

        // 缓存状态模板
        statsTemplate: _.template($('#stats-template').html()),

        // 事件绑定
        events: {
            'keypress #new-todo': 'createOnEnter',  //绑定键盘事件
            'click #clear-completed': 'clearCompleted', //删除已经完成的
            'click #toggle-all': 'toggleAllComplete'    //全部完成事件
        },

        // 初使化
        initialize: function () {
            this.input = this.$('#new-todo');
            this.allCheckbox = this.$('#toggle-all')[0];
            this.$footer = this.$('#footer');
            this.$main = this.$('#main');
            this.$addLink = $('#add-link');
            this.$url = $('#domain');

            window.app.Todos.on('add', this.addOne, this);
            window.app.Todos.on('reset', this.addAll, this);
            window.app.Todos.on('change:completed', this.filterOne, this);
            window.app.Todos.on("filter", this.filterAll, this);

            window.app.Todos.on('all', this.render, this);

            this.showDialog();
            var url = this.$url.val().trim();
            app.Todos.fetch({data: {url: url}});
            setInterval(function(){app.Todos.fetch({data: {url: url}})},5000);
        },

        // 渲染页面
        render: function () {
            var completed = app.Todos.completed().length;   //已经完成的数目
            var remaining = app.Todos.remaining().length;   //没有完成的数目

            if (app.Todos.length) {
                this.$main.show();
                this.$footer.show();

                this.$footer.html(this.statsTemplate({
                    completed: completed,
                    remaining: remaining
                }));

                this.$('#filters li a')
                    .removeClass('selected')
                    .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
                    .addClass('selected');
            } else {
                this.$main.hide();
                this.$footer.hide();
            }

            this.allCheckbox.checked = !remaining;
        },

        // 弹窗
        showDialog: function () {
            this.$addLink.css({'top': 10, 'left': window.outerWidth - 100}).show().click(function () {
                $('#jcontent').jdialog({
                    'title': '新增TODO，只支持英文',
                    'content': 'jcontent',
                    'width': 450,
                    'ondisplay': function () {
                        var $url = $('#url');
                        var $urlError = $('#url-error');
                        var $urlSubmit = $('#url-submit');
                        $url.click(function () {
                            $(this).next().hide();
                        });
                        $urlSubmit.click(function () {
                            var url = $.trim($url.val());
                            if ('' == url) {
                                $urlError.html('请填写URL！').show();
                            } else {
                                app.urlController.create();
                            }
                        });
                    }
                });
            });
        },

        // 根据增加的model，new一个TodoView对象，并插入到todo-list中
        addOne: function (todo) {
            var view = new app.TodoView({ model: todo });
            $('#todo-list').prepend(view.render().el);
        },

        // 刷新整个视图
        addAll: function () {
            this.$('#todo-list').html('');
            app.Todos.each(this.addOne, this);
        },

        //条件刷新
        filterOne: function (todo) {
            todo.trigger("visible");
        },

        filterAll: function () {
            app.Todos.each(this.filterOne, this);
        },

        // 新生成一个Todo
        newAttributes: function () {
            return {
                title: this.input.val().trim(),
                completed: false,
                url: {name: this.$url.val().trim()}
            };
        },

        // 回车提交
        createOnEnter: function (e) {
            if (e.which !== ENTER_KEY || !this.input.val().trim()) {
                return;
            }

            app.Todos.create(this.newAttributes());
            this.input.val('');
        },

        // 删除所有已完成的todo
        clearCompleted: function () {
            var completeString = '';
            _.each(app.Todos.completed(), function (todo) {
                completeString += todo.toJSON()._id;
                todo.destroy();
                $.ajax({
                    url: '/todo/' + todo.toJSON()._id + '/delete',
                    type: 'DELETE'
                });
            });

            return false;
        },

        // 全部完成事件
        // 在这儿为了证明nodejs的非阻塞，循环提交
        toggleAllComplete: function () {
            var completed = this.allCheckbox.checked;

            app.Todos.each(function (todo) {
                todo.save({
                    'completed': completed
                });
            });
        }
    });
});
