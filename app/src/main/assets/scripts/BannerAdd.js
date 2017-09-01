//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "";
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var choseCategory = new Array();
var db;
$(function () {
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
})
//从用户表中获取用户信息和登录状态
function SelectUser(tx) {
    // /("测试进入SelectUser");
    tx.executeSql('select * from User', [], function (tx, res) {
        if (res.rows.length == 0) {
            var type = "0", nickName = "";
            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success1, ajax_fail1);
            function ajax_success1(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    UserID = obj;
                    UserStatus = "unlogin";
                    db.transaction(function (tx) {
                        tx.executeSql('replace INTO User (id, DeviceUserID, LoginState) VALUES (?,?,?)', [1, UserID, "0"], function (tx, res) {
                            //从缓存中取数据
                            bind_info();
                            // categorysSe();
                        });
                    }, function (e) {
                        // alert('Open db database ERROR5: ' + err.message);
                    });
                }
                else {
                    //用户没有
                }
            }
            function ajax_fail1() {
                $("#loading").addClass("Page");
                $(".info-page").addClass("Page");
                $("#app-info").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
                $("#refesh").bind("click", function (event) {
                    $('#refesh').remove();
                    $("#loading").removeClass("Page");
                    $("#info-page").removeClass("Page");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                })
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
    document.getElementById("icon-back").addEventListener("touchstart", backHistory, false);
    // touchback();
    // sortable();
    // banner_delete();
    // banner_add();
}
function sortable() {
    var bar = document.getElementById("banner_bar_move");
    Sortable.create(bar, { group: "omega" });
}
function banner_delete() {
    $("#banner_edit").unbind();
    $("#banner_edit").bind("click", function () {
        if ($(this).html() == "编辑") {
            $(this).html("完成");
            bannerli_delete();
        }
        else {
            $(this).html("编辑");
            $("#banner_bar_move li").each(function (i) {
                // if (i != 0) {
                $(this).find('.banner_delete').addClass("Page");
                // }
            })
        }
    })
}
function bannerli_delete() {
    var $bali = $("#banner_bar_move li");
    $bali.each(function (i) {
        $(this).find('.banner_delete').removeClass("Page");
        $(this).find('.banner_delete').unbind();
        $(this).find('.banner_delete').bind("click", function () {
            document.getElementById($(this).parent().attr("id")).removeEventListener();
            $(this).parents('li').remove();
            $('#banner_choseing').find('.clear').before('<li><div id="' + $(this).parent().attr("id") + '"><input type="hidden" value="' + $(this).parent().find('.hidden').val() + '" Name="' + $(this).parent().find('.hidden').attr('Name') + '" Rule="' + $(this).parent().find('.hidden').attr('Rule') + '" CType="' + $(this).parent().find('.hidden').attr('CType') + '" Link="' + $(this).parent().find('.hidden').attr('Link') + '" class="hidden">' + $(this).parent().text() + '</div></li>');
            banner_add();
        })
    })
}
function banner_add() {
    var $bali1 = $("#banner_choseing ul li");
    $bali1.each(function (i) {
        $(this).find("div").unbind();
        $(this).find("div").bind("click", function () {
            $(this).parents('li').remove();
            if ($("#banner_edit").html() == "完成") {
                if ($(this).attr("id") == 'Topic' || $(this).attr("id") == 'PushHistory') {
                    $('#banner_bar_move').find('.clear').before('<li><div id="' + $(this).attr("id") + '"><input type="hidden" value="' + $(this).find('.hidden').val() + '" Name="' + $(this).find('.hidden').attr('Name') + '" Rule="' + $(this).find('.hidden').attr('Rule') + '" CType="' + $(this).find('.hidden').attr('CType') + '" Link="' + $(this).find('.hidden').attr('Link') + '" class="hidden">' + $(this).text() + '<img class="banner_new" src="images/subscribe_new.png"/></div></li>');
                }
                else {
                    $('#banner_bar_move').find('.clear').before('<li><div id="' + $(this).attr("id") + '"><input type="hidden" value="' + $(this).find('.hidden').val() + '" Name="' + $(this).find('.hidden').attr('Name') + '" Rule="' + $(this).find('.hidden').attr('Rule') + '" CType="' + $(this).find('.hidden').attr('CType') + '" Link="' + $(this).find('.hidden').attr('Link') + '" class="hidden"><img class="banner_delete" src="images/subscribe_delete.png"/>' + $(this).text() + '<img class="banner_new" src="images/subscribe_new.png"/></div></li>');
                    bannerli_delete();
                }
            }
            else {
                if ($(this).attr("id") == 'Topic' || $(this).attr("id") == 'PushHistory') {
                    $('#banner_bar_move').find('.clear').before('<li><div id="' + $(this).attr("id") + '"><input type="hidden" value="' + $(this).find('.hidden').val() + '" Name="' + $(this).find('.hidden').attr('Name') + '" Rule="' + $(this).find('.hidden').attr('Rule') + '" CType="' + $(this).find('.hidden').attr('CType') + '" Link="' + $(this).find('.hidden').attr('Link') + '" class="hidden">' + $(this).text() + '<img class="banner_new" src="images/subscribe_new.png"/></div></li>');
                }
                else {
                    $('#banner_bar_move').find('.clear').before('<li><div id="' + $(this).attr("id") + '"><input type="hidden" value="' + $(this).find('.hidden').val() + '" Name="' + $(this).find('.hidden').attr('Name') + '" Rule="' + $(this).find('.hidden').attr('Rule') + '" CType="' + $(this).find('.hidden').attr('CType') + '" Link="' + $(this).find('.hidden').attr('Link') + '" class="hidden"><img class="banner_delete Page" src="images/subscribe_delete.png"/>' + $(this).text() + '<img class="banner_new" src="images/subscribe_new.png"/></div></li>');
                }

            }
        })
    })
}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//从前端数据库或者服务器去取数据
function bind_info() {
    httpGet("Reader/Categorys?userID=" + UserID + "&hash=" + "" + "&version=" + "1.1", "", true, ajax_success1, ajax_fail1);
}
function ajax_success1(obj) {
    if (obj != null && obj != "" && obj != undefined) {
        if (obj.Categorys != null && obj.Categorys != "" && obj.Categorys != undefined) {
            for (var i = 0; i < obj.Categorys.length; i++) {
                if (obj.Categorys[i].Rule == null) {
                    var CRule = "";
                }
                else {
                    var CRule = obj.Categorys[i].Rule;
                }
                if (obj.Categorys[i].Link == null) {
                    var CLink = "";
                }
                else {
                    var CLink = obj.Categorys[i].Link;
                }
                if (i == 0) {
                    $('#banner_bar').find('#banner_bar_move').before('<li><div id="' + obj.Categorys[i].Id + '"><input type="hidden" value="' + obj.Categorys[i].Id + '" Name="' + obj.Categorys[i].Name + '" Rule="' + CRule + '" CType="' + obj.Categorys[i].Type + '" Link="' + CLink + '" class="hidden"><img class="banner_delete Page" src="images/subscribe_delete.png" />' + obj.Categorys[i].Name + '<img class="banner_new Page"src="images/subscribe_new.png" /></div></li>');
                }
                else {
                    if (obj.Categorys[i].Id == 'Topic' || obj.Categorys[i].Id == 'PushHistory') {
                        $('#banner_bar_move').find('.clear').before('<li><div id="' + obj.Categorys[i].Id + '"><input type="hidden" value="' + obj.Categorys[i].Id + '" Name="' + obj.Categorys[i].Name + '" Rule="' + CRule + '" CType="' + obj.Categorys[i].Type + '" Link="' + CLink + '" class="hidden">' + obj.Categorys[i].Name + '<img class="banner_new Page"src="images/subscribe_new.png" /></div></li>');
                    }
                    else {
                        $('#banner_bar_move').find('.clear').before('<li><div id="' + obj.Categorys[i].Id + '"><input type="hidden" value="' + obj.Categorys[i].Id + '" Name="' + obj.Categorys[i].Name + '" Rule="' + CRule + '" CType="' + obj.Categorys[i].Type + '" Link="' + CLink + '" class="hidden"><img class="banner_delete Page" src="images/subscribe_delete.png" />' + obj.Categorys[i].Name + '<img class="banner_new Page"src="images/subscribe_new.png" /></div></li>');
                    }
                }

            }
            sortable();//我的频道可以滑动设置
            banner_delete();//我的频道可以删除设置
            $('.info-page').removeClass('Page');
            $('#loading').addClass('Page');
            httpGet("Reader/Categorys?userID=" + "all" + "&hash=" + "" + "&version=" + "1.1", "", true, ajax_success2, ajax_fail2);
            function ajax_success2(objAll) {
                if (objAll != null && objAll != "" && objAll != undefined) {
                    if (objAll.Categorys != null && objAll.Categorys != "" && objAll.Categorys != undefined) {
                        for (var j = 0; j < objAll.Categorys.length; j++) {
                            var SameTag = 0;
                            for (var i = 0; i < obj.Categorys.length; i++) {
                                if (obj.Categorys[i].Id == objAll.Categorys[j].Id) {
                                    SameTag = 1;
                                }
                            }
                            if (!SameTag) {
                                if (objAll.Categorys[j].Rule == null) {
                                    var CRule = "";
                                }
                                else {
                                    var CRule = objAll.Categorys[j].Rule;
                                }
                                if (objAll.Categorys[j].Link == null) {
                                    var CLink = "";
                                }
                                else {
                                    var CLink = objAll.Categorys[j].Link;
                                }
                                $('#banner_choseing').find('.clear').before('<li><div id="' + objAll.Categorys[j].Id + '"><input type="hidden" value="' + objAll.Categorys[j].Id + '" Name="' + objAll.Categorys[j].Name + '" Rule="' + CRule + '" CType="' + objAll.Categorys[j].Type + '" Link="' + CLink + '" class="hidden">' + objAll.Categorys[j].Name + '</div></li>');
                            }
                        }
                        banner_add();//更多频道可以点击添加到我的频道设置
                    }
                }
            }
            function ajax_fail2() {
                //文章获取为空
            }
        }
    }
    else {
    }
}
function ajax_fail1() {
    $("#loading").addClass("Page");
    $(".info-page").addClass("Page");
    $("#app-info").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
    $("#refesh").bind("click", function (event) {
        $('#refesh').remove();
        $("#loading").removeClass("Page");
        $("#info-page").removeClass("Page");
        setTimeout(function () {
            bind_info();
        }, 1000);
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
    $("body").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            backHistory();
        }
    });
}
function touchStartBack(event) {
    event.preventDefault();
    backHistory();
}
//返回到资讯
function backHistory() {
    $("#banner_bar").find('li').each(function (i) {
        choseCategory[i] = { Id: $(this).find('.hidden').val(), Name: $(this).find('.hidden').attr('Name'), Rule: $(this).find('.hidden').attr('Rule'), Order: i, Type: $(this).find('.hidden').attr('CType'), Link: $(this).find('.hidden').attr('Link') };
    })
    UpdateCategorysData = { UserID: UserID, Version: '1.1', Categorys: choseCategory };
    httpPost("Reader/UpdateCategorys", UpdateCategorysData, true, ajax_success3, ajax_fail3);

}
function ajax_success3(obj) {
    categorysInAndSe(obj);
}
function ajax_fail3() {
    Gotoback();
}
//将用户分类的数据插入前端数据库
function categorysInAndSe(obj) {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS Categorys_' + UserStatus);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Categorys_' + UserStatus + ' (id integer primary key, CategorysID text, Name text, CategorysOrder text, Type text, Link text)');
    }, function (e) {
    });
    db.transaction(function (tx) {
        tx.executeSql("UPDATE User SET " + UserStatus + "Hash =? where id =?", [obj, 1], function (tx, res) {
        })
    }, function (e) {
    });
    db.transaction(function (tx) {
        for (var i = 0; i < choseCategory.length; i++) {
            tx.executeSql('INSERT INTO Categorys_' + UserStatus + ' (CategorysID, Name, CategorysOrder, Type, Link) VALUES(?,?,?,?,?)', [choseCategory[i].Id, choseCategory[i].Name, i, choseCategory[i].Type, choseCategory[i].Link], function (tx, res) {
            });
        }
        setTimeout(function () {
            Gotoback();
        }, 200);
    }, function (e) {
        // alert("categorys1ERROR: " + e.message);
    });
}
