//意见反馈页js文件
var nullu = "", NowVerision = "2.0", UserID = "";
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
    document.getElementById("my-feedback").addEventListener("touchstart", touchStartMy, false);
    document.getElementById("feedback-submit").addEventListener("touchstart", touchStartSumit, false);
    touchback();
}
//返回
function touchStartBack(event) {
    event.preventDefault();
    //延时只用在模拟器中
    setTimeout(function () {
        // slide('right', 'lightblue', 1, 'indexMy.html');
        Gotoback();
    }, 50);
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    // slide('right', 'lightblue', 1, 'indexMy.html');
    Gotoback();
}
//进入我的反馈
function touchStartMy(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'myfeed.html');
    // slide('left', 'lightblue', 1, 'myfeed.html');
}
//反馈提交
function touchStartSumit(event) {
    if ($("#KEYword1").val() == "") {
        window.plugins.toast.show("请填写反馈的问题后再提交", 500, "center");
    }
    else {
        httpGet("Reader/Feedback?userID=" + UserID + "&content=" + $("#KEYword1").val() + "&parentFeedbackID=", "", true, ajax_success2, ajax_fail2);
        function ajax_success2(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                window.plugins.toast.show("您的反馈提交成功", 300, "center");
            }
            else {
                window.plugins.toast.show("您的反馈提交失败，请重新试", 500, "center");
            }
        }
        function ajax_fail2() {
            window.plugins.toast.show("您的反馈提交失败，请重新试", 500, "center");
        }
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
            // slide('right', 'lightblue', 1, 'indexMy.html');
            Gotoback();
        }
    });
}

