/**
 * Created by aa on 2016/6/17.
 */
/**
 * Created by aa on 2016/4/21.
 */
var AccessToken;
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var db;
var foreScroll=parseInt(GetQueryString("scroll"));
var backTo=GetQueryString("from");
if(backTo == -1){
    var itemCount = 5;
}else{
    var itemCount=GetQueryString("from");
}
var which=GetQueryString("which");
var ItemId=GetQueryString("itemId");

var cashProportion =100;
var colorList = [
    '#ff774a','#4a90e2','#6ce8cd','#f7dd1b','#e69142',
    '#ae44c8','#4457c8','#77c844','#d8d8d8'
];

var option2={};
var option3={};

$(function () {
    FastClick.attach(document.body);
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //pageOnload();
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
            //if(backTo == -1){
            //    //window.history.back();
            //    window.location.href ='index.html';
            //    //slide('right', 'lightblue', 1, 'index.html');
            //    //parent.location='index.html';
            //}else{
            //    //window.history.back();
            //    window.location.href ='forecastingPage2_InvestGroups.html?groupCounts='+backTo+'&scroll='+foreScroll;
            //    //slide('right', 'lightblue', 1, 'forecastingPage2_InvestGroups.html?groupCounts='+backTo+'&scroll='+foreScroll);
            //    //parent.location='forecastingPage2_InvestGroups.html?groupCounts='+backTo+'&scroll='+foreScroll;
            //}
        }
    });

    //pageLocationChange
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    //页面加载
    InvestGroupOnload();

}

function InvestGroupOnload() {
    var myChart2 = echarts.init(document.getElementById('chart_OG2'));

    httpGet("Reader/InvestGroup?investGroupId="+ItemId,"",true,ajax_successIG,ajax_failIG);
    function ajax_successIG(obja){
        //console.log(obja);
        if (obja != null && obja != "" && obja != undefined){
            var obj = obja;
            $(".AllRate").text(Math.round(obj.AllRate*10)/10+'%');
            if( obj.MonthRate >= 0 ){
                $(".MonthRate").text('+'+Math.round(obj.MonthRate*10)/10+'%');
            }else{
                $(".MonthRate").text(Math.round(obj.MonthRate*10)/10+'%');
                $(".MonthRate").css("color","#2dc25d");
            }
            if( obj.DayRate >= 0 ){
                $(".DayRate").text('+'+Math.round(obj.DayRate*10)/10+'%');
            }else{
                $(".DayRate").text(Math.round(obj.DayRate*10)/10+'%');
                $(".DayRate").css("color","#2dc25d");
            }
            $(".headOG").attr("src",obj.ImageUrl);
            $(".AuthorName").text("@"+obj.AuthorName);
            $(".MediaName").text(obj.MediaName);
            $(".GroupName").text(obj.GroupName);

            option2 = {
                tooltip : {trigger: 'item', formatter: "{b}: <br>原比{c}%<br>(图比{d}%)"},
                legend: {orient : 'vertical', x : 'center', y : 'center', itemGap:4, itemHeight:8, itemWidth:16, textStyle:{fontSize:12}, data:[]},
                calculable : true,
                series : [
                    {   name:'访问来源', type:'pie', radius : ['60%', '90%'], legendHoverLink:true,
                        itemStyle : {
                            normal : {
                                label : {show : false},
                                labelLine : {show : false},
                                color: function(params) {
                                    // build a color map as your need.
                                    return colorList[params.dataIndex]
                                }
                            },
                            emphasis : {label : {show : false}}},
                        data:[]
                    }]
            };
            if( obj.Stocks != null && obj.Stocks != [] &&  obj.Stocks != "" &&  obj.Stocks != undefined) {
                if (obj.Stocks.length == 0) {
                    $(".datalistOG").eq(1).append("<div class='noData'>该投资组合股票已清仓</div>");
                    $(".datalistOG").eq(2).css("display", "none")
                } else if (obj.Stocks[0].StockInfo == null) {
                    $(".datalistOG").eq(1).append("<div class='noData'>该投资组合股票已清仓</div>");
                    $(".datalistOG").eq(2).css("display", "none")
                    obj.Stocks = {};
                } else {
                    $(".tickTime").text(getDateDiff(dateTrans(obj.Stocks[0].StockInfo.Ticktime)));
                }
                var num = obj.Stocks.length;
                var showednum = obj.Stocks.length;
                var elseStocks = 0;
                for (var s = 0; s < num; s++) {
                    $(".StockBoxOG").append("<tr class='StockOGimf'> <td> " +
                    "<span class='stockName stockLink'></span> " +
                    "<span class='stockCode'></span> </td> " +
                    "<td class='Trade'></td> " +
                    "<td class='Changepercent'></td>" +
                    "<td><span class='pctNum shares_percent'>已清仓</span><div class='percentage'><div class='flexA'></div></div></td></tr>");
                    $(".stockName").eq(s).attr("itemId",obj.Stocks[s].StockInfo.Symbol);
                    $(".stockName").eq(s).text(obj.Stocks[s].StockInfo.Name);
                    $(".stockCode").eq(s).text(obj.Stocks[s].StockInfo.Code);
                    if( obj.Stocks[s].StockInfo.Trade > 0 ){
                        $(".Trade").eq(s).text(returnFloat(obj.Stocks[s].StockInfo.Trade));
                    }else if( obj.Stocks[s].StockInfo.Trade <= 0 ){
                        $(".Trade").eq(s).text("——");
                    }

                    if (obj.Stocks[s].StockInfo.Changepercent >= 0) {
                        $(".Changepercent").eq(s).text("+" + returnFloat(obj.Stocks[s].StockInfo.Changepercent ) + "%");
                    } else {
                        $(".Changepercent").eq(s).text(returnFloat(obj.Stocks[s].StockInfo.Changepercent ) + "%");
                        $(".Changepercent").eq(s).css("color", "#20c062");
                    }
                    if (obj.Stocks[s].Current != null && obj.Stocks[s].Current != "" && obj.Stocks[s].Current.Percent != 0) {
                        $(".shares_percent").eq(s).text(obj.Stocks[s].Current.Percent + "%");
                        $(".flexA").eq(s).css("width", obj.Stocks[s].Current.Percent + "%");
                    } else {
                        $(".flexA").eq(s).css("width", "0");
                    }


                    if (obj.Stocks[s].Current != null && obj.Stocks[s].Current.Percent != 0) {
                        if (s < 7) {
                            option2.legend.data.push(obj.Stocks[s].StockInfo.Name);
                            option2.series[0].data.push({value: 0, name: ""});
                            option2.series[0].data[s].name = obj.Stocks[s].StockInfo.Name;
                            option2.series[0].data[s].value = obj.Stocks[s].Current.Percent;
                            cashProportion -= obj.Stocks[s].Current.Percent;
                        } else {
                            elseStocks += obj.Stocks[s].Current.Percent;
                            cashProportion -= obj.Stocks[s].Current.Percent;
                        }
                    } else {
                        showednum -= 1;
                    }

                }


                $(".StockBoxOG .stockName").each(function(){
                    $(this).on("click",function(event){
                        event.stopPropagation();
                        event.preventDefault();
                        AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                        //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                        //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                    })
                });

                if (cashProportion < 0) {
                    cashProportion = 0;
                }

                if (showednum <= 7) {
                    if (cashProportion != 0) {
                        option2.legend.data.push("现金占比");
                        option2.series[0].data.push({value: Math.round(cashProportion * 100) / 100, name: "现金占比"});
                        colorList[showednum] = '#d8d8d8';
                    }
                } else {
                    if (cashProportion != 0) {
                        option2.legend.data.push("其他股票");
                        option2.series[0].data.push({value: Math.round(elseStocks * 100) / 100, name: "其他股票"});
                        option2.legend.data.push("现金占比");
                        option2.series[0].data.push({value: Math.round(cashProportion * 100) / 100, name: "现金占比"});
                        colorList[9] = '#d8d8d8';
                    } else {
                        option2.legend.data.push("其他股票");
                        option2.series[0].data.push({value: Math.round(elseStocks * 100) / 100, name: "其他股票"});
                    }
                }

                if (showednum == 8) {
                    option2.legend.data[showednum - 1] = obj.Stocks[showednum - 1].StockInfo.Name;
                    option2.series[0].data[showednum - 1].name = obj.Stocks[showednum - 1].StockInfo.Name;
                }

                $(".StockBoxOG").append("<tr class='StockOGimf'><td> 现金占比</td><td></td> <td></td>" +
                "<td><span class='pctNum shares_percent'>" + returnFloat(cashProportion )  + "%</span><div class='percentage'><div class='flexA' style='width: " + cashProportion + "%'></div></div></td></tr>");

                if (obj.Stocks.length == undefined) {
                    $(".StockOGimf").css("display", "none")
                }
            }
            myChart2.setOption(option2);
            $(".loading").css("display","none");
        }
    }
    function ajax_failIG(){
        console.log("组合详情加载失败");
        $(".loading").html("<img src='images/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='images/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            InvestGroupOnload();
        });
    }

}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //if(backTo == -1){
    //    //window.history.back();
    //    window.location.href ='index.html';
    //    //slide('right', 'lightblue', 1, 'index.html');
    //    //parent.location='index.html';
    //}else{
    //    //window.history.back();
    //    window.location.href ='forecastingPage2_InvestGroups.html?groupCounts='+backTo+'&scroll='+foreScroll;
    //    //slide('right', 'lightblue', 1, 'forecastingPage2_InvestGroups.html?groupCounts='+backTo+'&scroll='+foreScroll);
    //    //parent.location='forecastingPage2_InvestGroups.html?groupCounts='+backTo+'&scroll='+foreScroll;
    //}
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

