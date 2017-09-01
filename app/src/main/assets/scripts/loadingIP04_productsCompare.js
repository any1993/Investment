/**
 * Created by Kris on 2017/2/27.
 */

//var ItemId = GetQueryString("itemId");
//var ItemId = "g01";
var option1;
//var option2;
var myChart1;
//var myChart2;
var fundIndex = 0;

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
var monthlyAxis6 = [];

//基金曲线
var profitLineData01 = [];
var profitLineData02 = [];
var profitLineData03 = [];

var fundListArray = [];

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

    var monthly6AxisTime = Date.parse(new Date())+ 28800000;
    for( var t6 = 0 ; t6 < 180 ;t6++){
        monthlyAxis6.unshift( new Date(monthly6AxisTime).toISOString().substring(5,10) );
        monthly6AxisTime -= 86400000;
    }

    myChart1 = echarts.init(document.getElementById('productsCompareCharts01'));
    option1 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['','',''],
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:45,x2:45,y:20,y2:50},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color: "#378EFF"
                        //areaStyle: {type: 'default',color: "#FDE7E7"}
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
                        color: "#B7170C"
                    }
                },
                data:[]
            },
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {normal: {
                    color: "#FFA929"
                }},
                data:[]
            }
        ]
    };

    fundListArray = JSON.parse(localStorage.fundList);

    //console.log(fundListArray);

    for( fundIndex = 0; fundIndex < fundListArray.length; fundIndex++){
        //var fundIndex = i;
        //var index = i-1;
        //详情信息
        $.ajax({
            type: "get",
            async:false,
            url: "https://api.palaspom.com/Investment/Product?productID="+fundListArray[fundIndex]+"&details=true",
            dataType:'json',
            success: function (data) {
                //console.log(data);
                $(".CompareDataDisplayAN101").eq(fundIndex).html(data.ProductName+"<br>"+data.ProductID);
                option1.series[fundIndex].name = data.ProductName;
                option1.legend.data[fundIndex]= data.ProductName;
                //data.ProductName+"<br>"+data.ProductID;

                //基金基本信息比较
                var styleArr = ["期货策略","量化对冲","股票策略","债券策略","事件驱动","其他策略"];
                $(".CompareDataDisplayAN102").eq(fundIndex).text(styleArr[parseInt(data.Style)-1]);//基金分类
                $(".CompareDataDisplayAN103").eq(fundIndex).text(returnNet(data.FundScale));//规模（亿）
                var newDate=new Date();
                newDate.setTime(data.EstablishDate * 1000);
                $(".CompareDataDisplayAN104").eq(fundIndex).text(newDate.toISOString().substring(0,10));
                $(".CompareDataDisplayAN105").eq(fundIndex).text(returnFloat(data.ProductDataIndex.AnnualizedProfit) + "%");//成立以来年化收益
                $(".CompareDataDisplayAN106").eq(fundIndex).text(returnFloat(data.ProductDataIndex.AverageMonthlyProfit) + "%");//成立以来月均收益

                //风险绩效评估（数据指标）
                $(".CompareDataDisplayAN401").eq(fundIndex).text(returnNet(data.ProductDataIndex.AnnualizedStandardDeviation));//年度收益标准差
                $(".CompareDataDisplayAN402").eq(fundIndex).text(returnNet(data.ProductDataIndex.MonthlyStandardDeviation));//月度收益标准差
                $(".CompareDataDisplayAN403").eq(fundIndex).text(returnFloat(data.ProductDataIndex.MaxRetracement));//最大回撤
                $(".CompareDataDisplayAN404").eq(fundIndex).text(returnFloat(data.ProductDataIndex.MaxMonthlyIncrease)+"%");//最大月度涨幅
                $(".CompareDataDisplayAN405").eq(fundIndex).text(returnFloat(data.ProductDataIndex.MinMonthlyIncrease)+"%");//最大月度跌幅
                $(".CompareDataDisplayAN406").eq(fundIndex).text(data.ProductDataIndex.PositiveMonths);//正收益月个数
                $(".CompareDataDisplayAN407").eq(fundIndex).text(data.ProductDataIndex.NagativeMonths);//负收益月个数
                $(".CompareDataDisplayAN408").eq(fundIndex).text(returnFloat(data.ProductDataIndex.PositiveMonths/(data.ProductDataIndex.PositiveMonths + data.ProductDataIndex.NagativeMonths ) * 100)+"%");//月收益胜率
                $(".CompareDataDisplayAN409").eq(fundIndex).text(returnNet(data.ProductDataIndex.SharpeRate));//Sharpe比率
                $(".CompareDataDisplayAN410").eq(fundIndex).text(returnNet(data.ProductDataIndex.CalmarRate));//Calmar比率

                //基金经理信息
                $.ajax({
                    type: "get",
                    async: false,
                    url: "https://api.palaspom.com/Investment/FundManager?managerID="+data.FundManagers[0]+"&managerName=",
                    dataType:'json',
                    success: function (data) {
                        //console.log("经理详情");
                        //console.log(data);
                        $(".CompareDataDisplayAN501").eq(fundIndex).text(data.ManagerName);
                        $(".CompareDataDisplayAN502").eq(fundIndex).text("——");//经理年龄
                        $(".CompareDataDisplayAN503").eq(fundIndex).text("——");//任职时间
                        $(".CompareDataDisplayAN504").eq(fundIndex).text("——");//任职回报
                        $(".CompareDataDisplayAN505").eq(fundIndex).text(data.ProductInfo.length+"只");
                        $(".CompareDataDisplayAN506").eq(fundIndex).text(returnFloat(data.WorkingYears)+"年");
                        $(".CompareDataDisplayAN507").eq(fundIndex).text(returnFloat(data.AnnualizedProfitRate));
                    },
                    error:function(e){
                        //alert("error:"+e);
                    }
                });

                //基金公司信息
                $(".CompareDataDisplayAN601").eq(fundIndex).text(data.Company);
                $(".CompareDataDisplayAN602").eq(fundIndex).text("——");//投资经理平均年限
                $(".CompareDataDisplayAN603").eq(fundIndex).text("——");//团队稳定性
                $(".CompareDataDisplayAN604").eq(fundIndex).text("——");//高星基金占比

                //净值曲线比较
                $.ajax({
                    type: "get",
                    async:false,
                    url: "https://api.palaspom.com/Investment/ProductNetworth?productID="+fundListArray[fundIndex]+"&fromTime="+fromTimeOfMonthly+"&endTime="+endTime+"&count=30",
                    dataType:'json',
                    success: function (data) {
                        //console.log("产品净值曲线");
                        //console.log(data);
                        //第一个基金
                        if( fundIndex == 0){
                            if (data != null && data != "" && data != undefined) {
                                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                                    profitLineData01[i]="-";
                                    for( var j = 0;j < data.length; j++ ){
                                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                                            profitLineData01[i] = returnNet(data[j].UnitNet);
                                            break;
                                        }
                                    }
                                }
                            }
                            for (var t = monthlyAxis6.length-1 ; t > 1; t--) {
                                if (profitLineData01[t] == "-" ) {
                                    profitLineData01[t] = profitLineData01[t + 1];
                                }
                            }
                        }else if( fundIndex == 1){//第二个基金
                            if (data != null && data != "" && data != undefined) {
                                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                                    profitLineData02[i]="-";
                                    for( var j = 0;j < data.length; j++ ){
                                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                                            profitLineData02[i] = returnNet(data[j].UnitNet);
                                            break;
                                        }
                                    }
                                }
                            }
                            for (var t = monthlyAxis6.length-1 ; t > 1; t--) {
                                if (profitLineData02[t] == "-" ) {
                                    profitLineData02[t] = profitLineData02[t + 1];
                                }
                            }
                        }else if( fundIndex == 2){//第三个基金
                            if (data != null && data != "" && data != undefined) {
                                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                                    profitLineData03[i]="-";
                                    for( var j = 0;j < data.length; j++ ){
                                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                                            profitLineData03[i] = returnNet(data[j].UnitNet);
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
                        }
                        //var index = i-1;
                        //var newDate=new Date();
                        //for(var i = 0 ;i < data.length ; i++){
                        //    //newDate.setTime(data[i].Date * 1000);
                        //    //profitChartDate02.push(newDate.toISOString().substring(5,10));
                        //    profitLineData02.push(data[i].ProfitRate);
                        //}
                        //

                        option1.xAxis[0].data = monthlyAxis6;
                        option1.series[0].data = profitLineData01;
                        option1.series[1].data = profitLineData02;
                        option1.series[2].data = profitLineData03;
                        myChart1.setOption(option1);
                    },
                    error:function(e){
                        //alert("error:"+e);
                    }
                });

                //年度回报率比较
                $.ajax({
                    type: "get",
                    async:false,
                    url: "https://api.palaspom.com/Investment/ProductProfitCurve?productID="+fundListArray[fundIndex]+"&fromTime="+fromTimeOfYearly+"&endTime="+endTime+"&type=3",
                    dataType:'json',
                    success: function (data) {
                        //console.log("年度回报率");
                        //console.log(data);
                        var newDate=new Date();
                        //今年

                        if( data.length >= 1 ){
                            if( data[data.length-1].ProfitRate != null && data[data.length-1].ProfitRate != undefined ){
                                $(".CompareDataDisplayAN201").eq(fundIndex).text(returnFloat(data[data.length-1].ProfitRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN201").eq(fundIndex).text("——");
                            }
                            if( data[data.length-1].Ranking != null && data[data.length-1].Ranking != undefined ){
                                $(".CompareDataDisplayAN202").eq(fundIndex).text(data[data.length-1].Ranking.replace(",","/"));
                            }else{
                                $(".CompareDataDisplayAN202").eq(fundIndex).text("—/—");
                            }
                        }

                        //去年
                        if( data.length >= 2 ){
                            newDate.setTime(data[data.length-2].Date * 1000);
                            $(".CompareDataDisplayYear02").text(newDate.toISOString().substring(0,4) +"年");
                            if( data[data.length-2].ProfitRate != null && data[data.length-2].ProfitRate != undefined ){
                                $(".CompareDataDisplayAN203").eq(fundIndex).text(returnFloat(data[data.length-2].ProfitRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN203").eq(fundIndex).text("——");
                            }
                            if( data[data.length-2].Ranking != null && data[data.length-2].Ranking != undefined ){
                                $(".CompareDataDisplayAN204").eq(fundIndex).text(data[data.length-2].Ranking.replace(",","/"));
                            }else{
                                $(".CompareDataDisplayAN204").eq(fundIndex).text("—/—");
                            }
                        }

                        //前年
                        if( data.length >= 3 ){
                            newDate.setTime(data[data.length-3].Date * 1000);
                            $(".CompareDataDisplayYear03").text(newDate.toISOString().substring(0,4) +"年");
                            if( data[data.length-3].ProfitRate != null && data[data.length-3].ProfitRate != undefined ){
                                $(".CompareDataDisplayAN205").eq(fundIndex).text(returnFloat(data[data.length-3].ProfitRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN205").eq(fundIndex).text("——");
                            }
                            if( data[data.length-3].Ranking != null && data[data.length-3].Ranking != undefined ){
                                $(".CompareDataDisplayAN206").eq(fundIndex).text(data[data.length-3].Ranking.replace(",","/"));
                            }else{
                                $(".CompareDataDisplayAN206").eq(fundIndex).text("—/—");
                            }
                        }

                        //大前年
                        if( data.length >= 4 ){
                            newDate.setTime(data[data.length-4].Date * 1000);
                            $(".CompareDataDisplayYear04").text(newDate.toISOString().substring(0,4) +"年");
                            if( data[data.length-4].ProfitRate != null && data[data.length-4].ProfitRate != undefined ){
                                $(".CompareDataDisplayAN207").eq(fundIndex).text(returnFloat(data[data.length-4].ProfitRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN207").eq(fundIndex).text("——");
                            }
                            if( data[data.length-4].Ranking != null && data[data.length-4].Ranking != undefined ){
                                $(".CompareDataDisplayAN208").eq(fundIndex).text(data[data.length-4].Ranking.replace(",","/"));
                            }else{
                                $(".CompareDataDisplayAN208").eq(fundIndex).text("—/—");
                            }
                        }

                    },
                    error:function(e){
                        //alert("error:"+e);
                    }
                });


                //阶段性回报率比较
                $.ajax({
                    type: "get",
                    async:false,
                    url: "https://api.palaspom.com/Investment/ProductPhasicProfitRate?productID="+fundListArray[fundIndex]+"&fromTime="+fromTimeOfMonthly+"&endTime="+endTime,
                    dataType:'json',
                    success: function (data) {
                        //console.log("阶段性回报");
                        //console.log(data);
                        if( data != null && data != undefined ){

                            if( data.MonthlyRate != null && data.MonthlyRate ){
                                $(".CompareDataDisplayAN301").eq(fundIndex).text(returnFloat(data.MonthlyRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN301").eq(fundIndex).text("——");
                            }

                            if( data.MonthlyRank != null && data.MonthlyRank != undefined ){
                                if( data.MonthlyRank.Item1 == null ){
                                    $(".CompareDataDisplayAN302").eq(fundIndex).text("0/"+ data.MonthlyRank.Item2);
                                }else{
                                    $(".CompareDataDisplayAN302").eq(fundIndex).text(data.MonthlyRank.Item1 +"/"+ data.MonthlyRank.Item2);
                                }
                            }else{
                                $(".CompareDataDisplayAN302").eq(fundIndex).text("—/—");
                            }

                            if( data.ThreeMonthsRate != null && data.ThreeMonthsRate ){
                                $(".CompareDataDisplayAN303").eq(fundIndex).text(returnFloat(data.ThreeMonthsRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN303").eq(fundIndex).text("——");
                            }

                            if( data.ThreeMonthsRank != null && data.ThreeMonthsRank != undefined ){
                                if( data.ThreeMonthsRank.Item1 == null ){
                                    $(".CompareDataDisplayAN304").eq(fundIndex).text("0/"+ data.ThreeMonthsRank.Item2);
                                }else{
                                    $(".CompareDataDisplayAN304").eq(fundIndex).text(data.ThreeMonthsRank.Item1 +"/"+ data.ThreeMonthsRank.Item2);
                                }
                            }else{
                                $(".CompareDataDisplayAN304").eq(fundIndex).text("—/—");
                            }

                            if( data.HalfYearRate != null && data.HalfYearRate ){
                                $(".CompareDataDisplayAN305").eq(fundIndex).text(returnFloat(data.HalfYearRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN305").eq(fundIndex).text("——");
                            }

                            if( data.HalfYearRank != null && data.HalfYearRank != undefined ){
                                if( data.HalfYearRank.Item1 == null ){
                                    $(".CompareDataDisplayAN306").eq(fundIndex).text("0/"+ data.HalfYearRank.Item2);
                                }else{
                                    $(".CompareDataDisplayAN306").eq(fundIndex).text(data.HalfYearRank.Item1 +"/"+ data.HalfYearRank.Item2);
                                }
                            }else{
                                $(".CompareDataDisplayAN306").eq(fundIndex).text("—/—");
                            }

                            if( data.YearlyRate != null && data.YearlyRate ){
                                $(".CompareDataDisplayAN307").eq(fundIndex).text(returnFloat(data.YearlyRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN307").eq(fundIndex).text("——");
                            }

                            if( data.YearlyRank != null && data.YearlyRank != undefined ){
                                if( data.YearlyRank.Item1 == null ){
                                    $(".CompareDataDisplayAN308").eq(fundIndex).text("0/"+ data.YearlyRank.Item2);
                                }else{
                                    $(".CompareDataDisplayAN308").eq(fundIndex).text(data.YearlyRank.Item1 +"/"+ data.YearlyRank.Item2);
                                }
                            }else{
                                $(".CompareDataDisplayAN308").eq(fundIndex).text("—/—");
                            }

                            if( data.ThreeYearsRate != null && data.ThreeYearsRate ){
                                $(".CompareDataDisplayAN309").eq(fundIndex).text(returnFloat(data.ThreeYearsRate) + "%");
                            }else{
                                $(".CompareDataDisplayAN309").eq(fundIndex).text("——");
                            }

                            if( data.ThreeYearsRank != null && data.ThreeYearsRank != undefined ){
                                if( data.ThreeYearsRank.Item1 == null ){
                                    $(".CompareDataDisplayAN310").eq(fundIndex).text("0/"+ data.ThreeYearsRank.Item2);
                                }else{
                                    $(".CompareDataDisplayAN310").eq(fundIndex).text(data.ThreeYearsRank.Item1 +"/"+ data.ThreeYearsRank.Item2);
                                }
                            }else{
                                $(".CompareDataDisplayAN310").eq(fundIndex).text("—/—");
                            }

                        }else{
                            //$(".DataDisplayBlockNo4").css("display","none");
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
    }

    myChart1.setOption(option1);

    $(".fundDetailsProfitChartBox>.fundDetailsProfitChartBrn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".fundDetailsProfitChartBox>.fundDetailsProfitChartBrn").removeClass("selected");
            $(this).addClass("selected");
        })
    });

}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.history.back();
    //window.location.href = 'index.html';
    //parent.location='index.html';
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}