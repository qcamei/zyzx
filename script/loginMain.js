if(typeof(uwnd)!="undefined"){
    uwnd.foreground();
}
pathConfig("../../common/js/");
require.config({
    paths: {
        "dialog":"libs/dialog"
    }
});
require(["jquery",'uclient',"dialog"],function($,uclient,dialog){
    $(function () {
        //最小化
        $("#mostSmall").on("click",function () {
            uwnd.minmize();
        });
        //关闭
        $("#close").on("click",function () {
            // passwordStorage();
            // autoStorage();
            uwnd.close("close");
        });
        //拖动
        $(".loginTop").on("mousedown",function () {
            return uwnd.drag();
        });
        uclient.init(function (seqno,code,msg,info) {
            if(code>=0){
                //登录
                $("#loginBtn").off("click").on("click",function () {
                    var user = $("#user").val();
                    var psw = $("#password").val();
                    //前期验证
                    if(user===""){
                        $(".checkMessageOne").text("用户名不能为空");
                        $("#user").focus();
                    }else{
                        var yong=new RegExp("^[\\u4e00-\\u9fa5_a-zA-Z0-9-]{1,16}$");
                        // 昵称格式：限16个字符，支持中英文、数字、减号或下划线
                        if(!yong.test(user)){
                            $(".checkMessageOne").text("16位以内，仅中英文,数字,减号,下划线");
                            $("#user").focus();
                        }else{
                            if(psw===""){
                                $(".checkMessageTow").text("密码不能为空");
                                $("#password").focus();
                            }else{
                                var mi=/^[a-zA-Z0-9](\w){5,17}$/;
                                // 以数字或字母开头，长度在6~18之间，只能包含字符、数字和下划线
                                if(!mi.test(psw)){
                                    $(".checkMessageTow").text("6~18位以内，仅包含字符,数字,下划线");
                                    $("#password").focus();
                                }else{
                                    message("login");
                                    uclient.userLogin(user, psw, function(seqno,code,msg,req) {
                                        // console.log(code);
                                        if(code>=0){
                                            //成功
                                            var userName = $("#user").val();
                                            userStorage(userName);
                                            passwordStorage(psw);
                                            autoStorage();
                                            uwnd.close("success");
                                        }else{
                                            $(".checkMessageThree").text(msg);
                                            message("default");
                                            if(code==-29){
                                                dialog.backDialogIn({
                                                    width:"350px",//宽度
                                                    marginTop:"100px",//
                                                    background:"rgba(0,0,0,0.2)",//背景色
                                                    titleBackground:"#25bc91",//标题栏背景色为空
                                                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                    SureCloseBack:"red",
                                                    h3Text:"服务器配置已改变，请重新配置",//文本
                                                    who:"#login",//菜单在标签中的位置
                                                    bottomBack:"rgba(140,230,218,0.1)",
                                                    borderBack:"rgba(140,230,218,0.8)",
                                                    aBackground:"#25bc91",
                                                    cancel:"cancelNo"
                                                });
                                                $(".backDialog-sure").off("click").one("click",function () {
                                                    dialog.backDialogOut();
                                                    window.location="loginSet.html";
                                                });
                                                $(".backDialog-close").off("click").one("click",function () {
                                                    dialog.backDialogOut();
                                                    uwnd.close("close");
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
                function message(status) {
                    if(status==="login"){
                        $("#loginBtn").val("登录中...");
                        $("#loginBack").css("display","block");
                    }
                    if(status==="default"){
                        $("#loginBtn").val("登录");
                        $("#loginBack").css("display","none");
                        $("#password").focus();
                    }
                }
                $("#user").on("keyup",function (e) {
                    if(e.keyCode!=13){
                        $(".checkMessageOne").text("")
                    }
                });
                $("#password").on("keyup",function (e) {
                    if(e.keyCode!=13){
                        $(".checkMessageTow").text("")
                    }
                });
                //密码保存
                if(localStorage.getItem("password")){
                    $("#password").val(localStorage.getItem("password"));
                    $(".monmery").prop("checked",true);
                }
                function passwordStorage(str) {
                    if($(".monmery").prop("checked")==true){
                        localStorage.setItem("password",str);
                    }else{
                        localStorage.removeItem("password");
                    }
                }
                if(location.search){//主页面
                    var backMain=location.search.split("?")[1];
                }
                if(location.hash){//设置页面
                    var backMain2=location.hash.split("#")[1];
                }
                //自动登录
                if(localStorage.getItem("auto")){
                    $(".autoLogin").prop("checked",true);
                    if(backMain!="cancel"&&backMain2!="cancel"){
                        $("#loginBtn").triggerHandler("click");
                    }
                }
                function autoStorage() {
                    if($(".autoLogin").prop("checked")==true){
                        localStorage.setItem("auto","true");
                    }else{
                        localStorage.removeItem("auto");
                    }
                }
                //连接类型
                console.log(info);
                if(info.config==="local"){
                    $(".loginBackgroud-text h3").text("本地");
                }
                if(info.config==="cache"){
                    $(".loginBackgroud-text h3").text("私有云");
                    if(info.serverDomain){
                        $(".loginBackgroud-text p").text(info.serverDomain+" "+info.name);
                    }
                }
                if(info.config==="cloud"){
                    $(".loginBackgroud-text h3").text("公有云");
                }


            }else{
                var text="初始化进程失败 "+msg;
                if(code==-29){
                    text="服务器连接类型未配置，点击‘确定’配置"
                }
                dialog.backDialogIn({
                    width:"350px",//宽度
                    marginTop:"100px",//
                    background:"rgba(0,0,0,0.2)",//背景色
                    titleBackground:"#25bc91",//标题栏背景色为空
                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                    SureCloseBack:"red",
                    h3Text:text,//文本
                    who:"#login",//菜单在标签中的位置
                    bottomBack:"rgba(140,230,218,0.1)",
                    borderBack:"rgba(140,230,218,0.8)",
                    aBackground:"#25bc91",
                    cancel:"cancelNo"
                });
                $(".backDialog-sure").off("click").one("click",function () {
                    dialog.backDialogOut();
                    if(code==-29){
                        window.location="loginSet.html";
                    }else{
                        uwnd.close("close");
                    }
                });
                $(".backDialog-close").off("click").one("click",function () {
                    dialog.backDialogOut();
                    uwnd.close("close");
                });
            }
        });
        //cehckBox
        $(".monmery").on("click",function () {
            if($(".monmery").prop("checked")==false){
                $(".autoLogin").prop("checked",false);
            }
        });
        $(".autoLogin").on("click",function () {
            if($(".autoLogin").prop("checked")==true){
                $(".monmery").prop("checked",true);
            }
        });
        //字体的动态添加
        //初始化默认储为中文
        if(!localStorage.language){
            localStorage.language="chinese";
        }
        var val=location.search;
        //console.log(val);
        if(val=="?0"){
            localStorage.removeItem("language");
            localStorage.language="chinese";
        }
        if(val=="?1"){
            localStorage.removeItem("language");
            localStorage.language="traditional-chinese";
        }
        if(val=="?2"){
            localStorage.removeItem("language");
            localStorage.language="English";
        }
        if(localStorage.language==="English"){
            $(".maohao").css("padding-left","0px");
            $("#wordPass").css("letter-spacing","0px");
        }
        $.ajax({
            url:"../../json/"+localStorage.language+"/login.json",
            method:"get",
            dataType:"json",
            success:function(data){
                $("#setUp").attr("title",data.bar1);
                $("#mostSmall").attr("title",data.bar2);
                $("#close").attr("title",data.bar3);
                $("#user").attr("placeholder",data.name);
                $("#password").attr("placeholder",data.password);
                $("#loginBtn").attr("value",data.in);
            },
            error:function () {
                uwnd.close("close");
            }
        });


//              localStorage.clear();
        //用户名提示
        function userStorage(name) {
            if(!localStorage.getItem("userName")){
                var site=new Array();
                var str=JSON.stringify(site);
                localStorage.setItem("userName",str);
                save();
            }else{
                save();
            }
            function save() {
                var str2=localStorage.getItem("userName");
                var site2=JSON.parse(str2);
                //查询是否已存在
                for(var i=0;i<=site2.length;i++){
                    if(site2[i]==name){
                        site2.splice(i,1);
                    }
                }
                //保存
                site2.unshift(name);
                //数组的长度不超过6
                if(site2.length>=7){
                    site2.pop();
                }
                var str3=JSON.stringify(site2);
                localStorage.setItem("userName",str3);
            }

        }
        //添加li
        if(localStorage.getItem("userName")){
            $(".allUserName").css("border","1px solid #ccc");
            var str4=localStorage.getItem("userName");
            var site3=JSON.parse(str4);
            $.each(site3,function (i,value) {
                $("<li><span></span></li>").appendTo(".allUserName").find("span").text(value);
            });
            $("#user").val($(".allUserName li span").eq(0).text());
            $(".allUserName li").on("click",function () {
                $(this).addClass("liActive").siblings().removeClass("liActive");
                $("#user").val($(this).find("span").text());
                $(".allUserName").slideUp("fast");
                $(".triMenu").find("span").css("transform","rotate(0deg)");
            });
        }
        //三角点击
        $(".triMenu").on("click",triMenu);
        function triMenu() {
            if($(".allUserName").css("display")==="none"){
                $(".allUserName").slideDown("fast");
                $(this).find("span").css("transform","rotate(-180deg)");
            }else if($(".allUserName").css("display")==="block"){
                $(".allUserName").slideUp("fast");
                $(this).find("span").css("transform","rotate(0deg)");
            }
        }
        //失去焦点
        $(".triMenu").on("blur",function () {
            $(".allUserName").slideUp("fast");
            $(this).find("span").css("transform","rotate(0deg)");
        });
        //下拉菜单
        $(".allUserName li").eq(0).addClass("liActive");



        //禁止鼠标事件
        document.oncontextmenu=function () {
            return false;
        };
        document.onselectstart=new Function("event.returnValue=false;");
        //enter按键
        $("#user").on("keyup",function (event) {
            if(event.keyCode==13){
                $("#password").focus();
            }
        });
        $("#password").on("keyup",function (event) {
            if(event.keyCode==13){
                $("#loginBtn").triggerHandler("click");
            }
        });
        //下拉菜单上下键
        document.onkeyup=function (event) {
            if($(".allUserName").css("display")==="block"){
                var $this;
                $(".allUserName li").each(function () {
                    if($(this).hasClass("liActive")){
                        $this=$(this).index();
                    }
                });
                //下
                if(event.keyCode==40){
                    $(".allUserName li").eq($this+1).addClass("liActive").siblings().removeClass("liActive");
                    if($this==2){
                        $(".allUserName").scrollTop(81);
                    }
                }
                //上
                if(event.keyCode==38&&$this!=0){
                    $(".allUserName li").eq($this-1).addClass("liActive").siblings().removeClass("liActive");
                    if($this==3){
                        $(".allUserName").scrollTop(0);
                    }
                }
                //enter
                if(event.keyCode==13){
                    $(".allUserName li").eq($this).triggerHandler("click");
                }

            }
        };


        $(document).on("keyup",function (e) {
            if(e.ctrlKey==1&&e.keyCode==68){
                uwnd.showDevTool()
            }
        })

        
    });
});

