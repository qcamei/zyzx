define(["uclient","app","jquery","jquery_menu","dialog","backWait","time","dotEvent","head"],function (uclient,app,$,menu,dialog,backWait,time,dotEvent) {
    
    //资源
    app.controller('resourceController', function ($scope,$rootScope) {
        $rootScope.resource=function (channelIndex) {
            function getBucketListOne() {
                $("#main .bucketBack").remove();
                backWait.backWaitIn({
                    "homeEle":"#main",
                    "imgSrc":"../../images/loadingImg.gif",
                    "background":"rgba(0,0,0,0.1)"
                });
                uclient.getBucketList(false,function(seqNo,icode,stringError,info1) {
                    backWait.backWaitOut();
                    if(icode>=0){
                        var $last= $(".channelTab").last();
                        //加频道
                        console.log(info1);
                        $last.find(".allChannel li").remove();
                        $.each(info1.item,function (i,value) {
                            $("<li></li>").text(info1.item[i].vf_name).attr("data-root-id",info1.item[i].vf_id).appendTo($last.find(".allChannel"));
                            if(i==0){
                                $last.find(".allChannel li").eq(0).addClass("liActive");
                                $last.find(".channel").val(info1.item[0].vf_name);
                            }
                        });
                        //按过滤条件获取指定ID 文件夹下的文件
                        function list(id) {
                            var filterConditionOne = {};
                            // filterCondition.start = 0;
                            // filterCondition.pageSize = 40;
                            $(".mainLeft .resource .leftListBack").remove();
                            backWait.backWaitIn({
                                "homeEle":".mainLeft .resource",
                                "imgSrc":"../../images/loadingImg.gif",
                                "background":"rgba(255,255,255,1)"
                            });
                            uclient.listFolderItems(id,filterConditionOne, function(seqNo,icode,stringError,info2) {
                                backWait.backWaitOut();
                                if(icode>=0){
                                    //加左侧列表
                                    console.log(info2);
                                    console.log(info2.path+"-"+info2.idPath);
                                    $last.find(".resource li").remove();
                                    $.each(info2.item, function (i,value) {
                                        $("<li><a></a></li>").attr({
                                            "data-vf-id":info2.item[i].vf_id,
                                            "data-vf-flags":info2.item[i].vf_flags,
                                            "data-vf-attri":info2.item[i].vf_attri
                                        }).children("a").text(info2.item[i].vf_name).end().appendTo($last.find(".resource"));
                                    });

                                    //资源的侧边栏点击
                                    var liIndex;
                                    $last.find(".resource li").on("click", function () {
                                        $last.find(".channel").css("outline", "none");
                                        $(this).addClass("resourceClick").removeClass("resourceOpacity").siblings().removeClass("resourceClick").removeClass("resourceOpacity");
                                        $(".myShare,.lookShare").removeClass("resourceClick");
                                        liIndex = $(this).index();
                                        var vfId = $(this).attr("data-vf-id");
                                        //console.log(vfId);
                                        addResource(vfId);
                                    });
                                    function addResource(vfId) {
                                        var filterConditionTow = {};
                                        $(".mainCenter .center-body").off("mousedown");
                                        $(".mainCenter .center-body #errorBack").remove();
                                        backWait.backWaitIn({
                                            "homeEle":".mainCenter .center-body",
                                            "imgSrc":"../../images/loadingImg.gif",
                                            "background":"rgba(255,255,255,1)"
                                        });
                                        uclient.listFolderItems(vfId,filterConditionTow, function (seqNo,icode, stringError,info3) {
                                            backWait.backWaitOut();
                                            if(seqNo){
                                                if(icode>=0){
                                                    console.log(info3);
                                                    console.log(info3.path+"-"+info3.idPath);
                                                    //给路径框加路径
                                                    $last.find(".fileWay .firstFile").remove();
                                                    if (info3.path.search("/") == -1) {
                                                        $("<div class='firstFile'><a></a><i></i></div>").find("a").text(info3.path).end().attr("data-vf-id", info3.idPath).appendTo($last.find(".fileWay"));
                                                        $last.find(".firstFile").eq(0).prepend("<div class='firstFileImg'></div>");
                                                    } else {
                                                        var pathWayOne = info3.path.split("/");
                                                        var pathIdOne = info3.idPath.split("/");
                                                        $.each(pathWayOne, function (i, value) {
                                                            $("<div class='firstFile'><a></a><i></i></div>").find("a").text(pathWayOne[i]).end().attr("data-vf-id", pathIdOne[i]).appendTo($last.find(".fileWay"));
                                                        });
                                                        $last.find(".firstFile").eq(0).prepend("<div class='firstFileImg'></div>");
                                                    }
                                                    $last.find(".firstFile").on("click", function () {
                                                        var firstOne = $(this).attr("data-vf-id");
                                                        addResource(firstOne);
                                                        $last.find(".resource li").eq(liIndex).attr("data-vf-id", firstOne);
                                                    });
                                                    function fileAdd(itemData,fileURIArray) {
                                                        $last.find(".center-resource li").remove();
                                                        $.each(itemData, function (i, value) {
                                                            $("<li class='fileDiv'></li>").append("<div class='file-head'></div>")
                                                                .append("<div class='file-center'> <img src=''></div>")
                                                                .append("<div class='file-sub'></div>")
                                                                .append("<div class='file-foot'><input readonly></div>")
                                                                .appendTo($last.find(".center-resource"));
                                                            $last.find(".center-resource li").eq(i).attr({
                                                                "data-vf-id": value.vf_id,
                                                                "title": value.vf_name,
                                                                "data-vf-flags":value.vf_flags,
                                                                "data-vf-attri":value.vf_attri
                                                            }).find(".file-foot input").val(value.vf_name);
                                                            //文件夹
                                                            if (value.vf_flags &0x1) {
                                                                $last.find(".center-resource li").eq(i).find(".file-center img").attr("src", "../../images/Folder.png")
                                                            }else{ //非文件夹
                                                                $last.find(".center-resource li").eq(i)
                                                                    .attr("data-vf-obj",value.vf_objMeta)
                                                                    .find(".file-center img").attr("src", itemData[i].vf_icon);

                                                            }
                                                        });
                                                        //文件是否缓存
                                                        uclient.cache.checkCached(fileURIArray,function (seqNof,codef,stringErrorf,reqf) {
                                                            if(codef>=0){
                                                                console.log(reqf);
                                                                if(reqf.no_cached_files){
                                                                    $last.find(".center-resource li").each(function () {
                                                                        if($(this).attr("data-vf-obj")){
                                                                            var $thisObj=$(this);
                                                                            var $thisObjHave=true;
                                                                            $.each(reqf.no_cached_files,function (i,value) {
                                                                                if($thisObj.attr("data-vf-obj")===value){
                                                                                    $thisObj.attr("data-cache","false")
                                                                                        .find(".file-head")
                                                                                        .append("<img src='../../../common/image/ucloud/preload.png'>");
                                                                                    $thisObjHave=false;
                                                                                }
                                                                            });
                                                                            if($thisObjHave==true){
                                                                                $thisObj.attr("data-cache","true")
                                                                                    .find(".file-head img").remove();
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }else{

                                                            }
                                                        });
                                                    }
                                                    fileAdd(info3.item,info3.file_urls);



                                                    //文件双击打开
                                                    $last.find(".center-resource li").on("dblclick", fileClick);
                                                    function fileClick() {
                                                        if($(this).attr("data-vf-flags")==="1"){
                                                            var fileId = $(this).attr("data-vf-id");
                                                            var filterConditionThree={};
                                                            uclient.listFolderItems(fileId, filterConditionThree, function (seqNo,icode,stringError,info4) {
                                                                if(icode>=0){
                                                                    console.log(info4.item);
                                                                    console.log(info4.path+"-"+info4.idPath);
                                                                    //给路径框加路径
                                                                    $last.find(".fileWay .firstFile").remove();
                                                                    if (info4.path.search("/") == -1) {
                                                                        $("<div class='firstFile'><a></a><i></i></div>").find("a").text(info4.path).end().attr("data-vf-id", info4.idPath).appendTo($last.find(".fileWay"));
                                                                        $last.find(".firstFile").eq(0).prepend("<div class='firstFileImg'></div>");
                                                                    } else {
                                                                        var pathWayTow = info4.path.split("/");
                                                                        var pathIdTow= info4.idPath.split("/");
                                                                        $.each(pathWayTow, function (i, value) {
                                                                            $("<div class='firstFile'><a></a><i></i></div>").find("a").text(pathWayTow[i]).end().attr("data-vf-id", pathIdTow[i]).appendTo($last.find(".fileWay"));
                                                                        });
                                                                        $last.find(".firstFile").eq(0).prepend("<div class='firstFileImg'></div>");
                                                                    }
                                                                    $last.find(".firstFile").on("click", function () {
                                                                        var firstTow = $(this).attr("data-vf-id");
                                                                        addResource(firstTow);
                                                                        $last.find(".resource li").eq(liIndex).attr("data-vf-id", firstTow);
                                                                    });
                                                                    fileAdd(info4.item,info3.file_urls);
                                                                    $last.find(".center-resource li").on("dblclick", fileClick);//对于新的li重新绑定双击事件
                                                                    rightClick(info4.path);//对于新的li重新绑定右键事件
                                                                    $last.find(".resource li").eq(liIndex).attr("data-vf-id", fileId);
                                                                }else{
                                                                    // $last.find(".center-body .error").css("display", "block");
                                                                    console.log(stringError)
                                                                }
                                                            });
                                                        }

                                                    }


                                                    //文件夹单击选中
                                                    //文件夹右键点击
                                                    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
                                                    function rightClick(sharePath) {
                                                        document.oncontextmenu = function (e) {
                                                            e.preventDefault();
                                                        };
                                                        var nowDir,nowAttr,nowName,nowResource,nowFileUrl;
                                                        function getNowId() {
                                                            $(".mainDatum .resource li").each(function (index) {
                                                                if($(this).hasClass("resourceClick")){
                                                                    nowDir=$(this).attr("data-vf-id");
                                                                    nowAttr=$(this).attr("data-vf-attri");
                                                                }
                                                            });
                                                        }

                                                        $last.find(".center-resource li").off("mousedown").on("mousedown", function (e) {
                                                            e.stopPropagation();
                                                            if (e.button == 0) {//你点了左键
                                                                $(this).addClass("liClick").siblings().removeClass("liClick");
                                                            } else if (e.button == 2) {//你点了右键
                                                                $(this).addClass("liClick").siblings().removeClass("liClick");
                                                                if(Number($(this).attr("data-vf-flags"))&0x1){//文件夹
                                                                    if((nowAttr&0x0000ffff)===115||(nowAttr&0x0000ffff)===116){//字幕播出单,HG播出单
                                                                        //无菜单
                                                                    }else{
                                                                        $(this).menu({
                                                                            list:["剪切","删除","共享","重命名","导出","属性"],//菜单名
                                                                            className:["shear","delete","share","reName","output","attribute"],//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
                                                                            background:"#8ce6da",//选中背景色
                                                                            foreground:"",//没选中背景色为空
                                                                            id:"folderMenu",//菜单id
                                                                            classNood:".center-body-contain",//带有滚动条的元素类名，菜单出现时禁止滚动
                                                                            who:".center-body-contain",//菜单在标签中的位置
                                                                            ePageX:e.pageX,
                                                                            ePageY:e.pageY,
                                                                            zIndex:""
                                                                        });
                                                                    }
                                                                }
                                                                else{//非文件夹
                                                                    var specialList,specialMenu;
                                                                    if((nowAttr&0x0000ffff)===102||(nowAttr&0x0000ffff)===113){//视频pal,ntsc
                                                                        specialList=["剪切","删除","重命名","导出","播放","属性"];
                                                                        specialMenu=["shear","delete","reName","output","palyVideo","attribute"];
                                                                    }else if((nowAttr&0x0000ffff)===115||(nowAttr&0x0000ffff)===116){//字幕播出单,HG播出单
                                                                        specialList=["删除"];
                                                                        specialMenu=["delete"];
                                                                    }else{
                                                                        specialList=["剪切","删除","重命名","导出","属性"];
                                                                        specialMenu=["shear","delete","reName","output","attribute"];
                                                                    }
                                                                    if($rootScope.rootType==="cache"){//预加载
                                                                        if($(this).attr("data-cache")==="false"){
                                                                            specialList=["剪切","删除","重命名","预加载","导出","属性"];
                                                                            specialMenu=["shear","delete","reName","preload","output","attribute"];
                                                                        }
                                                                    }
                                                                    $(this).menu({
                                                                        list:specialList,//菜单名
                                                                        className:specialMenu,//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
                                                                        background:"#8ce6da",//选中背景色
                                                                        foreground:"",//没选中背景色为空
                                                                        id:"fileMenu",//菜单id
                                                                        classNood:".center-body-contain",//带有滚动条的元素类名，菜单出现时禁止滚动
                                                                        who:".center-body-contain",//菜单在标签中的位置
                                                                        ePageX:e.pageX,
                                                                        ePageY:e.pageY,
                                                                        zIndex:""
                                                                    });
                                                                }
                                                                getNowId();
                                                                nowName=$(this).find(".file-foot input").val();
                                                                nowResource=$(this).attr("data-vf-id");
                                                                nowFileUrl=$(this).attr("data-vf-obj");
                                                                //菜单事件
                                                                blankMenuClick(nowDir,nowAttr,nowName,nowResource,sharePath,nowFileUrl);
                                                            }
                                                        });
                                                        $last.find(".center-body").off("mousedown").on("mousedown", function (e) {
                                                            e.stopPropagation();
                                                            if (e.button == 2) {//你点了右键
                                                                var specialList,specialMenu;
                                                                if((nowAttr&0x0000ffff)===115||(nowAttr&0x0000ffff)===116){//字幕播出单,HG播出单
                                                                    specialList=["刷新"];
                                                                    specialMenu=["refresh"]
                                                                }else{
                                                                    specialList=["导入","粘贴","新建文件夹","刷新"];
                                                                    specialMenu=["enter","paste banMenu","newBuild","refresh"]
                                                                }
                                                                $(this).menu({
                                                                    list:specialList,//菜单名
                                                                    className:specialMenu,//对应的菜单类名及禁用类名bnaMenu及去掉类deleteMenu
                                                                    background:"#8ce6da",//选中背景色
                                                                    foreground:"",//没选中背景色为空
                                                                    id:"blankMenu",//菜单id
                                                                    classNood:".center-body-contain",//带有滚动条的元素类名，菜单出现时禁止滚动
                                                                    who:".center-body-contain",//菜单在标签中的位置
                                                                    ePageX:e.pageX,
                                                                    ePageY:e.pageY,
                                                                    zIndex:""
                                                                });
                                                                getNowId();
                                                                blankMenuClick(nowDir,nowAttr,"","",sharePath,"");
                                                            }
                                                        });


                                                    }
                                                    rightClick(info3.path);
                                                    //菜单事件
                                                    function blankMenuClick(nowDir,nowAttr,nowName,nowResource,sharePath,nowFileUrl) {
                                                        //文件夹
                                                        $("#folderMenu ul li").off("mousedown").on("mousedown",function (e) {
                                                            e.stopPropagation()
                                                        }).off("click").on("click",function (e) {
                                                            e.stopPropagation();
                                                            if($(this).hasClass("shear")){

                                                            }
                                                            if($(this).hasClass("delete")){
                                                                dialog.backDialogIn({
                                                                    width:"350px",//宽度
                                                                    marginTop:"250px",//
                                                                    background:"rgba(0,0,0,0.2)",//背景色
                                                                    titleBackground:"#25bc91",//标题栏背景色为空
                                                                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                    SureCloseBack:"red",
                                                                    h3Text:"是否删除该文件夹？",//文本
                                                                    who:"#main",//菜单在标签中的位置
                                                                    bottomBack:"rgba(140,230,218,0.1)",
                                                                    borderBack:"rgba(140,230,218,0.8)",
                                                                    aBackground:"#25bc91",
                                                                    cancel:""
                                                                });
                                                                $(".backDialog-sure").off("click").one("click",function () {
                                                                    dialog.backDialogOut();
                                                                    backWait.backWaitIn({
                                                                        "homeEle":"#main",
                                                                        "imgSrc":"../../images/loadingImg.gif",
                                                                        "background":"rgba(0,0,0,0.1)"
                                                                    });
                                                                    uclient.menuHandler.deleteFolder(nowResource,function (seqNo,icode,error,replyBody) {
                                                                        backWait.backWaitOut();
                                                                        if(icode>=0){
                                                                            console.log(replyBody);
                                                                            addResource(nowDir);
                                                                        }else{
                                                                            console.log(error);
                                                                            dialog.backDialogIn({
                                                                                width:"350px",//宽度
                                                                                marginTop:"250px",//
                                                                                background:"rgba(0,0,0,0.2)",//背景色
                                                                                titleBackground:"#25bc91",//标题栏背景色为空
                                                                                sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                                SureCloseBack:"red",
                                                                                h3Text:"删除文件夹失败,"+error,//文本
                                                                                who:"#main",//菜单在标签中的位置
                                                                                bottomBack:"rgba(140,230,218,0.1)",
                                                                                borderBack:"rgba(140,230,218,0.8)",
                                                                                aBackground:"#25bc91",
                                                                                cancel:"cancelNo"
                                                                            });
                                                                            $(".backDialog-sure").off("click").one("click",function () {
                                                                                dialog.backDialogOut();
                                                                            });
                                                                        }

                                                                    })
                                                                });
                                                            }
                                                            if($(this).hasClass("share")){
                                                                uwnd.showDialog("U-Cloud/templates/mainPopup/shareMenu.html?"+nowName+"&"+nowResource+"&"+sharePath, {width:545,height:640},function(info){},function(info){});
                                                            }
                                                            if($(this).hasClass("reName")){

                                                                $last.find(".center-resource li").each(function () {
                                                                   if($(this).hasClass("liClick")){
                                                                       $(this).find(".file-foot input").removeAttr("readonly").select().addClass("liFocus")
                                                                           .off("blur").on("blur",function () {
                                                                           var buildVal=$(this).val();
                                                                           var $buildThis=$(this);
                                                                           console.log(buildVal);
                                                                            if(buildVal===nowName){//没变
                                                                                $buildThis.attr("readonly","readonly").removeClass("liFocus").off("blur")
                                                                            }else{
                                                                                if(buildVal===""){
                                                                                    reNameTan("文件名不能为空");
                                                                                    $buildThis.val(nowName);
                                                                                }else{
                                                                                    var fileName=false;
                                                                                    if(buildVal.indexOf('\\')!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("/")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf(":")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("*")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("?")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf('"')!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("<")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf(">")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("|")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(fileName==true){
                                                                                        reNameTan('文件名不能包含/\\:*?"<>|');
                                                                                        $buildThis.val(nowName);
                                                                                    }else{
                                                                                        backWait.backWaitIn({
                                                                                            "homeEle":"#main",
                                                                                            "imgSrc":"../../../images/loadingImg.gif",
                                                                                            "background":"rgba(0,0,0,0.1)"
                                                                                        });
                                                                                        uclient.menuHandler.renameFolder(nowResource,buildVal,function (seqNo,icode,error,replyBody) {
                                                                                            backWait.backWaitOut();
                                                                                            if(icode>=0){
                                                                                                console.log(replyBody);
                                                                                                addResource(nowDir);
                                                                                            }else{
                                                                                                console.log(error);
                                                                                                reNameTan("重命名文件夹失败,"+error);
                                                                                                $buildThis.val(nowName);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                }
                                                                                $buildThis.attr("readonly","readonly").removeClass("liFocus").off("blur");
                                                                                function reNameTan(text) {
                                                                                    dialog.backDialogIn({
                                                                                        width:"350px",//宽度
                                                                                        marginTop:"250px",//
                                                                                        background:"rgba(0,0,0,0.2)",//背景色
                                                                                        titleBackground:"#25bc91",//标题栏背景色为空
                                                                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                                        SureCloseBack:"red",
                                                                                        h3Text:text,//文本
                                                                                        who:"#main",//菜单在标签中的位置
                                                                                        bottomBack:"rgba(140,230,218,0.1)",
                                                                                        borderBack:"rgba(140,230,218,0.8)",
                                                                                        aBackground:"#25bc91",
                                                                                        cancel:"cancelNo"
                                                                                    });
                                                                                    $(".backDialog-sure").off("click").one("click",function () {
                                                                                        dialog.backDialogOut();
                                                                                    });
                                                                                }
                                                                                
                                                                            }
                                                                           
                                                                       })
                                                                   }
                                                                });

                                                            }
                                                            if($(this).hasClass("attribute")){

                                                                uclient.menuHandler.statFolder(nowResource,function (seqNo,icode,error,replyBody) {
                                                                    if(icode>=0){
                                                                        console.log(replyBody);
                                                                        var $detail0="";
                                                                        $.each(replyBody,function (key,value) {
                                                                            if(key==="folder_id"){
                                                                                key="文件id"
                                                                            }
                                                                            if(key==="name"){
                                                                                key="文件名"
                                                                            }
                                                                            if(key==="parent"){
                                                                                key="父目录id"
                                                                            }
                                                                            if(key==="owner"){
                                                                                key="创建者id"
                                                                            }
                                                                            if(key==="created_by"){
                                                                                key="创建者名称"
                                                                            }
                                                                            if(key==="created"){
                                                                                key="创建时间";
                                                                                value=time.dateType(value)
                                                                            }
                                                                            if(key==="last_modify"){
                                                                                key="修改时间";
                                                                                value=time.dateType(value)
                                                                            }
                                                                            if(key==="folder_attr"){
                                                                                key="文件属性";
                                                                            }
                                                                            $detail0=$detail0+"<li><a>"+key+"："+"</a><span>"+value+"</span></li>"
                                                                        });
                                                                        var $detail="<ul class='detailFile'>"+$detail0+"</ul>";
                                                                        dialog.backDialogIn({
                                                                            width:"350px",//宽度
                                                                            marginTop:"250px",//
                                                                            background:"rgba(0,0,0,0.2)",//背景色
                                                                            titleBackground:"#25bc91",//标题栏背景色为空
                                                                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                            SureCloseBack:"red",
                                                                            h3Text:$detail,//文本
                                                                            who:"#main",//菜单在标签中的位置
                                                                            bottomBack:"rgba(140,230,218,0.1)",
                                                                            borderBack:"rgba(140,230,218,0.8)",
                                                                            aBackground:"#25bc91",
                                                                            cancel:"cancelNo",
                                                                            title:"属性"
                                                                        });
                                                                        $(".backDialog-body").css({"width":"350px","margin-top":"150px"});
                                                                        $(".backDialog-text").css("max-height","300px");
                                                                        $(".backDialog-text-center").css("padding","15px 10px 6px 40px");
                                                                        $(".backDialog-sure").css("display","none");
                                                                    }else{
                                                                        dialog.backDialogIn({
                                                                            width:"350px",//宽度
                                                                            marginTop:"250px",//
                                                                            background:"rgba(0,0,0,0.2)",//背景色
                                                                            titleBackground:"#25bc91",//标题栏背景色为空
                                                                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                            SureCloseBack:"red",
                                                                            h3Text:"获取文件信息失败",//文本
                                                                            who:"#main",//菜单在标签中的位置
                                                                            bottomBack:"rgba(140,230,218,0.1)",
                                                                            borderBack:"rgba(140,230,218,0.8)",
                                                                            aBackground:"#25bc91",
                                                                            cancel:"cancelNo",
                                                                            title:"属性"
                                                                        });
                                                                        $(".backDialog-sure").off("click").one("click",function () {
                                                                            dialog.backDialogOut();
                                                                        });
                                                                    }
                                                                });


                                                            }

                                                            $("#folderMenu").remove();

                                                        });
                                                        //文件
                                                        $("#fileMenu ul li").off("mousedown").on("mousedown",function (e) {
                                                            e.stopPropagation()
                                                        }).off("click").on("click",function (e) {
                                                            e.stopPropagation();
                                                            var bRO;
                                                            if((nowAttr&0x0000ffff)==115 && (nowAttr&0x0000ffff)==116){
                                                                bRO=true;
                                                            }else{
                                                                bRO=false;
                                                            }
                                                            if($(this).hasClass("shear")){

                                                            }
                                                            if($(this).hasClass("delete")){
                                                                dialog.backDialogIn({
                                                                    width:"350px",//宽度
                                                                    marginTop:"250px",//
                                                                    background:"rgba(0,0,0,0.2)",//背景色
                                                                    titleBackground:"#25bc91",//标题栏背景色为空
                                                                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                    SureCloseBack:"red",
                                                                    h3Text:"是否删除文件"+nowName+"?",//文本
                                                                    who:"#main",//菜单在标签中的位置
                                                                    bottomBack:"rgba(140,230,218,0.1)",
                                                                    borderBack:"rgba(140,230,218,0.8)",
                                                                    aBackground:"#25bc91",
                                                                    cancel:""
                                                                });
                                                                $(".backDialog-sure").off("click").one("click",function () {
                                                                    dialog.backDialogOut();
                                                                    backWait.backWaitIn({
                                                                        "homeEle":"#main",
                                                                        "imgSrc":"../../images/loadingImg.gif",
                                                                        "background":"rgba(0,0,0,0.1)"
                                                                    });
                                                                    uclient.menuHandler.deleteItem(nowResource,bRO,function (seqNo,icode,error,replyBody) {
                                                                        backWait.backWaitOut();
                                                                        if(icode>=0){
                                                                            console.log(replyBody);
                                                                            addResource(nowDir);
                                                                        }else{
                                                                            console.log(error);
                                                                            dialog.backDialogIn({
                                                                                width:"350px",//宽度
                                                                                marginTop:"250px",//
                                                                                background:"rgba(0,0,0,0.2)",//背景色
                                                                                titleBackground:"#25bc91",//标题栏背景色为空
                                                                                sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                                SureCloseBack:"red",
                                                                                h3Text:"删除文件失败,"+error,//文本
                                                                                who:"#main",//菜单在标签中的位置
                                                                                bottomBack:"rgba(140,230,218,0.1)",
                                                                                borderBack:"rgba(140,230,218,0.8)",
                                                                                aBackground:"#25bc91",
                                                                                cancel:"cancelNo"
                                                                            });
                                                                            $(".backDialog-sure").off("click").one("click",function () {
                                                                                dialog.backDialogOut();
                                                                            });
                                                                        }

                                                                    })

                                                                });
                                                            }
                                                            if($(this).hasClass("reName")){
                                                                $last.find(".center-resource li").each(function () {
                                                                    if($(this).hasClass("liClick")){
                                                                        $(this).find(".file-foot input").removeAttr("readonly").select().addClass("liFocus")
                                                                            .off("blur").on("blur",function () {
                                                                            var buildVal=$(this).val();
                                                                            var $buildThis=$(this);
                                                                            console.log(buildVal);
                                                                            if(buildVal===nowName){//没变
                                                                                $buildThis.attr("readonly","readonly").removeClass("liFocus").off("blur")
                                                                            }else{
                                                                                if(buildVal===""){
                                                                                    reNameTan("文件名不能为空");
                                                                                    $buildThis.val(nowName);
                                                                                }else{
                                                                                    var fileName=false;
                                                                                    if(buildVal.indexOf('\\')!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("/")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf(":")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("*")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("?")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf('"')!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("<")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf(">")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(buildVal.indexOf("|")!=-1){
                                                                                        fileName=true;
                                                                                    }
                                                                                    if(fileName==true){
                                                                                        reNameTan('文件名不能包含/\\:*?"<>|');
                                                                                        $buildThis.val(nowName);
                                                                                    }else{
                                                                                        backWait.backWaitIn({
                                                                                            "homeEle":"#main",
                                                                                            "imgSrc":"../../../images/loadingImg.gif",
                                                                                            "background":"rgba(0,0,0,0.1)"
                                                                                        });
                                                                                        uclient.menuHandler.renameItem(nowResource,buildVal,function (seqNo,icode,error,replyBody) {
                                                                                            backWait.backWaitOut();
                                                                                            if(icode>=0){
                                                                                                console.log(replyBody);
                                                                                                addResource(nowDir);
                                                                                            }else{
                                                                                                console.log(error);
                                                                                                reNameTan("重命名文件夹失败,"+error);
                                                                                                $buildThis.val(nowName);
                                                                                            }

                                                                                        })
                                                                                    }
                                                                                }
                                                                                $buildThis.attr("readonly","readonly").removeClass("liFocus").off("blur");
                                                                                function reNameTan(text) {
                                                                                    dialog.backDialogIn({
                                                                                        width:"350px",//宽度
                                                                                        marginTop:"250px",//
                                                                                        background:"rgba(0,0,0,0.2)",//背景色
                                                                                        titleBackground:"#25bc91",//标题栏背景色为空
                                                                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                                        SureCloseBack:"red",
                                                                                        h3Text:text,//文本
                                                                                        who:"#main",//菜单在标签中的位置
                                                                                        bottomBack:"rgba(140,230,218,0.1)",
                                                                                        borderBack:"rgba(140,230,218,0.8)",
                                                                                        aBackground:"#25bc91",
                                                                                        cancel:"cancelNo"
                                                                                    });
                                                                                    $(".backDialog-sure").off("click").one("click",function () {
                                                                                        dialog.backDialogOut();
                                                                                    });
                                                                                }

                                                                            }

                                                                        })
                                                                    }
                                                                });

                                                            }
                                                            if($(this).hasClass("attribute")){
                                                                uclient.menuHandler.statItem(nowResource,bRO,function (seqNo,icode,error,replyBody) {
                                                                    if(icode>=0){
                                                                        console.log(replyBody);
                                                                        var $detail0="";
                                                                        if(bRO===false){
                                                                            $.each(replyBody,function (key,value) {
                                                                                if(key==="objID"){
                                                                                    key="文件id"
                                                                                }
                                                                                if(key==="objSlug"){
                                                                                    key="文件名"
                                                                                }
                                                                                if(key==="objGroup"){
                                                                                    key="父目录id"
                                                                                }
                                                                                if(key==="channel"){
                                                                                    key="所属频道"
                                                                                }
                                                                                if(key==="createdBy"){
                                                                                    key="创建者名称"
                                                                                }
                                                                                if(key==="created"){
                                                                                    key="创建时间";
                                                                                    value=time.dateType(value)
                                                                                }
                                                                                if(key==="changed"){
                                                                                    key="修改时间";
                                                                                    value=time.dateType(value)
                                                                                }
                                                                                if(key==="objSize"){
                                                                                    key="文件大小";
                                                                                }
                                                                                $detail0=$detail0+"<li><a>"+key+"："+"</a><span>"+value+"</span></li>"
                                                                            });
                                                                        }else{
                                                                            $.each(replyBody,function (key,value) {
                                                                                if(key==="roID"){
                                                                                    key="播出单id"
                                                                                }
                                                                                if(key==="roSlug"){
                                                                                    key="播出单名称"
                                                                                }
                                                                                if(key==="roEdStart"){
                                                                                    key="开播时间";
                                                                                    value=time.time(value)
                                                                                }
                                                                                if(key==="roChannel"){
                                                                                    key="所属频道"
                                                                                }
                                                                                if(key==="createdBy"){
                                                                                    key="创建者名称"
                                                                                }
                                                                                if(key==="created"){
                                                                                    key="创建时间";
                                                                                    value=time.dateType(value)
                                                                                }
                                                                                if(key==="changed"){
                                                                                    key="修改时间";
                                                                                    value=time.dateType(value)
                                                                                }
                                                                                if(key==="objSize"){
                                                                                    key="文件大小";
                                                                                }
                                                                                if(key==="wfROstatus"){
                                                                                    key="播出单状态"
                                                                                }
                                                                                if(key==="roGroup"){
                                                                                    key="父目录id";
                                                                                }
                                                                                $detail0=$detail0+"<li><a>"+key+"："+"</a><span>"+value+"</span></li>"
                                                                            });
                                                                        }
                                                                        var $detail="<ul class='detailFile'>"+$detail0+"</ul>";
                                                                        dialog.backDialogIn({
                                                                            width:"350px",//宽度
                                                                            marginTop:"250px",//
                                                                            background:"rgba(0,0,0,0.2)",//背景色
                                                                            titleBackground:"#25bc91",//标题栏背景色为空
                                                                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                            SureCloseBack:"red",
                                                                            h3Text:$detail,//文本
                                                                            who:"#main",//菜单在标签中的位置
                                                                            bottomBack:"rgba(140,230,218,0.1)",
                                                                            borderBack:"rgba(140,230,218,0.8)",
                                                                            aBackground:"#25bc91",
                                                                            cancel:"cancelNo",
                                                                            title:"属性"
                                                                        });
                                                                        $(".backDialog-body").css({"width":"350px","margin-top":"150px"});
                                                                        $(".backDialog-text").css("max-height","300px");
                                                                        $(".backDialog-text-center").css("padding","15px 10px 6px 40px");
                                                                        $(".backDialog-sure").css("display","none");
                                                                    }else{
                                                                        dialog.backDialogIn({
                                                                            width:"350px",//宽度
                                                                            marginTop:"250px",//
                                                                            background:"rgba(0,0,0,0.2)",//背景色
                                                                            titleBackground:"#25bc91",//标题栏背景色为空
                                                                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                            SureCloseBack:"red",
                                                                            h3Text:"获取文件信息失败"+error,//文本
                                                                            who:"#main",//菜单在标签中的位置
                                                                            bottomBack:"rgba(140,230,218,0.1)",
                                                                            borderBack:"rgba(140,230,218,0.8)",
                                                                            aBackground:"#25bc91",
                                                                            cancel:"cancelNo",
                                                                            title:"属性"
                                                                        });
                                                                        $(".backDialog-sure").off("click").one("click",function () {
                                                                            dialog.backDialogOut();
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                            if($(this).hasClass("preload")){
                                                                uclient.menuHandler.preload(nowResource,nowName,nowFileUrl,function (seqNo,icode,error,replyBody) {
                                                                    if(icode>=0){
                                                                        console.log(replyBody);
                                                                        addResource(nowDir);
                                                                    }else{
                                                                        dialog.backDialogIn({
                                                                            width:"350px",//宽度
                                                                            marginTop:"250px",//
                                                                            background:"rgba(0,0,0,0.2)",//背景色
                                                                            titleBackground:"#25bc91",//标题栏背景色为空
                                                                            sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                            SureCloseBack:"red",
                                                                            h3Text:"预加载文件失败"+error,//文本
                                                                            who:"#main",//菜单在标签中的位置
                                                                            bottomBack:"rgba(140,230,218,0.1)",
                                                                            borderBack:"rgba(140,230,218,0.8)",
                                                                            aBackground:"#25bc91",
                                                                            cancel:"cancelNo",
                                                                            title:""
                                                                        });
                                                                        $(".backDialog-sure").off("click").one("click",function () {
                                                                            dialog.backDialogOut();
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                            $("#fileMenu").remove();
                                                        });
                                                        //空白
                                                        $("#blankMenu ul li").off("mousedown").on("mousedown",function (e) {
                                                            e.stopPropagation()
                                                        }).off("click").on("click",function (e) {
                                                            e.stopPropagation();

                                                            if($(this).hasClass("newBuild")){
                                                                dialog.backDialogIn({
                                                                    width:"350px",//宽度
                                                                    marginTop:"250px",//
                                                                    background:"rgba(0,0,0,0.2)",//背景色
                                                                    titleBackground:"#25bc91",//标题栏背景色为空
                                                                    sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                    SureCloseBack:"red",
                                                                    h3Text:"<span class='buildFile-text'>文件名：</span><input class='buildFile-input' type='text'><p class='buildFile-error'></p>",//文本
                                                                    who:"#main",//菜单在标签中的位置
                                                                    bottomBack:"rgba(140,230,218,0.1)",
                                                                    borderBack:"rgba(140,230,218,0.8)",
                                                                    aBackground:"#25bc91",
                                                                    cancel:"",
                                                                    title:"新建文件夹"
                                                                });
                                                                $(".buildFile-input").on("keyup",function () {
                                                                    $(".buildFile-error").text("");
                                                                });
                                                                $(".backDialog-sure").off("click").on("click",function () {
                                                                    var buildVal=$(".buildFile-input").val();
                                                                    console.log(buildVal);

                                                                    if(buildVal===""){
                                                                        $(".buildFile-error").text("不能为空");
                                                                    } else{
                                                                        var fileName=false;
                                                                        if(buildVal.indexOf('\\')!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf("/")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf(":")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf("*")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf("?")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf('"')!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf("<")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf(">")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(buildVal.indexOf("|")!=-1){
                                                                            fileName=true;
                                                                        }
                                                                        if(fileName==true){
                                                                            $(".buildFile-error").text('不能包含/\\:*?"<>|');
                                                                        }else{
                                                                            dialog.backDialogOut();
                                                                            backWait.backWaitIn({
                                                                                "homeEle":"#main",
                                                                                "imgSrc":"../../images/loadingImg.gif",
                                                                                "background":"rgba(0,0,0,0.1)"
                                                                            });

                                                                            uclient.newFolder(buildVal,nowAttr,nowDir,function (seqNo,icode,error,replyBody) {
                                                                                backWait.backWaitOut();
                                                                                if(icode>=0){
                                                                                    console.log(replyBody);
                                                                                    addResource(nowDir);
                                                                                }else{
                                                                                    console.log(error);
                                                                                    dialog.backDialogIn({
                                                                                        width:"350px",//宽度
                                                                                        marginTop:"250px",//
                                                                                        background:"rgba(0,0,0,0.2)",//背景色
                                                                                        titleBackground:"#25bc91",//标题栏背景色为空
                                                                                        sureClose:"../../../common/image/e1.png",//关闭的图片路径
                                                                                        SureCloseBack:"red",
                                                                                        h3Text:"新建文件夹失败",//文本
                                                                                        who:"#main",//菜单在标签中的位置
                                                                                        bottomBack:"rgba(140,230,218,0.1)",
                                                                                        borderBack:"rgba(140,230,218,0.8)",
                                                                                        aBackground:"#25bc91",
                                                                                        cancel:"cancelNo"
                                                                                    });
                                                                                    $(".backDialog-sure").off("click").one("click",function () {
                                                                                        dialog.backDialogOut();
                                                                                    });
                                                                                }

                                                                            })
                                                                        }

                                                                    }
                                                                });

                                                                // uclient.newFolder(name,type,parentID,function (seqNo,icode,stringError,replyBody) {
                                                                //
                                                                // })
                                                            }
                                                            if($(this).hasClass("enter")){
                                                                uclient.upload.importResFile (nowAttr&0x0000ffff,nowDir,function (seqNo,icode,error,replyBody) {
                                                                    if(icode>=0){
                                                                        console.log(replyBody);
                                                                        uwnd.showDialog("U-Cloud/templates/mainPopup/dataMysql.html", {width:845,height:640},function(info){},function(info){});
                                                                    }else{
                                                                        console.log(error)
                                                                    }
                                                                });
                                                            }
                                                            if($(this).hasClass("refresh")){
                                                                addResource(nowDir);
                                                            }
                                                            $("#blankMenu").remove();
                                                        });
                                                    }


                                                }else{
                                                    $last.find(".center-resource li").remove();
                                                    $("<div id='errorBack'>" +
                                                        "<img src='../../images/error2.png'><br><span></span><button>点击重试</button></div>")
                                                        .find("span").text("加载失败 "+stringError)
                                                        .end().find("button").on("click",function () {
                                                        var vfId = $last.find(".resource li").eq(liIndex).attr("data-vf-id");
                                                        //console.log(vfId);
                                                        addResource(vfId);
                                                    }).end().appendTo(".mainCenter .center-body");
                                                }
                                            }

                                        });
                                    }

                                    //默认触发第一行位图
                                    $last.find(".resource li").eq(0).triggerHandler("click");
                                    //返回键的点击
                                    $last.find(".btnBack").on("click", function () {
                                        var num = $last.find(".firstFile").length;
                                        if (num != 1) {
                                            var numId = $last.find(".firstFile").eq(num - 2).attr("data-vf-id");
                                            addResource(numId);
                                            $last.find(".resource li").eq(liIndex).attr("data-vf-id", numId);
                                        }
                                    });


                                }else{
                                    $last.find(".resource li").remove();
                                    $("<li class='leftListBack'>" +
                                        "<div class='leftListBack-btn'>" +
                                        "<a></a><button>重试</button></div></li>")
                                        .find("a").text("加载失败"+stringError)
                                        .end().find("button").on("click",function () {
                                        $last.find(".allChannel li").eq(channelIndex).triggerHandler("click");
                                    }).end().appendTo(".mainLeft .resource");
                                }
                            });
                        }
                        //频道选择事件
                        $last.find(".allChannel li").on("mouseenter",function () {
                            $(this).css({"background": "#56d7b9","color":"#fff"}).removeClass("liEnter").siblings().addClass("liEnter");
                        });
                        $last.find(".allChannel li").on("click",function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            $last.find(".channel").val($(this).text());
                            $(this).addClass("liActive").siblings().removeClass("liActive");
                            $(".allChannel").css("display","none");
                            var rootId=$(this).attr("data-root-id");
                            list(rootId);
                        });
                        //初始化
                        // var firstRootId=$(".allChannel li").eq(0).attr("data-root-id");
                        // list(firstRootId);
                        $last.find(".allChannel li").eq(channelIndex).triggerHandler("click");
                        //频道列表的响应布局
                        function listHeight() {
                            var resourceHeight=$(".mainDatum .resource").height();
                            var resourceLiHeight=0;
                            $(".mainDatum .resource li").each(function () {
                                resourceLiHeight=resourceLiHeight+$(this).height()+Number($(this).css("margin-bottom").split("px")[0])
                            });
                            if(resourceLiHeight>resourceHeight){
                                $(".mainDatum .resource").css({
                                    "flex":"1"
                                })
                            }else{
                                $(".mainDatum .resource").css({
                                    "flex":""
                                })
                            }
                        }
                        listHeight();
                        $(window).resize(function () {
                            listHeight();
                        });
                        //导入数据库列表的按钮

                        $(".center-head .head-four .headMysql").on("click",function () {
                            var resType,parentFolderID;
                            $(".mainDatum .resource li").each(function (index) {
                                if($(this).hasClass("resourceClick")){
                                    resType=$(this).attr("data-vf-attri");
                                    parentFolderID=$(this).attr("data-vf-id");
                                    console.log(resType&0x0000ffff);
                                    uclient.upload.importResFile (resType&0x0000ffff,parentFolderID,function (seqNo,icode,error,replyBody) {
                                        if(icode>=0){
                                            console.log(replyBody);
                                            uwnd.showDialog("U-Cloud/templates/mainPopup/dataMysql.html", {width:845,height:640},function(info){},function(info){});
                                        }else{
                                            console.log(error)
                                        }
                                    });
                                }
                            });
                        })


                    }else{
                        $(".channelTab").last().find(".allChannel li").remove();
                        $("<div class='bucketBack'>" +
                            "<div class='bucketBack-btn'>" +
                            "<a></a><button>重试</button></div></div>")
                            .find("a").text("加载失败"+stringError)
                            .end().find("button").on("click",function () {
                            getBucketListOne();
                        }).end().appendTo("#main");
                        $("#mainTop #toolBar #close").addClass("offClose");
                        //拖动
                        $(".bucketBack").on("mousedown",function () {
                            return uwnd.drag();
                        });
                        //阻止事件冒泡
                        $(".bucketBack-btn").on("mousedown",function (e) {
                            e.stopPropagation();
                        });
                    }
                });
            }
            getBucketListOne();

            //上传列表
            $(".uploadListBtn").on("click",function () {
                uwnd.showDialog("U-Cloud/templates/mainPopup/dataMysql.html", {width:845,height:640},function(info){},function(info){});
            });
            //下载列表
            $(".downloadListBtn").on("click",function () {
                uwnd.showDialog("U-Cloud/templates/mainPopup/downLoadList.html", {width:845,height:640},function(info){},function(info){});
            });
            //文件夹通知事件
            dotEvent.add_handler("online","/",function (cmd,uri,params,replybody) {
                // console.log(cmd+replybody);
                
            });



            //禁止选中
            document.onselectstart=new Function("event.returnValue=false;");

            // console.log(channelIndex);

        };
    });
});
