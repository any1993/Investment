/**
 * Created by aa on 2016/8/9.
 */

var myChart1;
var myChart2;
var option1 = {};
var option2 = {};
var ItemId = GetQueryString("itemId");
var pageScroll=parseInt(GetQueryString("scroll"));
var hourList = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];


var xTimeList = [];
var xTimeListStock = [];
var stMax = 0;
var stMin = 0;
//var timeArr1=["08:00"];
var settelmentOfStock = [];
var array01=[""];
var array02=[""];
var array03=[""];
var array04=[""];

var timeArr12=[];
var array11=[];
var array12=[];
var array13=[];
var array14=[];

var CapitalFlow1=[0];
var CapitalFlow2=[0];
var CapitalFlow3=[0];
var CapitalFlow4=[0];
var CapitalFlow5=[0];

var capFlag = 0;
var loadflagC = 0;
var loadflagL = 0;


//var endTime = Math.round(new Date() / 1000);
//var fromTimeOfHour = Math.round(new Date() / 1000)-86400;
//var fromTimeOfDay = Math.round(new Date() / 1000)-604800;
//var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
//var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000;
var fromTimeOfDay = Math.round(new Date() / 1000)-1209600;
var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000;

var dateDiff = new Date();
//dateDiff  = dateDiff.toISOString();
var dateDiffN2 = new Date();
//dateDiffN2  = dateDiffN2.toISOString();
var myDateTest = new Date();
var endTime = Math.round(Date.parse(myDateTest)/1000);
var endTimeN2 = Math.round(Date.parse(myDateTest)/1000);
var fromTimeOfHour = Math.round(Date.parse(myDateTest)/ 1000)-86400;
var fromTimeOfHourN2 = Math.round(Date.parse(myDateTest)/ 1000)-86400;




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
    //pageOnload();
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

    //console.log(xTimeListStockTransform("16:57"));
    //console.log(xTimeListStock[xTimeListStockTransform("16:57")]);

    myChart1 = echarts.init(document.getElementById('Chart_BS1'));
    myChart2 = echarts.init(document.getElementById('Chart_Stock'));
    option1 ={
        tooltip : {trigger: 'axis'},
        legend: {
            data:['价格指数','昨日收盘','访问量','发帖量(×1k)','回帖量(×1k)'],
            selected:{
                '价格指数':true, '昨日收盘':true, '访问量':true,'发帖量(×1k)':true,'回帖量(×1k)':true
            },
            y:'bottom',icon:'bar',itemGap:0, itemHeight:8, itemWidth:12},

        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:45,x2:40,y:35,y2:60},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {
                name:"价格指数(元)",
                type : 'value',
                //boundaryGap:0.3,
                splitNumber: 5,
                splitLine : {show: false}, axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}}, scale:true},
            {
                name:"股吧热度",
                type : 'value',
                boundaryGap:[0.1 ,0.3],
                splitNumber: 4,
                min : 0,
                axisLabel : {
                    show:true,
                    formatter: function (value) {
                        // Function formatter
                        if( value >= 1000 ){
                            return value/1000 + 'k'
                        }else{
                            return value
                        }
                    }
                },
                splitLine:{
                    show:false
                }
            }
        ],
        series : [
            {
                name:'价格指数',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#378EFF"
                        //areaStyle: {
                        //    color: "#d3e4fb",
                        //    type: 'default'
                        //}
                    }
                },
                data:[]
            },
            {
                name:'昨日收盘',
                type:'line',
                smooth:true,
                symbolSize:0|0,
                itemStyle: {
                    normal: {
                        color: "#FB96FF"
                    }
                },
                lineStyle:{normal: {type:'dashed'}},
                data:[]
            },
            {
                name:'访问量',
                type:'line',
                smooth:true,
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: "#F992B9"
                    }
                },
                data:[]
            },
            {
                name:'发帖量(×1k)',
                type:'line',
                smooth:true,
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: "#FFD05B"
                    }
                },
                data:[]
            },
            {
                name:'回帖量(×1k)',
                type:'line',
                smooth:true,
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: "#A3AEFB"
                    }
                },
                data:[]
            }
        ]
    };

    option2 ={
        tooltip : {trigger: 'axis'},
        legend: {data:['主力净流入','超大单净流入','大单净流入','中单净流入','小单净流入'],y:'bottom',icon:'bar',itemHeight:8, itemWidth:12,itemGap:20},
        calculable : true,
        animationDuration:100,
        grid:{x:55,x2:30,y:10,y2:85},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {
                //name:"资金流(万)",
                type : 'value'

            }
        ],
        series : [
            {
                name:'主力净流入',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#ff4ea8"
                    }
                },
                data:[]
            },
            {
                name:'超大单净流入',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#bc541e"
                    }
                },
                data:[]
            },
            {
                name:'大单净流入',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#ffb835"
                    }
                },
                data:[]
            },
            {
                name:'中单净流入',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#3e39f8"
                    }
                },
                data:[]
            },
            {
                name:'小单净流入',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#5099fa"
                    }
                },
                data:[]
            }
        ]
    };


    //个股详情信息
    httpGet("Reader/Stock?stockId="+ItemId,"",true,ajax_success02,ajax_fail02);
    function ajax_success02(obj){
        //console.log(obj);

        if(obj.StockName != null && obj.StockName != undefined){
            $(".stockHeadImf .Name").text(obj.StockName);
        }

        if(obj.StockId != null && obj.StockId != undefined){
            $(".stockHeadImf .Code").text("["+stocksIdTransform(obj.StockId)+"]");
        }

        if( obj.Topics != null && obj.Topics != "" && obj.Topics != undefined ){
            if( obj.Topics.length != 0 ){
                for(var t = 0 ;t < obj.Topics.length; t++){
                    $(".stocksAbout .stocksList1").eq(t).text(obj.Topics[t].Block.Name);
                    $(".stocksAbout .stocksList1").eq(t).attr("itemId",obj.Topics[t].Block.ID);

                    $(".tableOfTopicBelong").append("  <tr class='itemOfTopicBelong'> <td class='nameOfTopicBelong'></td> <td class='changeOfTopicBelong'></td> <td class='relevantOfTopicBelong'> <div class='relevantBox'> <div class='relevantFlex'></div> <span class='relevantPercentage'></span> </div> </td> <td class='ledOfTopicBelong'> <span class='ledStockName'>——</span> <span class='ledStockCode'></span> </td> </tr>");

                    $(".tableOfTopicBelong .nameOfTopicBelong").eq(t).text(obj.Topics[t].Block.Name);
                    $(".tableOfTopicBelong .nameOfTopicBelong").eq(t).attr("itemId", obj.Topics[t].Block.ID);

                    if( returnFloat(obj.Topics[t].Block.ChangePercent) > 0){
                        $(".tableOfTopicBelong .changeOfTopicBelong").eq(t).text("+"+returnFloat(obj.Topics[t].Block.ChangePercent)+"%");
                        $(".tableOfTopicBelong .changeOfTopicBelong").eq(t).css("color", "#f74c59");
                    }else if( returnFloat(obj.Topics[t].Block.ChangePercent) == 0){
                        $(".tableOfTopicBelong .changeOfTopicBelong").eq(t).text(returnFloat(obj.Topics[t].Block.ChangePercent)+"%");
                        //$(".tableOfTopicBelong .changeOfTopicBelong").eq(t).css("color", "#333333");
                    }else if( returnFloat(obj.Topics[t].Block.ChangePercent) < 0){
                        $(".tableOfTopicBelong .changeOfTopicBelong").eq(t).text(returnFloat(obj.Topics[t].Block.ChangePercent)+"%");
                        $(".tableOfTopicBelong .changeOfTopicBelong").eq(t).css("color", "#20c062");
                    }

                    //$(".tableOfTopicBelong .changeOfTopicBelong").eq(t).text(Math.round(obj.Topics[t].Block.ChangePercent*100)/100);

                    $(".tableOfTopicBelong .relevantFlex").eq(t).css("width", Math.round(obj.Topics[t].Relativity*100)+"%");
                    $(".tableOfTopicBelong .relevantPercentage").eq(t).text(Math.round(obj.Topics[t].Relativity*100)+"%");


                    if(obj.Topics[t].Block.FSName != null && obj.Topics[t].Block.FSName != undefined ){
                        $(".tableOfTopicBelong .ledStockName").eq(t).text(obj.Topics[t].Block.FSName);
                    }

                    if(obj.Topics[t].Block.FSsymbol != null && obj.Topics[t].Block.FSsymbol != undefined ){
                        $(".tableOfTopicBelong .ledStockCode").eq(t).text(stocksIdTransform(obj.Topics[t].Block.FSsymbol));
                        $(".tableOfTopicBelong .ledStockName").eq(t).attr("itemId",obj.Topics[t].Block.FSsymbol);
                    }
                }


            }else{
                $(".topicBoxDisplay").css("display", "none");
                $(".stocksAbout").css("display", "none");
            }


            $(".tableOfTopicBelong .nameOfTopicBelong").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+"stockID="+ItemId+'&from=barForStock&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPages/opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=toolPages'+'&scroll='+document.body.scrollTop);
                })
            });


            $(".tableOfTopicBelong .ledStockName").each(function () {
                $(this).on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    if( $(this).attr("itemId") != undefined ){
                        //console.log( "个股详情" );
                        AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId")+"&scroll="+document.body.scrollTop);
                    }
                    //window.location.href = "stock.html?stockId="+$(this).attr("itemId")+"&fromPage=topicDetails&topicID="+ItemId+"&from="+backTo+"&scroll="+document.body.scrollTop;
                    //slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=9&fromPage=topicDetail&topicId=' + ItemId + '&from=' + backTo);
                    //parent.location="newsInfo.html?itemid="+$(this).attr('itemId')+"&newsType=9&fromPage=topicDetail&topicId="+ItemId+"&from="+backTo;
                })
            });


            $(".stocksAbout .stocksList1").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+"stockID="+ItemId+'&from=barForStock&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPages/opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=toolPages'+'&scroll='+document.body.scrollTop);
                })
            });

        }else{
            $(".topicBoxDisplay").css("display", "none");
            $(".stocksAbout").css("display", "none");
        }

        if( obj.Sentiment != null && obj.Sentiment != "" && obj.Sentiment != "" && obj.Sentiment != undefined ){
            var tal = obj.Sentiment.NegativePer*100 + obj.Sentiment.NeutralPer*100 + obj.Sentiment.RightPer*100;
            if( tal > 0 ){
                $(".positive").css("width", (parseInt(obj.Sentiment.RightPer * 100000/tal))/10+"%");
                $(".positiveText").text("正面("+ (Math.round(obj.Sentiment.RightPer*1000000/tal))/100+"%)");
                $(".neutral").css("width", (parseInt(obj.Sentiment.NeutralPer * 100000/tal))/10+"%");
                $(".neutralText").text("中立("+ (Math.round(obj.Sentiment.NeutralPer*1000000/tal))/100+"%)");
                $(".negative").css("width", (parseInt(obj.Sentiment.NegativePer * 100000/tal))/10+"%");
                $(".negativeText").text("负面("+ (Math.round(obj.Sentiment.NegativePer*1000000/tal))/100+"%)");


            }else{
                $(".emotionalDisplay").css("display","none");
            }
        }else{
            $(".emotionalDisplay").css("display","none");
        }

        if( obj.Articles != null && obj.Articles != "" && obj.Articles != undefined){
            //if(obj.Articles.length == 0 ){
            //    $(".EventsAboutBoxDisplay").css("display", "none");
            //}
            for(var a = 0 ;a < obj.Articles.length; a++){
                $(".EventsAboutBoxDisplay").append("<div class='eventAbout' itemId='" + obj.Articles[a].Id + "'> <div class='eventTitle'> <span class='eventTitleText'></span> </div> <span class='textTime eventTime'></span>  </div>");
                $(".eventAbout .eventTitleText").eq(a).text(obj.Articles[a].Title);
                $(".eventAbout .eventTime").eq(a).text(obj.Articles[a].PubDate);
            }
        }else{
            $(".EventsAboutBoxDisplay").css("display", "none");
        }



        $(".eventAbout").each(function () {
            $(this).on("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
                AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=1&StockBarId=' + ItemId);
                //window.location.href = 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=1&fromPage=StockBar&StockBarId=' + ItemId;
                //slide('left','lightblue',1,'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=1&fromPage=StockBar&StockBarId=' + ItemId);

            })
        });
        //返回地址
        //window.location.href ='toolPages/tool2_1_BarForStock.html?itemId='+$(this).attr("itemId")

        $(".Load4").css("display", "none");
        //loadendOfChart();

    }
    function ajax_fail02(){
        console.log("加载失败");
        $(".Load4").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load4 .loadingImg2").on("click",function(){
            $(".Load4 .loadingImg2").remove();
            $(".Load4 .notcontent").remove();
            $(".Load4").html("<img src='img/loading.gif' class='loadingImg2'>");
            httpGet("Reader/Stock?stockId="+ItemId,"",true,ajax_success02,ajax_fail02);
        });

    }



    openDaySetTime();
    openDateSetDay();

}

function openDaySetTime(){

    for( var hur = 8; hur < 10; hur++){
        for( var min = 0 ; min < 10 ; min++ ){
            xTimeList.push("0"+hur+":0"+min);
        }
        for( var min = 10 ; min < 60 ; min++ ){
            xTimeList.push("0"+hur+":"+min);
        }
    }
    for( var hur = 10; hur < 22; hur++){
        for( var min = 0 ; min < 10 ; min++ ){
            xTimeList.push(hur+":0"+min);
        }
        for( var min = 10 ; min < 60 ; min++ ){
            xTimeList.push(hur+":"+min);
        }
    }
    xTimeList.push("22:00");


    xTimeListStock[0] = "09:15";
    for( var min = 16 ; min < 60 ; min++ ){
        xTimeListStock.push("09:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        xTimeListStock.push("10:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        xTimeListStock.push("10:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        xTimeListStock.push("11:0"+min);
    }
    for( var min = 10 ; min <= 30 ; min++ ){
        xTimeListStock.push("11:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        xTimeListStock.push("13:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        xTimeListStock.push("13:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        xTimeListStock.push("14:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        xTimeListStock.push("14:"+min);
    }
    xTimeListStock.push("15:00");


    for( var t = 0; t < xTimeList.length ; t++){
        array01[t] = "-";
        array02[t] = "-";
        array03[t] = "-";
        array04[t] = "-";

    }
    for( var ts = 0; ts < xTimeListStock.length ; ts++){
        CapitalFlow1[ts] = "-";
        CapitalFlow2[ts] = "-";
        CapitalFlow3[ts] = "-";
        CapitalFlow4[ts] = "-";
        CapitalFlow5[ts] = "-";
    }

    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
    //httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=0&count=1","",true,ajax_successTM,ajax_failTM);
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=2","",true,ajax_successTM,ajax_failTM);
    function ajax_successTM(obj){
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 480 ){
                dateDiff = obj[1];
                dateDiffN2 = obj[1];
                fromTimeOfHour = Math.round(Date.parse(obj[1])/1000);
                endTime = Math.round(Date.parse(obj[1])/1000) + 86400;
                fromTimeOfHourN2 = Math.round(Date.parse(obj[1])/1000);
                endTimeN2 = Math.round(Date.parse(obj[1])/1000) + 86400;
            }else if( dateDiff3 >= 480  &&  dateDiff3 < 555){
                //dateDiff = new Date();
                dateDiffN2 = obj[1];
                fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
                endTime = Math.round(Date.parse(myDateTest)/1000);
                fromTimeOfHourN2 = Math.round(Date.parse(obj[1])/1000);
                endTimeN2 = Math.round(Date.parse(obj[1])/1000) + 86400;
            }else if( dateDiff3 >= 555){
                dateDiff = new Date();
                dateDiffN2 = new Date();
                fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
                fromTimeOfHourN2 = Math.round((Date.parse(obj[0])/1000));
                endTime = Math.round(Date.parse(myDateTest)/1000);
                endTimeN2 = Math.round(Date.parse(myDateTest)/1000);
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            dateDiff = obj[0];
            dateDiffN2 = obj[0];
            fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
            fromTimeOfHourN2 = Math.round((Date.parse(obj[0])/1000));
            endTime = Math.round(Date.parse(obj[0])/1000) + 86400;
            endTimeN2 = Math.round(Date.parse(obj[0])/1000) + 86400;
        }
        //console.log(dateDiff.getDate());
        //console.log(obj[0]);
        //console.log(Date.parse(obj[1]));
        //console.log(fromTimeOfHour);
        //console.log(new Date(fromTimeOfHour*1000).toLocaleString());
        //console.log(endTime);
        //console.log(new Date(endTime*1000).toLocaleString());
        dateDiff  = dateDiff.toISOString();
        dateDiffN2  = dateDiffN2.toISOString();
        ChartOnload();

        FlowOnload();

    }
    function ajax_failTM(){
        //dateDiff = new Date();
        dateDiffN2 = new Date();
        fromTimeOfHour = Math.round(Date.parse(myDateTest)/1000)-86400;
        fromTimeOfHourN2 = Math.round(Date.parse(myDateTest)/1000)-86400;
        endTime = Math.round(Date.parse(myDateTest)/1000);
        endTimeN2 = Math.round(Date.parse(myDateTest)/1000);
    }
}

function openDateSetDay(){
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=10","",true,ajax_successTD,ajax_failTD);
    function ajax_successTD(obj){
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 555 ){
                for(var i = 1; i < 8; i++){
                    timeArr12.unshift(obj[i].substring(5,10));
                }
            }else if( dateDiff3 >= 555 ){
                for(var i = 0; i < 7; i++){
                    timeArr12.unshift(obj[i].substring(5,10));
                }
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            for(var i = 0; i < 7; i++){
                timeArr12.unshift(obj[i].substring(5,10));
            }
        }
        ChartOnloadOfWeek();
    }
    function ajax_failTD(){
        openDateSetDay();
    }
}


//加载热度价格图表
function ChartOnload(){
//股吧热度值（当天）
    httpGet("Reader/FeverTrend/"+ItemId+"?type=0&skipSecond=600&skipHour=0&fromTime="+fromTimeOfHour+"&endTime="+endTime,"",true,ajax_success03,ajax_fail03);
    function ajax_success03(obj){
        if(obj != null && obj != [] && obj != undefined){
            //dateDiff  = dateDiff.toISOString();
            for(var i = 0 ; i < obj.length; i++ ){
                if( dateDiff.substring(8,10) == tranTimeStampDateDiff(obj[i].CountTime+28800)  &&  parseInt(tranTimeStamp(obj[i].CountTime+28800).substring(0,2)) >= 8){
                    //console.log(xTimeListTransform(tranTimeStamp(obj[i].CountTime)));
                    array02[xTimeListTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].ViewCount;
                    array03[xTimeListTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].PostCount*1000;
                    array04[xTimeListTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].ReplyCount*1000;
                }
            }
            //console.log(timeArr1);

            for (var t = xTimeList.length-1 ; t > 0; t--) {
                if (array02[t] == "-" ) {
                    array02[t] = array02[t+1];
                }

                if (array03[t] == "-" ) {
                    array03[t] = array03[t+1];
                }

                if (array04[t] == "-" ) {
                    array04[t] = array04[t+1];
                }


            }
        }
        option1.xAxis[0].data = xTimeList;
        //option1.xAxis[0].data = timeArr1;
        option1.yAxis[0].max = stMax;
        option1.yAxis[0].min = stMin;
        option1.series[0].data = array01;
        option1.series[1].data = settelmentOfStock;
        option1.series[2].data = array02;
        option1.series[3].data = array03;
        option1.series[4].data = array04;
        //myChart1.setOption(option1);

        loadendOfChart();
    }
    function ajax_fail03(){
        console.log("加载失败");
        loadflagC = 0 ;
        for( var t = 0; t < xTimeList.length ; t++){
            array01[t] = "-";
            array02[t] = "-";
            array03[t] = "-";
            array04[t] = "-";
        }
        timeArr12=[];
        array11=[];
        array12=[];
        array13=[];
        array14=[];
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartBar").css("z-index","-1");
        $(".Load1").css("z-index","5");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            ChartOnload();
            $(".chartBar").css("z-index","1");
        });

    }

    //价格指数（当天）
    httpGet("Reader/StockPrice?type=2&stockIds="+ItemId+"&fromTime="+fromTimeOfHour+"&endTime="+endTime,"",true,ajax_successS1,ajax_failS1);
    function ajax_successS1(obj){
        //console.log(obj);

        if(obj != null && obj != [] && obj != undefined){
            var absMaxS1 = 0;
            //dateDiff = new Date();
            for(var i = 0 ; i < obj[ItemId].length; i++ ){
                if( parseInt(obj[ItemId][i][0].substring(8,10)) == dateDiff.substring(8,10) ) {
                    array01[xTimeListTransformMin(obj[ItemId][i][0].substring(11, 16))] = returnFloat(obj[ItemId][i][1]);
                }
                for( var j = 0; j < xTimeList.length; j++){
                    settelmentOfStock[j]= returnFloat(obj[ItemId][i][7]);
                }
                if( Math.abs(  obj[ItemId][i][1] - obj[ItemId][i][7] ) >= absMaxS1 ){
                    absMaxS1 = Math.abs( obj[ItemId][i][1] - obj[ItemId][i][7] )
                }

            }
            stMax = Math.round( obj[ItemId][0][7] + absMaxS1 + 0.5);
            stMin = Math.round( obj[ItemId][0][7] - absMaxS1 - 0.5);

            for (var t = 419 ; t > 75; t--) {
                if (array01[t] == "-" ) {
                    array01[t] = array01[t+1];
                }
            }

            //console.log(ArrayDisplay01);
            //console.log(array01);
            option1.xAxis[0].data = xTimeList;
            option1.yAxis[0].max = stMax;
            option1.yAxis[0].min = stMin;
            option1.series[0].data = array01;
            option1.series[1].data = settelmentOfStock;
            option1.series[2].data = array02;
            option1.series[3].data = array03;
            option1.series[4].data = array04;
            //myChart1.setOption(option1);
        }
        loadendOfChart();

    }
    function ajax_failS1(){
        console.log("加载失败");
        loadflagC = 0 ;
        for( var t = 0; t < xTimeList.length ; t++){
            array01[t] = "-";
            array02[t] = "-";
            array03[t] = "-";
            array04[t] = "-";
        }
        timeArr12=[];
        array11=[];
        array12=[];
        array13=[];
        array14=[];
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartBar").css("z-index","-1");
        $(".Load1").css("z-index","5");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            ChartOnload();
            $(".chartBar").css("z-index","1");
        });
    }
}

function ChartOnloadOfWeek(){

    //价格指数（七天）
    httpGet("Reader/StockHistory?type=0&stockId="+ItemId+"&fromTime=0&endTime=0&count=14","",true,ajax_successS2,ajax_failS2);
    function ajax_successS2(obj){
        if(obj != null && obj != undefined && obj != [] && obj != ""){
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr12.length ; t++){
                    if( obj[i].Ticktime.substring(5,10) == timeArr12[t]){
                        array11[t] = returnFloat(obj[i].Trade);
                    }else{

                    }
                }
            }

        }
        loadendOfChart();
        httpGet("Reader/FeverTrend/"+ItemId+"?type=0&skipHour=24&fromTime="+fromTimeOfDay+"&endTime="+endTime,"",true,ajax_success04,ajax_fail04);
    }
    function ajax_failS2(){
        console.log("加载失败");
        loadflagC = 0 ;
        for( var t = 0; t < xTimeList.length ; t++){
            array01[t] = "-";
            array02[t] = "-";
            array03[t] = "-";
            array04[t] = "-";
        }
        timeArr12=[];
        array11=[];
        array12=[];
        array13=[];
        array14=[];
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartBar").css("z-index","-1");
        $(".Load1").css("z-index","5");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            ChartOnload();
            $(".chartBar").css("z-index","1");
        });
    }

    //热度指数（七天）
    function ajax_success04(obj){
        if(obj != null && obj != undefined && obj != [] && obj != "") {
            for (var i = 0; i < obj.length; i++) {
                for (var t = 0; t < timeArr12.length; t++) {
                    if( tranTimeStampDate(obj[i].CountTime) == timeArr12[t] ){
                        array12[t] = Math.round(obj[i].ViewCount * 100) / 100;
                        array13[t] = Math.round(obj[i].PostCount * 1000);
                        array14[t] = Math.round(obj[i].ReplyCount * 1000);
                    }else{


                    }
                }
            }
        }
        loadendOfChart();
        //for(var i = 0 ; i < obj.length; i++ ){
        //    timeArr12.push(tranTimeStampDate(obj[i].CountTime));
        //    array12.push(obj[i].BBSHot);
        //    array13.push(obj[i].NewsHot);
        //}
    }
    function ajax_fail04(){
        console.log("加载失败");
        loadflagC = 0 ;
        for( var t = 0; t < xTimeList.length ; t++){
            array01[t] = "-";
            array02[t] = "-";
            array03[t] = "-";
            array04[t] = "-";
        }
        timeArr12=[];
        array11=[];
        array12=[];
        array13=[];
        array14=[];
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartBar").css("z-index","-1");
        $(".Load1").css("z-index","5");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            ChartOnload();
            $(".chartBar").css("z-index","1");
        });
    }
}


function FlowOnload(){
    //资金流向（当天）
    httpGet("Reader/CapitalFlow/"+ItemId+"?type=0&skipHour=0.1&fromTime="+fromTimeOfHourN2+"&endTime="+endTimeN2,"",true,ajax_success05,ajax_fail05);
    function ajax_success05(obj){
        if(obj != null && obj != undefined && obj != [] && obj != "") {
            //dateDiffN2 = new Date();
            for(var i = 0 ; i < obj.length; i++ ){
                if( dateDiffN2.substring(8,10) == tranTimeStampDateDiff(obj[i].CountTime+28800) ){
                    //console.log(xTimeListTransform(tranTimeStamp(obj[i].CountTime)));
                    CapitalFlow1[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].MainForce*100)/100;
                    CapitalFlow2[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].SuperLarge*100)/100;
                    CapitalFlow3[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].Large*100)/100;
                    CapitalFlow4[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].Middle*100)/100;
                    CapitalFlow5[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].Small*100)/100;
                }
            }

            for (var t = xTimeListStock.length-1 ; t > 0; t--) {
                if( CapitalFlow1[t] == "-" ){
                    CapitalFlow1[t] = CapitalFlow1[t+1];
                }
                if( CapitalFlow2[t] == "-" ){
                    CapitalFlow2[t] = CapitalFlow2[t+1] ;
                }
                if( CapitalFlow3[t] == "-" ){
                    CapitalFlow3[t] = CapitalFlow3[t+1] ;
                }
                if( CapitalFlow4[t] == "-" ){
                    CapitalFlow4[t] = CapitalFlow4[t+1];
                }
                if( CapitalFlow5[t] == "-" ){
                    CapitalFlow5[t] = CapitalFlow5[t+1];
                }

            }


        }else{
            $(".chartOfStock").css("display", "none");
            loadend();
        }
        option2.xAxis[0].data = xTimeListStock;
        option2.series[0].data = CapitalFlow1;
        option2.series[1].data = CapitalFlow2;
        option2.series[2].data = CapitalFlow3;
        option2.series[3].data = CapitalFlow4;
        option2.series[4].data = CapitalFlow5;
        loadendOfList();

    }
    function ajax_fail05(){
        //$(".chartOfStock").css("display", "none");
        //loadend();
        console.log("加载失败");
        loadflagL = 0;
        for( var ts = 0; ts < xTimeListStock.length ; ts++){
            CapitalFlow1[ts] = "-";
            CapitalFlow2[ts] = "-";
            CapitalFlow3[ts] = "-";
            CapitalFlow4[ts] = "-";
            CapitalFlow5[ts] = "-";
        }
        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartOfStock").css("z-index","-1");
        $(".Load3").css("z-index","5");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            FlowOnload();
            $(".chartOfStock").css("z-index","1");
        });

    }

    //资金流向（历史）
    httpGet("Reader/HistoryCapitals/"+ItemId+"?type=0&endTime="+endTime+"&count=5","",true,ajax_success06,ajax_fail06);
    function ajax_success06(obj){
        if( obj != null && obj != [] && obj != ""  && obj != undefined){
            for(var i = 0 ; i < obj.length ;i++ ){
                $(".tableOfCapital").append(" <tr class='itemOfCapital'> <td class='timeOfCapital'></td> <td class='priceOfCapital'></td> <td class='changeOfCapital'></td> <td class='netOfCapital'></td> <td class='cumulativeOfCapital'></td> </tr>");

                $(".tableOfCapital .timeOfCapital").eq(i).text(tranTimeStampDate02(obj[i].CountTime));
                $(".tableOfCapital .priceOfCapital").eq(i).text(returnFloat(obj[i].Price));

                if( returnFloat(obj[i].Changepercent) > 0){
                    $(".tableOfCapital .changeOfCapital").eq(i).text("+"+returnFloat(obj[i].Changepercent)+"%");
                    //$(".tableOfTopicBelong .changeOfTopicBelong").eq(t).css("color", "#f74c59");
                }else if( returnFloat(obj[i].Changepercent) == 0){
                    $(".tableOfCapital .changeOfCapital").eq(i).text(returnFloat(obj[i].Changepercent)+"%");
                    $(".tableOfCapital .changeOfCapital").eq(i).css("color", "#333333");
                }else if( returnFloat(obj[i].Changepercent) < 0){
                    $(".tableOfCapital .changeOfCapital").eq(i).text(returnFloat(obj[i].Changepercent)+"%");
                    $(".tableOfCapital .changeOfCapital").eq(i).css("color", "#20c062");
                }

                //if( obj[i].Changepercent >0 ){
                //    $(".tableOfCapital .changeOfCapital").eq(i).text(Math.round(obj[i].Changepercent*100)/100 +"%");
                //}else{
                //    $(".tableOfCapital .changeOfCapital").eq(i).text(Math.round(obj[i].Changepercent*100)/100 +"%");
                //    $(".tableOfCapital .changeOfCapital").eq(i).css("color","#2DC25D");
                //}

                if( returnFloat(obj[i].NetAmount) > 0){
                    $(".tableOfCapital .netOfCapital").eq(i).text("+"+returnFloat(obj[i].NetAmount));
                    //$(".tableOfTopicBelong .changeOfTopicBelong").eq(t).css("color", "#f74c59");
                }else if( returnFloat(obj[i].NetAmount) == 0){
                    $(".tableOfCapital .netOfCapital").eq(i).text(returnFloat(obj[i].NetAmount));
                    $(".tableOfCapital .netOfCapital").eq(i).css("color", "#333333");
                }else if( returnFloat(obj[i].NetAmount) < 0){
                    $(".tableOfCapital .netOfCapital").eq(i).text(returnFloat(obj[i].NetAmount));
                    $(".tableOfCapital .netOfCapital").eq(i).css("color", "#20c062");
                }


                //$(".tableOfCapital .netOfCapital").eq(i).text(Math.round(obj[i].NetAmount*100)/100);
                //if( obj[i].NetAmount < 0 ){
                //    $(".tableOfCapital .netOfCapital").eq(i).css("color","#2DC25D");
                //}


                if( returnFloat(obj[i].Amount) > 0){
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).text("+"+returnFloat(obj[i].Amount));
                    //$(".tableOfTopicBelong .changeOfTopicBelong").eq(t).css("color", "#f74c59");
                }else if( returnFloat(obj[i].Amount) == 0){
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).text(returnFloat(obj[i].Amount));
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).css("color", "#333333");
                }else if( returnFloat(obj[i].Amount) < 0){
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).text(returnFloat(obj[i].Amount));
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).css("color", "#20c062");
                }

                //$(".tableOfCapital .cumulativeOfCapital").eq(i).text(Math.round(obj[i].Amount*100)/100);
                //if( obj[i].Amount < 0 ){
                //    $(".tableOfCapital .cumulativeOfCapital").eq(i).css("color","#2DC25D");
                //}
            }



        }else{
            $(".tableOfCapital").css("display","none");
            loadend();
        }
        loadendOfList();
    }
    function ajax_fail06(){
        //$(".tableOfCapital").css("display","none");
        //loadend();
        console.log("加载失败");
        loadflagL = 0;
        for( var ts = 0; ts < xTimeListStock.length ; ts++){
            CapitalFlow1[ts] = "-";
            CapitalFlow2[ts] = "-";
            CapitalFlow3[ts] = "-";
            CapitalFlow4[ts] = "-";
            CapitalFlow5[ts] = "-";
        }
        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartOfStock").css("z-index","-1");
        $(".Load3").css("z-index","5");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            FlowOnload();
            $(".chartOfStock").css("z-index","1");
        });
    }

}




function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.location.href = 'tool2_0_StockBar.html?scroll='+pageScroll;
    //slide('right', 'lightblue', 1, 'tool2_0_StockBar.html?scroll='+pageScroll);
}



function loadend(){
    if(capFlag >= 1){
        $(".CapitalMainBoxDisplay").css("display","none");
        capFlag = 0;
    }else{capFlag += 1;}
}

//
//
//
//function loadend(){
//    $(".loading").css("display", "none");
//}

function loadendOfChart(){
    if(loadflagC >= 3){
        myChart1.setOption(option1);
        $(".Load1").css("display", "none");
        //scollto(thisScroll);

        $(".switchOfTime>.switchOt").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".switchOfTime>.switchOt").removeClass("thisDisplay");
                $(this).addClass("thisDisplay");
                if( index == 0 ){
                    myChart1.clear();
                    option1.legend.data[1]="昨日收盘";
                    option1.legend.selected.昨日收盘=true;
                    option1.xAxis[0].data = xTimeList;
                    option1.yAxis[0].max = stMax;
                    option1.yAxis[0].min = stMin;
                    option1.series[0].data = array01;
                    option1.series[1].data = settelmentOfStock;
                    option1.series[2].data = array02;
                    option1.series[3].data = array03;
                    option1.series[4].data = array04;
                    myChart1.setOption(option1);
                }else if( index == 1 ){
                    myChart1.clear();
                    option1.legend.data[1]=" 隐藏收盘 ";
                    option1.legend.selected.昨日收盘=false;
                    option1.xAxis[0].data = timeArr12;
                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    option1.series[0].data = array11;
                    option1.series[1].data = [];
                    option1.series[2].data = array12;
                    option1.series[3].data = array13;
                    option1.series[4].data = array14;
                    myChart1.setOption(option1);
                } else{
                    myChart1.clear();
                    option1.legend.data[1]="昨日收盘";
                    option1.legend.selected.昨日收盘=true;
                    option1.xAxis[0].data = xTimeList;
                    option1.yAxis[0].max = stMax;
                    option1.yAxis[0].min = stMin;
                    option1.series[0].data = array01;
                    option1.series[1].data = settelmentOfStock;
                    option1.series[2].data = array02;
                    option1.series[3].data = array03;
                    option1.series[4].data = array04;
                    myChart1.setOption(option1);
                }
            })
        });


        loadflagC = 0;
    }else{
        loadflagC += 1;
    }
    //$(".loading").css("display", "none");
}

function loadendOfList(){
    if(loadflagL >= 1){
        loadflagL = 0;
        myChart2.setOption(option2);
        $(".Load3").css("display", "none");
        //scollto(thisScroll);
    }else{
        loadflagL += 1;
    }
    //$(".loading").css("display", "none");
}