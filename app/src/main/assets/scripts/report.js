//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var ItemId = GetQueryString("itemid");
var newsType = GetQueryString("newsType");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
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
            //db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
            //    db.transaction(function (tx) {
            //        SelectUser(tx);
            //    }, function (err) {
            //        alert('Open database my.db ERROR1: ' + err.message);
            //    });
            //});
        }, 200);
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
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                }
            }

        }
    });
}
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById("report-submit").addEventListener("touchstart", touchStartSubmit, false);
    touchback();
    GetReportImg();
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function touchStartBack(event) {
    event.preventDefault();
    event.stopPropagation();
    //延时只用在模拟器中
    // slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + ItemId + '&newsType=' + newsType + '&fromPage=' + fromPage);
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    // slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + ItemId + '&newsType=' + newsType + '&fromPage=' + fromPage);
    Gotoback();
}
function GetReportImg() {
    var $img = $("#report-title li");
    $img.each(function (i) {
        document.getElementById($img.eq(i).attr("id")).addEventListener("touchstart", touchStartReport, false);
    })
}
function touchStartReport(event) {
    event.preventDefault();
    if ($(this).find("img").attr("src") == "images/icon-report.png") {
        $(this).find("img").attr("src", "images/icon-reported.png");
        $(this).addClass("reported-word");
    }
    else {
        $(this).find("img").attr("src", "images/icon-report.png");
        $(this).removeClass("reported-word");
    }
}
//提交举报信息
function touchStartSubmit(event) {
    event.preventDefault();
    var type = new Array();
    type = [];
    var errorDescribe = $(".report-more #KEYword1").val();
    //举报的信息添加一起
    $("#report-title ul li").each(function (i) {
        if ($(this).hasClass("reported-word")) {
            type = type.concat($(this).find("input").val());
        }
        if (i == ($("#report-title ul li").length - 1)) {
            if (type != "" || errorDescribe != "") {
                type = JSON.stringify(type);
                var ArticleComplaints = { ItemID: GetQueryString("itemid"), UserID: UserID, Type: type, ErrorDescribe: errorDescribe }
                SubmitAjax(ArticleComplaints);
            }
            else {
                window.plugins.toast.show("请选择或填写举报信息后提交", "500", "center");
            }
        }
    })
}
function AuthorizeSubmit(ArticleComplaints) {
    db.transaction(function (tx) {
        tx.executeSql('select * from Authorize where id=?', [1], function (tx, res) {
            if (res.rows.length == 0) {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "https://api.palaspom.com/Oauth2/Authorize?userId=" + "saner20160620171903" + "&appSecert=" + "62b5213fcd3bbef7d50a413c5c5073973c6034e8441e881aed1951d15ce63c8dfb2501ec007d48c494ebd6082c41d76f32e53b6bfdbeed56a8cb811eb2073deb3e241b5f9c07ff2091ec420325d0f8da8afbe5a38c78c7d040c1cb5357fac2a56921f861b82aa6adc2d35efe464599dc634e68c41cd6d56508a08b854a0f3df2",
                    success: function (data) {
                        if (data != null && data != "") {
                            var myDate = new Date();
                            db.transaction(function (tx) {
                                tx.executeSql('replace INTO Authorize (id, AccessToken, Time, ExpiresIn) VALUES (?,?,?,?)', [1, (data.TokenType + " " + data.AccessToken), myDate.getTime(), data.ExpiresIn], function (tx, res) {
                                    // alert("插入AccessToken成功1");
                                    AccessToken = data.TokenType + " " + data.AccessToken;
                                    SubmitAjax(ArticleComplaints);
                                });
                            }, function (e) {
                                alert('Open db database ERROR5: ' + err.message);
                            });
                        }
                    },
                    error: function (err) {
                        alert("Authorize问题1:" + err.message);
                    }
                });
            }
            else {
                var myDate = new Date();
                var Diffdate = (myDate.getTime() - res.rows.item(0).Time);
                if (Diffdate < ((parseInt(res.rows.item(0).ExpiresIn) * 1000)) - 600000) {
                    AccessToken = res.rows.item(0).AccessToken;
                    SubmitAjax(ArticleComplaints);
                }
                else {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: "https://api.palaspom.com/Oauth2/Authorize?userId=" + "saner20160620171903" + "&appSecert=" + "62b5213fcd3bbef7d50a413c5c5073973c6034e8441e881aed1951d15ce63c8dfb2501ec007d48c494ebd6082c41d76f32e53b6bfdbeed56a8cb811eb2073deb3e241b5f9c07ff2091ec420325d0f8da8afbe5a38c78c7d040c1cb5357fac2a56921f861b82aa6adc2d35efe464599dc634e68c41cd6d56508a08b854a0f3df2",
                        success: function (data) {
                            if (data != null && data != "") {
                                var myDate = new Date();
                                db.transaction(function (tx) {
                                    tx.executeSql('replace INTO Authorize (id, AccessToken, Time, ExpiresIn) VALUES (?,?,?,?)', [1, (data.TokenType + " " + data.AccessToken), myDate.getTime(), data.ExpiresIn], function (tx, res) {
                                        //alert("超出9小时重新获取并插入AccessToken成功2");
                                        AccessToken = data.TokenType + " " + data.AccessToken;
                                        SubmitAjax(ArticleComplaints);
                                    });
                                }, function (e) {
                                    alert('Open db database ERROR5: ' + err.message);
                                });
                            }
                        },
                        error: function (err) {
                            alert("Authorize问题2:" + err.message);
                        }
                    });
                }
            }
        })
    }, function (err) {
        alert('Open db database ERROR0: ' + err.message);
    });
}
function SubmitAjax(ArticleComplaints) {
    // $.ajax({
    //     type: "post",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader("Authorization", AccessToken);
    //     },
    //     url: "https://api.palaspom.com/Reader/Complaints",
    //     data: ArticleComplaints,
    //     success: function (data) {
    //         if (data == true) {
    //             window.plugins.toast.show("举报成功", "300", "bottom");
    //             setTimeout(function () {
    //                 slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + ItemId + '&newsType=' + newsType + '&fromPage=' + fromPage);
    //             }, 500);
    //         }
    //         else if (data == false) {
    //             window.plugins.toast.show("举报失败，请重新举报", "300", "bottom");
    //         }
    //     }
    // })
    httpPost("Reader/Complaints", ArticleComplaints, true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj == true) {
            window.plugins.toast.show("举报成功", "300", "bottom");
            setTimeout(function () {
                Gotoback();
                // slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + ItemId + '&newsType=' + newsType + '&fromPage=' + fromPage);
            }, 500);
        }
        else if (obj == false) {
            window.plugins.toast.show("举报失败，请重新举报", "300", "bottom");
        }
    }
    function ajax_fail2() {
        //获取失败
    }
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
            // slide('right', 'lightblue', 1, 'newsInfo.html?itemid=' + ItemId + '&newsType=' + newsType + '&fromPage=' + fromPage);
            Gotoback();
        }
    });
}