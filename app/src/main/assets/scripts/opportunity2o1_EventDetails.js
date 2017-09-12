/**
 * Created by aa on 2016/4/25.
 */
var AccessToken;
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var db;
var ItemId = GetQueryString("itemId");
var HeatValue = [0, 0, 0, 0, 0];
var option_e1_01 = {};
var myDate = new Date(); //获取今天日期
var dateArray = [];
var dateTemp;
var backTo = GetQueryString("from");
var ScrollMain = parseInt(GetQueryString("scroll"));
var thisScroll = parseInt(GetQueryString("thisScroll"));
var tagSelect = parseInt(GetQueryString("tagSelect"));

var PushTitle = "";
var PushSummary = "";
var PushImgUrl = "http://www.taikorcdn.com/reader/images/icon.png";

$(function () {
    FastClick.attach(document.body);
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    pageOnload();
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
    //pageOnload();
    window.onresize = function () {
        var banderHeight=$(".event_img").width();
        banderHeight = Math.round(banderHeight*0.72);
        if( banderHeight >= 400){
            banderHeight = 400;
        }
        $(".event_imgband").css("height",banderHeight+"px");
    }
});

function pageOnload() {
    var screenWidth = document.documentElement.clientWidth;
    var yScrolls, yScrolle, startX, startY, moveEndX, moveEndY, X, Y;
    $("body").on("touchstart", function (e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("body").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        // if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && ((X > (screenWidth * 0.33)) || startX < 10)) {
        //     if(backTo == -1){
        //         window.location.href = 'index.html'+'?scroll='+ScrollMain;
        //         //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+ScrollMain);
        //         //parent.location='index.html';
        //     }else{
        //         window.location.href = 'opportunityPage2_Events.html?tagLt='+backTo+'&scroll='+ScrollMain+'&thisScroll='+thisScroll+'&tagSelect='+tagSelect;
        //         //slide('right', 'lightblue', 1, 'opportunityPage2_Events.html?tagLt='+backTo+'&scroll='+ScrollMain+'&thisScroll='+thisScroll+'&tagSelect='+tagSelect);
        //         //parent.location='opportunityPage2_Events.html?tagLt='+backTo;
        //     }
        // }
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {

            Gotoback();
            //if (window.history.length == 1) {
            //    window.location.href = 'index.html';
            //}
            //else {
            //    window.history.back();
            //}
        }
    });
    $("#url_close").bind("click", function () {
        $("#url_blank,#urlApp").remove();
    });
    $("#url_open").bind("click", function () {
        // window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.taikor.news';
        window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.taikor.news');
    });

    //pageLocationChange 1
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    //document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    document.addEventListener("backbutton", touchBack, false);
    myDate.setDate(myDate.getDate() - 4);
    for (var i = 0; i < 7; i++) {
        //if(myDate.getDay() == 6 || myDate.getDay() == 0){
        //    myDate.setDate(myDate.getDate() + 1);
        //}else{}
        dateTemp = (myDate.getMonth() + 1) + "-" + myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + 1);
    }

    //加载事件详情
    EventOnload();

    $(".eventDetails,.event_img,.event_imgband").css("height", (document.documentElement.clientWidth * 200/375) + "px");
    window.addEventListener("resize", function() {
        $(".eventDetails,.event_img,.event_imgband").css("height", (document.documentElement.clientWidth * 200/375) + "px");
    });

}

//加载事件详情
function EventOnload() {
    var myChartE_P1 = echarts.init(document.getElementById('chart_E1_01'));

    httpGet("Reader/Event?eventID=" + ItemId, "", true, ajax_success01, ajax_fail01);
    function ajax_success01(obj) {
        //console.log(obj);
        if (obj != null && obj != "" && obj != [] && obj != undefined) {
            if (obj.Type != null && obj.Type != "") {
                $(".event_tag").text(obj.Type);
                $(".event_tag").css("display", "block");
            } else {
                $(".event_tag").css("display", "none");
            }
            if (obj.Article != null && obj.Article != "") {
                $(".event_img").attr("src", "http://www.taikorcdn.com/reader/" + obj.Article.ImageUrl);
                PushImgUrl = "http://www.taikorcdn.com/reader/"+obj.Article.ImageUrl;
                $(".eventDetailsTitle").text(obj.Article.Title);
                PushTitle=obj.Article.Title;
                
		$(".eventDetailsDate").text("追踪："+timeDetails(obj.FirstAppear, obj.LastAppear));
                //$(".eventDetailsDate").text(obj.Article.PubDate);
                //$(".eventDetailsMedia").text(obj.Article.MediaName);

                if (obj.Article.Summary != null && obj.Article.Summary != "") {
                    var abstractAmount = obj.Article.Summary.length;
                    for (var an = 0; an < abstractAmount; an++) {
                        $(".abstractBox").append(" <div class='abstractText'> " +
                        "<span>" + obj.Article.Summary[an] + "</span> </div>");

                        if (abstractAmount >= 1) {
                            PushSummary = obj.Article.Summary[0];
                        }
                    }
                }
            } else {
                $(".event_img").css("display", "none");
                $(".event_tag").css("display", "none");
                $(".event_imftxt").css("display", "none");
            }
            if (obj.Tag == null || obj.Tag == "") {
                $(".taglist").css("display", "none");
                $(".taglistClear").css("display", "none");
            } else {
                for (var i = 0; i < obj.Tag.length; i++) {
                    if (i >= 3) { break }
                    $(".taglist").append("<div>" + obj.Tag[i] + "</div>");

                }
            }

            var chartTopic = "";

            if (obj.RelateArticles != null && obj.RelateArticles != "" && obj.RelateArticles != []) {
                for (var an = 0; an < obj.RelateArticles.length; an++) {
                    $(".eventsAboutBox").append("<div class='eventsAbout' itemId='" + obj.RelateArticles[an].Id + "'> <span class='eventsTitle'></span> <span class='issueTime'></span> </div>");
                    $(".eventsAboutBox .eventsTitle").eq(an).text(obj.RelateArticles[an].Title);
                    $(".eventsAboutBox .issueTime").eq(an).text(getDateDiff(obj.RelateArticles[an].PubDate));
                }
            } else {
                $(".eventsArticles").css("display", "none");
            }




            if (obj.Article == null || obj.Article == "" || obj.Article == []) {
                $(".eventDetails").css("display", "none");
                $(".eventsArticles").css("display", "none");
            }

            if (obj.Topic != null && obj.Topic != "" && obj.Topic != []) {
                $(".HotValue").text(obj.Topic.HotValue);
                $(".SpeedValue").text(obj.Topic.SpeedValue);
                $(".TopicName").text(obj.Topic.TopicName);
                chartTopic = obj.Topic.TopicName;

                $(".Subordinate").attr("itemID", obj.Topic.TopicId);
                if (obj.Topic.Summury != null && obj.Topic.Summury != "") {
                    $(".Summury").text(obj.Topic.Summury);
                } else {
                    $(".Summury").text("暂无主题概述内容");
                }

                if( obj.Topic.Changepercent != undefined && obj.Topic.Changepercent != null ){
                    if( obj.Topic.Changepercent >0 ){
                        $(".Subordinate .percentageOfTopic").text("+"+returnFloat(obj.Topic.Changepercent)+"%");
                    }else if( obj.Topic.Changepercent  <= 0 ){
                        $(".Subordinate .percentageOfTopic").text(returnFloat(obj.Topic.Changepercent)+"%");
                    }
                }else{
                    $(".Subordinate .percentageOfTopic").text("--.--%");
                }

                if (obj.Topic.Stocks != null && obj.Topic.Stocks != [] && obj.Topic.Stocks != "") {
                    for (var s = 0; s < obj.Topic.Stocks.length; s++) {
                        if (s >= 3) { break; }
                        $(".RelateStocks" + (s + 1)).text(obj.Topic.Stocks[s].Stock.Name);
                    }
                    $(".PubDate").text(getDateDiff(dateTrans(obj.Topic.Stocks[0].Stock.Ticktime)));
                }
                $(".Subordinate").css("display", "block");
            } else {
                $(".Subordinate").css("display", "none");
            }

            if (obj.RelateStocks != null && obj.RelateStocks != "") {
                var sharesAboutAmount = obj.RelateStocks.length;
                var stocklist = "";
                for (var an = 0; an < sharesAboutAmount; an++) {
                    $(".sharesTable").append("<tr class='sharesItems'> <td class='ItemTitleBox'> " +
                    "<span class='eventSharesName'>股票名称</span> " +
                    "<span class='eventSharesCode'></span>" +
                    "<span class='eventSharesAbout'></span></td> " +
                    "<td class='ItemPrice'></td> " +
                    "<td class='raf'>±0.00%</td> " +
                    "<td class='StockVolume'></td> " +

                    //"<td><span class='percentageNum'>0%</span> " +
                    //"<div class='percentageBox'><div class='flexlength'></div> </div> </td> " +
                    "</tr>");
                    $(".sharesTable .eventSharesName").eq(an).text(obj.RelateStocks[an].Stock.Name);
                    $(".sharesTable .eventSharesName").eq(an).attr("itemId", obj.RelateStocks[an].Stock.Symbol);
                    $(".sharesTable .eventSharesCode").eq(an).text(obj.RelateStocks[an].Stock.Code);
                    //$(".sharesTable .eventSharesAbout").eq(an).text(obj.RelateStocks[an].BlockID);
                    stocklist += obj.RelateStocks[an].Stock.BlockID + ",";
                    $(".sharesTable .ItemPrice").eq(an).text(returnFloat(obj.RelateStocks[an].Stock.Trade));

                    $(".sharesTable .StockVolume").eq(an).text(obj.RelateStocks[an].Stock.Volume);
                    if (obj.RelateStocks[an].Stock.Changepercent >= 0) {
                        $(".sharesTable .raf").eq(an).text("+" + returnFloat(obj.RelateStocks[an].Stock.Changepercent) + "%");
                    } else {
                        $(".sharesTable .raf").eq(an).text(returnFloat(obj.RelateStocks[an].Stock.Changepercent ) + "%");
                        $(".sharesTable .raf").eq(an).css("color", "#20c062");
                    }
                    //var percentageNum = (Math.round(obj.RelateStocks[an].Relativity * 10000) / 100);
                    //$(".sharesTable .percentageNum").eq(an).text(percentageNum + "%");
                    //$(".sharesTable .flexlength").eq(an).css("width", percentageNum + "%");
                }
            } else {
                $(".StocksBox").css("display", "none");
            }

            $(".sharesTable .eventSharesName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    //console.log("股票"+$(this).attr("itemId")+"暂无详情页");
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId")+"&from="+backTo+"&scroll="+document.body.scrollTop);
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=eventDetails&eventID="+ItemId+"&from="+backTo+"&scroll="+document.body.scrollTop;
                    //slide('left','lightblue',1,'stock.html?stockId="+$(this).attr("itemId")+"&fromPage=billboard');
                })
            });



            httpGet("Reader/Blocks?blockIds=" + stocklist, "", true, ajax_successBs, ajax_failBs);
            function ajax_successBs(objs) {
                if (objs != null && objs != "" && objs != [] && objs != undefined) {
                    for (var as = 0; as < sharesAboutAmount; as++) {
                        $(".sharesTable .eventSharesAbout").eq(as).text(objs[as].Name);
                    }
                } else {
                    $(".sharesTable .eventSharesAbout").eq(an).text("");
                }
            }
            function ajax_failBs() {
                $(".sharesTable .eventSharesAbout").eq(an).text("");
                console.log("版块信息加载失败")
            }


            //HeatValue=(obj.Topic.HistoryHot).concat(obj.Topic.FutureHot);
            if (obj.HotHistory != null && obj.HotHistory != "") {
                for (var h = 0; h < obj.HotHistory.length; h++) {
                    for (var d = 0; d < dateArray.length; d++) {
                        if (dateArry(obj.HotHistory[h].date) == dateArray[d]) {
                            HeatValue[d] = obj.HotHistory[h].hotness;
                        }
                    }
                }
            }
            if( obj.HotHistory.length <=1){
                $(".ChartDisplay").css("display","none");
            }

            option_e1_01 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b} : {c}"
                },
                legend: {
                    data: [chartTopic + "热度变化"],
                    x: 'right',
                    y: 20,
                    itemHeight: 6,
                    itemWidth: 10,
                    textStyle: { fontSize: 12 }
                },
                calculable: true,
                grid: { x: 30, y: 50, x2: 20, y2: 40 },
                xAxis: [
                    {
                        type: 'category',
                        splitLine: { show: false },
                        axisLabel: { show: true },
                        boundaryGap: [100, 100],
                        data: dateArray
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            textStyle: { fontSize: 12 }
                        },
                        scale: true
                    }
                ],
                series: [
                    {
                        name: chartTopic + '热度变化',
                        type: 'bar',
                        barWidth: 30,
                        data: HeatValue,
                        itemStyle: {
                            width: 30,
                            normal: {
                                //color:function(params){
                                //    var colorlist = ['#ffcc44','#ffcc44','#ffcc44','#ffcc44','#ffcc44','#ffeeaa','#ffeeaa'];
                                //    return colorlist[params.dataIndex]
                                //},
                                color: '#FACD36',
                                areaStyle: { type: 'default' }
                            }
                        }
                    }
                ]
            };
            //pageLocationChange
            $(".eventsAbout").each(function () {
                $(this).on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=1&from=' + backTo);
                    //window.location.href = 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=1&fromPage=eventDetail&eventId=' + ItemId + '&from=' + backTo;
                    //slide('left','lightblue',1,'newsInfo.html?itemid='+$(this).attr("itemId")+'&newsType=1&fromPage=eventDetail&eventId='+ItemId+'&from='+backTo);
                    //parent.location="newsInfo.html?itemid="+$(this).attr('itemId')+"&newsType=1&fromPage=eventDetail&eventId="+ItemId+"&from="+backTo;
                })
            });

            $(".Subordinate").each(function () {
                $(this).on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId=' + $(this).attr('itemId') + '&tagfrom=' + backTo);
                    //window.location.href = 'opportunityPage3o1_TopicDetails.html?itemId=' + $(this).attr('itemId') + '&from=' + ItemId + '&tagfrom=' + backTo;
                    //slide('left','lightblue',1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr('itemId')+'&from='+ItemId+'&tagfrom='+backTo);
                    //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from="+ItemId+"&tagfrom="+backTo;
                })
            });

            myChartE_P1.setOption(option_e1_01);
            $(".loading").css("display", "none");
            if (ItemId == "null" || ItemId == "undefined" || ItemId == "" || ItemId == " ") {
                $(".mainbox").css("display", "none");
                $(".unDatalog").css("display", "block");
            }

            //var banderHeight=$(".event_img").width();
            //banderHeight = Math.round(banderHeight*0.72);
            //if( banderHeight >= 400){
            //    banderHeight = 400;
            //}
            //$(".event_imgband").css("height",banderHeight+"px");
        }
    }
    function ajax_fail01(){
        console.log("事件详情加载失败");
        $(".loading").html("<img src='images/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='images/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            EventOnload();
        });
    }
}


function touchBack(event) {
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    // if(backTo == -1){
    //     window.location.href = 'index.html'+'?scroll='+ScrollMain;
    //     //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+ScrollMain);
    //     //parent.location='index.html';
    // }else{
    //     window.location.href = 'opportunityPage2_Events.html?tagLt='+backTo+'&scroll='+ScrollMain+'&thisScroll='+thisScroll+'&tagSelect='+tagSelect;
    //     //slide('right', 'lightblue', 1, 'opportunityPage2_Events.html?tagLt='+backTo+'&scroll='+ScrollMain+'&thisScroll='+thisScroll+'&tagSelect='+tagSelect);
    //     //parent.location='opportunityPage2_Events.html?tagLt='+backTo;
    // }
    //if (window.history.length == 1) {
    //    window.location.href = 'index.html';
    //}
    //else {
    //    window.history.back();
    //}
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}



function touchStartShare(event) {
    event.preventDefault();
    $("body").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
    $("#cover").after('<div id="share-box" class="share-box"><div class="share-icon"><div class="share-half share-top"><ul><li id="wechatFrd-button"><div class="share-pic"><img src="images/icon-frie.png"></div><div class="share-word">朋友圈</div></li><li id="wechat-button"><div class="share-pic"><img src="images/icon-wec.png"></div><div class="share-word">微信</div></li><li id="weibo-button"><div class="share-pic"><img src="images/icon-weibo.png"></div><div class="share-word">新浪微博</div></li></ul></div><div class="share-half"><ul><li id="sms-button"><div class="share-pic"><img src="images/icon-sms.png"></div><div class="share-word">短信</div></li><li id="copy-button"><div class="share-pic"><img src="images/icon-link.png"></div><div class="share-word">复制链接</div></li><li id="refresh-button"><div class="share-pic"><img src="images/icon-refr.png"></div><div class="share-word">刷新</div></li></ul></div></div><div style="height:8px"></div><div id="share-cancel" class="share-cancel">取消</div></div>');
    $("#share-box").animate({ bottom: "0" }, 500);
    document.getElementById("icon-share").removeEventListener("touchstart", touchStartShare, false);
    document.getElementById("wechatFrd-button").addEventListener("touchstart", touchstartWechatFrd, false);
    document.getElementById("wechat-button").addEventListener("touchstart", touchstartWechat, false);
    document.getElementById("weibo-button").addEventListener("touchstart", touchstartWebo, false);
    document.getElementById("sms-button").addEventListener("touchstart", touchstartSms, false);
    document.getElementById("copy-button").addEventListener("touchstart", touchstartCopy, false);
    document.getElementById("refresh-button").addEventListener("touchstart", touchstartRefresh, false);
    document.getElementById("share-cancel").addEventListener("touchstart", touchstartCancel, false);
}

//分享到朋友圈
function touchstartWechatFrd(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: "布尔财经："+ PushTitle,
            description: PushSummary,
            thumb: PushImgUrl,
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://boolcj.taikor.com/opportunityPages/opportunityPage2o1_EventDetails.html?itemId="+ItemId// webpage
            }
        },
        scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, function () {
        window.plugins.toast.showShortBottom("朋友圈分享成功");
    }, function (reason) {
        window.plugins.toast.showShortBottom("朋友圈分享取消");
    });
}
//微信分享文章
function touchstartWechat(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });

    //摘要的第一句作为描述
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: PushTitle,
            description: PushSummary,
            thumb: PushImgUrl,
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://boolcj.taikor.com/opportunityPages/opportunityPage2o1_EventDetails.html?itemId="+ItemId
                // webpage
            }
        },
        scene: Wechat.Scene.SESSION   // share to SESSION
    }, function () {
        window.plugins.toast.showShortBottom("微信朋友分享成功");
    }, function (reason) {
        window.plugins.toast.showShortBottom("微信朋友分享取消");
    });
}
//微博分享文章
function touchstartWebo(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);

    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    var args = {};
    args.url = "http://boolcj.taikor.com/opportunityPages/opportunityPage2o1_EventDetails.html?itemId="+ItemId;
    args.title = PushTitle;
    args.description = PushSummary;
    args.imageUrl = "http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png";//if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png will be the defualt one
    args.defaultText = "";
    YCWeibo.shareToWeibo(function () {
        window.plugins.toast.showShortBottom("微博分享成功");
    }, function (failReason) {
        window.plugins.toast.showShortBottom("微博分享取消");
    }, args);
}
//短信分享文章
function touchstartSms(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);

    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.plugins.socialsharing.shareViaSMS("http://boolcj.taikor.com/opportunityPages/opportunityPage2o1_EventDetails.html?itemId="+ItemId, null /* see the note below */, function (msg) {
        window.plugins.toast.showShortBottom("短信分享成功");

    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    });
}
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);

    cordova.plugins.clipboard.copy("http://boolcj.taikor.com/opportunityPages/opportunityPage2o1_EventDetails.html?itemId="+ItemId, function (msg) {
        window.plugins.toast.showShortBottom("复制链接成功");
        $("#share-box").animate({ bottom: "-335px" }, 500, function () {
            $("#cover").remove();
            $("#share-box").remove();
        });
    }, function (msg) {
        window.plugins.toast.showShortBottom("复制链接失败，请重试");
    });
}
//文章刷新按钮
function touchstartRefresh(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.location.reload();
    window.plugins.toast.showShortBottom("刷新成功");
}
//文章取消分享按钮
function touchstartCancel(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 500, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
}