define(["app","jquery","uclient","dotEvent"],function (app,$,uclient,dotEvent) {
    app.controller('headController', function ($scope,$rootScope,$http) {

        uclient.restoreLogin(true,true);
        //字体的动态添加
        $http({
            method:"get",
            url:"../../json/"+localStorage.language+"/main.json"
        })
            .success(function(data){

            //头部
            var i=0;
            for(var x in data.tool){
                i++;
                $scope["tool"+i]=data.tool[x];
            }
            //资源
            var j=0;
            for(var x in data.resource){
                j++;
                $scope["resource"+j]=data.resource[x];
            }
            //系统工具
            var k=0;
            for(var x in data.system){
                k++;
                $scope["system"+k]=data.system[x];
            }
            //功能大全
            var l=0;
            for(var x in data.power){
                l++;
                $scope["power"+l]=data.power[x];
            }
//                    console.log($scope.tool1)

            //最小化
            $("#mostSmall").on("click",function (e) {
                e.stopPropagation();
                uwnd.minmize();
            });
            //最大化
            $("#mostBig").on("click",function (e) {
                e.stopPropagation();
               
                uwnd.changeState();
            });
            //回复最大化
            $("#mainTop").on('dblclick',function(){
                
                uwnd.changeState();
            });
            //关闭
            $("#close").on("click",function () {
                uwnd.showDialog("U-Cloud/templates/mainPopup/userMessage.html?close", {width:330,height:200},function(info){},function(info){
                    if(info==="close"){
                        uclient.userLoginout(function (seqNo,icode,stringError,info) {

                        });
                        setTimeout(function () {
                            uwnd.close("close");
                        },1000);
                    }
                });
            });
            //设置
            $("#setUp").on("click",function () {
                uwnd.showDialog("U-Cloud/templates/mainPopup/mainSet.html", {width:645,height:470},function(info){},function(info){});
            });
            //头像
            $(".head-img").on("click",function () {
                uwnd.showDialog("U-Cloud/templates/mainPopup/personImg.html", {width:540,height:410},function(info){},function(info){});
            });
            //拖动
            $("#mainTop").on("mousedown",function () {
                
                return uwnd.drag();
            });
            //阻止事件冒泡
            $(".user-head,.tool-list").on("mousedown",function (e) {
                e.stopPropagation();
            });
            $(".user-head,.tool-list").on('dblclick',function(e){
                e.stopPropagation();
            });
            //用户信息
            $("#userMessage").off("click").on("click",function () {
                uwnd.showDialog("U-Cloud/templates/mainPopup/userMessage.html?cancel", {width:330,height:200},function(info){},function(info){
                    if(info==="Cancellation"){
                        uclient.userLoginout(function (seqNo,icode,stringError,info) {

                        });
                        setTimeout(function () {
                            uwnd.close("Cancellation");
                        },1000)
                    }
                });
            });
            //禁止选中
            document.onselectstart=new Function("event.returnValue=false;");
            document.oncontextmenu = function(e){
                e.preventDefault();
            };
            var lock=true;
            //页面的切换
            $(".tool-list").on("click",function () {
                var index=$(this).index();
                if(index!=2){
                    $(this).addClass("tool-list-active").siblings().removeClass("tool-list-active");
                }
                if(index==0){
                    $("#mainResource").css("display","flex");
                    $(".tool,.power").css("display","none");
                }else if(index==1){
                    $(".tool").css("display","flex");
                    $("#mainResource,.power").css("display","none");
                }else if(index==2){
                    //弹出公有云页面
                    if(lock==true){
                        uwnd.showPopup("U-CGModels/index.html?cloud",{width:850,height:600,min_width:850,min_height:600},
                            function(info){
                                lock=false;
                            },
                            function(info){
                                lock=true;
                            });
                    }
                }else if(index==3){
                    $(".power").css("display","flex");
                    $("#mainResource,.tool").css("display","none");
                }
            });
            //获取用户名
            $("#userMessage span").text(uclient.currUser());
            //获取ip地址
            $(".loginIp").text(uclient.currServerIP());

            //站点名称
            $(".userMessage .head-title span").eq(0).text("--"+uclient.getSiteName());
            //连接类型
            $(".userMessage .head-title span").eq(1).text("("+uclient.getConnectType()+")");

            //根据类型定义一个全局变量
                $rootScope.rootType=uclient.getConnectType();
                

        }).error(function () {
//                        uwnd.showDialog("/mainPopup/errorModel.html", {width:400,height:350} ,function(){});
        });

        //站点切换
        // var site1=location.search.split("?")[1];
        // if(typeof site1!="undefined"){
        //     console.log(encodeURI(site1));
        //     $(".userMessage .head-title").removeAttr("ng-bind");
        //     $(".userMessage .head-title").html(encodeURI(site1));
        // }

        //监听主程序是否掉线
        //连接通知
        dotEvent.add_handler("online","/",function (cmd,uri,params,replybody) {
            // console.log(cmd+replybody);
            $(".offlineBack").remove();
            $("#mainTop #toolBar #close").removeClass("offClose");
        });
        //断开连接
        dotEvent.add_handler("offline","/",function (cmd,uri,params,replybody) {
            // console.log(cmd+replybody);
            var lineK,timeK=5;
            $(".offlineBack").remove();
            $("<div class='offlineBack'>" +
                "<div class='offlineBack-btn'>" +
                "<a>连接已断开...</a><button>重试<i></i></button><span>重试登陆失败!</span></div></div>")
                .find("button").off("click").on("click",function (e) {
                e.stopPropagation();
                $(this).attr("disabled","disabled").find("i").text("("+timeK+"s"+")");
                clearTimeout(lineK);
                lineK=setInterval(function () {
                    timeK--;
                    $(".offlineBack-btn button").find("i").text("("+timeK+"s"+")");
                    if(timeK==0){
                        clearInterval(lineK);
                        $(".offlineBack-btn button").removeAttr("disabled").find("i").text("");
                        timeK=5;
                    }
                },1000);
                $(".offlineBack-btn span").text("");
                uclient.retryLogin(function (seqNo,icode,stringError,info) {
                    if(icode>=0){
                        $(".offlineBack").remove();
                        $("#mainTop #toolBar #close").removeClass("offClose");
                    }else{
                        $(".offlineBack-btn span").text("重试登陆失败!")
                    }
                })
            }).end().appendTo("#main");
            $("#mainTop #toolBar #close").addClass("offClose");
            //拖动
            $(".offlineBack").on("mousedown",function () {
                return uwnd.drag();
            });
            //阻止事件冒泡
            $(".offlineBack-btn").on("mousedown",function (e) {
                e.stopPropagation();
            });
        });

        $(document).on("keyup",function (e) {
            if(e.ctrlKey==1&&e.keyCode==68){
                uwnd.showDevTool()
            }
        })

    });
});
