// 满3位数自动跳到下一个 '.' 后面。
//左右键可以跨input.
// 输入必须是数字限制、0~255 范围限制、
// 根据需要可能添加地址有效性检查、多播地址检查等。
(function ($) {

    $.fn.ipConfig = function (type) {

        return this.each(function () {
            //添加元素
            $("#configDiv").append("<span class='ipText'></span><div class='configInput'></div>");
            for(var i=0;i<4;i++){
                $(".configInput").append("<input class='ipInput' type='text'size='3'maxlength='3'>");
                if(i<3){
                    $(".ipInput").eq(i).after(".");
                }
            }
            //添加元素样式
            $("#configDiv").css({
                "float":"left",
                "line-height":"20px"
            });
            $(".configInput").css({
                "background":"#fff",
                "width":"180px",
                "font-size":"12px",
                "text-align":"center",
                "border":"1px solid #ddd",
                "border-radius":"2px",
                "display":"inline-block"
            });
            $(".ipInput").css({
                "width":"24px",
                "text-align":"center",
                "border":"0"
            });
            //js限制
            $(".ipInput").eq(0).focus();
            $(".ipInput").on("keydown",function (event) {
                // 除了数字键、删除键、ctrl+c,tab,ctrl+v,上下左右之外全部不允许输入
                var k=event.keyCode;
                // console.log(k);
                if((k <= 57 && k >= 48&&!event.shiftKey) || (k <= 105 && k >= 96) || (k==8)|| (k==9)|| (k<=40&&k>=37)||((event.ctrlKey) && (k==67))||((event.ctrlKey) && (k==86))){
                    return true;
                }else if((k==110)||(k==190&&!event.shiftKey)){//点点击
                    if($(this).val()!=""){
                        $(this).next().focus();
                    }
                    return false;
                }else{
                    return false;
                }

            });
            $(".ipInput").on("keyup",function(event){
                $(this).val($(this).val().replace(/[^\d.]/g,''));//特殊情况下起作用
                if((event.keyCode<=57&&event.keyCode>=48)||(event.keyCode<=105&&event.keyCode>=96)){
                    //满三位数切换焦点
                    if($(this).index()!==3){
                        if($(this).val().length==3){
                            $(this).next().focus();
                        }
                    }
                    //数字范围限制
                    var num=Number($(this).val());
                    if(num<0){
                        $(this).val(0);
                    }
                    if(num>255){
                        $(this).val(255);
                    }
                }

            });
            $(".ipInput").on("keydown",function (event) {
                $(this).val($(this).val().replace(/[^\d.]/g,''));//特殊情况下起作用
                //跨input左右键
                //右键
                if($(this).index()!==0){
                    if(event.keyCode==37){
                        if($(this).get(0).selectionStart==0 ){
                            $(this).prev().focus();
                            // $(this).prev().get(0).selectionStart=3;
                            return false;
                        }
                    }
                }
                //左键
                if($(this).index()!==3){
                    if(event.keyCode==39){
                        if($(this).get(0).selectionStart==$(this).val().length){
                            $(this).next().focus();
                            // $(this).next().get(0).selectionStart=0;
                            return false;
                        }
                    }
                }
                //跨input删除键
                if($(this).index()!==0){
                    if(event.keyCode==8){
                        if($(this).val()==="" ){
                            $(this).prev().focus();
                            return false;
                        }
                    }
                }

            });

        });

    };
})(jQuery);