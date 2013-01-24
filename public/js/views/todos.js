var app = app || {};

$(function () {
    'use strict';

    /**
     * Todo View
     * @type {*}
     */
    app.TodoView = Backbone.View.extend({

        //事件绑定在li dom结构上
        tagName: 'li',

        // 缓存模板
        template: _.template($('#item-template').html()),

        // 事件绑定
        events: {
            'click .toggle': 'togglecompleted', //点击已经完成
            'dblclick label': 'edit',   //双击变编辑状态
            'click .destroy': 'clear',  //删除已经完成项目
            'keypress .edit': 'updateOnEnter',  //监控键盘事件
            'blur .edit': 'close'
        },

        //初使化
        initialize: function () {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
            this.model.on('visible', this.toggleVisible, this);
        },

        // 渲染页面
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('completed', this.model.get('completed'));

            this.toggleVisible();
            this.input = this.$('.edit');
            this.$url = $('#domain');
            return this;
        },

        //根据isHidden()的返回值，控制显隐
        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        // 根据点击的URL，查找Model中是否有符合要求的数据
        isHidden: function () {
            var isCompleted = this.model.get('completed');
            return (
                (!isCompleted && app.TodoFilter === 'completed')
                    || (isCompleted && app.TodoFilter === 'active')
                );
        },

        // 调用Model的toggle方法，使Model的completed状态变成相反情况
        togglecompleted: function () {
            this.model.toggle();
        },

        // 双击显示编辑框
        edit: function () {
            this.$el.addClass('editing');
            this.input.focus();
        },

        //  点击回车被调用的方法，更新Model中的title
        close: function () {
            var value = this.input.val().trim();
            var url = this.$url.val().trim();

            if (value) {
                this.model.save({ title: value, url: {name: url} });
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        },

        // 判断键盘事件，如果是回国就调用close方法
        updateOnEnter: function (e) {
            if (e.which === ENTER_KEY) {
                this.close();
            }
        },

        // 删除模型中的对应元素
        clear: function () {
            this.model.destroy();
            $.ajax({
                url: '/todo/' + this.model.toJSON()._id + '/delete',
                type: 'DELETE'
            });
        }
    });
});
