/**
 * Created by aa on 2016/4/25.
 */
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var AccessToken;

var ItemId = GetQueryString("itemId");
var stockID=GetQueryString("stockID");
var myDate = new Date(); //获取今天日期
var dateArray = [];
var timeArr2 = [];
var timeStampArr2 = [];
var dateTemp;
var flag = 1;
var capFlag = 0;
var option_t1_01 = {};
var option2 = {};
var myChartT;
var myChart2;
var xTimeList = ["08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30","21:45","22:00"];

var xTimeListStock = ["09:30","09:40","09:50","10:00","10:10","10:20","10:30","10:40","10:50","11:00","11:10","11:20","11:30","13:00","13:10","13:20","13:30","13:40","13:50","14:00","14:10","14:20","14:30","14:40","14:50","15:00"];

var loadflagL = 0;


var dateDiff = new Date();
dateDiff = dateDiff.toISOString();
var myDateTest = new Date();
var endTime = Math.round(Date.parse(myDateTest)/1000);
var fromTimeOfHour = Math.round(Date.parse(myDateTest)/ 1000)-86400;


//var timeArr12=[];
var CapitalFlow1=[0];
var CapitalFlow2=[0];
var CapitalFlow3=[0];
var CapitalFlow4=[0];
var CapitalFlow5=[0];

var TopicDailyPrice = [];
var TopicDailyHeat = [];
var heatTrend = [];
var viewPerNg, viewPerNu, viewPerRi = 0;
var backTo = GetQueryString("from");
var tagLt = GetQueryString("tagfrom");
var ScrollMain = parseInt(GetQueryString("scroll"));
var thisScroll = parseInt(GetQueryString("thisScroll"));
var tagSelect = parseInt(GetQueryString("tagSelect"));

var PushTitle = "";
var PushSummary = "";



var userTopicsList = [];
var TopicAttr;

$(function () {
    FastClick.attach(document.body);
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    pageOnload();
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
    //    //setTimeout(function () {
    //    //    pageOnload();
    //    //}, 200);
    //
    //    setTimeout(function () {
    //        db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
    //            db.transaction(function (tx) {
    //                SelectUser(tx);
    //            }, function (err) {
    //                //alert('Open database my.db ERROR1: ' + err.message);
    //            });
    //        });
    //    }, 200);
    //
    //}
});

function pageOnload() {
    var backTo = GetQueryString("from");
    var screenWidth = document.documentElement.clientWidth;
    var yScrolls, yScrolle, startX, startY, moveEndX, moveEndY, X, Y;
    $("body").on("touchstart", function (e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("body").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            Gotoback();
            //if (window.history.length == 1) {
            //    window.location.href = 'index.html';
            //}
            //else {
            //    window.history.back();
            //}
        }
    });
    $("#url_close").bind("click", function () {
        $("#url_blank,#urlApp").remove();
    });
    $("#url_open").bind("click", function () {
        // window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.taikor.news';
        window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.taikor.news');
    });

    //pageLocationChange 1
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.getElementById('userAddTopicBtn').addEventListener("click", touchAddTopic, false);
    //document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    document.addEventListener("backbutton", touchBack, false);
    myDate.setDate(myDate.getDate() - 6);
    for (var i = 0; i < 7; i++) {
        //if(myDate.getDay() == 6 || myDate.getDay() == 0){
        //    myDate.setDate(myDate.getDate() + flag);
        //}else{}
        dateTemp = (myDate.getMonth() + 1) + "-" + myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }
    //加载主题详情
    TopicOnload();

    openDaySetTime();
    //openDateSetDay();
    //FlowOnload();



    if (localStorage.UserTopics != "null" && localStorage.UserTopics != null && localStorage.UserTopics != "" && localStorage.UserTopics != undefined) {

        TopicAttr = JSON.parse(localStorage.UserTopics);
    }
    else {
        localStorage.UserTopics = '';
        TopicAttr = [];
    }
    if (TopicAttr.indexOf(ItemId) == -1) {
        $('.TopicHeadImfAddBtn').attr("src","images/topicAdd.png");
        $('.TopicHeadImfAddBtn').attr("state","on");
    }
    else {
        $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
        $('.TopicHeadImfAddBtn').attr("state","off");
    }

    //console.log(JSON.parse(localStorage.UserTopics));
    //console.log(JSON.parse(localStorage.C_stock));
    //console.log(JSON.parse(localStorage.fundList));
    //console.log(JSON.parse(localStorage.UserTopics));
//自选
//    db.transaction(function (tx) {
//        // tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_unlogin (Symbol text,UNIQUE(Symbol))');//记录未登录的自选股
//        tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_block_' + UserStatus + ' (ID text,UNIQUE(ID))');//记录登录的自选股
//        tx.executeSql('select * from Chose_block_' + UserStatus + ' where ID=?', [ItemId], function (tx, res) {
//            if (res != null && res.rows != null) {
//                if (res.rows.length > 0) {
//                    $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
//                    $('.TopicHeadImfAddBtn').attr("state","off");
//                }else{
//                    $('.TopicHeadImfAddBtn').attr("src","images/topicAdd.png");
//                    $('.TopicHeadImfAddBtn').attr("state","on");
//                }
//            }
//        });
//    }, function (e) {
//        alert("update_co1ERROR: " + e.message);
//    });


}


//加载主题详情
function TopicOnload() {
    myChartT = echarts.init(document.getElementById('chart_T1_01'));

    httpGet("Reader/Topic?topicID=" + ItemId, "", true, ajax_success01, ajax_fail01);
    function ajax_success01(obj) {
        //console.log(obj);
        if (obj != null && obj != "" && obj != [] && obj != undefined) {
            $(".text1PE").text(obj.TopicName);
            PushTitle =  obj.TopicName;
            $(".TopicHeadImfPrice").text(returnFloat(obj.Trade));

            if( obj.Changepercent >= 0 ){
                $(".TopicHeadImfPriceChange").text("+"+returnFloat(obj.Changepercent)+"%");
            }else if (  obj.Changepercent < 0  ){
                $(".TopicHeadImfPriceChange").text(returnFloat(obj.Changepercent)+"%");
                $(".TopicHeadImfPriceChange").css("color","#1DBF90");
                $(".TopicHeadImfPrice").css("color","#1DBF90");
            }
            if (obj.Summury != null && obj.Summury != "") {
                $(".text7").append(obj.Summury);
            } else {
                $(".Summury").css("display", "none");
            }

            //if (obj.Sentiment != null && obj.Sentiment != "") {
            //    ////if(obj.Sentiment.NegativePer != )
            //    viewPerNg = obj.Sentiment.NegativePer;
            //    viewPerRi = obj.Sentiment.RightPer;
            //    if (obj.Sentiment.NeutralPer != 0.0 && obj.Sentiment.NeutralPer != 0 && obj.Sentiment.NeutralPer != null) {
            //        viewPerNu = obj.Sentiment.NeutralPer;
            //    }
            //    else {
            //        viewPerNu = 1 - obj.Sentiment.NegativePer - obj.Sentiment.RightPer;
            //    }
            //    $(".Right").append("：(" + Math.round(obj.Sentiment.RightPer * 100) + "%)");
            //    $(".Negative").append("：(" + Math.round(obj.Sentiment.NegativePer * 100) + "%)");
            //    $(".Neutral").append("：(" + Math.round(viewPerNu * 100) + "%)");
            //} else {
            //    $(".Sentiment").css("display", "none");
            //}

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
                    $(".Sentiment").css("display","none");
                }
            }else{
                $(".Sentiment").css("display","none");
            }


            if (obj.HistoryHot != null && obj.HistoryHot != "") {
                heatTrend = obj.HistoryHot;
            } else {
                $(".heatTrend").css("display", "none");
            }

            option_t1_01 = {
                tooltip: { trigger: 'axis' },
                legend: {
                    data: ['热度走势','价格指数'],
                    show:false
                    //x: 'right',
                    //y: 20,
                    //itemGap: 10,
                    //itemHeight: 6,
                    //itemWidth: 10,
                    //textStyle: { fontSize: 11 }
                },
                animationDuration:150,
                calculable: true,
                grid: { x: 40, y: 50, x2: 40, y2: 40 },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: dateArray
                    }
                ],
                yAxis: [
                    {
                        name:"价格指数(元)",
                        type: 'value',
                        splitLine: { show: false },
                        boundaryGap:[0,0.3],
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            textStyle: { fontSize: 12 }
                        },
                        scale: true
                    },
                    {
                        name:"热度指数",
                        type : 'value',
                        boundaryGap:0.3,
                        min:0,
                        splitLine : {show: false},
                        axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}}, scale:true}
                ],
                series: [
                    {
                        name: '热度走势',
                        type: 'line',
                        symbol:'circle',symbolSize:6|4,
                        zlevel: 2,
                        z:2,
                        yAxisIndex:1,
                        smooth:true,
                        itemStyle: {normal: {color:"#FCCB45"}},
                        data: heatTrend
                    },
                    {
                        name: '价格指数',
                        type: 'line',
                        symbol:'rectangle',symbolSize:6|4,
                        zlevel: 2,
                        z:1,

                        smooth:true,
                        itemStyle: {normal: {color:"#378EFF"}},
                        data: []
                    }
                ]
            };
            //myChartT.setOption(option_t1_01);
            var sharesAboutAmount;

            if (obj.Stocks != null && obj.Stocks != [] && obj.Stocks != "") {
                if (obj.Stocks.length <= 6) {
                    sharesAboutAmount = obj.Stocks.length;
                } else {
                    sharesAboutAmount = 6;
                }
                var stocklist = "";
                for (var an = 0; an < sharesAboutAmount; an++) {
                    $(".sharesTable").append("<tr class='sharesItems' > <td class='ItemTitleBox'> " +
                    "<span class='eventSharesName'>股票名称</span> " +
                    "<span class='eventSharesCode'>******</span>" +
                        //"<span class='eventSharesAbout'>相关板块</span>" +
                    "</td> " +
                    "<td class='ItemPrice'>——</td> " +
                    "<td class='raf'>±0.00%</td> " +
                    //"<td class='stockV' ></td>" +
                    "<td><span class='percentageNum'>0%</span> " +
                    "<div class='percentageBox'> <div class='flexlength'></div> </div> </td> " +
                    "</tr>");
                    $(".sharesTable .eventSharesName").eq(an).text(obj.Stocks[an].Stock.Name);
                    $(".sharesTable .eventSharesName").eq(an).attr("itemId", obj.Stocks[an].Stock.Symbol);
                    $(".sharesTable .eventSharesCode").eq(an).text(obj.Stocks[an].Stock.Code);
                    stocklist += obj.Stocks[an].Stock.BlockID + ",";

                    if( obj.Stocks[an].Stock.Trade > 0 ){
                        $(".sharesTable .ItemPrice").eq(an).text( returnFloat(obj.Stocks[an].Stock.Trade));
                    }else if( obj.Stocks[an].Stock.Trade <= 0){
                        $(".sharesTable .ItemPrice").eq(an).text("——");
                    }

                    if (obj.Stocks[an].Stock.Changepercent >= 0) {
                        $(".sharesTable .raf").eq(an).text("+" + returnFloat(obj.Stocks[an].Stock.Changepercent) + "%");
                    } else {
                        $(".sharesTable .raf").eq(an).text(returnFloat(obj.Stocks[an].Stock.Changepercent ) + "%");
                        $(".sharesTable .raf").eq(an).css("color", "#20c062");
                    }

                    $(".sharesTable .percentageNum").eq(an).text(returnFloat(obj.Stocks[an].Relativity * 100) + "%");
                    $(".sharesTable .flexlength").eq(an).css("width", Math.round(obj.Stocks[an].Relativity * 10000) / 100 + "%");
                }
            } else {
                $(".sharesAbout").css("display", "none");
            }
            //httpGet("Reader/Blocks?blockIds=" + stocklist, "", true, ajax_successBs, ajax_failBs);
            //function ajax_successBs(objs) {
            //    if (objs != null && objs != "" && objs != [] && objs != undefined) {
            //        for (var as = 0; as < sharesAboutAmount; as++) {
            //            $(".sharesTable .eventSharesAbout").eq(as).text(objs[as].Name);
            //        }
            //    } else {
            //        $(".sharesTable .eventSharesAbout").eq(an).text("");
            //    }
            //}
            //function ajax_failBs() {
            //    console.log("板块信息加载失败");
            //}

            $(".sharesTable .eventSharesName").each(function () {
                $(this).on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId")+"&scroll="+document.body.scrollTop);
                    //window.location.href = "stock.html?stockId="+$(this).attr("itemId")+"&fromPage=topicDetails&topicID="+ItemId+"&from="+backTo+"&scroll="+document.body.scrollTop;
                    //slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=9&fromPage=topicDetail&topicId=' + ItemId + '&from=' + backTo);
                    //parent.location="newsInfo.html?itemid="+$(this).attr('itemId')+"&newsType=9&fromPage=topicDetail&topicId="+ItemId+"&from="+backTo;
                })
            });

            if (obj.Articles != null && obj.Articles != [] && obj.Articles != "") {
                for (var an = 0; an < obj.Articles.length; an++) {
                    $(".eventsAboutBox").append("<div class='eventsAbout' itemId='" + obj.Articles[an].Id + "'> <span class='eventsTitle'></span> <span class='issueTime'></span> </div>");
                    $(".eventsAboutBox .eventsTitle").eq(an).text(obj.Articles[an].Title);
                    $(".eventsAboutBox .issueTime").eq(an).text(getDateDiff(obj.Articles[an].PubDate));
                }
            } else {
                $(".articleBox").css("display", "none");
            }


            $(".TopicChartHeatNum").text(obj.HotValue);


            //function drawCircle(pieChart, data_arr, color_arr) {
            //    var c = document.getElementById("pieChart");
            //    var ctx = c.getContext("2d");
            //    var radius = c.height / 2;
            //    var ox = radius, oy = radius;
            //    var startAngle = 0;
            //    var endAngle = 0;
            //    for (var i = 0; i < data_arr.length; i++) {
            //        endAngle = endAngle + data_arr[i] * Math.PI * 2;
            //        ctx.fillStyle = color_arr[i];
            //        ctx.beginPath();
            //        ctx.moveTo(ox, oy);
            //        ctx.arc(ox, oy, radius, startAngle, endAngle);
            //        ctx.closePath();
            //        ctx.fill();
            //        startAngle = endAngle;
            //    }
            //}
            
            //function init() {
            //    var data_arr = [viewPerNu, viewPerNg, viewPerRi];
            //    var color_arr = ["#7ad044", "#f5d249", "#4aa0ff"];
            //    drawCircle("canvas_circle", data_arr, color_arr);
            //}
            
            //init();
            openDateSetDay();

            $(".loading").css("display", "none");

            //pageLocationChange
            $(".eventsAbout").each(function () {
                $(this).on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=9');
                    //window.location.href = 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=9&fromPage=topicDetail&topicId=' + ItemId + '&from=' + backTo;
                    //slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=9&fromPage=topicDetail&topicId=' + ItemId + '&from=' + backTo);
                    //parent.location="newsInfo.html?itemid="+$(this).attr('itemId')+"&newsType=9&fromPage=topicDetail&topicId="+ItemId+"&from="+backTo;
                })
            });
        }
    }
    function ajax_fail01() {
        console.log("主题详情加载失败");
        $(".loading").html("<img src='images/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='images/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            TopicOnload();
        });
    }
}

function openDaySetTime(){
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
    //httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=0&count=1","",true,ajax_successTM,ajax_failTM);
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=2","",true,ajax_successTM,ajax_failTM);
    function ajax_successTM(obj){
        //console.log(dateDiff);
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 480 ){
                dateDiff = obj[1];
                fromTimeOfHour = Math.round(Date.parse(obj[1])/1000);
                endTime = Math.round(Date.parse(obj[1])/1000) + 86400;
            }else if( dateDiff3 >= 480 ){
                //dateDiff = new Date();
                fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
                endTime = Math.round(Date.parse(myDateTest)/1000);
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            dateDiff = obj[0];
            fromTimeOfHour = Math.round((Date.parse(obj[0])/1000));
            endTime = Math.round(Date.parse(obj[0])/1000) + 86400;
        }
        //console.log(dateDiff.getDate());
        //console.log(obj[0]);
        //console.log(Date.parse(obj[1]));
        //console.log(fromTimeOfHour);
        //console.log(new Date(fromTimeOfHour*1000).toLocaleString());
        //console.log(endTime);
        //console.log(new Date(endTime*1000).toLocaleString());
        FlowOnload();
        ChartDailyDataOnload();
    }
    function ajax_failTM(){
        //dateDiff = new Date();
        fromTimeOfHour = Math.round(Date.parse(myDateTest)/1000)-86400;
        endTime = Math.round(Date.parse(myDateTest)/1000);
    }
}


function FlowOnload(){
    for( var ts = 0; ts < xTimeListStock.length ; ts++){
        CapitalFlow1[ts] = "";
        CapitalFlow2[ts] = "";
        CapitalFlow3[ts] = "";
        CapitalFlow4[ts] = "";
        CapitalFlow5[ts] = "";
    }
    myChart2 = echarts.init(document.getElementById('Chart_StockT'));
    option2 ={
        tooltip : {trigger: 'axis'},
        legend: {data:['主力净流入','超大单净流入','大单净流入','中单净流入','小单净流入'], y:'bottom',icon:'bar',itemHeight:8, itemWidth:12,itemGap:20},
        calculable : true,
        animationDuration:100,
        grid:{x:55,x2:30,y:35,y2:72},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {
                name:"资金流(万元)",
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
    httpGet("Reader/CapitalFlow/"+ItemId+"?type=1&skipHour=0.1&fromTime="+fromTimeOfHour+"&endTime="+endTime,"",true,ajax_success05,ajax_fail05);
    function ajax_success05(obj){
        if(obj != null && obj != undefined && obj != [] && obj != "") {
            var dataNum = 0;
            //console.log(dateDiff.getDate());
            //dateDiff = new Date();
            for(var i = 0 ; i < obj.length; i++ ){
                if( dateDiff.substring(8,10) == tranTimeStampDateDiff(obj[i].CountTime+28800) ){
                    //console.log(xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800)));
                    CapitalFlow1[xTimeListStockTransform(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].MainForce*100)/100;
                    CapitalFlow2[xTimeListStockTransform(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].SuperLarge*100)/100;
                    CapitalFlow3[xTimeListStockTransform(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].Large*100)/100;
                    CapitalFlow4[xTimeListStockTransform(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].Middle*100)/100;
                    CapitalFlow5[xTimeListStockTransform(tranTimeStamp(obj[i].CountTime+28800))]=Math.round(obj[i].Small*100)/100;
                    dataNum ++ ;
                }
            }
            if( dataNum >= 3){
                for( var t = 0; t < xTimeList.length ; t++){
                    for( var st = 0 ; st < 25; st++){
                        if( CapitalFlow1[st] == "" ){
                            CapitalFlow1[st] = CapitalFlow1[st+1];
                        }
                        if( CapitalFlow2[st] == "" ){
                            CapitalFlow2[st] = CapitalFlow2[st+1] ;
                        }
                        if( CapitalFlow3[st] == "" ){
                            CapitalFlow3[st] = CapitalFlow3[st+1] ;
                        }
                        if( CapitalFlow4[st] == "" ){
                            CapitalFlow4[st] = CapitalFlow4[st+1];
                        }
                        if( CapitalFlow5[st] == "" ){
                            CapitalFlow5[st] = CapitalFlow5[st+1];
                        }
                        //if( array01[st] == "" ){
                        //    array01[st] = array01[st-1];
                        //}
                    }
                }
            }
            option2.xAxis[0].data = xTimeListStock;
            option2.series[0].data = CapitalFlow1;
            option2.series[1].data = CapitalFlow2;
            option2.series[2].data = CapitalFlow3;
            option2.series[3].data = CapitalFlow4;
            option2.series[4].data = CapitalFlow5;
            myChart2.setOption(option2);
        }else{
            $("#Chart_StockT").css("display", "none");
            loadend();
        }

        loadendOfList();
    }
    function ajax_fail05(){
        //$("#Chart_StockT").css("display", "none");
        //loadend();
        console.log("加载失败");
        loadflagL = 0;
        for( var ts = 0; ts < xTimeListStock.length ; ts++){
            CapitalFlow1[ts] = "";
            CapitalFlow2[ts] = "";
            CapitalFlow3[ts] = "";
            CapitalFlow4[ts] = "";
            CapitalFlow5[ts] = "";
        }
        $(".Load3").html("<img src='images/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartOfStock").css("z-index","-1");
        $(".Load3").css("z-index","5");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='images/loading.gif' class='loadingImg2 LoadM'>");
            FlowOnload();
            $(".chartOfStock").css("z-index","1");
        });

    }

    httpGet("Reader/HistoryCapitals/"+ItemId+"?type=1&endTime="+endTime+"&count=5","",true,ajax_success06,ajax_fail06);
    function ajax_success06(obj){
        if( obj != null && obj != [] && obj != undefined){
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

                //$(".tableOfCapital .netOfCapital").eq(i).text(Math.round(obj[i].NetAmount*100)/100 );
                //if( obj[i].NetAmount < 0 ){
                //    $(".tableOfCapital .netOfCapital").eq(i).css("color","#2DC25D");
                //}

                if( returnFloat(obj[i].Amount) > 0){
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).text("+"+returnFloat(obj[i].Amount));
                    //$(".tableOfTopicBelong .cumulativeOfCapital").eq(i).css("color", "#f74c59");
                    $(".TopicHeadImfFlowAmount").css("color", "#f74c59");
                }else if( returnFloat(obj[i].Amount) == 0){
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).text(returnFloat(obj[i].Amount));
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).css("color", "#333333");
                    $(".TopicHeadImfFlowAmount").css("color", "#333333");
                }else if( returnFloat(obj[i].Amount) < 0){
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).text(returnFloat(obj[i].Amount));
                    $(".tableOfCapital .cumulativeOfCapital").eq(i).css("color", "#20c062");
                    $(".TopicHeadImfFlowAmount").css("color", "#20c062");
                }

                //$(".tableOfCapital .cumulativeOfCapital").eq(i).text(Math.round(obj[i].Amount*100)/100);
                //if( obj[i].Amount < 0 ){
                //    $(".tableOfCapital .cumulativeOfCapital").eq(i).css("color","#2DC25D");
                //}

            }

            $(".tableOfCapital").css("display","block");
            $(".TopicHistoryFailed").css("display","block");
            $(".TopicHeadImfFlowAmount").text(returnFloat(obj[obj.length-1].Amount));

        }else{

            $(".tableOfCapital").css("display","none");
            $(".TopicHistoryFailed").css("display","none");
            loadend();
        }



        loadendOfList();
    }
    function ajax_fail06(){
        //$(".tableOfCapital").css("display","none");
        //loadend();
        console.log("加载失败");
        loadflagL = 0;
        $(".tableOfCapital").css("display","none");
        $(".TopicHistoryFailed").css("display","none");

        for( var ts = 0; ts < xTimeListStock.length ; ts++){
            CapitalFlow1[ts] = "";
            CapitalFlow2[ts] = "";
            CapitalFlow3[ts] = "";
            CapitalFlow4[ts] = "";
            CapitalFlow5[ts] = "";
        }
        $(".Load3").html("<img src='images/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".chartOfStock").css("z-index","-1");
        $(".Load3").css("z-index","5");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='images/loading.gif' class='loadingImg2 LoadM'>");
            FlowOnload();
            $(".chartOfStock").css("z-index","1");
        });
    }

}


function ChartDailyDataOnload(){

   //console.log(new Date(fromTimeOfHour*1000).toLocaleString());

    //Reader/FeverTrend/{Id}?type={type}&skipHour={skipHour}&fromTime={fromTime}&endTime={endTime}&skipSecond={skipSecond}
    httpGet("Reader/FeverTrend/"+ItemId+"?type=1&skipHour=0&fromTime="+fromTimeOfHour+"&endTime="+endTime+"&skipSecond=600","",true,ajax_successTDaily,ajax_failTDaily);
    function ajax_successTDaily(obj){
        //console.log(obj);
        //for(var i )
        if( obj != null && obj != [] && obj != undefined ){
        for(var i = 0 ; i < obj.length; i++ ){
            if( dateDiff.substring(8,10) == tranTimeStampDateDiff(obj[i].CountTime+28800) && parseInt(tranTimeStamp(obj[i].CountTime+28800).substring(0,2)) >= 8 ){
                //console.log(tranTimeStamp(obj[i].CountTime+28800));
                TopicDailyHeat[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].PostCount;
                //TopicDailyHeat[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].ViewCount;
                //array03[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].PostCount;
                //array04[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].ReplyCount;
                }
            }
        }

        //console.log(TopicDailyHeat);
    }
    function ajax_failTDaily(){

    }


    //httpGet("Reader/BlockHistory?type=2&blockId="+ItemId+"&fromTime="+fromTimeOfHour+"&endTime="+endTime,"",true,ajax_successTDaily2,ajax_failTDaily2);
    //function ajax_successTDaily2(obj){
    //    console.log(obj);
    //    //for(var i )
    //    //for(var i = 0 ; i < obj.length; i++ ){
    //        //if( dateDiff.getDate() == tranTimeStampDateDiff(obj[i].CountTime+28800) && parseInt(tranTimeStamp(obj[i].CountTime+28800).substring(0,2)) >= 8 ){
    //        //    //console.log(tranTimeStamp(obj[i].CountTime+28800));
    //        //    TopicDailyHeat[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].PostCount;
    //        //    //TopicDailyHeat[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].ViewCount;
    //        //    //array03[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].PostCount;
    //        //    //array04[xTimeListTransform(tranTimeStamp(obj[i].CountTime+28800))]=obj[i].ReplyCount;
    //        //}
    //    //}
    //    //console.log(TopicDailyHeat);
    //}
    //function ajax_failTDaily2(){
    //
    //}

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

        for(var j = 0; j < 7; j++){
            timeStampArr2.unshift( obj[i].substring(5,10));
        }

        //timeStampArr2
        //console.log(timeArr2);
        option_t1_01.xAxis[0].data = timeArr2;
        //myChartT.setOption(option_t1_01);
        TopicPriceOnload();
        TopicDepartmentTop();
    }
    function ajax_failTD(){
        openDateSetDay();
    }
}


function TopicPriceOnload(){
    //console.log(timeArr2);
    httpGet("Reader/BlockHistory?type=0&blockId="+ItemId+"&fromTime=0&endTime=0&count=10","",true,ajax_successTD,ajax_failTD);
    //
    function ajax_successTD(obj){
        //console.log(obj);
        if( obj != undefined && obj != null && obj != ""){
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].TickTime.substring(5,10) == timeArr2[t]){
                        TopicDailyPrice[t] = returnFloat(obj[i].AvgPrice);
                    }else{

                    }
                }
            }

            //aaaa
            $(".TopicChartEmotionNum").text(returnFloat(obj[obj.length-1].AvgPrice));
        }

        //console.log(TopicDailyPrice);
        option_t1_01.series[1].data = TopicDailyPrice;
        myChartT.setOption(option_t1_01);
    //
    }
    function ajax_failTD(){
    //
    }

}

function TopicDepartmentTop(){
    //console.log(timeArr2);
    //httpGet("Reader/BlockHistory?type=0&blockId="+ItemId+"&fromTime=0&endTime=0&count=10","",true,ajax_successTD,ajax_failTD);
    httpGet("Reader/StockTradeBillboard?blockID="+ItemId+"&type=0&dateTime=0&count=5","",true,ajax_successS5,ajax_failS5);
    //
    function ajax_successS5(obj){
        //console.log(obj);
        //if( obj != null && obj != "" && obj != undefined){
        //    $(".salesDepartment").css("display", "none");
        //}else{
        //    $(".salesDepartment").css("display", "none");
        //}
        //
    }
    function ajax_failS5(){
        //
    }
}


//自选
function touchAddTopic(event) {
    event.stopPropagation();
    event.preventDefault();

    if(  $(".TopicHeadImfAddBtn" ).attr("state") == "on" ){

        httpGet("Reader/AddUserStocks/"+ItemId+"?userID=" + UserID + "&type=1", "", true, ajax_success3, ajax_fail3);
        function ajax_success3(obj) {
            //alert("添加：" + obj);
            if (obj !== null && obj !== "" && obj !== undefined) {
                if (obj == 0 || obj == 1) {
                    if( $.inArray(ItemId,TopicAttr) < 0){
                        TopicAttr.push(ItemId);
                        localStorage.UserTopics=JSON.stringify(TopicAttr);

                        $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                        $('.TopicHeadImfAddBtn').attr("state","off");

                    }else{
                        $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                        $('.TopicHeadImfAddBtn').attr("state","off");

                        //removeByValue(TopicAttr,ItemId);
                        //localStorage.UserTopics=JSON.stringify(TopicAttr);
                        //$('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                        //$('.TopicHeadImfAddBtn').attr("state","off");
                    }
                    //$('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                    //$('.TopicHeadImfAddBtn').attr("state","off");




                    //db.transaction(function (tx) {
                    //    tx.executeSql('replace INTO Chose_block_' + UserStatus + ' (ID) VALUES(?)', [ItemId], function (tx, res) {
                    //        $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                    //        $('.TopicHeadImfAddBtn').attr("state","off");
                            //window.plugins.toast.show("加入自选成功", 500, "center");
                        //});
                    //}, function (e) {
                        //alert("update_ID1ERROR: " + e.message);
                    //});
                }
            }else{
                $('.TopicHeadImfAddBtn').attr("src","images/topicAdd.png");
                $('.TopicHeadImfAddBtn').attr("state","on");
            }
        }
        function ajax_fail3() {
            //window.plugins.toast.show("取消自选失败", 500, "center");
            $('.TopicHeadImfAddBtn').attr("src","images/topicAdd.png");
            $('.TopicHeadImfAddBtn').attr("state","on");
        }
    }else if( $(".TopicHeadImfAddBtn" ).attr("state") == "off" ){

        httpGet("Reader/DelUserStocks/" + ItemId + "?userID=" + UserID + "&type=1", "", true, ajax_success10, ajax_fail10);
        function ajax_success10(obj) {
            if (obj !== null && obj !== "" && obj !== undefined) {
                if (obj == 0 || obj == 1) {

                    removeByValue(TopicAttr,ItemId);
                    localStorage.UserTopics=JSON.stringify(TopicAttr);

                    $('.TopicHeadImfAddBtn').attr("src","images/topicAdd.png");
                    $('.TopicHeadImfAddBtn').attr("state","on");

                    //removeByValue(TopicAttr,ItemId);
                    //localStorage.UserTopics=JSON.stringify(TopicAttr);
                    //$('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                    //$('.TopicHeadImfAddBtn').attr("state","off");


                    //db.transaction(function (tx) {
                    //    tx.executeSql('delete from Chose_block_' + UserStatus + ' where ID=?', [ItemId], function (tx, res) {
                    //        $('.TopicHeadImfAddBtn').attr("src","images/topicAdd.png");
                    //        $('.TopicHeadImfAddBtn').attr("state","on");
                            //window.plugins.toast.show("取消自选成功", 500, "center");
                        //});
                    //}, function (e) {
                    //    alert("update_ID1ERROR: " + e.message);
                    //});
                }else {
                    $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                    $('.TopicHeadImfAddBtn').attr("state","off");
                    //window.plugins.toast.show("取消自选失败！", 500, "center");
                }
            }
            else {
                $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
                $('.TopicHeadImfAddBtn').attr("state","off");
                //window.plugins.toast.show("取消自选失败！", 500, "center");
            }
        }
        function ajax_fail10() {
            $('.TopicHeadImfAddBtn').attr("src","images/topicDelete.png");
            $('.TopicHeadImfAddBtn').attr("state","off");
            //window.plugins.toast.show("取消自选失败！", 500, "center");
        }
    }

}
function touchBack(event) {
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    // if (backTo == -1) {
    //     window.location.href = 'index.html' + '?scroll=' + ScrollMain;
    //     //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+ScrollMain);
    //     //parent.location= 'index.html';
    // } else if (backTo == 1) {
    //     window.location.href = 'opportunityPage3_Topics.html' + '?scroll=' + ScrollMain + '&thisScroll=' + thisScroll + '&tagSelect=' + tagSelect;
    //     //slide('right', 'lightblue', 1, 'opportunityPage3_Topics.html'+'?scroll='+ScrollMain+'&thisScroll='+thisScroll+'&tagSelect='+tagSelect);
    //     //parent.location= 'opportunityPage3_Topics.html';
    // } else {
    //     window.location.href = 'opportunityPage2o1_EventDetails.html?itemId=' + backTo + '&from=' + tagLt;
    //     //slide('right', 'lightblue', 1, 'opportunityPage2o1_EventDetails.html?itemId='+backTo+'&from='+tagLt);
    //     //parent.location= 'opportunityPage2o1_EventDetails.html?itemId='+backTo+'&from='+tagLt;
    // }
    //if (window.history.length == 1) {
    //    window.location.href = 'index.html';
    //}
    //else {
    //    window.history.back();
    //}
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
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


function loadend(){
    if(capFlag >= 1){
        $(".CapitalMainBoxDisplay").css("display","none");
        capFlag = 0;
    }else{capFlag += 1;}
}



function SelectUser(tx) {
    tx.executeSql("select * from User", [], function (tx, res) {
        if (res.rows.length == 0) {
            var type = "0", nickName = "";
            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success, ajax_fail);
            function ajax_success(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    UserID = obj;
                    UserStatus = "unlogin";
                    pageOnload();
                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO User (id, LoginState, DeviceUserID) VALUES (?,?,?)", [1, "0", UserID], function (tx, res) {
                            ////alert("插入设备登录信息成功");
                        });
                    }, function (err) {
                        //alert('Open database my.db ERROR4: ' + err.message);
                    });
                }
                else {
                    //下拉时获取指数为空
                }
            }
            function ajax_fail() {
                //下拉时获取指数失败
            }
        }
        else {
            if (res.rows.item(0).LoginState == "0") {
                UserID = res.rows.item(0).DeviceUserID;
                UserStatus = "unlogin";
                pageOnload();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    pageOnload();
                }
            }
        }
    });
}




function touchStartShare(event) {
    event.preventDefault();
    $("body").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
    $("#cover").after('<div id="share-box" class="share-box"><div class="share-icon"><div class="share-half share-top"><ul><li id="wechatFrd-button"><div class="share-pic"><img src="images/icon-frie.png"></div><div class="share-word">朋友圈</div></li><li id="wechat-button"><div class="share-pic"><img src="images/icon-wec.png"></div><div class="share-word">微信</div></li><li id="weibo-button"><div class="share-pic"><img src="images/icon-weibo.png"></div><div class="share-word">新浪微博</div></li></ul></div><div class="share-half"><ul><li id="sms-button"><div class="share-pic"><img src="images/icon-sms.png"></div><div class="share-word">短信</div></li><li id="copy-button"><div class="share-pic"><img src="images/icon-link.png"></div><div class="share-word">复制链接</div></li><li id="refresh-button"><div class="share-pic"><img src="images/icon-refr.png"></div><div class="share-word">刷新</div></li></ul></div></div><div style="height:8px"></div><div id="share-cancel" class="share-cancel">取消</div></div>');
    $("#share-box").animate({ bottom: "0" }, 500);
    document.getElementById("icon-share").removeEventListener("touchstart", touchStartShare, false);
    document.getElementById("wechatFrd-button").addEventListener("touchstart", touchstartWechatFrd, false);
    document.getElementById("wechat-button").addEventListener("touchstart", touchstartWechat, false);
    document.getElementById("weibo-button").addEventListener("touchstart", touchstartWebo, false);
    document.getElementById("sms-button").addEventListener("touchstart", touchstartSms, false);
    document.getElementById("copy-button").addEventListener("touchstart", touchstartCopy, false);
    document.getElementById("refresh-button").addEventListener("touchstart", touchstartRefresh, false);
    document.getElementById("share-cancel").addEventListener("touchstart", touchstartCancel, false);
}

//分享到朋友圈
function touchstartWechatFrd(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    // console.log("布尔财经：热门主题-"+ PushTitle);
    // console.log(PushSummary);
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: "布尔财经：热门主题-"+ PushTitle,
            description: PushSummary,
            thumb: "http://www.taikorcdn.com/reader/images/icon.png",
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://boolcj.taikor.com/opportunityPages/opportunityPage3o1_TopicDetails.html?itemId="+ItemId// webpage
            }
        },
        scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, function () {
        window.plugins.toast.showShortBottom("朋友圈分享成功");
    }, function (reason) {
        window.plugins.toast.showShortBottom("朋友圈分享取消");
    });

}
//微信分享文章
function touchstartWechat(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });

    //摘要的第一句作为描述
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: "热门主题："+ PushTitle,
            description: PushSummary,
            thumb: "http://www.taikorcdn.com/reader/images/icon.png",
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl:"http://boolcj.taikor.com/opportunityPages/opportunityPage3o1_TopicDetails.html?itemId="+ItemId
                // webpage
            }
        },
        scene: Wechat.Scene.SESSION   // share to SESSION
    }, function () {
        window.plugins.toast.showShortBottom("微信朋友分享成功");
    }, function (reason) {
        window.plugins.toast.showShortBottom("微信朋友分享取消");
    });
}
//微博分享文章
function touchstartWebo(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);

    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    var args = {};
    args.url = "http://boolcj.taikor.com/opportunityPages/opportunityPage3o1_TopicDetails.html?itemId="+ItemId,
        args.title = "热门主题："+ PushTitle;
    args.description = PushSummary;
    args.imageUrl = "http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png";//if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png will be the defualt one
    args.defaultText = "";
    YCWeibo.shareToWeibo(function () {
        window.plugins.toast.showShortBottom("微博分享成功");
    }, function (failReason) {
        window.plugins.toast.showShortBottom("微博分享取消");
    }, args);
}
//短信分享文章
function touchstartSms(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);

    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.plugins.socialsharing.shareViaSMS("http://boolcj.taikor.com/opportunityPages/opportunityPage3o1_TopicDetails.html?itemId="+ItemId, null /* see the note below */, function (msg) {
        window.plugins.toast.showShortBottom("短信分享成功");

    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    });
}
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);

    cordova.plugins.clipboard.copy("http://boolcj.taikor.com/opportunityPages/opportunityPage3o1_TopicDetails.html?itemId="+ItemId, function (msg) {
        window.plugins.toast.showShortBottom("复制链接成功");
        $("#share-box").animate({ bottom: "-335px" }, 500, function () {
            $("#cover").remove();
            $("#share-box").remove();
        });
    }, function (msg) {
        window.plugins.toast.showShortBottom("复制链接失败，请重试");
    });
}
//文章刷新按钮
function touchstartRefresh(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.location.reload();
    window.plugins.toast.showShortBottom("刷新成功");
}
//文章取消分享按钮
function touchstartCancel(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 500, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
}

function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}