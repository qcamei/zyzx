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
require(['angular',"app","resource","systemTool","powerful","homeSelf"],function (angular,app,resource,systemTool,powerful,homeSelf) {
    angular.bootstrap(document, ['myapp']);/*手动启动*/
});



