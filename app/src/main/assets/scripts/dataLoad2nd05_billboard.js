/**
 * Created by Kris on 2016/12/19.
 */

var option1 = {};
var myChart;

var dataArray = [];
var stockCount = [];
var mainForceIn = [];
var mainForceOut = [];
var ldFlag = 0;
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
    document.getElementById('toMorePages').addEventListener("click", touchMore, false);
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

    option1 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['个股数量','龙虎榜流入','龙虎榜流出'],
            show:true,
            x:'center', y:'bottom',
            itemHeight: 8,
            itemWidth: 12
        },
        grid:{x:30,x2:45,y:30,y2:45},
        animationDuration:100,
        xAxis : [{type : 'category', boundaryGap : true, splitLine : {show: false},
            axisLine:{
                lineStyle:{
                    color: '#999',
                    width: 1,
                    type: 'solid'}
            },
            axisTick:{
                interval:0,
                inside:true,
                lineStyle:{
                    color: '#999',
                    width: 1,
                    type: 'solid'}
            },
            axisLabel : {
                show:true,
                textStyle:{color: '#999'}
            },
            data : []
        }],
        yAxis : [
            {
                name:"股票数(支)",
                type : 'value',
                boundaryGap:0.1,
                splitNumber:5
            },
            {
                name:"龙虎榜资金流(万)",
                nameLocation: 'end',
                type : 'value',
                boundaryGap:0.05,
                splitNumber:5,
                splitLine:{
                  show:false
                },
                axisLabel : {
                    show:true,
                    formatter: function (value) {
                        // Function formatter
                        return value/10000
                    }
                }
            }
        ],
        series : [
            {   name:'个股数量', type:'line',
                symbol:'rectangle',symbolSize:5|5,
                smooth:true,
                //yAxisIndex:1,
                zlevel:2,z:1,

                itemStyle: {normal: {color:"#ADBCCA"}},
                data:[] },
            {   name:'龙虎榜流入',
                type:'bar',
                barWidth:15,
                barGap:'-100%',
                yAxisIndex:1,
                //zlevel:2,z:2,
                itemStyle: {normal: {color:"#F74C59"}},
                data:[] },
            {   name:'龙虎榜流出',
                type:'bar',
                barWidth:15,
                barGap:'-100%',
                yAxisIndex:1,
                //zlevel:2,z:2,
                itemStyle: {normal: {color:"#1DBF60"}, label : {show: true, position: 'bottom'}},
                data:[] } ]
    };


    myChart = echarts.init(document.getElementById('chart_billboard'));







//    加载五日累计上榜走势
    BillboardTrendOnLoad();

//    加载个股三日龙虎榜流入
    StocksBillboardFlow();

//    加载主题三日龙虎榜流入
    TopicsBillboardFlow();

//    加载席位三日龙虎榜流入
    SeatBillboardChartOnload();

}



//加载图表数据
function BillboardTrendOnLoad(){
    httpGet("Reader/BillboardTrend?count=5","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        //var trTag = 0;
        for( var i = 0; i < obj.length; i++){
            dataArray.unshift(obj[i].upTime.substring(5,10));
            stockCount.unshift(obj[i].StockCount);
            mainForceIn.unshift( parseFloat(returnFloat(obj[i].MainForceIn)));
            mainForceOut.unshift(-parseFloat(returnFloat(obj[i].MainForceOut)));
        }
        option1.xAxis[0].data = dataArray;
        option1.series[0].data = stockCount;
        option1.series[1].data = mainForceIn;
        option1.series[2].data = mainForceOut;

        $(".Load5").css("display","none");
        myChart.setOption(option1);

    }

    function ajax_failFS(obj){
        $(".Load5").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load5 .loadingImg2").on("click",function(){
            $(".Load5 .loadingImg2").remove();
            $(".Load5 .notcontent").remove();
            $(".Load5").html("<img src='img/loading.gif' class='loadingImg2'>");
            BillboardTrendOnLoad();
        });
    }

}

//加载个股数据
function StocksBillboardFlow(){
    httpGet("Reader/BillboardChart?type=0&count=5","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        //var trTag = 0;
        if ( obj != undefined &&  obj != null && obj != "" && obj != []){
            for( var i = 0; i < obj.length; i++){


                //console.log(i);
                $(".BillboardTableBox.StockBox .BillboardTable").append("" +
                "<tr class='BillboardTableImf'> <td> " +
                "<span class='stockName stockLink'></span> " +
                "<span class='stockCode'></span> </td> " +
                "<td class='billboardFlow'></td> " +
                "<td class='billboardTotalChange'></td> " +
                "<td class='billboardTrade'></td> </tr>"+
                "");

                $(".BillboardTableBox.StockBox .stockName").eq(i).attr("itemId",obj[i].ID);
                $(".BillboardTableBox.StockBox .stockName").eq(i).text(obj[i].Name);
                $(".BillboardTableBox.StockBox .stockCode").eq(i).text(stocksIdTransform(obj[i].ID));
                $(".BillboardTableBox.StockBox .billboardFlow").eq(i).text(returnFloat(obj[i].MainForceIn/10000)+" 亿");

                //$(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).text("+"+returnFloat(obj[i].priceChange)+"");


                if(obj[i].priceChange >= 0){
                    $(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).text("+"+returnFloat(obj[i].priceChange)+"%");
                    $(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).css("color","#FD3642");
                }else if(obj[i].priceChange <0 ){
                    $(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).text(returnFloat(obj[i].priceChange)+"%");
                    $(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).css("color","#1DBF90");
                    $(".BillboardTableBox.StockBox .billboardTrade").eq(i).css("color","#1DBF90");
                }

                if( obj[i].Trade > 0){
                    $(".BillboardTableBox.StockBox .billboardTrade").eq(i).text(returnFloat(obj[i].Trade));
                }else if( obj[i].Trade <= 0 ){
                    $(".BillboardTableBox.StockBox .billboardTrade").eq(i).text("——");
                    //$(".BillboardTableBox.StockBox .billboardTrade").eq(i).text("——");

                    $(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).text("——");
                    $(".BillboardTableBox.StockBox .stockName").eq(i).append("<img src='img/SuspensionIcon.png' class='SuspensionIcon'>")
                }
                 //trTag ++;
	    
            }


           

            $(".BillboardTableBox.StockBox .stockLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr('itemId'));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });
            $(".Load1").css("display","none");
            
        }
    }
    function ajax_failFS(obj){
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2'>");
            StocksBillboardFlow();
        });
    }
}

//加载主题数据
function TopicsBillboardFlow(){
    httpGet("Reader/BillboardChart?type=1&count=5","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        if ( obj != undefined &&  obj != null && obj != "" && obj != []){
            for( var i = 0; i < obj.length; i++){

                $(".BillboardTableBox.TopicsBox .BillboardTable").append("" +
                "<tr class='BillboardTableImf'> " +
                "<td class='billboardTopicName topicLink'></td> " +
                "<td class='billboardTopicFlow'></td> " +
                "<td class='billboardTopicChange'>——</td> " +
                "<td class='billboardTopicTrade'>——</td> </tr>"+
                "");

                $(".BillboardTableBox.TopicsBox .billboardTopicName").eq(i).attr("itemId",obj[i].ID);
                $(".BillboardTableBox.TopicsBox .billboardTopicName").eq(i).text(obj[i].Name);
                $(".BillboardTableBox.TopicsBox .billboardTopicFlow").eq(i).text(returnFloat(obj[i].MainForceIn/10000)+" 亿");
                //$(".BillboardTableBox.StockBox .billboardTotalChange").eq(i).text("+"+returnFloat(obj[i].priceChange)+"");

                if(obj[i].priceChange >= 0){
                    $(".BillboardTableBox.TopicsBox .billboardTopicChange").eq(i).text("+"+returnFloat(obj[i].priceChange)+"%");
                    $(".BillboardTableBox.TopicsBox .billboardTopicChange").eq(i).css("color","#FD3642");
                }else if(obj[i].priceChange <0 ){
                    $(".BillboardTableBox.TopicsBox .billboardTopicChange").eq(i).text(returnFloat(obj[i].priceChange)+"%");
                    $(".BillboardTableBox.TopicsBox .billboardTopicChange").eq(i).css("color","#1DBF90");
                    $(".BillboardTableBox.TopicsBox .billboardTopicTrade").eq(i).css("color","#1DBF90");
                }else if( !isNaN(obj[i].priceChange) ){
                    $(".BillboardTableBox.TopicsBox .billboardTopicChange").eq(i).text("——");
                }

                if( !isNaN(obj[i].Trade) ){
                    $(".BillboardTableBox.TopicsBox .billboardTopicTrade").eq(i).text(returnFloat(obj[i].Trade));
                }else if( obj[i].Trade <= 0 ){
                    $(".BillboardTableBox.TopicsBox .billboardTopicTrade").eq(i).text("——");
                }else{
                    $(".BillboardTableBox.TopicsBox .billboardTopicTrade").eq(i).text("——");
                }
            }



            $(".BillboardTableBox.TopicsBox .topicLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });

            $(".Load2").css("display","none");
        }else{
        //    API内容为空
        //    $(".Load2").css("display","none");
            $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load2 .loadingImg2").on("click",function(){
                $(".Load2 .loadingImg2").remove();
                $(".Load2 .notcontent").remove();
                $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
                TopicsBillboardFlow();
            });
        }
    }

    function ajax_failFS(obj){
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
            TopicsBillboardFlow();
        });
    }

}



//加载席位数据
function SeatBillboardChartOnload(){
    httpGet("Reader/SeatBillboardChart?count=3","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        if ( obj != undefined &&  obj != null && obj != "" && obj != []){
            for( var i = 0; i < obj.length; i++){

                $(".BillboardSeatBox").append("" +
                "<div class='BillboardSeatImf'> " +
                "<div class='BillboardSeatName'></div> " +
                "<div class='BillboardSeatData'> " +
                "<span>统计资金累计龙虎榜流入</span> " +
                "<span class='BillboardSeatMoneyIn'></span> </div> <div class='BillboardSeatData'> " +
                "<span>资金累计龙虎榜流出</span> " +
                "<span class='BillboardSeatMoneyOut'></span> </div> <div class='BillboardSeatData'> " +
                "<span>操作个股数</span> " +
                "<span class='BillboardSeatStockCount'></span></div><div class='BillboardSeatStockData'> " +
                "<span>3日内累计涨幅最大的个股</span> " +
                "<span class='BillboardSeatStock'></span> " +
                "<span class='BillboardSeatStockChange'>——%</span></div></div>"+
                "");
                
                //
                $(".BillboardSeatBox .BillboardSeatName").eq(i).html(obj[i].SeatName.replace( "公司" , '公司<br>'));
                $(".BillboardSeatBox .BillboardSeatName").eq(i).attr("itemId", obj[i].SeatID);
                $(".BillboardSeatBox .BillboardSeatName").eq(i).attr("itemName", obj[i].SeatName);
                //$(".BillboardSeatBox .BillboardSeatName").eq(i).attr();
                $(".BillboardSeatBox .BillboardSeatMoneyIn").eq(i).text(returnFloat(obj[i].AllMoneyIn/10000)+" 亿");
                $(".BillboardSeatBox .BillboardSeatMoneyOut").eq(i).text(returnFloat(obj[i].AllMoneyOut/10000)+" 亿");
                $(".BillboardSeatBox .BillboardSeatStockCount").eq(i).text( obj[i].StockCount +"个" );
                $(".BillboardSeatBox .BillboardSeatStock").eq(i).text( obj[i].StockName );
                //
                if( obj[i].ChangePercent == "Infinity" ){
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).text("——");
                }else if(obj[i].ChangePercent >= 0){
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).text("+"+returnFloat(obj[i].ChangePercent)+"%");
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).css("color","#FD3642");
                }else if(obj[i].ChangePercent <0 ){
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).text(returnFloat(obj[i].ChangePercent)+"%");
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).css("color","#1DBF90");
                }else if( !isNaN(obj[i].ChangePercent) ){
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).text("——%");
                }else{
                    $(".BillboardSeatBox .BillboardSeatStockChange").eq(i).text("——%");
                }

            }

            $(".BillboardSeatBox .BillboardSeatName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    //console.log("暂无席位详情页");
                    var SeatNameURIChange = encodeURI(encodeURI($(this).attr("itemName")));
                    AddGoback(localStorage.N_url, 'tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&seatName='+SeatNameURIChange+'&scroll='+document.body.scrollTop);
                    //window.location.href ='tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                })
            });
            $(".Load3").css("display","none");
        }else{
            //    API内容为空
            $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load3 .loadingImg2").on("click",function(){
                $(".Load3 .loadingImg2").remove();
                $(".Load3 .notcontent").remove();
                $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
                SeatBillboardChartOnload();
            });
        }

    }

    function ajax_failFS(obj){

        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
            SeatBillboardChartOnload();
        });
    }

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
function touchMore(event){
    event.stopPropagation();
    event.preventDefault();
    AddGoback(localStorage.N_url, 'tool3_0_Billboard.html');
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href ='tool3_0_Billboard.html';
    //parent.location='index.html';
}
