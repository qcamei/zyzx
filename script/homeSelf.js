define(["app","uclient","head","jquery"],function (app,uclient,head,$) {
    
    //主页单独资源事件
    app.controller('homeSelfController', function ($scope,$rootScope) {
        //频道选择框
        $(".channelContain").on("focus",function () {
            $(".channel").css("outline","#28b992 auto 5px");
            $(".allChannel").css("display","block");
        });
        $(".channelContain").on("focusout",function () {
            $(".channel").css("outline","none");
            $(".allChannel").css("display","none");
            $(".allChannel li").removeClass("liEnter").removeAttr("style");
        });
        $(".channel").on("click",function (e) {
//                        e.stopPropagation();
            e.preventDefault();
            if($(".allChannel").css("display")==="block"){
                $(".channel").css("outline","none");
                $(".allChannel").css("display","none");
                $(".allChannel li").removeClass("liEnter").removeAttr("style");
            }else{
                $(".channel").css("outline","#28b992 auto 5px");
                $(".allChannel").css("display","block");
            }
        });
        $rootScope.resource(0);


        //分享点击
        $(".myShare,.lookShare").on("click",function () {
            $(".mainCenter .center-body #errorBack").remove();
            $(this).addClass("resourceClick").siblings().removeClass("resourceClick");
            $(".resource li.resourceClick").addClass("resourceOpacity").removeClass("resourceClick");
        });
        //我的分享
        var myinfo=["位图","动画","视频","字幕模型","虚拟模型","大屏幕模型"];
        $(".myShare").on("click",function () {
            $(".fileWay .firstFile").remove();
            $(".center-resource li").remove();
            $("<div class='firstFile'><a></a><i></i></div>").find("a").text("我的分享").end().appendTo(".fileWay");
            $(".firstFile").eq(0).prepend("<div class='firstFileImg'></div>");
            $.each(myinfo,function (i,value) {
                $("<li class='fileDiv'></li>").append("<div class='file-head'></div>")
                    .append("<div class='file-center'> <img src='../../images/share1_03.png'></div>")
                    .append("<div class='file-sub'></div>")
                    .append("<div class='file-foot'><span></span></div>")
                    .appendTo(".center-resource");
                $(".center-resource li").eq(i).attr({"title":myinfo[i]}).find(".file-foot span").text(myinfo[i]);
            });
            $(".center-resource li").off("mousedown").on("mousedown",function(e){
                e.stopPropagation();
                if(e.button ==0){//你点了左键
                    $(this).addClass("liClick").siblings().removeClass("liClick");
                }else if(e.button ==2){//你点了右键
                    e.preventDefault();
                }
            });
            $(".mainCenter .center-body").off("mousedown").on("mousedown",function(e){
                e.stopPropagation();
                if(e.button ==0){//你点了左键

                }else if(e.button ==2){//你点了右键
                    e.preventDefault();
                }
            });
        });
        var pwnd,lock=true;
        //查看分享
        $(".lookShare").on("click",function () {
            $(".fileWay .firstFile").remove();
            $("<div class='firstFile'><a></a><i></i></div>").find("a").text("查看分享").end().appendTo(".fileWay");
            $(".firstFile").eq(0).prepend("<div class='firstFileImg'></div>");
            $(".center-resource li").remove();
            uclient.getBucketList(false,function(seqNo,icode,stringError,info) {
                if(icode>=0){
                    //加分享频道
                    console.log(info);
                    $("<li class='liShareLook'>" +
                        "<div class='ShareLookTitle'>" +
                        "<div class='ShareLookTitle-one'><span></span></div>" +
                        "<div class='ShareLookTitle-tow'><span>查看分享</span></div>" +
                        "<div class='ShareLookTitle-three'><span></span></div>" +
                        "</div>" +
                        "<ul class='ShareLookList'></ul></li>").appendTo(".center-resource");
                    $.each(info.item,function (i,value) {
                        $("<li class='fileDiv'></li>").append("<div class='file-head'></div>")
                            .append("<div class='file-center'> <img src='../../images/panshare1_03.png'></div>")
                            .append("<div class='file-sub'></div>")
                            .append("<div class='file-foot'><span></span></div>")
                            .appendTo(".center-resource .liShareLook ul");
                        $(".center-resource .liShareLook ul li").eq(i).attr({"data-root-id":info.item[i].vf_id,"title":info.item[i].vf_name}).find(".file-foot span").text(info.item[i].vf_name);
                    });
                    //单击
                    $(".center-resource .liShareLook ul li").off("mousedown").on("mousedown",function(e){
                        e.stopPropagation();
                        if(e.button ==0){//你点了左键
                            $(this).addClass("liClick").siblings().removeClass("liClick");
                            $(".center-resource .liShareLook .ShareLookTitle").removeClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook2 .ShareLookTitle2").removeClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook2 ul li").each(function () {
                                $(this).removeClass("liClick");
                            });
                        }else if(e.button ==2){//你点了右键
                            e.preventDefault();
                        }
                    });
                    $(".center-resource .liShareLook .ShareLookTitle").off("mousedown").on("mousedown",function(e){
                        e.stopPropagation();
                        if(e.button ==0){//你点了左键
                            $(this).addClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook ul li").each(function () {
                                $(this).addClass("liClick")
                            });
                            $(".center-resource .liShareLook2 .ShareLookTitle2").removeClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook2 ul li").each(function () {
                                $(this).removeClass("liClick");
                            });
                        }else if(e.button ==2){//你点了右键
                            e.preventDefault();
                        }
                    }).off("dblclick").on("dblclick",function () {
                        if($(this).next(".ShareLookList").css("display")==="none"){
                            $(this).next(".ShareLookList").slideDown(400);
                            $(this).find(".ShareLookTitle-one span").css("transform","rotate(45deg)");
                        }else{
                            $(this).next(".ShareLookList").slideUp(400);
                            $(this).find(".ShareLookTitle-one span").css("transform","rotate(0deg)")
                        }
                    }).find(".ShareLookTitle-one span").off("mousedown").on("mousedown",function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if(e.button ==0){//你点了左键
                            if($(this).parents(".ShareLookTitle").next(".ShareLookList").css("display")==="none"){
                                $(this).parents(".ShareLookTitle").next(".ShareLookList").slideDown(400);
                                $(this).css("transform","rotate(45deg)")
                            }else{
                                $(this).parents(".ShareLookTitle").next(".ShareLookList").slideUp(400);
                                $(this).css("transform","rotate(0deg)")
                            }
                        }else if(e.button ==2){//你点了右键
                            e.preventDefault();
                        }
                    });

                    //双击
                    $(".center-resource .liShareLook ul li").off("dblclick").on("dblclick",function(e){
                        e.stopPropagation();
                        $(this).addClass("liClick").siblings().removeClass("liClick");
                        $(".center-resource .liShareLook .ShareLookTitle").removeClass("ShareLookTitleClick");
                        var dataRoot=Number($(this).attr("data-root-id"));
                        var channelName=$(this).find(".file-foot span").text();
                        var indexId=$(this).index();
                        var dataobject={
                            "dataRootId":dataRoot,
                            "channelName":channelName,
                            "indexId":indexId,
                            "className":"backBlue"
                        };
                        var data=$.param(dataobject);
                        if(lock==true){
                            uwnd.showPopup("U-Cloud/templates/mainPopup/channel.html?"+data
                                ,{width:800,height:550},
                                function(info){
                                    pwnd=JSON.parse(info).id;
                                    lock=false;
                                },function (info) {
                                    lock=true;
                                });
                        }
                        if(lock==false){
                            uwnd.sendNotify(pwnd,{"dataRootId":dataRoot,"channelName":channelName,"indexId":indexId,"className":"backBlue"});
                        }
                    });

                }else{

                }
            });
            //
            uclient.getBucketList(false,function(seqNo,icode,stringError,info) {

                if(icode>=0){
                    //加频道
                    // console.log(info);
                    $("<li class='liShareLook2'>" +
                        "<div class='ShareLookTitle2'>" +
                        "<div class='ShareLookTitle2-one'><span></span></div>" +
                        "<div class='ShareLookTitle2-tow'><span>多频浏览</span></div>" +
                        "<div class='ShareLookTitle2-three'><span></span></div>" +
                        "</div>" +
                        "<ul class='ShareLookList2'></ul></li>").appendTo(".center-resource");
                    $.each(info.item,function (i,value) {
                        $("<li class='fileDiv'></li>").append("<div class='file-head'></div>")
                            .append("<div class='file-center'> <img src='../../images/pindao_03.png'></div>")
                            .append("<div class='file-sub'></div>")
                            .append("<div class='file-foot'><span></span></div>")
                            .appendTo(".center-resource .liShareLook2 ul");
                        $(".center-resource .liShareLook2 ul li").eq(i).attr({"data-root-id":info.item[i].vf_id,"title":info.item[i].vf_name}).find(".file-foot span").text(info.item[i].vf_name);
                    });
                    //单击
                    $(".center-resource .liShareLook2 ul li").off("mousedown").on("mousedown",function(e){
                        e.stopPropagation();
                        if(e.button ==0){//你点了左键
                            $(this).addClass("liClick").siblings().removeClass("liClick");
                            $(".center-resource .liShareLook2 .ShareLookTitle2").removeClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook .ShareLookTitle").removeClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook ul li").each(function () {
                                $(this).removeClass("liClick");
                            });
                        }else if(e.button ==2){//你点了右键
                            e.preventDefault();
                        }
                    });
                    $(".center-resource .liShareLook2 .ShareLookTitle2").off("mousedown").on("mousedown",function(e){
                        e.stopPropagation();
                        if(e.button ==0){//你点了左键
                            $(this).addClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook2 ul li").each(function () {
                                $(this).addClass("liClick")
                            });
                            $(".center-resource .liShareLook .ShareLookTitle").removeClass("ShareLookTitleClick");
                            $(".center-resource .liShareLook ul li").each(function () {
                                $(this).removeClass("liClick");
                            });


                        }else if(e.button ==2){//你点了右键
                            e.preventDefault();
                        }
                    }).off("dblclick").on("dblclick",function () {
                        if($(this).next(".ShareLookList2").css("display")==="none"){
                            $(this).next(".ShareLookList2").slideDown(400);
                            $(this).find(".ShareLookTitle2-one span").css("transform","rotate(45deg)");
                        }else{
                            $(this).next(".ShareLookList2").slideUp(400);
                            $(this).find(".ShareLookTitle2-one span").css("transform","rotate(0deg)")
                        }
                    }).find(".ShareLookTitle2-one span").off("mousedown").on("mousedown",function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if(e.button ==0){//你点了左键
                            if($(this).parents(".ShareLookTitle2").next(".ShareLookList2").css("display")==="none"){
                                $(this).parents(".ShareLookTitle2").next(".ShareLookList2").slideDown(400);
                                $(this).css("transform","rotate(45deg)")
                            }else{
                                $(this).parents(".ShareLookTitle2").next(".ShareLookList2").slideUp(400);
                                $(this).css("transform","rotate(0deg)")
                            }
                        }else if(e.button ==2){//你点了右键
                            e.preventDefault();
                        }
                    });
                    //双击
                    $(".center-resource .liShareLook2 ul li").on("dblclick",function(e){
                        e.stopPropagation();
                        var dataRoot=Number($(this).attr("data-root-id"));
                        var channelName=$(this).find(".file-foot span").text();
                        var indexId=$(this).index();
                        var dataobject={
                            "dataRootId":dataRoot,
                            "channelName":channelName,
                            "indexId":indexId,
                            "className":"backRed"
                        };
                        var data=$.param(dataobject);
                        if(lock==true){
                            uwnd.showPopup("U-Cloud/templates/mainPopup/channel.html?"+data
                                ,{width:800,height:550},
                                function OnCreate(info){
                                    pwnd=JSON.parse(info).id;
                                    lock=false;
                                },function OnClose(info) {
                                    lock=true;
                                });
                        }
                        if(lock==false){
                            uwnd.sendNotify(pwnd,{"dataRootId":dataRoot,"channelName":channelName,"indexId":indexId,"className":"backRed"});
                        }
                    });

                }else{
                    // uwnd.showDialog("/mainPopup/errorModel.html", {width:400,height:350} ,function(){});
                }
            });
            //空白
            $(".mainCenter .center-body").off("mousedown").on("mousedown",function(e){
                e.stopPropagation();
                if(e.button ==0){//你点了左键
                    $(".center-resource .liShareLook .ShareLookTitle,.center-resource .liShareLook2 .ShareLookTitle2").removeClass("ShareLookTitleClick");
                    $(".center-resource .liShareLook ul li").each(function () {
                        $(this).removeClass("liClick");
                    });
                    $(".center-resource .liShareLook2 ul li").each(function () {
                        $(this).removeClass("liClick");
                    });
                }else if(e.button ==2){//你点了右键
                    e.preventDefault();
                }
            });
        });
        //我的频道
        // $(".moreChannel").on("click",function () {
        //
        // });
        //解锁
        // if(typeof(uwnd)!="undefined"){
        //     uwnd.setNotifyCallback(function (data) {
        //         var dataObject=JSON.parse(data);
        //         lock=dataObject.lock;
        //     });
        // }

    });
});
