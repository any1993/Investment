//文章详情页js文件
var myScroll;
var pullUpEl, pullUpL;
var loadingStep = 0;
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var db;
var UserStatus = "unlogin";
var SearchKey = GetQueryString("SearchKey");
var SearchCount = 0, SearchFrom = 0, SearchSize = 10;
// var FfromPage = GetQueryString("FfromPage");
$(function () {
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //function onDeviceReady() {
    //    document.addEventListener('pause', onPause.bind(this), false);
    //    document.addEventListener('resume', onResume.bind(this), false);
    //    jpushEffect();
    //    $("#collectlist").css("min-height", $(window).height());
    //    function onPause() {
    //        //此应用程序已被暂停。保存应用程序状态
    //        jpushEffect();
    //    };
    //
    //    function onResume() {
    //        //此应用程序已被重新激活。恢复应用程序的状态
    //        jpushEffect();
    //        window.location.reload();
    //    };
        setTimeout(function () {
            Touch();
            //db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
            //    db.transaction(function (tx) {
            //        SelectUser(tx);
            //    }, function (err) {
            //        // alert('Open database my.db ERROR1: ' + err.message);
            //    });
            //});
        }, 200);
    bind();
    //}
})
function SelectUser(tx) {
    tx.executeSql("select * from User", [], function (tx, res) {
        if (res.rows.length == 0) {
            var type = "0", nickName = "";
            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success1, ajax_fail1);
            function ajax_success1(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    UserID = obj;
                    UserStatus = "unlogin";
                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO User (id, LoginState, DeviceUserID) VALUES (?,?,?)", [1, "0", UserID], function (tx, res) {
                            //alert("插入设备登录信息成功");
                            bind();
                        });
                    }, function (err) {
                        // alert('Open database my.db ERROR4: ' + err.message);
                    });
                }
                else {
                    //下拉时获取指数为空
                }
            }
            function ajax_fail1() {
                //下拉时获取指数失败
            }
        }
        else {
            if (res.rows.item(0).LoginState == "0") {
                UserID = res.rows.item(0).DeviceUserID;
                UserStatus = "unlogin";
                bind();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    bind();
                }
            }

        }
    });
}
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    touchback();
    window.onscroll = function () {
        runing();
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
            if (loadingStep == 0 && $('#loading').hasClass('Page') && $('#no_result').length <= 0 && $('#refesh').length <= 0) {
                loadingStep = 1;
                $("#pullUp").removeClass("Page");
                $("#pullUp .pullUpLabel").html("加载中...");
                UpAjax();
            }
        }
    }
}
// function touchStartMore() {
//     pullUpAction();
// }
function touchStartBack(event) {
    event.preventDefault();
    //延时只用在模拟器中
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    Gotoback();
}
function bind() {
    // $("#pullUp").removeClass("Page");
    setTimeout(function () {
        var strlist = '';
        httpGet("Reader/Search?keyword=" + SearchKey + "&userID=" + UserID + "&from=" + SearchFrom + "&size=" + SearchSize + "&version=" + NowVerision, "", true, ajax_success2, ajax_fail2);
        function ajax_success2(obj) {
            if (obj.Items != null && obj.Items != "" && obj.Items != undefined) {
                SearchCount = obj.Count;
                for (var i = 0; i < obj.Items.length; i++) {
                    bind_list(obj.Items[i]);
                }
                $("#loading").addClass("Page");
                runing();
                SearchFrom = parseInt(SearchFrom) + parseInt(obj.Items.length);
                // document.getElementById("pullUp").addEventListener("touchstart", touchStartMore, false);
                // $("#pullUp .pullUpLabel").html("点击，加载更多");
            }
            else {
                $("#loading").addClass("Page");
                $('#collectlist').append('<div id="no_result" style="padding-top:100px"><img style="width:130px; padding:10px 0;" src="images/no_collect.png"/></div><div style="color:#999">没有搜索文章</div>');
            }
        }
        function ajax_fail2() {
            // $("#pullUp").addClass("Page");
            $("#loading").addClass("Page");
            $(".mycoll-page").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
            $("#refesh").bind("click", function (event) {
                $("#refesh").remove();
                bind();
            })
        }
    }, 500);

}
//从前端数据库取数据往下添加
function bind_list(obj) {
    var strhot = '', strlist = '';
    strlist = '<li id="' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" value="' + obj.Type + '"><div class="smallPic-title"><p>' + obj.Title + '</p></div><div class="smallPic-img"><img class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
    if (getDateInOneHour(obj.PubDate)) {
        strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
    }
    else {
        strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
    }
    if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined && obj.Tag != "null") {
        var tag = obj.Tag.split(",");
        for (var j = 0; j < tag.length; j++) {
            if (tag[j].indexOf(":") != -1) {
                strlist += '<span class="tag-label">' + tag[j].substring(0, tag[j].indexOf(":")) + '</span>';
            }
            else {
                strlist += '<span class="tag-label">' + tag[j] + '</span>';
            }
        }
    }
    strlist += '</span></div></a></div></div></div></li>';
    $('#collectlist').append(strlist);
    bind_indexlist(obj.Id);
}
//绑定收藏列表的点击事件
function bind_indexlist(id) {
    $("#" + id).bind("click", function () {
        var myDate = new Date();
        var newsType = $(this).find('.type').val();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: newsType }; //用户进入文章行为需要传的参数
        GotoNews(BehaviorLogData, id, newsType);
    })
}
function GotoNews(BehaviorLogData, id, newsType) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType);
        // slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType + '&fromPage=searchResult&SearchKey=' + encodeURI(SearchKey + '&FfromPage=' + FfromPage));
    }
    function ajax_fail3() {
        ajax_success3();
    }
}
function UpAjax() {
    httpGet("Reader/Search?keyword=" + SearchKey + "&userID=" + UserID + "&from=" + SearchFrom + "&size=" + SearchSize + "&version=" + NowVerision, "", true, ajax_success4, ajax_fail4);
    function ajax_success4(obj) {
        if (obj.Items != null && obj.Items != "" && obj.Items != undefined) {
            SearchCount = obj.Count;
            for (var i = 0; i < obj.Items.length; i++) {
                bind_list(obj.Items[i]);
            }
            runing();
            SearchFrom = parseInt(SearchFrom) + parseInt(obj.Items.length);
            $("#pullUp").addClass("Page");
            loadingStep = 0;
            // $("#pullUp .pullUpLabel").html("点击，加载更多");
            // document.getElementById("pullUp").addEventListener("touchstart", touchStartMore, false);
        }
        else {
            $("#pullUp .pullUpLabel").html("无更多数据");
            setTimeout(function () {
                $("#pullUp").addClass("Page");
                loadingStep = 0;
            }, 1000);
            // document.getElementById("pullUp").removeEventListener("touchstart", touchStartMore, false);
        }
    }
    function ajax_fail4(netStatus) {
        $("#pullUp .pullUpLabel").html("获取失败，请重试");
        // document.getElementById("pullUp").addEventListener("touchstart", touchStartMore, false);
        if (netStatus == "abort") {
            window.plugins.toast.show("无网络，请检查网络后重试", 500, "center");
        }
        else {
            if (netStatus == "timeout") {
                window.plugins.toast.show("网络超时，请检查网络后重试", 500, "center");
            }
            else {
                if (netStatus == "error") {
                    window.plugins.toast.show("获取失败，稍后重试", 500, "center");
                }
            }
        }
        $("#pullUp").addClass("Page");
        loadingStep = 0;
    }
}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
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
    $("body").on("touchmove", function (e) {
        runing();
    })
    $("body").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            Gotoback();
        }
    });
}
//列表页所有图片随屏滚动显示
function runing() {
    ////alert("runing");
    var $winH = $(window).height();//获取窗口高度
    var $img = $(".infoList img");
    var $imgH = parseInt($img.height() / 100);//图片到一半的时候显示
    var $srcDef = "a.gif";

    $img.each(function (i) {//遍历img
        if ($img.eq(i).attr("src") == "images/news_default.png" || $img.eq(i).attr("src") == "images/hot_default.png") {//如果图片加载失败,用我们的备用图
            var $src = $img.eq(i).attr("original");//获取当前img URL地址
            var $scroTop = $img.eq(i).offset();//获取图片位置
            if ($scroTop.top + $imgH >= $(window).scrollTop() && $(window).scrollTop() + $winH >= $scroTop.top + $imgH) {//判断窗口至上往下的位置
                if ($img.eq(i).attr("src") == $srcDef) {
                    $img.eq(i).hide();
                }
                //$img.eq(i).attr("src", function () { return $src }).fadeIn(300);//元素属性的交换  zepto没有fadeIn和fadeOut
                $img.eq(i).attr("src", $src);
            }
        }
    })
}