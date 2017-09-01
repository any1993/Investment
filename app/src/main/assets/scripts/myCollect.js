//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "";
var db;
var UserStatus = "unlogin";
// var AccessToken;
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
    }
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
                            bind();
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
                bind();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    bind();
                }
            }

        }
    });
}
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById("collect-edit").addEventListener("touchstart", touchStartEdit, false);
    touchback();
}
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
function touchStartEdit(event) {
    var $coli = $("#collectlist li");
    if ($("#collect-edit").html() == "完成") {
        $("#collect-edit").html("编辑");
        $coli.each(function (i) {
            $coli.eq(i).find(".location").removeClass("right-remove");
            $coli.eq(i).find(".delete-collect").remove();
        })
    }
    else {
        $("#collect-edit").html("完成");
        $coli.each(function (i) {
            $coli.eq(i).find(".location").addClass("right-remove");
            $coli.eq(i).find(".location").before('<div id="delete' + $(this).find(".location").attr('id') + '" class="delete-collect"><img src="images/icon-deleCo.png"></div>');
            document.getElementById("delete" + $(this).find(".location").attr('id')).addEventListener("touchstart", touchDelcollect, false);
        })
    }
}
function bind() {
    setTimeout(function () {
        var strlist = '';
        db.transaction(function (tx) {
            tx.executeSql('select * from item_co_' + UserStatus, [], function (tx, res) {
                if (res != null && res.rows != null && res.rows.length > 0) {
                    for (var i = res.rows.length - 1; i >= 0; i--) {
                        bind_list(res.rows.item(i))
                    }
                    runing();
                }
                else {
                    //alert("没有收藏文章");
                    $('#collectlist').append('<div style="padding-top:100px"><img style="width:130px; padding:10px 0;" src="images/no_collect.png"/></div><div style="color:#999">没有收藏文章</div>');
                    $('.top-more').addClass('Page');
                }
            });
        },
            function (e) {
                alert("itemListInAndSe3ERROR: " + e.message);
            });
    }, 500);

}

//删除我的收藏里面的新闻
function touchDelcollect(event) {
    event.stopPropagation();
    id = $(this).attr("id");
    var liID = id.replace("delete", "");
    var newsType = $("#" + liID).find(".type").val();
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: liID, LogTime: myDate.getTime(), LogState: 7, Type: newsType }; //用户取消收藏文章的行为

    $('.mycoll-page').after('<div id="sure"><div class="sure"></div><div class="sure-box"><div class="sure-box-top">确认要清除缓存吗？</div><div class="sure-box-bottom"><div id="sure_ok" class="sure-button">确定</div><div id="cancel_ok" class="cancel-button">取消</div></div></div></div>')
    document.getElementById('sure_ok').addEventListener("touchstart", touchSure, false);
    document.getElementById('cancel_ok').addEventListener("touchstart", touchCancel, false);
    function touchSure(event) {
        event.preventDefault();
        $('#sure').remove();
        var $coli = $("#collectlist li");
        $("#collect-edit").html("编辑");
        $coli.each(function (i) {
            $coli.eq(i).find(".location").removeClass("right-remove");
            $coli.eq(i).find(".delete-collect").remove();
        })
        Delcollectajax(BehaviorLogData, liID);
    }
    function touchCancel(event) {
        event.preventDefault();
        $('#sure').remove();
        var $coli = $("#collectlist li");
        $("#collect-edit").html("编辑");
        $coli.each(function (i) {
            $coli.eq(i).find(".location").removeClass("right-remove");
            $coli.eq(i).find(".delete-collect").remove();
        })
    }
}
function AuthorizeDelcollect(BehaviorLogData, liID) {
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
                                    Delcollectajax(BehaviorLogData, liID);
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
                    Delcollectajax(BehaviorLogData, liID);
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
                                        Delcollectajax(BehaviorLogData, liID);
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
function Delcollectajax(BehaviorLogData, liID) {
    // $.ajax({
    //     type: "post",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader("Authorization", AccessToken);
    //     },
    //     url: "https://api.palaspom.com/Reader/UserBehaviorLog",
    //     data: BehaviorLogData,
    //     success: function (data) {
    //         if (UserStatus == "login") {
    //             update_ID(data);
    //         }
    //     }
    // });
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (UserStatus == "login") {
            update_ID(obj);
        }
    }
    function ajax_fail2() {
        //下拉时获取指数失败
    }
    delete_co(liID);
    $("#" + liID).parents("li").fadeOut(500);
}
//从前端数据库取数据往下添加
function bind_list(obj) {
    var strhot = '', strlist = '';
    strlist = '<li class="deleteli"><div style="overflow:hidden"><div class="lis"><div id="' + obj.ItemID + '" class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" value="' + obj.Type + '"><div class="smallPic-title"><p>' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
    if (getTimeInOneHour(obj.PubDate)) {
        strlist += '<span class="time-red">' + getTimeDiff(obj.PubDate) + '</span>';
    }
    else {
        strlist += '<span>' + getTimeDiff(obj.PubDate) + '</span>';
    }
    if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined && obj.Tag != "null") {
        var tag = obj.Tag.split(",");
        for (var j = 0; j < tag.length; j++) {
            if (tag[j].indexOf(":") != -1) {
                strlist += '<span class="tag-label">' + tag[j].substring(0, tag[j].indexOf(":")) + '</span>';
            }
            else {
                strlist += '<span class="tag-label">' + tag[j] + '</span>';
            }
        }
    }
    strlist += '</span></div></a></div></div></div></li>';
    $('#collectlist').append(strlist);
    bind_indexlist(obj.ItemID);
}
//绑定收藏列表的点击事件
function bind_indexlist(id) {
    $("#" + id).bind("click", function (event) {
        event.stopPropagation();
        var myDate = new Date();
        var newsType = $(this).find('.type').val();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: newsType }; //用户进入文章行为需要传的参数
        GotoNews(BehaviorLogData, id, newsType);
    })
}
function AuthorizeNews(BehaviorLogData, id, newsType) {
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
                                    GotoNews(BehaviorLogData, id, newsType);
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
                    GotoNews(BehaviorLogData, id, newsType);
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
                                        GotoNews(BehaviorLogData, id, newsType);
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
function GotoNews(BehaviorLogData, id, newsType) {
    // $.ajax({
    //     type: "post",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader("Authorization", AccessToken);
    //     },
    //     url: "https://api.palaspom.com/Reader/UserBehaviorLog",
    //     data: BehaviorLogData,
    //     success: function (data) {
    //         slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType + '&fromPage=myCollect');
    //     },
    //     error: function () {
    //         window.plugins.toast.showShortCenter("无网络，请连接网络后打开APP");
    //     }
    // });
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType);
        // slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType + '&fromPage=myCollect');
    }
    function ajax_fail3() {
        //下拉时获取指数失败
    }
}
function update_ID(data) {
    db.transaction(function (tx) {
        tx.executeSql("insert INTO OperateID (OperateID) VALUES(?)", [data], function (tx, res) {
            ////alert("添加成功");
        });
    },
        function (e) {
            //alert("update_ID1ERROR: " + e.message);
        });
}
//取消收藏
function delete_co(id) {
    db.transaction(function (tx) {
        tx.executeSql("delete from item_co_" + UserStatus + "  where ItemID =?", [id], function (tx, res) {
        });
    }, function (e) {
        alert("update_co1ERROR: " + e.message);
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
            // slide('right', 'lightblue', 1, 'indexMy.html');
            Gotoback();
        }
    });
}
//列表页所有图片随屏滚动显示
function runing() {
    ////alert("runing");
    var $winH = $(window).height();//获取窗口高度
    var $img = $(".infoList img");
    var $imgH = parseInt($img.height() / 100);//图片到一半的时候显示
    var $srcDef = "a.gif";

    $img.each(function (i) {//遍历img
        if ($img.eq(i).attr("src") == "images/news_default.png" || $img.eq(i).attr("src") == "images/hot_default.png") {//如果图片加载失败,用我们的备用图
            var $src = $img.eq(i).attr("original");//获取当前img URL地址
            var $scroTop = $img.eq(i).offset();//获取图片位置
            if ($scroTop.top + $imgH >= $(window).scrollTop() && $(window).scrollTop() + $winH >= $scroTop.top + $imgH) {//判断窗口至上往下的位置
                if ($img.eq(i).attr("src") == $srcDef) {
                    $img.eq(i).hide();
                }
                //$img.eq(i).attr("src", function () { return $src }).fadeIn(300);//元素属性的交换  zepto没有fadeIn和fadeOut
                $img.eq(i).attr("src", $src);
            }
        }
    })
}