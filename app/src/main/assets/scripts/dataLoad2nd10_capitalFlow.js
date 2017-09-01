/**
 * Created by Kris on 2016/12/19.
 */



var myChartCF;
var option1 = {};

var indexTag = 0;
var timeTag = 0;
var flagp = 0;
var flagNp = 0;

var StockSetTime = new Date();
StockSetTime = StockSetTime.toString();
StockSetTime = StockSetTime.substring(0,16)+"09:00:00"+StockSetTime.substring(24,42);
var fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
var endTime =  Math.round(Date.parse(new Date())/1000);
var twoWeekFromTime =  Math.round(Date.parse(new Date())/1000)-1209600;

//分时图时间轴
var StockTimeAxis = ["09:15"];
//var StockTimeAxis = ["09:30","09:40","09:50","10:00","10:10","10:20","10:30","10:40","10:50","11:00","11:10","11:20","11:30","13:00","13:10","13:20","13:30","13:40","13:50","14:00","14:10","14:20","14:30","14:40","14:50","15:00"];
//分时图数据
var priceOfSHMin = [];
var flowOfSHMin = [];
var settlementOfSHMin = [];
var shMin = 0;
var shMax = 0;

var priceOfCBMin = [];
var flowOfCBMin = [];
var settlementOfCBMin = [];
var cbMin = 0;
var cbMax = 0;

var priceOfSZMin = [];
var flowOfSZMin = [];
var settlementOfSZMin = [];
var szMin = 0;
var szMax = 0;

//五日图时间轴
var timeArr2 = [];
//五日图数据
var indexOfSH=[];
var flowOfSH=[];

var indexOfCB=[];
var flowOfCB=[];

var indexOfSZ=[];
var flowOfSZ=[];

//缓存相关
//var cacheTag = 0 ;
var cacheData01 ;
var cacheData02 ;
var cacheData03 ;
var cacheData04 ;
var cacheData05 ;
var cacheData06 ;
var cacheData07 ;
var cacheData08 ;
var cacheData09 ;
var cacheData10 ;
var cacheData11 ;
var cacheData12 ;
var cacheData13 ;
var cacheData14 ;

$(function () {
    FastClick.attach(document.body);
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
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
        sessionStorage.removeItem("dataCf1");
        sessionStorage.removeItem("dataCf2");
        sessionStorage.removeItem("dataCf3");
        sessionStorage.removeItem("dataCf4");
        sessionStorage.removeItem("dataCf5");
        sessionStorage.removeItem("dataCf6");
        sessionStorage.removeItem("dataCf7");
        sessionStorage.removeItem("dataCf8");
        sessionStorage.removeItem("dataCf9");
        sessionStorage.removeItem("dataCf10");
        sessionStorage.removeItem("dataCf11");
        sessionStorage.removeItem("dataCf12");
        sessionStorage.removeItem("dataCf13");
        sessionStorage.removeItem("dataCf14");
        sessionStorage.removeItem("timeStampCF");
        location.reload(true);
    });

    myChartCF = echarts.init(document.getElementById('chart_p10_cf'));

    option1 = {
        tooltip : {
            trigger: 'axis'
        },
        //calculable : true,
        animationDuration:100,
        legend: {
            data:['大盘价格','昨日收盘','主力净流入'],
            selected:{
                '大盘价格':true, '昨日收盘':true, '主力净流入':true
            },
            show:true,
            icon:'bar',itemGap:30, itemHeight:8, itemWidth:12,
            x:'center', y:'bottom'
        },
        grid:{x:45,x2:40,y:30,y2:45},
        xAxis : [
            {
                type : 'category',
                splitLine:{
                    show:false
                },
                boundaryGap:false,
                data : []
            }
        ],
        yAxis : [
            {
                scale:true,
                type : 'value',
                //boundaryGap:[0.1,0.1],
                splitNumber: 5,
                //precision:1,
                //min:null,
                name : '价格指数(元)'

            },
            {
                name : '资金流(亿元)',
                scale:true,
                type : 'value',
                boundaryGap:[0.1,0.1],
                splitNumber: 5,
                //precision:1,
                splitLine:{
                    show:false
                }


            }
        ],
        series : [
            {
                name:'大盘价格',
                type:'line',
                smooth:true,
                //splitNumber:5,
                itemStyle: {normal: {color:"#333333"}},
                data:[]
            },
            {
                name:'昨日收盘',
                type:'line',
                smooth:true,
                symbolSize:0|0,
                //splitNumber:5,
                itemStyle: {normal: {color:"#FB96FF"}},
                lineStyle:{normal: {type:'dashed'}},
                data:[]
            },
            {
                name:'主力净流入',
                type:'line',
                smooth:true,
                barWidth:18,
                yAxisIndex: 1,
                //splitNumber:5,
                itemStyle: {normal: {color:"#F74C59"},label : {show: true, position: 'bottom'}},
                data:[]
            }
        ]
    };


    //$(".FlowChartDisplay1").css("display","none");
    //加载主力资金流入图表数据
    //    上证分时流入 大盘价格
    //    沪深分时流入 大盘价格
    //    创版分时流入 大盘价格
    //    上证五日流入 大盘价格
    //    沪深五日流入 大盘价格
    //    创版五日流入 大盘价格
    BlockPricesOnload();

    //三日累计个股流入排行
    StockFlowInOnload();
    //三日累计个股流出排行
    StockFlowOutOnload();

    //三日累计主题流入排行
    TopicFlowInOnload();
    //三日累计主题流出排行
    TopicFlowOutOnload();
}

//首页资金流入信息

//三日个股流入排行
function StockFlowInOnload(){

    if( sessionStorage.dataCf11 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/FundFlowGroup?type=0&count=5&forceIn=true","",true,ajax_successSFI,ajax_failSFI);
    }else{
        cacheData11 = JSON.parse(sessionStorage.dataCf11);
        ajax_successSFI(cacheData11);
    }

    function ajax_successSFI(obj){
        sessionStorage.dataCf11=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                $(".StocksFlowInBox").append("" +
                "<tr class='CapitalFlowTableImf'><td> " +
                "<span class='stockName stockLink'></span> " +
                "<span class='stockCode'></span> </td> " +
                "<td class='StocksFlowInPriceChange'></td> " +
                "<td class='StocksMainForceIn'></td> </tr>" +
                "");

                $(".StocksFlowInBox .stockName").eq(i).text(obj[i].Name);
                $(".StocksFlowInBox .stockName").eq(i).attr("itemID",obj[i].ID);
                $(".StocksFlowInBox .stockCode").eq(i).text(stocksIdTransform(obj[i].ID));

                //$(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).text(obj[i].PriceChange);
                if(obj[i].PriceChange >= 0){
                    $(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).text("+"+returnFloat(obj[i].PriceChange)+"%");
                    $(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).css("color","#FD3642");
                }else if(obj[i].PriceChange <0 ){
                    $(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).text(returnFloat(obj[i].PriceChange)+"%");
                    $(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).css("color","#1DBF90");
                }
                $(".StocksFlowInBox .StocksMainForceIn").eq(i).text(returnFloat(obj[i].MainForceIn/10000));
                $(".StocksFlowInBox .StocksMainForceIn").eq(i).css("color","#FD3642");
            }

            $(".StocksFlowInBox .stockName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });

            $(".Load1").css("display","none");

        }
    }

    function ajax_failSFI(obj){
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2'>");
            StockFlowInOnload();
        });
    }

}

//个股流出排行
function StockFlowOutOnload(){

    if( sessionStorage.dataCf12 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/FundFlowGroup?type=0&count=5&forceIn=false","",true,ajax_successSFO,ajax_failSFO);

    }else{
        cacheData12 = JSON.parse(sessionStorage.dataCf12);
        ajax_successSFO(cacheData12);
    }

    function ajax_successSFO(obj){
        sessionStorage.dataCf12=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                $(".StocksFlowOutBox").append("" +
                "<tr class='CapitalFlowTableImf'><td> " +
                "<span class='stockName stockLink'></span> " +
                "<span class='stockCode'></span> </td> " +
                "<td class='StocksFlowInPriceChange'></td> " +
                "<td class='StocksMainForceOut'></td> </tr>" +
                "");

                $(".StocksFlowOutBox .stockName").eq(i).text(obj[i].Name);
                $(".StocksFlowOutBox .stockName").eq(i).attr("itemId",obj[i].ID);
                $(".StocksFlowOutBox .stockCode").eq(i).text(stocksIdTransform(obj[i].ID));

                //$(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).text(obj[i].PriceChange);
                if(obj[i].PriceChange >= 0){
                    $(".StocksFlowOutBox .StocksFlowInPriceChange").eq(i).text("+"+returnFloat(obj[i].PriceChange)+"%");
                    $(".StocksFlowOutBox .StocksFlowInPriceChange").eq(i).css("color","#FD3642");

                }else if(obj[i].PriceChange <0 ){
                    $(".StocksFlowOutBox .StocksFlowInPriceChange").eq(i).text(returnFloat(obj[i].PriceChange)+"%");
                    $(".StocksFlowOutBox .StocksFlowInPriceChange").eq(i).css("color","#1DBF90");
                }

                $(".StocksFlowOutBox .StocksMainForceOut").eq(i).text(returnFloat(obj[i].MainForceOut/10000));
                $(".StocksFlowOutBox .StocksMainForceOut").eq(i).css("color","#1DBF90");
            }


            $(".StocksFlowOutBox .stockName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });

            $(".Load2").css("display","none");
        }
    }

    function ajax_failSFO(obj){

        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
            StockFlowOutOnload();
        });

    }

}

//主题流入
function TopicFlowInOnload(){

    if( sessionStorage.dataCf13 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/FundFlowGroup?type=1&count=5&forceIn=true","",true,ajax_successTFI,ajax_failTFI);

    }else{
        cacheData13 = JSON.parse(sessionStorage.dataCf13);
        ajax_successTFI(cacheData13);
    }

    function ajax_successTFI(obj){
        sessionStorage.dataCf13=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < 5; i++) {
                $(".TopicFlowInBox").append("" +
                "<tr class='CapitalFlowTableImf'>" +
                "<td class='TopicFlowInName topicLink'></td> " +
                "<td class='TopicFlowInPriceChange'></td> " +
                "<td class='TopicMainForceIn'></td> </tr>" +
                "");

                $(".TopicFlowInBox .TopicFlowInName").eq(i).text(obj[i].Name);
                $(".TopicFlowInBox .TopicFlowInName").eq(i).attr("itemId",obj[i].ID);
                //$(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).text(obj[i].PriceChange);
                if(obj[i].PriceChange >= 0){
                    $(".TopicFlowInBox .TopicFlowInPriceChange").eq(i).text("+"+returnFloat(obj[i].PriceChange)+"%");
                    $(".TopicFlowInBox .TopicFlowInPriceChange").eq(i).css("color","#FD3642");
                }else if(obj[i].PriceChange <0 ){
                    $(".TopicFlowInBox .TopicFlowInPriceChange").eq(i).text(returnFloat(obj[i].PriceChange)+"%");
                    $(".TopicFlowInBox .TopicFlowInPriceChange").eq(i).css("color","#1DBF90");
                }
                $(".TopicFlowInBox .TopicMainForceIn").eq(i).text(returnFloat(obj[i].MainForceIn/10000));
                $(".TopicFlowInBox .TopicMainForceIn").eq(i).css("color","#FD3642");
            }

            $(".TopicFlowInBox .TopicFlowInName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });

            $(".Load3").css("display","none");

        }

    }
    function ajax_failTFI(obj){
        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
            TopicFlowInOnload();

        });
    }
}

//主题流出
function TopicFlowOutOnload(){

    if( sessionStorage.dataCf14 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/FundFlowGroup?type=1&count=5&forceIn=false","",true,ajax_successTFO,ajax_failTFO);
    }else{
        cacheData14 = JSON.parse(sessionStorage.dataCf14);
        ajax_successTFO(cacheData14);
    }

    function ajax_successTFO(obj){
        sessionStorage.dataCf14=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < 5; i++) {
                $(".TopicFlowOutBox").append("" +
                "<tr class='CapitalFlowTableImf'>" +
                "<td class='TopicFlowInName topicLink'></td> " +
                "<td class='TopicFlowInPriceChange'></td> " +
                "<td class='TopicMainForceOut'></td> </tr>" +
                "");

                $(".TopicFlowOutBox .TopicFlowInName").eq(i).text(obj[i].Name);
                $(".TopicFlowOutBox .TopicFlowInName").eq(i).attr("itemId",obj[i].ID);

                //$(".StocksFlowInBox .StocksFlowInPriceChange").eq(i).text(obj[i].PriceChange);
                if(obj[i].PriceChange >= 0){
                    $(".TopicFlowOutBox .TopicFlowInPriceChange").eq(i).text("+"+returnFloat(obj[i].PriceChange)+"%");
                    $(".TopicFlowOutBox .TopicFlowInPriceChange").eq(i).css("color","#FD3642");
                }else if(obj[i].PriceChange <0 ){
                    $(".TopicFlowOutBox .TopicFlowInPriceChange").eq(i).text(returnFloat(obj[i].PriceChange)+"%");
                    $(".TopicFlowOutBox .TopicFlowInPriceChange").eq(i).css("color","#1DBF90");
                }
                $(".TopicFlowOutBox .TopicMainForceOut").eq(i).text(returnFloat(obj[i].MainForceOut/10000));
                $(".TopicFlowOutBox .TopicMainForceOut").eq(i).css("color","#1DBF90");
            }


            $(".TopicFlowOutBox .TopicFlowInName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });

            $(".Load4").css("display","none");

        }
    }
    function ajax_failTFO(obj){

        $(".Load4").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load4 .loadingImg2").on("click",function(){
            $(".Load4 .loadingImg2").remove();
            $(".Load4 .notcontent").remove();
            $(".Load4").html("<img src='img/loading.gif' class='loadingImg2'>");
            TopicFlowOutOnload();

        });


    }
}



function BlockPricesOnload() {
    //
    StockTimeAxis[0] = "09:15";
    for( var min = 16 ; min < 60 ; min++ ){
        StockTimeAxis.push("09:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("10:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        StockTimeAxis.push("10:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("11:0"+min);
    }
    for( var min = 10 ; min <= 30 ; min++ ){
        StockTimeAxis.push("11:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("13:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        StockTimeAxis.push("13:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("14:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        StockTimeAxis.push("14:"+min);
    }
    StockTimeAxis.push("15:00");

    openDaySetTime();
    openDateSetDay();

    function openDateSetDay(){
        var timestamp = Date.parse(new Date());
        var dateTemp1 = new Date();
        var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
        var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
        httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=10","",true,ajax_successTD,ajax_failTD);
        function ajax_successTD(obj){
            if( dateDiff1 == obj[0].substring(0,10) ){
                if(  dateDiff3 < 555 ){
                    for(var i = 1; i < 6; i++){
                        timeArr2.unshift(obj[i].substring(5,10));
                    }
                }else if( dateDiff3 >= 555 ){
                    for(var i = 0; i < 5; i++){
                        timeArr2.unshift(obj[i].substring(5,10));
                    }
                }
            }else if( dateDiff1 != obj[0].substring(0,10) ){
                for(var i = 0; i < 5; i++){
                    timeArr2.unshift(obj[i].substring(5,10));
                }
            }
            DayPriceOnload();
        }
        function ajax_failTD(){
            openDateSetDay();
        }
    }

    function DayPriceOnload(){

        //上证
        //天行情
        if( sessionStorage.dataCf1 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
            sessionStorage.timeStampCF=Date.parse(new Date());
            httpGet("Reader/StockHistory?type=0&stockId=sh000001&fromTime=0&endTime=0&count=14","",true,ajax_success11,ajax_fail11);
        }else{
            cacheData01 = JSON.parse(sessionStorage.dataCf1);
            ajax_success11(cacheData01);
        }
        function ajax_success11(obj){
            sessionStorage.dataCf1=JSON.stringify(obj);
            
            if (obj != null && obj != "" && obj != undefined){
                for (var i = 0; i < obj.length; i++) {
                    for(var t = 0; t < timeArr2.length ; t++){
                        if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                            indexOfSH[t] = returnFloat(obj[i].Trade);
                        }else{

                        }
                    }
                }
                loadend();
            }else{
                loadend();
            }
        }
        function ajax_fail11(){
            console.log("上证天行情加载失败");
            $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load6 .loadingImg2").on("click",function(){
                $(".Load6 .loadingImg2").remove();
                $(".Load6 .notcontent").remove();
                $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
                BillboardTrendOnLoad();
            });
            
        }


        //天流入
        if( sessionStorage.dataCf2 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
            sessionStorage.timeStampCF=Date.parse(new Date());
            httpGet("Reader/CapitalFlow/sh000001?type=0&skipHour=2&fromTime="+twoWeekFromTime+"&endTime="+endTime+"&onlyMainForce=true","",true,ajax_success13,ajax_fail13);
        }else{
            cacheData02 = JSON.parse(sessionStorage.dataCf2);
            ajax_success13(cacheData02);
        }

        function ajax_success13(obj){
            sessionStorage.dataCf2=JSON.stringify(obj);

            if (obj != null && obj != "" && obj != undefined){
                for (var i = 0; i < obj.length; i++) {
                    for(var t = 0; t < timeArr2.length ; t++){
                        if( tranTimeStampDate(obj[i].CountTime) == timeArr2[t]){
                                flowOfSH[t] = returnFloat(obj[i].MainForce/10000);
                        }else{

                        }
                    }
                }
                loadend();
            }else{
                loadend();
            }
        }
        function ajax_fail13(){
            console.log("上证天情绪加载失败");
            $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load6 .loadingImg2").on("click",function(){
                $(".Load6 .loadingImg2").remove();
                $(".Load6 .notcontent").remove();
                $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
                BillboardTrendOnLoad();
            });
        }


        //创业板
        //天行情
        if( sessionStorage.dataCf3 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
            sessionStorage.timeStampCF=Date.parse(new Date());
            httpGet("Reader/StockHistory?type=0&stockId=sz399006&fromTime=0&endTime=0&count=14","",true,ajax_success21,ajax_fail21);
        }else{
            cacheData03 = JSON.parse(sessionStorage.dataCf3);
            ajax_success21(cacheData03);
        }

        function ajax_success21(obj){
            sessionStorage.dataCf3=JSON.stringify(obj);

            if (obj != null && obj != "" && obj != undefined){
                for (var i = 0; i < obj.length; i++) {
                    for(var t = 0; t < timeArr2.length ; t++){
                        if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                            indexOfCB[t] = returnFloat(obj[i].Trade);
                        }else{

                        }
                    }
                }
                loadend();
            }else{
                loadend();
            }
        }
        function ajax_fail21(){
            console.log("创版天行情加载失败");
            $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load6 .loadingImg2").on("click",function(){
                $(".Load6 .loadingImg2").remove();
                $(".Load6 .notcontent").remove();
                $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
                BillboardTrendOnLoad();
            });
        }


        //天流入

        if( sessionStorage.dataCf4 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
            sessionStorage.timeStampCF=Date.parse(new Date());
            httpGet("Reader/CapitalFlow/sz399006?type=0&skipHour=2&fromTime="+twoWeekFromTime+"&endTime="+endTime+"&onlyMainForce=true","",true,ajax_success23,ajax_fail23);
        }else{
            cacheData04 = JSON.parse(sessionStorage.dataCf4);
            ajax_success23(cacheData04);
        }

        function ajax_success23(obj){
            sessionStorage.dataCf4=JSON.stringify(obj);

            if (obj != null && obj != "" && obj != undefined){
                for (var i = 0; i < obj.length; i++) {
                    for(var t = 0; t < timeArr2.length ; t++){
                        if( tranTimeStampDate(obj[i].CountTime) == timeArr2[t]){
                            flowOfCB[t] = returnFloat(obj[i].MainForce/10000);
                        }else{
                        }
                    }
                }
                loadend();
            }else{
                loadend();
            }
        }
        function ajax_fail23(){
            console.log("创业天情绪加载失败");
            $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load6 .loadingImg2").on("click",function(){
                $(".Load6 .loadingImg2").remove();
                $(".Load6 .notcontent").remove();
                $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
                BillboardTrendOnLoad();
            });
        }

        //深证
        //天行情

        if( sessionStorage.dataCf5 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
            sessionStorage.timeStampCF=Date.parse(new Date());
            httpGet("Reader/StockHistory?type=0&stockId=sz399001&fromTime=0&endTime=0&count=10","",true,ajax_success31,ajax_fail31);
        }else{
            cacheData05 = JSON.parse(sessionStorage.dataCf5);
            ajax_success31(cacheData05);
        }

        function ajax_success31(obj){
            sessionStorage.dataCf5=JSON.stringify(obj);
            if (obj != null && obj != "" && obj != undefined){
                for (var i = 0; i < obj.length; i++) {
                    for(var t = 0; t < timeArr2.length ; t++){
                        if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                            indexOfSZ[t] = returnFloat(obj[i].Trade);
                        }else{

                        }
                    }
                }
                loadend();
            }else{
                loadend();
            }
        }
        function ajax_fail31(){
            console.log("沪深天行情加载失败");
            $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load6 .loadingImg2").on("click",function(){
                $(".Load6 .loadingImg2").remove();
                $(".Load6 .notcontent").remove();
                $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
                BillboardTrendOnLoad();
            });
            
        }

        //天流入

        if( sessionStorage.dataCf6 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
            sessionStorage.timeStampCF=Date.parse(new Date());
            httpGet("Reader/CapitalFlow/sz399001?type=0&skipHour=1&fromTime="+twoWeekFromTime+"&endTime="+endTime+"&onlyMainForce=true","",true,ajax_success33,ajax_fail33);
        }else{
            cacheData06 = JSON.parse(sessionStorage.dataCf6);
            ajax_success33(cacheData06);
        }

        function ajax_success33(obj){
            sessionStorage.dataCf6=JSON.stringify(obj);
            if (obj != null && obj != "" && obj != undefined){
                for (var i = 0; i < obj.length; i++) {
                    for(var t = 0; t < timeArr2.length ; t++){
                        if( tranTimeStampDate(obj[i].CountTime) == timeArr2[t]){
                            flowOfSZ[t] = returnFloat(obj[i].MainForce/10000);
                        }else{

                        }
                    }
                }
                loadend();
            }else{
                loadend();
            }
        }
        function ajax_fail33(){
            console.log("沪深天情绪加载失败");
            $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load6 .loadingImg2").on("click",function(){
                $(".Load6 .loadingImg2").remove();
                $(".Load6 .notcontent").remove();
                $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
                BillboardTrendOnLoad();
            });
            
        }
    }
}



//
//
//
//分时图新API测试///////////////////////////////////////////////////////////////////////////////////////////////////////

function openDaySetTime(){
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    //var dateDiff2 = parseInt(getNowFormatDate(dateTemp1).substring(11,13));
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));


    //httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=0&count=1","",true,ajax_successTM,ajax_failTM);
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=2","",true,ajax_successTM,ajax_failTM);
    function ajax_successTM(obj){
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 555 ){
                fromTimeOfStockByDay = Date.parse(obj[1])/1000;
                endTime = Date.parse(obj[1])/1000 + 86400;
            }else if( dateDiff3 >= 555 ){
                fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
                endTime = (Date.parse(new Date())/1000);
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            fromTimeOfStockByDay = Date.parse(obj[0])/1000;
            endTime = Date.parse(obj[0])/1000 + 86400;
        }
        //console.log(fromTimeOfStockByDay);
        //console.log(new Date(fromTimeOfStockByDay*1000).toLocaleString());
        //console.log(endTime);
        //console.log(new Date(endTime*1000).toLocaleString());
        NewChartOnload();
    }
    function ajax_failTM(){
        fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
        endTime = (Date.parse(new Date())/1000);
    }

}





//分时图数据加载
function NewChartOnload() {
    //openDaySetTime();
    //endTime = (Date.parse(new Date())/1000);
    //console.log(   );
    //console.log(endTime);
    //console.log(StockTimeAxis);

    for( var ts = 0; ts < StockTimeAxis.length ; ts++){
        priceOfSHMin[ts] = "-";
        flowOfSHMin[ts] = "-";
        settlementOfSHMin[ts] = "-";
        priceOfCBMin[ts] = "-";
        flowOfCBMin[ts] = "-";
        settlementOfCBMin[ts] = "-";
        priceOfSZMin[ts] = "-";
        flowOfSZMin[ts] = "-";
        settlementOfSZMin[ts] = "-";
    }

    //httpGet("Reader/EmotionIndexs/sh000001?type=0&count=30&rate=2&datetime="+endTime+"&fromTime="+fromTimeOfStockByDay,"",true,ajax_successNP1,ajax_failNP1);
    //三指数


    if( sessionStorage.dataCf7 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/StockPrice?type=2&stockIds=sh000001,sz399006,sz399001&fromTime=" + fromTimeOfStockByDay + "&endTime=" + endTime +"&count=0", "", true, ajax_successNP1, ajax_failNP1);
    }else{
        cacheData07 = JSON.parse(sessionStorage.dataCf7);
        ajax_successNP1(cacheData07);
    }

    function ajax_successNP1(obj){
        sessionStorage.dataCf7=JSON.stringify(obj);
        if (obj != null && obj != "" && obj != undefined){
            var absMaxS1 = 0;
            for (var i = 0; i < obj["sh000001"].length; i++) {
                priceOfSHMin[xTimeListStockTransformMin(obj["sh000001"][i][0].substring(11, 16))] = returnFloat(obj["sh000001"][i][1]) ;

                for (var j = 0; j < priceOfSHMin.length; j++) {
                    settlementOfSHMin[j] = returnFloat(obj["sh000001"][i][7]);
                }
                if( Math.abs(  obj["sh000001"][i][1] - obj["sh000001"][i][7] ) >= absMaxS1 ){
                    absMaxS1 = Math.abs( obj["sh000001"][i][1] - obj["sh000001"][i][7] )
                }
            }
            shMax = Math.round( obj["sh000001"][0][7] + absMaxS1 ) + 5;
            shMin = Math.round( obj["sh000001"][0][7] - absMaxS1 ) - 5;

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (priceOfSHMin[t] == "-" ) {
                    priceOfSHMin[t] = priceOfSHMin[t + 1];
                }
            }

            //深证分时数据
            var absMaxS2 = 0;
            for (var i = 0; i < obj["sz399001"].length; i++) {
                priceOfSZMin[xTimeListStockTransformMin(obj["sz399001"][i][0].substring(11, 16))] = returnFloat(obj["sz399001"][i][1]) ;

                for (var j = 0; j < priceOfSZMin.length; j++) {
                    settlementOfSZMin[j] = returnFloat(obj["sz399001"][i][7]);
                }
                if( Math.abs(  obj["sz399001"][i][1] - obj["sz399001"][i][7] ) >= absMaxS2 ){
                    absMaxS2 = Math.abs( obj["sz399001"][i][1] - obj["sz399001"][i][7] )
                }
            }
            szMax = Math.round( obj["sz399001"][0][7] + absMaxS2 ) + 5;
            szMin = Math.round( obj["sz399001"][0][7] - absMaxS2 ) - 5;

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (priceOfSZMin[t] == "-" ) {
                    priceOfSZMin[t] = priceOfSZMin[t + 1];
                }
            }

            //创业板分时数据
            var absMaxS3 = 0;
            for (var i = 0; i < obj["sz399006"].length; i++) {
                priceOfCBMin[xTimeListStockTransformMin(obj["sz399006"][i][0].substring(11, 16))] = returnFloat(obj["sz399006"][i][1]) ;

                for (var j = 0; j < priceOfCBMin.length; j++) {
                    settlementOfCBMin[j] = returnFloat(obj["sz399006"][i][7]);
                }
                if( Math.abs(  obj["sz399006"][i][1] - obj["sz399006"][i][7] ) >= absMaxS3 ){
                    absMaxS3 = Math.abs( obj["sz399006"][i][1] - obj["sz399006"][i][7] )
                }
            }
            cbMax = Math.round( obj["sz399006"][0][7] + absMaxS3 ) + 5;
            cbMin = Math.round( obj["sz399006"][0][7] - absMaxS3 ) - 5;

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (priceOfCBMin[t] == "-" ) {
                    priceOfCBMin[t] = priceOfCBMin[t + 1];
                }
            }
        }
        loadend();
        //console.log("上证指数:");
        //console.log(priceOfSHMin);
    }

    function ajax_failNP1(){
        console.log("加载失败");
        $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load6 .loadingImg2").on("click",function(){
            $(".Load6 .loadingImg2").remove();
            $(".Load6 .notcontent").remove();
            $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
            BillboardTrendOnLoad();
        });
    }



    //上证流入
    //httpGet("Reader/EmotionIndexs/sh000001?type=0&count=30&rate=2&datetime="+endTime+"&fromTime="+fromTimeOfStockByDay,"",true,ajax_successN1,ajax_failN1);


    if( sessionStorage.dataCf8 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/CapitalFlow/sh000001?type=0&skipHour=0.02&fromTime="+fromTimeOfStockByDay+"&endTime="+endTime,"",true,ajax_successN1,ajax_failN1);
    }else{
        cacheData08 = JSON.parse(sessionStorage.dataCf8);
        ajax_successN1(cacheData08);
    }

    function ajax_successN1(obj){
        sessionStorage.dataCf8=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined){
            for(var i = 0 ; i < obj.length; i++ ){
                flowOfSHMin[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=returnFloat(obj[i].MainForce/10000);
            }

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (flowOfSHMin[t] == "-" ) {
                    flowOfSHMin[t] = flowOfSHMin[t + 1];
                }
            }
        }
        loadend();
        //console.log("上证情绪:");
        //console.log(flowOfSHMin);
    }

    function ajax_failN1(){
        console.log("加载失败");
        $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load6 .loadingImg2").on("click",function(){
            $(".Load6 .loadingImg2").remove();
            $(".Load6 .notcontent").remove();
            $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
            BillboardTrendOnLoad();
        });
    }


    //创版流入

    if( sessionStorage.dataCf9 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/CapitalFlow/sz399006?type=0&skipHour=0.02&fromTime="+fromTimeOfStockByDay+"&endTime="+endTime,"",true,ajax_successN2,ajax_failN2);
    }else{
        cacheData09 = JSON.parse(sessionStorage.dataCf9);
        ajax_successN2(cacheData09);
    }

    function ajax_successN2(obj){
        sessionStorage.dataCf9=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined){
            for(var i = 0 ; i < obj.length; i++ ){
                flowOfCBMin[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=returnFloat(obj[i].MainForce/10000);
            }

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (flowOfCBMin[t] == "-" ) {
                    flowOfCBMin[t] = flowOfCBMin[t + 1];
                }
            }
        }
        loadend();
        //console.log("创版情绪:");
        //console.log(flowOfCBMin);
    }

    function ajax_failN2(){
        console.log("加载失败");
        $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load6 .loadingImg2").on("click",function(){
            $(".Load6 .loadingImg2").remove();
            $(".Load6 .notcontent").remove();
            $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
            BillboardTrendOnLoad();
        });
    }


    //深证流入

    if( sessionStorage.dataCf10 == undefined || sessionStorage.timeStampCF == undefined ||(Date.parse(new Date())-sessionStorage.timeStampCF) > 300000){
        sessionStorage.timeStampCF=Date.parse(new Date());
        httpGet("Reader/CapitalFlow/sz399001?type=0&skipHour=0.02&fromTime="+fromTimeOfStockByDay+"&endTime="+endTime,"",true,ajax_successN3,ajax_failN3);
    }else{
        cacheData10 = JSON.parse(sessionStorage.dataCf10);
        ajax_successN3(cacheData10);
    }

    function ajax_successN3(obj){
        sessionStorage.dataCf10=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined){
            for(var i = 0 ; i < obj.length; i++ ){
                flowOfSZMin[xTimeListStockTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=returnFloat(obj[i].MainForce/10000);
            }

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (flowOfSZMin[t] == "-" ) {
                    flowOfSZMin[t] = flowOfSZMin[t + 1];
                }
            }
        }
        loadend();
        //console.log("沪深情绪:");
        //console.log(flowOfSZMin);
    }
    function ajax_failN3(){
        console.log("加载失败");
        $(".Load6").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load6 .loadingImg2").on("click",function(){
            $(".Load6 .loadingImg2").remove();
            $(".Load6 .notcontent").remove();
            $(".Load6").html("<img src='img/loading.gif' class='loadingImg2'>");
            BillboardTrendOnLoad();
        });
    }
    
}


function loadend(){
    if(flagp >= 9){
        myChartCF.clear();
        $(".Load6").css("display","none");
            if( indexTag == 0 ){
                option1.xAxis[0].data = StockTimeAxis;
                if( timeTag == 0 ){
                    option1.yAxis[0].max = shMax;
                    option1.yAxis[0].min = shMin;
                    option1.series[0].data = priceOfSHMin;
                    option1.series[1].data = settlementOfSHMin;
                    option1.series[2].data = flowOfSHMin;
                }else if( timeTag == 1 ){
                    option1.yAxis[0].max = cbMax;
                    option1.yAxis[0].min = cbMin;
                    option1.series[0].data = priceOfCBMin;
                    option1.series[1].data = settlementOfCBMin;
                    option1.series[2].data = flowOfCBMin;
                }else if( timeTag == 2 ){
                    option1.yAxis[0].max = szMax;
                    option1.yAxis[0].min = szMin;
                    option1.series[0].data = priceOfSZMin;
                    option1.series[1].data = settlementOfSZMin;
                    option1.series[2].data = flowOfSZMin;
                }
            }else if( indexTag == 1 ){
                if( timeTag == 0 ){
                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    option1.xAxis[0].data = indexOfSHTime;
                    option1.series[0].data = indexOfSH;
                    option1.series[1].data = [];
                    option1.series[2].data = flowOfSH;
                }else if( timeTag == 1 ){
                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    option1.xAxis[0].data = indexOfSZTime;
                    option1.series[0].data = indexOfCB;
                    option1.series[1].data = [];
                    option1.series[2].data = flowOfCB;
                }else if( timeTag == 2 ){
                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    option1.xAxis[0].data = indexOfHs3Time;
                    option1.series[0].data = indexOfSZ;
                    option1.series[1].data = [];
                    option1.series[2].data = flowOfSZ;
                }
            }else{
                option1.yAxis[0].max = shMax;
                option1.yAxis[0].min = shMin;
                option1.xAxis[0].data = StockTimeAxis;
                option1.series[0].data = priceOfSHMin;
                option1.series[1].data = settlementOfSHMin;
                option1.series[2].data = flowOfSHMin;
            }

            myChartCF.setOption(option1);
        $(".CapitalFlowSwitchBox>.CapitalFlowSwitchBtn").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".CapitalFlowSwitchBox>.CapitalFlowSwitchBtn").removeClass("selected");
                $(this).addClass("selected");

                if( indexTag == 0 ){
                    if(index == 0){
                        myChartCF.clear();
                        option1.yAxis[0].max = shMax;
                        option1.yAxis[0].min = shMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfSHMin;
                        option1.series[1].data = settlementOfSHMin;
                        option1.series[2].data = flowOfSHMin;
                        myChartCF.setOption(option1);
                        timeTag = 0;
                        //console.log("上证天")
                    }else if(index ==1){
                        myChartCF.clear();
                        option1.yAxis[0].max = cbMax;
                        option1.yAxis[0].min = cbMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfCBMin;
                        option1.series[1].data = settlementOfCBMin;
                        option1.series[2].data = flowOfCBMin;
                        myChartCF.setOption(option1);
                        timeTag = 1;
                        //console.log("创业天")
                    }else if(index ==2){
                        myChartCF.clear();
                        option1.yAxis[0].max = szMax;
                        option1.yAxis[0].min = szMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfSZMin;
                        option1.series[1].data = settlementOfSZMin;
                        option1.series[2].data = flowOfSZMin;
                        myChartCF.setOption(option1);
                        timeTag = 2;
                        //console.log("沪深天")
                    }else{
                        myChartCF.clear();
                        option1.yAxis[0].max = shMax;
                        option1.yAxis[0].min = shMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfSHMin;
                        option1.series[1].data = settlementOfSHMin;
                        option1.series[2].data = flowOfSHMin;
                        myChartCF.setOption(option1);
                        timeTag = 0;
                        //console.log("bug")
                    }

                }else if( indexTag == 1 ){
                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    if(index == 0){
                        myChartCF.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfSH;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfSH;
                        myChartCF.setOption(option1);
                        timeTag = 0;
                        //console.log("上证天")
                    }else if(index ==1){
                        myChartCF.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfCB;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfCB;
                        myChartCF.setOption(option1);
                        timeTag = 1;
                        //console.log("创业天")
                    }else if(index ==2){
                        myChartCF.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfSZ;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfSZ;
                        myChartCF.setOption(option1);
                        timeTag = 2;
                        //console.log("沪深天")
                    }else{
                        myChartCF.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfSH;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfSH;
                        myChartCF.setOption(option1);
                        timeTag = 0;
                        //console.log("bug")
                    }

                }
            })
        });



        $(".CapitalFlowTimeSwitchBox>.CapitalFlowTimeSwitchBtn").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".CapitalFlowTimeSwitchBox>.CapitalFlowTimeSwitchBtn").removeClass("selected");
                $(this).addClass("selected");

                if( index == 0){
                    myChartCF.clear();
                    option1.legend.data[1]="昨日收盘";
                    option1.legend.selected.昨日收盘=true;

                    //option1.series[2].type = "line";

                    if( timeTag == 0 ){
                        option1.yAxis[0].max = shMax;
                        option1.yAxis[0].min = shMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfSHMin;
                        option1.series[1].data = settlementOfSHMin;
                        option1.series[2].data = flowOfSHMin;
                        myChartCF.setOption(option1);
                        //console.log("上证天")
                    }else if( timeTag == 1 ){
                        option1.yAxis[0].max = cbMax;
                        option1.yAxis[0].min = cbMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfCBMin;
                        option1.series[1].data = settlementOfCBMin;
                        option1.series[2].data = flowOfCBMin;
                        myChartCF.setOption(option1);
                        //console.log("创业天")
                    }else if( timeTag == 2 ){
                        option1.yAxis[0].max = szMax;
                        option1.yAxis[0].min = szMin;
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.series[0].data = priceOfSZMin;
                        option1.series[1].data = settlementOfSZMin;
                        option1.series[2].data = flowOfSZMin;
                        myChartCF.setOption(option1);
                        //console.log("沪深天")
                    }
                    indexTag = 0;

                }else if( index == 1){
                    myChartCF.clear();
                    option1.legend.selected.昨日收盘 = false;
                    option1.legend.data[1]="隐藏收盘";
                    //option1.series[2].type = "bar";

                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    if( timeTag == 0 ){
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfSH;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfSH;
                        myChartCF.setOption(option1);
                        //console.log("上证天")
                    }else if( timeTag == 1 ){
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfCB;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfCB;
                        myChartCF.setOption(option1);
                        //console.log("创业天")
                    }else if( timeTag == 2 ){
                        option1.xAxis[0].data = timeArr2;
                        option1.series[0].data = indexOfSZ;
                        option1.series[1].data = [];
                        option1.series[2].data = flowOfSZ;
                        myChartCF.setOption(option1);
                        //console.log("沪深天")
                    }
                    indexTag = 1;
                }
            })
        });

        flagp = 0;
    }else{flagp += 1;}
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