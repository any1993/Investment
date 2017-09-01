//个人信息页面js文件
var db;
var UserStatus = "unlogin";
var nullu = "", NowVerision = "2.0", UserID = "";
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
                    tx.executeSql("select * from User", [], function (tx, res) {
                        if (res.rows.item(0).LoginState == "1") {
                            $("#login-headimg img").attr("src", res.rows.item(0).UserImg);
                            $("#user-name").html(res.rows.item(0).UserName);
                            if (res.rows.item(0).UserSign != null && res.rows.item(0).UserSign != "") {
                                $("#user-sign").html(res.rows.item(0).UserSign);
                            }
                            $("#login-button-wec").find("img").attr("src", "images/icon-on.png")
                            $("#login-button-weibo").find("img").attr("src", "images/icon-off.png")
                        }
                        else {
                            if (res.rows.item(0).LoginState == "2") {
                                $("#login-headimg img").attr("src", res.rows.item(0).UserImg);
                                $("#user-name").html(res.rows.item(0).UserName);
                                if (res.rows.item(0).UserSign != null && res.rows.item(0).UserSign != "") {
                                    $("#user-sign").html(res.rows.item(0).UserSign);
                                }
                                $("#login-button-wec").find("img").attr("src", "images/icon-off.png")
                                $("#login-button-weibo").find("img").attr("src", "images/icon-on.png")
                            }
                        }
                    });
                }, function (err) {
                    alert('Open database my.db ERROR1: ' + err.message);
                });
            });
        }, 200);
    }
})
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById('login-button-exit').addEventListener("touchstart", touchExit, false);
    touchback();
    // EventListener("login-button-weibo");
    //EventListener("login-button-wec");
}
function EventListener(id) {
    document.getElementById(id).addEventListener("touchstart", touchStartLogin, false);
}
function touchStartLogin(event) {
    event.preventDefault();
    if ($(this).find("img").attr("src") == "images/icon-on.png") {
        $(this).find("img").attr("src", "images/icon-off.png")
    }
    else {
        $(this).find("img").attr("src", "images/icon-on.png")
    }
}
function touchStartBack(event) {
    event.preventDefault();
    // slide('right', 'lightblue', 1, 'indexMy.html');
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    // slide('right', 'lightblue', 1, 'indexMy.html');
    Gotoback();
}
//退出登录
function touchExit(event) {
    event.preventDefault();
    db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
        db.transaction(function (tx) {
            tx.executeSql("select * from User", [], function (tx, res) {
                if (res.rows.length > 0 && res.rows.item(0).LoginState != "0") {
                    tx.executeSql("replace INTO User (id, UserlgID, LoginState, DeviceUserID, UserID, UserName, UserImg, UserSign, unloginHash, loginHash) VALUES (?,?,?,?,?,?,?,?,?,?)", [1, "", "0", res.rows.item(0).DeviceUserID, "", "", "", "", res.rows.item(0).unloginHash, ""], function (tx, res) {
                        // slide('right', 'lightblue', 1, 'indexMy.html');
                        Gotoback();
                    });
                }
            })
            tx.executeSql('DROP TABLE IF EXISTS Item_list_login');//删除登录下的文章列表
            tx.executeSql('DROP TABLE IF EXISTS item_co_login');//删除登录下的收藏记录
            tx.executeSql('DROP TABLE IF EXISTS OperateID');//删除登录下的操作记录ID
            tx.executeSql('DROP TABLE IF EXISTS Categorys_login');//删除登录下的分类表
            tx.executeSql('DROP TABLE IF EXISTS SearchRecord_login');//删除登录下的搜索记录表
            tx.executeSql('DROP TABLE IF EXISTS Item_list_category_login');//删除登录下的分类文章表
            tx.executeSql('DROP TABLE IF EXISTS Record_Position_login');
            tx.executeSql('DROP TABLE IF EXISTS Chose_stock_login');//删除记录登录的自选股
            tx.executeSql('DROP TABLE IF EXISTS Chose_block_login');//删除记录登录的自选主题
            tx.executeSql('REPLACE INTO Record_TopIndex(id, TopIndex) VALUES (?,?)', [1, 0], function (tx, res) {
            });
        }, function (err) {
            alert('indexuser.html Open database my.db ERROR2: ' + JSON.stringify(err));
        });
    });
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

