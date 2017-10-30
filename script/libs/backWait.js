define(["jquery"],function ($) {
    var k;
    var backWaitIn=function (options) {
        $(".backWait").remove();
        $("<div class='backWait'></div>").css({
            "position":"absolute",
            "left":"0",
            "top":"0",
            "right":"0",
            "bottom":"0",
            "z-index":"100",
            "background":"transparent"
        }).appendTo(options.homeEle);
        k=setTimeout(function () {
            $(".backWait").remove();
            $("<div class='backWait'><img></div>").css({
                "position":"absolute",
                "left":"0",
                "top":"0",
                "right":"0",
                "bottom":"0",
                "z-index":"100",
                "background":options.background
            }).find("img").attr("src",options.imgSrc).css({
                "position":"absolute",
                "left":"50%",
                "top":"50%",
                "transform":"translate(-50%,-50%)"
            }).end().appendTo(options.homeEle);
        },1000);
    };
    var backWaitOut=function () {
        clearTimeout(k);
        $(".backWait").remove();
    };
    return {
        "backWaitIn":backWaitIn,
        "backWaitOut":backWaitOut
    }
});
