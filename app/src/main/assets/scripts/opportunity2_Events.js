/**
 * Created by aa on 2016/5/6.
 */
var AccessToken;
var nullu = "", NowVerision = "2.0";
var db;
var lt;
var myChartT1;
var option_t1={};
var option_t2={};
var myDate = new Date(); //获取今天日期
var dateArray = [];
var dateTemp;
var flag = 1;

var heatData1=[0,0,0,0,0,0,0];
var heatData2=[0,0,0,0,0,0,0];
var heatData3=[0,0,0,0,0,0,0];
var heatData4=[0,0,0,0,0,0,0];
var heatData5=[0,0,0,0,0,0,0];
var heatData6=[0,0,0,0,0,0,0];
var heatData7=[0,0,0,0,0,0,0];
var heatData8=[0,0,0,0,0,0,0];
var heatData9=[0,0,0,0,0,0,0];
var heatData10=[0,0,0,0,0,0,0];
var heatData11=[0,0,0,0,0,0,0];
var heatData12=[0,0,0,0,0,0,0];
var heatData13=[0,0,0,0,0,0,0];
var heatData14=[0,0,0,0,0,0,0];
var heatData15=[0,0,0,0,0,0,0];
var heatData16=[0,0,0,0,0,0,0];
var heatData17=[0,0,0,0,0,0,0];
var heatData18=[0,0,0,0,0,0,0];
var heatData19=[0,0,0,0,0,0,0];
var heatData20=[0,0,0,0,0,0,0];


//var
var flagp = 0;
var forePage=0;
var tagsI=[];
var tagsID=[];
tagsID[0]="";
var UserId="all";
var hash="587f7a019cde29fd7610b6179b804fbd";
var version="1.0";
var thisScroll = 0;
//var tagSelected = 0;
var tagSelect=0;

$(function () {
    //FastClick.attach(document.body);
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //function onDeviceReady() {
    //    document.addEventListener('pause', onPause.bind(this), false);
    //    document.addEventListener('resume', onResume.bind(this), false);
    //    jpushEffect();
    //    function onPause() {
    //        //此应用程序已被暂停。保存应用程序状态
    //    }
    //    function onResume() {
    //        //此应用程序已被重新激活。恢复应用程序的状态
    //        jpushEffect();
    //        window.location.reload();
    //    }
    //    setTimeout(function () {
    //        pageOnload();
    //    }, 200);
    //}
    pageOnload();

    if( sessionStorage.pageScrollEvt == undefined ){
        sessionStorage.pageScrollEvt = document.body.scrollTop;
        thisScroll = sessionStorage.pageScrollEvt;
        scollto(thisScroll);
    }else{
        thisScroll = sessionStorage.pageScrollEvt;
        scollto(thisScroll);
    }

});

function pageOnload() {
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

    $(".reload").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        sessionStorage.removeItem("pageScrollEvt");
        sessionStorage.removeItem("dataEventsTypeTag");
        location.reload(true);
    });

    if( sessionStorage.dataEventsTypeTag == undefined ){

    }else if( sessionStorage.dataEventsTypeTag == 0 ){
        $(".text1PEvents>.SelectTag").eq(1).removeClass("selected");
        $(".text1PEvents>.SelectTag").eq(0).addClass("selected");
        $(".eventMainBox2").eq(1).removeClass("showed");
        $(".eventMainBox2").eq(0).addClass("showed");
    }else if( sessionStorage.dataEventsTypeTag == 1 ){
        $(".text1PEvents>.SelectTag").eq(0).removeClass("selected");
        $(".text1PEvents>.SelectTag").eq(1).addClass("selected");
        $(".eventMainBox2").eq(0).removeClass("showed");
        $(".eventMainBox2").eq(1).addClass("showed");
    }


    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    myDate.setDate(myDate.getDate() - 6);
    for (var i = 0; i < 7; i++) {
        dateTemp = (myDate.getMonth()+1)+"-"+myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }

    dataload();
}



//加载数据
function dataload(){
    myChartT1 = echarts.init(document.getElementById('chart_p1_t1'));
    httpGet("Reader/Events?category=&sortType=2&count=10","",true,ajax_successM,ajax_failM);
    function ajax_successM(objm){
        if(objm != undefined  && objm != null && objm != "" && objm != []) {
            for (var m = 0; m < objm.length; m++) {
                $(".industryPagingBoxM").append("<div  class='eventsBox'> " +
                "<div class='eventsItemBox1'> " +
                "<div class='eventNum'></div>" +
                "<span class='articleTitle'>事件标题</span> " +
                "<div class='heatdiv'></div></div> " +
                "<div class='eventsItemBox2'> " +
                "<span>更新时间:</span> <span class='issueTime'></span>" +
                "<span>热度持续:</span> <span class='lasting'></span></div>" +
                "<div class='eventsItemBox2 eventStocksList'> " +
                "<span>相关个股:</span> " +
                "<span class='sharesAbout1'></span> " +
                "<span class='sharesAbout2'></span></div>" +
                "<div class='eventsItemBox3'>  " +
                "<div class='eventTag tag1'></div>" +
                "<div class='eventTag tag2'></div>" +
                "<div class='eventTag tag3'></div></div> " +
                "<img class='followBtnPage1B' state='on' src='img/eventAdd.png'> </div>");

                if (objm[m].EventID != null && objm[m].EventID != "") {
                    $(".industryPagingBoxM .eventsBox").eq(m).attr("itemId", objm[m].EventID);
                }
                $(".industryPagingBoxM .articleTitle").eq(m).text(objm[m].Title);

                if( m < 9 ){
                    $(".industryPagingBoxM .eventNum").eq(m).text("0"+(m+1));
                }else{
                    $(".industryPagingBoxM .eventNum").eq(m).text(m+1);
                }

                if( objm[m].HotLevel != 0 && objm[m].HotLevel != null && objm[m].HotLevel != ""){
                    switch(objm[m].HotLevel) {
                        case 0:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 1:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 2:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 3:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 4:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 5:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 6:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 7:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 8:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 9:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>");
                            break;
                        case 10:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>");
                            break;
                        default:
                            $(".industryPagingBoxM .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>");
                    }

                }else{
                    $(".industryPagingBoxM .heatdiv").eq(m).css("display","none");
                }

                if (objm[m].Topic != null && objm[m].Topic != "") {
                    $(".industryPagingBoxM .themeName").eq(m).text(objm[m].Topic.TopicName);
                }
                if( objm[m].LastAppear > 0){
                    $(".industryPagingBoxM  .issueTime").eq(m).text(getTimeDiff(objm[m].LastAppear));
                }
                if (objm[m].FirstAppear > 0) {
                    $(".industryPagingBoxM .lasting").eq(m).text(timeBetween(objm[m].FirstAppear,objm[m].LastAppear));
                }
                if( redTimeDiff(objm[m].LastAppear) == 'colorr'){
                    $(".industryPagingBoxM  .issueTime").eq(m).css("color","#fd3642");
                }

                if (objm[m].RelateStocks != null && objm[m].RelateStocks != "") {
                    if( objm[m].RelateStocks.length == 1 ) {
                        $(".industryPagingBoxM .sharesAbout1").eq(m).text(objm[m].RelateStocks[0].Stock.Name);
                    }else if(objm[m].RelateStocks.length >= 2 ) {
                        $(".industryPagingBoxM .sharesAbout1").eq(m).text(objm[m].RelateStocks[0].Stock.Name);
                        $(".industryPagingBoxM .sharesAbout2").eq(m).text(objm[m].RelateStocks[1].Stock.Name);
                    }
                }else{
                    $(".industryPagingBoxM .eventStocksList").eq(m).css("display","none");
                }

                if( objm[m].Tag == null || objm[m].Tag ==[] || objm[m].Tag.length ==0 ){
                    $(".industryPagingBoxM .Tagpic").eq(m).css("display","none");
                }
                for(var tg = 0; tg < objm[m].Tag.length;tg++){
                    if(tg >= 3){break;}
                    if( tg == (objm[m].Tag.length-1) || tg == 2){
                        $(".industryPagingBoxM .tag"+(tg+1)).eq(m).text(objm[m].Tag[tg]);
                    }else{
                        $(".industryPagingBoxM .tag"+(tg+1)).eq(m).text(objm[m].Tag[tg]);
                    }
                    $(".industryPagingBoxM .tag"+(tg+1)).eq(m).css("display","inline-block");
                }

                for( var datapag = 0; datapag< 10; datapag++ ){
                    if( m == datapag && objm[m].HotHistory != null && objm[m].HotHistory != "" ){
                        for(var h = 0;h <objm[m].HotHistory.length;h++ ){
                            for(var d = 0;d < 7;d++){
                                if( dateArry(objm[m].HotHistory[h].date) == dateArray[d] ){
                                    switch (m){
                                        case 0:heatData1[d] = objm[m].HotHistory[h].hotness;break;
                                        case 1:heatData2[d] = objm[m].HotHistory[h].hotness;break;
                                        case 2:heatData3[d] = objm[m].HotHistory[h].hotness;break;
                                        case 3:heatData4[d] = objm[m].HotHistory[h].hotness;break;
                                        case 4:heatData5[d] = objm[m].HotHistory[h].hotness;break;
                                        case 5:heatData6[d] = objm[m].HotHistory[h].hotness;break;
                                        case 6:heatData7[d] = objm[m].HotHistory[h].hotness;break;
                                        case 7:heatData8[d] = objm[m].HotHistory[h].hotness;break;
                                        case 8:heatData9[d] = objm[m].HotHistory[h].hotness;break;
                                        case 9:heatData10[d] = objm[m].HotHistory[h].hotness;break;
                                        default :break;
                                    }
                                }
                            }
                        }
                    }
                }

            }
            loadend();
            $(".Load_1").css("display","none");
        }

    }
    function ajax_failM(){
        console.log("热门事件加载失败");
        $(".Load_1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load_1 .loadingImg2").on("click",function(){
            $(".Load_1 .loadingImg2").remove();
            $(".Load_1 .notcontent").remove();
            $(".Load_1").html("<img src='img/loading.gif' class='loadingImg2'>");
            httpGet("Reader/Events?category=&sortType=2&count=10","",true,ajax_successM,ajax_failM);
        });

    }

    httpGet("Reader/Events?category=&sortType=0&count=10","",true,ajax_successR,ajax_failR);
    function ajax_successR(objr){
        if(objr != null && objr != "" && objr != [] && objr != undefined){
            for(var m = 0; m < 10;m++){

                $(".industryPagingBoxR").append("<div  class='eventsBox'> " +
                "<div class='eventsItemBox1'> " +
                "<div class='eventNum'></div>" +
                "<span class='articleTitle'>事件标题</span> <div class='heatdiv'></div> </div> " +
                "<div class='eventsItemBox2'> " +
                "<span>更新时间:</span> <span class='issueTime'></span>" +
                "<span>热度持续:</span> <span class='lasting'></span></div>" +
                "<div class='eventsItemBox2 eventStocksList'> " +
                "<span>相关个股:</span> " +
                "<span class='sharesAbout1'></span> <span class='sharesAbout2'></span></div>" +
                "<div class='eventsItemBox3'>  " +
                "<div class='eventTag tag1'></div><div class='eventTag tag2'></div><div class='eventTag tag3'></div></div> " +
                "<img class='followBtnPage1B' state='on' src='img/eventAdd.png'> </div>");


                if( objr[m].EventID != null && objr[m].EventID != ""){
                    $(".industryPagingBoxR .eventsBox").eq(m).attr("itemId",objr[m].EventID);
                }
                $(".industryPagingBoxR .articleTitle").eq(m).text(objr[m].Title);
                if( m < 9 ){
                    $(".industryPagingBoxR .eventNum").eq(m).text("0"+(m+1));
                }else{
                    $(".industryPagingBoxR .eventNum").eq(m).text(m+1);
                }
                if( objr[m].HotLevel != 0 && objr[m].HotLevel != null && objr[m].HotLevel != ""){

                    switch(objr[m].HotLevel) {
                        case 0:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 1:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 2:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 3:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 4:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 5:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 6:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 7:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 8:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heatempty.png'>");
                            break;
                        case 9:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heathalf.png'>");
                            break;
                        case 10:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>");
                            break;
                        default:
                            $(".industryPagingBoxR .heatdiv").eq(m).append("" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>" +
                            "<img class='heatpic' src='img/heat.png'>");
                    }


                }else{
                    $(".industryPagingBoxR .heatdiv").eq(m).css("display","none");
                }
                if( objr[m].LastAppear > 0){
                    $(".industryPagingBoxR  .issueTime").eq(m).text(getTimeDiff(objr[m].LastAppear));
                }
                if (objr[m].FirstAppear > 0) {
                    $(".industryPagingBoxR .lasting").eq(m).text(timeBetween(objr[m].FirstAppear,objr[m].LastAppear));
                }

                if( redTimeDiff(objr[m].LastAppear) == 'colorr'){
                    $(".industryPagingBoxR  .issueTime").eq(m).css("color","#fd3642");
                }
                if( objr[m].RelateStocks != null && objr[m].RelateStocks != "") {
                    if( objr[m].RelateStocks.length == 1 ) {
                        $(".industryPagingBoxR .sharesAbout1").eq(m).text(objr[m].RelateStocks[0].Stock.Name);
                    }else if(objr[m].RelateStocks.length >= 2 ) {
                        $(".industryPagingBoxR .sharesAbout1").eq(m).text(objr[m].RelateStocks[0].Stock.Name);
                        $(".industryPagingBoxR .sharesAbout2").eq(m).text(objr[m].RelateStocks[1].Stock.Name);
                    }
                }else{
                    $(".industryPagingBoxR .eventStocksList").eq(m).css("display","none");
                }
                if( objr[m].Tag == null || objr[m].Tag ==[] || objr[m].Tag.length ==0 ){
                    $(".industryPagingBoxR .Tagpic").eq(m).css("display","none");
                }
                for(var tg = 0; tg < objr[m].Tag.length;tg++){
                    if(tg >= 3){break;}
                    if( tg == (objr[m].Tag.length-1) || tg == 2){
                        $(".industryPagingBoxR .tag"+(tg+1)).eq(m).text(objr[m].Tag[tg]);
                    }else{
                        $(".industryPagingBoxR .tag"+(tg+1)).eq(m).text(objr[m].Tag[tg]);
                    }
                    $(".industryPagingBoxR .tag"+(tg+1)).eq(m).css("display","inline-block");
                }

                for( var datapag = 0; datapag< 10; datapag++ ){
                    if( m == datapag && objr[m].HotHistory != null && objr[m].HotHistory != "" ){
                        for(var h = 0;h <objr[m].HotHistory.length;h++ ){
                            for(var d = 0;d < 7;d++){
                                if( dateArry(objr[m].HotHistory[h].date) == dateArray[d] ){
                                    switch (m){
                                        case 0:heatData11[d] = objr[m].HotHistory[h].hotness;break;
                                        case 1:heatData12[d] = objr[m].HotHistory[h].hotness;break;
                                        case 2:heatData13[d] = objr[m].HotHistory[h].hotness;break;
                                        case 3:heatData14[d] = objr[m].HotHistory[h].hotness;break;
                                        case 4:heatData15[d] = objr[m].HotHistory[h].hotness;break;
                                        case 5:heatData16[d] = objr[m].HotHistory[h].hotness;break;
                                        case 6:heatData17[d] = objr[m].HotHistory[h].hotness;break;
                                        case 7:heatData18[d] = objr[m].HotHistory[h].hotness;break;
                                        case 8:heatData19[d] = objr[m].HotHistory[h].hotness;break;
                                        case 9:heatData20[d] = objr[m].HotHistory[h].hotness;break;
                                        default :break;
                                    }
                                }
                            }
                        }
                    }
                }
            } loadend();
            $(".Load2").css("display","none");
        }
    }
    function ajax_failR(){
        console.log("上升事件加载失败");
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
            httpGet("Reader/Events?category=&sortType=0&count=10","",true,ajax_successR,ajax_failR);
        });
    }


    $(".text1PEvents>.SelectTag").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".text1PEvents>.SelectTag").removeClass("selected");
            $(".eventMainBox2").removeClass("showed");
            $(".eventMainBox2").eq(index).addClass("showed");
            $(this).addClass("selected");
            //console.log(index);
            sessionStorage.dataEventsTypeTag = index;

            if( index == 0 ){
                myChartT1.clear();
                myChartT1.setOption(option_t1);
            }else if( index == 1 ){
                myChartT1.clear();
                myChartT1.setOption(option_t2);
            }
        })
    });




    //pageLocationChange

}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.removeItem("pageScrollEvt");
    sessionStorage.removeItem("dataEventsTypeTag");
    Gotoback();
    //window.location.href = 'index.html'+'?scroll='+ScrollMain;
    //slide('right', 'lightblue', 1, 'opportunityPage1_Main.html'+'?scroll='+ScrollMain);
    //parent.location='opportunityPage1_Main.html';
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function loadend(){
    if(flagp >= 1){
        flagp = 0;
        //$(".loadingPrevent").css("display","none");
        window.scrollTo(0,thisScroll);

        option_t1 = {
            tooltip:{trigger: 'axis'},
            legend:{
                data:['事件1','事件2','事件3','事件4','事件5','事件6','事件7','事件8','事件9','事件10'],
                show:false,
                selected:{
                    '事件1':true, '事件2':false, '事件3':false, '事件4':false, '事件5':false,
                    '事件6':false, '事件7':false, '事件8':false, '事件9':false, '事件10':false
                }
            },
            calculable : true,
            animationDuration:200,
            animationDurationUpdate:300,
            grid:{x:40, y:20, x2:40, y2:30},
            xAxis : [
                {   type : 'category', boundaryGap : false,
                    data : dateArray, axisLine:{onZero:false}}
            ],
            yAxis : [
                {   type : 'value', min:0, splitLine : {show: false},
                    axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}},
                    scale:true
                }
            ],
            series : [
                {   name:'事件1', type:'line', smooth:true, data:heatData1},
                {   name:'事件2', type:'line', smooth:true, data:heatData2},
                {   name:'事件3', type:'line', smooth:true, data:heatData3},
                {   name:'事件4', type:'line', smooth:true, data:heatData4},
                {   name:'事件5', type:'line', smooth:true, data:heatData5},
                {   name:'事件6', type:'line', smooth:true, data:heatData6},
                {   name:'事件7', type:'line', smooth:true, data:heatData7},
                {   name:'事件8', type:'line', smooth:true, data:heatData8},
                {   name:'事件9', type:'line', smooth:true, data:heatData9},
                {   name:'事件10', type:'line', smooth:true, data:heatData10}
            ]
        };
        option_t2 = {
            tooltip:{trigger: 'axis'},
            legend:{
                data:['事件1','事件2','事件3','事件4','事件5','事件6','事件7','事件8','事件9','事件10'],
                show:false,
                selected:{
                    '事件1':true, '事件2':false, '事件3':false, '事件4':false, '事件5':false,
                    '事件6':false, '事件7':false, '事件8':false, '事件9':false, '事件10':false
                }
            },
            calculable : true,
            animationDuration:300,
            animationDurationUpdate:600,
            grid:{x:40, y:20, x2:40, y2:30},
            xAxis : [
                {   type : 'category', boundaryGap : false,
                    data : dateArray, axisLine:{onZero:false}}
            ],
            yAxis : [
                {   type : 'value', min:0, splitLine : {show: false},
                    axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}},
                    scale:true
                }
            ],
            series : [
                {   name:'事件1', type:'line', smooth:true, data:heatData11},
                {   name:'事件2', type:'line', smooth:true, data:heatData12},
                {   name:'事件3', type:'line', smooth:true, data:heatData13},
                {   name:'事件4', type:'line', smooth:true, data:heatData14},
                {   name:'事件5', type:'line', smooth:true, data:heatData15},
                {   name:'事件6', type:'line', smooth:true, data:heatData16},
                {   name:'事件7', type:'line', smooth:true, data:heatData17},
                {   name:'事件8', type:'line', smooth:true, data:heatData18},
                {   name:'事件9', type:'line', smooth:true, data:heatData19},
                {   name:'事件10', type:'line', smooth:true, data:heatData20}
            ]
        };

        myChartT1.setOption(option_t1);


        $(".followBtnPage1B").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                if ($(this).attr("state") == "on") {
                    $(this).attr("state","off");
                    $(this).attr("src","img/eventAdded.png");
                }else {
                    $(this).attr("state","on");
                    $(this).attr("src","img/eventAdd.png");
                }
            })
        });

        $(".followBtnPage1B").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();

                switch (index){
                    case 0:if(option_t1.legend.selected.事件1 == false){
                        option_t1.legend.selected.事件1 = true;
                    }else{option_t1.legend.selected.事件1 = false;}
                        myChartT1.setOption(option_t1);
                        break;
                        case 1:if(option_t1.legend.selected.事件2 == false){
                            option_t1.legend.selected.事件2 = true;
                        }else{option_t1.legend.selected.事件2 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 2:if(option_t1.legend.selected.事件3 == false){
                            option_t1.legend.selected.事件3 = true;
                        }else{option_t1.legend.selected.事件3 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 3:if(option_t1.legend.selected.事件4 == false){
                            option_t1.legend.selected.事件4 = true;
                        }else{option_t1.legend.selected.事件4 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 4:if(option_t1.legend.selected.事件5 == false){
                            option_t1.legend.selected.事件5 = true;
                        }else{option_t1.legend.selected.事件5 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 5:if(option_t1.legend.selected.事件6 == false){
                            option_t1.legend.selected.事件6 = true;
                        }else{option_t1.legend.selected.事件6 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 6:if(option_t1.legend.selected.事件7 == false){
                            option_t1.legend.selected.事件7 = true;
                        }else{option_t1.legend.selected.事件7 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 7:if(option_t1.legend.selected.事件8 == false){
                            option_t1.legend.selected.事件8 = true;
                        }else{option_t1.legend.selected.事件8 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 8:if(option_t1.legend.selected.事件9 == false){
                            option_t1.legend.selected.事件9 = true;
                        }else{option_t1.legend.selected.事件9 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 9:if(option_t1.legend.selected.事件10 == false){
                            option_t1.legend.selected.事件10 = true;
                        }else{option_t1.legend.selected.事件10 = false;}
                            myChartT1.setOption(option_t1);
                            break;
                        case 10:if(option_t2.legend.selected.事件1 == false){
                            option_t2.legend.selected.事件1 = true;
                        }else{option_t2.legend.selected.事件1 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 11:if(option_t2.legend.selected.事件2 == false){
                            option_t2.legend.selected.事件2 = true;
                        }else{option_t2.legend.selected.事件2 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 12:if(option_t2.legend.selected.事件3 == false){
                            option_t2.legend.selected.事件3 = true;
                        }else{option_t2.legend.selected.事件3 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 13:if(option_t2.legend.selected.事件4 == false){
                            option_t2.legend.selected.事件4 = true;
                        }else{option_t2.legend.selected.事件4 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 14:if(option_t2.legend.selected.事件5 == false){
                            option_t2.legend.selected.事件5 = true;
                        }else{option_t2.legend.selected.事件5 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 15:if(option_t2.legend.selected.事件6 == false){
                            option_t2.legend.selected.事件6 = true;
                        }else{option_t2.legend.selected.事件6 = false;}
                            myChartT1.setOption(option_t2);break;
                        case 16:if(option_t2.legend.selected.事件7 == false){
                            option_t2.legend.selected.事件7 = true;
                        }else{option_t2.legend.selected.事件7 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 17:if(option_t2.legend.selected.事件8 == false){
                            option_t2.legend.selected.事件8 = true;
                        }else{option_t2.legend.selected.事件8 = false;}
                            myChartT1.setOption(option_t2);
                            break;
                        case 18:if(option_t2.legend.selected.事件9 == false){
                            option_t2.legend.selected.事件9 = true;
                        }else{option_t2.legend.selected.事件9 = false;}
                        myChartT1.setOption(option_t2);
                        break;
                    case 19:if(option_t2.legend.selected.事件10 == false){
                        option_t2.legend.selected.事件10 = true;
                    }else{option_t2.legend.selected.事件10 = false;}
                        myChartT1.setOption(option_t2);
                        break;
                    default :break;
                }
            })
        });


        $(".eventsBox").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                sessionStorage.pageScrollEvt = document.body.scrollTop;
                AddGoback(localStorage.N_url, 'opportunityPage2o1_EventDetails.html?itemId='+$(this).attr("itemId"));
            })
        });

        $(".industryPagingBoxM  .followBtnPage1B").eq(0).attr("state","off");
        $(".industryPagingBoxM  .followBtnPage1B").eq(0).attr("src","img/eventAdded.png");
        $(".industryPagingBoxR  .followBtnPage1B").eq(0).attr("state","off");
        $(".industryPagingBoxR  .followBtnPage1B").eq(0).attr("src","img/eventAdded.png");
        ////myChartT1.setOption(option_t1);
    }else{
        flagp += 1;
    }

}


function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },0);
}

