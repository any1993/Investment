/**
 * Created by aa on 2016/4/21.
 */
var AccessToken ;
var nullu = "", NowVerision = "2.0", UserID = "";
var db;
var loadAmount = 0;

//缓存相关
var pageScroll = 0;
//var cacheTag = 0 ;
var cacheData01 ;
var cacheData02 ;

function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },0);
}

$(function () {
    FastClick.attach(document.body);
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

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
            if( sessionStorage.pageScrollIG == undefined ){
                sessionStorage.pageScrollIG = document.body.scrollTop;
                pageScroll = sessionStorage.pageScrollIG;
                scollto(pageScroll);
            }else{
                pageScroll = sessionStorage.pageScrollIG;
                scollto(pageScroll);
            }
        }, 200);
    }

    //pageOnload();
    //if( sessionStorage.pageScrollIG == undefined ){
    //    sessionStorage.pageScrollIG = document.body.scrollTop;
    //    pageScroll = sessionStorage.pageScrollIG;
    //    scollto(pageScroll);
    //}else{
    //    pageScroll = sessionStorage.pageScrollIG;
    //    scollto(pageScroll);
    //}

    $(".reload").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        //sessionStorage.removeItem("dataig1");
        sessionStorage.removeItem("pageScrollIG");
        sessionStorage.removeItem("pageNumIG");
        sessionStorage.removeItem("dataIG1");
        //console.log(sessionStorage);
        location.reload(true);
    });

    $(window).scroll(function(){
        //sessionStorage.pageScrollIG = document.body.scrollTop;
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        if(scrollTop + windowHeight == scrollHeight && loadAmount <= 100){
            $(".loadMoreImg").css("display","inline-block");
            InvestGroupsOnclick02();
            //loadMoreImg
        }
    });

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
            //window.location.href ='index.html';
            //slide('right', 'lightblue', 1, 'index.html');
            //parent.location='index.html';
        }
    });
    //pageLocationChange 2
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);


    if( sessionStorage.pageNumIG == undefined || sessionStorage.timeStampIG == undefined ||(Date.parse(new Date())-sessionStorage.timeStampIG) > 300000){
        sessionStorage.pageNumIG = 5 ;
        loadAmount = parseInt(sessionStorage.pageNumIG);
    }else{
        loadAmount = parseInt(sessionStorage.pageNumIG);
    }

    //页面加载
    InvestGroupsOnload();

    $(".loadMore").on("click",function(){
        //点击加载
        InvestGroupsOnclick02();
    });
}


//页面加载
function InvestGroupsOnload(){

    if( sessionStorage.dataIG1 == undefined || sessionStorage.timeStampIG == undefined ||(Date.parse(new Date())-sessionStorage.timeStampIG) > 300000){

        sessionStorage.timeStampIG=Date.parse(new Date());

        httpGet("Reader/InvestGroups?count="+loadAmount, "", true, ajax_success1, ajax_fail1);
    }else{
        cacheData01 = JSON.parse(sessionStorage.dataIG1);
        ajax_success1(cacheData01);
    }

    function ajax_success1(obj){
        sessionStorage.dataIG1=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined && obj !=[]){
            var num_e=obj.length;
            for(var b = 0;b < num_e;b++){
                $(".mainbox").append("<div class='datalistAP1' itemId='"+obj[b].GroupId+"'><div class='sharesBox1'><div class='tableleft'>" +
                "<img class='expertBoxA' onerror='this.src=" + '"img/headimg.jpg"' + "'>" +
                "<span class='passageTag nameA'></span><br>" +
                "<span class='text9'>来自</span>" +
                "<span class='text9 comefrom'></span> <br> " +
                "<span class='passageTitle articleTitle'></span> </div> " +
                "<div class='imfCircleMain'> <span class='CircleText1'>月收益</span> <br> " +
                "<span class='CircleText2 week_percent'>****</span> " +
                "</div><img src='img/button_to.png' class='buttonToOG'> </div> " +
                "<div class='tableBox'><table class='sharesBox2' cellspacing='0'></table></div><div class='clear'></div> </div>");

                $(".sharesBox1 .expertBoxA").eq(b).attr("src",obj[b].ImageUrl);
                $(".sharesBox1 .nameA").eq(b).text("@"+obj[b].AuthorName);
                $(".sharesBox1 .comefrom").eq(b).text(obj[b].MediaName);
                $(".sharesBox1 .articleTitle").eq(b).text(obj[b].GroupName);
                $(".sharesBox1 .week_percent").eq(b).text(returnFloat(obj[b].MonthRate)+"%");

                if( obj[b].Stocks != null && obj[b].Stocks != [] &&  obj[b].Stocks != "" &&  obj[b].Stocks != undefined) {
                    if (obj[b].Stocks.length == 0) {
                        $(".sharesBox2").eq(b).append("<div class='noData'>该投资组合股票已清仓</div>")
                    } else if (obj[b].Stocks[0].StockInfo == null) {
                        $(".sharesBox2").eq(b).append("<div class='noData'>该投资组合股票已清仓</div>")
                        obj[b].Stocks = {};
                    }
                    var num_s = obj[b].Stocks.length;
                    for (var s = 0; s < num_s; s++) {
                        if( s >= 10 ){
                            break;
                        }
                        $(".sharesBox2").eq(b).append("<tr class='sharesImf_listA' id='shares" + b + "_" + s + "'><td><span class='share_name'>股票名称</span><br><small class='sharesNum'>股票代码</small></td><td><span class='shares_price'>股票现价</span></td><td><span class='UAD'>股票涨跌</span></td> <td><span class='pctNum shares_percent'>已清仓</span><div class='percentage'><div class='flexA'></div></div></td> </tr>");
                    }
                    for (var bn = 0; bn < num_s; bn++) {
                        if (obj[b].Stocks[bn].StockInfo == null) {
                            continue
                        }
                        if( bn >= 10 ){
                            break;
                        }
                        $(".sharesBox2:eq(" + b + ") .share_name").eq(bn).text(obj[b].Stocks[bn].StockInfo.Name);
                        $(".sharesBox2:eq(" + b + ") .sharesNum").eq(bn).text(obj[b].Stocks[bn].StockInfo.Code);
                        if( obj[b].Stocks[bn].StockInfo.Trade > 0 ){
                            $(".sharesBox2:eq(" + b + ") .shares_price").eq(bn).text(returnFloat(obj[b].Stocks[bn].StockInfo.Trade));
                        }else if( obj[b].Stocks[bn].StockInfo.Trade <= 0 ){
                            $(".sharesBox2:eq(" + b + ") .shares_price").eq(bn).text("——");
                        }

                        if (obj[b].Stocks[bn].StockInfo.Changepercent >= 0) {
                            $(".sharesBox2:eq(" + b + ") .UAD").eq(bn).text(returnFloat(obj[b].Stocks[bn].StockInfo.Changepercent ) + "%");
                        } else {
                            $(".sharesBox2:eq(" + b + ") .UAD").eq(bn).text(returnFloat(obj[b].Stocks[bn].StockInfo.Changepercent )  + "%");
                            $(".sharesBox2:eq(" + b + ") .UAD").eq(bn).css("color", "#20c062");
                        }
                        if (obj[b].Stocks[bn].Current != null && obj[b].Stocks[bn].Current != "" && obj[b].Stocks[bn].Current.Percent != 0) {
                            $(".sharesBox2:eq(" + b + ") .shares_percent").eq(bn).text(returnFloat(obj[b].Stocks[bn].Current.Percent) + "%");
                            $(".sharesBox2:eq(" + b + ") .flexA").eq(bn).css("width", obj[b].Stocks[bn].Current.Percent + "%");
                        } else {
                            $(".sharesBox2:eq(" + b + ") .flexA").eq(bn).css("width", "0");
                        }
                    }
                }
            }
            $(".loading").css("display","none");
            $(".loadMore").css("display","block");
        }else{
            $(".loading").css("display","none");
            $(".loadMore").css("display","none");
        }


        //pageLocationChange
        $(".datalistAP1").each(function(index){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                sessionStorage.pageScrollIG = document.body.scrollTop;
                AddGoback(localStorage.N_url, "forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId'));
                //window.location.href ="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index;
                //slide('left','lightblue',1,"forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index);
                //parent.location="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index;
            })
        });
        //scollto(pageScroll);
    }
    function ajax_fail1(){
        console.log("投资组合加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            InvestGroupsOnload();
        });
    }

}

//点击加载

function InvestGroupsOnclick02(){

    httpGet("Reader/InvestGroups?count=5&skip="+loadAmount, "", true, ajax_success2, ajax_fail2);

    function ajax_success2(obj){
        $(".datalistAP1").unbind('click');
        if (obj != null && obj != "" && obj != undefined) {

            sessionStorage.dataIG1 = sessionStorage.dataIG1.substring(0,sessionStorage.dataIG1.length-1)+","+(JSON.stringify(obj)).substring(1,JSON.stringify(obj).length);

            for (var b = 0; b < 5; b++) {

                $(".mainbox").append("<div class='datalistAP1' itemId='" + obj[b].GroupId + "'><div class='sharesBox1'><div class='tableleft'>" +
                "<img class='expertBoxA'  onerror='this.src=" + '"img/headimg.jpg"' + "'>" +
                "<span class='passageTag nameA'></span><br>" +
                "<span class='text9'>来自</span>" +
                "<span class='text9 comefrom'></span> <br> " +
                "<span class='passageTitle articleTitle'></span> " +
                "</div> <div class='imfCircleMain'> " +
                "<span class='CircleText1'>月收益</span> <br> " +
                "<span class='CircleText2 week_percent'>****</span> </div> <img src='img/button_to.png' class='buttonToOG'>" +
                "</div> <div class='tableBox'> <table class='sharesBox2' cellspacing='0'> </table> </div> <div class='clear'></div> </div>");
                $(".sharesBox1 .expertBoxA").eq(b + loadAmount).attr("src", obj[b].ImageUrl);
                $(".sharesBox1 .nameA").eq(b + loadAmount).text("@" + obj[b].AuthorName);
                $(".sharesBox1 .comefrom").eq(b + loadAmount).text(obj[b].MediaName);
                $(".sharesBox1 .articleTitle").eq(b + loadAmount).text(obj[b].GroupName);
                $(".sharesBox1 .week_percent").eq(b + loadAmount).text(returnFloat(obj[b].MonthRate ) + "%");
                if( obj[b].Stocks != null && obj[b].Stocks != [] &&  obj[b].Stocks != "" &&  obj[b].Stocks != undefined){
                    if (obj[b].Stocks.length == 0) {
                        $(".sharesBox2").eq(b + loadAmount).append("<div class='noData'>该投资组合股票已清仓</div>")
                    } else if (obj[b].Stocks[0].StockInfo == null) {
                        $(".sharesBox2").eq(b + loadAmount).append("<div class='noData'>该投资组合股票已清仓</div>");
                        obj[b].Stocks = {};
                    }

                    var num_s = obj[b].Stocks.length;
                    for (var s = 0; s < num_s; s++) {
                        $(".sharesBox2").eq(b + loadAmount).append("<tr class='sharesImf_listA' id='shares" + b + loadAmount + "_" + s + "'><td><span class='share_name'>股票名称</span><br><small class='sharesNum'>股票代码</small></td><td><span class='shares_price'>股票现价</span></td><td><span class='UAD'>股票涨跌</span></td> <td><span class='pctNum shares_percent'>已清仓</span><div class='percentage'><div class='flexA'></div></div></td> </tr>");
                    }
                    for (var bn = 0; bn < num_s; bn++) {
                        if (obj[b].Stocks[bn].StockInfo == null) {
                            continue
                        }
                        $(".sharesBox2:eq(" + (b + loadAmount) + ") .share_name").eq(bn).text(obj[b].Stocks[bn].StockInfo.Name);
                        $(".sharesBox2:eq(" + (b + loadAmount) + ") .sharesNum").eq(bn).text(obj[b].Stocks[bn].StockInfo.Code);
                        if( obj[b].Stocks[bn].StockInfo.Trade > 0 ){
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .shares_price").eq(bn).text(returnFloat(obj[b].Stocks[bn].StockInfo.Trade));
                        }else if( obj[b].Stocks[bn].StockInfo.Trade <= 0 ){
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .shares_price").eq(bn).text("——");
                        }

                        if (obj[b].Stocks[bn].StockInfo.Changepercent >= 0) {
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .UAD").eq(bn).text(returnFloat(obj[b].Stocks[bn].StockInfo.Changepercent )  + "%");
                        } else {
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .UAD").eq(bn).text(returnFloat(obj[b].Stocks[bn].StockInfo.Changepercent )  + "%");
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .UAD").eq(bn).css("color", "#20c062");
                        }
                        if (obj[b].Stocks[bn].Current != null && obj[b].Stocks[bn].Current != "" && obj[b].Stocks[bn].Current.Percent != 0) {
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .shares_percent").eq(bn).text(returnFloat(obj[b].Stocks[bn].Current.Percent) + "%");
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .flexA").eq(bn).css("width", obj[b].Stocks[bn].Current.Percent + "%");
                        } else {
                            $(".sharesBox2:eq(" + (b + loadAmount) + ") .flexA").eq(bn).css("width", "0");
                        }
                    }
                }
            }
            $(".loadMoretxt").text("加载更多");
            loadAmount += 5;
            sessionStorage.pageNumIG = loadAmount ;
            $(".loadMore").css("display", "block");
            if (loadAmount >= 100) {
                $(".loadMore").css("display", "none");
            }
            $(".datalistAP1").each(function (index) {
                $(this).on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollIG = document.body.scrollTop;
                    AddGoback(localStorage.N_url, "forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index);
                    //window.location.href ="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index;
                    //slide('left','lightblue',1,"forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index);
                    //parent.location = "forecastingPage2o1_GroupDetails.html?itemId=" + $(this).attr('itemId') + "&from=" + loadAmount + "&scroll=" + document.body.scrollTop + "&which=" + index;
                })
            })
        }
    }
    function ajax_fail2(){
        console.log("投资组合加载失败");
        $(".loadMore").html("<span class='loadMoretxt'>加载失败，点击重新加载</span>");
        $(".loadMore .loadMoreImg").on("click",function(){
            $(".loadMore .loadMoreImg").remove();
            $(".loadMore .loadMoretxt").remove();
            $(".loadMore").html("<img src='img/loading.gif' class='loadMoreImg'><span class='loadMoretxt'>加载中……</span>");
            InvestGroupsOnclick02();
        });
    }
}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.removeItem("pageNumIG");
    sessionStorage.removeItem("pageScrollIG");
    sessionStorage.removeItem("dataIG1");
    Gotoback();
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');

}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },0);
}