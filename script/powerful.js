define(["app","jquery","head"],function (app,$) {
    //功能大全
    //home主控
    app.controller('powerfulController', function ($scope,$rootScope) {

    });
    //站点控
    app.controller('switchSiteController', function ($scope,$rootScope) {
        var site=[];
        $(".powerSite ul li").on("dblclick",function () {
            var lock=true;
            var textName=$(this).find(".powerSite-text h3").text();
            $.each(site,function (i,value) {
                if(textName===value){
                    lock=false;
                }
            });
            if(lock==true){
                site.push(textName);
                uwnd.showPopup("U-Cloud/templates/main/main.html?"+textName, {width:900,height:650,min_width:900,min_height:650} ,function(){},function(info){
                    
                });
            }

        })
    });
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url:"/home",
                views:{
                    "power":{
                        templateUrl: 'power/powerHome.html',
                        controller: 'powerfulController'
                    }
                }
            })
            .state('switchSite', {
                url:"/switchSite",
                views:{
                    "power":{
                        templateUrl: 'power/switchSite.html',
                        controller: 'switchSiteController'
                    }
                }
            });
    });
});
