/**
/**
 * Created by Kris on 2016/9/20.
 */
var ItemId = GetQueryString("itemId");
var SeatName = GetQueryString("seatName");
var pageScroll=parseInt(GetQueryString("scroll"));
var myChart1;
var myChart2;


var hourList = ["09:00","10:00","11:00","11:30","13:00","14:00","15:00","16:00"];
var timeArr1=["08:00"];
var timeArr2=[];

var array01=[];
var array02=[];
var array03=[];
var array04=[];
var array05=[];

var arrayTow=[];

var array11=[];
var array12=[0,0,0,0,0];
var array13=[0,0,0,0,0];

var option1 = {};
var option2 = {};


var sortType = 0 ;
var loadflag = 0;

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

    myChart1 = echarts.init(document.getElementById('Chart_3dt'));
    myChart2 = echarts.init(document.getElementById('Chart_SCT'));

    //$(".switchofSeat1>.switchofSeat1btn").each(function(index){
    //    $(this).on("click",function(e){
    //        e.stopPropagation();
    //        e.preventDefault();
    //        //if( index == 0 ){
    //        //    $(".IncreaseBox").addClass("boxDisplay");
    //        //    $(".BulkBox").removeClass("boxDisplay");
    //        //}else if( index == 1 ){
    //        //    $(".BulkBox").addClass("boxDisplay");
    //        //    $(".IncreaseBox").removeClass("boxDisplay");
    //        //}
    //        $(".switchofSeat1>.switchofSeat1btn").removeClass("thisEffect");
    //        $(this).addClass("thisEffect");
    //
    //    })
    //});

    option1 ={
        tooltip : {
	          trigger: 'axis'
        },
        legend: {data:["","","","",""], y:'bottom',icon:'bar', itemHeight:8, itemWidth:12},
        calculable : true,
        animationDuration:100,

        animationDurationUpdate:10,
        grid:{x:40,x2:20,y:30,y2:55},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : hourList
            }
        ],
        yAxis : [
            {
                type : 'value',
                //boundaryGap:0.3,
                splitLine : {show: false}, axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}}, scale:true}
        ],
        series : [
            {
                name:'',
                type:'line',
                smooth:true,

                itemStyle: {
                    normal: {
                        color: "#ff5825"
                    }
                },
                data:[]
            },
            {
                name:'',
                type:'line',
                smooth:true,
                //yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: "#ffb835"
                    }
                },
                data:[]
            },
            {
                name:'',
                type:'line',
                smooth:true,
                //yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: "#5f88f5"
                    }
                },
                data:[]
            },
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#20b0d6"
                    }
                },
                data:[]
            },
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#67d153"
                    }
                },
                data:[]
            }
        ]
    };


    option2 ={
        tooltip : {
            trigger: 'axis'
        },
        legend: {data:["上榜次数"], show:false},
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:10,
        grid:{y:20,y2:40},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {   type : 'value',
                splitLine : {show: false}, axisLabel : {show:true, interval: 'auto', textStyle: {fontSize: 12}}, scale:true}
        ],
        series : [
            {
                name:'上榜次数',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#20B0D6"
                    }
                },
                data:[]
            }
        ]
    };


    $(".switchOfSeat2>.switchSsd").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            if( index == 0 ){
                SeatStocksImf(0);
            }else if( index == 1 ){
                SeatStocksImf(2);
            }else if( index == 2 ){
                SeatStocksImf(4);
            }else {
                SeatStocksImf(0);
            }

            $(".switchOfSeat2>.switchSsd").removeClass("thisDisplay");
            $(this).addClass("thisDisplay");

        })
    });


    dataOnLoad();
    SeatStocksImf(sortType);


}


function dataOnLoad(){
    $(".SeatDetailPageSeatName").html(decodeURI(SeatName).replace( "公司" , '公司<br>'));
    arrayTow = [];

    arrayTow = [];
    //获取指定营业部席位的个股上榜次数
    httpGet("Reader/StockUpBillBoard?seatId="+ItemId+"&count=7","",true,ajax_successListT,ajax_failListT);
    function ajax_successListT(obj){
        //console.log("获取指定营业部席位的个股上榜次数");
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){;
            var Tilist = [];
            for(var l in obj) {
                Tilist.unshift(l.substring(5,10));
                arrayTow.unshift(obj[l]);
            }
            option2.xAxis[0].data = Tilist;
            option2.series[0].data = arrayTow;
            myChart2.setOption(option2);

            //console.log(Tilist);
            //console.log(arrayTow);
        }else{

        }
        loadend();

    }
    function ajax_failListT(){
        console.log("加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            dataOnLoad();
        });
    }

    //获取协同营业部信息
    httpGet("Reader/SynergySeats?seatId="+ItemId+"&count=5","",true,ajax_successListC,ajax_failListC);
    function ajax_successListC(obj){
        //console.log("获取协同营业部信息");
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){
            for( var i = 0; i < obj.length; i++){
                $(".collaborativeTable").append(" <tr class='collaborativeImf'> " +
                "<td class='SynergySeatName'></td> " +
                "<td class='RemarkText'>-</td> " +
                "<td class='SynergyTime'>0</td> " +
                "<td class='RelatedStocks'>-</td></tr>");

                $(".collaborativeTable .SynergySeatName").eq(i).html(obj[i].SynergySeatName.replace( "公司" , '公司<br>'));

                if(obj[i].Remark != null && obj[i].Remark != "" && obj[i].Remark != undefined){
                    $(".collaborativeTable .RemarkText").eq(i).text(obj[i].Remark);
                }else{
                    //$(".collaborativeTable .RemarkText").eq(i).text("-");
                }

                $(".collaborativeTable .SynergyTime").eq(i).text(obj[i].SynergyTime);

                if(obj[i].RelatedStocks != null && obj[i].RelatedStocks != "" && obj[i].RelatedStocks != undefined){
                    if( obj[i].RelatedStocks.length == 1 ){
                        $(".collaborativeTable .RelatedStocks").eq(i).text(obj[i].RelatedStocks[0].Name);
                        $(".collaborativeTable .RelatedStocks").eq(i).attr("itemId",obj[i].RelatedStocks[0].Symbol);
                    }else if( obj[i].RelatedStocks.length >= 2 ){
                        $(".collaborativeTable .RelatedStocks").eq(i).html(obj[i].RelatedStocks[0].Name+"<br>"+obj[i].RelatedStocks[1].Name);

                    }
                }else{
                    //$(".collaborativeTable .RelatedStocks").eq(i).text("-");
                }
            }

            $(".collaborativeTable .RelatedStocks").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId")+"&scroll="+document.body.scrollTop);
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop;
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });

        }else{
            $(".collaborativeTableDisPlay").css("display","none");

        }

        loadend();
    }
    function ajax_failListC(){
        console.log("加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            dataOnLoad();
        });
    }


    //获取席位昨天上榜股票当日的股价走势
    httpGet("Reader/SeatStockTrends?seatId="+ItemId,"",true,ajax_successListB,ajax_failListB);
    function ajax_successListB(obj){
        //console.log("获取席位昨天上榜股票当日的股价走势");
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){
            //var temp = "";
            var IDlist = [];
            for(var i in obj) {
                IDlist.push(i);
                //console.log(IDlist.length);
                if( i == IDlist[0]){
                    if( obj[i][0] != undefined && obj[i][0] != null ){
                        option1.series[0].name = obj[i][0].Name;
                        option1.legend.data[0] = obj[i][0].Name;
                    }
                }else if( i == IDlist[1] ){
                    if( obj[i][0] != undefined  &&  obj[i][0] != null ){
                        option1.series[1].name = obj[i][0].Name;
                        option1.legend.data[1] = obj[i][0].Name;
                    }
                }else if( i == IDlist[2] ){
                    if( obj[i][0] != undefined  &&  obj[i][0] != null ){
                        option1.series[2].name = obj[i][0].Name;
                        option1.legend.data[2] = obj[i][0].Name;
                    }
                }else if( i == IDlist[3] ){
                    if( obj[i][0] != undefined  &&  obj[i][0] != null ){
                        option1.series[3].name = obj[i][0].Name;
                        option1.legend.data[3] = obj[i][0].Name;
                    }
                }else if( i == IDlist[4] ){
                    if( obj[i][0] != undefined  &&  obj[i][0] != null ){
                        option1.series[4].name = obj[i][0].Name;
                        option1.legend.data[4] = obj[i][0].Name;
                    }
                }else{

                }
                //option1.series[snm].name = obj[i][snm].Name;
                //option1.legend.data[snm] = obj[i][snm].Name;

                //console.log(obj[i][0].Name);
                for( var sn = 0; sn < obj[i].length;sn++){
                    //console.log(obj[i][sn].length);
                    //option1.series[sn].name =  obj[i][sn].Name;
                    //console.log(obj[i][sn].Ticktime.substring(11,13));
                    for( var tick = 0; tick < hourList.length ;tick ++){
                        //console.log(obj[i][sn].Trade);
                        if( hourList[tick].substring(0,2) == obj[i][sn].Ticktime.substring(11,13)) {
                            //    console.log(tranTimeStamp(obj[i].CountTime));
                            //console.log(IDlist);
                            if( i == IDlist[0]){
                                array01[tick]=obj[i][tick].Trade;
                                array01[3]=array01[2];
                            }else if( i == IDlist[1] ){
                                array02[tick]=obj[i][tick].Trade;
                                array02[3]=array02[2];
                            }else if( i == IDlist[2] ){
                                array03[tick]=obj[i][tick].Trade;
                                array03[3]=array03[2];
                            }else if( i == IDlist[3] ){
                                array04[tick]=obj[i][tick].Trade;
                                array04[3]=array04[2];
                            }else if( i == IDlist[4] ){
                                array05[tick]=obj[i][tick].Trade;
                                array05[3]=array05[2];
                            }else{

                            }
                            //array03.push(obj[i].NewsHot);
                        }
                    }
                    //console.log(tranTimeStampDateDiff(obj[i][sn].Ticktime));
                }
            }
            if( IDlist.length == 0){
                //console.log("noData");
                $(".SeatStockTrendsChart").css("display", "none");
            }else if( IDlist.length == 1){
                //console.log("1");
                option1.tooltip.formatter = "{b}<br>{a0} : {c0} ";
                option1.series[0].data = array01;
                myChart1.setOption(option1);

            }else if( IDlist.length == 2){
                //console.log("2");
                option1.tooltip.formatter = "{b}<br>{a0} : {c0} <br> {a1} : {c1}";
                option1.series[0].data = array01;
                option1.series[1].data = array02;
                myChart1.setOption(option1);

            }else if( IDlist.length == 3){
                //console.log("3");
                option1.tooltip.formatter = "{b}<br>{a0} : {c0} <br> {a1} : {c1}<br>{a2} : {c2}";
                option1.series[0].data = array01;
                option1.series[1].data = array02;
                option1.series[2].data = array03;
                myChart1.setOption(option1);


            }else if( IDlist.length == 4){
                //console.log("4");
                option1.tooltip.formatter = "{b}<br>{a0} : {c0} <br> {a1} : {c1}<br>{a2} : {c2}<br>{a3} : {c3}";
                option1.series[0].data = array01;
                option1.series[1].data = array02;
                option1.series[2].data = array03;
                option1.series[3].data = array04;
                myChart1.setOption(option1);

            }else if( IDlist.length == 5){
                //console.log("5");
                option1.tooltip.formatter = "{b}<br>{a0} : {c0} <br> {a1} : {c1}<br>{a2} : {c2}<br>{a3} : {c3}<br>{a4} : {c4}";
                option1.series[0].data = array01;
                option1.series[1].data = array02;
                option1.series[2].data = array03;
                option1.series[3].data = array04;
                option1.series[4].data = array05;
                myChart1.setOption(option1);
            }else{
                console.log("最多就五个了【摊手");
            }


            //console.log(option1);
            //console.log(array01);
            //console.log(array02);
            //console.log(array03);
            //console.log(array04);
            //console.log(array05);

        }else{

        }
        loadend();
    }
    function ajax_failListB(){
        console.log("加载失败");


        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            dataOnLoad();
        });
    }

}



function SeatStocksImf(sortType){
    $(".seatDataTable").empty();
    $(".Load5").css("display", "block");
    $(".loadBoard").css("display", "block");
    //获取营业部信息
    httpGet("Reader/SeatStocks?seatId="+ItemId+"&sortType="+sortType+"&count=10","",true,ajax_successListB,ajax_failListB);
    function ajax_successListB(obj){
        //console.log("获取营业部信息");
        //console.log(obj);

        if( obj != null && obj != "" && obj != undefined){
            $(".seatDataTable").empty();
            $(".seatDataTable").append(" <tr class='seatDataTitle'> <td>股票名</td> <td>上榜时间</td> <td>买卖净额(万)</td> <td>上榜原因</td> </tr>");
            for( var i = 0; i < obj.length; i++){
                $(".seatDataTable").append("  <tr class='seatDataImf'><td>" +
                "<span class='nameOfStockAbout'></span> " +
                "<span class='codeOfStockAbout'></span></td> " +
                "<td class='UpDatetime'></td> " +
                "<td class='AllAmount'></td> " +
                "<td class='UpReason'></td> </tr>");

                $(".seatDataTable .nameOfStockAbout").eq(i).text(obj[i].StockName);
                $(".seatDataTable .nameOfStockAbout").eq(i).attr("itemId", obj[i].StockId);
                $(".seatDataTable .codeOfStockAbout").eq(i).text(stocksIdTransform(obj[i].StockId));
                $(".seatDataTable .UpDatetime").eq(i).text(obj[i].UpDatetime.substring(2,10));
                $(".seatDataTable .AllAmount").eq(i).text(returnFloat(obj[i].AllAmount/10000));
                $(".seatDataTable .UpReason").eq(i).text(obj[i].UpReason);

            }

            $(".seatDataTable .nameOfStockAbout").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId")+"&scroll="+document.body.scrollTop);
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop;
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });


        }else{
            $(".seatDataTable").empty();
        }
        $(".Load5").css("display", "none");
        $(".loadBoard").css("display", "none");
        //loadendOfList();
    }
    function ajax_failListB(){
        console.log("加载失败");
        $(".Load5").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load5").css("z-index","5");
        $(".Load5 .loadingImg2").on("click",function(){
            $(".Load5 .loadingImg2").remove();
            $(".Load5 .notcontent").remove();
            $(".Load5").html("<img src='img/loading.gif' class='loadingImg2'>");
            SeatStocksImf(sortType);
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
    //window.location.href = 'tool3_0_billboard.html?scroll='+pageScroll;
    //slide('right', 'lightblue', 1, 'tool3_0_billboard.html?scroll='+pageScroll);
}

function loadend(){
    if(loadflag >= 2){
        loadflag = 0;

        $(".loading").css("display", "none");
        //$(".loading").css("display", "none");

        //scollto(thisScroll);
    }else{
        loadflag += 1;
    }


    //$(".loading").css("display", "none");
}
