/**
 * Created by Kris on 2017/2/27.
 */
var UserID = "br_1091827413";
var ItemId = GetQueryString("itemId");
//var ItemId = "54480";
//var ItemId = "31090";
//var ItemId = "8477";
//var ItemId = "57474";
//var ItemId = "96605";
var CompanyID = "";
var option1;
//var option2;
var myChart1;
//var myChart2;

var StockSetTime = new Date();
StockSetTime = StockSetTime.toString();
StockSetTime = StockSetTime.substring(0,16)+"09:00:00"+StockSetTime.substring(24,42);

var fromTimeOfStockByDay =  Date.parse(StockSetTime)/1000;
var fromTimeOfYearly = Date.parse(StockSetTime)/1000-31536000*10;   //成立以来
//var fromTimeOfYearly =      0;                                       //成立以来
var fromTimeOfHalfYearly =  Date.parse(StockSetTime)/1000-15552000;  //半年
var fromTimeOf3Monthly =    Date.parse(StockSetTime)/1000-7776000;   //3个月
var fromTimeOfMonthly =     Date.parse(StockSetTime)/1000-2592000;   //一个月
var endTime = (Date.parse(new Date())/1000);


//定义表格时间轴
var monthlyAxis = [];
var monthlyAxis3 = [];
var monthlyAxis6 = [];
var wholeAxis = [];

//产品数据
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

var managerID = [];
var managerStr = "";

var UserFundList = [];
var FundAttr;

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);
    document.getElementById('UserFundsAddBtn').addEventListener("click", touchAddFund, false);

    var monthlyAxisTime = Date.parse(new Date())+ 28800000;
    var monthly3AxisTime = Date.parse(new Date())+ 28800000;
    var monthly6AxisTime = Date.parse(new Date())+ 28800000;
    for( var t = 0 ; t < 30 ;t++){
        monthlyAxis.unshift( new Date(monthlyAxisTime).toISOString().substring(5,10) );
        monthlyAxisTime -= 86400000;
    }
    for( var t3 = 0 ; t3 < 90 ;t3++){
        monthlyAxis3.unshift( new Date(monthly3AxisTime).toISOString().substring(5,10) );
        monthly3AxisTime -= 86400000;
    }
    for( var t6 = 0 ; t6 < 180 ;t6++){
        monthlyAxis6.unshift( new Date(monthly6AxisTime).toISOString().substring(5,10) );
        monthly6AxisTime -= 86400000;
    }
    //console.log(monthlyAxis);
    //console.log(monthlyAxis3);
    //console.log(monthlyAxis6);

    myChart1 = echarts.init(document.getElementById('fundDetailChart'));
    option1 = {
        tooltip: {
            trigger: 'axis'
            //formatter: "{a0} : {c0}% <br>{a1} : {c1}% "
            //formatter: '{a}:{c}%'
        },
        legend: {
            data:['','沪深300'],
            y:'bottom',icon:'bar',itemGap:20, itemHeight:8, itemWidth:12
        },
        calculable : true,
        animationDuration:100,
        animationDurationUpdate:50,
        grid:{x:45,x2:40,y:25,y2:60},
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                //formatter: "{a0} : {c0}% <br/>{a1} : {c1}%",
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    show:true,
                    formatter: '{value} %'
                }
            }
        ],
        series : [
            {
                name:'',
                type:'line',
                smooth:true,
                itemStyle: {
                    formatter: '{value} %',
                    normal: {
                        color: "#CE1F17",
                        areaStyle: {type: 'default',color: "#FDE7E7"}
                    }
                },
                data:[]
            },
            //{
            //    name:'同类表现',
            //    type:'line',
            //    smooth:true,
            //    itemStyle: {
            //        normal: {
            //            color: "#D2836F"
            //        }
            //    },
            //
            //    data:[0.7, 1.3, 1.5, 3.5]
            //},
            {
                name:'沪深300',
                type:'line',
                smooth:true,
                itemStyle: {
                    formatter: '{value} %',
                    normal: {
                        color: "#4691EE"
                }},
               //formatter: function (value) {
               //         return value + '%'
               //},
                data:[]
            }
        ]
    };

    $.ajax({
        type: "get",
        async:true,
        //url: "https://api.palaspom.com/Investment/Product?productID="+ItemId+"&details=true",
        url: "https://api.palaspom.com/Investment/Product?productID="+ItemId+"&details=true",
        //url: "http://192.168.2.22:88/Investment/Product?productID="+ItemId+"&details=true",
        dataType:'json',
        success: function (data) {
            //console.log("基金详情");
            //console.log(data);
            $(".pageTitleFundName").html(data.ProductName+"<br>"+data.ProductID);
            $("title").text(data.ProductName+" - "+data.ProductID);
            $(".DataDisplayNo01").text(returnFloat(data.DailyIncrease) + "%");
            option1.legend.data[0] = data.ProductName;
            option1.series[0].name = data.ProductName;
            managerID = data.FundManagers;
            myChart1.setOption(option1);
            var monthlyAllAxisTime = data.EstablishDate * 1000;
            for( var w = 0 ; w < 600 ;w++){
                wholeAxis.push( new Date(monthlyAllAxisTime).toISOString().substring(0,7) );
                monthlyAllAxisTime += 2678400000;
                if( monthlyAllAxisTime >= Date.parse(new Date())+ 28800000 ){
                    break;
                }
            }
            //console.log(wholeAxis);

            $.ajax({
                type: "get",
                async: false,
                url: "https://api.palaspom.com/Investment/FundManager?managerID="+managerID[0]+"&managerName=",
                dataType:'json',
                success: function (data) {
                    //console.log("经理详情");
                    //console.log(data);
                    var newDate=new Date();
                    $(".DataDisplayNo700").text(data.ManagerName);
                    $(".DataDisplayNo701").text(data.ManagerName+"("+data.Education+")");
                    newDate.toISOString().substring(0,5);
                    $(".DataDisplayNo702").text( parseInt(newDate.toISOString().substring(0,5))-parseInt(data.WorkingYears) +"至今");
                    if( data.AnnualizedProfitRate != undefined && data.AnnualizedProfitRate != null && data.AnnualizedProfitRate != ""){
                        $(".DataDisplayNo703").text(returnFloat(data.AnnualizedProfitRate)+"%");
                    }
                    if( data.ContemporaneousMarket != undefined && data.ContemporaneousMarket != null && data.ContemporaneousMarket != ""){
                        $(".DataDisplayNo704").text(returnFloat(data.ContemporaneousMarket)+"%");
                    }
                    if( data.Score != undefined && data.Score != null && data.Score != ""){
                        $(".DataDisplayNo705").text(returnFloat(data.Score)+"%");
                    }
                    if( data.Introduction != undefined && data.Introduction != null && data.Introduction != ""){
                        $(".DataDisplayNo706").text(data.Introduction);
                    }
                },
                error:function(e){
                    //alert("error:"+e);
                }
            });

            $.ajax({
                type: "get",
                async:true,
                url: "https://api.palaspom.com/Investment/ProductProfitCurve?productID="+ItemId+"&fromTime="+fromTimeOfYearly+"&endTime="+endTime+"&type=2",
                dataType:'json',
                success: function (data) {
                    //console.log("产品历史数据");
                    if (data != null && data != "" && data != undefined) {

                        for(var i = 0 ;i < wholeAxis.length ; i++){
                            profitLineData05[i]="-";
                            for( var j = 0;j < data.length; j++ ){
                                if( new Date(data[j].Date * 1000).toISOString().substring(0,7) == wholeAxis[i]){
                                    profitLineData05[i] = data[j].ProfitRate;
                                    break;
                                }
                            }
                        }
                        for (var t = wholeAxis.length-1 ; t > 1; t--) {
                            if (profitLineData05[t] == "-" ) {
                                profitLineData05[t] = profitLineData05[t + 1];
                            }
                        }
                    }

                },
                error:function(e){
                    //alert("error:"+e);
                }
            });

            $.ajax({
                type: "get",
                async:true,
                url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=2&fromTime="+fromTimeOfYearly+"&endTime="+endTime,
                dataType:'json',
                success: function (data) {
                    //console.log("大盘历史数据");
                    if (data != null && data != "" && data != undefined) {

                        for(var i = 0 ;i < wholeAxis.length ; i++){
                            profitLineData15[i]="-";
                            for( var j = 0;j < data.length; j++ ){
                                if( new Date(data[j].Date * 1000).toISOString().substring(0,7) == wholeAxis[i]){
                                    profitLineData15[i] = data[j].ProfitRate;
                                    break;
                                }
                            }
                        }
                        for (var t = wholeAxis.length-1 ; t > 1; t--) {
                            if (profitLineData15[t] == "-" ) {
                                profitLineData15[t] = profitLineData15[t + 1];
                            }
                        }
                    }
                    //console.log(data);

                },
                error:function(e){
                    //alert("error:"+e);
                }
            });


            if( data.CompanyID != undefined && data.CompanyID != null ){
                CompanyID = data.CompanyID;
            }else{
                $("#fundCompany").css("opacity","0.5");
            }
            if( data.UnitNet != null && data.UnitNet != undefined ){
                $(".DataDisplayNo02").text(returnNet(data.UnitNet));
            }else{
                $(".DataDisplayNo02").text(returnNet(1));
            }

            if( data.AccumulatedNet != null && data.AccumulatedNet != undefined ){
                $(".DataDisplayNo03").text(returnNet(data.AccumulatedNet));
            }else{
                $(".DataDisplayNo03").text(returnNet(1));
            }

            var newDate=new Date();
            newDate.setTime(data.EstablishDate * 1000);
            $(".DataDisplayNo04").text(newDate.toISOString().substring(0,10));

            if( data.FundScale != null && data.FundScale != undefined ){
                $(".DataDisplayNo05").text(Math.round(data.FundScale*100)/100+"亿");
            }else{
                $(".DataDisplayNo05").text("——");
            }

            if( data.ProductDataIndex.AnnualizedProfit != null && data.ProductDataIndex.AnnualizedProfit != undefined ){
                $(".DataDisplayNo06").text(returnFloat(data.ProductDataIndex.AnnualizedProfit * 100)+"%");
            }else{
                $(".DataDisplayNo06").text("——");
            }

            if( data.ProductDataIndex.CumulativeProfit != null && data.ProductDataIndex.CumulativeProfit != undefined ){
                $(".DataDisplayNo07").text(returnFloat(data.ProductDataIndex.CumulativeProfit * 100)+"%");
            }else{
                $(".DataDisplayNo07").text("——");
            }

            var newDate02=new Date();
            newDate02.setTime(data.UpdateTime * 1000);
            $(".DataDisplayNo08").text(newDate02.toISOString().substring(0,10));

            if( data.ProductDataIndex.AnnualizedStandardDeviation != null && data.ProductDataIndex.AnnualizedStandardDeviation != undefined ){
                $(".DataDisplayNo10").text(returnNet(data.ProductDataIndex.AnnualizedStandardDeviation));
            }else{
                $(".DataDisplayNo10").text("——");
            }

            if( data.ProductDataIndex.PositiveMonths != null && data.ProductDataIndex.PositiveMonths != undefined ){
                $(".DataDisplayNo11").text(data.ProductDataIndex.PositiveMonths);
            }else{
                //console.log(data.ProductDataIndex.PositiveMonths);
                $(".DataDisplayNo11").text("——");
            }

            if( data.ProductDataIndex.MonthlyStandardDeviation != null && data.ProductDataIndex.MonthlyStandardDeviation != undefined ){
                $(".DataDisplayNo12").text(returnNet(data.ProductDataIndex.MonthlyStandardDeviation));
            }else{
                $(".DataDisplayNo12").text("——");
            }

            if( data.ProductDataIndex.NagativeMonths != null && data.ProductDataIndex.NagativeMonths != undefined ){
                $(".DataDisplayNo13").text(data.ProductDataIndex.NagativeMonths);
            }else{
                $(".DataDisplayNo13").text("——");
            }

            if( data.ProductDataIndex.MaxRetracement != null && data.ProductDataIndex.MaxRetracement != undefined ){
                $(".DataDisplayNo14").text(returnFloat(data.ProductDataIndex.MaxRetracement));
            }else{
                $(".DataDisplayNo14").text("——");
            }

            if( data.ProductDataIndex.MonthlyWinrate != null && data.ProductDataIndex.MonthlyWinrate != undefined ){
                $(".DataDisplayNo15").text(returnFloat(data.ProductDataIndex.MonthlyWinrate)+"%");
            }else{
                $(".DataDisplayNo15").text("——");
            }

            if( data.ProductDataIndex.MaxMonthlyIncrease != null && data.ProductDataIndex.MaxMonthlyIncrease != undefined ){
                $(".DataDisplayNo16").text(returnFloat(data.ProductDataIndex.MaxMonthlyIncrease)+"%");
            }else{
                $(".DataDisplayNo16").text("——");
            }

            if( data.ProductDataIndex.SharpeRate != null && data.ProductDataIndex.SharpeRate != undefined ){
                $(".DataDisplayNo17").text(returnNet(data.ProductDataIndex.SharpeRate));
            }else{
                $(".DataDisplayNo17").text("——");
            }

            if( data.ProductDataIndex.MinMonthlyIncrease != null && data.ProductDataIndex.MinMonthlyIncrease != undefined ){
                $(".DataDisplayNo18").text(returnFloat(data.ProductDataIndex.MinMonthlyIncrease)+"%");
            }else{
                $(".DataDisplayNo18").text("——");
            }

            if( data.ProductDataIndex.CalmarRate != null && data.ProductDataIndex.CalmarRate != undefined ){
                $(".DataDisplayNo19").text(returnNet(data.ProductDataIndex.CalmarRate));
            }else{
                $(".DataDisplayNo19").text("——");
            }
        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    //GET Investment/ProductProfitCurve?productID={productID}&fromTime={fromTime}&endTime={endTime}&type={type}
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductProfitCurve?productID="+ItemId+"&fromTime="+fromTimeOfMonthly+"&endTime="+endTime+"&type=1",
        dataType:'json',
        success: function (data) {
            //console.log("产品月度数据");
            if (data != null && data != "" && data != undefined) {
                for(var i = 0 ;i < monthlyAxis.length ; i++){
                    profitLineData02[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis[i]){
                            profitLineData02[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
                for (var t = monthlyAxis.length-1 ; t > 1; t--) {
                    if (profitLineData02[t] == "-" ) {
                        profitLineData02[t] = profitLineData02[t + 1];
                    }
                }
            }
            option1.xAxis[0].data = monthlyAxis;
            option1.series[0].data = profitLineData02;
            option1.series[1].data = profitLineData12;
            myChart1.setOption(option1);
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=1&fromTime="+fromTimeOfMonthly+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘月度数据");
            if (data != null && data != "" && data != undefined) {

                for(var i = 0 ;i < monthlyAxis.length ; i++){
                    profitLineData12[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis[i]){
                            profitLineData12[i] = data[j].ProfitRate;
                            //console.log(new Date(data[j].Date * 1000).toISOString().substring(5,10));
                            break;
                        }
                    }
                }
                for (var t = monthlyAxis.length-1 ; t > 1; t--) {
                    if (profitLineData12[t] == "-" ) {
                        profitLineData12[t] = profitLineData12[t + 1];
                    }
                }
            }
            //console.log(data);
            option1.xAxis[0].data = monthlyAxis;
            option1.series[0].data = profitLineData02;
            option1.series[1].data = profitLineData12;
            myChart1.setOption(option1);

        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductProfitCurve?productID="+ItemId+"&fromTime="+fromTimeOf3Monthly+"&endTime="+endTime+"&type=1",
        dataType:'json',
        success: function (data) {
            //console.log("产品三月数据");
            if (data != null && data != "" && data != undefined) {

                for(var i = 0 ;i < monthlyAxis3.length ; i++){
                    profitLineData03[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis3[i]){
                            profitLineData03[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
                for (var t = monthlyAxis3.length-1 ; t > 1; t--) {
                    if (profitLineData03[t] == "-" ) {
                        profitLineData03[t] = profitLineData03[t + 1];
                    }
                }
            }

        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=1&fromTime="+fromTimeOf3Monthly+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘近三月数据");
            if (data != null && data != "" && data != undefined) {

                for(var i = 0 ;i < monthlyAxis3.length ; i++){
                    profitLineData13[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis3[i]){
                            profitLineData13[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
                for (var t = monthlyAxis3.length-1 ; t > 1; t--) {
                    if (profitLineData13[t] == "-" ) {
                        profitLineData13[t] = profitLineData13[t + 1];
                    }
                }
            }
            //console.log(data);
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductProfitCurve?productID="+ItemId+"&fromTime="+fromTimeOfHalfYearly+"&endTime="+endTime+"&type=1",
        dataType:'json',
        success: function (data) {
            //console.log("产品半年数据");
            //var newDate=new Date();
            if (data != null && data != "" && data != undefined) {

                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                    profitLineData04[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                            profitLineData04[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
                for (var t = monthlyAxis6.length-1 ; t > 1; t--) {
                    if (profitLineData04[t] == "-" ) {
                        profitLineData04[t] = profitLineData04[t + 1];
                    }
                }
            }

        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/BlockMonthly?blockID=sh000300&Accuracy=1&fromTime="+fromTimeOfHalfYearly+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("大盘半年数据");
            if (data != null && data != "" && data != undefined) {

                for(var i = 0 ;i < monthlyAxis6.length ; i++){
                    profitLineData14[i]="-";
                    for( var j = 0;j < data.length; j++ ){
                        if( new Date(data[j].Date * 1000).toISOString().substring(5,10) == monthlyAxis6[i]){
                            profitLineData14[i] = data[j].ProfitRate;
                            break;
                        }
                    }
                }
                for (var t = monthlyAxis6.length-1 ; t > 1; t--) {
                    if (profitLineData14[t] == "-" ) {
                        profitLineData14[t] = profitLineData14[t + 1];
                    }
                }
            }
            //console.log(data);
        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    //var managerName = encodeURI(encodeURI("张延鹏"));

    //年度回报
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductProfitCurve?productID="+ItemId+"&fromTime="+fromTimeOfYearly+"&endTime="+endTime+"&type=3",
        dataType:'json',
        success: function (data) {
            //console.log(data);

            for(var i = 1 ;i < data.length+1 ; i++){
                if( data[data.length-i].ProfitRate != null && data[data.length-i].ProfitRate != undefined ){
                    $(".DataDisplayNo311").eq(i-1).text(returnFloat(data[data.length-i].ProfitRate) + "%");
                }else{
                    $(".DataDisplayNo311").eq(i-1).text("——");
                }

                if( data[data.length-i].Ranking != null && data[data.length-i].Ranking != undefined ){
                    $(".DataDisplayNo312").eq(i-1).text(data[data.length-i].Ranking.replace(",","/"));
                }else{
                    $(".DataDisplayNo312").eq(i-1).text("——");
                }
            }
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //阶段性回报
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductPhasicProfitRate?productID="+ItemId+"&fromTime="+fromTimeOfMonthly+"&endTime="+endTime,
        dataType:'json',
        success: function (data) {
            //console.log("阶段性回报");
            //console.log(data);
            if( data != null && data != undefined ){
                if( data.MonthlyRate != null && data.MonthlyRate ){
                    $(".DataDisplayNo411").text(returnFloat(data.MonthlyRate) + "%");
                }else{
                    $(".DataDisplayNo411").text("——");
                }

                if( data.MonthlyRank != null && data.MonthlyRank != undefined ){
                    if( data.MonthlyRank.Item1 == null ){
                        $(".DataDisplayNo412").text("0/"+ data.MonthlyRank.Item2);
                    }else{
                        $(".DataDisplayNo412").text(data.MonthlyRank.Item1 +"/"+ data.MonthlyRank.Item2);
                    }
                }else{
                    $(".DataDisplayNo412").text("—/—");
                }


                if( data.ThreeMonthsRate != null && data.ThreeMonthsRate ){
                    $(".DataDisplayNo421").text(returnFloat(data.ThreeMonthsRate) + "%");
                }else{
                    $(".DataDisplayNo421").text("——");
                }

                if( data.ThreeMonthsRank != null && data.ThreeMonthsRank != undefined ){
                    if( data.ThreeMonthsRank.Item1 == null ){
                        $(".DataDisplayNo422").text("0/"+ data.ThreeMonthsRank.Item2);
                    }else{
                        $(".DataDisplayNo422").text(data.ThreeMonthsRank.Item1 +"/"+ data.ThreeMonthsRank.Item2);
                    }
                }else{
                    $(".DataDisplayNo422").text("—/—");
                }

                if( data.HalfYearRate != null && data.HalfYearRate ){
                    $(".DataDisplayNo431").text(returnFloat(data.HalfYearRate) + "%");
                }else{
                    $(".DataDisplayNo431").text("——");
                }

                if( data.HalfYearRank != null && data.HalfYearRank != undefined ){
                    if( data.HalfYearRank.Item1 == null ){
                        $(".DataDisplayNo432").text("0/"+ data.HalfYearRank.Item2);
                    }else{
                        $(".DataDisplayNo432").text(data.HalfYearRank.Item1 +"/"+ data.HalfYearRank.Item2);
                    }
                }else{
                    $(".DataDisplayNo432").text("—/—");
                }


                if( data.YearlyRate != null && data.YearlyRate ){
                    $(".DataDisplayNo441").text(returnFloat(data.YearlyRate) + "%");
                }else{
                    $(".DataDisplayNo441").text("——");
                }

                if( data.YearlyRank != null && data.YearlyRank != undefined ){
                    if( data.YearlyRank.Item1 == null ){
                        $(".DataDisplayNo442").text("0/"+ data.YearlyRank.Item2);
                    }else{
                        $(".DataDisplayNo442").text(data.YearlyRank.Item1 +"/"+ data.YearlyRank.Item2);
                    }
                }else{
                    $(".DataDisplayNo442").text("—/—");
                }


                if( data.ThreeYearsRate != null && data.ThreeYearsRate ){
                    $(".DataDisplayNo451").text(returnFloat(data.ThreeYearsRate) + "%");
                }else{
                    $(".DataDisplayNo451").text("——");
                }

                if( data.ThreeYearsRank != null && data.ThreeYearsRank != undefined ){
                    if( data.ThreeYearsRank.Item1 == null ){
                        $(".DataDisplayNo452").text("0/"+ data.ThreeYearsRank.Item2);
                    }else{
                        $(".DataDisplayNo452").text(data.ThreeYearsRank.Item1 +"/"+ data.ThreeYearsRank.Item2);
                    }
                }else{
                    $(".DataDisplayNo452").text("—/—");
                }


            }else{
                //$(".DataDisplayBlockNo4").css("display","none");

            }


        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //净值
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductNetworth?productID="+ItemId+"&fromTime="+fromTimeOfMonthly+"&endTime="+endTime+"&count=3",
        dataType:'json',
        success: function (data) {
            //console.log("净值");
            //console.log(data);
            if( data != null && data != "" && data != undefined){
                for(var i = 1 ;i < data.length+1 ; i++){
                    if(i >3 ){
                        break;
                    }

                    if( data[data.length-i].Date != null && data[data.length-i].Date != undefined ){
                        var newDate=new Date();
                        newDate.setTime(data[data.length-i].Date *1000);
                        $(".DataDisplayNo511").eq(i-1).text(newDate.toISOString().substring(0,10));
                    }else{
                        $(".DataDisplayNo511").eq(i-1).text("——");
                    }


                    if( data[data.length-i].UnitNet != null && data[data.length-i].UnitNet != undefined ){
                        $(".DataDisplayNo512").eq(i-1).text( returnNet(data[data.length-i].UnitNet));
                    }else{
                        $(".DataDisplayNo512").eq(i-1).text("——");
                    }


                    if( data[data.length-i].CumulativeNet != null && data[data.length-i].CumulativeNet != undefined ){
                        $(".DataDisplayNo513").eq(i-1).text( returnNet(data[data.length-i].CumulativeNet));
                    }else{
                        $(".DataDisplayNo513").eq(i-1).text("——");
                    }


                    if( data[data.length-i].DailyIncrease != null && data[data.length-i].DailyIncrease != undefined ){

                        $(".DataDisplayNo514").eq(i-1).text( returnFloat(data[data.length-i].DailyIncrease)+"%");

                        if( data[data.length-i].DailyIncrease == 0 ){
                            $(".DataDisplayNo514").eq(i-1).css("color","#333333")
                        }else if( data[data.length-i].DailyIncrease < 0  ){
                            $(".DataDisplayNo514").eq(i-1).css("color","#333333")
                        }

                    }else{
                        $(".DataDisplayNo514").eq(i-1).text("——");
                    }
                }


            }else{
                //$(".DataDisplayBlockNo5").css("display","none");
            }
        },
        error:function(e){
            //alert("error:"+e);
        }
    });

    //分红
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductBouns?productID="+ItemId+"&fromTime="+fromTimeOfMonthly+"&endTime="+endTime+"&count=5",
        dataType:'json',
        success: function (data) {
            //console.log("分红");
            //console.log(data);

            if( data != null && data != "" && data != undefined){
                for(var i = 1 ;i < data.length+1 ; i++){
                    if(i >3 ){
                        break;
                    }

                    if( data[data.length-i].Date != null && data[data.length-i].Date != undefined ){
                        var newDate=new Date();
                        newDate.setTime(data[data.length-i].Date);
                        $(".DataDisplayNo611").eq(i-1).text(newDate.toISOString().substring(0,10));
                    }else{
                        $(".DataDisplayNo611").eq(i-1).text("——");
                    }


                    if( data[data.length-i].Bonus != null && data[data.length-i].Bonus != undefined ){
                        $(".DataDisplayNo612").eq(i-1).text( returnNet(data[data.length-i].Bonus));
                    }else{
                        $(".DataDisplayNo612").eq(i-1).text("——");
                    }

                    if( data[data.length-i].Split != null && data[data.length-i].Split != undefined ){
                        $(".DataDisplayNo613").eq(i-1).text( data[data.length-i].Split);
                    }else{
                        $(".DataDisplayNo613").eq(i-1).text("——");
                    }
                }
            }else{
                //$(".DataDisplayBlockNo6").css("display","none");
            }

        },
        error:function(e){
            //alert("error:"+e);
        }
    });


    //判断自选
    if (localStorage.UserFunds != "null" && localStorage.UserFunds != null && localStorage.UserFunds != "" && localStorage.UserFunds != undefined) {
        FundAttr = JSON.parse(localStorage.UserFunds);
    }else {
        localStorage.UserFunds = '';
        FundAttr = [];
    }
    if (FundAttr.indexOf(ItemId) == -1) {
        $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
        $('.fundCompDetailsBottomBtnImg01').attr("state","on");
    }else {
        $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
        $('.fundCompDetailsBottomBtnImg01').attr("state","off");
    }




    var fundListArray = [];
    //window.location.href ='informationPage01P2_FundCost.html?itemId='+ItemId;

    //var deviceID = "";
    //if(localStorage.deviceID == undefined ){
    //    localStorage.deviceID=JSON.stringify(deviceID);
    //}else {
    //    deviceID = JSON.parse(localStorage.deviceID);
    //}
    //console.log(deviceID);
    if(localStorage.fundList == undefined ){
        localStorage.fundList=JSON.stringify(fundListArray);
    }else {
        fundListArray = JSON.parse(localStorage.fundList);

        $(".fundCompareNum").text(fundListArray.length);


        if( $.inArray(ItemId,fundListArray) < 0){
            $(".fundCompDetailsBottomBtnAl").text("+ 加入比较");
        }else{
            $(".fundCompDetailsBottomBtnAl").text("- 移出比较");

        }
    }
    //fundCompDetailsBottomBtnAl






    $(".fundDetailsProfitChartBox>.fundDetailsProfitChartBrn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".fundDetailsProfitChartBox>.fundDetailsProfitChartBrn").removeClass("selected");
            $(this).addClass("selected");
            if( index == 0 ){
                option1.xAxis[0].data = monthlyAxis;
                option1.series[0].data = profitLineData02;
                option1.series[1].data = profitLineData12;
                myChart1.setOption(option1);
            }else if( index ==1){
                option1.xAxis[0].data = monthlyAxis3;
                option1.series[0].data = profitLineData03;
                option1.series[1].data = profitLineData13;
                myChart1.setOption(option1);
            }else if( index ==2){
                option1.xAxis[0].data = monthlyAxis6;
                option1.series[0].data = profitLineData04;
                option1.series[1].data = profitLineData14;
                myChart1.setOption(option1);
            }else if( index ==3){
                option1.xAxis[0].data = wholeAxis;
                option1.series[0].data = profitLineData05;
                option1.series[1].data = profitLineData15;
                myChart1.setOption(option1);
            }else{
                option1.xAxis[0].data = monthlyAxis;
                option1.series[0].data = profitLineData02;
                option1.series[1].data = profitLineData12;
                myChart1.setOption(option1);
            }
        })
    });



    $("#fundArchives").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='informationPage01P1_FundArchives.html?itemId='+ItemId;
    });
    $("#fundCompany").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        if( CompanyID != "" && CompanyID != null ){
            window.location.href ='informationPage03_FundCompanyDetails.html?itemId='+CompanyID;
        }else{
            alert("暂无公司详情信息");
        }
    });
    $("#fundCost").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();

        window.location.href ='informationPage01P2_FundCost.html?itemId='+ItemId;
    });

    $(".fundCompDetailsBottomBtnAl").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        //localStorage.removeItem("fundList");
        //var fundListArray = [];
        ////window.location.href ='informationPage01P2_FundCost.html?itemId='+ItemId;
        //if(localStorage.fundList == undefined ){
        //    fundListArray.push(ItemId);
        //    localStorage.fundList=JSON.stringify(fundListArray);
        //}else{
        //
        //    fundListArray = JSON.parse(localStorage.fundList);

        if( $.inArray(ItemId,fundListArray) < 0){
            if( fundListArray.length < 3  ){
                fundListArray.push(ItemId);
                localStorage.fundList=JSON.stringify(fundListArray);
            }else{
                fundListArray[0] =  fundListArray[1];
                fundListArray[1] =  fundListArray[2];
                fundListArray[2] =  ItemId;
                localStorage.fundList=JSON.stringify(fundListArray);
            }
            $(".fundCompareNum").text(fundListArray.length);
            $(".fundCompDetailsBottomBtnAl").text("- 移出比较");

        }else{
            removeByValue(fundListArray,ItemId);
            $(".fundCompareNum").text(fundListArray.length);
            localStorage.fundList=JSON.stringify(fundListArray);
            $(".fundCompDetailsBottomBtnAl").text("+ 加入比较");

        }


        //}
        //
        //console.log(localStorage.fundList);
    });

    $("#fundHeavily").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        //localStorage.removeItem("fundList");
        window.location.href ='informationPage01P3_FundHeavily.html?itemId='+ItemId;
    });

    $(".fundCompDetailsBottomBtn02").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        //localStorage.removeItem("fundList");
        window.location.href ='informationPage04_ProductsCompare.html';
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

function removeByValue(arr, val) {
    for(var i=0; i < arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}





function touchAddFund(event) {
    event.stopPropagation();
    event.preventDefault();

    //if (FundAttr.indexOf(ItemId) == -1) {
    //    $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
    //    $('.fundCompDetailsBottomBtnImg01').attr("state","on");
    //}else {
    //    $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
    //    $('.fundCompDetailsBottomBtnImg01').attr("state","off");
    //}

    if(  $(".fundCompDetailsBottomBtnImg01" ).attr("state") == "on" ){


        //FundAttr.push(ItemId);
        //localStorage.UserFunds=JSON.stringify(FundAttr);
        //$('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
        //$('.fundCompDetailsBottomBtnImg01').attr("state","off");

        httpGet("Investment/AddUserStocks/"+ItemId+"?userID=" + UserID + "&type=2", "", true, ajax_success3, ajax_fail3);
        function ajax_success3(obj) {
            //alert("添加：" + obj);
            if (obj !== null && obj !== "" && obj !== undefined) {
                if (obj == 0 || obj == 1) {
                    if( $.inArray(ItemId,FundAttr) < 0){

                        //console.log(obj);
                        //console.log(JSON.parse(localStorage.UserFunds));

                        FundAttr.push(ItemId);
                        localStorage.UserFunds=JSON.stringify(FundAttr);
                        $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
                        $('.fundCompDetailsBottomBtnImg01').attr("state","off");
                    }else{
                        $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
                        $('.fundCompDetailsBottomBtnImg01').attr("state","off");
                    }
                }
            }else{
                $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
                $('.fundCompDetailsBottomBtnImg01').attr("state","on");
            }
        }
        function ajax_fail3() {
            $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
            $('.fundCompDetailsBottomBtnImg01').attr("state","on");
        }
    }else if( $(".fundCompDetailsBottomBtnImg01" ).attr("state") == "off" ){


        //removeByValue(FundAttr,ItemId);
        //localStorage.UserFunds=JSON.stringify(FundAttr);
        //
        //$('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
        //$('.fundCompDetailsBottomBtnImg01').attr("state","on");

        httpGet("Investment/DelUserStocks/" + ItemId + "?userID=" + UserID + "&type=2", "", true, ajax_success10, ajax_fail10);
        function ajax_success10(obj) {
            if (obj !== null && obj !== "" && obj !== undefined) {
                if (obj == 0 || obj == 1) {

                    //console.log(obj);
                    //console.log(JSON.parse(localStorage.UserFunds));

                    removeByValue(FundAttr,ItemId);
                    localStorage.UserFunds=JSON.stringify(FundAttr);

                    $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
                    $('.fundCompDetailsBottomBtnImg01').attr("state","on");
                }else {
                    $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsAdd.png");
                    $('.fundCompDetailsBottomBtnImg01').attr("state","on");
                }
            }
            else {
                $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
                $('.fundCompDetailsBottomBtnImg01').attr("state","off");
            }
        }
        function ajax_fail10() {
            $('.fundCompDetailsBottomBtnImg01').attr("src","images/UserFundsDelete.png");
            $('.fundCompDetailsBottomBtnImg01').attr("state","off");
        }
    }

}
