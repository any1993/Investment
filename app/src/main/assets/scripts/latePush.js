//晚推送页面js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var category = "night";
// var AccessToken;
var pointTime = GetQueryString("pointTime");
var scrollTop = GetQueryString("scrollTop");
var pointDate;
var PushSummary = "";
$(function () {
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //function onDeviceReady() {
    //    document.addEventListener('pause', onPause.bind(this), false);
    //    document.addEventListener('resume', onResume.bind(this), false);
    //    jpushEffect();
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

            //pointDate = getDateStrA(pointTime);
            //db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
            //    db.transaction(function (tx) {
            //        SelectUser(tx);
            //    }, function (err) {
            //        alert('Open database my.db ERROR1: ' + err.message);
            //    });
            //});
        }, 200);
    //}

    bind_info();
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
                            bind_info();
                        });
                    }, function (err) {
                        alert('Open database my.db ERROR4: ' + err.message);
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
                bind_info();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    bind_info();
                }
            }

        }
    });
}
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    touchback();
    window.onscroll = function () {
        runing();
    }
}
//晚推送新闻显示
function bind_info() {
    if (pointTime == null) {
        pointTime = new Date().getTime();
    }
    httpGet("Reader/Articles?userID=" + UserID + "&count=10&category=" + category + "&dateTime=" + pointTime + "&authorName=&version=" + NowVerision, "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        $(".late-page").removeClass("Page");
        $("#loading").remove();
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                PushSummary = obj[0].Title;
                var strlist = "";
                strlist = '<li id="' + obj[i].Id + '"><input type="hidden" value="' + obj.Type + '" class="type"><div class="latenewsimg"><img class="cover" src="images/late_default.png" original="http://www.taikorcdn.com/reader/' + obj[i].ImageUrl + '"  onerror="this.src=' + "'images/late_error.png'" + '"><div class="maskimg"><img src="images/Mask1.png"></div><div class="last-title"><p>' + obj[i].Title + '</p></div></div><div class="last-tab">';
                if (obj[i].Tag != "" && obj[i].Tag != null && obj[i].Tag != undefined) {
                    var tag = obj[i].Tag.split(",");
                    for (var j = 0; j < tag.length; j++) {
                        strlist += '<span>' + tag[j].substring(0, tag[j].indexOf(":")) + '</span>';
                    }
                }
                if (obj[i].Summary != null && obj[i].Summary != "" && obj[i].Summary.length != 0) {
                    strlist += '</div><div class="last-summary Page">' + obj[i].Summary[0] + '</div></li>';//晚推送的摘要不显示
                }
                $("#last-news").append(strlist);
                bind_indexlist(obj[i].Id);
            }
            runing();
        }
        else {
            $("#last-news").addClass("last-nonews");
            $("#last-news").append('<div style="padding-top:100px"><img style="width:130px; padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">没有晚推送文章</div>');
        }
        
    }
    function ajax_fail2() {
        $("#loading").remove();
        $(".late-page").after('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $('#refesh').remove();
            $(".late-page").after('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
            // $("#loading").remove();
            bind_info();
        })
    }
    touchBottom();
}
function GotoNews(BehaviorLogData, id, newsType) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        AddGoback(localStorage.N_url + '&scrollTop=' + $(window).scrollTop(), 'newsInfo.html?itemid=' + id + '&newsType=' + newsType);
    }
    function ajax_fail3() {
        //下拉时获取指数失败
        ajax_success3();
    }
}
//绑定首页每个资讯的事件
function bind_indexlist(id) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        //资讯
        var myDate = new Date();
        var newsType = $(this).find('.type').val();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: newsType }; //用户进入文章行为需要传的参数
        GotoNews(BehaviorLogData, id, newsType);
    })
}
function touchStartBack(event) {
    event.preventDefault();
    // slide('right', 'lightblue', 1, 'index.html?firstLoad=no');
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    // slide('right', 'lightblue', 1, 'index.html?firstLoad=no');
    Gotoback();
}
//获取URL的网址
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//列表页所有图片随屏滚动显示
function runing() {
    var $winH = $(window).height();//获取窗口高度
    var $img = $("#last-news img");
    var $imgH = parseInt($img.height() / 100);//图片到一半的时候显示
    var $srcDef = "a.gif";

    $img.each(function (i) {//遍历img
        if ($img.eq(i).attr("src") == "images/news_default.png" || $img.eq(i).attr("src") == "images/hot_default.png" || $img.eq(i).attr("src") == "images/late_default.png") {//如果图片加载失败,用我们的备用图
            var $src = $img.eq(i).attr("original");//获取当前img URL地址
            var $scroTop = $img.eq(i).offset();//获取图片位置
            if ($scroTop.top + $imgH >= $(window).scrollTop() && $(window).scrollTop() + $winH >= $scroTop.top + $imgH) {//判断窗口至上往下的位置
                if ($img.eq(i).attr("src") == $srcDef) {
                    $img.eq(i).hide();
                }
                //$img.eq(i).attr("src", function () { return $src }).fadeIn(300);//元素属性的交换  zepto没有fadeIn和fadeOut
                $img.eq(i).attr("src", $src);
                //$img.eq(1).attr("src", "images/aa.png");
            }
        }
    })
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
            // slide('right', 'lightblue', 1, 'index.html?firstLoad=no');
            Gotoback();
        }
    });
}
//分享操作
function touchStartShare(event) {
    event.preventDefault();
    document.getElementById("icon-share").removeEventListener("touchstart", touchStartShare, false);
    $("#late-page").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
    $("#cover").after('<div id="share-box" class="share-box"><div class="share-icon"><div class="share-half share-top"><ul><li id="wechatFrd-button"><div class="share-pic"><img src="images/share/icon-frie.png"></div><div class="share-word">朋友圈</div></li><li id="wechat-button"><div class="share-pic"><img src="images/share/icon-wec.png"></div><div class="share-word">微信</div></li><li id="weibo-button"><div class="share-pic"><img src="images/share/icon-weibo.png"></div><div class="share-word">新浪微博</div></li></ul></div><div class="share-half"><ul><li id="sms-button"><div class="share-pic"><img src="images/share/icon-sms.png"></div><div class="share-word">短信</div></li><li id="copy-button"><div class="share-pic"><img src="images/share/icon-link.png"></div><div class="share-word">复制链接</div></li><li id="refresh-button"><div class="share-pic"><img src="images/share/icon-refr.png"></div><div class="share-word">刷新</div></li></ul></div></div><div style="height:8px"></div><div id="share-cancel" class="share-cancel">取消</div></div>');
    $("#share-box").animate({ bottom: "0" }, 500);
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
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
        document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    });
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: '布尔财经：' + PushSummary,
            description: PushSummary,
            thumb: "http://www.taikorcdn.com/reader/images/icon.png",
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/latePush.html?pointTime=" + pointTime,    // webpage
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
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
        document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    });
    //摘要的第一句作为描述
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: pointDate + '布尔晚餐',
            description: PushSummary,
            thumb: "http://www.taikorcdn.com/reader/images/icon.png",
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/latePush.html?pointTime=" + pointTime,    // webpage
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
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
        document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    });
    var args = {};
    args.url = "http://m.boolcj.com/latePush.html?pointTime=" + pointTime;
    args.title = pointDate + '布尔晚餐';
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
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
        document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    });
    window.plugins.socialsharing.shareViaSMS("http://m.boolcj.com/latePush.html?pointTime=" + pointTime, null /* see the note below */, function (msg) {
        window.plugins.toast.showShortBottom("短信分享成功");

    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    })
}
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    cordova.plugins.clipboard.copy("http://m.boolcj.com/latePush.html?pointTime=" + pointTime, function (msg) {
        window.plugins.toast.showShortBottom("复制链接成功");
        $("#share-box").animate({ bottom: "-335px" }, 500, function () {
            $("#cover").remove();
            $("#share-box").remove();
            document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
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
        document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    });
}
//滑动到底部
function touchBottom() {
    $(window).scroll(function () {
        // $(window).unbind('scroll');
        if ($(this).scrollTop() + $(this).height() == $(document).height()) {
            $('.go_bottom').removeClass('Page');
        }
        else {
            if ($(this).scrollTop() + $(this).height() + 60 <= $(document).height()) {
                $('.go_bottom').addClass('Page');
            }
        }
    })
}