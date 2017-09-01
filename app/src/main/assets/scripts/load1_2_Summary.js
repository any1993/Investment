/**
 * Created by aa on 2016/8/9.
 */

var ItemId = GetQueryString("itemId");
var StockId = GetQueryString("stockID");
var AgencyID = GetQueryString("AgencyID");
var AuthorName = GetQueryString("authorName");
var pageScroll=parseInt(GetQueryString("scroll"));


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


    RateInfoOnload();
}


function RateInfoOnload(){
    //个股详情信息
    httpGet("Reader/RateInfo?RateId="+encodeURI(ItemId),"",true,ajax_success00,ajax_fail00);
    function ajax_success00(obj){
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined ){
            //$(".ReportDetails .PubDate").eq(j).text(obj[j].PubDate.substring(2,10));
            $(".SummaryBox .Summary").text("报告摘要："+obj.Summury);
            $(".SummaryBox .AgencyName").text("研究机构："+obj.AgencyName);
            $(".SummaryBox .Author").text("研究员："+obj.Author);
            $(".SummaryBox .StockNameOfSummary").text("股票名称："+obj.StockName);
            $(".SummaryBox .StockIDOfSummary").text("股票代码："+stocksIdTransform(obj.StockId));
        }else{
            $(".SummaryBox .Summary").text("该报告无摘要详情。");
        }
        loadend();

    }
    function ajax_fail00(){
        console.log("加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            RateInfoOnload();
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
    //window.location.href = 'tool1_1_Researcher.html?itemId='+AgencyID+'&authorName='+encodeURI(AuthorName)+'&stockID='+StockId+'&foreScroll='+pageScroll;
    //slide('right', 'lightblue', 1, 'tool1_1_Researcher.html?itemId='+AgencyID+'&authorName='+encodeURI(AuthorName)+'&stockID='+StockId+'&foreScroll='+pageScroll);
}

function loadend(){
    $(".loading").css("display", "none");
}