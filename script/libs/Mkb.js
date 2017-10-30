define(function () {
    var convert=function (bite) {
        var kit;
        if(bite<1024){
            kit=bite+"B";
            return kit;
        }else if(bite>=1024&&bite<1024*1024){
            // 保留小数点后一位
            kit=Math.round(bite/1024*10)/10+"KB";
            return kit;
        }else if(bite>=1024*1024&&bite<1024*1024*1024){
            // 保留小数点后两位
            kit=Math.round(bite/(1024*1024)*100)/100+"MB";
            return kit;
        }
        else if(bite>=1024*1024*1024){
            // 保留小数点后两位
            kit=Math.round(bite/(1024*1024*1024)*100)/100+"GB";
            return kit;
        }
    };
    return {
        convert: convert
    };
});