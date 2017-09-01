//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var ItemId = GetQueryString("relateItemid");
var newsType = GetQueryString("relateNewsType");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
// var AccessToken;
var newsSummary = "", newsImg = "http://www.taikorcdn.com/reader/images/icon.png";
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
        //    db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
        //        db.transaction(function (tx) {
        //            SelectUser(tx);
        //        }, function (err) {
        //            alert('Open database my.db ERROR1: ' + err.message);
        //        });
        //    });
        }, 200);
    //})
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
    // document.getElementById("info-button").addEventListener("touchstart", touchStartInfo, false);
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
    document.getElementById("collect-button").addEventListener("touchstart", touchstartCollect, false);
    touchback();
}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//从前端数据库或者服务器去取数据
function bind_info() {
    setTimeout(function () {
        var strlist = '';
        httpGet("Reader/ArticleDetail?itemID=" + ItemId + "&type=0&isCache=false&version=" + NowVerision, "", true, ajax_success2, ajax_fail2);
        function ajax_success2(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                $('#info-title').html(obj.Title);
                $('#info-timer').html(obj.PubDate);
                $('#info-mediaName').html(obj.MediaName);
                //标签赋值
                // if (obj.Tag != null && obj.Tag != "" && obj.Tag != undefined) {
                //     var tag = obj.Tag.split(",");
                //     var tagarray = "";
                //     for (var j = 0; j < tag.length; j++) {
                //         if (tag[j].indexOf(":") != -1) {
                //             tagarray += tag[j].substring(0, tag[j].indexOf(":")) + "，";
                //         }
                //         else {
                //             tagarray += tag[j] + "，";
                //         }
                //     }
                //     tagarray = tagarray.substr(0, tagarray.length - 1);
                //     $('#info-tag ul').append('<li><img style="width:12px; margin-right:3px;" src="images/tag.png"><span>' + tagarray + '</span></li>');
                // }
                if (obj.Tag != null && obj.Tag != "" && obj.Tag != undefined) {
                    var tag = obj.Tag.split(",");
                    for (var j = 0; j < tag.length; j++) {
                        if (tag[j].indexOf(":") != -1) {
                            strlist += '<span class="tag-label">' + tag[j].substring(0, tag[j].indexOf(":")) + '</span>';
                        }
                        else {
                            strlist += '<span class="tag-label">' + tag[j] + '</span>';
                        }
                    }
                    $('#info-tag').append(strlist);
                }
                //摘要赋值
                if (obj.Summary != null && obj.Summary != "") {
                    newsSummary = obj.Summary[0];
                }
                if (obj.ImageUrl != null && obj.ImageUrl != "") {
                    newsImg = "http://www.taikorcdn.com/reader/" + obj.ImageUrl;
                }
                $('#info-htmltext').html(obj.HTMLText);
                infoHTMLimg();
                infoHTMLimgattr();
                if (obj.Struct != null && obj.Struct != "") {
                    if (obj.Struct.Subject != null && obj.Struct.Subject != "") {
                        $('#analysis-text ul').append('<li><img src="images/icon-circle.png"><span>文章主体：</span><span id="theme-aritle">' + obj.Struct.Subject + '</span></li>');
                    }
                    if (obj.Struct.Keypoint != null && obj.Struct.Keypoint != "") {
                        $('#analysis-text ul').append('<li><img src="images/icon-circle.png"><span>内容关键点：</span><span id="theme-key">' + obj.Struct.Keypoint + '</span></li>');
                    }
                    if (obj.Struct.MarketImpact != null && obj.Struct.MarketImpact != "") {
                        $('#analysis-text ul').append('<li><img src="images/icon-circle.png"><span>市场影响：</span><span id="theme-market">' + obj.Struct.MarketImpact + '</span></li>');
                    }
                }
                $("#loading").remove();
                $(".info-page").removeClass("Page");
            }
            else {
                //下拉时获取指数为空
            }
        }
        function ajax_fail2() {
            $("#loading").remove();
            $("#app-info").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
            $("#refesh").bind("click", function (event) {
                $('#refesh').remove();
                $("#app-info").append('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
                bind_info();
            })
        }
        //db.transaction(function (tx) {
        //    tx.executeSql('select * from item_co_' + UserStatus + ' where ItemID =?', [ItemId], function (tx, res) {
        //        if (res != null && res.rows != null && res.rows.length > 0) {
        //            $("#collect-button").attr("src", "images/infoBottom/collected.png");
        //        }
        //        else {
        //            $("#collect-button").attr("src", "images/infoBottom/collect.png");
        //        }
        //    });
        //}, function (e) {
        //    alert("itemListSe1ERROR: " + e.message);
        //});
    }, 100);

}
//文章查看全文按钮
function touchStartInfo(event) {
    event.preventDefault();
    // if ($('#htmlMore').hasClass("Page")) {
    //     $('#htmlMore').removeClass("Page");
    //     $('#info-htmltext').addClass('info-htmltextHidden');
    //     $('.info-button').html('查看全文<img src="images/icon-down.png">')
    // }
    // else {
    InfoAjax();
    // }
}
function InfoAjax() {
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 8, Type: newsType }; //用户阅读全文行为需要传的参数
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        $('#htmlMore').addClass("Page");
        $('#info-htmltext').removeClass('info-htmltextHidden');
        // $('.info-button').html('收回全文<img src="images/icon-up.png">');
        $('#info-button').remove();
    }
    function ajax_fail3() {
        ajax_success3();
    }
}
//文章返回按钮
function touchStartBack(event) {
    event.preventDefault();
    BackAjax();

}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    BackAjax();
}
function BackAjax() {
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 3, Type: newsType }; //用户退出文章行为需要传的参数
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success4, ajax_fail4);
    function ajax_success4(obj) {
        // if (earlyItemId != null) {
        //     slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + FItemId + '&newsType=' + FnewsType + "&fromPage=" + fromPage + "&earlyItemId=" + earlyItemId + "&SearchKey=" + SearchKey + "&from=" + fromTag + "&eventId=" + eventId + "&topicId=" + topicId + '&FfromPage=' + FfromPage + '&TopicBarId=' + TopicBarId + '&StockBarId=' + StockBarId + "&HeatTopicID=" + HeatTopicID);
        // }
        // else {
        //     if (pointTime != null) {
        //         slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + FItemId + '&newsType=' + FnewsType + "&fromPage=" + fromPage + "&pointTime=" + pointTime + "&SearchKey=" + SearchKey + "&from=" + fromTag + "&eventId=" + eventId + "&topicId=" + topicId + '&FfromPage=' + FfromPage + '&TopicBarId=' + TopicBarId + '&StockBarId=' + StockBarId + "&HeatTopicID=" + HeatTopicID);
        //     }
        //     else {
        //         slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + FItemId + '&newsType=' + FnewsType + "&fromPage=" + fromPage + "&earlyItemId=" + earlyItemId + "&SearchKey=" + SearchKey + "&from=" + fromTag + "&eventId=" + eventId + "&topicId=" + topicId + '&FfromPage=' + FfromPage + '&TopicBarId=' + TopicBarId + '&StockBarId=' + StockBarId + "&HeatTopicID=" + HeatTopicID);
        //     }
        // }
        Gotoback();
    }
    function ajax_fail4() {
        ajax_success4();
    }
}
//文章分享按钮操作
function touchStartShare(event) {
    event.preventDefault();
    $("#app-info").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
    $("#cover").after('<div id="share-box" class="share-box"><div class="share-icon"><div class="share-half share-top"><ul><li id="wechatFrd-button"><div class="share-pic"><img src="images/share/icon-frie.png"></div><div class="share-word">朋友圈</div></li><li id="wechat-button"><div class="share-pic"><img src="images/share/icon-wec.png"></div><div class="share-word">微信</div></li><li id="weibo-button"><div class="share-pic"><img src="images/share/icon-weibo.png"></div><div class="share-word">新浪微博</div></li></ul></div><div class="share-half"><ul><li id="sms-button"><div class="share-pic"><img src="images/share/icon-sms.png"></div><div class="share-word">短信</div></li><li id="copy-button"><div class="share-pic"><img src="images/share/icon-link.png"></div><div class="share-word">复制链接</div></li><li id="refresh-button"><div class="share-pic"><img src="images/share/icon-refr.png"></div><div class="share-word">刷新</div></li><li id="report-button"><div class="share-pic"><img src="images/share/icon-repo.png"></div><div class="share-word">举报</div></li></ul></div></div><div style="height:8px"></div><div id="share-cancel" class="share-cancel">取消</div></div>');
    $("#share-box").animate({ bottom: "0" }, 500);
    document.getElementById("wechatFrd-button").addEventListener("touchstart", touchstartWechatFrd, false);
    document.getElementById("wechat-button").addEventListener("touchstart", touchstartWechat, false);
    document.getElementById("weibo-button").addEventListener("touchstart", touchstartWebo, false);
    document.getElementById("sms-button").addEventListener("touchstart", touchstartSms, false);
    document.getElementById("copy-button").addEventListener("touchstart", touchstartCopy, false);
    document.getElementById("refresh-button").addEventListener("touchstart", touchstartRefresh, false);
    document.getElementById("report-button").addEventListener("touchstart", touchstartReport, false);
    document.getElementById("share-cancel").addEventListener("touchstart", touchstartCancel, false);
    document.getElementById("share-button").removeEventListener("touchstart", touchStartShare, false);
}
//文章收藏操作
function touchstartCollect(event) {
    event.preventDefault();
    if ($(this).attr("src") == "images/infoBottom/collect.png") {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 2, Type: newsType }; //用户进入收藏文章的行为
        var YesCollect = "yes";
        CollectAjax(YesCollect, BehaviorLogData);
        update_co(ItemId, newsType);
    }
    else {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 7, Type: newsType }; //用户进入收藏文章的行为
        var YesCollect = "no";
        CollectAjax(YesCollect, BehaviorLogData);
        delete_co(ItemId);
    }
}
function CollectAjax(YesCollect, BehaviorLogData) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success5, ajax_fail5);
    function ajax_success5(obj) {
        if (UserStatus == "login") {
            update_ID(obj);
        }
        if (YesCollect == "yes") {
            $("#collect-button").attr("src", "images/infoBottom/collected.png");
            window.plugins.toast.show("收藏成功", 300, "center");
        }
        else {
            $("#collect-button").attr("src", "images/infoBottom/collect.png");
            window.plugins.toast.show("取消收藏", 300, "center");
        }
    }
    function ajax_fail5(netStatus) {
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
    }
}
//微信朋友圈分享
function touchstartWechatFrd(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: $("#info-title").text(),
            description: newsSummary,
            thumb: newsImg,
            mediaTagName: "TEST-TAG-001",
            messageExt: $("#info-title").text(),
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType,    // webpage
            }
        },
        scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, function () {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户分享文章行为需要传的参数
        var ShareType = "1";
        share_ajax(ShareType, BehaviorLogData);
    }, function (reason) {
        window.plugins.toast.showShortBottom("朋友圈分享取消");
    });
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//微信分享文章
function touchstartWechat(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    //摘要的第一句作为描述
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: $("#info-title").text(),
            description: newsSummary,
            thumb: newsImg,
            mediaTagName: "TEST-TAG-001",
            messageExt: $("#info-title").text(),
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType,    // webpage
            }
        },
        scene: Wechat.Scene.SESSION   // share to SESSION
    }, function () {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户分享文章行为需要传的参数
        var ShareType = "2";
        share_ajax(ShareType, BehaviorLogData);
    }, function (reason) {
        window.plugins.toast.showShortBottom("微信朋友分享取消");
    });
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//微博分享文章
function touchstartWebo(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    var args = {};
    args.url = "http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType;
    args.title = $("#info-title").text();
    args.description = newsSummary;
    args.imageUrl = "http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png";//if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png will be the defualt one
    args.defaultText = "";
    YCWeibo.shareToWeibo(function () {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户退出文章行为需要传的参数
        var ShareType = "3";
        share_ajax(ShareType, BehaviorLogData);
    }, function (failReason) {
        window.plugins.toast.showShortBottom("微博分享取消");
    }, args);
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//短信分享文章
function touchstartSms(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.plugins.socialsharing.shareViaSMS("http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType, null /* see the note below */, function (msg) {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户退出文章行为需要传的参数
        var ShareType = "4";
        share_ajax(ShareType, BehaviorLogData);
    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    })
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
function share_ajax(ShareType, BehaviorLogData) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success6, ajax_fail6);
    function ajax_success6(obj) {
        if (ShareType == "1") {
            window.plugins.toast.showShortBottom("朋友圈分享成功");
        }
        else {
            if (ShareType == "2") {
                window.plugins.toast.showShortBottom("微信朋友分享成功");
            }
            else {
                if (ShareType == "3") {
                    window.plugins.toast.showShortBottom("微博分享成功");
                }
                else {
                    if (ShareType == "4") {
                        window.plugins.toast.showShortBottom("短信分享成功");
                    }
                }
            }
        }
    }
    function ajax_fail6(netStatus) {
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
    }
}
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    cordova.plugins.clipboard.copy("http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType, function (msg) {
        window.plugins.toast.showShortBottom("复制链接成功");
        $("#share-box").animate({ bottom: "-335px" }, 500, function () {
            $("#cover").remove();
            $("#share-box").remove();
        });
    }, function (msg) {
        window.plugins.toast.showShortBottom("复制链接失败，请重试");
    });
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
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
//举报页面
function touchstartReport(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'report.html?itemid=' + ItemId);
    // slide('left', 'lightblue', 1, 'report.html?itemid=' + ItemId);
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//文章取消分享按钮
function touchstartCancel(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 500, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//更新返回的TxtSQL语句的ID
function update_ID(data) {
    db.transaction(function (tx) {
        tx.executeSql("insert INTO OperateID (OperateID) VALUES(?)", [data], function (tx, res) {
            ////alert("添加成功");
        });
    },
        function (e) {
            //alert("update_ID1ERROR: " + e.message);
        });
    db.transaction(function (tx) {
        tx.executeSql("select * from OperateID", [], function (tx, res) {
            ////alert(res.rows.length + "&&" + res.rows.item(res.rows.length - 1).Ceshi);
        });
    },
        function (e) {
            //alert("update_ID2ERROR: " + e.message);
        });
}

function update_co(id, Model) {
    db.transaction(function (tx) {
        tx.executeSql('select * from item_list_' + UserStatus + '  where ItemID=?', [id], function (tx, res) {
            if (res != null && res.rows != null && res.rows.length > 0) {
                db.transaction(function (tx) {
                    tx.executeSql('REPLACE INTO item_co_' + UserStatus + '(ItemID, Type, Title, MediaName, Tag, PubDate, Summary, Category, ImageUrl) VALUES(?,?,?,?,?,?,?,?,?)', [id, Model, res.rows.item(0).Title, res.rows.item(0).MediaName, res.rows.item(0).Tag, getDateTimeStamp(res.rows.item(0).PubDate) / 1000, res.rows.item(0).Summary, res.rows.item(0).Category, res.rows.item(0).ImageUrl], function (tx, res) {
                        //插入收藏的文章
                    });
                },
                    function (e) {
                        alert("itemListInAndSe3ERROR: " + e.message);
                    });
            }
            else {
                updatecoAjax(id, Model);
            }
        });
    }, function (e) {
        alert("itemListInAndSe3ERROR: " + e.message);
    });
}
function updatecoAjax(id, Model) {
    httpGet("Reader/ArticleDetail?itemID=" + ItemId + "&type=0&isCache=false&version=" + NowVerision, true, ajax_success7, ajax_fail7);
    function ajax_success7(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            db.transaction(function (tx) {
                tx.executeSql('REPLACE INTO item_co_' + UserStatus + '(ItemID, Type, Title, MediaName, Tag, PubDate, Summary, Category, ImageUrl) VALUES(?,?,?,?,?,?,?,?,?)', [id, Model, obj.Title, obj.MediaName, obj.Tag, getDateTimeStamp(obj.PubDate) / 1000, JSON.stringify(obj.Summary), obj.Category, obj.ImageUrl], function (tx, res) {
                    //插入收藏的文章
                });
            }, function (e) {
                alert("itemListInAndSe3ERROR: " + e.message);
            });
        }
    }
    function ajax_fail7() {

    }
}
function delete_co(id) {
    db.transaction(function (tx) {
        tx.executeSql("delete from item_co_" + UserStatus + "  where ItemID =?", [id], function (tx, res) {
        });
    },
        function (e) {
            alert("update_co1ERROR: " + e.message);
        });
}
//手指滑动返回上一个页面
function touchback() {
    var screenWidth = document.documentElement.clientWidth;
    var yScrolls, yScrolle;
    $("#app-info").on("touchstart", function (e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("#app-info").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            BackAjax();
        }
    });
}