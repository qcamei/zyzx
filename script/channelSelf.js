define(["app","jquery","dotEvent","uclient"],function (app,$,dotEvent,uclient) {
    
    //频道单独资源事件
    app.controller('channelController', function ($scope,$rootScope) {
        $(".tabBtn,.tabBtnBoxAdd").on("dblclick",function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $("#close").off("click");

        //接收
        var channel=[];
        var dataObject;
        //第一次传参
        var loca=location.search;
        var spl=loca.split("?")[1].split("&");
        console.log(spl)
        dataObject={};
        dataObject[spl[0].split("=")[0]]=spl[0].split("=")[1];
        dataObject[spl[1].split("=")[0]]=spl[1].split("=")[1];
        dataObject[spl[2].split("=")[0]]=spl[2].split("=")[1];
        dataObject[spl[3].split("=")[0]]=spl[3].split("=")[1];
        // console.log(dataObject);

        channel.push({"a":dataObject.channelName,"b":dataObject.className});
        $(".tabBtn li").eq(0).attr("class","").addClass("tabSelect").addClass(dataObject.className).find("span").text(dataObject.channelName);
        $rootScope.resource(dataObject.indexId);
        tabClick();

        //之后传参
        uwnd.setNotifyCallback(function (data) {
            // enterOtherTab(data);
            dataObject=JSON.parse(data);
            var equal=true;
            $.each(channel,function (i,value) {
                if(dataObject.channelName===value.a&&dataObject.className===value.b){
                    equal=false;
                    $(".tabBtn li span").each(function () {
                        if(dataObject.channelName===$(this).text()&&($(this).parents("li").hasClass(dataObject.className))){
                            $(this).parents("li").triggerHandler("click");
                        }
                    })
                }
            });
            if(equal==true){
                // var $h1=$(".tabBtnFlex").width();
                // var $h2=$(".tabBtn").width();
                // var $h3=$(".tabBtn li").width();
                // console.log($h1-$h2)
                // console.log($h3);
                var $h4=$(".tabBtn li").length;
                if($h4<7){
                    channel.push({"a":dataObject.channelName,"b":dataObject.className});
                    $(".tabBtn li").eq(0).clone().attr("class","").addClass("tabSelect").addClass(dataObject.className)
                        .find("span").text(dataObject.channelName).end().appendTo(".tabBtn").siblings().removeClass("tabSelect");
                    $(".channelTab").eq(0).clone().css("display","flex").appendTo("#mainResource").siblings().css("display","none");
                    // console.log(dataObject.indexId);
                    $rootScope.resource(dataObject.indexId);

                    tabClick();
                }else{

                }


            }
        });
        //之后传参加载tab
        function enterOtherTab() {

        }

        function tabClick() {
            $(".tabBtn li").off("click");
            $(".tabBtn li i").off("click");
            $(".tabBtn li").on("click",function (e) {
                e.stopPropagation();
                var index=$(this).index();
                $(this).addClass("tabSelect").siblings().removeClass("tabSelect");
                $(".channelTab").eq(index).css("display","flex").siblings().css("display","none");
                
            });
            $(".tabBtn li i").on("click",function (e) {
                e.stopPropagation();
                var $this=$(this);
                if($(".tabBtn li").length!=1){
                    var tabli=$(this).parents("li").index();
                    if($(this).parents("li").hasClass("tabSelect")){
                        if(tabli!=0){
                            $(".tabBtn li").eq(tabli-1).triggerHandler("click");
                        }else{
                            $(".tabBtn li").eq(tabli+1).triggerHandler("click");
                        }
                    }

                    $.each(channel,function (i,value) {
                        if($this.prev("span").text()===value.a&&($this.parents("li").hasClass(value.b))){
                            channel.splice(i,1);
                            return false;
                        }
                    });

                    $(this).parents("li").remove();
                    $(".channelTab").eq(tabli).remove();
                 
                }else{
                    uwnd.close("true");
                }
                
                
            })
        }


        $("#close").on("click",function () {
            uwnd.close("true");
        });

        //加号菜单事件

        $(".tabBtnBoxAdd").on("click",function (e) {
            e.stopPropagation();
            if($(".tabBtnBoxMenuAll").css("display")==="none"){
                $(".tabBtnBoxMenuAll").css("display","block");
                $(this).addClass("tabBtnBoxAddHover")
            }else{
                $(".tabBtnBoxMenuAll").css("display","none");
                $(this).removeClass("tabBtnBoxAddHover")
            }
            $(".tabBtnBoxMenu1 li").remove();
            $(".tabBtnBoxMenu2 li").remove();
            //加分享频道
            uclient.getBucketList(false,function(seqNo,icode,stringError,info) {
                if(icode>=0){
                    // console.log(info);
                    $.each(info.item,function (i,value) {
                        $("<li ><span></span></li>").attr({"data-root-id":info.item[i].vf_id})
                            .find("span").text(info.item[i].vf_name)
                            .end().appendTo(".tabBtnBoxMenu1");
                    });
                    $(".tabBtnBoxMenu1 li").on("mousedown",function(e){
                        e.stopPropagation();
                        if(e.button ==0){//你点了左键
                            e.stopPropagation();
                            var dataRoot=Number($(this).attr("data-root-id"));
                            var channelName=$(this).find("span").text();
                            var indexId=$(this).index();
                            var dataobjectMenu={
                                "dataRootId":dataRoot,
                                "channelName":channelName,
                                "indexId":indexId,
                                "className":"backBlue"
                            };
                            var equal=true;
                            $.each(channel,function (i,value) {
                                if(dataobjectMenu.channelName===value.a&&dataobjectMenu.className===value.b){
                                    equal=false;
                                    $(".tabBtn li span").each(function () {
                                        if(dataobjectMenu.channelName===$(this).text()&&($(this).parents("li").hasClass(dataobjectMenu.className))){
                                            $(this).parents("li").triggerHandler("click");
                                        }
                                    })
                                }
                            });
                            if(equal==true){
                                // var $h1=$(".tabBtnFlex").width();
                                // var $h2=$(".tabBtn").width();
                                // var $h3=$(".tabBtn li").width();
                                // console.log($h1-$h2)
                                // console.log($h3)
                                var $h4=$(".tabBtn li").length;
                                if($h4<7){
                                    channel.push({"a":dataobjectMenu.channelName,"b":dataobjectMenu.className});
                                    $(".tabBtn li").eq(0).clone().attr("class","").addClass("tabSelect").addClass(dataobjectMenu.className)
                                        .find("span").text(dataobjectMenu.channelName).end().appendTo(".tabBtn").siblings().removeClass("tabSelect");
                                    $(".channelTab").eq(0).clone().css("display","flex").appendTo("#mainResource").siblings().css("display","none");
                                    // console.log(dataObject.indexId);
                                    $rootScope.resource(dataobjectMenu.indexId);

                                    tabClick();
                                }else{

                                }


                            }
                        }
                    }).on("click",function (e) {
                        e.stopPropagation();
                    });
                }else{
                    // uwnd.showDialog("/mainPopup/errorModel.html", {width:400,height:350} ,function(){});
                }
            });
            //我的频道
            uclient.getBucketList(false,function(seqNo,icode,stringError,info) {
                if(icode>=0){
                    // console.log(info);
                    $.each(info.item,function (i,value) {
                        $("<li ><span></span></li>").attr({"data-root-id":info.item[i].vf_id})
                            .find("span").text(info.item[i].vf_name)
                            .end().appendTo(".tabBtnBoxMenu2");
                    });
                    $(".tabBtnBoxMenu2 li").on("mousedown",function(e){
                        e.stopPropagation();
                        if(e.button ==0){//你点了左键
                            e.stopPropagation();
                            var dataRoot=Number($(this).attr("data-root-id"));
                            var channelName=$(this).find("span").text();
                            var indexId=$(this).index();
                            var dataobjectMenu={
                                "dataRootId":dataRoot,
                                "channelName":channelName,
                                "indexId":indexId,
                                "className":"backRed"
                            };
                            var equal=true;
                            $.each(channel,function (i,value) {
                                if(dataobjectMenu.channelName===value.a&&dataobjectMenu.className===value.b){
                                    equal=false;
                                    $(".tabBtn li span").each(function () {
                                        if(dataobjectMenu.channelName===$(this).text()&&($(this).parents("li").hasClass(dataobjectMenu.className))){
                                            $(this).parents("li").triggerHandler("click");
                                        }
                                    })
                                }
                            });
                            if(equal==true){
                                // var $h1=$(".tabBtnFlex").width();
                                // var $h2=$(".tabBtn").width();
                                // var $h3=$(".tabBtn li").width();
                                // console.log($h1-$h2)
                                // console.log($h3)
                                var $h4=$(".tabBtn li").length;
                                if($h4<7){
                                    channel.push({"a":dataobjectMenu.channelName,"b":dataobjectMenu.className});
                                    $(".tabBtn li").eq(0).clone().attr("class","").addClass("tabSelect").addClass(dataobjectMenu.className)
                                        .find("span").text(dataobjectMenu.channelName).end().appendTo(".tabBtn").siblings().removeClass("tabSelect");
                                    $(".channelTab").eq(0).clone().css("display","flex").appendTo("#mainResource").siblings().css("display","none");
                                    // console.log(dataObject.indexId);
                                    $rootScope.resource(dataobjectMenu.indexId);

                                    tabClick();
                                }else{

                                }
                            }
                        }
                    }).on("click",function (e) {
                        e.stopPropagation();
                    });
                }else{
                    // uwnd.showDialog("/mainPopup/errorModel.html", {width:400,height:350} ,function(){});
                }
            });



        });
        $(".tabBtnBoxAdd").on("blur",function () {
            $(".tabBtnBoxMenuAll").css("display","none");
            $(".tabBtnBoxAdd").removeClass("tabBtnBoxAddHover")
        });






        //监听程序是否掉线
        //连接通知
        dotEvent.add_handler("online","/",function (cmd,uri,params,replybody) {
//                console.log(cmd+replybody);
            $(".offlineBack").remove();
            $("#mainTop #toolBar #close").removeClass("offClose");
        });
        //断开连接
        dotEvent.add_handler("offline","/",function (cmd,uri,params,replybody) {
//                console.log(cmd+replybody);
            $(".offlineBack").remove();
            $("<div class='offlineBack'><div class='offlineBack-btn'><a title='返回主页点击重试'>连接已断开...</a></div></div>")
                .appendTo("#main");
            $("#mainTop #toolBar #close").addClass("offClose");
        });


       
    });
});

