$(function () {
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        jpushEffect();

        function onPause() {
            //此应用程序已被暂停。保存应用程序状态 
            jpushEffect();

        };

        function onResume() {
            //此应用程序已被重新激活。恢复应用程序的状态 
            jpushEffect();

            window.location.reload();
        };
        setTimeout(function () {
            Touch();
        }, 200);
    };

})
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
}
//返回关于布尔财经
function touchStartBack(event) {
    event.preventDefault();
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    Gotoback();
}



