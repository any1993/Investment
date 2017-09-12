/**
 * Created by Kris on 2017/2/24.
 */
var ItemId = GetQueryString("itemId");
var UserID = "br_1091827413";
//var ItemId = "e777bb93cc256de8d6e86b25d3a7e572";//组合
//var ItemId = "de6cca8a44e43d71408b7ad1c1818220";
//var ItemId = "dabbe795bee57d199a0129cd9de2219c";//组合
//var ItemId = "25198027c8a0f393b5273103234cdf3b";//组合
//var ItemId = "d06dfc3eea2e0d749b1f613b347c1bf0";//组合
//var ItemId = "g01";//组合
//var ItemId = "a76052b3cff1cb27799396b64d177df1";
//var ItemId = "802a77911e373d1e0fa2c3635928bc38";
//var ItemId = "197349";
//var ItemId = "197349";
var option1;
var option2;
var option4;
var myChart1;
var myChart2;
var myChart4;



var colorList = [
    '#F65261','#FFB810','#37C397','#0097A7','#5C6AC0',
    '#4FA5F4','#8A65C8','#D562CB','#B75B80','#F48DA4'
];

var relativeColorList = [
    '#5BBC75','#99DD7B','#BDE47D','#CCE89E',
    '#FFE56F','#FFC061','#FFA669','#FB7E65'
];

var fundClassification01 = 0;
var fundClassification02 = 0;
var fundClassification03 = 0;
var fundClassification04 = 0;
var fundClassification05 = 0;
var fundClassification06 = 0;

var StockSetTime = new Date();
StockSetTime = StockSetTime.toString();
StockSetTime = StockSetTime.substring(0,16)+"09:00:00"+StockSetTime.substring(24,42);

var fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
var fromTimeOfYearly = Date.parse(StockSetTime)/1000-31536000*10;   //成立以来
var fromTimeOfThreeYear = Date.parse(StockSetTime)/1000-31536000*3;   //三年数据
var fromTimeOfOneYear = Date.parse(StockSetTime)/1000-31536000;   //一年数据
var fromTimeOfHalfYearly = Date.parse(StockSetTime)/1000-15552000;  //六个月
var fromTimeOf3Monthly = Date.parse(StockSetTime)/1000-7776000;     //3个月
var fromTimeOfMonthly = Date.parse(StockSetTime)/1000-2592000;      //一个月
var endTime = (Date.parse(new Date())/1000);


//定义表格时间轴
var monthlyAxis3 = [];
var monthlyAxis6 = [];
var monthlyAxis12 = [];
var monthlyAxis36 = [];



//组合数据
var profitLineData=[];
var profitLineData02=[];
var profitLineData03=[];
var profitLineData04=[];
var profitLineData05=[];
//大盘数据
var profitLineData12=[];
var profitLineData13=[];
var profitLineData14=[];
var profitLineData15=[];
//日期
var profitChartDate=[];
var profitChartDate02=[];
var profitChartDate03=[];
var profitChartDate04=[];
var profitChartDate05=[];

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);
    var monthly3AxisTime = Date.parse(new Date())+ 28800000;
    var monthly6AxisTime = Date.parse(new Date())+ 28800000;
    var monthly12AxisTime = Date.parse(new Date())+ 28800000;
    var monthly36AxisTime = Date.parse(new Date())+ 28800000;
    for( var t3 = 0 ; t3 < 90 ;t3++){
        monthlyAxis3.unshift( new Date(monthly3AxisTime).toISOString().substring(5,10) );
        monthly3AxisTime -= 86400000;
    }
    for( var t6 = 0 ; t6 < 180 ;t6++){
        monthlyAxis6.unshift( new Date(monthly6AxisTime).toISOString().substring(5,10) );
        monthly6AxisTime -= 86400000;
    }
    for( var t12 = 0 ; t12 < 365 ;t12++){
        monthlyAxis12.unshift( new Date(monthly12AxisTime).toISOString().substring(5,10) );
        monthly12AxisTime -= 86400000;
    }
    for( var t36 = 0 ; t36 < 36 ;t36++){
        monthlyAxis36.unshift( new Date(monthly36AxisTime).toISOString().substring(0,7) );
        monthly36AxisTime -= 2678400000;
    }

    myChart1 = echarts.init(document.getElementById('GroupChart01'));
    myChart2 = echarts.init(document.getElementById('GroupChart02'));
    myChart4 = echarts.init(document.getElementById('chart_OG2'));

    option1= {
        tooltip : {trigger: 'item',
            formatter: "{b}: <br>基金类型占比：{c}%"
        },
        calculable : true,
        series : [
            {
                name:'组合基金配置详情',
                itemStyle : {
                    normal : {
                        label : {show : true,textStyle:{fontSize:14}},
                        //textStyle:{fontSize:14},
                        color: function(params) {
                            // build a color map as your need.
                            return colorList[params.dataIndex]
                        }
                    }
                    },
                //legendHoverLink:true,
                type:'pie',
                radius : ['30%', '65%'],
                center: '50%',
                data:[
                    //{value:0, name:'期货策略'},
                    //{value:0, name:'债券策略'},
                    //{value:0, name:'股票策略'},
                    //{value:0, name:'量化对冲'},
                    //{value:0, name:'事件驱动'}
                ]
            }
        ]
    };
    option2 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['智能组合','沪深300'],
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:50,x2:40,y:10,y2:60},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} %'
                }
            }
        ],
        series : [
            {
                name:'智能组合',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#F14745"
                    }
                },
                data:[]
            },
            {
                name:'沪深300',
                type:'line',
                smooth:true,
                itemStyle: {normal: {
                    color: "#989898"
                }},
                data:[-16, 22, 102, 108, 75, 49]
            }
        ]
    };

    option4 = {
        tooltip : {trigger: 'item',
            //formatter: "{b}: <br>原比{c}%<br>(图比{d}%)"
            formatter: "{b}: <br>投资占比：{c}%"
        },
        legend: {orient : 'vertical', x : 'center', y : 'center', itemGap:4, itemHeight:8, itemWidth:16, textStyle:{fontSize:12}, data:[]},
        calculable : true,
        series : [
            {   name:'访问来源', type:'pie', radius : ['55%', '90%'], legendHoverLink:true,
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


    myChart1.setOption(option1);
    myChart2.setOption(option2);


    //获取组合详情
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/Portfolio?portfolioID="+ItemId,
        dataType:'json',
        success: function (data) {
            //console.log("组合详情");
            //console.log(data);

            if( data != undefined && data != null && data != ""){
                $(".pageTitle").html(data.PortfolioName+" 组合资产详情");
                if( data.ProfitRate != undefined && data.ProfitRate != null && data.ProfitRate != "" ){
                    $(".dataDisplayNm01").text(returnFloat(data.ProfitRate)+"%");
                }
                if( data.WithstandVolatility != undefined && data.WithstandVolatility != null && data.WithstandVolatility != "" ) {
                    $(".dataDisplayNm02").text(returnFloat(data.WithstandVolatility)+"%");
                }
                if( data.Volatility != undefined && data.Volatility != null && data.Volatility != "" ){
                    $(".dataDisplayNm03").text(returnFloat(data.Volatility)+"%");
                }

                var productsData =  [];
                if( data.Products != undefined && data.Products != null && data.Products != "" ){
                    for( var i = 0 ; i < data.Products.length ; i++){
                        if( data.Products[i].Classification == 1 ){
                            fundClassification01 += data.Products[i].Proportion * 100 ;
                        }else if( data.Products[i].Classification == 2 ){
                            fundClassification02 += data.Products[i].Proportion * 100 ;
                        }else if( data.Products[i].Classification == 3 ){
                            fundClassification03 += data.Products[i].Proportion * 100 ;
                        }else if( data.Products[i].Classification == 4 ){
                            fundClassification04 += data.Products[i].Proportion * 100 ;
                        }else if( data.Products[i].Classification == 5 ){
                            fundClassification05 += data.Products[i].Proportion * 100 ;
                        }else{
                            fundClassification06 += data.Products[i].Proportion * 100 ;
                        }
                    }
                    if( fundClassification01 != 0){
                        productsData.push({value:fundClassification01,name:'期货策略'})
                    }
                    if( fundClassification02 != 0){
                        productsData.push({value:fundClassification02,name:'债券策略'})
                    }
                    if( fundClassification03 != 0){
                        productsData.push({value:fundClassification03,name:'股票策略'})
                    }
                    if( fundClassification04 != 0){
                        productsData.push({value:fundClassification04,name:'量化对冲'})
                    }
                    if( fundClassification05 != 0){
                        productsData.push({value:fundClassification05,name:'事件驱动'})
                    }
                    if( fundClassification06 != 0){
                        productsData.push({value:fundClassification06,name:'其他'})
                    }
                }else{
                    $("#GroupChart01").css("height","80px");
                }

                if( productsData == [] || productsData.length == 0 ){
                    $("#GroupChart01").css("height","80px");
                }


                //获取个股详情//////!!

                //自选股
                httpGet("Reader/GetUserStocks?userID="+UserID, "", true, ajax_successStocks, ajax_failStocks);
                function ajax_successStocks(obj) {
                    //console.log(obj);

                    var num = obj.length;
                    var showednum = obj.length;
                    var elseStocks = 0;

                    var fakePercent = [0.4000,0.2000,0.1200,0.0800,0];
                    if (obj != null && obj != "" && obj != undefined){
                        //console.log(obj.length);
                        for (var s = 0; s < obj.length; s++) {
                            $(".StockBoxOG").append("<tr class='StockOGimf'> <td> " +
                            "<span class='stockName stockLink'></span> " +
                            "<span class='stockCode'></span> </td> " +
                            "<td class='Trade'></td> " +
                            "<td class='Changepercent'></td>" +
                            "<td><span class='pctNum shares_percent'>已清仓</span><div class='percentage'><div class='flexA'></div></div></td></tr>");

                            $(".stockName").eq(s).attr("itemId",obj[s].Symbol);
                            $(".stockName").eq(s).text(obj[s].Name);
                            $(".stockCode").eq(s).text(obj[s].Code);
                            if( obj[s].Trade > 0 ){
                                $(".Trade").eq(s).text(returnFloat(obj[s].Trade));
                            }else if( obj[s].Trade <= 0 ){
                                $(".Trade").eq(s).text("——");
                            }

                            if (obj[s].Changepercent >= 0) {
                                $(".Changepercent").eq(s).text("+" + returnFloat(obj[s].Changepercent ) + "%");
                            } else {
                                $(".Changepercent").eq(s).text(returnFloat(obj[s].Changepercent ) + "%");
                                $(".Changepercent").eq(s).css("color", "#20c062");
                            }

                            if ( obj.length <= 5) {
                                if( s ==  obj.length - 1 ){
                                    var lastPresent = 0.8;
                                    for(var i= 0 ;i < s; i++){
                                        lastPresent = lastPresent - fakePercent[i];
                                    }
                                    $(".shares_percent").eq(s).text(returnFloat((lastPresent+Math.random()*0.05)*100) + "%");
                                    $(".flexA").eq(s).css("width", (lastPresent+Math.random()*0.05)*100 + "%");
                                }else{
                                    $(".shares_percent").eq(s).text(returnFloat((fakePercent[s]+Math.random()*0.05)*100) + "%");
                                    $(".flexA").eq(s).css("width", (fakePercent[s]+Math.random()*0.05)*100 + "%");
                                }
                            }else if(obj.length > 5){
                                $(".shares_percent").eq(s).text(returnFloat((fakePercent[s]+Math.random()*0.05)*100) + "%");
                                $(".flexA").eq(s).css("width", (fakePercent[s]+Math.random()*0.05)*100 + "%");
                            }


                            //    $(".Changepercent").eq(s).text("+" + returnFloat(obj.Stocks[s].StockInfo.Changepercent ) + "%");
                            //} else {
                            //    $(".Changepercent").eq(s).text(returnFloat(obj.Stocks[s].StockInfo.Changepercent ) + "%");
                            //    $(".Changepercent").eq(s).css("color", "#20c062");
                            //}
                            //if (obj.Stocks[s].Current != null && obj.Stocks[s].Current != "" && obj.Stocks[s].Current.Percent != 0) {
                            //    $(".shares_percent").eq(s).text(obj.Stocks[s].Current.Percent + "%");
                            //    $(".flexA").eq(s).css("width", obj.Stocks[s].Current.Percent + "%");
                            //} else {
                            //    $(".flexA").eq(s).css("width", "0");
                            //}


                            //if (obj.Stocks[s].Current != null && obj.Stocks[s].Current.Percent != 0) {
                            //    if (s < 7) {
                            //        option2.legend.data.push(obj.Stocks[s].StockInfo.Name);
                            //        option2.series[0].data.push({value: 0, name: ""});
                            //        option2.series[0].data[s].name = obj.Stocks[s].StockInfo.Name;
                            //        option2.series[0].data[s].value = obj.Stocks[s].Current.Percent;
                            //        cashProportion -= obj.Stocks[s].Current.Percent;
                            //    } else {
                            //        elseStocks += obj.Stocks[s].Current.Percent;
                            //        cashProportion -= obj.Stocks[s].Current.Percent;
                            //    }
                            //} else {
                            //    showednum -= 1;
                            //}



                            //if (obj[s].Current != null && obj.Stocks[s].Current.Percent != 0) {
                            if (s < 7) {
                                option4.legend.data.push(obj[s].Name);
                                option4.series[0].data.push({value: 0, name: ""});
                                option4.series[0].data[s].name = obj[s].Name;
                                option4.series[0].data[s].value = parseFloat($(".shares_percent").eq(s).text());
                                //cashProportion -= obj.Stocks[s].Current.Percent;
                            } else {
                                //elseStocks += obj.Stocks[s].Current.Percent;
                                //cashProportion -= obj.Stocks[s].Current.Percent;
                            }
                            //} else {
                            //    showednum -= 1;
                            //}

                        }
                        myChart4.setOption(option4);

                        $(".StockBoxOG .stockName").each(function(){
                            $(this).on("click",function(event){
                                event.stopPropagation();
                                event.preventDefault();
                                AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                                //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                                //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                            })
                        });
                    }
                }
                function ajax_failStocks(obj) {
                    console.log(obj);
                }
                //组合详情





                //option1.series.data[0].value = 100;
                //console.log(productsData);
                option1.series[0].data = productsData;
                myChart1.setOption(option1);
            }else{
                $("#GroupChart01").css("height","80px");
            }

        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //获取组合数据指标
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioDataIndex?PortfolioID="+ItemId,
        dataType:'json',
        success: function (data) {
            //console.log("组合数据指标");
            //console.log(data);
            if( data != null && data != undefined){
                $(".dataDisplayNo01").text(returnFloat(data.AnnualizedProfitRate)+"%");
                $(".dataDisplayNo02").text(returnFloat(data.MaxRetracement)+"%");
                $(".dataDisplayNo03").text(returnFloat(data.AnnualizedVolatility)+"%");
                $(".dataDisplayNo04").text(returnFloat(data.MonthlyWinrate)+"%");
                $(".dataDisplayNo05").text(returnFloat(data.MaxMonthlyIncrease)+"%");
                $(".dataDisplayNo06").text(returnFloat(data.SharpeRate));
                $(".dataDisplayNo07").text(returnFloat(data.AverageMonthlyProfit)+"%");
                $(".dataDisplayNo08").text(returnFloat(data.MaxMonthlyDecrease)+"%");
                $(".dataDisplayNo09").text(returnFloat(data.CalmarRate));

                //sessionStorage.dataDisplayNoN1 = returnFloat(Math.random()*50)+"%";
                //sessionStorage.dataDisplayNoN2 = returnFloat(Math.random()*30)+"%";
                //sessionStorage.dataDisplayNoN3 = returnFloat(Math.random()*10)+"%";

                $(".dataDisplayNoN1").text(returnFloat(Math.random()*50)+"%");
                $(".dataDisplayNoN2").text(returnFloat(Math.random()*30)+"%");
                $(".dataDisplayNoN3").text(returnFloat(Math.random()*10)+"%");


            }else{
                $(".dataDisplay001").text("（组合生成未满一月，暂无详细统计数据）");
            }
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //获取组合收益曲线
    //近三月
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioHistoryProfit?PortfolioID="+ItemId+"&accuracy=1&fromTime="+fromTimeOf3Monthly+"&endtime="+endTime,
        dataType:'json',
        success: function (data) {
            //组合收益曲线
            //console.log(data);
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis3.length ; i++){
                    profitLineData02[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].dateTime * 1000).toISOString().substring(5,10) == monthlyAxis3[i]){
                            profitLineData02[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis3.length-1 ; t > 1; t--) {
                if (profitLineData02[t] == "-" ) {
                    profitLineData02[t] = profitLineData02[t + 1];
                }
            }

            option2.xAxis[0].data = monthlyAxis3;
            option2.series[0].data = profitLineData02;
            option2.series[1].data = profitLineData12;
            myChart2.setOption(option2);
        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近六月
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioHistoryProfit?PortfolioID="+ItemId+"&accuracy=1&fromTime="+fromTimeOfHalfYearly+"&endtime="+endTime,
        dataType:'json',
        success: function (data) {
            //组合收益曲线
            //console.log(data);
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                    profitLineData03[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].dateTime * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                            profitLineData03[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis6.length-1 ; t > 1; t--) {
                if (profitLineData03[t] == "-" ) {
                    profitLineData03[t] = profitLineData03[t + 1];
                }
            }
            //if (data != null && data != "" && data != undefined) {
            //    for(var i = 0 ;i < data.length ; i++){
            //        //newDate.setTime(data[i].Date * 1000);
            //        //profitChartDate02.push(newDate.toISOString().substring(5,10));
            //        profitLineData03.push( data[i].ProfitRate);
            //    }
            //}


        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近一年
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioHistoryProfit?PortfolioID="+ItemId+"&accuracy=1&fromTime="+fromTimeOfOneYear+"&endtime="+endTime,
        dataType:'json',
        success: function (data) {
            //组合收益曲线
            //console.log(data);
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis12.length ; i++){
                    profitLineData04[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].dateTime * 1000).toISOString().substring(5,10) == monthlyAxis12[i]){
                            profitLineData04[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis12.length-1 ; t > 1; t--) {
                if (profitLineData04[t] == "-" ) {
                    profitLineData04[t] = profitLineData04[t + 1];
                }
            }

            //if (data != null && data != "" && data != undefined) {
            //    for (var i = 0; i < data.length; i++) {
            //        //newDate.setTime(data[i].Date * 1000);
            //        //profitChartDate02.push(newDate.toISOString().substring(5,10));
            //        profitLineData04.push(data[i].ProfitRate);
            //    }
            //}

        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近三年
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioHistoryProfit?PortfolioID="+ItemId+"&accuracy=2&fromTime="+fromTimeOfThreeYear+"&endtime="+endTime,
        dataType:'json',
        success: function (data) {
            //组合收益曲线
            //console.log(data);
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis36.length ; i++){
                    profitLineData05[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].dateTime * 1000).toISOString().substring(0,7) == monthlyAxis36[i]){
                            profitLineData05[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis36.length-1 ; t > 1; t--) {
                if (profitLineData05[t] == "-" ) {
                    profitLineData05[t] = profitLineData05[t + 1];
                }
            }

            //if (data != null && data != "" && data != undefined) {
            //    for (var i = 0; i < data.length; i++) {
            //        //newDate.setTime(data[i].Date * 1000);
            //        //profitChartDate02.push(newDate.toISOString().substring(5,10));
            //        profitLineData05.push(data[i].ProfitRate);
            //    }
            //}

        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    //大盘数据
    //近三月
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=1&fromTime="+fromTimeOf3Monthly+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘近三月数据");
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis3.length ; i++){
                    profitLineData12[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis3[i]){
                            profitLineData12[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis3.length-1 ; t > 1; t--) {
                if (profitLineData12[t] == "-" ) {
                    profitLineData12[t] = profitLineData12[t + 1];
                }
            }
            option2.xAxis[0].data = monthlyAxis3;
            option2.series[0].data = profitLineData02;
            option2.series[1].data = profitLineData12;
            myChart2.setOption(option2);

            //console.log(data);
            //console.log(profitChartDate);
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //近六月
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=1&fromTime="+fromTimeOfHalfYearly+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘半年数据");
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                    profitLineData13[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                            profitLineData13[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis6.length-1 ; t > 1; t--) {
                if (profitLineData13[t] == "-" ) {
                    profitLineData13[t] = profitLineData13[t + 1];
                }
            }

            //if (data != null && data != "" && data != undefined) {
            //
            //    var newDate=new Date();
            //    //profitChartDate = [];
            //    for(var i = 0 ;i < data.length ; i++){
            //        newDate.setTime(data[i].Date * 1000);
            //        profitChartDate03.push(newDate.toISOString().substring(0,10));
            //        profitLineData13.push(data[i].ProfitRate);
            //    }
                //console.log(data);
                //console.log(profitChartDate);
            //}
        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近一年
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=1&fromTime="+fromTimeOfOneYear+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘一年数据");
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis12.length ; i++){
                    profitLineData14[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis12[i]){
                            profitLineData14[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis12.length-1 ; t > 1; t--) {
                if (profitLineData14[t] == "-" ) {
                    profitLineData14[t] = profitLineData14[t + 1];
                }
            }


            //if (data != null && data != "" && data != undefined) {
            //
            //    var newDate=new Date();
            //    //profitChartDate = [];
            //    for(var i = 0 ;i < data.length ; i++){
            //        newDate.setTime(data[i].Date * 1000);
            //        profitChartDate04.push(newDate.toISOString().substring(0,10));
            //        profitLineData14.push(data[i].ProfitRate);
            //    }
            //    //console.log(data);
            //    //console.log(profitChartDate);
            //}
        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近三年
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=2&fromTime="+fromTimeOfThreeYear+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘三年数据");
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis36.length ; i++){
                    profitLineData15[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(0,7) == monthlyAxis36[i]){
                            profitLineData15[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis36.length-1 ; t > 1; t--) {
                if (profitLineData15[t] == "-" ) {
                    profitLineData15[t] = profitLineData15[t + 1];
                }
            }

            //console.log(data);
            //console.log(profitChartDate);

        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //获取组合产品相关系数
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductRelevanceIndex?PortfolioID="+ItemId,
        dataType:'json',
        success: function (data) {
            //console.log(data);
            if(data != null && data != undefined && data != ""){
                var fundIndexList = "<td>产品列表</td>";
                for(var i = 0;i < data.length;i++){
                    if( i > 4){
                        break;
                    }
                    fundIndexList += "<td>"+data[i].ProductName+"</td>";
                }
                $(".correlationProductTable").append("" +
                "<tr class='correlationProductTableTitle'> " +fundIndexList +
                "</tr>");
                for(var j = 0;j < data.length;j++){
                    if( j > 4){break;}
                    $(".correlationProductTable").append("<tr class='correlationProductTableBlock'>" +
                    "<td>"+data[j].ProductName+"</td>" +
                    "</tr>");
                    for( var k = 0;k < data[j].RelativeDegree.length;k++){
                        if( data[j].RelativeDegree[k] < -0.75 ){
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: "+relativeColorList[0]+"'>"+returnNet(data[j].RelativeDegree[k])+"</td>");
                        }else if( data[j].RelativeDegree[k] >= -0.75  && data[j].RelativeDegree[k] < -0.5 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[1] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] >= -0.5  && data[j].RelativeDegree[k] < -0.25 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[2] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] >= -0.25  && data[j].RelativeDegree[k] < 0 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[3] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] == 0  ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: #F2F2F2'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");

                        }else if( data[j].RelativeDegree[k] > 0  && data[j].RelativeDegree[k] <= 0.25 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[4] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] > 0.25  && data[j].RelativeDegree[k] <= 0.5 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[5] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] > 0.5  && data[j].RelativeDegree[k] <= 0.75 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[6] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] > 0.75  && data[j].RelativeDegree[k] < 1 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td style='background-color: " + relativeColorList[7] + "'>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }else if( data[j].RelativeDegree[k] >= 1 ) {
                            $(".correlationProductTableBlock").eq(j).append("" +
                            "<td>" + returnNet(data[j].RelativeDegree[k]) + "</td>");
                        }
                        //if(data[j].RelativeDegree[k] != 0){
                        //    $(".correlationProductTableBlock").eq(j).append("" +
                        //    "<td style='background-color: #FFE56F'>"+returnNet(data[j].RelativeDegree[k])+"</td>" +
                        //    "");
                        //}else{
                        //    $(".correlationProductTableBlock").eq(j).append("" +
                        //    "<td>"+returnNet(data[j].RelativeDegree[k])+"</td>" +
                        //    "");
                        //}
                    }
                }
            }else{
                $(".relativeIndexChart").css("display","none");
                $(".relativeIndexNoData").css("display","block");
            }
        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    $(".productDetailsBtnBox>.productDetailsBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".productDetailsBtnBox>.productDetailsBtn").removeClass("seleted");
            $(this).addClass("seleted");
            $(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            $(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
        })
    });

    $(".ChartContentSwitchBtnBox>.ChartContentSwitchBtn1").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".ChartContentSwitchBtnBox>.ChartContentSwitchBtn1").removeClass("seleted");
            $(this).addClass("seleted");

            if( index == 0 ){
                option2.xAxis[0].data = monthlyAxis3;
                option2.series[0].data = profitLineData02;
                option2.series[1].data = profitLineData12;
                myChart2.setOption(option2);
            }else if( index ==1){
                option2.xAxis[0].data = monthlyAxis6;
                option2.series[0].data = profitLineData03;
                option2.series[1].data = profitLineData13;
                myChart2.setOption(option2);
            }else if( index ==2){
                option2.xAxis[0].data = monthlyAxis12;
                option2.series[0].data = profitLineData04;
                option2.series[1].data = profitLineData14;
                myChart2.setOption(option2);
            }else if( index ==3){
                option2.xAxis[0].data = monthlyAxis36;
                option2.series[0].data = profitLineData05;
                option2.series[1].data = profitLineData15;
                myChart2.setOption(option2);
            }else{
                option2.xAxis[0].data = monthlyAxis3;
                option2.series[0].data = profitLineData02;
                option2.series[1].data = profitLineData12;
                myChart2.setOption(option2);
            }

            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
        })
    });

    $(".GroupChart01Btn").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href = 'secondaryPage_ProductAssetsDetails.html?itemId='+ItemId;
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    })

}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //parent.location='index.html';
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}