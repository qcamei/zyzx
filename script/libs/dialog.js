define(["jquery"],function ($) {
    
    var backDialogIn=function (options) {
        var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数
        $(".backDialog").remove();
        $("<div class='backDialog'><div class='backDialog-body'><div class='backDialog-center'>" +
            "<div class='backDialog-title'><span></span><a class='backDialog-close'><img src=''></a></div>" +
            "<div class='backDialog-text'><div class='backDialog-text-center'></div></div>" +
            "<div class='backDialog-bottom'><a class='backDialog-cancel'>取消</a><a class='backDialog-sure'>确认</a></div>"+
            "</div></div></div>").css({
            "position":"absolute",
            "left":"0",
            "top":"0",
            "right":"0",
            "bottom":"0",
            "z-index":"100",
            "background":opts.background
        }).find(".backDialog-body").css({"width":opts.width,"margin":opts.marginTop+" auto","margin-bottom":"0"})
            .end().find(".backDialog-center").css({
            "background":"#fff",
            "border":"1px solid #999",
            "border-radius":"4px",
            "box-shadow":"0 1px 8px rgba(0,0,0,0.6)"
        }).end().find(".backDialog-title").css({
            "border-radius":"4px 4px 0 0",
            "height":"40px",
            "background":opts.titleBackground
        }).find("span").text(opts.title).css({
            "line-height":"40px",
            "font-size":"14px",
            "color":"#fff",
            "padding":"0 10px"

        }).end().find("a").css({
            "width":"30px",
            "float":"right",
            "height":"30px",
            "line-height":"30px",
            "text-align":"center",
            "border-top-right-radius":'4px'
        }).hover(function () {
            $(this).css({
                "background":options.SureCloseBack
            })
        },function () {
            $(this).css({
                "background":"transparent"
            })
        }).on("click",function () {
            $(".backDialog").remove();
        }).find("img").attr("src",opts.sureClose)
            .end().end().end().find(".backDialog-text").css({
            "max-height":"200px",
            "overflow":"auto"

        })
            .find(".backDialog-text-center").css("padding","45px 10px 56px 40px").html(opts.h3Text)
            .end().end().find(".backDialog-bottom").css({"height":"40px","background":opts.bottomBack})
            .find("a").css({
            "float":"right",
            "margin-right":"15px",
            "padding":"5px 30px",
            "border":"1px solid "+opts.borderBack,
            "line-height":"14px",
            "margin-top":'8px',
            "background":"#fff",
            "color":"#3c3c3c",
            "border-radius":"3px",
            "cursor":"default"
        }).hover(function () {
            $(this).css({
                "background":options.aBackground,
                "color":"#fff"
            })
        },function () {
            $(this).css({
                "background":"#fff",
                "color":"#3c3c3c"
            })
        }).end().find("a.backDialog-cancel").on("click",function () {
            $(".backDialog").remove();
        }).addClass(opts.cancel).end().find("a.cancelNo").css("display","none").end().end().appendTo(opts.who);

    };
    var backDialogOut=function () {
        $(".backDialog").remove();
    };
    //默认参数
    var defaluts = {
        width:"",//宽度
        marginTop:"",//
        background:"",//背景色
        titleBackground:"",//标题栏背景色为空
        sureClose:"",//关闭的图片路径
        SureCloseBack:"",
        h3Text:"",//文本
        who:"",//菜单在标签中的位置
        bottomBack:"",
        borderBack:"",
        aBackground:"",
        cancel:"",
        title:""
    };
    return {
        "backDialogIn":backDialogIn,
        "backDialogOut":backDialogOut
    }
});

