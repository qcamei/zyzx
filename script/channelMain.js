if(typeof(uwnd)!="undefined"){
    uwnd.foreground();
}
pathConfig("../../common/js/");
require.config({
    paths: {
        "jquery_menu":"libs/jquery_menu",
        "backWait":"libs/backWait",
        "dialog":"libs/dialog",
        "time":"libs/time"
    },
    shim:{
        "jquery_menu":{
            deps: ['jquery']
        }
    }
});
require(["angular","app","resource","channelSelf"],function (angular,app,resource,channelSelf) {
    angular.bootstrap(document, ['myapp']);/*手动启动*/
});
