/**
 * Created by aa on 2016/8/9.
 */
var myChart1;
var pageScroll=parseInt(GetQueryString("scroll"));

var xTimeList = [];
var shMin = 0;
var shMax = 0;

var timeArr2=[];
var array01=[""];
var array02=[""];
var array03=[""];

var settelmentOfSH = [];
var array11=[];
var array12=[0,0,0,0,0];
var array13=[0,0,0,0,0];

var option1 = {};

var loadflagC = 0;
var loadflagL = 0;

var fromTimeOfDay = Math.round(new Date() / 1000)-604800;
var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000;

var dateDiff  = new Date();
dateDiff  = dateDiff.toISOString();
var myDateTest = new Date();
var endTime = Math.round(Date.parse(myDateTest)/1000);
var fromTimeOfHour = Math.round(Date.parse(myDateTest)/ 1000)-86400;
//var fromTimeOfHour = 1479139200;

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



$(function(){
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
    document.getElementById('backpage').addEventListener("click", touchBack, false);
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
        sessionStorage.removeItem("dataST01");
        sessionStorage.removeItem("dataST02");
        sessionStorage.removeItem("dataST03");
        sessionStorage.removeItem("dataST04");
        sessionStorage.removeItem("dataST05");
        sessionStorage.removeItem("dataST06");
        sessionStorage.removeItem("dataST07");
        sessionStorage.removeItem("dataST08");
        sessionStorage.removeItem("dataST09");
        sessionStorage.removeItem("dataST10");
        sessionStorage.removeItem("dataST11");
        sessionStorage.removeItem("dataST12");
        sessionStorage.removeItem("dataST13");

        sessionStorage.removeItem("timeStampST");
        location.reload(true);
    });

    myChart1 = echarts.init(document.getElementById('Chart_B1'));
    //var endTime = Math.round(new Date()/1000);
    //var fromTimeOfHour = Math.round(new Date() / 1000)-86400;

    option1 ={
        tooltip : {trigger: 'axis'},
        legend: {
            data:['上证指数','昨日收盘','股吧热度','新闻热度(×100)'],
            selected:{
                '上证指数':true, '昨日收盘':true, '股吧热度':true,'新闻热度(×100)':true,'新闻热度':true
            },
            y:'bottom',icon:'bar',itemGap:0, itemHeight:8, itemWidth:12},
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:10,
        grid:{x:45,x2:45,y:35,y2:50},
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
                boundaryGap:0.3,
                splitNumber: 4,
                splitLine : {show: false}, axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}}, scale:true},
            {
                name:"热度指数",
                type : 'value',
                boundaryGap:[0.1 ,0.3],
                min : 0,
                splitNumber: 4,
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
                }
            }
        ],
        series : [
            {
                name:'上证指数',
                type:'line',
                smooth:true,
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: "#333333"
                        //areaStyle: {
                        //    color: "#FFBD0D",
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
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: "#FB96FF"
                    }
                },
                lineStyle:{normal: {type:'dashed'}},
                data:[]
            },
            {
                name:'股吧热度',
                type:'line',
                smooth:true,
                symbol: 'none',
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: "#F992B9"
                    }
                },
                data:[]
            },
            {
                name:'新闻热度(×100)',
                type:'line',
                smooth:true,
                symbol: 'none',
                yAxisIndex:1,
                itemStyle: {
                    //formatter: function (value) {
                    //    // Function formatter
                    //    return value/100
                    //},
                    normal: {
                        color: "#FFD05B"
                    }
                },
                data:[]
            }
        ]
    };


    openDaySetTime();
    openDateSetDay();
    ListOnload();

    $(".switchOfBar>.switchB").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            if( index == 0 ){
                $(".StocksMainBox").addClass("boxDisplay");
                $(".TopicsMainBox").removeClass("boxDisplay");
            }else if( index == 1 ){
                $(".TopicsMainBox").addClass("boxDisplay");
                $(".StocksMainBox").removeClass("boxDisplay");
            }
            $(".switchOfBar>.switchB").removeClass("thisDisplay");
            $(this).addClass("thisDisplay");

        })
    });

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
                    timeArr2.unshift(obj[i].substring(5,10));
                }
            }else if( dateDiff3 >= 555 ){
                for(var i = 0; i < 7; i++){
                    timeArr2.unshift(obj[i].substring(5,10));
                }
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            for(var i = 0; i < 7; i++){
                timeArr2.unshift(obj[i].substring(5,10));
            }
        }
        //console.log(timeArr2);
        ChartOnloadOfWeek();
    }
    function ajax_failTD(){
        openDateSetDay();
    }
}



function openDaySetTime(){
    //xTimeList[0] = "08:00";
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

    //console.log(xTimeList);
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=2","",true,ajax_successTM,ajax_failTM);
    function ajax_successTM(obj){
        //console.log(obj);
        //console.log(dateDiff);
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 480 ){
                dateDiff = obj[1];
                fromTimeOfHour = Math.round(Date.parse(obj[1])/1000);
                endTime = Math.round(Date.parse(obj[1])/1000) + 86400;
            }else if( dateDiff3 >= 480 ){
                dateDiff = new Date();
                dateDiff = dateDiff.toISOString();
                fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
                endTime = Math.round(Date.parse(myDateTest)/1000);
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            dateDiff = obj[0];
            fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
            endTime = Math.round(Date.parse(obj[0])/1000) + 86400;
        }else{
            dateDiff = obj[0];
        }
        //console.log();
        //console.log(dateDiff);
        ChartOnload();
    }
    function ajax_failTM(){
        //dateDiff = new Date();
        fromTimeOfHour = Math.round(Date.parse(myDateTest)/1000)-86400;
        endTime = Math.round(Date.parse(myDateTest)/1000);
    }
}


function ChartOnload(){
    for( var t = 0; t < xTimeList.length ; t++){
        array01[t] = "-";
        array02[t] = "-";
        array03[t] = "-";
    }
    //sh000001
    //个股
    if( sessionStorage.dataST01 == undefined || sessionStorage.timeStampST == undefined ||(Date.parse(new Date())-sessionStorage.timeStampST) > 300000){
        sessionStorage.timeStampST=Date.parse(new Date());
        httpGet("Reader/FeverTrend?type=0&skipSecond=600&skipHour=0&fromTime="+fromTimeOfHour+"&endTime="+endTime,"",true,ajax_success01,ajax_fail01);
    }else{
        cacheData01 = JSON.parse(sessionStorage.dataST01);
        ajax_success01(cacheData01);
    }

    function ajax_success01(obj){
        sessionStorage.dataST01=JSON.stringify(obj);

        if(obj != null && obj != [] && obj != undefined){
            //console.log(dateDiff);
            for(var i = 0 ; i < obj.length; i++ ){
                if( dateDiff.substring(8,10) == tranTimeStampDateDiff(obj[i].CountTime+28800)  &&  parseInt(tranTimeStamp(obj[i].CountTime+28800).substring(0,2)) >= 8){
                //    console.log(xTimeListTransform(tranTimeStamp(obj[i].CountTime)));
                    array02[xTimeListTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].BBSHot;
                    array03[xTimeListTransformMin(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].NewsHot*100;
                }
            }
            //console.log(timeArr1);
        }

        for (var t = xTimeList.length-1 ; t > 0; t--) {
            if (array02[t] == "-" ) {
                array02[t] = array02[t+1];
            }
            if (array03[t] == "-" ) {
                array03[t] = array03[t+1];
            }
        }

        option1.xAxis[0].data = xTimeList;
        option1.yAxis[0].max = shMax;
        option1.yAxis[0].min = shMin;
        option1.series[0].data = array01;
        option1.series[1].data = settelmentOfSH;
        option1.series[2].data = array02;
        option1.series[3].data = array03;
        //myChart1.setOption(option1);
        //console.log(array01);
        //console.log(array02);
        //console.log(array03);
        loadendOfChart();
    }
    function ajax_fail01(){
        console.log("加载失败");
        loadflagC = 0 ;
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

    //APITEST
    if( sessionStorage.dataST02 == undefined || sessionStorage.timeStampST == undefined ||(Date.parse(new Date())-sessionStorage.timeStampST) > 300000){
        sessionStorage.timeStampST=Date.parse(new Date());
        httpGet("Reader/StockPrice?type=2&stockIds=sh000001&fromTime="+fromTimeOfHour+"&endTime="+endTime,"",true,ajax_successS1,ajax_failS1);
    }else{
        cacheData02 = JSON.parse(sessionStorage.dataST02);
        ajax_successS1(cacheData02);
    }

    function ajax_successS1(obj){
        sessionStorage.dataST02=JSON.stringify(obj);

        if(obj != null && obj != [] && obj != "" && obj !=  undefined){
            var absMaxS1 = 0;
            for(var i = 0 ; i < obj["sh000001"].length; i++ ){
                //console.log(xTimeListTransform(obj[i].Ticktime.substring(11, 16)));
                if(  parseInt(obj["sh000001"][i][0].substring(8,10)) == dateDiff.substring(8,10)) {

                    array01[xTimeListTransformMin(obj["sh000001"][i][0].substring(11, 16))] = returnFloat(obj["sh000001"][i][1]);
                    //ArrayDisplay01.push(obj[i].Ticktime.substring(11, 16));
                }
                for( var j = 0; j < xTimeList.length; j++){
                    settelmentOfSH[j]= returnFloat(obj["sh000001"][i][7]);
                }
                if( Math.abs(  obj["sh000001"][i][1] - obj["sh000001"][i][7] ) >= absMaxS1 ){
                    absMaxS1 = Math.abs( obj["sh000001"][i][1] - obj["sh000001"][i][7] )
                }
            }
            shMax = Math.round( obj["sh000001"][0][7] + absMaxS1 ) + 3;
            shMin = Math.round( obj["sh000001"][0][7] - absMaxS1 ) - 3;

            for (var t = 419 ; t > 75; t--) {
                if (array01[t] == "-" ) {
                    array01[t] = array01[t+1];
                }
            }


            //console.log(ArrayDisplay01);
            //console.log(array01);
            option1.xAxis[0].data = xTimeList;
            option1.yAxis[0].max = shMax;
            option1.yAxis[0].min = shMin;
            option1.series[0].data = array01;
            option1.series[1].data = settelmentOfSH;
            option1.series[2].data = array02;
            option1.series[3].data = array03;
            //myChart1.setOption(option1);
            loadendOfChart();
        }else{
            loadendOfChart();
        }

    }
    function ajax_failS1(){
        console.log("加载失败");
        loadflagC = 0 ;
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
    //7天
    if( sessionStorage.dataST03 == undefined || sessionStorage.timeStampST == undefined ||(Date.parse(new Date())-sessionStorage.timeStampST) > 300000){
        sessionStorage.timeStampST=Date.parse(new Date());
        httpGet("Reader/StockHistory?type=0&stockId=sh000001&fromTime=0&endTime=0&count=14","",true,ajax_successS2,ajax_failS2);
    }else{
        cacheData03 = JSON.parse(sessionStorage.dataST03);
        ajax_successS2(cacheData03);
    }

    function ajax_successS2(obj){
        sessionStorage.dataST03=JSON.stringify(obj);

        if(obj != null && obj != undefined && obj != [] && obj != ""){
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                        array11[t] = returnFloat(obj[i].Trade);
                    }else{

                    }
                }
            }
        }
        loadendOfChart();



        if( sessionStorage.dataST04 == undefined || sessionStorage.timeStampST == undefined ||(Date.parse(new Date())-sessionStorage.timeStampST) > 300000){
            sessionStorage.timeStampST=Date.parse(new Date());
            httpGet("Reader/FeverTrend?type=0&skipHour=24&fromTime="+fromTimeOfDay+"&endTime="+endTime,"",true,ajax_success02,ajax_fail02);
        }else{
            cacheData04 = JSON.parse(sessionStorage.dataST04);
            ajax_success02(cacheData04);
        }


    }
    function ajax_failS2(){
        console.log("加载失败");
        loadflagC = 0 ;
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

    //httpGet("Reader/FeverTrend?type=0&skipHour=24&fromTime="+fromTimeOfDay+"&endTime="+endTime,"",true,ajax_success02,ajax_fail02);
    function ajax_success02(obj){
        sessionStorage.dataST04=JSON.stringify(obj);
        //console.log(obj);
        if(obj != null && obj != undefined && obj != [] && obj != "") {
            for (var i = 0; i < obj.length; i++) {
                for (var t = 0; t < timeArr2.length; t++) {
                    if( tranTimeStampDate(obj[i].CountTime) == timeArr2[t] ){
                        array12[t] = returnFloat(obj[i].BBSHot);
                        array13[t] = returnFloat(obj[i].NewsHot);
                    }else{

                    }
                }
            }
        }
        loadendOfChart();
    }
    function ajax_fail02(){
        console.log("加载失败");
        loadflagC = 0 ;
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



function ListOnload(){

    if( sessionStorage.dataST05 == undefined || sessionStorage.timeStampST == undefined ||(Date.parse(new Date())-sessionStorage.timeStampST) > 300000){
        sessionStorage.timeStampST=Date.parse(new Date());
        httpGet("Reader/RankingOfStock?count=10","",true,ajax_success18,ajax_fail18);
    }else{
        cacheData05 = JSON.parse(sessionStorage.dataST05);
        ajax_success18(cacheData05);
    }

    function ajax_success18(obj){
        sessionStorage.dataST05=JSON.stringify(obj);

        if(obj != null && obj != "" && obj != [] && obj != undefined){
            if( obj.length <=3 ){
                for( var sn = 0; sn < obj.length; sn++){
                    $(".barTableOfStocks").append(" <tr  class='barTableContent'> " +
                    "<td><div class='topColorBlock'>"+(sn+1)+"</div></td> " +
                    "<td> <span class='barStocksName'></span> <span class='stocksCode'></span> </td> " +
                    "<td class='theBlock'></td> " +
                    "<td class='attentionDegree'> <span class='barAttentionDegree'></span> <span class='textDivision'>/</span> <span class='newsAttentionDegree'></span> </td> " +
                    "<td class='priceRose'></td> </tr> " +
                    "<tr class='barTableNews stocksNewsBox' ><td class='tableNewsBlock'> <div class='tableNewsBox'></div> </td> </tr>");

                    $(".barTableContent ").eq(sn).attr("itemId", obj[sn].StockID);
                    $(".barTableContent .barStocksName").eq(sn).text(obj[sn].StockName);
                    $(".barTableContent .stocksCode").eq(sn).text(stocksIdTransform(obj[sn].StockID));
                    $(".barTableContent .theBlock").eq(sn).text(obj[sn].RelatedTopicName);



                    if( returnFloat(obj[sn].BBSSpeedPercent) > 0){
                        $(".barTableContent .barAttentionDegree").eq(sn).text("+"+returnFloat(obj[sn].BBSSpeedPercent));
                    }else if( returnFloat(obj[sn].BBSSpeedPercent) == 0){
                        $(".barTableContent .barAttentionDegree").eq(sn).text(returnFloat(obj[sn].BBSSpeedPercent));
                        $(".barTableContent .barAttentionDegree").eq(sn).css("color", "#333333");
                    }else if( returnFloat(obj[sn].BBSSpeedPercent) < 0){
                        $(".barTableContent .barAttentionDegree").eq(sn).text(returnFloat(obj[sn].BBSSpeedPercent));
                        $(".barTableContent .barAttentionDegree").eq(sn).css("color", "#20c062");
                    }

                    if( returnFloat(obj[sn].NewsSpeedPercent) > 0){
                        $(".barTableContent .newsAttentionDegree").eq(sn).text("+"+Math.round(obj[sn].NewsSpeedPercent));
                    }else if( returnFloat(obj[sn].NewsSpeedPercent) == 0){
                        $(".barTableContent .newsAttentionDegree").eq(sn).text(Math.round(obj[sn].NewsSpeedPercent));
                        $(".barTableContent .newsAttentionDegree").eq(sn).css("color", "#333333");
                    }else if( returnFloat(obj[sn].NewsSpeedPercent) < 0){
                        $(".barTableContent .newsAttentionDegree").eq(sn).text(Math.round(obj[sn].NewsSpeedPercent));
                        $(".barTableContent .newsAttentionDegree").eq(sn).css("color", "#20c062");
                    }

                    if( !isNaN(obj[sn].PriceSpeedPercent)){
                        if( obj[sn].PriceSpeedPercent== "-Infinity"){
                            $(".barTableContent .priceRose").eq(sn).text("0.00%");
                            $(".barTableContent .priceRose").eq(sn).css("color", "#333333");
                        }else{
                            if( returnFloat(obj[sn].PriceSpeedPercent) > 0){
                                $(".barTableContent .priceRose").eq(sn).text("+"+returnFloat(obj[sn].PriceSpeedPercent)+"%");
                            }else if( returnFloat(obj[sn].PriceSpeedPercent) == 0){
                                $(".barTableContent .priceRose").eq(sn).text(returnFloat(obj[sn].PriceSpeedPercent)+"%");
                                $(".barTableContent .priceRose").eq(sn).css("color", "#333333");
                            }else if( returnFloat(obj[sn].PriceSpeedPercent) < 0){
                                $(".barTableContent .priceRose").eq(sn).text(returnFloat(obj[sn].PriceSpeedPercent)+"%");
                                $(".barTableContent .priceRose").eq(sn).css("color", "#20c062");
                            }
                        }
                    }else{
                        $(".barTableContent .priceRose").eq(sn).text("0.00%");
                        $(".barTableContent .priceRose").eq(sn).css("color", "#333333");
                    }





                    if(obj[sn].HotPosts != null && obj[sn].HotPosts != "" && obj[sn].HotPosts != []){

                        $(".barTableNews .tableNewsBox").eq(sn).text(obj[sn].HotPosts[0]);
                    }else{
                        $(".stocksNewsBox").eq(sn).css("display","none");
                    }
                }

                $(".barTableContent .topColorBlock").eq(0).css("backgroundColor","#f73333");
                $(".barTableContent .topColorBlock").eq(1).css("backgroundColor","#ff5300");
                $(".barTableContent .topColorBlock").eq(2).css("backgroundColor","#ffb604");
            }else{
                for( var sn3 = 0; sn3 < 3; sn3++){
                    $(".barTableOfStocks").append(" <tr  class='barTableContent'> " +
                    "<td><div class='topColorBlock'>"+(sn3+1)+"</div></td> " +
                    "<td> <span class='barStocksName'></span> <span class='stocksCode'></span> </td> " +
                    "<td class='theBlock'></td> " +
                    "<td class='attentionDegree'> <span class='barAttentionDegree'></span> <span class='textDivision'>/</span> <span class='newsAttentionDegree'></span> </td> " +
                    "<td class='priceRose'></td> </tr> " +
                    "<tr class='barTableNews stocksNewsBox' ><td class='tableNewsBlock'> <div class='tableNewsBox'></div> </td> </tr>");

                    $(".barTableContent ").eq(sn3).attr("itemId", obj[sn3].StockID);
                    $(".barTableContent .barStocksName").eq(sn3).text(obj[sn3].StockName);
                    $(".barTableContent .stocksCode").eq(sn3).text(stocksIdTransform(obj[sn3].StockID));
                    $(".barTableContent .theBlock").eq(sn3).text(obj[sn3].RelatedTopicName);

                    if( returnFloat(obj[sn3].BBSSpeedPercent) > 0){
                        $(".barTableContent .barAttentionDegree").eq(sn3).text("+"+returnFloat(obj[sn3].BBSSpeedPercent));
                    }else if( returnFloat(obj[sn3].BBSSpeedPercent) == 0){
                        $(".barTableContent .barAttentionDegree").eq(sn3).text(returnFloat(obj[sn3].BBSSpeedPercent));
                        $(".barTableContent .barAttentionDegree").eq(sn3).css("color", "#333333");
                    }else if( returnFloat(obj[sn3].BBSSpeedPercent) < 0){
                        $(".barTableContent .barAttentionDegree").eq(sn3).text(returnFloat(obj[sn3].BBSSpeedPercent));
                        $(".barTableContent .barAttentionDegree").eq(sn3).css("color", "#20c062");
                    }

                    if( returnFloat(obj[sn3].NewsSpeedPercent) > 0){
                        $(".barTableContent .newsAttentionDegree").eq(sn3).text("+"+Math.round(obj[sn3].NewsSpeedPercent));
                    }else if( returnFloat(obj[sn3].NewsSpeedPercent) == 0){
                        $(".barTableContent .newsAttentionDegree").eq(sn3).text(Math.round(obj[sn3].NewsSpeedPercent));
                        $(".barTableContent .newsAttentionDegree").eq(sn3).css("color", "#333333");
                    }else if( returnFloat(obj[sn3].NewsSpeedPercent) < 0){
                        $(".barTableContent .newsAttentionDegree").eq(sn3).text(Math.round(obj[sn3].NewsSpeedPercent));
                        $(".barTableContent .newsAttentionDegree").eq(sn3).css("color", "#20c062");
                    }

                    if( !isNaN(obj[sn3].PriceSpeedPercent)){
                        if( obj[sn3].PriceSpeedPercent== "-Infinity"){
                            $(".barTableContent .priceRose").eq(sn3).text("0.00%");
                            $(".barTableContent .priceRose").eq(sn3).css("color", "#333333");
                        }else{
                            if( returnFloat(obj[sn3].PriceSpeedPercent) > 0){
                                $(".barTableContent .priceRose").eq(sn3).text("+"+returnFloat(obj[sn3].PriceSpeedPercent)+"%");
                            }else if( returnFloat(obj[sn3].PriceSpeedPercent) == 0){
                                $(".barTableContent .priceRose").eq(sn3).text(returnFloat(obj[sn3].PriceSpeedPercent)+"%");
                                $(".barTableContent .priceRose").eq(sn3).css("color", "#333333");
                            }else if( returnFloat(obj[sn3].PriceSpeedPercent) < 0){
                                $(".barTableContent .priceRose").eq(sn3).text(returnFloat(obj[sn3].PriceSpeedPercent)+"%");
                                $(".barTableContent .priceRose").eq(sn3).css("color", "#20c062");
                            }
                        }
                    }else{
                        $(".barTableContent .priceRose").eq(sn3).text("0.00%");
                        $(".barTableContent .priceRose").eq(sn3).css("color", "#333333");
                    }


                    if(obj[sn3].HotPosts != null && obj[sn3].HotPosts != "" && obj[sn3].HotPosts != []){
                        $(".barTableNews .tableNewsBox").eq(sn3).text(obj[sn3].HotPosts[0]);
                    }else{
                        $(".stocksNewsBox").eq(sn3).css("display","none");
                    }
                }
                $(".barTableContent .topColorBlock").eq(0).css("backgroundColor","#f73333");
                $(".barTableContent .topColorBlock").eq(1).css("backgroundColor","#ff5300");
                $(".barTableContent .topColorBlock").eq(2).css("backgroundColor","#ffb604");

                for( var sne = 3; sne < obj.length; sne++){
                    $(".barTableOfStocks").append(" <tr  class='barTableContent'> " +
                    "<td><div class='rankNum'>"+(sne+1)+"</div></td> " +
                    "<td> <span class='barStocksName'></span> <span class='stocksCode'></span> </td> " +
                    "<td class='theBlock'></td> " +
                    "<td class='attentionDegree'> <span class='barAttentionDegree'></span> <span class='textDivision'>/</span> <span class='newsAttentionDegree'></span> </td> <td class='priceRose'></td> </tr>");

                    $(".barTableContent ").eq(sne).attr("itemId", obj[sne].StockID);
                    $(".barTableContent .barStocksName").eq(sne).text(obj[sne].StockName);
                    $(".barTableContent .stocksCode").eq(sne).text(stocksIdTransform(obj[sne].StockID));
                    $(".barTableContent .theBlock").eq(sne).text(obj[sne].RelatedTopicName);

                    if( returnFloat(obj[sne].BBSSpeedPercent) > 0){
                        $(".barTableContent .barAttentionDegree").eq(sne).text("+"+returnFloat(obj[sne].BBSSpeedPercent));
                    }else if( returnFloat(obj[sne].BBSSpeedPercent) == 0){
                        $(".barTableContent .barAttentionDegree").eq(sne).text(returnFloat(obj[sne].BBSSpeedPercent));
                        $(".barTableContent .barAttentionDegree").eq(sne).css("color", "#333333");
                    }else if( returnFloat(obj[sne].BBSSpeedPercent) < 0){
                        $(".barTableContent .barAttentionDegree").eq(sne).text(returnFloat(obj[sne].BBSSpeedPercent));
                        $(".barTableContent .barAttentionDegree").eq(sne).css("color", "#20c062");
                    }

                    if( returnFloat(obj[sne].NewsSpeedPercent) > 0){
                        $(".barTableContent .newsAttentionDegree").eq(sne).text("+"+Math.round(obj[sne].NewsSpeedPercent));
                    }else if( returnFloat(obj[sne].NewsSpeedPercent) == 0){
                        $(".barTableContent .newsAttentionDegree").eq(sne).text(Math.round(obj[sne].NewsSpeedPercent));
                        $(".barTableContent .newsAttentionDegree").eq(sne).css("color", "#333333");
                    }else if( returnFloat(obj[sne].NewsSpeedPercent) < 0){
                        $(".barTableContent .newsAttentionDegree").eq(sne).text(Math.round(obj[sne].NewsSpeedPercent));
                        $(".barTableContent .newsAttentionDegree").eq(sne).css("color", "#20c062");
                    }

                    if( !isNaN(obj[sne].PriceSpeedPercent)){
                        if( obj[sne].PriceSpeedPercent== "-Infinity"){
                            $(".barTableContent .priceRose").eq(sne).text("0.00%");
                            $(".barTableContent .priceRose").eq(sne).css("color", "#333333");
                        }else{
                            if( returnFloat(obj[sne].PriceSpeedPercent) > 0){
                                $(".barTableContent .priceRose").eq(sne).text("+"+returnFloat(obj[sne].PriceSpeedPercent)+"%");
                            }else if( returnFloat(obj[sne].PriceSpeedPercent) == 0){
                                $(".barTableContent .priceRose").eq(sne).text(returnFloat(obj[sne].PriceSpeedPercent)+"%");
                                $(".barTableContent .priceRose").eq(sne).css("color", "#333333");
                            }else if( returnFloat(obj[sne].PriceSpeedPercent) < 0){
                                $(".barTableContent .priceRose").eq(sne).text(returnFloat(obj[sne].PriceSpeedPercent)+"%");
                                $(".barTableContent .priceRose").eq(sne).css("color", "#20c062");
                            }
                        }
                    }else{
                        $(".barTableContent .priceRose").eq(sne).text("0.00%");
                        $(".barTableContent .priceRose").eq(sne).css("color", "#333333");
                    }
                }
            }
            $(".tableNewsBox").css("width", (document.documentElement.clientWidth - 30) + "px");
            window.addEventListener("resize", function() {
                $(".tableNewsBox").css("width", (document.documentElement.clientWidth - 30) + "px");
            });
            $(".barTableContent").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'tool2_1_BarForStock.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='tool2_1_BarForStock.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'tool2_1_BarForStock.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                })
            });


        }else{
            $(".stocksFeverBox").css("display", "none");
        }
        loadendOfList();
    }
    function ajax_fail18(){
        console.log("加载失败");
        //$(".barTableOfStocks").css("display", "none");
        loadflagL = 0 ;
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");

        $(".Load2").css("z-index","5");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            ListOnload();
        });
    }




    if( sessionStorage.dataST06 == undefined || sessionStorage.timeStampST == undefined ||(Date.parse(new Date())-sessionStorage.timeStampST) > 300000){
        sessionStorage.timeStampST=Date.parse(new Date());
        httpGet("Reader/RankingOfTopic?count=10","",true,ajax_success19,ajax_fail19);
    }else{
        cacheData06 = JSON.parse(sessionStorage.dataST06);
        ajax_success19(cacheData06);
    }

    function ajax_success19(obj){
        sessionStorage.dataST06=JSON.stringify(obj);

        if(obj != null && obj != "" && obj != [] && obj != undefined){
            if( obj.length <=3 ){
                for( var sn = 0; sn < obj.length; sn++){
                    $(".topicsFeverBox").append("<tr  class='barTopicContent'> " +
                    "<td><div class='topColorBlock'>"+(sn+1)+"</div></td> " +
                    "<td><span class='barTopicName'></span></td> " +
                    "<td class='theBlockHeatRising '></td> " +
                    "<td class='attentionDegree'></td> " +
                    "<td class='ledRising'> <span class='barStocksNameOT'></span> <br><span class='stocksCode'></span> </td> </tr> " +
                    "<tr class='barTableNews topicsNewsBox' > <td class='tableNewsBlock'> <div class='tableNewsBox'> </div> </td> </tr>");

                    $(".barTopicContent ").eq(sn).attr("itemId", obj[sn].TopicID);
                    $(".barTopicContent .barTopicName").eq(sn).text(obj[sn].TopicName);



                    if( returnFloat(obj[sn].HotSpeedPercent) > 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sn).text("+"+returnFloat(obj[sn].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sn).css("color", "#333333");
                    }else if( returnFloat(obj[sn].HotSpeedPercent) == 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sn).text(returnFloat(obj[sn].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sn).css("color", "#333333");
                    }else if( returnFloat(obj[sn].HotSpeedPercent) < 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sn).text(returnFloat(obj[sn].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sn).css("color", "#20c062");
                    }
                    if( returnFloat(obj[sn].PriceSpeedPercent) > 0){
                        $(".barTopicContent .attentionDegree").eq(sn).text("+"+returnFloat(obj[sn].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sn).css("color", "#333333");
                    }else if( returnFloat(obj[sn].PriceSpeedPercent) == 0){
                        $(".barTopicContent .attentionDegree").eq(sn).text(returnFloat(obj[sn].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sn).css("color", "#333333");
                    }else if( returnFloat(obj[sn].PriceSpeedPercent) < 0){
                        $(".barTopicContent .attentionDegree").eq(sn).text(returnFloat(obj[sn].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sn).css("color", "#20c062");
                    }


                    if(obj[sn].RelatedStockName != null && obj[sn].RelatedStockName != "" && obj[sn].RelatedStockName != [] && obj[sn].RelatedStockName != undefined){
                        $(".barTopicContent .barStocksNameOT").eq(sn).text(obj[sn].RelatedStockName);
                    }
                    if(obj[sn].RelatedStockID != null && obj[sn].RelatedStockID != "" && obj[sn].RelatedStockID != [] && obj[sn].RelatedStockID != undefined){
                        $(".barTopicContent .stocksCode").eq(sn).text(stocksIdTransform(obj[sn].RelatedStockID));
                    }

                    if(obj[sn].HotPosts != null && obj[sn].HotPosts != "" && obj[sn].HotPosts != []){

                        $(".topicsNewsBox .tableNewsBox").eq(sn).text(obj[sn].HotPosts[0]);
                    }else{
                        $(".topicsNewsBox").eq(sn).css("display","none");
                    }
                }
                $(".barTopicContent .topColorBlock").eq(0).css("backgroundColor","#f73333");
                $(".barTopicContent .topColorBlock").eq(1).css("backgroundColor","#ff5300");
                $(".barTopicContent .topColorBlock").eq(2).css("backgroundColor","#ffb604");
            }else{
                for( var sn3 = 0; sn3 < 3; sn3++){
                    $(".topicsFeverBox").append("<tr  class='barTopicContent'> " +
                    "<td><div class='topColorBlock'>"+(sn3+1)+"</div></td> " +
                    "<td><span class='barTopicName'></span></td> " +
                    "<td class='theBlockHeatRising'></td> " +
                    "<td class='attentionDegree'></td> " +
                    "<td class='ledRising'> <span class='barStocksNameOT'></span> <br><span class='stocksCode'></span> </td> </tr> " +
                    "<tr class='barTableNews topicsNewsBox' > <td class='tableNewsBlock'> <div class='tableNewsBox'> </div> </td> </tr>");

                    $(".barTopicContent ").eq(sn3).attr("itemId", obj[sn3].TopicID);
                    $(".barTopicContent .barTopicName").eq(sn3).text(obj[sn3].TopicName);

                    if( returnFloat(obj[sn3].HotSpeedPercent) > 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sn3).text("+"+returnFloat(obj[sn3].HotSpeedPercent)+"%");
                    }else if( returnFloat(obj[sn3].HotSpeedPercent) == 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sn3).text(returnFloat(obj[sn3].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sn3).css("color", "#333333");
                    }else if( returnFloat(obj[sn3].HotSpeedPercent) < 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sn3).text(returnFloat(obj[sn3].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sn3).css("color", "#20c062");
                    }
                    if( returnFloat(obj[sn3].PriceSpeedPercent) > 0){
                        $(".barTopicContent .attentionDegree").eq(sn3).text("+"+returnFloat(obj[sn3].PriceSpeedPercent)+"%");
                    }else if( returnFloat(obj[sn3].PriceSpeedPercent) == 0){
                        $(".barTopicContent .attentionDegree").eq(sn3).text(returnFloat(obj[sn3].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sn3).css("color", "#333333");
                    }else if( returnFloat(obj[sn3].PriceSpeedPercent) < 0){
                        $(".barTopicContent .attentionDegree").eq(sn3).text(returnFloat(obj[sn3].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sn3).css("color", "#20c062");
                    }

                    if(obj[sn3].RelatedStockName != null && obj[sn3].RelatedStockName != "" && obj[sn3].RelatedStockName != [] && obj[sn3].RelatedStockName != undefined){
                        $(".barTopicContent .barStocksNameOT").eq(sn3).text(obj[sn3].RelatedStockName);
                    }
                    if(obj[sn3].RelatedStockID != null && obj[sn3].RelatedStockID != "" && obj[sn3].RelatedStockID != [] && obj[sn3].RelatedStockID != undefined){
                        $(".barTopicContent .stocksCode").eq(sn3).text(stocksIdTransform(obj[sn3].RelatedStockID));
                    }

                    if(obj[sn3].HotPosts != null && obj[sn3].HotPosts != "" && obj[sn3].HotPosts != []){

                        $(".topicsNewsBox .tableNewsBox").eq(sn3).text(obj[sn3].HotPosts[0]);
                    }else{
                        $(".topicsNewsBox").eq(sn3).css("display","none");
                    }
                }
                $(".barTopicContent .topColorBlock").eq(0).css("backgroundColor","#f73333");
                $(".barTopicContent .topColorBlock").eq(1).css("backgroundColor","#ff5300");
                $(".barTopicContent .topColorBlock").eq(2).css("backgroundColor","#ffb604");

                for( var sne = 3; sne < obj.length; sne++){
                    $(".topicsFeverBox").append(" <tr  class='barTopicContent'> " +
                    "<td><div class='rankNum'>"+(sne+1)+"</div></td> " +
                    "<td><span class='barTopicName'></span></td> " +
                    "<td class='theBlockHeatRising'></td> " +
                    "<td class='attentionDegree'></td> " +
                    "<td class='ledRising'> <span class='barStocksNameOT'></span><br> <span class='stocksCode'></span> </td> </tr>");

                    $(".barTopicContent ").eq(sne).attr("itemId", obj[sne].TopicID);
                    $(".barTopicContent .barTopicName").eq(sne).text(obj[sne].TopicName);


                    if( returnFloat(obj[sne].HotSpeedPercent) > 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sne).text("+"+returnFloat(obj[sne].HotSpeedPercent)+"%");
                    }else if( returnFloat(obj[sne].HotSpeedPercent) == 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sne).text(returnFloat(obj[sne].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sne).css("color", "#333333");
                    }else if( returnFloat(obj[sne].HotSpeedPercent) < 0){
                        $(".barTopicContent .theBlockHeatRising").eq(sne).text(returnFloat(obj[sne].HotSpeedPercent)+"%");
                        $(".barTopicContent .theBlockHeatRising").eq(sne).css("color", "#20c062");
                    }
                    if( returnFloat(obj[sne].PriceSpeedPercent) > 0){
                        $(".barTopicContent .attentionDegree").eq(sne).text("+"+returnFloat(obj[sne].PriceSpeedPercent)+"%");
                    }else if( returnFloat(obj[sne].PriceSpeedPercent) == 0){
                        $(".barTopicContent .attentionDegree").eq(sne).text(returnFloat(obj[sne].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sne).css("color", "#333333");
                    }else if( returnFloat(obj[sne].PriceSpeedPercent) < 0){
                        $(".barTopicContent .attentionDegree").eq(sne).text(returnFloat(obj[sne].PriceSpeedPercent)+"%");
                        $(".barTopicContent .attentionDegree").eq(sne).css("color", "#20c062");
                    }



                    if(obj[sne].RelatedStockName != null && obj[sne].RelatedStockName != "" && obj[sne].RelatedStockName != [] && obj[sne].RelatedStockName != undefined){
                        $(".barTopicContent .barStocksNameOT").eq(sne).text(obj[sne].RelatedStockName);
                    }
                    if(obj[sne].RelatedStockID != null && obj[sne].RelatedStockID != "" && obj[sne].RelatedStockID != [] && obj[sne].RelatedStockID != undefined){
                        $(".barTopicContent .stocksCode").eq(sne).text(stocksIdTransform(obj[sne].RelatedStockID));
                    }
                }

            }

            $(".tableNewsBox").css("width", (document.documentElement.clientWidth - 30) + "px");
            window.addEventListener("resize", function() {
                $(".tableNewsBox").css("width", (document.documentElement.clientWidth - 30) + "px");
            });
        }else{
            $(".topicFeverBox").css("display", "none");
        }


        $(".barTopicContent").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                AddGoback(localStorage.N_url, 'tool2_2_BarForTopic.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                //window.location.href ='tool2_2_BarForTopic.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                //slide('left','lightblue',1,'tool2_2_BarForTopic.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
            })
        });
        loadendOfList();
    }
    function ajax_fail19(){
        //$(".topicsFeverBox").css("display", "none");
        console.log("加载失败");
        loadflagL = 0 ;
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");

        $(".Load2").css("z-index","5");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            ListOnload();
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
    //window.location.href = 'index.html';
    //slide('right', 'lightblue', 1, 'index.html');
}

//function loadend(){
    //if(loadflagC >= 5){
    //    loadflagC = 0;
    //    $(".loading").css("display", "none");
    //    //scollto(thisScroll);
    //}else{
    //    loadflagC += 1;
    //}
    //$(".loading").css("display", "none");
//}

function loadendOfChart(){
    if(loadflagC >= 3){
        myChart1.setOption(option1);
        $(".Load1").css("display", "none");
        //scollto(thisScroll);

        //个股图表时间切换按钮
        $(".timeTable1>.switchOt").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".timeTable1>.switchOt").removeClass("thisDisplay");
                $(this).addClass("thisDisplay");
                if( index == 0 ){
                    myChart1.clear();
                    option1.legend.data[3]="新闻热度(×100)";
                    option1.legend.data[1]="昨日收盘";
                    option1.legend.selected.昨日收盘=true;

                    option1.xAxis[0].data = xTimeList;
                    option1.yAxis[0].max = shMax;
                    option1.yAxis[0].min = shMin;
                    option1.series[0].data = array01;
                    option1.series[1].data = settelmentOfSH;
                    option1.series[2].data = array02;
                    option1.series[3].name="新闻热度(×100)";
                    option1.series[3].data = array03;
                    myChart1.setOption(option1);
                }else if( index == 1 ){
                    myChart1.clear();
                    option1.legend.data[3]="新闻热度";
                    option1.legend.data[1]=" 隐藏收盘 ";
                    option1.legend.selected.昨日收盘=false;

                    option1.xAxis[0].data = timeArr2;
                    option1.yAxis[0].max = null;
                    option1.yAxis[0].min = null;
                    option1.series[0].data = array11;
                    option1.series[1].data = [];
                    option1.series[2].data = array12;
                    option1.series[3].name="新闻热度";
                    option1.series[3].data = array13;
                    myChart1.setOption(option1);
                } else{
                    myChart1.clear();
                    option1.legend.data[3]="新闻热度(×100)";
                    option1.legend.data[1]="昨日收盘";
                    option1.legend.selected.昨日收盘=true;

                    option1.xAxis[0].data = xTimeList;
                    option1.yAxis[0].max = shMax;
                    option1.yAxis[0].min = shMin;
                    option1.series[0].data = array01;
                    option1.series[1].data = settelmentOfSH;
                    option1.series[2].data = array02;
                    option1.series[3].name="新闻热度(×100)";
                    option1.series[3].data = array03;
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
        $(".Load2").css("display", "none");
        scollto(pageScroll);
        //scollto(thisScroll);
    }else{
        loadflagL += 1;
    }
    //$(".loading").css("display", "none");
}

function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },100);
}


