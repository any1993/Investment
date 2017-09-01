//文章详情页js文件
//午推送页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var ItemId = GetQueryString("itemid");
var pointTime = GetQueryString("pointTime");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var stockids = "sh000001,sz399001,sz399006,sz399005,sh000300,sh000016"; //大盘指数
var pointDate;
var PushSummary = "";
// var AccessToken;
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
    document.getElementById("Ncelebrity-button").addEventListener("touchstart", touchStartContent, false);
    document.getElementById("icon-share").addEventListener("touchstart", touchStartShare, false);
    touchback();
}
function bind_info() {
    //if (pointTime == null) {
    //    //盘中点评/预测
    //    db.transaction(function (tx) {
    //        tx.executeSql('select * from Item_list_' + UserStatus + ' where ItemId=?', [ItemId], function (tx, res) {
    //            if (res != null && res.rows != null && res.rows.length > 0) {
    //                $("#Nreview-aritle").html(res.rows.item(0).Title);
    //                PushSummary = res.rows.item(0).Title;
    //            }
    //        });
    //    }, function (e) {
    //        alert("itemListSeERROR: " + e.message);
    //    });
    //}
    //else {
        if (pointTime != null) {
            //根据时间取盘中点评/预测
            httpGet("Reader/MachinePoint?pointTime=" + pointTime, "", true, ajax_success2, ajax_fail2);
            function ajax_success2(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    PushSummary = obj;
                    $("#Nreview-aritle").html(obj);
                }
                else {
                    $('#Nreview-title,#Nreview-aritle').addClass("Page");
                }
            }
            function ajax_fail2() {
                // $("#Nreview-aritle").html('<div id="refeshPoint" style="position:relative;width:100%;height:100px;"><div class="refesh"><img style="width:30px;" src="images/no_content.png"/><br><span>加载失败，点我刷新</span></div><div>');
                // $("#refeshPoint").bind("click", function (event) {
                //     window.location.reload();
                // })
            }
        }
    //}

    //显示中推送早盘指数
    var count = stockids.split(",");
    httpGet("Reader/Stocks?stockIds=" + stockids + "&sortType=0&count=" + count.length, "", true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
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
            //获取为空
        }
    }
    function ajax_fail3() {

    }
    //名人热评
    httpGet("Reader/PersonPoints?personId=&count=1&getDetail=true&dateTime=" + pointTime, "", true, ajax_success4, ajax_fail4);
    function ajax_success4(obj) {
        $(".noon-page").removeClass("Page");
        $("#loading").remove();
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                $('.Ncelebrity-aritle').attr("id", obj[i].PointId);
                $('#Ncelebrity-right').html(obj[i].Title);
                $('#Ncelebrity-pic img').attr("src", obj[i].ImageUrl);
                $('#Ncelebrity-slanders p').html(obj[i].Content);
            }
        }
        else {
            //获取为空
        }
    }
    function ajax_fail4() {
        $("#loading").remove();
        $(".noon-page").after('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $("#refesh").remove();
            $("#Nreview-aritle").empty();
            $(".noon-page").after('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
            bind_info();
        })
    }
    //热门板块股票
    httpGet("Reader/Blocks?blockIds=&sortType=0&count=6", "", true, ajax_success5, ajax_fail5);
    function ajax_success5(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var n = parseInt(obj.length / 3);
            if (n > 0) {
                var m = obj.length - 3 * n;
            }
            else {
                var m = obj.length;
                var j = 0;
            }
            for (var i = 0; i < n; i++) {
                $("#NCstock-block").append('<li><ul id="NCstock-blockli' + i + '" class="cpi-left"></ul><div class="clear"></div></li>');
                for (var j = i * 3; j < i * 3 + 3; j++) {
                    if (obj[j].PriceChange > 0) {
                        $('#NCstock-blockli' + i).append('<li id="' + obj[j].ID + '"><p>' + obj[j].Name + '</p><p class="pointRed">+' + obj[j].ChangePercent.toFixed(2) + '%</p><p class="brand">' + obj[j].FSsymbol + '</p><p><span>' + obj[j].FSpricechange + '</span><span>' + obj[j].FSchangepercent.toFixed(2) + '%</span></p></li>');
                    }
                    else {
                        $('#NCstock-blockli' + i).append('<li id="' + obj[j].ID + '"><p>' + obj[j].Name + '</p><p class="point">' + obj[j].ChangePercent.toFixed(2) + '%</p><p class="brand">' + obj[j].FSsymbol + '</p><p><span>' + obj[j].FSpricechange + '</span><span>' + obj[j].FSchangepercent.toFixed(2) + '%</span></p></li>');
                    }
                    bind_indexlist1(obj[j].ID);
                }
            }
            if (m > 0) {
                $("#NCstock-block").append('<li><ul id="NCstock-blockli' + n + '" class="cpi-left"></ul><div class="clear"></div></li>');
                for (var z = 0; z < m; z++) {
                    if (obj[j + z].PriceChange > 0) {
                        $('#NCstock-blockli' + n).append('<li id="' + obj[j + z].ID + '"><p>' + obj[j + z].Name + '</p><p class="pointRed">+' + obj[j + z].ChangePercent.toFixed(2) + '%</p><p class="brand">' + obj[j + z].FSsymbol + '</p><p><span>' + obj[j + z].FSpricechange + '</span><span>' + obj[j + z].FSchangepercent.toFixed(2) + '%</span></p></li>');
                    }
                    else {
                        $('#NCstock-blockli' + n).append('<li id="' + obj[j + z].ID + '"><p>' + obj[j + z].Name + '</p><p class="point">' + obj[j + z].ChangePercent.toFixed(2) + '%</p><p class="brand">' + obj[j + z].FSsymbol + '</p><p><span>' + obj[j + z].FSpricechange + '</span><span>' + obj[j + z].FSchangepercent.toFixed(2) + '%</span></p></li>');
                    }
                    bind_indexlist1(obj[j + z].ID);
                }
            }
        }
        else {
            //获取为空
        }
    }
    function ajax_fail5() {
        //获取失败
        // $("#NCstock-block").html('<div id="refeshBlocks" style="position:relative;width:100%;height:100px;"><div class="refesh"><img style="width:30px;" src="images/no_content.png"/><br><span>加载失败，点我刷新</span></div><div>');
        // $("#refeshBlocks").bind("click", function (event) {
        //     window.location.reload();
        // })
    }
    //热门股票
    httpGet("Reader/Stocks?stockIds=&sortType=0&count=6", "", true, ajax_success6, ajax_fail6);
    function ajax_success6(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].Pricechange > 0) {
                    $('#Nstock-aritle table').append('<tr><td id="' + obj[i].Symbol + '"><p class="Nstock-name">' + obj[i].Name + '</p><p class="Nstock-code">' + obj[i].Code + '</p></td><td>' + obj[i].Trade + '</td><td>+' + obj[i].Changepercent.toFixed(2) + '%</td></tr>');
                }
                else {
                    $('#Nstock-aritle table').append('<tr><td id="' + obj[i].Symbol + '"><p class="Nstock-name">' + obj[i].Name + '</p><p class="Nstock-code">' + obj[i].Code + '</p></td><td class="pointDown">' + obj[i].Trade + '</td><td class="pointDown">' + obj[i].Changepercent.toFixed(2) + '%</td></tr>');
                }
                bind_indexlist(obj[i].Symbol);
            }
        }
        else {
            //获取为空
        }
    }
    function ajax_fail6() {
        // $("#Nstock-aritle").html('<div id="refeshStocks" style="position:relative;width:100%;height:100px;"><div class="refesh"><img style="width:30px;" src="images/no_content.png"/><br><span>加载失败，点我刷新</span></div><div>');
        // $("#refeshStocks").bind("click", function (event) {
        //     window.location.reload();
        // })
    }
    touchBottom();
}
//绑定股票的点击
function bind_indexlist(id) {
    $('#' + id).bind('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        AddGoback(localStorage.N_url, 'stock.html?stockId=' + id);
    })
}
//绑定主题的点击
function bind_indexlist1(id) {
    $('#' + id).bind('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId=' + id);
    })
}
function touchStartBack(event) {
    event.preventDefault();
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    Gotoback();
}
function touchStartContent(event) {
    event.preventDefault();
    if ($('#Ncelebrity-slanders p').hasClass("Ncelebrity-content")) {
        $('#Ncelebrity-slanders p').removeClass("Ncelebrity-content");
        $('.info-button').html('收回评论<img src="images/icon-up.png">');
    }
    else {
        $('#Ncelebrity-slanders p').addClass("Ncelebrity-content");
        $('.info-button').html('全部评论<img src="images/icon-down.png">');
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

//分享操作
function touchStartShare(event) {
    event.preventDefault();
    document.getElementById("icon-share").removeEventListener("touchstart", touchStartShare, false);
    $("#noon-page").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
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
                webpageUrl: "http://m.boolcj.com/noonPush.html?pointTime=" + pointTime,    // webpage
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
            title: pointDate + '布尔中餐',
            description: PushSummary,
            thumb: "http://www.taikorcdn.com/reader/images/icon.png",
            mediaTagName: "TEST-TAG-001",
            messageExt: PushSummary,
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/noonPush.html?pointTime=" + pointTime,    // webpage
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
    args.url = "http://m.boolcj.com/noonPush.html?pointTime=" + pointTime;
    args.title = pointDate + '布尔中餐';
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
    window.plugins.socialsharing.shareViaSMS("http://m.boolcj.com/noonPush.html?pointTime=" + pointTime, null /* see the note below */, function (msg) {
        window.plugins.toast.showShortBottom("短信分享成功");

    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    })
}
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    cordova.plugins.clipboard.copy("http://m.boolcj.com/noonPush.html?pointTime=" + pointTime, function (msg) {
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