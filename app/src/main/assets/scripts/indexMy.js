var access_token, openid;
var nullu = "", NowVerision = "2.0", UserID = "";
var db;
var UserStatus = "unlogin";
var Auditing = 0;
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
        };
        document.addEventListener("backbutton", onBackKeyDown, false);
        function onBackKeyDown() {
            window.plugins.toast.showShortBottom("点击两次退出");
            document.removeEventListener("backbutton", onBackKeyDown, false); //注销返回键
            //2秒后重新注册
            var intervalID = window.setInterval(
                function () {
                    window.clearInterval(intervalID);
                    document.addEventListener("backbutton", onBackKeyDown, false); //返回键
                }, 2000);
        }
        setTimeout(function () {
            // document.getElementById('opp').addEventListener("touchstart", touchOpp, false);
            // document.getElementById('imf').addEventListener("touchstart", touchImf, false);
            Touch();
            db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                db.transaction(function (tx) {
                    SelectUser(tx);
                }, function (err) {
                });
            });
        }, 200);
    };
})
function SelectUser(tx) {
    tx.executeSql("select * from User", [], function (tx, res) {
        if (localStorage.B_DisplayUserControl != "" && localStorage.B_DisplayUserControl != undefined && localStorage.B_DisplayUserControl == "false") {
            Auditing = 1;
        }
        else {
            document.getElementById('logined-userImg').addEventListener("touchstart", touchUser, false);
        }
        if (res.rows.length == 0) {
            var type = "0", nickName = "";
            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success1, ajax_fail1);
            function ajax_success1(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    UserID = obj;
                    UserStatus = "unlogin";
                    $("#login-box").removeClass("Page");
                    $("#logined-box").addClass("Page");
                    if (Auditing == 1) {
                        $("#login-box").addClass("Page");
                        $("#logined-box").removeClass("Page");
                        $("#logined-userName span").html("游客" + UserID.substring(UserID.length - 5, UserID.length));
                    }
                    // Touch();
                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO User (id, LoginState, DeviceUserID) VALUES (?,?,?)", [1, "0", UserID], function (tx, res) {
                            ////alert("插入设备登录信息成功");
                        });
                    }, function (err) {
                        //alert('Open database my.db ERROR4: ' + err.message);
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
                $("#login-box").removeClass("Page");
                $("#logined-box").addClass("Page");
                if (Auditing == 1) {
                    $("#login-box").addClass("Page");
                    $("#logined-box").removeClass("Page");
                    $("#logined-userName span").html("游客" + UserID.substring(UserID.length - 5, UserID.length));
                }
                // Touch();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    $("#login-box").addClass("Page");
                    $("#logined-box").removeClass("Page");
                    if (Auditing != 1) {
                        $("#logined-userImg img").attr("src", res.rows.item(0).UserImg);
                        $("#logined-userName span").html(res.rows.item(0).UserName);
                    }
                    else {
                        $("#logined-userName span").html("游客" + UserID.substring(UserID.length - 5, UserID.length));
                    }
                    // Touch();
                }
            }

        }
    });
}
function Touch() {
    document.getElementById('login-back').addEventListener("touchstart", touchStartBack, false);
    document.getElementById('logined-back').addEventListener("touchstart", touchStartBack, false);
    document.getElementById('login-wec').addEventListener("touchstart", LoginWecAjax, false);
    document.getElementById('login-weibo').addEventListener("touchstart", LoginWeiboAjax, false);
    document.getElementById('login-search').addEventListener("touchstart", touchSearch, false);
    document.getElementById('login-feedback').addEventListener("touchstart", touchFeedback, false);
    document.getElementById('login-collect').addEventListener("touchstart", touchCollect, false);
    document.getElementById('login-about').addEventListener("touchstart", touchAbout, false);
    document.getElementById('clear_sqlite').addEventListener("touchstart", touchClear, false);

}
//点击登录用户的头像
function touchUser() {
    AddGoback(localStorage.N_url, 'indexUser.html');
    // slide('left', 'lightblue', 1, 'indexUser.html');
}
//点击微信登录api身份验证

function LoginWecAjax() {
    var scope = "snsapi_userinfo";
    Wechat.auth(scope, function (response) {
        code = response.code;
        httpGet("Reader/WechatLogin?code=" + code, "", true, ajax_success2, ajax_fail2);
        function ajax_success2(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                access_token = obj.access_token;
                openid = obj.openid;
                //通过access_token和openid获取用户信息
                $.ajax({
                    type: "GET",
                    url: "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid,
                    success: function (data) {
                        document.getElementById('login-collect').removeEventListener("touchstart", touchCollect, false);
                        if (data != null && data != "") {
                            var obj = eval("(" + data + ")");
                            if (obj.headimgurl != null && obj.headimgurl != "") {
                                var headimgurl = obj.headimgurl;
                            }
                            else {
                                var headimgurl = "images/headimg.jpg";
                            }
                            $("#login-box").addClass("Page");
                            $("#logined-box").removeClass("Page");
                            $("#logined-userImg img").attr("src", headimgurl);
                            $("#logined-userName span").html(obj.nickname);
                            db.transaction(function (tx) {
                                tx.executeSql("select * from User", [], function (tx, res) {
                                    if (res.rows.length == 0) {
                                        var type = "0", nickName = "";
                                        httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success3, ajax_fail3);
                                        function ajax_success3(data) {
                                            if (data != null && data != "" && data != undefined) {
                                                var DeviceUserID = data;
                                                var type = "2", nickName = obj.nickname;
                                                httpGet("Reader/Login?UserID=" + DeviceUserID + "&type=" + type + "&value=" + openid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success4, ajax_fail4);
                                                function ajax_success4(data) {
                                                    if (data != null && data != "" && data != undefined) {
                                                        UserID = data;
                                                        UserStatus = "login";
                                                        db.transaction(function (tx) {
                                                            tx.executeSql("replace INTO User (id, LoginState, DeviceUserID, UserID, UserName, UserImg, UserSign, unloginHash, loginHash) VALUES (?,?,?,?,?,?,?,?,?)", [1, "1", DeviceUserID, UserID, obj.nickname, obj.headimgurl, "", "", ""], function (tx, res) {
                                                                ////alert("插入微信登录信息成功");
                                                                Login_Addtable();
                                                            }, function (tx, error) {
                                                                //alert('replace INTO error: ' + error.message);
                                                            });
                                                        }, function (err) {
                                                            //alert('Open database my.db ERROR4: ' + err.message);
                                                        });
                                                    }
                                                };
                                                function ajax_fail4() {

                                                };
                                            }
                                        }
                                        function ajax_fail3() {

                                        }
                                    }
                                    else {
                                        var type = "2", nickName = obj.nickname;
                                        httpGet("Reader/Login?UserID=" + res.rows.item(0).DeviceUserID + "&type=" + type + "&value=" + openid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success5, ajax_fail5);
                                        function ajax_success5(data) {
                                            if (data != null && data != "" && data != undefined) {
                                                UserID = data;
                                                UserStatus = "login";
                                                ////alert("Login--1?" + UserID);
                                                db.transaction(function (tx) {
                                                    tx.executeSql("replace INTO User (id, LoginState, DeviceUserID, UserID, UserName, UserImg, UserSign,unloginHash,loginHash) VALUES (?,?,?,?,?,?,?,?,?)", [1, "1", res.rows.item(0).DeviceUserID, UserID, obj.nickname, obj.headimgurl, "", res.rows.item(0).unloginHash, ""], function (tx, res) {
                                                        ////alert("有设备用户插入登录用户成功");
                                                        Login_Addtable();
                                                    });
                                                }, function (err) {
                                                    //alert('Open database my.db ERROR4: ' + err.message);
                                                });
                                            }
                                        }
                                        function ajax_fail5() {

                                        }
                                    }
                                });
                            }, function (err) {
                                //alert('Open database my.db ERROR2: ' + err.message);
                            });
                        }
                    }
                });
            }
            else {
                //下拉时获取指数为空
            }
        }
        function ajax_fail2(netStatus) {
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
    }, function (reason) {
        ////alert("Failed: " + reason);
    });
}
function LoginWeiboAjax() {
    YCWeibo.ssoLogin(function (args) {
        httpGet("Reader/WeiboRequest?url=" + encodeURIComponent("https://api.weibo.com/2/users/show.json?uid=" + args.userid + "&access_token=" + args.access_token), "", true, ajax_success6, ajax_fail6);
        function ajax_success6(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                if (obj.profile_image_url != null && obj.profile_image_url != "") {
                    var headimgurl = obj.profile_image_url;
                }
                else {
                    var headimgurl = "images/headimg.jpg";
                }
                $("#login-box").addClass("Page");
                $("#logined-box").removeClass("Page");
                $("#logined-userImg img").attr("src", headimgurl);
                $("#logined-userName span").html(obj.name);
                db.transaction(function (tx) {
                    tx.executeSql("select * from User", [], function (tx, res) {
                        if (res.rows.length == 0) {
                            var type = "0", nickName = "";
                            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success7, ajax_fail7);
                            function ajax_success7(data) {
                                if (obj != null && obj != "" && obj != undefined) {
                                    var DeviceUserID = data;
                                    var type = "1", nickName = obj.name;
                                    httpGet("Reader/Login?UserID=" + DeviceUserID + "&type=" + type + "&value=" + obj.id + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success8, ajax_fail8);
                                    function ajax_success8(data) {
                                        if (obj != null && obj != "" && obj != undefined) {
                                            UserID = data;
                                            UserStatus = "login";
                                            db.transaction(function (tx) {
                                                tx.executeSql("replace INTO User (id, LoginState, DeviceUserID, UserID, UserName, UserImg, UserSign, unloginHash, loginHash) VALUES (?,?,?,?,?,?,?,?,?)", [1, "2", DeviceUserID, UserID, obj.name, headimgurl, obj.description, "", ""], function (tx, res) {
                                                    ////alert("插入登录信息成功")
                                                    Login_Addtable();;
                                                });
                                            }, function (err) {
                                                //alert('Open database my.db ERROR4: ' + err.message);
                                            });
                                        }
                                        else {
                                            //下拉时获取指数为空
                                        }
                                    }
                                    function ajax_fail8() {
                                        //下拉时获取指数失败
                                    }
                                }
                                else {
                                    //下拉时获取指数为空
                                }
                            }
                            function ajax_fail7() {
                                //下拉时获取指数失败
                            }

                        }
                        else {
                            var type = "1", nickName = obj.name;
                            httpGet("Reader/Login?UserID=" + res.rows.item(0).DeviceUserID + "&type=" + type + "&value=" + obj.id + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success9, ajax_fail9);
                            function ajax_success9(data) {
                                if (obj != null && obj != "" && obj != undefined) {
                                    UserID = data;
                                    UserStatus = "login";
                                    db.transaction(function (tx) {
                                        tx.executeSql("replace INTO User (id, LoginState, DeviceUserID, UserID, UserName, UserImg, UserSign, unloginHash, loginHash) VALUES (?,?,?,?,?,?,?,?,?)", [1, "2", res.rows.item(0).DeviceUserID, UserID, obj.name, headimgurl, obj.description, res.rows.item(0).unloginHash, ""], function (tx, res) {
                                            // //alert("有设备用户后插入登录信息成功");
                                            Login_Addtable();
                                        });
                                    }, function (err) {
                                        //alert('Open database my.db ERROR4: ' + err.message);
                                    });
                                }
                                else {
                                    //下拉时获取指数为空
                                }
                            }
                            function ajax_fail9() {
                                //下拉时获取指数失败
                            }
                        }
                    })
                }, function (err) {
                    //alert('Open database my.db ERROR3: ' + err.message);
                });
            }
            else {
                //下拉时获取指数为空
            }
        }
        function ajax_fail6() {
            //下拉时获取指数失败
        }
    });
}
//登录后添加相应的前端数据库 表
function Login_Addtable() {
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS item_co_login (ItemID text primary key, Type text, Title text, MediaName text, Tag text, PubDate text, Summary text, Category text, ImageUrl text)');//登录收藏表
        tx.executeSql('CREATE TABLE IF NOT EXISTS OperateID (id integer primary key, OperateID text)');//登录用户操作ID表
        tx.executeSql('CREATE TABLE IF NOT EXISTS Categorys_login (id integer primary key, CategorysID text, Name text, CategorysOrder text, Type text, Link text)');//登录下分类表
        tx.executeSql('CREATE TABLE IF NOT EXISTS SearchRecord_login (Title text primary key, Time text)');//登录搜索记录表
        tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_login (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');//登录其他分类的文章表
        tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_login (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');//登录推荐文章表
        tx.executeSql('CREATE TABLE IF NOT EXISTS Record_Position_login (TopIndex text primary key, PositionX text, PositionY text, ItemID text)');//记录导航上的位置以及当前导航下的新闻位置和新闻的最后一条ItemID
        tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_login (Symbol text,UNIQUE(Symbol))');//记录登录的自选股
        tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_block_login (ID text,UNIQUE(ID))');//记录登录的自选主题
        tx.executeSql('REPLACE INTO Record_TopIndex(id, TopIndex) VALUES (?,?)', [1, 0], function (tx, res) { });
    }, function (e) {
        //alert("Login_AddtableERROR: " + e.message);
    });
    update_lg();
}
//登录成功后更新User表的UserlgID和item_colg表
function update_lg() {
    db.transaction(function (tx) {
        tx.executeSql("select * from User", [], function (tx, res) {
            if (res.rows.item(0).UserlgID != null && res.rows.item(0).UserlgID != "") {
                var hashId = res.rows.item(0).UserlgID;
                db.transaction(function (tx) {
                    tx.executeSql("select * from OperateID where id > (select id from OperateID where OperateID=?)", [hashId], function (tx, res) {
                        var count = res.rows.length;
                        updatelg_ajax(hashId, count);
                    })
                },
                    function (e) {
                        ////alert("1update_lgERROR: " + e.message);
                    });
            }
            else {
                var hashId = "";
                var count = 0;
                updatelg_ajax(hashId, count);
            }
        })
    },
        function (e) {
            //alert("1update_lgERROR: " + e.message);
        });
}
function updatelg_ajax(hashId, count) {
    httpGet("Reader/UserCollection?userID=" + UserID + "&hashId=" + hashId + "&count=" + count, "", true, ajax_success10, ajax_fail10);
    function ajax_success10(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            hashId = obj[obj.length - 1].ID;
            db.transaction(function (tx) {
                tx.executeSql("UPDATE User SET UserlgID=? where id =?", [hashId, 1], function (tx, res) {
                    //////alert("将最后一次ID存入：" + UserlgID);
                })
            }, function (e) {
                ////alert("update_lg1ERROR: " + e.message);
            });
            for (var i = 0; i < obj.length; i++) {
                var TxtSQL = obj[i].TxtSQL;//替换summary里面的单引号
                db.executeSql(TxtSQL, [], function (res) {
                }, function (error) {
                    //alert('TxtSQL1 error: ' + error.message + "&&" + obj[i].ID);
                });
            }
            document.getElementById('login-collect').addEventListener("touchstart", touchCollect, false);
        }
        else {
            //下拉时获取指数为空
        }
    }
    function ajax_fail10() {
        //下拉时获取指数失败
    }
}
//登录页面的搜索
function touchSearch(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'indexSearch.html');
    // slide('left', 'lightblue', 1, 'indexSearch.html');
}
//进入意见反馈
function touchFeedback(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'feedback.html');
    // slide('left', 'lightblue', 1, 'feedback.html');
}
//进入我的收藏
function touchCollect(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'myCollect.html');
    // slide('left', 'lightblue', 1, 'myCollect.html');
}
//进入关于布尔财经
function touchAbout(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'about.html');
    // slide('left', 'lightblue', 1, 'about.html');
}
//清除缓存
function touchClear(event) {
    event.preventDefault();
    $('#my-index').after('<div id="sure"><div class="sure"></div><div class="sure-box"><div class="sure-box-top">确认要清除缓存吗？</div><div class="sure-box-bottom"><div id="sure_ok" class="sure-button">确定</div><div id="cancel_ok" class="cancel-button">取消</div></div></div></div>');
    document.getElementById('sure_ok').addEventListener("touchstart", touchSure, false);
    document.getElementById('cancel_ok').addEventListener("touchstart", touchCancel, false);
}
function touchSure(event) {
    event.preventDefault();
    db.transaction(function (tx) {
        tx.executeSql('delete from Item_list_' + UserStatus + ' where idd not in(select idd from Item_list_' + UserStatus + ' order by idd desc limit 0,10)', [], function (tx, res) {
            tx.executeSql('delete from Record_Position_' + UserStatus, [], function (tx, res) {
                tx.executeSql('delete from SearchRecord_' + UserStatus, [], function (tx, res) {
                    tx.executeSql('delete from Item_list_category_' + UserStatus + ' where idd not in(select idd from Item_list_category_' + UserStatus + ' order by idd desc limit 0,200)', [], function (tx, res) {
                        $('#sure').remove();
                        window.plugins.toast.show("清除缓存成功", 300, "center");
                    })
                })
            })
        })
    }, function (err) {
        //alert('清除缓存问题：' + err.message);
    });

}
function touchCancel(event) {
    event.preventDefault();
    $('#sure').remove();
}

//判断网址后面是否带参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function touchStartBack(event) {
    event.preventDefault();
    backHistory();
}
function backHistory() {
    Gotoback();
}
