//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var pointId = GetQueryString("pointId");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var AccessToken;
var newsSummary = "";
var HPushDate = new Array();
$(function () {
    Touch();
    bind_info();
})
function Touch() {
    touchback();
    // touchStartInfo("info-button");
    // touchStartShare("share-button");
    // touchstartCollect("collect-button");
    //返回按钮
    $("#icon-back").bind("click", function () {
        Gotoback();
    });

}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//从前端数据库或者服务器去取数据
function bind_info() {
    httpGet("Reader/ItemDetailInfo?type=0&itemID=" + pointId, "", true, ajax_success1, ajax_fail1);
}
function ajax_success1(obj) {
    var strlist = '';
    if (obj != null && obj != "" && obj != undefined) {
        $('#info-title').html(obj.Title);
        $('#point-img').attr("src", obj.AuthorImage);
        $('#point-timer').html(getDateDiff(GetTimeRegular(obj.PubDate)));
        $('#info-mediaName').html(obj.AuthorName);
        //摘要赋值
        if (obj.Summary != null && obj.Summary != "") {
            newsSummary = obj.Summary[0];
        }
        $('#info-htmltext').html(obj.HtmlText);

        infoHTMLimg();
        infoHTMLimgattr();
    }
    else {
        //文章获取为空
    }

}
function ajax_fail1() {
    //文章获取为空
}
//手指滑动返回上一个页面
function touchback() {
    var screenWidth = document.documentElement.clientWidth;
    var yScrolls, yScrolle;
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
        // $("#info-htmltext").prepend("yScrolls："+yScrolls+" && "+"yScrolle："+yScrolle);
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            Gotoback();
        }
    });
}
