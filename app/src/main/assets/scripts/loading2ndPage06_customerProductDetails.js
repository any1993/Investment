/**
 * Created by Kris on 2017/2/27.
 */


var ItemId = GetQueryString("itemId");
var CustomerId = GetQueryString("customerId");
//var ItemId = "25198027c8a0f393b5273103234cdf3b";
//var ItemId = "g01";
//var CustomerId = "40f79972e4bb5380f262f305dd0f1fd7";
//var CustomerId = "10000";

var option1;
var option2;
var option21;
var option3;
var option31;
var option4;
var option5;
var myChart1;
var myChart2;
var myChart3;
var myChart4;
var myChart5;
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


var productDateList = [];

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
    myChart3 = echarts.init(document.getElementById('GroupChart03'));
    myChart4 = echarts.init(document.getElementById('GroupChart04'));
    option1= {
        tooltip : {trigger: 'item'},
        calculable : true,
        series : [
            {
                name:'组合配置详情（%）',
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
                    //{value:27.27, name:'期货策略'},
                    //{value:9.09, name:'债券策略'},
                    //{value:18.08, name:'股票策略'},
                    //{value:27.27, name:'量化对冲'},
                    //{value:18.18, name:'事件驱动'}
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
                data:[]
            }
        ]
    };


    option21 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['组合净值'],
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:50,x2:40,y:20,y2:60},
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
                scale: true,
                axisLabel : {
                    formatter: '{value}'
                }
            }
        ],
        series : [
            {
                name:'组合净值',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#F14745"
                    }
                },
                data:[]
            }
        ]
    };

    option3 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:[],
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:45,x2:25,y:20,y2:60},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                //axisLabel : {
                //    formatter: returnFloat('{value}')
                //},
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale: true,
                boundaryGap:[0.25,0.25],
                axisLabel: {
                    formatter: function (value, index) {
                        return value.toFixed(2);
                    }
                 }
                //axisLabel : {
                //    formatter: '{value}'
                //}
            }
        ],
        series : [
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: colorList[0]
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
                        color: colorList[1]
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
                        color: colorList[2]
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
                        color: colorList[3]
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
                        color: colorList[4]
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
                        color: colorList[5]
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
                        color: colorList[6]
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
                        color: colorList[7]
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
                        color: colorList[8]
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
                        color: colorList[9]
                    }
                },
                data:[]
            }
        ]
    };

    option31 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:[],
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:45,x2:25,y:20,y2:60},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                //axisLabel : {
                //    formatter: returnFloat('{value}')
                //},
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale: true,
                boundaryGap:[0.25,0.25],
                axisLabel: {
                    formatter: function (value, index) {
                        return value.toFixed(2);
                    }
                }
                //axisLabel : {
                //    formatter: '{value}'
                //}
            }
        ],
        series : [
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: colorList[0]
                    }
                },
                data:[]
            }
        ]
    };

    //var colorListMonthly =["#00B05E","#F14745","#00B05E","#F14745","#F14745","#F14745","#00B05E","#F14745","#00B05E","#F14745","#F14745","#F14745"];
    option4 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['组合月度收益'],
            show:false,
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:55,x2:30,y:30,y2:30},
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data : ['2016-05','2016-06','2016-07','2016-08','2016-09','2016-10','2016-11','2016-12','2017-01','2017-02','2017-03','2017-04']
            }
        ],
        yAxis : [
            {
                type : 'value',
                //boundaryGap:true,
                axisLabel : {
                    formatter: '{value} %'
                }
            }
        ],
        series : [
            {
                name:'组合月度收益',
                type:'bar',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            return colorListMonthly[params.dataIndex]
                        }
                    }
                },
                data:[-4.54, 4.03, -18.46, 2.03, 6.51,10.01,-6.39,1.20,-2.47,11.20,4.20,16.77]
            }
        ]
    };



    myChart1.setOption(option1);
    myChart2.setOption(option2);
    myChart3.setOption(option3);
    //myChart4.setOption(option4);


    //客户详情
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/Customer?customerID="+CustomerId,
        dataType:'json',
        success: function (data) {
            //console.log("客户详情");
            //console.log(data);
            $(".dataDisplayNo001").text(data.CustomerName);
            if( data.Gender == 1){
                $(".dataDisplayNo002").text("先生");
            }else if(  data.Gender == 2 ){
                $(".dataDisplayNo002").text("女士");
            }else{
                $(".dataDisplayNo002").text("先生");
            }
            $(".dataDisplayNo003").text(data.PhoneNumber);
            $(".dataDisplayNo004").text("备注："+data.Remarks);

            $(".pageTitle").html(data.CustomerName+" 组合资产详情");
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //40f79972e4bb5380f262f305dd0f1fd7
    //获取组合详情
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/Portfolio?portfolioID="+ItemId+"&customerID="+CustomerId,
        dataType:'json',
        success: function (data) {
            //console.log("组合详情");
            //console.log(data);
            if( data != undefined && data != null && data != ""){

                //$(".pageTitle").html(data.PortfolioName+" 组合资产详情");

                if( data.ProfitRate != undefined && data.ProfitRate != null  ){
                    $(".dataDisplayNm01").text(returnFloat(data.ProfitRate)+"%");
                }
                if( data.WithstandVolatility != undefined && data.WithstandVolatility != null  ) {
                    $(".dataDisplayNm02").text(returnFloat(data.WithstandVolatility)+"%");
                }

                if( data.Volatility != undefined && data.Volatility != null  ){
                    $(".dataDisplayNm03").text(returnFloat(data.Volatility)+"%");
                }


                var productsData =  [];
                if( data.Products != undefined && data.Products != null && data.Products != "" ){
                    for( var i = 0 ; i < data.Products.length ; i++){
                        //productIdList.push(data.Products[i].ProductID);

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
            }else{
                $(".customerProductRankingText002").text("（组合生成未满一月，暂无详细统计数据）");
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
                    profitLineData[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].dateTime * 1000).toISOString().substring(5,10) == monthlyAxis3[i]){
                            profitLineData02[i] = data[j].ProfitRate;
                            profitLineData[i] = data[j].FittingNetWorth;
                            break;
                        }
                    }
                }
            }
            for (var t = monthlyAxis3.length-1 ; t > 1; t--) {
                if (profitLineData02[t] == "-" ) {
                    profitLineData02[t] = profitLineData02[t + 1];
                }
                if (profitLineData[t] == "-" ) {
                    profitLineData[t] = profitLineData[t + 1];
                }
            }

            //if(data != null && data != "" ) {
            //    for (var i = 0; i < data.length; i++) {
            //        //newDate.setTime(data[i].Date * 1000);
            //        //profitChartDate02.push(newDate.toISOString().substring(5,10));
            //        profitLineData02.push(data[i].ProfitRate);
            //    }
            //}
            option2.xAxis[0].data = monthlyAxis3;
            option2.series[0].data = profitLineData02;
            option2.series[1].data = profitLineData12;
            myChart2.setOption(option2);



            option21.xAxis[0].data = monthlyAxis3;
            option21.series[0].data = profitLineData;
            myChart4.setOption(option21);

        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近六月
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioHistoryProfit?PortfolioID="+ItemId+"&accuracy=2&fromTime="+fromTimeOfHalfYearly+"&endtime="+endTime,
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


        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近一年
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioHistoryProfit?PortfolioID="+ItemId+"&accuracy=2&fromTime="+fromTimeOfOneYear+"&endtime="+endTime,
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
            option21.xAxis[0].data = monthlyAxis3;
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
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=2&fromTime="+fromTimeOfHalfYearly+"&endTime="+endTime,
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
            //console.log(data);
            //console.log(profitChartDate);
        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //近一年
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=2&fromTime="+fromTimeOfOneYear+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘半年数据");
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
            //console.log(data);
            //console.log(profitChartDate);
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
            //console.log("大盘半年数据");
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
                    if( j > 4){
                        break;
                    }
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


    //产品净值趋势
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/PortfolioNetTrend?portfolioID="+ItemId+"&fromTime="+fromTimeOfOneYear+"&endTime="+endTime+"&type=2",
        dataType:'json',
        success: function (data) {
            //console.log("产品净值趋势数据");
            //console.log(data);
            var newDate=new Date();
            for(var i = 0 ;i < data[0].ProductNetMonthly.length ; i++){
                newDate.setTime(data[0].ProductNetMonthly[i].Date * 1000);
                productDateList.push(newDate.toISOString().substring(0,10));
                //profitLineData04.push(data[i].ProfitRate);
            }

            //console.log(productDateList);
            var productNameList = [];
            for(var n = 0; n < data.length; n++){
                productNameList.push(data[n].ProductName);

                var NetDataList = [];
                for(var j = 0 ;j < data[n].ProductNetMonthly.length ; j++){
                    NetDataList.push(data[n].ProductNetMonthly[j].Net);
                    //profitLineData04.push(data[i].ProfitRate);
                }

                option3.series[n].name = data[n].ProductName;
                option3.series[n].data = NetDataList;

            }

            option3.legend.data = productNameList;
            option3.xAxis[0].data = productDateList;
            //option3.series = [{name:'', type:'line', smooth:true, itemStyle: {normal: {color: colorList[0]}}, data:[]}];
            //option3.series[1].data = profitLineData12;
            myChart3.setOption(option3);

        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    //报告期市场分析
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/Fluctuations?count=3&skip=0",
        dataType:'json',
        success: function (data) {
            //报告期市场分析
            //console.log(data);
            if(data != null && data != undefined && data != ""){
                var articleID = data[0].ArticleID
            }else{
                $(".groupMonthlyAnalysisReport").css("display","none");
                $(".groupMonthlyAnalysisReportDisplay").css("display","block");
            }
            $.ajax({
                type: "get",
                async:true,
                url: "https://api.palaspom.com/Investment/Fluctuation?fluctuationID="+articleID,
                dataType:'json',
                success: function (data) {
                    //报告期市场分析详情
                    //console.log(data);
                    if(data != null && data != undefined && data != ""){
                        var reportText = data.Text;
                        reportText = reportText.replace(/(<\/?a[^>]*>)(?!.*\1)/g,"");
                        reportText = reportText.replace(/<\/a>/g,"");
                        $(".groupMonthlyAnalysisReport").html(reportText);
                    }else{
                        $(".groupMonthlyAnalysisReport").css("display","none");
                        $(".groupMonthlyAnalysisReportDisplay").css("display","block");
                    }
                },
                error:function(e){
                    //alert("error:"+e);
                }
            });
        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    $(".productDetailsBtnBox>.productDetailsBtn").each(function(index){
        $(this).on("click",function(event){
            //event.stopPropagation();
            //event.preventDefault();
            $(".productDetailsBtnBox>.productDetailsBtn").removeClass("seleted");
            $(this).addClass("seleted");
            $(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            $(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");

            //$(this).css("color","#999999");
            //$(".explain").eq(index).css("color","#999999");
            //$(".explain").eq(index).css("borderColor","#999999");
        })
    });

    //document.getElementById('editBtn').addEventListener("click", editDisplay, false);


    $(".groupMonthlyBtnBox02>.groupMonthlyProportionBtn").each(function(index){
        $(this).on("click",function(event){
            //event.stopPropagation();
            //event.preventDefault();
            $(".groupMonthlyBtnBox02>.groupMonthlyProportionBtn").removeClass("selected");
            $(this).addClass("selected");
            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
            myChart1.setOption(option1);
        })
    });


    $(".groupMonthlyBtnBox03>.groupMonthlyProportionBtn").each(function(index){
        $(this).on("click",function(event){
            //event.stopPropagation();
            //event.preventDefault();
            $(".groupMonthlyBtnBox03>.groupMonthlyProportionBtn").removeClass("selected");
            $(this).addClass("selected");
            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");

        })
    });


    $(".ChartContentSwitchBtnBox>.ChartContentSwitchBtn1").each(function(index){
        $(this).on("click",function(event){
            //event.stopPropagation();
            //event.preventDefault();
            $(".ChartContentSwitchBtnBox>.ChartContentSwitchBtn1").removeClass("seleted");
            $(this).addClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
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
        })
    });


    $(".groupMonthlyBtnBox>.groupMonthlyTypeBtn").each(function(index){
        $(this).on("click",function(event){
            //event.stopPropagation();
            //event.preventDefault();
            $(".groupMonthlyBtnBox>.groupMonthlyTypeBtn").removeClass("selected");
            $(this).addClass("selected");
            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
            if( index == 0 ){
                //option3.legend.data = productNameList;
                //option3.xAxis[0].data = productDateList;
                //option3.series = [{name:'', type:'line', smooth:true, itemStyle: {normal: {color: colorList[0]}}, data:[]}];
                //option3.series[1].data = profitLineData12;
                myChart3.clear();
                myChart3.setOption(option3);
            }else{
                myChart3.clear();
                myChart3.setOption(option31);
            }
        })
    });


    $(".toAssetsDetails").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        //window.location.href = 'secondaryPage_ProductAssetsDetails.html';
        window.location.href = 'toolPage03_BestCombination.html';
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $(".chartStyle").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href = 'secondaryPage_ProductAssetsDetails.html?itemId='+ItemId;
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $(".newCusImfMoreReport").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href = 'secondaryPage07_MainAssetsDetails.html';
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

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
