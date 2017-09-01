/**
 * Created by aa on 2016/8/9.
 */
var myChart1;
var myChart1v;
var myChart2;
var myChart3;
var option1 = {};
var option1v = {};
var option2 = {};
var option3 = {};
var ItemId = GetQueryString("itemId");
var pageScroll=parseInt(GetQueryString("foreScroll"));
var foreScroll=parseInt(GetQueryString("scroll"));

var endTime = Math.round(new Date() /1000);
var fromTimeOfHour = Math.round(new Date()/ 1000)-86400;
var fromTimeOfDay = Math.round(new Date() / 1000)-604800;
var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000;
var fromTimeOfYear = Math.round(new Date() / 1000)-31536000;


var kChartTimeLine = [];
var kChartTrade = [];
var kChartHigh = [];
var kChartLow = [];
var kChartOpen = [];
var kChartClose = [];
var kChartVolume = [];
var kChart5ma = [];
var kChart10ma = [];
var kChart20ma = [];
var kChartRdFlag = ["#F74C59"];

var fChartTimeLine = [];
var fChartThEPS = [];
var fChartThEPSAvg = [];
var fChartNeEPS = [];
var fChartNeEPSAvg = [];
var fChartThNEP = [];
var fChartThNEPAvg = [];
var fChartNeNEP = [];
var fChartNeNEPAvg = [];
var fChartPColorList = [];

var fIndex1=0;
var fIndex2=0;


var loadflag = 0;
//var myDateTest = new Date();
//var timeStampTest = myDateTest.toJSON();
//var timeFlag = parseInt(timeStampTest.substring(14,16)/15);
//if( timeFlag == 0){
//    timeStampTest = timeStampTest.substring(0,14)+"00:00.000"+timeStampTest.substring(23,24);
//}else if( timeFlag == 1){
//    timeStampTest = timeStampTest.substring(0,14)+"15:00.000"+timeStampTest.substring(23,24);
//}else if( timeFlag == 2){
//    timeStampTest = timeStampTest.substring(0,14)+"30:00.000"+timeStampTest.substring(23,24);
//}else if( timeFlag == 3){
//    timeStampTest = timeStampTest.substring(0,14)+"45:00.000"+timeStampTest.substring(23,24);
//}else{
//    timeStampTest = timeStampTest.substring(0,14)+"00:00.000"+timeStampTest.substring(23,24);
//}
//var endTime = Math.round(Date.parse(timeStampTest)/1000);
//var fromTimeOfHour = Math.round(Date.parse(timeStampTest)/ 1000)-86400;


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

    myChart1 = echarts.init(document.getElementById('Chart_K'));
    myChart1v = echarts.init(document.getElementById('Chart_V'));
    option1 ={
        tooltip: {
            trigger: 'item'
        },
        grid:{x:40,x2:10,y:30,y2:10},
        animationDuration:100,
        calculable: true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                show:false,
                axisTick: {onGap:false},
                splitLine: {show:false},
                data : []
            }
        ],
        yAxis : [
            {
                name:"价格指数(元)",
                type : 'value',
                scale:true,
                splitNumber: 5,
                //min: 0 ,
                boundaryGap: 0.01
            }
        ],
        series : [
            {
                name:'价格指数',
                type:'k',
                itemStyle: {
                    normal: {
                        color: '#F74C59',           // 阳线填充颜色
                        color0: '#1DBF60',          // 阴线填充颜色
                        lineStyle: {
                            width: 1,
                            color: '#F74C59',       // 阳线边框颜色
                            color0: '#1DBF60'       // 阴线边框颜色
                        }
                    }
                },
                //  开盘，收盘，最低，最高
                data:[]
            }
        ]
    };

    //myChart1.setOption(option1);
    option1v ={
        tooltip: {
            trigger: 'item'
        },
        grid:{x:40,x2:10,y:30,y2:30},
        animationDuration:100,
        calculable: true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisTick: {onGap:false},
                splitLine: {show:false},
                data : []
            }
        ],
        yAxis : [
            {
                name:"交易量(手)",
                type : 'value',
                scale:true,
                splitNumber: 4,
                boundaryGap: [0 ,0.1],
                axisLabel: {
                    formatter: function (v) {
                        return Math.round(v/10000)
                    }
                }
            }
        ],
        series : [
            {
                name:'交易量(手)',
                type:'bar',
                symbol: 'none',
                itemStyle : {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = kChartRdFlag;
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data:[]

            }
        ]
    };

    echarts.connect([myChart1, myChart1v]);

    myChart2 = echarts.init(document.getElementById('Chart_P'));
    option2 ={
        //legend: {data:['EPS','Net'], show:false},
        tooltip : {
            trigger: 'axis',
            formatter: "{a}:{c}",
            axisPointer:{
                show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            }
        },
        grid:{x:40,x2:15,y:25,y2:40},
        xAxis : [
            {
                type : 'category',
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale:true
                //min: 0
                //boundaryGap:0.5
            }
            //{
            //    type : 'value',
            //    scale:true
            //    //min: 0
            //    //boundaryGap:0.5
            //}

        ],
        animation: false,
        series : [
            {
                //name:'EPS',
                type:'scatter',
                symbol: 'circle',
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a}<br>{b}:{c}"
                },
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = fChartPColorList;
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data:[]
            },
            {
                //name:'EPS',
                type:'line',
                //tooltip : {
                //    trigger: 'axis',
                //    formatter: "{a}<br>{b}:{c}"
                //},
                itemStyle: {
                    normal: {
                        color: "#206CFB"
                    }
                },
                data:[]
            }

        ]
    };
    //myChart2.setOption(option2);

    $(".switch1>.switch1btn").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".switch1>.switch1btn").removeClass("thisEffect");
            $(this).addClass("thisEffect");
            fIndex1 = index;
            if(fIndex2 == 0){
                if(fIndex1 == 0){
                    myChart2.clear();
                    option2.series[0].data = fChartThEPS;
                    option2.series[1].data = fChartThEPSAvg;
                    option2.series[0].name = 'EPS';
                    myChart2.setOption(option2);
                }else if( fIndex1 == 1){
                    myChart2.clear();
                    option2.series[0].data = fChartNeEPS;
                    option2.series[1].data = fChartNeEPSAvg;
                    option2.series[0].name = 'EPS';
                    myChart2.setOption(option2);
                }
            }else if( fIndex2 == 1){
                if(fIndex1 == 0){
                    myChart2.clear();
                    option2.series[0].data = fChartThNEP;
                    option2.series[1].data = fChartThNEPAvg;
                    option2.series[0].name = '净利润';
                    myChart2.setOption(option2);
                }else if( fIndex1 == 1){
                    myChart2.clear();
                    option2.series[0].data = fChartNeNEP;
                    option2.series[1].data = fChartNeNEPAvg;
                    option2.series[0].name = '净利润';
                    myChart2.setOption(option2);
                }
            }
        })
    });

    $(".switch2>.switch2btn").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".switch2>.switch2btn").removeClass("thisEffect");
            $(this).addClass("thisEffect");
            fIndex2 = index;
            if(fIndex1 == 0){
                if(fIndex2 == 0){
                    myChart2.clear();
                    option2.series[0].data = fChartThEPS;
                    option2.series[1].data = fChartThEPSAvg;
                    option2.series[0].name = 'EPS';
                    myChart2.setOption(option2);
                    $(".textbcp").text("EPS单位：元/股");
                }else if( fIndex2 == 1){
                    myChart2.clear();
                    option2.series[0].data = fChartThNEP;
                    option2.series[1].data = fChartThNEPAvg;
                    option2.series[0].name = '净利润';
                    myChart2.setOption(option2);
                    $(".textbcp").text("净利润单位：百万");
                }
            }else if( fIndex1 == 1){
                if(fIndex2 == 0){
                    myChart2.clear();
                    option2.series[0].data = fChartNeEPS;
                    option2.series[1].data = fChartNeEPSAvg;
                    option2.series[0].name = 'EPS';
                    myChart2.setOption(option2);
                    $(".textbcp").text("EPS单位：元/股");
                }else if( fIndex2 == 1){
                    myChart2.clear();
                    option2.series[0].data = fChartNeNEP;
                    option2.series[1].data = fChartNeNEPAvg;
                    option2.series[0].name = '净利润';
                    myChart2.setOption(option2);
                    $(".textbcp").text("净利润单位：百万");
                }
            }



        })
    });

    StockInfoBlockOnload();
    StockInformationOnload();
    StockRateInfosOnload();

}

function StockInfoBlockOnload(){
    //个股详情信息
    httpGet("Reader/Stock?stockId="+ItemId,"",true,ajax_success00,ajax_fail00);
    function ajax_success00(obj){
        //console.log(obj);

        if( obj != null && obj != "" && obj != undefined ){
            //$(".stocksName .Name").text(obj[0].Name);
            //$(".stocksName .Code").text("["+stocksIdTransform(obj[0].Code)+"]");

            if( obj.Topics != null && obj.Topics != "" && obj.Topics != undefined ){
                if( obj.Topics.length != 0){
                    for( var otn = 0; otn < obj.Topics.length ; otn++ ){
                        $(".stocksAbout .stocksList1").eq(otn).text(obj.Topics[otn].Block.Name);
                        $(".stocksAbout .stocksList1").eq(otn).attr("itemId",obj.Topics[otn].Block.ID);
                    }
                }else{
                    $(".stocksAbout").css("display","none");
                }
            }else{
                $(".stocksAbout").css("display","none");
            }


            $(".stocksAbout .stocksList1").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));

                })
            });




        }else{
            $(".stocksAbout").css("display","none");
        }



        //loadend();


    }
    function ajax_fail00(){
        console.log("加载失败");
    }
}





function StockInformationOnload(){
    //个股详情信息
    httpGet("Reader/StockHistory?type=0&stockId="+ItemId+"&fromTime="+fromTimeOfMonth2+"&endTime="+endTime,"",true,ajax_success001,ajax_fail001);
    function ajax_success001(obj){
        //console.log(obj);

        if( obj != null && obj != "" && obj != undefined ){
            $(".stocksName .Name").text(obj[0].Name);
            $(".stocksName .Code").text("["+stocksIdTransform(obj[0].Code)+"]");
            for( var i = 0; i < obj.length; i++){
                kChartTimeLine.push(obj[i].Ticktime.substring(5,10));
                kChartHigh.push(obj[i].High);
                kChartLow.push(obj[i].Low);
                kChartOpen.push(obj[i].Open);
                kChartClose.push(obj[i].Trade);
                kChartVolume.push(obj[i].Volume);
                if( obj[i].Low == 0 && obj[i].High == 0 ){
                    kChartTrade.push([obj[i].Trade,obj[i].Trade,obj[i].Trade,obj[i].Trade]);
                }else{
                    kChartTrade.push([obj[i].Open,obj[i].Trade,obj[i].Low,obj[i].High]);
                }
                //kChart5ma = [];
                //kChart10ma = [];
                //kChart20ma = [];
                //kChartRdFlag = [];
                if( i > 0 ){
                    if( obj[i].Trade >= obj[i-1].Trade ){
                        kChartRdFlag.push("#F74C59");
                    }else if( obj[i].Trade < obj[i-1].Trade ){
                        kChartRdFlag.push("#1DBF60");
                    }
                }
            }
            option1.xAxis[0].data = kChartTimeLine;
            option1v.xAxis[0].data = kChartTimeLine;
            option1.series[0].data = kChartTrade;
            option1v.series[0].data = kChartVolume;
            //option1.series[1].data = array02;
            //option1.series[2].data = array03;

        }else{

        }
        //console.log(kChartTimeLine);
        loadend();
    }
    function ajax_fail001(){
        console.log("加载失败");

        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartK").css("z-index","-1");
        $(".Load1").css("z-index","5");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            StockInformationOnload();
            $(".chartK").css("z-index","1");
        });
    }
}


function StockRateInfosOnload(){

    //机构评级汇总与盈利预测

    httpGet("Reader/StockAverageRateInfos?stockId="+ItemId+"&fromTime="+fromTimeOfYear+"&endTime="+endTime,"",true,ajax_success002,ajax_fail002);
    function ajax_success002(data){
        //console.log(obj);
        var obj = data.stockRateInfos;
        var objAvg = data.stockAverageRateInfos;
        //console.log(objAvg);
        if( obj != null && obj != "" && obj != undefined ){
            $(".AnalystText").text(obj[0].Summury);
            for( var i = 0; i < obj.length; i++){
                $(".ImfItem1").append(" <div class='stocksListName'></div>");
                $(".ItemScrollBox").append(" <tr class='stocksDetails'> " +
                "<td class='RateAuthor'></td> " +
                "<td class='AdjustRange'></td> " +
                "<td class='PubDate'></td> " +
                "<td class='MonthFromLastTime'></td> " +
                "<td class='ConfidLevel'></td> " +
                "<td class='WorkYear'></td> " +
                "<td class='IndustryPubTime'></td> " +
                "<td class='ThisYearEPS'></td> " +
                "<td class='NextYearEPS'></td> " +
                "<td class='ThisYearNetProfit'></td> " +
                "<td class='NextYearNetProfit'></td> </tr>");

                $(".ImfItem1 .stocksListName").eq(i).text(obj[i].AgencyName.substring(0,4));


                //$(".stocksDetails .RateAuthor").eq(i).text(obj[i].Author);
                //$(".stocksDetails .RateAuthor").eq(i).attr("itemId", obj[i].AgencyID);

                //$(".stocksDetails .RateAuthor").eq(i).attr("authorName", obj[i].Author);
                //console.log(obj[i].Author.split(","));
                var authorList = obj[i].Author.split(",");
                for( var a = 0 ; a < authorList.length ; a++){
                    $(".stocksDetails .RateAuthor").eq(i).append("<span>"+authorList[a]+"</span>");
                    if( a != authorList.length -1){
                        $(".stocksDetails .RateAuthor").eq(i).append("，");
                    }
                    $(".stocksDetails .RateAuthor:eq("+i+") span").eq(a).attr("itemId", obj[i].AgencyID);

                    $(".stocksDetails .RateAuthor:eq("+i+") span").eq(a).attr("authorName", authorList[a]);
                }

                if( returnFloat(obj[i].AdjustRange) > 0 ){
                    $(".stocksDetails .AdjustRange").eq(i).text("+"+returnFloat(obj[i].AdjustRange)+"%");
                    fChartPColorList.push("#F34E4E");
                }else if( returnFloat(obj[i].AdjustRange) == 0){
                    $(".stocksDetails .AdjustRange").eq(i).text(returnFloat(obj[i].AdjustRange)+"%");
                    $(".stocksDetails .AdjustRange").eq(i).css("color","#666666");
                    fChartPColorList.push("#999999");
                }else if( returnFloat(obj[i].AdjustRange) < 0){
                    $(".stocksDetails .AdjustRange").eq(i).text(returnFloat(obj[i].AdjustRange)+"%");
                    $(".stocksDetails .AdjustRange").eq(i).css("color","#2DC25D");
                    fChartPColorList.push("#2DC25D");
                }
                $(".stocksDetails .PubDate").eq(i).text(obj[i].PubDate.substring(5,10));
                $(".stocksDetails .MonthFromLastTime").eq(i).text(obj[i].MonthFromLastTime);

                $(".stocksDetails .ConfidLevel").eq(i).text(returnFloat(obj[i].ConfidLevel));
                if( obj[i].ConfidLevel < 0){
                    $(".stocksDetails .ConfidLevel").eq(i).css("color","#F5D63E");
                }else if( 0 <= obj[i].ConfidLevel && obj[i].ConfidLevel < 0.2){
                    $(".stocksDetails .ConfidLevel").eq(i).css("color","#F5D63E");
                }else if( 0.2 <= obj[i].ConfidLevel && obj[i].ConfidLevel < 0.4){
                    $(".stocksDetails .ConfidLevel").eq(i).css("color","#FFBD0D");
                }else if( 0.4 <= obj[i].ConfidLevel && obj[i].ConfidLevel < 0.6){
                    $(".stocksDetails .ConfidLevel").eq(i).css("color","#FF910D");
                }else if( 0.6 <= obj[i].ConfidLevel && obj[i].ConfidLevel < 0.8){
                    $(".stocksDetails .ConfidLevel").eq(i).css("color","#FF6A0D");
                }else if( 0.8 <= obj[i].ConfidLevel && obj[i].ConfidLevel < 1){
                    $(".stocksDetails .ConfidLevel").eq(i).css("color","#F13427");
                }else{
                    //$(".stocksDetails .ConfidLevel").eq(i).css("color","#F13427");
                }
                $(".stocksDetails .WorkYear").eq(i).text(Math.round(obj[i].WorkYear*10)/10+"年");
                if( obj[i].WorkYear < 0){
                    $(".stocksDetails .WorkYear").eq(i).css("color","#30BCFF");
                }else if( 0 <= obj[i].WorkYear && obj[i].WorkYear < 2.5){
                    $(".stocksDetails .WorkYear").eq(i).css("color","#30BCFF");
                }else if( 2.5 <= obj[i].WorkYear && obj[i].WorkYear < 5){
                    $(".stocksDetails .WorkYear").eq(i).css("color","#3095FF");
                }else if( 5 <= obj[i].WorkYear && obj[i].WorkYear < 7.5){
                    $(".stocksDetails .WorkYear").eq(i).css("color","#2078FF");
                }else if( 7.5 <= obj[i].WorkYear && obj[i].WorkYear < 10){
                    $(".stocksDetails .WorkYear").eq(i).css("color","#144CFF");
                }else if( 10 <= obj[i].WorkYear){
                    $(".stocksDetails .WorkYear").eq(i).css("color","#461BFC");
                }else{
                    //$(".stocksDetails .WorkYear").eq(i).css("color","#F13427");
                }

                $(".stocksDetails .IndustryPubTime").eq(i).text(obj[i].IndustryPubTime);
                $(".stocksDetails .ThisYearEPS").eq(i).text(returnFloat(obj[i].ThisYearEPS));
                $(".stocksDetails .NextYearEPS").eq(i).text(returnFloat(obj[i].NextYearEPS));
                $(".stocksDetails .ThisYearNetProfit").eq(i).text(returnFloat(obj[i].ThisYearNetProfit));
                $(".stocksDetails .NextYearNetProfit").eq(i).text(returnFloat(obj[i].NextYearNetProfit));

                fChartTimeLine.push(obj[i].PubDate.substring(5,10));
                fChartTimeLine.sort();
                uniqueArray(fChartTimeLine);
                fChartThEPS.push([ obj[i].PubDate.substring(5,10), returnFloat(obj[i].ThisYearEPS) ]);
                fChartNeEPS.push([ obj[i].PubDate.substring(5,10), returnFloat(obj[i].NextYearEPS) ]);
                fChartThNEP.push([ obj[i].PubDate.substring(5,10), returnFloat(obj[i].ThisYearNetProfit) ]);
                fChartNeNEP.push([ obj[i].PubDate.substring(5,10), returnFloat(obj[i].NextYearNetProfit) ]);
                //kChartVolume.push(obj[i].Volume);
                ////kChart5ma = [];
                ////kChart10ma = [];
                ////kChart20ma = [];
                ////kChartRdFlag = [];

            }

            for( var j = 0; j < objAvg.length; j++){
                fChartThEPSAvg.push([ objAvg[j].PubDate.substring(5,10), returnFloat(objAvg[j].ThisYearEPS) ]);
                fChartNeEPSAvg.push([ objAvg[j].PubDate.substring(5,10), returnFloat(objAvg[j].NextYearEPS) ]);
                fChartThNEPAvg.push([ objAvg[j].PubDate.substring(5,10), returnFloat(objAvg[j].ThisYearNetProfit) ]);
                fChartNeNEPAvg.push([ objAvg[j].PubDate.substring(5,10), returnFloat(objAvg[j].NextYearNetProfit) ]);
            }
            //console.log(fChartThEPSAvg);
            //console.log(fChartNeEPSAvg);
            //console.log(fChartThNEPAvg);
            //console.log(fChartNeNEPAvg);
            option2.xAxis[0].data = fChartTimeLine;
            option2.series[0].data = fChartThEPS;
            option2.series[1].data = fChartThEPSAvg;
            //option2.series[0].itemStyle.normal ={
            //    color:fChartPColorList
            //};
            //console.log(fChartTimeLine);
            option2.series[0].name = 'EPS';
            myChart2.setOption(option2);
            //option1.xAxis[0].data = kChartTimeLine;
            //option1.series[0].data = kChartVolume;
            ////option1.series[1].data = array02;
            ////option1.series[2].data = array03;
            //myChart1.setOption(option1);
            $(".ImfItemScroll").append("<tr class='stocksDetails'> <td></td> </tr>");
        }else{

        }
        //console.log(kChartTimeLine);
        //console.log(kChartHigh);
        //console.log(fChartPColorList);
        //console.log( option2.series[0]);
        //console.log(kChartLow);
        //console.log(kChartOpen);
        //console.log(kChartClose);
        //console.log(kChartVolume);

        $(".stocksDetails .RateAuthor span").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                //console.log("评论员详情页暂未就绪");
                var authorNameCode = encodeURI(encodeURI($(this).attr("authorName")));

                AddGoback(localStorage.N_url, 'tool1_1_Researcher.html?itemId='+$(this).attr("itemId")+'&authorName='+authorNameCode+"&stockID="+ItemId+'&scroll='+document.body.scrollTop);
                //window.location.href ='tool1_1_Researcher.html?itemId='+$(this).attr("itemId")+'&authorName='+authorNameCode+"&stockID="+ItemId+'&scroll='+document.body.scrollTop;
                //slide('left','lightblue',1,'tool1_1_Researcher.html?itemId='+$(this).attr("itemId")+'&authorName='+authorNameCode+"&stockID="+ItemId+'&scroll='+document.body.scrollTop);
            })
        });
        $(".Load3").css("display", "none");

    }
    function ajax_fail002(){
        console.log("加载失败");
        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load3").css("z-index","5");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
            StockRateInfosOnload();
        });
    }








    //httpGet("Reader/StockAverageRateInfos?stockId="+ItemId+"&fromTime="+fromTimeOfYear+"&endTime="+endTime,"",true,ajax_success0021,ajax_fail0021);
    //function ajax_success0021(obj){
    //    //console.log(obj.stockRateInfos);
    //    console.log(obj.stockAverageRateInfos);
    //
    //
    //
    //}
    //function ajax_fail0021(){
    //
    //}

}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.location.href = 'tool0_1_forecastStocksList.html?foreScroll='+foreScroll;
    //slide('right', 'lightblue', 1, 'tool0_1_forecastStocksList.html?foreScroll='+foreScroll);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function loadend(){
    //if(loadflag >= 1){
    //    loadflag = 0;

        $(".Load1").css("display", "none");
        myChart1.setOption(option1);
        myChart1v.setOption(option1v);
        scollto(pageScroll);
        //scollto(thisScroll);
    //}else{
    //    loadflag += 1;
    //}
}

function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },100);
}

