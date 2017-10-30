define(function () {
    var time=function (value) {
        var timeH,timeM,timeS;
        var typeTime=value;
        if(Math.floor(typeTime/3600)<10){
            timeH="0"+Math.floor(typeTime/3600)
        }else{
            timeH=Math.floor(typeTime/3600)
        };
        if(Math.floor((typeTime%3600)/60)<10){
            timeM="0"+Math.floor((typeTime%3600)/60)
        }else{
            timeM=Math.floor((typeTime%3600)/60)
        };
        if((typeTime%3600)%60<10){
            timeS="0"+(typeTime%3600)%60
        }else{
            timeS=(typeTime%3600)%60
        }
        return timeH+":"+timeM+":"+timeS;
    };
    var dateType=function (value) {
        var date=new Date();//时间
        date.setTime(value);
        var timeDate=date.toLocaleDateString();
        var timeHour=date.toTimeString().split(" ")[0];
        return timeDate+" "+timeHour
    }
    return {
        time: time,
        dateType:dateType
    };
});
