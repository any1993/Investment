/**
 * Created by aa on 2016/8/9.
 */
var myChart1;
var option1 = {};
var StockId = GetQueryString("stockID");
var ItemId = GetQueryString("itemId");
//var AuthorName = "李跃博";
var AuthorName = GetQueryString("authorName");
var pageScroll=parseInt(GetQueryString("foreScroll"));
var foreScroll=parseInt(GetQueryString("scroll"));

var endTime = Math.round(new Date() /1000);
//var fromTimeOfHour = Math.round(new Date()/ 1000)-86400;
//var fromTimeOfDay = Math.round(new Date() / 1000)-604800;
//var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
//var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000;
var fromTimeOf5Year = Math.round(new Date() / 1000)-157680000;


var PChartTimeLine = [];
var PChartThEPS = [];
var PChartNeEPS = [];
var PChartThNEP = [];
var PChartNeNEP = [];
var PChartPColorList = [];

var PIndex1=0;
var PIndex2=0;

var StockArray = [];

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

    myChart1 = echarts.init(document.getElementById('Chart_P'));
    option1 ={
        tooltip : {
            showDelay : 0,
            trigger: 'axis',
            axisPointer:{
                show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            },
            formatter: "{a}:{c}"
        },
        grid:{x:40,x2:15,y:20,y2:40},
        xAxis : [
            {
                type : 'category',
                scale:true,
                //boundaryGap : false,
                data :[]
            }
            //{
            //    type : 'value',
            //    scale : true,
            //    splitNumber: 29,
            //    axisLabel: {show:false},
            //    splitLine: {show:false}
            //}
        ],
        yAxis : [
            {type : 'value', scale:true}
            //{type : 'value', max:3}
        ],
        animation: false,
        series : [
            {
                name:'EPS',
                type:'scatter',
                //yAxisIndex:1,
                //xAxisIndex:1,
                //symbol: 'circle',
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a}<br>{b}:{c}"
                },
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = PChartPColorList;
                            return colorList[params.dataIndex]
                        }
                    }
                },
                //symbolSize: function (value){
                //    return Math.round(value[2]/10);
                //},
                data: []
            }
            //{
            //    name:'折线',
            //    type:'line',
            //    data:function (){
            //        var list = [];
            //        for (var i = 1; i <= 140; i++) {
            //            list.push(Math.round(Math.random()*100)/4000+1.5);
            //        }
            //        return list;
            //    }()
            //}
        ]
    };


    $(".switchOfYear>.switchOy").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".switchOfYear>.switchOy").removeClass("thisDisplay");
            $(this).addClass("thisDisplay");
        })
    });

    $(".switchofResearcher1>.switchofResearcher1btn").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".switchofResearcher1>.switchofResearcher1btn").removeClass("thisEffect");
            $(this).addClass("thisEffect");
            PIndex1 = index;
            if(PIndex2 == 0){
                if(PIndex1 == 0){
                    myChart1.clear();
                    option1.series[0].data = PChartThEPS;
                    option1.series[0].name = 'EPS';
                    myChart1.setOption(option1);
                }else if( PIndex1 == 1){
                    myChart1.clear();
                    option1.series[0].data = PChartNeEPS;
                    option1.series[0].name = 'EPS';
                    myChart1.setOption(option1);
                }
            }else if( PIndex2 == 1){
                if(PIndex1 == 0){
                    myChart1.clear();
                    option1.series[0].data = PChartThNEP;
                    option1.series[0].name = '净利润';
                    myChart1.setOption(option1);
                }else if( PIndex1 == 1){
                    myChart1.clear();
                    option1.series[0].data = PChartNeNEP;
                    option1.series[0].name = '净利润';
                    myChart1.setOption(option1);
                }
            }
        })
    });

    $(".switchofResearcher2>.switchofResearcher2btn").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".switchofResearcher2>.switchofResearcher2btn").removeClass("thisEffect");
            $(this).addClass("thisEffect");
            PIndex2 = index;
            if(PIndex1 == 0){
                if(PIndex2 == 0){
                    myChart1.clear();
                    option1.series[0].data = PChartThEPS;
                    option1.series[0].name = 'EPS';
                    myChart1.setOption(option1);
                    $(".textBre").text("EPS单位：元/股");
                }else if( PIndex2 == 1){
                    myChart1.clear();
                    option1.series[0].data = PChartThNEP;
                    option1.series[0].name = '净利润';
                    myChart1.setOption(option1);
                    $(".textBre").text("净利润单位：百万");
                }
            }else if( PIndex1 == 1){
                if(PIndex2 == 0){
                    myChart1.clear();
                    option1.series[0].data = PChartNeEPS;
                    option1.series[0].name = 'EPS';
                    myChart1.setOption(option1);
                    $(".textBre").text("EPS单位：元/股");
                }else if( PIndex2 == 1){
                    myChart1.clear();
                    option1.series[0].data = PChartNeNEP;
                    option1.series[0].name = '净利润';
                    myChart1.setOption(option1);
                    $(".textBre").text("净利润单位：百万");
                }
            }
        })
    });

    $(".AuthorNameTitle").text(decodeURI(AuthorName));



    $(window).scroll(function(){
        //console.log($(this).scrollTop());
        if( $(this).scrollTop() >= 500 ) {
            $(".topTowards").css("display", "block");
        }else if( $(this).scrollTop() < 500) {
            $(".topTowards").css("display", "none");
        }

    });
    RateInfosByAuthor();

    $(".topTowards").on("click",function(e){
        scollto(0);
    });

}



function RateInfosByAuthor(){
    //个股详情信息
    httpGet("Reader/RateInfosByAuthor?agencyId="+ItemId+"&author="+AuthorName+"&fromTime="+fromTimeOf5Year+"&endTime="+endTime+"&stockID=","",true,ajax_success00,ajax_fail00);
    function ajax_success00(obj){
        //console.log(obj);
        var tick = 0;
        $(".StockNameInSwitcher").text();
        $(".StockSwitchCode").text(stocksIdTransform(StockId));
        //fChartTimeLine.push(obj[i].PubDate.substring(5,10));
        //fChartTimeLine.sort();
        if( obj != null && obj != "" && obj != undefined ){

            $(".switchofResearcher1 .switchofResearcher1btn").eq(0).text(obj[0].PubDate.substring(0,4)+" 年");
            $(".switchofResearcher1 .switchofResearcher1btn").eq(1).text(parseInt(obj[0].PubDate.substring(0,4))+1+" 年");

            PChartTimeLine = [ obj[0].PubDate.substring(0,10)];
            for( var i = 1 ; i < obj.length; i++){
                if( obj[i].PubDate.substring(0,10) != obj[i-1].PubDate.substring(0,10)){
                    PChartTimeLine.push(obj[i].PubDate.substring(0,10));
                }
            }
            for( var j = 0;j < obj.length; j++){
                StockArray.push(obj[j].StockId);
                if( obj[j].StockId != StockId ){
                    continue;
                }
                $(".ResearcherReport").append(" <tr class='ReportDetails'> " +
                "<td class='PubDate'></td> " +
                "<td class='ThisYearEPS'></td> " +
                "<td class='ThisYearNetProfit'></td> " +
                "<td class='NextYearEPS'></td> " +
                "<td class='NextYearNetProfit'></td></tr>");

                $(".StockNameInSwitcher").text(obj[j].StockName);
                $(".ReportDetails .PubDate").eq(tick).text(obj[j].PubDate.substring(2,10));
                $(".ReportDetails .PubDate").eq(tick).attr("itemId", obj[j].RateID);
                $(".ReportDetails .ThisYearEPS").eq(tick).text(returnFloat(obj[j].ThisYearEPS));
                $(".ReportDetails .ThisYearNetProfit").eq(tick).text(returnFloat(obj[j].ThisYearNetProfit));
                $(".ReportDetails .NextYearEPS").eq(tick).text(returnFloat(obj[j].NextYearEPS));
                $(".ReportDetails .NextYearNetProfit").eq(tick).text(returnFloat(obj[j].NextYearNetProfit));
                tick += 1;
            }

            for( var k = 0; k < obj.length; k++ ){
                if( obj[k].StockId != StockId ){
                    continue;
                }
                PChartThEPS.push([obj[k].PubDate.substring(5, 10), obj[k].ThisYearEPS]);
                PChartNeEPS.push([obj[k].PubDate.substring(5, 10), obj[k].NextYearEPS]);
                PChartThNEP.push([obj[k].PubDate.substring(5, 10), obj[k].ThisYearNetProfit]);
                PChartNeNEP.push([obj[k].PubDate.substring(5, 10), obj[k].NextYearNetProfit]);

                if (returnFloat(obj[k].AdjustRange) > 0) {
                    PChartPColorList.push("#F34E4E");
                } else if (returnFloat(obj[k].AdjustRange) == 0) {
                    PChartPColorList.push("#999999");
                } else if (returnFloat(obj[k].AdjustRange) < 0) {
                    PChartPColorList.push("#2DC25D");
                }
            }

            PChartTimeLine.sort();
            for( var d = 0 ; d < PChartTimeLine.length; d++){
                PChartTimeLine[d] = PChartTimeLine[d].substring(5,10)
            }
            option1.xAxis[0].data = PChartTimeLine;
            option1.series[0].data = PChartThEPS;
            myChart1.setOption(option1);
            //console.log(PChartTimeLine);
            //console.log(PChartThEPS);
            //$(".stocksName .Name").text(obj[0].Name);
            //$(".stocksName .Code").text("["+stocksIdTransform(obj[0].Code)+"]");
            //
            //if( obj.Topics != null && obj.Topics != "" && obj.Topics != undefined ){
            //    if( obj.Topics.length != 0){
            //        for( var otn = 0; otn < obj.Topics.length ; otn++ ){
            //            $(".stocksAbout .stocksList1").eq(otn).text(obj.Topics[otn].Block.Name);
            //        }
            //    }else{
            //        $(".stocksAbout").css("display","none");
            //    }
            //}else{
            //    $(".stocksAbout").css("display","none");
            //}
        }else{
            //$(".stocksAbout").css("display","none");
        }

        $(".ReportDetails .PubDate").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                //console.log("评论员详情页暂未就绪");
                //var authorNameCode = encodeURI(encodeURI($(this).attr("authorName")));
                AddGoback(localStorage.N_url, 'tool1_2_Summary.html?itemId='+$(this).attr("itemId")+'&authorName='+encodeURI(AuthorName)+'&AgencyID='+ItemId+'&stockID='+StockId+'&scroll='+document.body.scrollTop);
                //window.location.href ='tool1_2_Summary.html?itemId='+$(this).attr("itemId")+'&authorName='+encodeURI(AuthorName)+'&AgencyID='+ItemId+'&stockID='+StockId+'&scroll='+document.body.scrollTop;
                //slide('left','lightblue',1,'tool1_2_Summary.html?itemId='+$(this).attr("itemId")+'&authorName='+encodeURI(AuthorName)+'&AgencyID='+ItemId+'&stockID='+StockId+'&scroll='+document.body.scrollTop);
            })
        });
        StockArray = uniqueArr(StockArray);
        StockArray = StockArray.sort();
        //console.log(StockArray);
        loadend();
    }
    function ajax_fail00(){
        console.log("加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            RateInfosByAuthor();
        });
    }
}

function uniqueArr(array){
    var r = [];
    for(var i = 0, l = array.length; i < l; i++) {
        for(var j = i + 1; j < l; j++)
            if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
    }
    return r;
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
    //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+StockId+"&foreScroll="+foreScroll;
    //window.location.href = 'tool1_0_EarningsForecasts.html?itemId='+StockId;
    //slide('right', 'lightblue', 1, 'tool1_0_EarningsForecasts.html?itemId='+StockId);
}

function loadend(){
    scollto(pageScroll);
    $(".loading").css("display", "none");
}

function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },100);
}
