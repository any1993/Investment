//早推送页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var ItemId = GetQueryString("itemid");
var pointTime = GetQueryString("pointTime");
var category = "morning";
var scrollTop = GetQueryString("scrollTop");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var stockids = "sh000001,sz399001,sz399006,sz399005,sh000300,sh000016"; //大盘指数
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
            //        // Authorize(tx);
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
    // alert("测试pointTime=" + pointTime);
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    touchback();
}
function bind_info() {
    //显示早推送文章题目
    //if (ItemId != null) {
    //    db.transaction(function (tx) {
    //        tx.executeSql('select * from Item_list_' + UserStatus + ' where idd <= (select idd from Item_list_' + UserStatus + ' where ItemId=?) order by idd desc', [ItemId], function (tx, res) {
    //            if (res != null && res.rows != null && res.rows.length > 0) {
    //                PushSummary = res.rows.item(0).Title;
    //                //alert("idd：" + res.rows.item(0).idd);
    //                for (var i = 0; i < res.rows.length; i++) {
    //                    if (res.rows.item(i).Type == "2") {
    //                        $('#early-aritle ul').append('<li id="' + res.rows.item(i).ItemID + '"><input type="hidden" value="' + res.rows.item(i).Type + '" class="type"><div class="recommand-title"><p><img src="images/icon-circle.png">' + res.rows.item(i).Title + '</p></div><div class="recommand-img"><img src="images/icon_list_more@1x.png"></div></li>');
    //                        bind_indexlist(res.rows.item(i).ItemID);
    //                    }
    //                    else {
    //                        break;
    //                    }
    //                }
    //            }
    //        });
    //    }, function (err) {
    //        alert('Open database my.db ERROR7: ' + err.message);
    //    });
    //}
    //else {
        if (pointTime != null) {
            httpGet("Reader/Articles?userID=" + UserID + "&count=10&category=" + category + "&dateTime=" + pointTime + "&authorName=&version=" + NowVerision, "", true, ajax_success2, ajax_fail2);
            function ajax_success2(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    PushSummary = obj[0].Title;
                    for (var i = 0; i < obj.length; i++) {
                        $('#early-aritle ul').append('<li id="' + obj[i].Id + '"><input type="hidden" value="' + obj[i].Type + '" class="type"><div class="recommand-title"><p><img src="images/icon-circle.png">' + obj[i].Title + '</p></div><div class="recommand-img"><img src="images/icon_list_more@1x.png"></div></li>');
                        bind_indexlist(obj[i].Id);
                    }
                }
                else {
                    //下拉时获取指数为空
                }
            }
            function ajax_fail2() {
                //下拉时获取指数失败
            }
        }
    //}

    //显示早推送早盘指数
    var count = stockids.split(",");
    httpGet("Reader/Stocks?stockIds=" + stockids + "&sortType=0&count=" + count.length, "", true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        $(".early-page").removeClass("Page");
        $("#loading").remove();
        if (obj != null && obj != "" && obj != undefined) {
            var n = parseInt(obj.length / 3);
            if (n > 0) {
                var m = obj.length - 3 * n;
            }
            else {
                var m = obj.length;
                var z = 0;
            }
            for (var j = 0; j < n; j++) {
                $('#cpi-block').append('<li><ul id="cpi-left' + j + '" class="cpi-left"></ul><div class="clear"></div></li>');
                for (var z = j * 3; z < j * 3 + 3; z++) {
                    if (obj[z].Pricechange > 0) {
                        $('#cpi-left' + j).append('<li id="' + obj[z].Symbol + '"><p>' + obj[z].Name + '</p><p class="pointRed">' + obj[z].Trade.toFixed(2) + '</p><p class="pointRed"><span>+' + obj[z].Pricechange.toFixed(2) + '</span><span>+' + obj[z].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                    else {
                        $('#cpi-left' + j).append('<li id="' + obj[z].Symbol + '"><p>' + obj[z].Name + '</p><p class="point">' + obj[z].Trade.toFixed(2) + '</p><p class="point"><span>' + obj[z].Pricechange.toFixed(2) + '</span><span>' + obj[z].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                }
            }
            if (m > 0) {
                $('#cpi-block').append('<li><ul id="cpi-left' + n + '" class="cpi-left"></ul><div class="clear"></div></li>');
                for (var i = 0; i < m; i++) {
                    if (obj[z + i].Pricechange > 0) {
                        $('#cpi-left' + n).append('<li id="' + obj[z + i].Symbol + '"><p>' + obj[z + i].Name + '</p><p class="pointRed">' + obj[z + i].Trade.toFixed(2) + '</p><p class="pointRed"><span>+' + obj[z + i].Pricechange.toFixed(2) + '</span><span>+' + obj[z + i].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                    else {
                        $('#cpi-left' + n).append('<li id="' + obj[z + i].Symbol + '"><p>' + obj[z + i].Name + '</p><p class="point">' + obj[z + i].Trade.toFixed(2) + '</p><p class="point"><span>' + obj[z + i].Pricechange.toFixed(2) + '</span><span>' + obj[z + i].Changepercent.toFixed(2) + '%</span></p></li>');
                    }

                }
            }
        }
        else {
            //下拉时获取指数为空
        }
        // if (panduan(scrollTop)) {
        //     setTimeout(function () {
        //         $(".early-page").removeClass("Page");
        //         $(window).scrollTop(scrollTop);
        //         $("#loading").remove();
        //     }, 200);
        // }
        // else {
        // }
    }
    function ajax_fail3() {
        $("#loading").remove();
        $(".early-page").after('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $("#refesh").remove();
            $('#early-aritle ul').empty();
            $(".early-page").after('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
            bind_info();
        })
    }

    //显示早推送机构信息
    httpGet("Reader/AgencyPoints?sortType=0&skipCount=0&count=5", "", true, ajax_success4, ajax_fail4);
    function ajax_success4(obj) {
        if (obj != null && obj != "" && obj != undefined) {

            $('#org-aritle').append('<table cellspacing="0px"><tr class="org-head"><td>股票名称</td><td>内容要点</td><td>机构名称</td><td>机构评级</td><td>机构影响力</td></tr></table>');
            for (var i = 0; i < obj.length; i++) {
                var AgencyLevel = "";
                if (obj[i].AgencyLevel == "0") {
                    AgencyLevel = "减持";
                }
                else {
                    if (obj[i].AgencyLevel == "1") {
                        AgencyLevel = "谨慎买入";
                    }
                    else {
                        if (obj[i].AgencyLevel == "2") {
                            AgencyLevel = "推荐";
                        }
                        else {
                            if (obj[i].AgencyLevel == "3") {
                                AgencyLevel = "买入";
                            }
                        }
                    }
                }
                $('#org-aritle table').append('<tr id="' + obj[i].StockID + '"><td>' + obj[i].StockName + '</td><td>' + obj[i].Content + '</td><td>' + obj[i].AgencyName + '</td><td><span>' + AgencyLevel + '</span><img class="rate-img" src="images/Orgrate/icon-orgrate' + obj[i].AgencyLevel + '.png"></td><td><img class="effect-img" src="images/start/icon-start' + obj[i].EffectLevel + '.png" /></td></tr>');
            }
        }
        else {
            //下拉时获取指数为空
        }
    }
    function ajax_fail4() {
    }
    touchBottom();
}
function bind_indexlist(id) {
    $("#" + id).bind("click", function (event) {
        event.stopPropagation();
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: $(this).find('.type').val() }; //用户进入文章行为需要传的参数
        httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success5, ajax_fail5);
        function ajax_success5(obj) {
            // if (ItemId != null) {
            //     slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + $(this).find('.type').val() + '&fromPage=earlyPush&earlyItemId=' + ItemId);
            // }
            // else {
            //     if (pointTime != null) {
            //         slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + $(this).find('.type').val() + '&fromPage=earlyPush&pointTime=' + pointTime);
            //     }
            // }
            AddGoback(localStorage.N_url + '&scrollTop=' + $(window).scrollTop(), 'newsInfo.html?itemid=' + id + '&newsType=' + $(this).find('.type').val());

        }
        function ajax_fail5() {
            ajax_success5();
        }
    });
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
    $("#early-page").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
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
                webpageUrl: "http://m.boolcj.com/earlyPush.html?pointTime=" + pointTime,    // webpage
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
            title: pointDate + '布尔早餐',
            description: PushSummary,
            thumb: "http://www.taikorcdn.com/reader/images/icon.png",
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/earlyPush.html?pointTime=" + pointTime,    // webpage
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
    args.url = "http://m.boolcj.com/earlyPush.html?pointTime=" + pointTime;
    args.title = pointDate + '布尔早餐';
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
    window.plugins.socialsharing.shareViaSMS("http://m.boolcj.com/earlyPush.html?pointTime=" + pointTime, null /* see the note below */, function (msg) {
        window.plugins.toast.showShortBottom("短信分享成功");

    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    })
}
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    cordova.plugins.clipboard.copy("http://m.boolcj.com/earlyPush.html?pointTime=" + pointTime, function (msg) {
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