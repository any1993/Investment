/**
 * Created by Kris on 2016/12/19.
 */

var option1 = {};
var myChart;

var dateArray = [];
var sumUpArray = [];
var sumDownArray = [];
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


    option1 = {
        tooltip : {trigger: 'axis',
            formatter:function(data)
            {
                //console.log(data);
                data[1].value =  Math.abs(data[1].value);
                return data[0].seriesName +" : "+ data[0].value +"<br>"+ data[1].seriesName +" : "+ Math.abs(data[1].value);
            }
        },
        legend: {
            data:['涨停股票数','跌停股票数'],
            show:true,
            x:'center', y:'bottom',
            itemHeight: 8,
            //itemGap:115,
            itemWidth: 12,
            //padding:[0,0,0,0],
            textStyle: { fontSize: 12,color:'#999' }
        },
        grid:{x:30,x2:15,y:30,y2:45},
        animationDuration:100,
        xAxis : [
            {
                type : 'category', boundaryGap : 0.01,
                splitLine : { show : false},
                axisTick:{ show : false},
                data : []
        }],
        yAxis : [
            {   name:"股票数(支)",
                type : 'value',
                boundaryGap:0.01,
                axisLabel : {
                    show:true,
                    formatter: function (value) {
                        // Function formatter
                        return Math.abs(value)
                    }
                }
                //scale:true
            }],
        series : [
            {   name:'涨停股票数',
                symbolSize:0|0,
                type:'line',
                smooth:true,
                itemStyle: {normal: {color:"#F74C59"}},
                data:[] },
            {   name:'跌停股票数',
                symbolSize:0|0,
                type:'line',
                smooth:true,
                itemStyle: {normal: {color:"#1DBF60"}},
                data:[] } ]
    };

    myChart = echarts.init(document.getElementById('chart_resumption'));

    //加载今日涨停股统计
    LimitUpStocks();

    //加载近五日涨跌停股票数量统计
    SumLimitUpStocks();

}


function LimitUpStocks(){
    //httpGet("Reader/LimitUpStocks","",true,ajax_successFS,ajax_failFS);
    httpGet("Reader/LimitUpStocks?skip=0&count=5&sortType=0","",true,ajax_successLUS,ajax_failLUS);
    function ajax_successLUS(obj){
        //console.log(obj);
        if ( obj != undefined && obj != null && obj != "" && obj != []){
            //console.log(obj);
            for (var i = 0; i < obj.length; i++) {
                $(".ResumptionTable").append("" +
                "<tr class='ResumptionTableImf'> " +
                "<td class='RtName topicLink'></td> " +
                "<td class='RtFSName stockLink'></td> " +
                "<td class='RtCount'></td> " +
                "<td class='RtChangePercent' state='off'>" +
                "<img src='images/limitOpen.png' class='RtChangeBtn'>" +
                "</td>" +

                "<tr class='ResumptionTableDetailsOpen'><td colspan='4'><div class='listTest'>" +
                "<table class='ResumptionDetailsTable' cellspacing='0' >" +
                "<tr class='ResumptionDetailsOpenTitle' >" +
                "<td>股票名称</td>" +
                "<td>连板次数</td>" +
                "<td>累计涨幅</td>" +
                "</tr>" +
                "</table>" +
                "</div></td></tr>" +
                "</tr>" +
                "");
                $(".ResumptionTable .RtName").eq(i).attr("itemId",obj[i].ID);
                $(".ResumptionTable .RtName").eq(i).text(obj[i].Name);
                $(".ResumptionTable .RtCount").eq(i).text(obj[i].Count+"支");
                $(".ResumptionTable .RtFSName").eq(i).text(obj[i].FSName);
                $(".ResumptionTable .RtFSName").eq(i).attr("itemId",obj[i].FSCode);
                //$(".ResumptionTable .RtChangePercent").eq(i).text(returnFloat(obj[i].ChangePercent)+"%");


                if( obj[i].LimitUpStocks != undefined && obj[i].LimitUpStocks != null && obj[i].LimitUpStocks != "" ){
                    for( var stn = 0 ;stn < obj[i].LimitUpStocks.length ; stn++ ){
                        $(".ResumptionTable .ResumptionDetailsTable").eq(i).append("" +
                            "<tr class='ResumptionDetailsOpenImf'>" +
                            "<td>" +
                            "<span class='DetailsStockName'></span>" +
                            "<span class='DetailsStockCode'></span>" +
                            "</td>" +
                            "<td class='DetailsUpDays'></td>" +
                            "<td class='DetailsSumChangePercent'></td>" +
                            "</tr>" +
                            "");
                        $(".ResumptionTable .ResumptionDetailsTable:eq("+i+") .DetailsStockName").eq(stn).text(obj[i].LimitUpStocks[stn].Name);
                        $(".ResumptionTable .ResumptionDetailsTable:eq("+i+") .DetailsStockCode").eq(stn).text(stocksIdTransform(obj[i].LimitUpStocks[stn].Symbol));
                        $(".ResumptionTable .ResumptionDetailsTable:eq("+i+") .DetailsStockName").eq(stn).attr("itemId",obj[i].LimitUpStocks[stn].Symbol);
                        $(".ResumptionTable .ResumptionDetailsTable:eq("+i+") .DetailsUpDays").eq(stn).text(obj[i].LimitUpStocks[stn].UpDays);
                        $(".ResumptionTable .ResumptionDetailsTable:eq("+i+") .DetailsSumChangePercent").eq(stn).text( returnFloat(obj[i].LimitUpStocks[stn].sumChangePercent*100) + "%" );

                        if( obj[i].LimitUpStocks[stn].sumChangePercent >= 0 ){

                        }else if( obj[i].LimitUpStocks[stn].sumChangePercent < 0  ){
                            $(".ResumptionTable .ResumptionDetailsTable:eq("+i+") .DetailsSumChangePercent").eq(stn).css("color", "#1DBF90")
                        }


                    }
                }



            }

            $(".ResumptionTable .topicLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });

            $(".ResumptionTable .topicLink").each(function(){
                if( $(this).attr("itemId") == undefined  || $(this).attr("itemId") == null ){
                    $(this).unbind("click");
                    $(this).css("color","#888888");
                }
                //$(this).on("click",function(event){
                //    event.stopPropagation();
                //    event.preventDefault();
                //    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                //    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                //    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                //})
            });

            $(".ResumptionTable .stockLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });

            $(".ResumptionDetailsOpenImf .DetailsStockName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    if( $(this).attr("itemId") != undefined && $(this).attr("itemId") != null ){
                        AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    }
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });



            $(".ResumptionTable .RtChangePercent").each(function(index){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    //console.log(index);
                    if(  $(this).attr("state") == "off" ){
                        $(".ResumptionTable .ResumptionTableDetailsOpen").eq(index).css("display","table-row");
                        $(this).attr("state","on");
                        $(".ResumptionTable .RtChangePercent img").eq(index).attr("src","images/limitClose.png");
                    }else if($(this).attr("state") == "on"){
                        $(".ResumptionTable .ResumptionTableDetailsOpen").eq(index).css("display","none");
                        $(this).attr("state","off");
                        $(".ResumptionTable .RtChangePercent img").eq(index).attr("src","images/limitOpen.png");
                    }
                    //AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    ////window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    ////slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });



            $(".Load2").css("display","none");
        }else{
            //$(".ResumptionTableBox").css("display","none");
            //$(".TitleDisplay1").css("display","none");
        }

    }

    function ajax_failLUS(obj){
        $(".Load2").html("<img src='images/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='images/loading.gif' class='loadingImg2'>");
            LimitUpStocks();
        });
    }
}


function SumLimitUpStocks(){
    //httpGet("Reader/LimitUpStocks","",true,ajax_successFS,ajax_failFS);
    httpGet("Reader/SumLimitStocks?count=5","",true,ajax_successLUS,ajax_failLUS);
    function ajax_successLUS(obj){
        //console.log(obj);
        if ( obj != undefined && obj != null && obj != "" && obj != []){
            for (var i = 0; i < obj.length; i++) {
                dateArray.push(obj[i].dateTime.substring(5,10));
                sumUpArray.push(obj[i].upCount);
                sumDownArray.push(-obj[i].downCount);
            }
        }

        //console.log(dateArray);
        //console.log(sumUpArray);
        //console.log(sumDownArray);

        option1.xAxis[0].data = dateArray;
        option1.series[0].data = sumUpArray;
        option1.series[1].data = sumDownArray;

        $(".Load5").css("display","none");
        myChart.setOption(option1);

    }

    function ajax_failLUS(obj){
        $(".Load5").html("<img src='images/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load5 .loadingImg2").on("click",function(){
            $(".Load5 .loadingImg2").remove();
            $(".Load5 .notcontent").remove();
            $(".Load5").html("<img src='images/loading.gif' class='loadingImg2'>");
            SumLimitUpStocks();
        });
    }
    //Reader/SumLimitStocks?count={count}
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
//    AddGoback(localStorage.N_url, 'forecastingPage3_ViewPoints.html');
//    //window.history.back();
//    //slide('right', 'lightblue', 1, 'index.html');
//    window.location.href ='forecastingPage3_ViewPoints.html';
//    //parent.location='index.html';
//}