/**
 * Created by aa on 2016/8/9.
 */
var Auditing = 0, nullu = "", NowVerision = "2.0", UserID = "", AppModel = "2.5.0";//是否显示登录界面   //空字符  //目前版本   //用户标识


var myLeadSwiper;
var db, dbV, dbVNowversion = "2.1"; //前端数据库定义
var UserStatus = "unlogin"; //记录用户登录状态


var myChart1;
var myChart2;
var myChart3;
var option1 = {};
var option2 = {};
var option3 = {};


//var stockDisplayAdd =20;
//var stockCount = 0;
var stockCountSkip = 0;
var stockDisplay = 0;
var stockTwentap = 0;
var monthToSearch = 0;
var institutionNumToSearch = 0;
var percentToSearch = 1000;
var fp = 0;
var switchFlag = 0;
var pageScroll=parseInt(GetQueryString("scroll"));
var ignoreLimit = true;

var ajaxArr;


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
            db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                db.transaction(function (tx) {

                    pageOnload();
                }, function (e) {
                    // alert("itemListInAndSe1ERROR: " + e.message);
                });
            });
            //pageOnload();
        }, 200);
    }
    //pageOnload();
});

function pageOnload() {
    document.getElementById('backpage').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    $(".stockSearching").focus(function(){
        //console.log("input");
        $(".searchBoxDisplay").css("display","none");
        $(".StockSearchPageLoading").css("display","none");
        $(".stockSearching").css("z-index","1");
        $(".stockSearching").animate({"width":"82%"},200);
        $(".stockSearchingBtn").animate({"opacity":"1"},200);
    });

    $(".stockSearchingBtn").click(function(){
        //console.log("out");
        $(".searchBoxDisplay").css("display","block");
        $(".StockSearchPageLoading").css("display","none");
        $(".searchedBox").css("display","none");
        //$(".StockSearchPageLoading").css("display","block");
        $(".stockSearching").animate({"width":"95%"},100);
        $(".stockSearchingBtn").css({"opacity":"0"});
        $(".InputClear").css({"opacity":"0"});
        $(".stockSearching").val("");
    });

    $(".InputClear").click(function(){
        //console.log("clear");
        $(".InputClear").css({"opacity":"0"});
        $(".stockSearching").val("");
        $(".searchedBox").empty();
    });

    $(".stockSearching").bind("input propertychange",function(){
        //console.log($(this).val());
        //console.log($(this).val().length);
        $(".searchedStock").unbind("click");
        $(".InputClear").animate({"opacity":"1"},200);
        $(".InputClear").css("z-index","1");
        //console.log(ajaxArr);
        if( ajaxArr != undefined ){
            ajaxArr.abort();
            netStatus = "abortListener";
        }
        if(  $(this).val().length == 0){
            $(".searchedBox").empty();
        }


        if( this.value.length >0 && this.value.length < 2 ){
            $(".searchedBox").html("<div class='searchedStock'><span class='searchedStockLoadingText'>请输入股票代码/股票名称</span></div>");
        }else if (this.value.length >= 2) {
            $(".searchedBox").empty();
            $(".searchedBox").html("<div class='searchedStock thisloading'><span class='searchedStockLoadingText'>加载中……</span></div>");
            var searchValue = this.value;

            //alert(1);
            db.transaction(function (tx) {
                tx.executeSql('select * from All_stock where SearchSSN LIKE ?', ['%' + searchValue + '%'], function (tx, res) {
                    //alert(2);
                    if (res != null && res.rows != null && res.rows.length > 0) {
                        $(".thisloading").remove();
                        //alert(3);
                        for (var i = 0; i < res.rows.length; i++) {
                            var obj = res.rows.item(i);

                            $(".searchedBox").append("<div class='searchedStock'>" +
                            "<span class='searchedStockCode'>"+stocksIdTransform(obj.Symbol)+"</span>" +
                            "<span class='searchedStockName'>"+obj.Name+"</span>" +
                            "</div>");
			    
                            $(".searchedStock ").eq(i).attr("itemId", obj.Symbol);

                            //$('#searchR_ul').append('<li id="search_' + obj.Symbol + '" class="searchR_li"><input type="hidden" class="hidden" value="' + obj.Symbol + '"/><span><span class="searchR_code">' + obj.StockID + '</span><span>' + obj.Name + '</span></span><span class="float-right"><img id="add_' + obj.Symbol + '" src="images/search_add.png"/></span></li>');
                            //bind_indexlist2('search_' + obj.Symbol);
                            //bind_indexlist3('add_' + obj.Symbol);

                            tx.executeSql('select * from Chose_stock_' + UserStatus + ' where Symbol=?', [obj.Symbol], function (tx, res) {
                                //if (res != null && res.rows != null) {
                                //    if (res.rows.length > 0) {
                                //        $('#add_' + res.rows.item(0).Symbol).attr('src', 'images/search_added.png');
                                //    }
                                //}
                            });
                        }


                    //    添加点击事件

                        $(".searchedStock").each(function(index){
                            $(this).on("click",function(event) {
                                event.stopPropagation();
                                event.preventDefault();
                                AddGoback(localStorage.N_url, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId"));
                                //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId");
                                //slide('right', 'lightblue', 1, 'tool1_0_EarningsForecasts.html');
                            });
                        });




                    }
                    else {
                        $(".searchedBox").html("<div class='searchedStock'><span class='searchedStockLoadingText'>没有找到相关股票</span></div>");
                    }
                });
            }, function (e) {
                alert("股票查询通配符ERROR: " + e.message);
            });
        }

        //原搜索函数begin
        //
        //if( !isNaN($(this).val()) )
        //{
        //    if( $(this).val().length  && $(this).val().length < 3){
        //        $(".searchedBox").html("<div class='searchedStock'>请输入股票代码</div>");
        //    }else if( 3 <= $(this).val().length  &&  $(this).val().length <= 6){
        //        $(".searchedBox").empty();
        //        //$.ajax().abort();
        //        $(".searchedBox").html("<div class='searchedStock thisloading'>加载中……</div>");
        //        ajaxArr = httpGet("Reader/StockReportInfos?stockIds="+$(this).val()+"&fromMonth=11&lessInstitutionNum=1&lessPercent=-100","",true,ajax_successTestN,ajax_failTestN);
        //        function ajax_successTestN(obj){
        //            //console.log("Num");
        //            //console.log(obj.length);
        //            $(".thisloading").remove();
        //            if( obj != null && obj != "" && obj != undefined){
        //                for( var i = 0 ; i < obj.length; i++ ){
        //                    $(".searchedBox").append("<div class='searchedStock'>" +
        //                    "<span class='searchedStockName'>"+obj[i].StockName+"</span>" +
        //                    "<span class='searchedStockCode'>"+stocksIdTransform(obj[i].StockID)+"</span></div>");
        //
        //                    $(".searchedStock ").eq(i).attr("itemId", obj[i].StockID);
        //                }
        //
        //            }else{
        //                $(".searchedBox").html("<div class='searchedStock'>没有找到相关股票</div>");
        //            }
        //
        //            $(".searchedStock").each(function(index){
        //                $(this).on("click",function(event) {
        //                    event.stopPropagation();
        //                    event.preventDefault();
        //                    AddGoback(localStorage.N_url, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId"));
        //                    //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId");
        //                    //slide('right', 'lightblue', 1, 'tool1_0_EarningsForecasts.html');
        //                });
        //            });
        //        }
        //        function ajax_failTestN(){
        //            if( netStatus != "abortListener" ){
        //                console.log("加载失败");
        //                $(".searchedBox").html("<div class='searchedStock'>加载失败，点击重新加载</div>");
        //                $(".searchedStock").on("click",function(){
        //                    $(".searchedStock").remove();
        //                    //$(".loading .loadingSpan").remove();
        //                    httpGet("Reader/StockReportInfos?stockIds="+$(".stockSearching").val()+"&fromMonth=11&lessInstitutionNum=1&lessPercent=-100","",true,ajax_successTestN,ajax_failTestN);
        //                })
        //            }
        //        }
        //
        //
        //    }else if($(this).val().length > 6){
        //       $(".searchedBox").html("<div class='searchedStock'>没有找到相关股票</div>");
        //    }else{
        //        $(".searchedBox").empty();
        //    }
        //}else{
        //    if($(this).val().length >=2 ){
        //        $(".searchedBox").empty();
        //        //$.ajax().abort();
        //        //$(".searchedBox").html("<div class='searchedStock'>"+$(this).val()+"</div>");
        //
        //        //httpGet("Reader/StockReportInfos?stockIds={stockIds}&stockNames={stockNames}&fromMonth={fromMonth}&lessInstitutionNum={lessInstitutionNum}&lessPercent={lessPercent}","",true,ajax_successTest,ajax_failTest);
        //        $(".searchedBox").html("<div class='searchedStock thisloading'>加载中……</div>");
        //        ajaxArr = httpGet("Reader/StockReportInfos?stockNames="+$(this).val()+"&fromMonth=11&lessInstitutionNum=1&lessPercent=-100","",true,ajax_successTest,ajax_failTest);
        //        function ajax_successTest(obj){
        //            //console.log("Text");
        //            //console.log(obj.length);
        //            $(".thisloading").remove();
        //            if( obj != null && obj != "" && obj != undefined){
        //                for( var i = 0 ; i < obj.length; i++ ){
        //                    $(".searchedBox").append("<div class='searchedStock'>" +
        //                    "<span class='searchedStockName'>"+obj[i].StockName+"</span>" +
        //                    "<span class='searchedStockCode'>"+stocksIdTransform(obj[i].StockID)+"</span></div>");
        //                    $(".searchedStock ").eq(i).attr("itemId", obj[i].StockID);
        //                }
        //                //$(".stocksBox2").empty();
        //                //$(".stocksBox2").append(" <tr class='stocksTitle2'> <td>股票</td> <td>所属主题</td> <td>调整时间</td> <td>调整报告数</td> <td>平均调整幅度</td> </tr> ");
        //            }else{
        //                $(".searchedBox").html("<div class='searchedStock'>没有找到相关股票</div>");
        //            }
        //
        //            $(".searchedStock").each(function(index){
        //                $(this).on("click",function(event) {
        //                    event.stopPropagation();
        //                    event.preventDefault();
        //                    AddGoback(localStorage.N_url, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId"));
        //                    //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId");
        //                    //slide('right', 'lightblue', 1, 'tool1_0_EarningsForecasts.html');
        //                });
        //            });
        //        }
        //        function ajax_failTest(){
        //            if( netStatus != "abortListener" ){
        //                console.log("加载失败");
        //                //$(".searchedBox").html("<div class='searchedStock'>加载失败，点击重新加载</div>");
        //                $(".searchedStock").on("click",function(){
        //                    $(".searchedStock").remove();
        //                    //$(".loading .loadingSpan").remove();
        //                    httpGet("Reader/StockReportInfos?stockNames="+$(".stockSearching").val()+"&fromMonth=11&lessInstitutionNum=1&lessPercent=-100","",true,ajax_successTest,ajax_failTest);
        //                })
        //            }
        //        }
        //    }
        //    //else if($(this).val().length > 6){
        //    //    $(".searchedBox").html("<div class='searchedStock'>没有找到相关股票</div>");
        //    //}
        //}
        ////$(".searchedBox").html("<div class='searchedStock'>"+sl+"</div>");

//原搜索函数end


        $(".searchedStock").each(function(index){
            $(this).on("click",function(event) {
                event.stopPropagation();
                event.preventDefault();
                AddGoback(localStorage.N_url, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId"));
                //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId");
                //slide('right', 'lightblue', 1, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId"));
            });
        });

        //$(".searchedStock").each(function(index){
        //    $(this).on("click",function(event) {
        //        event.stopPropagation();
        //        event.preventDefault();
        //        window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId");
        //        //slide('right', 'lightblue', 1, 'tool1_0_EarningsForecasts.html');
        //    });
        //});
    });


    //111111111
    $(".switchOfAdjustTime").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".ListTime").fadeIn(200);
        switchFlag = 1;
        $(".ListNum").fadeOut(200);
        $(".ListRange").fadeOut(200);
        $(".ListTime>li").each(function(index){
            $(this).on("click",function(event) {
                event.stopPropagation();
                event.preventDefault();
                $(".loading").css("display", "block");
                $(".ListTime>li").removeClass("select");
                $(this).addClass("select");
                $.ajax().abort();
                if(index == 0) {
                    $(".switchOfAdjustTime").html("1个月内上调<div class='switchArrw'></div>");
                    monthToSearch = 0;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("2个月内上调数据");
                }else if(index == 1) {
                    $(".switchOfAdjustTime").html("2个月内上调<div class='switchArrw'></div>");
                    monthToSearch = 1;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("3个月内上调数据");
                }else if(index == 2) {
                    $(".switchOfAdjustTime").html("3个月内上调<div class='switchArrw'></div>");
                    monthToSearch = 2;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("6个月内上调数据");
                }else if(index == 3) {
                    $(".switchOfAdjustTime").html("6个月内上调<div class='switchArrw'></div>");
                    monthToSearch = 5;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("9个月内上调数据");
                }else if(index == 4) {
                    $(".switchOfAdjustTime").html("不限<div class='switchArrw'></div>");
                    monthToSearch = 11;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("不设限");
                }else{
                    console.log("error");
                }
                $(".ListTime").fadeOut(100);
                switchFlag = 0;
                $(".ListTime>li").unbind("click");
            });
        });
        $("body").on("click",function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(".ListTime").fadeOut(100);
            switchFlag = 0;
            $(".ListTime>li").unbind("click");
            $("body").unbind("click");
        });
        //$(".switchOfAdjustTime").unbind("click");
    });

    //22222222222222222222
    $(".switchOfReportNumber").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".ListNum").fadeIn(200);
        switchFlag = 1;
        $(".ListTime").fadeOut(200);
        $(".ListRange").fadeOut(200);
        $(".ListNum>li").each(function(index){
            $(this).on("click",function(event) {
                event.stopPropagation();
                event.preventDefault();
                $(".loading").css("display", "block");
                $(".ListNum>li").removeClass("select");
                $(this).addClass("select");
                $.ajax().abort();
                if(index == 0) {
                    $(".switchOfReportNumber").html("3家以上上调<div class='switchArrw'></div>");
                    institutionNumToSearch = 3;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("3家以上上调");
                }else if(index == 1) {
                    $(".switchOfReportNumber").html("5家以上上调<div class='switchArrw'></div>");
                    institutionNumToSearch = 5;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("5家以上上调");
                }else if(index == 2) {
                    $(".switchOfReportNumber").html("8家以上上调<div class='switchArrw'></div>");
                    institutionNumToSearch = 8;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("8家以上上调");
                }else if(index == 3) {
                    $(".switchOfReportNumber").html("10家以上上调<div class='switchArrw'></div>");
                    institutionNumToSearch = 10;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("10家以上上调");
                }else if(index == 4) {
                    $(".switchOfReportNumber").html("不限<div class='switchArrw'></div>");
                    institutionNumToSearch = 1;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("不设限");
                }else{
                    console.log("error");
                }
                $(".ListNum").fadeOut(100);
                switchFlag = 0;
                $(".ListNum>li").unbind("click");
            });
        });

        $("body").on("click",function() {
            $(".ListNum").fadeOut(100);
            switchFlag = 0;
            $(".ListNum>li").unbind("click");
            $("body").unbind("click");
        });
        //$(".switchOfAdjustTime").unbind("click");
    });


    //3333333333333333333333
    $(".switchOfAverageRange").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        //$(".ListTime").css("display","block");
        $(".ListRange").fadeIn(200);
        switchFlag = 1;
        $(".ListNum").fadeOut(200);
        $(".ListTime").fadeOut(200);
        $(".ListRange>li").each(function(index){
            $(this).on("click",function(event) {
                event.stopPropagation();
                event.preventDefault();
                $(".loading").css("display", "block");
                $(".ListRange>li").removeClass("select");
                $(this).addClass("select");
                $.ajax().abort();
                if(index == 0) {
                    $(".switchOfAverageRange").html("10%以上上调<div class='switchArrw'></div>");
                    percentToSearch = 1000;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("10%以上上调");
                }else if(index == 1) {
                    $(".switchOfAverageRange").html("30%以上上调<div class='switchArrw'></div>");
                    percentToSearch = 3000;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("30%以上上调");
                }else if(index == 2) {
                    $(".switchOfAverageRange").html("50%以上上调<div class='switchArrw'></div>");
                    percentToSearch = 5000;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("50%以上上调");
                }else if(index == 3) {
                    $(".switchOfAverageRange").html("100%以上上调<div class='switchArrw'></div>");
                    percentToSearch = 10000;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("100%以上上调");
                }else if(index == 4) {
                    $(".switchOfAverageRange").html("不限<div class='switchArrw'></div>");
                    percentToSearch = 0;
                    stockCountSkip = 0;
                    stockDisplay = 0;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                    //console.log("不设限");
                }else{
                    console.log("error");
                }
                $(".ListRange").fadeOut(100);
                switchFlag = 0;
                $(".ListRange>li").unbind("click");
            });
        });
        $("body").on("click",function() {
            $(".ListRange").fadeOut(100);
            switchFlag = 0;
            $(".ListRange>li").unbind("click");
            $("body").unbind("click");
        });
    });

    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );

    //$(window).scroll(function(){
    //    //console.log($(this).scrollTop());
    //    if( $(this).scrollTop() >= 500 ) {
    //        $(".topTowards").css("display", "block");
    //    }else if( $(this).scrollTop() < 500) {
    //        $(".topTowards").css("display", "none");
    //    }
    //});

    $(".topTowards").on("click",function(e){
        scollto(0);
    });

}




function searchingStocksList( month,institution,percent ){
    httpGet("Reader/StockReportInfos?fromMonth="+month+"&from="+stockCountSkip+"&size=100&lessInstitutionNum="+institution+"&lessPercent="+percent,"",true,ajax_successList,ajax_failList);
    //httpGet("Reader/StockReportInfos?fromMonth="+month+"&lessInstitutionNum="+institution+"&lessPercent="+percent,"",true,ajax_successList,ajax_failList);
    function ajax_successList(obj){
        //console.log(obj);

        $(window).unbind('scroll');
        if( obj != null && obj != "" && obj != undefined){
            $(".StockSearchPageLoading").css("display", "none");
            $(".stocksBox2 .stocksContainer").off("click");
            if( stockCountSkip == 0 ){
                $(".stocksBox2").empty();
                $(".stocksBox2").append(" <tr class='stocksTitle2'> <td>股票</td> <td>所属主题</td> <td>调整时间</td> <td>调整报告数</td> <td>平均调整幅度</td> </tr> ");
            }
            for( var i = 0; i < 20; i++){
                if( i >= obj.length-1 ){
                    $(window).unbind('scroll');
                    break;
                }
                $(".stocksBox2").append("<tr class='stocksContainer' > " +
                "<td> <span class='stockName2'></span> <span class='stockCode2'></span></td> " +
                "<td class='topicInfo'></td> " +
                "<td class='lastTime'></td> " +
                "<td class='reportNum'></td> " +
                "<td class='adjustRank'></td> </tr> ");

                $(".stocksBox2 .stocksContainer").eq(i+stockDisplay).attr("itemId", obj[i].StockID);
                $(".stocksBox2 .stockName2").eq(i+stockDisplay).text(obj[i].StockName);
                $(".stocksBox2 .stockCode2").eq(i+stockDisplay).text(stocksIdTransform(obj[i].StockID));
                $(".stocksBox2 .topicInfo").eq(i+stockDisplay).text(obj[i].RelatedTopicName);
                $(".stocksBox2 .lastTime").eq(i+stockDisplay).text(obj[i].LastAdjustTime.substring(2,10));
                $(".stocksBox2 .reportNum").eq(i+stockDisplay).text(obj[i].AdjustReportCount);

                if( returnFloat(obj[i].AdjustPercent) > 0 ){
                    $(".stocksBox2 .adjustRank").eq(i+stockDisplay).text("+"+returnFloat(obj[i].AdjustPercent)+"%");
                }else  if( returnFloat(obj[i].AdjustPercent) == 0 ){
                    $(".stocksBox2 .adjustRank").eq(i+stockDisplay).text(returnFloat(obj[i].AdjustPercent)+"%");
                    $(".stocksBox2 .adjustRank").eq(i+stockDisplay).css("color", "#333333");
                }else  if( returnFloat(obj[i].AdjustPercent) < 0 ){
                    $(".stocksBox2 .adjustRank").eq(i+stockDisplay).text(returnFloat(obj[i].AdjustPercent)+"%");
                    $(".stocksBox2 .adjustRank").eq(i+stockDisplay).css("color", "#20c062");
                }
            }

            $(".stocksBox2 .stocksContainer").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    if( switchFlag == 0){
                        AddGoback(localStorage.N_url, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);

                        //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                        //slide('left','lightblue',1,'tool2_2_BarForTopic.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    }else{
                        $(".ListTime").fadeOut(100);
                        $(".ListNum").fadeOut(100);
                        $(".ListRange").fadeOut(100);
                        switchFlag = 0;
                    }
                })
            });
        }else{
            $(".stocksBox2").empty();
            $(".StockSearchPageLoading>span").text("无搜索结果，请更改选择条件后重试");
            $(".StockSearchPageLoading>span").text("无搜索结果，请更改选择条件后重试");
        }
        loadend();
        $(window).scroll(function(){

            if( $(this).scrollTop() >= 50 ) {
                $(".pageEndLabel").css("opacity", "1");
            }else if( $(this).scrollTop() < 50) {
                $(".pageEndLabel").css("opacity", "0");
            }

            if( $(this).scrollTop() >= 500 ) {
                $(".topTowards").css("display", "block");
            }else if( $(this).scrollTop() < 500) {
                $(".topTowards").css("display", "none");
            }
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight == scrollHeight){

                if( stockTwentap >= 80) {
                    $(window).unbind('scroll');
                    stockCountSkip += 100;
                    stockDisplay += 20;
                    stockTwentap = 0;
                    searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
                }else{
                    $(".stocksBox2 .stocksContainer").off("click");
                    stockDisplay += 20;
                    stockTwentap += 20;
                    for( var i = 0; i < 20; i++){
                        if( i+stockTwentap >= obj.length ){
                            $(".StockSearchPageLoading").css("display", "none");
                            $(window).unbind('scroll');
                            break;
                        }
                        if(  obj[i+stockTwentap] == undefined ){
                            $(".StockSearchPageLoading").css("display", "none");
                            $(window).unbind('scroll');
                            break;
                        }

                        $(".stocksBox2").append("<tr class='stocksContainer' > " +
                        "<td> <span class='stockName2'></span> <span class='stockCode2'></span></td> " +
                        "<td class='topicInfo'></td> " +
                        "<td class='lastTime'></td> " +
                        "<td class='reportNum'></td> " +
                        "<td class='adjustRank'></td> </tr> ");

                        $(".stocksBox2 .stocksContainer").eq(i+stockDisplay).attr("itemId", obj[i+stockTwentap].StockID);
                        $(".stocksContainer .stockName2").eq(i+stockDisplay).text(obj[i+stockTwentap].StockName);
                        $(".stocksContainer .stockCode2").eq(i+stockDisplay).text(stocksIdTransform(obj[i+stockTwentap].StockID));
                        $(".stocksContainer .topicInfo").eq(i+stockDisplay).text(obj[i+stockTwentap].RelatedTopicName);
                        $(".stocksContainer .lastTime").eq(i+stockDisplay).text(obj[i+stockTwentap].LastAdjustTime.substring(2,10));
                        $(".stocksContainer .reportNum").eq(i+stockDisplay).text(obj[i+stockTwentap].AdjustReportCount);

                        if( returnFloat(obj[i+stockTwentap].AdjustPercent) > 0 ){
                            $(".stocksContainer .adjustRank").eq(i+stockDisplay).text("+"+returnFloat(obj[i+stockTwentap].AdjustPercent)+"%");
                        }else  if( returnFloat(obj[i+stockTwentap].AdjustPercent) == 0 ){
                            $(".stocksContainer .adjustRank").eq(i+stockDisplay).text(returnFloat(obj[i+stockTwentap].AdjustPercent)+"%");
                            $(".stocksContainer .adjustRank").eq(i+stockDisplay).css("color", "#333333");
                        }else  if( returnFloat(obj[i+stockTwentap].AdjustPercent) < 0 ){
                            $(".stocksContainer .adjustRank").eq(i+stockDisplay).text(returnFloat(obj[i+stockTwentap].AdjustPercent)+"%");
                            $(".stocksContainer .adjustRank").eq(i+stockDisplay).css("color", "#20c062");
                        }

                    }

                    $(".stocksBox2 .stocksContainer").each(function(){
                        $(this).on("click",function(event){
                            event.stopPropagation();
                            event.preventDefault();
                            if( switchFlag == 0){
                                AddGoback(localStorage.N_url, 'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                                //window.location.href ='tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                                //slide('left','lightblue',1,'tool2_2_BarForTopic.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                            }else{
                                $(".ListTime").fadeOut(100);
                                $(".ListNum").fadeOut(100);
                                $(".ListRange").fadeOut(100);
                                switchFlag = 0;
                            }
                        })
                    });
                }

                //$(".loadMoreImg").css("display","inline-block");
                //InvestGroupsOnclick02();
                //loadMoreImg
            }

        });

    }
    function ajax_failList(){
        console.log("加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            searchingStocksList( monthToSearch,institutionNumToSearch,percentToSearch );
        });
    }
}




function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.location.href = 'index.html';
    //window.location.href = 'chanceSecondary07_forecasting.html';
    //slide('right', 'lightblue', 1, 'index.html');
}




function loadend(){
    if( fp == 0 ){
        scollto(pageScroll);
        fp += 1;
    }
    $(".loading").css("display", "none");
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}



function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },100);
}

