define(["app","jquery","head","uclient","jquery_menu","backWait","dialog","time"],function (app,$,head,uclient,jqueryMenu,backWait,dialog,time) {
    
    //系统工具
    app.controller('systemToolController', function ($scope,$rootScope,$state) {
        var state="userManage";
        $(".toolBtn ul li").on("click",function () {
            $(this).addClass("toolBtnActive").siblings().removeClass("toolBtnActive");
            state=$(this).find("a").attr("ui-sref")
        });
        $("#systemManage").on("click",function () {
            $state.go(state);
        });
    });
    //用户管理
    app.controller('userManageController', function ($scope,$rootScope) {
        $scope.resource=function () {
            //获取所有用户列表
            function getInstance() {
                $(".localBottom-right-error").remove();
                backWait.backWaitIn({
                    "homeEle":".toolCenter-body",
                    "imgSrc":"../../images/loadingImg.gif",
                    "background":"rgba(255,255,255,1)"
                });
                uclient.getAllUser(function (seqNo,iCode,error,replyBody) {
                    backWait.backWaitOut();
                    if(iCode>=0){
                        console.log(replyBody);
                        $(".tool-fileBtn li").remove();
                        $(".addBtn").remove();
                        $("<div class='addBtn'><button></button></div>").appendTo(".localBottom-right-top-center");
                        addPack();//加号绑定事件
                        $.each(replyBody.user_list,function (i,value) {
                            $("<li><div class='tool-fileBtn-top'>"+
                                "<div class='tool-fileBtn-img'><img></div>"+
                                "<div class='tool-fileBtn-text'><h3></h3></div></div>").find(".tool-fileBtn-img img")
                                .attr("src","../../images/biao.png")
                                .end().find(".tool-fileBtn-top").attr("data-id",value.user_id)
                                .end().find(".tool-fileBtn-text h3").text(value.user_name)
                                .end().attr("data-ban",value.user_status).addClass(function () {
                                if(value.user_status==0){
                                    return ""
                                }else{
                                    return "banUser"
                                }
                            }).attr("data-power",value.user_power).appendTo(".example-home .tool-fileBtn");
                            keyClick();
                        })
                    }else{
                        $(".tool-fileBtn li").remove();
                        $(".addBtn").remove();
                        $("<div class='localBottom-right-error'><img src='../../images/error.png'></div>")
                            .appendTo(".example-home");
                    }
                });
            }
            getInstance();
            //菜单
            function keyClick() {
                $(".tool-fileBtn li").off("mousedown").on("mousedown",function(e){
                    e.preventDefault();
                    if(e.button ==0){//你点了左键

                    }else if(e.button ==2){//你点了右键
                        e.stopPropagation();
                        var userMenu;
                        var userNow=$(this).find(".tool-fileBtn-text h3").text();
                        if(userNow===uclient.currUser()){
                            userMenu=["modify deleteMenu","delete deleteMenu","banThis deleteMenu","openThis deleteMenu","look"]
                        }else if(userNow==="admin"){
                            userMenu=["modify deleteMenu","delete deleteMenu","banThis deleteMenu","openThis deleteMenu","look"]
                        }else{
                            if($(this).attr("data-ban")==="0"){
                                userMenu=["modify","delete","banThis ","openThis deleteMenu","look"]
                            }else{
                                userMenu=["modify","delete","banThis deleteMenu","openThis","look"]
                            }

                        }
                        $(this).menu({
                            list:["修改","删除","禁用","激活","查看信息"],//菜单名
                            className:userMenu,//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
                            background:"#8ce6da",//选中背景色
                            foreground:"",//没选中背景色为空
                            id:"userMenu",//菜单id
                            classNood:".localBottom-right-top-center",//带有滚动条的元素类名，菜单出现时禁止滚动
                            who:".localBottom-right-top-center",//菜单在标签中的位置
                            ePageX:e.pageX,
                            ePageY:e.pageY,
                            zIndex:""
                        });
                        var pkgZip=$(this).find(".tool-fileBtn-text h3").text();
                        var severIp=$(this).find(".tool-fileBtn-top").attr("data-id");
                        var umysql=$(this).attr("data-power");
                        menuClick(pkgZip,severIp,umysql);
                    }
                });
            }
            //菜单事件
            function menuClick(pkgZip,severIp,umysql) {
                $("#userMenu ul li").off("click mousedown").on("click",function (e) {
                    e.stopPropagation();
                    if($(this).hasClass("delete")){//删除
                        dialog.backDialogIn({
                            width:"350px",//宽度
                            marginTop:"250px",//
                            background:"rgba(0,0,0,0.2)",//背景色
                            titleBackground:"#25bc91",//标题栏背景色为空
                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                            SureCloseBack:"red",
                            h3Text:"<h3>是否删除该用户？</h3>",//文本
                            who:"#main",//菜单在标签中的位置
                            bottomBack:"rgba(140,230,218,0.1)",
                            borderBack:"rgba(140,230,218,0.8)",
                            aBackground:"#25bc91",
                            cancel:"",
                            title:"删除用户"
                        });
                        $(".backDialog-sure").off("click").one("click",function () {
                            dialog.backDialogOut();
                            backWait.backWaitIn({
                                "homeEle":"#main",
                                "imgSrc":"../../images/loadingImg.gif",
                                "background":"rgba(0,0,0,0.1)"
                            });
                            uclient.delUser(severIp,function (seqNo,icode,error,replyBody) {
                                backWait.backWaitOut();
                                if(icode>=0){
                                    console.log(replyBody);
                                    getInstance();
                                }else{
                                    console.log(error);
                                    dialog.backDialogIn({
                                        width:"350px",//宽度
                                        marginTop:"250px",//
                                        background:"rgba(0,0,0,0.2)",//背景色
                                        titleBackground:"#25bc91",//标题栏背景色为空
                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                        SureCloseBack:"red",
                                        h3Text:"删除用户失败",//文本
                                        who:"#main",//菜单在标签中的位置
                                        bottomBack:"rgba(140,230,218,0.1)",
                                        borderBack:"rgba(140,230,218,0.8)",
                                        aBackground:"#25bc91",
                                        cancel:"cancelNo",
                                        title:"删除用户"
                                    });
                                    $(".backDialog-sure").off("click").one("click",function () {
                                        dialog.backDialogOut();
                                    });
                                }

                            })
                        });
                    }

                    if($(this).hasClass("modify")) {//修改
                        $(".localback").css("display","block").find(".language span").text("修改用户")
                            .end().find(".examplePopup-form .form-list> a").addClass("changeUserPos")
                            .text("初始化用户密码");
                        $(".examplePopup-center-tow").css("display","none");
                        $(".examplePopup-center-one").css("display","block");
                        $(".examplePopup-form .oneName >input").val(pkgZip).attr("readonly","readonly");
                        $(".judgeMessage1").text("");
                        $(".creatMessage-form ul li").each(function () {
                            var nowHas=umysql&Number($(this).find("label input").attr("data-bite"));
                            if(nowHas!=0){
                                $(this).find("label input").prop("checked",true);
                            }else{
                                $(this).find("label input").prop("checked",false);
                            }
                        });
                        labelClick();
                        ConfigType("modify",pkgZip,severIp,umysql);
                    }
                    if($(this).hasClass("look")) {//查看
                        $(".localback").css("display","block").find(".language span").text("用户信息");
                        var quanxian="";
                        $(".creatMessage-form ul li").each(function () {
                            var nowHas=umysql&Number($(this).find("label input").attr("data-bite"));
                            if(nowHas!=0){
                                quanxian=quanxian+" "+$(this).find("span").text();
                            }
                        });
                        $(".examplePopup-center-one").css("display","none");
                        $(".examplePopup-center-tow").css("display","block").find("p").eq(0).find("span").text(pkgZip)
                            .end().end().eq(1).find("span").text(quanxian);
                        ConfigType("look",pkgZip,severIp,umysql);
                    }
                    if($(this).hasClass("banThis")) {//查看
                        dialog.backDialogIn({
                            width:"350px",//宽度
                            marginTop:"250px",//
                            background:"rgba(0,0,0,0.2)",//背景色
                            titleBackground:"#25bc91",//标题栏背景色为空
                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                            SureCloseBack:"red",
                            h3Text:"<h3>是否禁用该用户？</h3>",//文本
                            who:"#main",//菜单在标签中的位置
                            bottomBack:"rgba(140,230,218,0.1)",
                            borderBack:"rgba(140,230,218,0.8)",
                            aBackground:"#25bc91",
                            cancel:"",
                            title:"禁用用户"
                        });
                        $(".backDialog-sure").off("click").one("click",function () {
                            dialog.backDialogOut();
                            backWait.backWaitIn({
                                "homeEle":"#main",
                                "imgSrc":"../../images/loadingImg.gif",
                                "background":"rgba(0,0,0,0.1)"
                            });
                            uclient.banUser(severIp,true,function (seqNo,icode,error,replyBody) {
                                backWait.backWaitOut();
                                if(icode>=0){
                                    console.log(replyBody);
                                    getInstance();
                                }else{
                                    console.log(error);
                                    dialog.backDialogIn({
                                        width:"350px",//宽度
                                        marginTop:"250px",//
                                        background:"rgba(0,0,0,0.2)",//背景色
                                        titleBackground:"#25bc91",//标题栏背景色为空
                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                        SureCloseBack:"red",
                                        h3Text:"禁用用户失败"+error,//文本
                                        who:"#main",//菜单在标签中的位置
                                        bottomBack:"rgba(140,230,218,0.1)",
                                        borderBack:"rgba(140,230,218,0.8)",
                                        aBackground:"#25bc91",
                                        cancel:"cancelNo",
                                        title:"禁用用户"
                                    });
                                    $(".backDialog-sure").off("click").one("click",function () {
                                        dialog.backDialogOut();
                                    });
                                }

                            })
                        });
                    }
                    if($(this).hasClass("openThis")) {//查看
                        backWait.backWaitIn({
                            "homeEle":"#main",
                            "imgSrc":"../../images/loadingImg.gif",
                            "background":"rgba(0,0,0,0.1)"
                        });
                        uclient.banUser(severIp,false,function (seqNo,icode,error,replyBody) {
                            backWait.backWaitOut();
                            if(icode>=0){
                                console.log(replyBody);
                                getInstance();
                            }else{
                                console.log(error);
                                dialog.backDialogIn({
                                    width:"350px",//宽度
                                    marginTop:"250px",//
                                    background:"rgba(0,0,0,0.2)",//背景色
                                    titleBackground:"#25bc91",//标题栏背景色为空
                                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                    SureCloseBack:"red",
                                    h3Text:"激活用户失败"+error,//文本
                                    who:"#main",//菜单在标签中的位置
                                    bottomBack:"rgba(140,230,218,0.1)",
                                    borderBack:"rgba(140,230,218,0.8)",
                                    aBackground:"#25bc91",
                                    cancel:"cancelNo",
                                    title:"激活用户"
                                });
                                $(".backDialog-sure").off("click").one("click",function () {
                                    dialog.backDialogOut();
                                });
                            }

                        })
                    }
                    $("#userMenu").remove();
                });
            }
            //加号
            function addPack() {
                $(".addBtn").on("click",function () {
                    $(".localback").css("display","block").find(".language span").text("添加用户")
                        .end().find(".examplePopup-form .form-list> a").removeClass("changeUserPos")
                        .text("初始密码为'666666'");
                    $(".examplePopup-form .oneName >input").removeAttr("readonly").val("");
                    $(".examplePopup-form .towName >input").val("");
                    $(".judgeMessage1").text("");
                    $(".creatMessage-form ul li").each(function () {
                        if($(this).find("label input").prop("checked")==true){
                            $(this).find("label input").prop("checked",false);
                        }
                    });
                    $(".examplePopup-center-one").css("display","block");
                    $(".examplePopup-center-tow").css("display","none");
                    ConfigType("creat","","","");
                });
            }
            function ConfigType(selectType,pkgZip,severIp,umysql) {
                if(selectType==="creat"){//新建用户
                    $(".examplePopup-sure").off("click").on("click",function () {
                        var newUserName=$(".examplePopup-form .oneName >input").val();
                        if(newUserName===""){
                            $(".judgeMessage1").text("用户名不能为空");
                        }else{
                            var UserNameHas=false;
                            $(".example-home .tool-fileBtn li").each(function () {
                                if($(this).find(".tool-fileBtn-text h3").text()===newUserName){
                                    UserNameHas=true;
                                }
                            });
                            if(UserNameHas==true){
                                $(".judgeMessage1").text("用户名已存在");
                            }else{
                                var nPower=0x0;
                                $(".creatMessage-form ul li").each(function () {
                                    if($(this).find("label input").prop("checked")==true){
                                        nPower=nPower|parseInt($(this).find("label input").attr("data-bite"));
                                    }
                                });
                                backWait.backWaitIn({
                                    "homeEle":".examplePopup",
                                    "imgSrc":"../../images/loadingImg.gif",
                                    "background":"rgba(0,0,0,0.1)"
                                });
                                uclient.createUser(newUserName,nPower,function (seqNo,iCode,error,replyBody) {
                                    backWait.backWaitOut();
                                    if(iCode>=0){
                                        console.log(replyBody);
                                        $(".localback").css("display","none");
                                        getInstance();
                                        createLogNow("添加用户:"+newUserName)
                                    }else{
                                        console.log(error);
                                        errorTotip("添加失败"+error)
                                    }
                                })
                            }
                        }
                    })
                }
                if(selectType==="modify"){//修改用户
                    $(".examplePopup-sure").off("click").on("click",function () {
                        var nPower=0x0;
                        $(".creatMessage-form ul li").each(function () {
                            if($(this).find("label input").prop("checked")==true){
                                nPower=nPower|parseInt($(this).find("label input").attr("data-bite"));
                            }
                        });
                        $(".localback").css("display","none");
                        backWait.backWaitIn({
                            "homeEle":".examplePopup",
                            "imgSrc":"../../images/loadingImg.gif",
                            "background":"rgba(0,0,0,0.1)"
                        });
                        uclient.modifyUser(severIp,nPower,function (seqNo,iCode,error,replyBody) {
                            backWait.backWaitOut();
                            if(iCode>=0){
                                console.log(replyBody);
                                $(".localback").css("display","none");
                                getInstance();
                                createLogNow("修改用户:"+pkgZip)
                            }else{
                                console.log(error);
                                errorTotip("修改失败"+error)
                            }
                        });
                    })
                }
                if(selectType==="look"){//查看用户
                    $(".examplePopup-sure").off("click").on("click",function () {
                        $(".localback").css("display","none");
                        $(".examplePopup-center-one").css("display","block");
                        $(".examplePopup-center-tow").css("display","none");
                    })
                }
            }
            $(".creatMessage-form ul li label").off("click").on("click",function () {//勾选权限
                labelClick();
            });
            function labelClick() {
                var valSystem="";
                $(".creatMessage-form ul li").each(function () {
                    if($(this).find("label input").prop("checked")==true){
                        valSystem=valSystem+$(this).find("label span").text()+","
                    }
                });
                $(".examplePopup-form .towName >input").val(valSystem)
            }
            $(".examplePopup-form .oneName >input").on("keyup",function () {
                $(".judgeMessage1").text("");
            });
            $(".examplePopup-form .form-list> a").on("click",function () {//初始化密码
                if($(this).hasClass("changeUserPos")){

                }
            });
            //关闭
            $("#close,.examplePopup-cancel").on("click", function () {
                $(".localback").css("display","none");
                $(".judgeMessage1,.judgeMessage2").text("");
                $(".examplePopup-back").remove();
                $(".creatUserDeafult").css("display","none").text("");
                backWait.backWaitOut();
            });
            //创建日志
            function createLogNow(type) {
                //uclient.createLog(type,function (seqNo,iCode,error,replyBody) {
               // })
            }
            //错误提示函数
            var errorTime;
            function errorTotip(text) {
                clearTimeout(errorTime);
                $(".creatUserDeafult").css("display","inline-block").text(text);
                errorTime=setTimeout(function () {
                    $(".creatUserDeafult").css("display","none").text("");
                },3000);
            }
        };
        if(uclient.isCanMngUser()){
            $scope.resource();
        }else{
            $(".localBottom-right-error").remove();
            $("<div class='localBottom-right-error'><img src='../../images/noWay.png'></div>")
                .appendTo(".example-home");
        }

    });
    //频道管理
    app.controller('channelManageController', function ($scope,$rootScope) {
        $scope.resource=function () {
            //获取所有频道列表
            function getInstance() {
                $(".localBottom-right-error").remove();
                backWait.backWaitIn({
                    "homeEle":".toolCenter-body",
                    "imgSrc":"../../images/loadingImg.gif",
                    "background":"rgba(255,255,255,1)"
                });
                uclient.getChannelList(true,function (seqNo,iCode,error,replyBody) {
                    backWait.backWaitOut();
                    if(iCode>=0){
                        console.log(replyBody);
                        $(".tool-fileBtn li").remove();
                        $(".addBtn").remove();
                        $("<div class='addBtn'><button></button></div>").appendTo(".localBottom-right-top-center");
                        addPack();//加号绑定事件
                        $.each(replyBody.channel_list,function (i,value) {
                            $("<li><div class='tool-fileBtn-top'>"+
                                "<div class='tool-fileBtn-img'><img></div>"+
                                "<div class='tool-fileBtn-text'><h3></h3></div></div>").find(".tool-fileBtn-img img")
                                .attr("src","../../images/biao.png")
                                .end().find(".tool-fileBtn-top").attr("data-list",JSON.stringify(value.user_list))
                                .end().find(".tool-fileBtn-text h3").text(value.channel_name)
                                .end().find(".tool-fileBtn-text").attr("data-time",value.beginplaytime)
                                .end().attr("data-ban",value.channel_status).addClass(function () {
                                if(value.channel_status==0){
                                    return ""
                                }else{
                                    return "banUser"
                                }
                            }).attr("data-id",value.folder_id).attr("data-channel",value.channel_id).appendTo(".example-channel .tool-fileBtn");
                            keyClick();
                        })
                    }else{
                        $(".tool-fileBtn li").remove();
                        $(".addBtn").remove();
                        $("<div class='localBottom-right-error'><img src='../../images/error.png'></div>")
                            .appendTo(".example-channel");
                    }
                });
            }
            getInstance();
            //菜单
            function keyClick() {
                $(".tool-fileBtn li").off("mousedown").on("mousedown",function(e){
                    e.preventDefault();
                    if(e.button ==0){//你点了左键

                    }else if(e.button ==2){//你点了右键
                        e.stopPropagation();
                        var channelMenu;
                        var userNow=$(this).find(".tool-fileBtn-text h3").text();
                        if(userNow==="default_channel"){
                            channelMenu=["modify deleteMenu","delete deleteMenu","banThis deleteMenu","openThis deleteMenu","look"]
                        }else{
                            if($(this).attr("data-ban")==="0"){
                                channelMenu=["modify","delete","banThis","openThis deleteMenu","look"]
                            }else{
                                channelMenu=["modify","delete","banThis deleteMenu","openThis","look"]
                            }
                        }
                        $(this).menu({
                            list:["修改","删除","禁用","激活","查看信息"],//菜单名
                            className:channelMenu,//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
                            background:"#8ce6da",//选中背景色
                            foreground:"",//没选中背景色为空
                            id:"userMenu",//菜单id
                            classNood:".localBottom-right-top-center",//带有滚动条的元素类名，菜单出现时禁止滚动
                            who:".localBottom-right-top-center",//菜单在标签中的位置
                            ePageX:e.pageX,
                            ePageY:e.pageY
                        });
                        var pkgZip=$(this).find(".tool-fileBtn-text h3").text();
                        var severIp=$(this).find(".tool-fileBtn-top").attr("data-list");
                        var typeTime=$(this).find(".tool-fileBtn-text").attr("data-time");
                        var umysql=$(this).attr("data-channel");
                        menuClick(pkgZip,severIp,typeTime,umysql);
                    }
                });
            }
            //菜单事件
            function menuClick(pkgZip,severIp,typeTime,umysql) {
                $("#userMenu ul li").off("click mousedown").on("click",function (e) {
                    e.stopPropagation();
                    if($(this).hasClass("delete")){
                        dialog.backDialogIn({
                            width:"350px",//宽度
                            marginTop:"250px",//
                            background:"rgba(0,0,0,0.2)",//背景色
                            titleBackground:"#25bc91",//标题栏背景色为空
                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                            SureCloseBack:"red",
                            h3Text:"是否删除该频道？",//文本
                            who:"#main",//菜单在标签中的位置
                            bottomBack:"rgba(140,230,218,0.1)",
                            borderBack:"rgba(140,230,218,0.8)",
                            aBackground:"rgba(140,230,218,0.1)",
                            cancel:""
                        });
                        $(".backDialog-sure").off("click").one("click",function () {
                            dialog.backDialogOut();
                            backWait.backWaitIn({
                                "homeEle":"#main",
                                "imgSrc":"../../images/loadingImg.gif",
                                "background":"rgba(0,0,0,0.1)"
                            });
                            uclient.deleteChannel(umysql,function (seqNo,icode,error,replyBody) {
                                backWait.backWaitOut();
                                if(icode>=0){
                                    console.log(replyBody);
                                    getInstance();
                                }else{
                                    console.log(error);
                                    dialog.backDialogIn({
                                        width:"350px",//宽度
                                        marginTop:"250px",//
                                        background:"rgba(0,0,0,0.2)",//背景色
                                        titleBackground:"#25bc91",//标题栏背景色为空
                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                        SureCloseBack:"red",
                                        h3Text:"删除频道失败",//文本
                                        who:"#main",//菜单在标签中的位置
                                        bottomBack:"rgba(140,230,218,0.1)",
                                        borderBack:"rgba(140,230,218,0.8)",
                                        aBackground:"rgba(140,230,218,0.1)",
                                        cancel:"cancelNo"
                                    });
                                    $(".backDialog-sure").off("click").one("click",function () {
                                        dialog.backDialogOut();
                                    });
                                }

                            })
                        });
                    }

                    if($(this).hasClass("modify")) {
                        $(".localback").css("display","block").find(".language span").text("修改频道");
                        $(".examplePopup-center-tow").css("display","none");
                        $(".examplePopup-center-one").css("display","block");
                        $(".examplePopup-form .oneName >input").val(pkgZip).attr("readonly","readonly");
                        $(".examplePopup-form .towName input").each(function (index) {
                            if(index==0){
                                $(this).val(function(){
                                    if(Math.floor(typeTime/3600)<10){
                                        return "0"+Math.floor(typeTime/3600)
                                    }else{
                                        return Math.floor(typeTime/3600)
                                    }
                                })
                            }
                            if(index==1){
                                $(this).val(function(){
                                    if(Math.floor((typeTime%3600)/60)<10){
                                        return "0"+Math.floor((typeTime%3600)/60)
                                    }else{
                                        return Math.floor((typeTime%3600)/60)
                                    }
                                })
                            }
                            if(index==2){
                                $(this).val(function(){
                                    if((typeTime%3600)%60<10){
                                        return "0"+(typeTime%3600)%60
                                    }else{
                                        return (typeTime%3600)%60
                                    }
                                })
                            }
                        });
                        $(".judgeMessage1").text("");
                        ConfigType("modify",pkgZip,severIp,typeTime,umysql);
                    }
                    if($(this).hasClass("look")){
                        $(".localback").css("display","block").find(".language span").text("频道信息");
                        var quanxian="";
                        var nPower=JSON.parse(severIp);
                        $.each(nPower,function (i,value) {
                            // console.log(value.user_id);
                            quanxian = quanxian + " " + value.user_name;
                            // if(value.user_status==0) {//只添加激活的用户
                            //
                            // }
                        });
                        $(".examplePopup-center-one").css("display","none");
                        $(".examplePopup-center-tow").css("display","block").find("p").eq(0).find("span").text(pkgZip)
                            .end().end().eq(1).find("span").text(time.time(typeTime))
                            .end().end().eq(2).find("span").text(quanxian);

                        ConfigType("modify",pkgZip,severIp,typeTime,umysql);
                    }
                    if($(this).hasClass("banThis")) {//查看
                        dialog.backDialogIn({
                            width:"350px",//宽度
                            marginTop:"250px",//
                            background:"rgba(0,0,0,0.2)",//背景色
                            titleBackground:"#25bc91",//标题栏背景色为空
                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                            SureCloseBack:"red",
                            h3Text:"<h3>是否禁用该频道？</h3>",//文本
                            who:"#main",//菜单在标签中的位置
                            bottomBack:"rgba(140,230,218,0.1)",
                            borderBack:"rgba(140,230,218,0.8)",
                            aBackground:"#25bc91",
                            cancel:"",
                            title:"禁用频道"
                        });
                        $(".backDialog-sure").off("click").one("click",function () {
                            dialog.backDialogOut();
                            backWait.backWaitIn({
                                "homeEle":"#main",
                                "imgSrc":"../../images/loadingImg.gif",
                                "background":"rgba(0,0,0,0.1)"
                            });
                            uclient.banChannel(severIp,true,function (seqNo,icode,error,replyBody) {
                                backWait.backWaitOut();
                                if(icode>=0){
                                    console.log(replyBody);
                                    getInstance();
                                }else{
                                    console.log(error);
                                    dialog.backDialogIn({
                                        width:"350px",//宽度
                                        marginTop:"250px",//
                                        background:"rgba(0,0,0,0.2)",//背景色
                                        titleBackground:"#25bc91",//标题栏背景色为空
                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                        SureCloseBack:"red",
                                        h3Text:"禁用频道失败"+error,//文本
                                        who:"#main",//菜单在标签中的位置
                                        bottomBack:"rgba(140,230,218,0.1)",
                                        borderBack:"rgba(140,230,218,0.8)",
                                        aBackground:"#25bc91",
                                        cancel:"cancelNo",
                                        title:"禁用频道"
                                    });
                                    $(".backDialog-sure").off("click").one("click",function () {
                                        dialog.backDialogOut();
                                    });
                                }

                            })
                        });
                    }
                    if($(this).hasClass("openThis")) {//查看
                        backWait.backWaitIn({
                            "homeEle":"#main",
                            "imgSrc":"../../images/loadingImg.gif",
                            "background":"rgba(0,0,0,0.1)"
                        });
                        uclient.banChannel(severIp,false,function (seqNo,icode,error,replyBody) {
                            backWait.backWaitOut();
                            if(icode>=0){
                                console.log(replyBody);
                                getInstance();
                            }else{
                                console.log(error);
                                dialog.backDialogIn({
                                    width:"350px",//宽度
                                    marginTop:"250px",//
                                    background:"rgba(0,0,0,0.2)",//背景色
                                    titleBackground:"#25bc91",//标题栏背景色为空
                                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                    SureCloseBack:"red",
                                    h3Text:"激活频道失败"+error,//文本
                                    who:"#main",//菜单在标签中的位置
                                    bottomBack:"rgba(140,230,218,0.1)",
                                    borderBack:"rgba(140,230,218,0.8)",
                                    aBackground:"#25bc91",
                                    cancel:"cancelNo",
                                    title:"激活频道"
                                });
                                $(".backDialog-sure").off("click").one("click",function () {
                                    dialog.backDialogOut();
                                });
                            }

                        })
                    }

                    $("#userMenu").remove();
                });
            }
            //加号
            function addPack() {
                $(".addBtn").on("click",function () {
                    $(".localback").css("display","block").find(".language span").text("新建频道");
                    $(".examplePopup-form .oneName >input").removeAttr("readonly").val("");
                    $(".examplePopup-form .towName input").val("00");
                    $(".judgeMessage1").text("");
                    $(".examplePopup-center-one").css("display","block");
                    $(".examplePopup-center-tow").css("display","none");
                    ConfigType("creat","","","","");
                });
            }
            function ConfigType(selectType,pkgZip,severIp,typeTime,umysql) {
                //所有用户
                uclient.getAllUser(function (seqNo,iCode,error,replyBody) {
                    if(iCode>=0){
                        $(".creatMessage-form ul li").remove();
                        $(".creatMessage-form .channelUserDeafult").remove();
                        $.each(replyBody.user_list,function (i,value) {
                            $("<li><label><input type='checkbox'><span></span></label>")
                                .find("input").attr("data-id",value.user_id).attr("disabled",function () {
                                if(value.user_status==0){//只添加激活的用户
                                    return false
                                }else{
                                    return "disabled"
                                }
                            }).end().find("span").text(value.user_name).end().appendTo(".creatMessage-form ul");
                        });
                        if(selectType==="creat"){
                            $(".creatMessage-form ul li").each(function () {
                                if($(this).find("label input").prop("checked")==true){
                                    $(this).find("label input").prop("checked",false);
                                }
                            });
                        }
                        if(selectType==="modify"){
                            var nPower=JSON.parse(severIp);
                            $.each(nPower,function (i,value) {
                                // console.log(value.user_id);
                                $(".creatMessage-form ul li").each(function () {
                                    if(Number($(this).find("label input").attr("data-id"))===value.user_id){
                                        // console.log($(this).find("label input").attr("data-id"));
                                        $(this).find("label input").prop("checked",true);
                                    }
                                });
                            });
                        }
                    }else{
                        $(".creatMessage-form ul li").remove();
                        $(".creatMessage-form").append("<div class='channelUserDeafult'><span>当前用户加载失败</span></div>");
                    }
                });
                if(selectType==="creat"){//新建频道
                    $(".examplePopup-sure").off("click").on("click",function () {
                        var newUserName=$(".examplePopup-form .oneName >input").val();
                        if(newUserName===""){
                            $(".judgeMessage1").text("频道名不能为空");
                        }else{
                            var UserNameHas=false;
                            $(".example-home .tool-fileBtn li").each(function () {
                                if($(this).find(".tool-fileBtn-text h3").text()===newUserName){
                                    UserNameHas=true;
                                }
                            });
                            if(UserNameHas==true){
                                $(".judgeMessage1").text("频道名已存在");
                            }else{
                                var nPower=new Array();
                                $(".creatMessage-form ul li").each(function () {
                                    if($(this).find("label input").prop("checked")==true){
                                        nPower.push($(this).find("label input").attr("data-id"));
                                    }
                                });
                                var nBeginTime=0;
                                $(".examplePopup-form .towName input").each(function (index) {
                                    if(index==0){
                                        nBeginTime=nBeginTime+Number($(this).val())*3600
                                    }
                                    if(index==1){
                                        nBeginTime=nBeginTime+Number($(this).val())*60
                                    }
                                    if(index==2){
                                        nBeginTime=nBeginTime+Number($(this).val())
                                    }
                                });
                                backWait.backWaitIn({
                                    "homeEle":".examplePopup",
                                    "imgSrc":"../../images/loadingImg.gif",
                                    "background":"rgba(0,0,0,0.1)"
                                });
                                uclient.createChannel(newUserName,nBeginTime,nPower,function (seqNo,iCode,error,replyBody) {
                                    backWait.backWaitOut();
                                    if(iCode>=0){
                                        console.log(replyBody);
                                        $(".localback").css("display","none");
                                        getInstance();
                                        createLogNow("新建频道:"+newUserName)
                                    }else{
                                        console.log(error);
                                        errorTotip("新建失败"+error)
                                    }
                                })
                            }
                        }
                    })
                }
                if(selectType==="modify"){//修改频道
                    $(".examplePopup-sure").off("click").on("click",function () {

                        var nBeginTime=0;
                        $(".examplePopup-form .towName input").each(function (index) {
                            if(index==0){
                                nBeginTime=nBeginTime+Number($(this).val())*3600
                            }
                            if(index==1){
                                nBeginTime=nBeginTime+Number($(this).val())*60
                            }
                            if(index==2){
                                nBeginTime=nBeginTime+Number($(this).val())
                            }
                        });
                        var nPower=[];
                        $(".creatMessage-form ul li").each(function () {
                            if($(this).find("label input").prop("checked")==true){
                                nPower.push($(this).find("label input").attr("data-id"));
                            }
                        });
                        backWait.backWaitIn({
                            "homeEle":".examplePopup",
                            "imgSrc":"../../images/loadingImg.gif",
                            "background":"rgba(0,0,0,0.1)"
                        });
                        uclient.modifyChannel(umysql,nBeginTime,nPower,function (seqNo,iCode,error,replyBody) {
                            backWait.backWaitOut();
                            if(iCode>=0){
                                console.log(replyBody);
                                $(".localback").css("display","none");
                                getInstance();
                                createLogNow("修改频道:"+pkgZip)
                            }else{
                                console.log(error);
                                errorTotip("修改失败"+error)
                            }
                        });
                    })
                }
                if(selectType==="look"){//查看频道
                    $(".examplePopup-sure").off("click").on("click",function () {
                        $(".localback").css("display","none");
                        $(".examplePopup-center-one").css("display","block");
                        $(".examplePopup-center-tow").css("display","none");
                    })
                }
            }
            //开播时间
            $(".broadcastTime input").on("click",function () {
                $(this).addClass("timeFocus").removeAttr("readonly").focus()
                    .siblings("input").removeClass("timeFocus").attr("readonly","readonly");
            });
            $(".broadcastTime-add,.broadcastTime-reduce").on("click",function () {
                var broadTime="",inputK=0;
                $(".broadcastTime input").each(function (index) {
                    if($(this).hasClass("timeFocus")){
                        broadTime=$(this).val();
                        inputK=index;
                    }
                });
                var broadTimeNum=Number(broadTime);
                var broadTimeOne=Number(broadTime.split("")[0]);
                var broadTimeTow=Number(broadTime.split("")[1]);
                console.log(broadTimeOne);
                console.log(broadTimeTow);
                if($(this).hasClass("broadcastTime-add")){
                    if(inputK==0){
                        if(broadTimeNum<23){
                            if(broadTimeTow<9){
                                broadTimeTow++;
                            }else if(broadTimeTow==9){
                                if(broadTimeOne<2){
                                    broadTimeTow=0;
                                    broadTimeOne++;
                                }
                            }
                        }else{
                            broadTimeOne=0;
                            broadTimeTow=0;
                        }
                    }else{
                        if(broadTimeNum<59){
                            if(broadTimeTow<9){
                                broadTimeTow++;
                            }else if(broadTimeTow==9){
                                if(broadTimeOne<5){
                                    broadTimeTow=0;
                                    broadTimeOne++;
                                }
                            }
                        }else{
                            broadTimeOne=0;
                            broadTimeTow=0;
                        }
                    }
                }
                if($(this).hasClass("broadcastTime-reduce")){
                    if(inputK==0){
                        if(broadTimeNum!=0){
                            if(broadTimeTow>0){
                                broadTimeTow--;
                            }else if(broadTimeTow==0){
                                if(broadTimeOne>0){
                                    broadTimeTow=9;
                                    broadTimeOne--;
                                }
                            }
                        }else{
                            broadTimeOne=2;
                            broadTimeTow=3;
                        }
                    }else{
                        if(broadTimeNum!=0){
                            if(broadTimeTow>0){
                                broadTimeTow--;
                            }else if(broadTimeTow==0){
                                if(broadTimeOne>0){
                                    broadTimeTow=9;
                                    broadTimeOne--;
                                }
                            }
                        }else{
                            broadTimeOne=5;
                            broadTimeTow=9;
                        }
                    }
                }
                $(".broadcastTime input").eq(inputK).val(broadTimeOne+""+broadTimeTow);
            });
            $(".broadcastTime input").on("keydown",function (event) {
                // 除了数字键、删除键之外全部不允许输入
                var k=event.keyCode;
                // console.log(k);
                if((k <= 57 && k >= 48&&!event.shiftKey) || (k <= 105 && k >= 96)){
                    //满三位数
                    if($(this).val().length==2){
                        return false;
                    }
                    var num=Number($(this).val());
                    if($(this).index()==0){
                        if(num>2){
                            return false;
                        }
                    }else{
                        if(num>5){
                            return false;
                        }
                    }
                    return true;
                }else if(k==8||(k<=40&&k>=37)){
                    if(k==38){
                        $(".broadcastTime-add").triggerHandler("click")
                    }
                    if(k==40){
                        $(".broadcastTime-reduce").triggerHandler("click")
                    }
                    return true;
                }else{
                    return false;
                }

            }).on("change",function(event){
                if($(this).val().length==1){
                    //满一位数
                    $(this).val("0"+$(this).val())
                }
                if($(this).val()===""){
                    $(this).val("00")
                }
            });
            //关闭
            $("#close,.examplePopup-cancel").on("click", function () {
                $(".localback").css("display","none");
                $(".judgeMessage1").text("");
                $(".examplePopup-back").remove();
                $(".creatUserDeafult").css("display","none").text("");
                backWait.backWaitOut();
            });
            //创建日志
            function createLogNow(type) {
                //uclient.createLog(type,function (seqNo,iCode,error,replyBody) {

               // })
            }
            //错误提示函数
            var errorTime;
            function errorTotip(text) {
                clearTimeout(errorTime);
                $(".creatUserDeafult").css("display","inline-block").text(text);
                errorTime=setTimeout(function () {
                    $(".creatUserDeafult").css("display","none").text("");
                },3000);
            }
        };
        if(uclient.isCanMngChannel()){
            $scope.resource();
        }else{
            $(".localBottom-right-error").remove();
            $("<div class='localBottom-right-error'><img src='../../images/noWay.png'></div>")
                .appendTo(".example-channel");
        }


    });
    //日志查看
    app.controller('journalController', function ($scope,$rootScope) {
        $scope.resource=function () {
            //获取所有日志
            function getInstance() {
                $(".localBottom-right-error").remove();
                backWait.backWaitIn({
                    "homeEle":".toolCenter-body",
                    "imgSrc":"../../images/loadingImg.gif",
                    "background":"rgba(0,0,0,0.1)"
                });
                uclient.getLog("0","1000",function (seqNo,iCode,error,replyBody) {
                    backWait.backWaitOut();
                    if(iCode>=0){
                        console.log(replyBody);
                        var process=$(".process-contain .process-list");
                        $.each(replyBody.log_list,function (i,value) {
                            $("<li></li>").text(i+1).appendTo(process.eq(0).find("ul"));
                            $("<li></li>").text(value.descript_name).appendTo(process.eq(1).find("ul"));
                            $("<li></li>").text(function () {
                                var date=new Date();//时间
                                date.setTime(value.log_time);
                                var timeDate=date.toLocaleDateString();
                                var timeHour=date.toTimeString().split(" ")[0];
                                return timeDate+" "+timeHour
                            }).appendTo(process.eq(2).find("ul"));
                            $("<li></li>").text(value.user_name).appendTo(process.eq(3).find("ul"));
                            $("<li></li>").text(value.log_ip_address).appendTo(process.eq(4).find("ul"));
                        });
                        processLi();
                    }else{
                        $("<div class='localBottom-right-error'><img src='../../images/error.png'></div>")
                            .appendTo(".logManage");
                    }

                });
                //事件
                function processLi() {
                    $(".process-list ul li").off("mouseenter").on("mouseenter",function () {
                        var li=$(this).index();
                        $(".process-list").each(function (i,value) {
                            $(this).find("ul li").eq(li).addClass("liEnter").siblings().removeClass("liEnter");
                        })
                    });
                    $(".process-list ul").off("mouseleave").on("mouseleave",function () {
                        $(".process-list").each(function (i,value) {
                            $(this).find("ul li").removeClass("liEnter");
                        })
                    });
                    $(".process-list ul li").off("click").on("click",function () {
                        var li=$(this).index();
                        $(".process-list").each(function (i,value) {
                            $(this).find("ul li").eq(li).addClass("liActive").siblings().removeClass("liActive");
                        });
                    });
                }
            }
            getInstance();
            //切换
            $(".logManage-head ul li").on("click",function () {
                $(this).addClass("logActive").siblings().removeClass("logActive");
                if($(this).index()===0){
                    $(".logManage-center-look").css("display","flex");
                    $(".logManage-center-set").css("display","none");
                }
                if($(this).index()===1){
                    $(".logManage-center-look").css("display","none");
                    $(".logManage-center-set").css("display","flex");
                }
            });
            //获取日志清理时间
            uclient.getLogClearTime(function (seqNo,code,err,configInfo) {
                if(code>=0){
                    $(".section-list-set input.logNumber").val(configInfo.LOG_CLEAR);
                }else{
                    $(".section-list-set input.logNumber").val(0);
                }
            });
            //设置日志清理时间
            $(".section-list-set-btn .saveSet").on("click",function () {
                var nDay=$(".section-list-set input.logNumber").val();
                var kOne,kTow;
                uclient.setLogClearTime(nDay,function (seqNo,code,err,configInfo) {
                    if(code>=0){
                        $(".section-tow span.afterSetLog").addClass("successLog").text("设置成功");
                        clearTimeout(kOne);
                        kOne=setTimeout(function () {
                            $(".section-tow span.afterSetLog").removeClass("successLog").text("");
                        },3000);
                    }else{
                        $(".section-tow span.afterSetLog").addClass("failLog").text("设置失败");
                        clearTimeout(kTow);
                        kTow=setTimeout(function () {
                            $(".section-tow span.afterSetLog").removeClass("failLog").text("");
                        },3000);
                    }
                });
            });
        };
        if(uclient.isCanMngLog()){
            $scope.resource();
        }else{
            $(".localBottom-right-error").remove();
            $("<div class='localBottom-right-error'><img src='../../images/noWay.png'></div>")
                .appendTo(".logManage");
        }
    });
    //bucket管理
    app.controller('bucketController', function ($scope,$rootScope) {
        $scope.resource=function () {
            //获取所有频道列表
            function getInstance() {
                $(".localBottom-right-error").remove();
                backWait.backWaitIn({
                    "homeEle":".toolCenter-body",
                    "imgSrc":"../../images/loadingImg.gif",
                    "background":"rgba(255,255,255,1)"
                });
                uclient.getBucketList(true,function (seqNo,iCode,error,replyBody) {
                    backWait.backWaitOut();
                    if(iCode>=0){
                        console.log(replyBody);
                        $(".tool-fileBtn li").remove();
                        $(".addBtn").remove();
                        $("<div class='addBtn'><button></button></div>").appendTo(".localBottom-right-top-center");
                        addPack();//加号绑定事件
                        $.each(replyBody.item,function (i,value) {
                            $("<li><div class='tool-fileBtn-top'>"+
                                "<div class='tool-fileBtn-img'><img></div>"+
                                "<div class='tool-fileBtn-text'><h3></h3></div></div>").find(".tool-fileBtn-img img")
                                .attr("src","../../images/biao.png")
                                .end().find(".tool-fileBtn-top").attr("data-list",JSON.stringify(value.user_list))
                                .end().find(".tool-fileBtn-text h3").text(value.vf_name)
                                .end().find(".tool-fileBtn-text").attr("data-channel",function () {
                                if(value.channel_name){
                                    return value.channel_name
                                }else {
                                    return "nothing"
                                }
                            }).end().attr("data-id",value.vf_id).attr("data-attri",value.vf_attri).appendTo(".example-channel .tool-fileBtn");
                            keyClick();
                        })
                    }else{
                        $(".tool-fileBtn li").remove();
                        $(".addBtn").remove();
                        $("<div class='localBottom-right-error'><img src='../../images/error.png'></div>")
                            .appendTo(".example-channel");
                    }
                });
            }
            getInstance();
            //菜单
            function keyClick() {
                $(".tool-fileBtn li").off("mousedown").on("mousedown",function(e){
                    e.preventDefault();
                    if(e.button ==0){//你点了左键

                    }else if(e.button ==2){//你点了右键
                        e.stopPropagation();
                        var channelMenu;
                        var userNow=$(this).find(".tool-fileBtn-text h3").text();
                        if(userNow==="default_channel"){
                            channelMenu=["modify deleteMenu","delete deleteMenu","look"]
                        }else{
                            channelMenu=["modify","delete","look"]
                        }
                        $(this).menu({
                            list:["修改","删除","查看信息"],//菜单名
                            className:channelMenu,//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
                            background:"#8ce6da",//选中背景色
                            foreground:"",//没选中背景色为空
                            id:"userMenu",//菜单id
                            classNood:".localBottom-right-top-center",//带有滚动条的元素类名，菜单出现时禁止滚动
                            who:".localBottom-right-top-center",//菜单在标签中的位置
                            ePageX:e.pageX,
                            ePageY:e.pageY
                        });
                        var pkgZip=$(this).find(".tool-fileBtn-text h3").text();
                        var severIp=$(this).find(".tool-fileBtn-top").attr("data-list");
                        var typeTime=$(this).find(".tool-fileBtn-text").attr("data-channel");
                        var umysql=$(this).attr("data-id");
                        menuClick(pkgZip,severIp,typeTime,umysql);
                    }
                });
            }
            //菜单事件
            function menuClick(pkgZip,severIp,typeTime,umysql) {
                $("#userMenu ul li").off("click mousedown").on("click",function (e) {
                    e.stopPropagation();
                    if($(this).hasClass("delete")){
                        dialog.backDialogIn({
                            width:"350px",//宽度
                            marginTop:"250px",//
                            background:"rgba(0,0,0,0.2)",//背景色
                            titleBackground:"#25bc91",//标题栏背景色为空
                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                            SureCloseBack:"red",
                            h3Text:"是否删除该存储区？",//文本
                            who:"#main",//菜单在标签中的位置
                            bottomBack:"rgba(140,230,218,0.1)",
                            borderBack:"rgba(140,230,218,0.8)",
                            aBackground:"rgba(140,230,218,0.1)",
                            cancel:""
                        });
                        $(".backDialog-sure").off("click").one("click",function () {
                            dialog.backDialogOut();
                            backWait.backWaitIn({
                                "homeEle":"#main",
                                "imgSrc":"../../images/loadingImg.gif",
                                "background":"rgba(0,0,0,0.1)"
                            });
                            uclient.delBucket(umysql,function (seqNo,icode,error,replyBody) {
                                backWait.backWaitOut();
                                if(icode>=0){
                                    console.log(replyBody);
                                    getInstance();
                                }else{
                                    console.log(error);
                                    dialog.backDialogIn({
                                        width:"350px",//宽度
                                        marginTop:"250px",//
                                        background:"rgba(0,0,0,0.2)",//背景色
                                        titleBackground:"#25bc91",//标题栏背景色为空
                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                        SureCloseBack:"red",
                                        h3Text:"删除存储区失败"+error,//文本
                                        who:"#main",//菜单在标签中的位置
                                        bottomBack:"rgba(140,230,218,0.1)",
                                        borderBack:"rgba(140,230,218,0.8)",
                                        aBackground:"rgba(140,230,218,0.1)",
                                        cancel:"cancelNo"
                                    });
                                    $(".backDialog-sure").off("click").one("click",function () {
                                        dialog.backDialogOut();
                                    });
                                }

                            })
                        });
                    }

                    if($(this).hasClass("modify")) {
                        $(".localback").css("display","block").find(".language span").text("修改存储区");
                        $(".examplePopup-center-tow").css("display","none");
                        $(".examplePopup-center-one").css("display","block");
                        $(".examplePopup-form .oneName >input").val(pkgZip).attr("readonly","readonly");
                        $(".judgeMessage1").text("");
                        ConfigType("modify",pkgZip,severIp,typeTime,umysql);
                    }
                    if($(this).hasClass("look")){
                        $(".localback").css("display","block").find(".language span").text("存储区信息");
                        var quanxian="";
                        var nPower=JSON.parse(severIp);
                        $.each(nPower,function (i,value) {
                            quanxian = quanxian + " " + value.user_name;
                        });
                        $(".examplePopup-center-one").css("display","none");
                        $(".examplePopup-center-tow").css("display","block").find("p").eq(0).find("span").text(pkgZip)
                            .end().end().eq(1).find("span").text(typeTime)
                            .end().end().eq(2).find("span").text(quanxian);

                        ConfigType("modify",pkgZip,severIp,typeTime,umysql);
                    }

                    $("#userMenu").remove();
                });
            }
            //加号
            function addPack() {
                $(".addBtn").on("click",function () {
                    $(".localback").css("display","block").find(".language span").text("新建存储区");
                    $(".examplePopup-form .oneName >input").removeAttr("readonly").val("");
                    $(".judgeMessage1").text("");
                    $(".examplePopup-center-one").css("display","block");
                    $(".examplePopup-center-tow").css("display","none");
                    ConfigType("creat","","","","");
                });
            }
            function ConfigType(selectType,pkgZip,severIp,typeTime,umysql) {
                //所有用户
                uclient.getAllUser(function (seqNo,iCode,error,replyBody) {
                    if(iCode>=0){
                        $(".creatMessage-form ul li").remove();
                        $(".creatMessage-form .channelUserDeafult").remove();
                        $.each(replyBody.user_list,function (i,value) {
                            $("<li><label><input type='checkbox'><span></span></label>")
                                .find("input").attr("data-id",value.user_id)
                                .end().find("span").text(value.user_name).end().appendTo(".creatMessage-form ul");
                        });
                        if(selectType==="creat"){
                            $(".creatMessage-form ul li").each(function () {
                                if($(this).find("label input").prop("checked")==true){
                                    $(this).find("label input").prop("checked",false);
                                }
                            });
                        }
                        if(selectType==="modify"){
                            var nPower=JSON.parse(severIp);
                            $.each(nPower,function (i,value) {
                                // console.log(value.user_id);
                                $(".creatMessage-form ul li").each(function () {
                                    if(Number($(this).find("label input").attr("data-id"))===value.user_id){
                                        // console.log($(this).find("label input").attr("data-id"));
                                        $(this).find("label input").prop("checked",true);
                                    }
                                });
                            });
                        }
                    }else{
                        $(".creatMessage-form ul li").remove();
                        $(".creatMessage-form").append("<div class='channelUserDeafult'><span>当前用户加载失败</span></div>");
                    }
                });
                if(selectType==="creat"){//新建存储区
                    $(".examplePopup-sure").off("click").on("click",function () {
                        var newUserName=$(".examplePopup-form .oneName >input").val();
                        if(newUserName===""){
                            $(".judgeMessage1").text("存储区名不能为空");
                        }else{
                            var UserNameHas=false;
                            $(".example-home .tool-fileBtn li").each(function () {
                                if($(this).find(".tool-fileBtn-text h3").text()===newUserName){
                                    UserNameHas=true;
                                }
                            });
                            if(UserNameHas==true){
                                $(".judgeMessage1").text("存储区名已存在");
                            }else{
                                var nPower=new Array();
                                $(".creatMessage-form ul li").each(function () {
                                    if($(this).find("label input").prop("checked")==true){
                                        nPower.push($(this).find("label input").attr("data-id"));
                                    }
                                });
                                backWait.backWaitIn({
                                    "homeEle":".examplePopup",
                                    "imgSrc":"../../images/loadingImg.gif",
                                    "background":"rgba(0,0,0,0.1)"
                                });
                                uclient.createBucket(newUserName,nPower,function (seqNo,iCode,error,replyBody) {
                                    backWait.backWaitOut();
                                    if(iCode>=0){
                                        console.log(replyBody);
                                        $(".localback").css("display","none");
                                        getInstance();
                                        createLogNow("新建存储区:"+newUserName)
                                    }else{
                                        console.log(error);
                                        errorTotip("新建失败"+error)
                                    }
                                })
                            }
                        }
                    })
                }
                if(selectType==="modify"){//修改存储区
                    $(".examplePopup-sure").off("click").on("click",function () {
                        var newUserName=$(".examplePopup-form .oneName >input").val();
                        var nPower=[];
                        $(".creatMessage-form ul li").each(function () {
                            if($(this).find("label input").prop("checked")==true){
                                nPower.push($(this).find("label input").attr("data-id"));
                            }
                        });
                        backWait.backWaitIn({
                            "homeEle":".examplePopup",
                            "imgSrc":"../../images/loadingImg.gif",
                            "background":"rgba(0,0,0,0.1)"
                        });
                        uclient.modifyBucket(umysql,newUserName,nPower,function (seqNo,iCode,error,replyBody) {
                            backWait.backWaitOut();
                            if(iCode>=0){
                                console.log(replyBody);
                                $(".localback").css("display","none");
                                getInstance();
                                createLogNow("修改存储区:"+pkgZip)
                            }else{
                                console.log(error);
                                errorTotip("修改失败"+error)
                            }
                        });
                    })
                }
                if(selectType==="look"){//查看存储区
                    $(".examplePopup-sure").off("click").on("click",function () {
                        $(".localback").css("display","none");
                        $(".examplePopup-center-one").css("display","block");
                        $(".examplePopup-center-tow").css("display","none");
                    })
                }
            }
            //关闭
            $("#close,.examplePopup-cancel").on("click", function () {
                $(".localback").css("display","none");
                $(".judgeMessage1").text("");
                $(".examplePopup-back").remove();
                $(".creatUserDeafult").css("display","none").text("");
                backWait.backWaitOut();
            });
            //创建日志
            function createLogNow(type) {
                //uclient.createLog(type,function (seqNo,iCode,error,replyBody) {

                // })
            }
            //错误提示函数
            var errorTime;
            function errorTotip(text) {
                clearTimeout(errorTime);
                $(".creatUserDeafult").css("display","inline-block").text(text);
                errorTime=setTimeout(function () {
                    $(".creatUserDeafult").css("display","none").text("");
                },3000);
            }
        };
        if(uclient.isCanMngBucket()){
            $scope.resource();
        }else{
            $(".localBottom-right-error").remove();
            $("<div class='localBottom-right-error'><img src='../../images/noWay.png'></div>")
                .appendTo(".example-channel");
        }


    });
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('userManage', {
                url:"/userManage",
                views:{
                    "tool":{
                        templateUrl: 'tool/userManage.html',
                        controller: 'userManageController'
                    }
                }
            })
            .state('channelManage', {
                url:"/channelManage",
                views:{
                    "tool":{
                        templateUrl: 'tool/channelManage.html',
                        controller: 'channelManageController'
                    }
                }
            })
            .state('journal', {
                url:"/journal",
                views:{
                    "tool":{
                        templateUrl: 'tool/journal.html',
                        controller: 'journalController'
                    }
                }
            })
            .state('sever', {
                url:"/sever",
                views:{
                    "tool":{
                        templateUrl: 'tool/sever.html',
                        controller: 'severController'
                    }
                }
            })
            .state('examine', {
                url:"/examine",
                views:{
                    "tool":{
                        templateUrl: 'tool/examine.html',
                        controller: 'examineController'
                    }
                }
            })
            .state('outPut', {
                url:"/outPut",
                 views:{
                    "tool":{
                        templateUrl: 'tool/outPut.html',
                        controller: 'outPutController'
                    }
                }

            })
        .state('bucket', {
            url:"/bucket",
            views:{
                "tool":{
                    templateUrl: 'tool/bucket.html',
                    controller: 'bucketController'
                }
            }

        }).state('site', {
            url:"/site",
            views:{
                "tool":{
                    templateUrl: 'tool/site.html',
                    controller: 'siteController'
                }
            }

        });
    });
});