var nullu = "", NowVerision = "2.0", UserID = "";
var db;
var UserStatus = "unlogin";
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
            keytouch();
            db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                db.transaction(function (tx) {
                    SelectUser(tx);
                }, function (err) {
                    // alert('Open database my.db ERROR11: ' + err.message);
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
                    bind_tag();
                    bind_record();
                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO User (id, LoginState, DeviceUserID) VALUES (?,?,?)", [1, "0", UserID], function (tx, res) {
                            //alert("插入设备登录信息成功");
                        });
                    }, function (err) {
                        // alert('Open database my.db ERROR4: ' + err.message);
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
                bind_tag();
                bind_record();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    bind_tag();
                    bind_record();
                }
            }

        }
    });
}
//绑定toch事件
function Touch() {
    document.getElementById('clear-record').addEventListener("touchstart", touchStartClearRecord, false);
    document.getElementById('search-cancel').addEventListener("touchstart", touchStartCancel, false);
    touchback();
    //隐藏软键盘
    $(document).on('touchstart', function (e) {
        if (!$(e.target).is('#search-input') && $('#search-input').is(':focus')) {
            document.activeElement.blur();
        }
    });
}
function keytouch() {
    $('#search-input').on('keyup', function (e) {
        var theEvent = e || window.event;
        var keyPressed = theEvent.keyCode || theEvent.which;
        if (keyPressed == 13) {
            //alert("点击了键盘的搜索");
            if ($("#search-input").val() != "") {
                db.transaction(function (tx) {
                    var myDate = new Date();
                    tx.executeSql('replace INTO SearchRecord_' + UserStatus + '  (Title, Time) VALUES (?,?)', [$("#search-input").val(), myDate.getTime()], function (tx, res) {
                        var SearchKey = encodeURI(encodeURI($("#search-input").val()));
                        AddGoback(localStorage.N_url, 'searchResult.html?SearchKey=' + SearchKey);
                        // slide('left', 'lightblue', 1, 'searchResult.html?SearchKey=' + SearchKey);
                    });
                }, function (err) {
                    // alert('Open database my.db ERROR2: ' + err.message);
                });
            }

        }
        return true;
    });
}
//近期热点
function bind_tag() {
    var tagList = "";
    httpGet("Reader/HotKeywords?count=12", "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                tagList = '<li id="tagList' + i + '">' + obj[i] + '</li>';
                $("#search-tag ul").append(tagList);
                bind_tagList("tagList" + i);
            }
        }
        else {
            //下拉时获取指数为空
        }
    }
    function ajax_fail2() {
        $("#search-tag").append('<div id="refeshTag" style="position:relative;width:100%;height:100px;"><div class="refesh"><img style="width:50px;" src="images/no_content.png"/><br><span>加载失败，点我刷新</span></div><div>');
        $("#refeshTag").bind("click", function (event) {
            $("#refeshTag").remove();
            bind_tag();
        })
    }
}
//搜索记录
function bind_record() {
    var recordList = "";
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS SearchRecord_' + UserStatus + '(Title text primary key, Time text)');
        tx.executeSql('select * from SearchRecord_' + UserStatus + ' order by Time desc', [], function (tx, res) {
            if (res.rows.length > 5) {
                var top5 = res.rows.item(4).Time;
                tx.executeSql('delete from SearchRecord_' + UserStatus + ' where Time < ?', [top5], function (tx, res) {
                    tx.executeSql('select * from SearchRecord_' + UserStatus + '  order by Time desc', [], function (tx, res) {
                        if (res.rows.length == 0) {
                            $("#no-record").removeClass("Page");
                            $("#have-record").addClass("Page");
                        }
                        else {
                            for (var i = 0; i < res.rows.length; i++) {
                                recordList = '<li id="searchAdd' + i + '"><div class="float-left"><p>' + res.rows.item(i).Title + '</p></div><div id="searchDelete' + i + '" class="float-right"><input type="hidden" value="' + res.rows.item(i).Title + '" class="hidden"><img src="images/search_delete.png" class="search-more"></div><div class="clear"></div></li>';
                                $("#have-record #clear-record").before(recordList);
                                bind_recordList("searchAdd" + i);
                                bind_recordList1("searchDelete" + i);
                            }
                        }
                    })
                });
            }
            else {
                tx.executeSql('delete from SearchRecord_' + UserStatus + ' where Time < ?', [top5], function (tx, res) {
                    tx.executeSql('select * from SearchRecord_' + UserStatus + '  order by Time desc', [], function (tx, res) {
                        if (res.rows.length == 0) {
                            $("#no-record").removeClass("Page");
                            $("#have-record").addClass("Page");
                        }
                        else {
                            for (var i = 0; i < res.rows.length; i++) {
                                recordList = '<li id="searchAdd' + i + '"><div class="float-left"><p>' + res.rows.item(i).Title + '</p></div><div id="searchDelete' + i + '"  class="float-right"><input type="hidden" value="' + res.rows.item(i).Title + '" class="hidden"><img src="images/search_delete.png" class="search-more"></div><div class="clear"></div></li>';
                                $("#have-record #clear-record").before(recordList);
                                bind_recordList("searchAdd" + i);
                                bind_recordList1("searchDelete" + i);
                            }
                        }
                    })
                });
            }
        });
    }, function (err) {
        // alert('Open database my.db ERROR3: ' + err.message);
    });
}
//搜索每条记录touch事件
function bind_recordList(id) {
    document.getElementById(id).addEventListener("touchstart", touchStartRecord, false);
}
function bind_recordList1(id) {
    document.getElementById(id).addEventListener("touchstart", function (event) {
        event.stopPropagation();
        event.preventDefault();
        var title = $(this).find('.hidden').val();
        db.transaction(function (tx) {
            tx.executeSql('delete from SearchRecord_' + UserStatus + ' where Title=?', [title], function (tx, res) {
                $('#' + id).parents('li').remove();
                if ($('#have-record').find('li').length < 2) {
                    $("#no-record").removeClass("Page");
                    $("#have-record").addClass("Page");
                }
            });
        }, function (err) {
            // alert('Open database my.db ERROR4: ' + err.message);
        });
    }, false);
}
//近期热点每条记录touch事件
function bind_tagList(id) {
    document.getElementById(id).addEventListener("touchstart", touchStartTag, false);
}
//清空搜索记录
function touchStartClearRecord(event) {
    event.preventDefault();
    db.transaction(function (tx) {
        tx.executeSql('delete from SearchRecord_' + UserStatus, [], function (tx, res) {
        });
    }, function (err) {
        // alert('Open database my.db ERROR4: ' + err.message);
    });
    $("#no-record").removeClass("Page");
    $("#have-record").addClass("Page");
}
//取消搜索
function touchStartCancel(event) {
    event.preventDefault();
    Gotoback();
}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    Gotoback();
}
function touchStartRecord(event) {
    event.preventDefault();
    $("#search-input").val($(this).find(".float-left p").html());
    db.transaction(function (tx) {
        var myDate = new Date();
        tx.executeSql('replace INTO SearchRecord_' + UserStatus + '  (Title, Time) VALUES (?,?)', [$("#search-input").val(), myDate.getTime()], function (tx, res) {
            var SearchKey = encodeURI(encodeURI($("#search-input").val()));
            //alert("一次加锁：" + encodeURI($("#search-input").val()));
            //alert("二次加锁：" + encodeURI(encodeURI($("#search-input").val())));
            //alert("一次加锁后解锁：" + decodeURI(encodeURI($("#search-input").val())));
            //alert("一次加锁后解锁：" + decodeURI(decodeURI(encodeURI($("#search-input").val()))));
            AddGoback(localStorage.N_url, 'searchResult.html?SearchKey=' + SearchKey);
            // slide('left', 'lightblue', 1, 'searchResult.html?SearchKey=' + SearchKey);
        });
    }, function (err) {
        // alert('Open database my.db ERROR5: ' + err.message);
    });
}
function touchStartTag(event) {
    event.preventDefault();
    $("#search-input").val($(this).html());
    db.transaction(function (tx) {
        var myDate = new Date();
        tx.executeSql('replace INTO SearchRecord_' + UserStatus + '  (Title, Time) VALUES (?,?)', [$("#search-input").val(), myDate.getTime()], function (tx, res) {
            var SearchKey = encodeURI(encodeURI($("#search-input").val()));
            AddGoback(localStorage.N_url, 'searchResult.html?SearchKey=' + SearchKey);
            // slide('left', 'lightblue', 1, 'searchResult.html?SearchKey=' + SearchKey);
        });
    }, function (err) {
        // alert('Open database my.db ERROR6: ' + err.message);
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
            Gotoback();
        }
    });
}

