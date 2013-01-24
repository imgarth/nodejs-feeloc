/**
 * 弹出框
 * @param {Object} $
 *
 *
 * author: feeloc http://feeloc.cn
 *
 */
;(function($,exports) {
	$.fn.extend({
		jdialog : function(args) {
			//默认配置
			var defaults = {
				title : '标题信息', //标题
				content : 'jcontent', //窗口内容ID
				width : 400,	//窗口宽度
				ondisplay : null,	//窗口渲染完成时执行的函数
				onabort : null		//点击关闭时执行的函数
			};
			var opts = $.extend({}, defaults, args), 
			wHeight = $(window).height(), //窗口高度
			wWidth = $(window).width(), //窗口宽度
			$content;

			/**
			 * 确定位置
			 * @param {Object} $e
			 */
			function position($e) {
				$e.css({
					left : wWidth / 2 - $e.width() / 2,
					top : wHeight / 2 - $e.height() / 2 + $(document).scrollTop()
				});
			};

			// 增加一个更新位置的接口
			var jdialogPosition = {
				position : function($e){
					position($e);
				}
			}
			$.extend(exports,jdialogPosition);
			exports['jdialogPosition'] = jdialogPosition;

			/**
			 *关闭窗体
			 */
			function close(e) {
				$('.w-win').fadeOut(300);
				//绑定点击关闭时执行的函数
				if(typeof opts['onabort'] == 'function'){
					if(opts['onabort'].call(e.data) != false){
						
					}
				};
				setTimeout(function() {
					$('.w-win').remove();
					$('.pop-over').remove();
					$('body').append($content);
				}, 300);
			};

			/**
			 * 拖拽
			 * @param {Object} $title
			 * @param {Object} $dialog
			 */
			function drag($title, $dialog) {
				var _move = false, //移动标记
				_x, _y, //鼠标离控件左上角的相对位置
				newz = 1, //新对象的z-index
				oldz = 1;	//旧对象的z-index

				$title.mousedown(function(e) {
					_move = true;
					newz = parseInt($dialog.css("z-index"));
					$title.css({
						"cursor" : "move"
					});
					$dialog.css({
						"z-index" : newz + oldz
					});
					//t = $this;//初始化当前激活层的对象
					_x = e.pageX - parseInt($dialog.css("left"));
					//获得左边位置
					_y = e.pageY - parseInt($dialog.css("top"));
					//获得上边位置
					$dialog.fadeTo(50, 0.5);
					//点击后开始拖动并透明显示
				});
				
				$title.mousemove(function(e) {
					if (_move) {
						var x = e.pageX - _x;
						//移动时根据鼠标位置计算控件左上角的绝对位置
						var y = e.pageY - _y;
						$dialog.css({
							top : y,
							left : x
						});
						//控件新位置
					}
				});
				
				$title.mouseup(function(e) {
					_move = false;
					$dialog.fadeTo("fast", 1);
					//松开鼠标后停止移动并恢复成不透明
					oldz = parseInt($dialog.css("z-index"));
					//获得最后激活层的z-index
					$title.css({
						"cursor" : "default"
					});
				});
			};

			this.each(function(i) {
				$content = $('#' + opts.content);
				var $popOver = $('<div class="pop-over"></div>'), 
					$dialog = $('<div class="w-win"> ' + '<div class="zbar"> ' + '<div class="zttl"> ' + opts.title + '</div> ' + '</div> ' + '<div class="zcnt">' + '<div class="auto-content"> ' + $content.html() + '</div> ' + '</div> ' + '<span title="关闭窗体" id="w-win-close" class="zcls">×</span> ' + '</div>'), 
					$body = $('body');

				$body.append($dialog).append($popOver);
				$popOver.css('height', wHeight);
				$dialog.css('width', opts.width + 10);
				position($dialog);
				
				var $close = $('#w-win-close'), 
					$title = $('.zbar');
				$close.bind('click', $dialog, close);
				drag($title, $dialog);
				$content.remove();
				
				//绑定渲染完成时执行的函数
				if(typeof opts['ondisplay'] == 'function'){
					if(opts['ondisplay'].call($dialog) != false){
						
					}
				}
			});
		}
	})
})(jQuery,window);
