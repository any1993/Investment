/**
 * Created by Kris on 2016/12/19.
 */
$(function () {
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
    //pageOnload();
});

function pageOnload() {
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    //document.getElementById('toMorePages').addEventListener("click", touchMore, false);


    ////状态保存
    //var lcscroll = parseInt(sessionStorage.scrolltopO1);
    //
    ////手动刷新
    //$(".reload").on("click",function(event){
    //    event.stopPropagation();
    //    event.preventDefault();
    //    sessionStorage.removeItem("dataig1");
    //    //console.log(sessionStorage);
    //    location.reload(true);
    //});
    //
    ////判断缓存
    //if( pagehash ==1 || sessionStorage.dataig1 == undefined || sessionStorage.timeStampFP2 == undefined || (Date.parse(new Date())-sessionStorage.timeStampFP2) > 1800000){
    //    sessionStorage.timeStampFP2=Date.parse(new Date());
    //    InvestGroupsOnload();
    //}else{
    //    obj1 = JSON.parse(sessionStorage.dataig1);
    //    InvestGroupsOnDisplay();
    //}

    ////读取缓存
    //function ajax_success1(data){
    //    obj1 = data;
    //    sessionStorage.dataig1=JSON.stringify(obj1);
    //    InvestGroupsOnDisplay();
    //}
    //

    ////多对象拼接
    //var obj = data;
    //sessionStorage.dataig1 = sessionStorage.dataig1.substring(0,sessionStorage.dataig1.length-1)+","+(JSON.stringify(obj)).substring(1,JSON.stringify(obj).length);


}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //parent.location='index.html';
}
//function touchMore(event){
//    event.stopPropagation();
//    event.preventDefault();
//    //window.history.back();
//    //slide('right', 'lightblue', 1, 'index.html');
//    window.location.href ='forecastingPage3_ViewPoints.html';
//    //parent.location='index.html';
//}