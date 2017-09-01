/**
 * Created by Kris on 2016/12/14.
 */

/**
 * Created by aa on 2016/8/9.
 */
var tag = 0;
var endTime = Math.round(new Date()/1000);
//当天数据
var fromTimeOfDay = Math.round(new Date() / 1000)-86400;
//五天数据
var fromTimeOfDay5 = Math.round(new Date() / 1000)-432000;
//十天数据
var fromTimeOfDay10 = Math.round(new Date() / 1000)-864000;
//三十天数据
var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
//六十天数据
var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000-5184000-5184000;

var loadflag = 0;


$(function(){
    FastClick.attach(document.body);
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //pageOnload();
    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        jpushEffect();
        function onPause() {
            //此应用程序已被暂停。保存应用程序状态
        }
        function onResume() {
            //此应用程序已被重新激活。恢复应用程序的状态
            jpushEffect();
            window.location.reload();
        }
        setTimeout(function () {
            pageOnload();
        }, 200);
    }
});

function pageOnload() {
    document.getElementById('backpage').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    var screenWidth =document.documentElement.clientWidth;
    var yScrolls,yScrolle,startX,startY,moveEndX,moveEndY, X,Y;
    $("body").on("touchstart", function(e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("body").on("touchend", function(e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && ((X > (screenWidth * 0.33)) || startX < 10)) {
            Gotoback();
            //window.location.href = 'index.html'+'?scroll='+ScrollMain;
            //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+ScrollMain);
            //parent.location='index.html';
        }
    });

}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.location.href = 'index.html';
    //window.location.href = 'chanceSecondary08_ctrlChange.html';
    //slide('right', 'lightblue', 1, 'index.html');
}


function loadend(){
    if(loadflag >= 1){
        loadflag = 0;
        $(".loading").css("display", "none");

        //scollto(thisScroll);
    }else{
        loadflag += 1;
    }

    //$(".loading").css("display", "none");
}
