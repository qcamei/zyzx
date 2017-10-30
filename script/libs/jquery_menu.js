(function ($) {
    $.fn.extend({
        "menu":function (options) {
            var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数
            var windows=this;//全局对象
            return this.each(function () {  //这里的this 就是 jQuery对象。这里return 为了支持链式调用
                $(".menuNow").remove();
                $("<div class='menuNow'><ul></ul></div>").attr("id",opts.id).css({
                    "width":"126px",
                    "box-sizing": "border-box",
                    "padding": "2px 0",
                    "border": "1px solid #ccc",
                    "box-shadow": "0 0 15px rgba(0,0,0,0.25)",
                    "background": "#fff",
                    "position": "absolute",
                    "cursor": "default",
                    "z-index":opts.zIndex
                }).appendTo(opts.who);
                $.each(opts.list,function (i,value) {
                    $("<li><a></a></li>").attr("class",opts.className[i])
                        .css({
                            "list-style": "none",
                            "padding-left": "25px",
                            "line-height": "30px",
                            "height": "30px",
                            "border-bottom": "1px solid #f0f0f0",
                            "background": "#fff",
                            "color": "#3c3c3c",
                            "opacity": "1",
                            "cursor": "pointer"
                        }).hover(function () {
                        if(!$(this).hasClass("banMenu")){
                            $(this).css({"background":"#8ce6da","color":"#fff"})
                        }
                    },function () {
                        if(!$(this).hasClass("banMenu")){
                            $(this).css({"background":"#fff","color":"#3c3c3c"})
                        }
                    }).find("a").text(value).end().appendTo("#"+opts.id+" ul");

                });
                $("#"+opts.id+" ul li.banMenu").css({//特殊禁用
                    "background": "#f1f1f1",
                    "opacity": "0.6",
                    "cursor": "default"
                });
                $("#"+opts.id+" ul li.deleteMenu").css("display","none");//特殊删除

                //调出菜单
                menuDiv("#"+opts.id,opts.classNood,opts.ePageX,opts.ePageY);

            });
        }
    });
    //默认参数
    var defaluts = {
        list:[],//菜单名
        className:[],//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
        background:"",//选中背景色
        foreground:"",//没选中背景色为空
        id:"",//菜单id
        classNood:"",//带有滚动条的元素类名，菜单出现时禁止滚动
        who:"",//菜单在标签中的位置
        ePageX:"",
        ePageY:"",
        zIndex:""
    };
    //菜单定位函数
    function menuDiv(id,name,ePageX,ePageY) {
        var clentX=Number(ePageX);
        var clentY=Number(ePageY);
        var w= $("body").outerWidth(); //网页可视 宽度
        var h = $("body").outerHeight(); //网页可视 高度
        if(w-clentX<$(id).outerWidth()){
            clentX=clentX-$(id).outerWidth();
        }
        if(h-clentY<$(id).outerHeight()){
            clentY=clentY-$(id).outerHeight();
        }
        $(id).offset({left:clentX,top:clentY});
        $(document).one("click",function () {
            $(id).remove();
            $(name).get(0).onwheel=function () {
                return true;
            }
        }).one("mousedown",function (e) {
            if(e.button==2){
                $(id).remove();
                $(name).get(0).onwheel=function () {
                    return true;
                }
            }
        });
        window.onblur=function () {
            $(id).remove();
            $(name).get(0).onwheel=function () {
                return true;
            }
        };
        $(name).get(0).onwheel=function () {
            return false;//禁止鼠标滚动
        };
    }
})(jQuery);


