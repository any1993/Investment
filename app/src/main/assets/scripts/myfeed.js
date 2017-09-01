//我的反馈页js文件
var nullu = "", NowVerision = "2.0", UserID = "";
// var AccessToken;
var UserStatus = "unlogin";
var db;
$(function () {
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        jpushEffect();
        function onPause() {
            //此应用程序已被暂停。保存应用程序状态 
            jpushEffect();
        };

        function onResume() {
            //此应用程序已被重新激活。恢复应用程序的状态 
            jpushEffect();
            window.location.reload();
        };
        setTimeout(function () {
            Touch();
            db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                db.transaction(function (tx) {
                    SelectUser(tx);
                }, function (err) {
                    alert('Open database my.db ERROR1: ' + err.message);
                });
            });
        }, 200);
    };
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
                    bind_feed();
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
                bind_feed();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    bind_feed();
                }
            }

        }
    });
}
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    touchback();
}
function bind_feed() {
    var take = 5;
    httpGet("Reader/Feedbacks?userID=" + UserID + "&skip=" + "0" + "&take=5", "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].Replys == null || obj[i].Replys == "") {
                    myfeedList = '<li><div class="myfeed-time"><span>' + getTimeDiff(obj[i].CreateTime) + '</span></div><div class="myfeed-text"><span>' + obj[i].Content + '</span></div><div class="myfeed-tip"><span>您的反馈已收到，我们会及时进行处理 ^_^</span></div><div class="myfeed-reply"></div></li>';
                    $("#myfeed-box ul").append(myfeedList);
                }
                else {
                    myfeedList = '<li><div class="myfeed-time"><span>' + getTimeDiff(obj[i].CreateTime) + '</span></div><div class="myfeed-text"><span>' + obj[i].Content + '</span></div><div class="myfeed-tip"><span>您的反馈已处理，谢谢 ^_^</span></div><div class="myfeed-reply"><div><span>' + obj[i].Replys[0].Content + '</span></div><div class="reply-time"><span>' + getTimeDiff(obj[i].Replys[0].CreateTime) + '</span></div></div></li>';
                    $("#myfeed-box ul").append(myfeedList);
                }
            }
        }
        else {
            $("#myfeed-box ul").append('<div style="padding-top:100px"><img style="width:130px; padding:10px 0;" src="images/no_collect.png"/></div><div style="color:#999">没有反馈信息</div>');
        }

    }
    function ajax_fail2() {
        $(".myfeed-page").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $("#refesh").remove();
            bind_feed();
        })
    }
}
//返回到意见反馈页面
function touchStartBack(event) {
    event.preventDefault();
    //延时只用在模拟器中
    setTimeout(function () {
        Gotoback();
    }, 50);
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    Gotoback();
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