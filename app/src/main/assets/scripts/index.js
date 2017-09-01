// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var myScroll, myScrollMore = new Array();
var pullDownEl, pullDownL, pullDownI;
var pullUpEl, pullUpL, pullUpI;
var pullDownElMore = new Array(), pullDownLMore = new Array(), pullDownIMore = new Array();
var pullUpElMore = new Array(), pullUpLMore = new Array(), pullUpIMore = new Array();
var loadingStep = 0, loadingStepMore = new Array(); //loadingStep为推荐下上拉下拉状态，loadingStepMore为其他上部标签上拉下拉状态
var t_img; // 定时器
var isLoad = true; // 控制变量
var Auditing = 0, nullu = "", category = "Recommend", categoryName = "推荐", NowVerision = "2.0", UserID = "", AppModel = "2.5.0";//是否显示登录界面   //空字符  //目前版本   //用户标识
var db, dbV, dbVNowversion = "2.1"; //前端数据库定义
var UserStatus = "unlogin"; //记录用户登录状态
var TopIndex = "0"; //0为上部标签是推荐，不是0，则为其他标签位置
var stockids = "sh000001,sz399001,sz399006";//大盘指数
var PositionX = 0, PositionY = 0;
var AccessToken;
var CategoryHash = "";
var HPushDate = new Array();
var ajaxing;
var Push_lastMouth, startTime, endTime;
var mySwiper, myLeadSwiper;
var Scroll_yStart = 0, Scroll_yEnd = 0;
var Scroll_yStartMore = [0], Scroll_yEndMore = ["0"];
(function () {
    // StatusBar.hide();
    "use strict";
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        // StatusBar.styleLightContent()
        // device.cordova
        // device.model
        // device.platform
        // device.uuid
        // device.version
        // device.manufacturer
        // device.isVirtual
        // device.serial
        // alert("device.cordova=" + device.cordova + " && device.model=" + device.model + " && device.platform=" + device.platform + " && device.version=" + device.version + " && device.manufacturer=" + device.manufacturer + " && device.isVirtual=" + device.isVirtual + " && device.serial=" + device.serial);
        //定义iscroll的变量
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        jpushEffect();
        ClearGoback();
        $("#app-index").removeClass("Page");
        setTimeout(function () {
            document.getElementById('opp').addEventListener("touchstart", touchOpp, false);
            document.getElementById('my').addEventListener("touchstart", touchMy, false);
            document.getElementById('Abanner_add').addEventListener("touchstart", touchBannerAdd, false);
            document.getElementById('icon_My').addEventListener("touchstart", touchicon_My, false);

            //搜索
            document.getElementById('search_button').addEventListener('touchstart', function (event) {
                event.preventDefault();
                event.stopPropagation();
                AddGoback('indexNews.html?firstLoad=no', 'indexSearch.html');
            }, false)
            // touchimg();
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
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            //判断是不是重新打开app
            if (GetQueryString("firstLoad") == "no") {
                db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                    db.transaction(function (tx) {
                        // tx.executeSql('select * from Record_TopIndex where id=?', [1], function (tx, res) {
                        //     if (res.rows.length > 0) {
                        //         TopIndex = res.rows.item(0).TopIndex;
                        //     }
                        //     else {
                        //         TopIndex = "0";
                        //     }
                        // });
                        opTableSecond(tx);
                    }, function (e) {
                        // alert("itemListInAndSe1ERROR: " + e.message);
                    });
                });
                // if (sessionStorage.W_TopIndex == undefined || sessionStorage.W_TopIndex == "" || sessionStorage.W_category == undefined || sessionStorage.W_category == "") {
                //     TopIndex = "0";
                // }
                // else {
                //     if ($('#nav-ul li').eq(sessionStorage.W_TopIndex).find('.hidden').val() == sessionStorage.W_category) {
                //         TopIndex = sessionStorage.W_TopIndex;
                //     }
                //     else {
                //         TopIndex = "0";
                //     }
                // }
            }
            else {
                // // 引导页的样式
                // if (localStorage.B_AppModel == undefined || localStorage.B_AppModel == "") {
                //     localStorage.B_AppModel = AppModel;
                //     $("#lead").removeClass("Page");
                //     add_leadSwiper();
                // }
                // else if (localStorage.B_AppModel != AppModel) {
                //     if (parseInt(localStorage.B_AppModel.replace(/\./g, '')) < parseInt(AppModel.replace(/\./g, ''))) {
                //         localStorage.B_AppModel = AppModel;
                //         $("#lead").removeClass("Page");
                //         add_leadSwiper();
                //     }
                // }
                dbV = window.sqlitePlugin.openDatabase({ name: "DBversion.db" }, function (dbV) {
                    dbV.transaction(function (tx) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS db_version (id integer primary key,Version text)');//用来存数据库版本号
                        tx.executeSql('select * from db_version', [], function (tx, res) {
                            //如果没有存APP版本
                            if (res.rows.length == 0) {
                                tx.executeSql('replace into db_version(id, Version) VALUES (?,?)', [1, dbVNowversion], function (tx, res) {
                                    //alert("没有数据库版本,插入新版本");
                                });
                                db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                                    db.transaction(function (tx) {
                                        //alert("没有app版本打开文章数据库");
                                        opTable(tx);
                                    }, function (err) {
                                        // alert('Open db database ERROR1: ' + err.message);
                                    });
                                });
                            }
                            //如果存了APP版本
                            else {
                                if (res.rows.length == 1) {
                                    if (res.rows.item(0).Version == dbVNowversion) {
                                        // alert("测试版本相同");
                                        // tx.executeSql('replace into db_version(id, Version) VALUES (?,?)', [1, "2.0"], function (tx, res) { });
                                        db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                                            db.transaction(function (tx) {
                                                //alert("有app版本打开文章数据库");
                                                opTable(tx);
                                            }, function (err) {
                                                // alert('Open database ERROR2: ' + err.message);
                                            });
                                        });
                                    }
                                    else {
                                        if (res.rows.item(0).Version != dbVNowversion) {
                                            tx.executeSql('replace into db_version(id, Version) VALUES (?,?)', [1, dbVNowversion], function (tx, res) {
                                            });
                                            if (res.rows.item(0).Version == "2.0" && dbVNowversion == "2.1") {
                                                // window.sqlitePlugin.deleteDatabase({ name: "my.db" });
                                                db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                                                    db.transaction(function (tx) {
                                                        //alert("有app版本打开文章数据库");
                                                        // opTable(tx);
                                                        // alert("测试版本不同");
                                                        changetable(tx);
                                                    }, function (err) {
                                                        // alert('Open database ERROR3: ' + err.message);
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }
                                else {
                                    tx.executeSql('delect from db_version where id > 1', [], function (tx, res) {
                                    })
                                    if (res.rows.item(0).Version == dbVNowversion) {
                                        db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                                            db.transaction(function (tx) {
                                                //alert("有app版本打开文章数据库");
                                                opTable(tx);
                                            }, function (err) {
                                                // alert('Open database ERROR2: ' + err.message);
                                            });
                                        });
                                    }
                                    else {
                                        if (res.rows.item(0).Version != dbVNowversion) {
                                            tx.executeSql('replace into db_version(id, Version) VALUES (?,?)', [1, dbVNowversion], function (tx, res) {
                                            });
                                            if (res.rows.item(0).Version == "2.0" && dbVNowversion == "2.1") {
                                                // window.sqlitePlugin.deleteDatabase({ name: "my.db" });
                                                db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                                                    db.transaction(function (tx) {
                                                        //alert("有app版本打开文章数据库");
                                                        // opTable(tx);
                                                        changetable(tx);
                                                    }, function (err) {
                                                        // alert('Open database ERROR3: ' + err.message);
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }, function (e) {
                        // alert("dbV: " + e.message);
                    });
                });

                //dbV.close(function(){alert("dbV close ok")},function(e){alert("dbVclose "+e)});
            }
        }, 100);
    };
    function onPause() {
        //此应用程序已被暂停。保存应用程序状态 
        jpushEffect();
    };

    function onResume() {
        //此应用程序已被重新激活。恢复应用程序的状态 
        jpushEffect();
        // window.location.reload();
    };
})();
//滚动条加载
function loaded() {
    if (TopIndex != "0") {
        if (category != "PushHistory") {
            pullDownElMore[TopIndex] = $('#pullDown' + TopIndex);
            pullDownLMore[TopIndex] = pullDownElMore[TopIndex].find('.pullDownLabel');
            pullDownIMore[TopIndex] = pullDownElMore[TopIndex].find('.pullDownIcon');
            pullDownElMore[TopIndex]['class'] = pullDownElMore[TopIndex].attr('class');
            pullDownElMore[TopIndex].attr('class', '').hide();
        }

        loadingStepMore[TopIndex] = 0;
        pullUpElMore[TopIndex] = $('#pullUp' + TopIndex);
        pullUpLMore[TopIndex] = pullUpElMore[TopIndex].find('.pullUpLabel');
        pullUpIMore[TopIndex] = pullUpElMore[TopIndex].find('.pullUpIcon');
        pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
        pullUpElMore[TopIndex].attr('class', '').hide();

        myScrollMore[TopIndex] = new IScroll('#contentA' + TopIndex, {
            probeType: 2,//probeType：1对性能没有影响。在滚动事件被触发时,滚动轴是不是忙着做它的东西。probeType：2总执行滚动,除了势头,反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意,滚动被迫requestAnimationFrame（即：useTransition：假）。
            scrollbars: true,//有滚动条
            mouseWheel: true,//允许滑轮滚动
            fadeScrollbars: true,//滚动时显示滚动条,默认影藏,并且是淡出淡入效果
            bounce: true,//边界反弹
            interactiveScrollbars: true,//滚动条可以拖动
            shrinkScrollbars: 'scale',// 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.
            click: true,// 允许点击事件
            keyBindings: true,//允许使用按键控制
            momentum: true,// 允许有惯性滑动
        });
        if (category != "PushHistory") {
            Scroll_yStartMore[TopIndex] = 0;
            //滚动时
            myScrollMore[TopIndex].on('scroll', function () {
                if (loadingStepMore[TopIndex] == 0 && !pullDownElMore[TopIndex].attr('class').match('flip|loading') && !pullUpElMore[TopIndex].attr('class').match('flip|loading')) {
                    Scroll_yEndMore[TopIndex] = this.y;
                    if ((Scroll_yStartMore[TopIndex] - Scroll_yEndMore[TopIndex] > 100) && this.y < -50) {
                        $(".main").css("top", "0");
                        $("#Abanner").animate({ top: "-80px" }, 500);
                    }
                    if (Scroll_yEndMore[TopIndex] - Scroll_yStartMore[TopIndex] > 100 || this.y > -50) {
                        $("#Abanner").animate({ top: "0" }, 500);
                        $('.main').each(function () {
                            $(this).css("top", "");
                        })
                    }
                    if (this.y > 30) {
                        pullDownElMore[TopIndex].attr('class', pullUpElMore[TopIndex]['class'])
                        pullDownElMore[TopIndex].show();
                        pullDownLMore[TopIndex].show();
                        pullDownElMore[TopIndex].addClass('flip');
                        myScrollMore[TopIndex].refresh();
                        pullDownIMore[TopIndex].attr("src", "images/PullUp.png");
                        pullDownLMore[TopIndex].html('释放刷新');
                        loadingStepMore[TopIndex] = 1;
                    } else if (this.y < -15 && this.y > -50) {
                        pullDownElMore[TopIndex].attr('class', '').hide();
                    } else if (this.y < (this.maxScrollY - 5)) {
                        //上拉刷新效果
                        pullUpElMore[TopIndex].attr('class', pullUpElMore[TopIndex]['class'])
                        pullUpElMore[TopIndex].show();
                        myScrollMore[TopIndex].refresh();
                        pullUpElMore[TopIndex].addClass('flip');
                        pullUpIMore[TopIndex].attr("src", "images/PullDown.png");
                        pullUpLMore[TopIndex].html('释放加载');
                        loadingStepMore[TopIndex] = 1;
                    }
                }
                if (this.y <= -500) {
                    //点击到顶部--小火箭
                    $('#gotop').removeClass("Page");
                    document.getElementById('gotop').addEventListener("touchstart", function () {
                        $("#Abanner").animate({ top: "0" }, 500);
                        $('.main').each(function () {
                            $(this).css("top", "");
                        })
                        myScrollMore[TopIndex].scrollTo(0, 0, 500);
                        $('#gotop').addClass("Page");
                    }, false);
                }
                else if (this.y > -500) {
                    $('#gotop').addClass("Page");
                }
                runing();
            });
            //滚动完毕
            myScrollMore[TopIndex].on('scrollEnd', function () {
                Scroll_yStartMore[TopIndex] = this.y;
                if (loadingStepMore[TopIndex] == 1) {
                    //上拉事件
                    if (pullUpElMore[TopIndex].attr('class').match('flip|loading')) {
                        pullUpElMore[TopIndex].removeClass('flip').addClass('loading');
                        if (category != "Topic") {
                            db.transaction(function (tx) {
                                tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=? order by idd desc', [category], function (tx, res) {
                                    if ($("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val() == res.rows.item(res.rows.length - 1).ItemID) {
                                        pullUpIMore[TopIndex].addClass("Page");
                                        pullUpLMore[TopIndex].html('无更多数据');
                                        setTimeout(function () {
                                            pullUpIMore[TopIndex].removeClass("Page");
                                            pullUpElMore[TopIndex].removeClass('loading');
                                            pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                                            pullUpLMore[TopIndex].html('上拉加载更多');
                                            pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                                            pullUpElMore[TopIndex].attr('class', '').hide();
                                            myScrollMore[TopIndex].refresh();
                                            loadingStepMore[TopIndex] = 0;
                                        }, 1000);
                                    }
                                    else {
                                        pullUpIMore[TopIndex].attr("src", "images/iconLoading.gif");
                                        pullUpLMore[TopIndex].html('加载中...');
                                        loadingStepMore[TopIndex] = 2;
                                        pullUpAction();
                                    }
                                })
                            }, function (e) {
                                //alert("myScroll.onERROR: " + e.message);
                            });
                        }
                        else {
                            //专题的上拉
                            pullUpIMore[TopIndex].attr("src", "images/iconLoading.gif");
                            pullUpLMore[TopIndex].html('加载中...');
                            loadingStepMore[TopIndex] = 2;
                            pullUpActionTopic();
                        }
                    }
                    //下拉
                    else if (pullDownElMore[TopIndex].attr('class').match('flip|loading')) {
                        pullDownElMore[TopIndex].removeClass('flip').addClass('loading');
                        pullDownIMore[TopIndex].attr("src", "images/iconLoading.gif");
                        pullDownLMore[TopIndex].html('加载中...');
                        loadingStepMore[TopIndex] = 2;
                        if (category == "Topic") {
                            $("#indexlist" + TopIndex).empty();
                        }
                        pullDownAction();
                    }
                }
                else if (loadingStepMore[TopIndex] == 0) {
                    pullDownLMore[TopIndex].hide();
                    pullUpElMore[TopIndex].hide();
                }
                runing();
            });
        }
        else {
            //滚动时
            myScrollMore[TopIndex].on('scroll', function () {
                if (loadingStepMore[TopIndex] == 0 && !pullUpElMore[TopIndex].attr('class').match('flip|loading')) {
                    if (this.y < (this.maxScrollY - 5)) {
                        //上拉刷新效果
                        pullUpElMore[TopIndex].attr('class', pullUpElMore[TopIndex]['class'])
                        pullUpElMore[TopIndex].show();
                        myScrollMore[TopIndex].refresh();
                        pullUpElMore[TopIndex].addClass('flip');
                        pullUpIMore[TopIndex].attr("src", "images/PullDown.png");
                        pullUpLMore[TopIndex].html('释放加载');
                        loadingStepMore[TopIndex] = 1;
                    }
                }

                if (this.y <= -500) {
                    //点击到顶部--小火箭
                    $('#gotop').removeClass("Page");
                    document.getElementById('gotop').addEventListener("touchstart", function () {
                        $("#Abanner").animate({ top: "0" }, 500);
                        $('.main').each(function () {
                            $(this).css("top", "");
                        })
                        myScrollMore[TopIndex].scrollTo(0, 0, 500);
                        $('#gotop').addClass("Page");
                    }, false);
                }
                else if (this.y > -500) {
                    $('#gotop').addClass("Page");
                }
            });
            //滚动完毕
            myScrollMore[TopIndex].on('scrollEnd', function () {
                if (loadingStepMore[TopIndex] == 1) {
                    //上拉事件
                    if (pullUpElMore[TopIndex].attr('class').match('flip|loading')) {
                        pullUpElMore[TopIndex].removeClass('flip').addClass('loading');
                        endTime = startTime;
                        // startTime = endTime - 7 * 24 * 3600;
                        pullUpIMore[TopIndex].attr("src", "images/iconLoading.gif");
                        pullUpLMore[TopIndex].html('加载中...');
                        loadingStepMore[TopIndex] = 2;
                        push_add();
                    }
                }
                else if (loadingStepMore[TopIndex] == 0) {
                    pullUpElMore[TopIndex].hide();
                }
            });
        }
    }
    else {
        pullDownEl = $('#pullDown');
        pullDownL = pullDownEl.find('.pullDownLabel');
        pullDownI = pullDownEl.find('.pullDownIcon');
        pullDownEl['class'] = pullDownEl.attr('class');
        pullDownEl.attr('class', '').hide();


        pullUpEl = $('#pullUp');
        pullUpL = pullUpEl.find('.pullUpLabel');
        pullUpI = pullUpEl.find('.pullUpIcon');
        pullUpEl['class'] = pullUpEl.attr('class');
        pullUpEl.attr('class', '').hide();

        myScroll = new IScroll('#contentA', {
            probeType: 2,//probeType：1对性能没有影响。在滚动事件被触发时,滚动轴是不是忙着做它的东西。probeType：2总执行滚动,除了势头,反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意,滚动被迫requestAnimationFrame（即：useTransition：假）。
            scrollbars: true,//有滚动条
            mouseWheel: true,//允许滑轮滚动
            fadeScrollbars: true,//滚动时显示滚动条,默认影藏,并且是淡出淡入效果
            bounce: true,//边界反弹
            interactiveScrollbars: true,//滚动条可以拖动
            shrinkScrollbars: 'scale',// 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.
            click: true,// 允许点击事件
            keyBindings: true,//允许使用按键控制
            momentum: true,// 允许有惯性滑动
        });
        //滚动时
        myScroll.on('scroll', function () {
            if (loadingStep == 0 && !pullDownEl.attr('class').match('flip|loading') && !pullUpEl.attr('class').match('flip|loading')) {
                // 导航滚动的显示不显示设置
                Scroll_yEnd = this.y;
                if ((Scroll_yStart - Scroll_yEnd > 100) && this.y < -50) {
                    $(".main").css("top", "0");
                    $("#Abanner").animate({ top: "-80px" }, 500);
                }
                if (Scroll_yEnd - Scroll_yStart > 100 || this.y > -50) {
                    $("#Abanner").animate({ top: "0" }, 500);
                    $('.main').each(function () {
                        $(this).css("top", "");
                    })
                }
                if (this.y > 30) {
                    pullDownEl.attr('class', pullUpEl['class'])
                    pullDownEl.show();
                    pullDownL.show();
                    pullDownEl.addClass('flip');
                    myScroll.refresh();
                    pullDownI.attr("src", "images/PullUp.png");
                    pullDownL.html('释放刷新');
                    loadingStep = 1;
                } else if (this.y < -15 && this.y > -50) {
                    pullDownEl.attr('class', '').hide();
                } else if (this.y < (this.maxScrollY - 5)) {
                    // alert(this.y + " && " + this.maxScrollY) 
                    //上拉刷新效果
                    pullUpEl.attr('class', pullUpEl['class'])
                    pullUpEl.show();
                    myScroll.refresh();
                    pullUpEl.addClass('flip');
                    pullUpI.attr("src", "images/PullDown.png");
                    pullUpL.html('释放加载');
                    loadingStep = 1;
                }
            }
            if (this.y <= -500) {
                $('#gotop').removeClass("Page");
                //点击到顶部--小火箭
                document.getElementById('gotop').addEventListener("touchstart", function () {
                    $("#Abanner").animate({ top: "0" }, 500);
                    $('.main').each(function () {
                        $(this).css("top", "");
                    })
                    myScroll.scrollTo(0, 0, 500);
                    $('#gotop').addClass("Page");
                }, false);
            } else if (this.y > -500) {
                $('#gotop').addClass("Page");
            }
            runing();
        });
        //滚动完毕
        myScroll.on('scrollEnd', function () {
            // 导航滚动的显示不显示设置
            Scroll_yStart = this.y;
            if (loadingStep == 1) {
                //上拉事件
                if (pullUpEl.attr('class').match('flip|loading')) {
                    pullUpEl.removeClass('flip').addClass('loading');
                    db.transaction(function (tx) {
                        tx.executeSql('select * from Item_list_' + UserStatus + ' order by idd desc', [], function (tx, res) {
                            if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
                                var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
                            }
                            else {
                                var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
                            }
                            if (lastliId == res.rows.item(res.rows.length - 1).ItemID) {
                                pullUpI.addClass("Page");
                                pullUpL.html('无更多数据');
                                setTimeout(function () {
                                    pullUpI.removeClass("Page");
                                    pullUpEl.removeClass('loading');
                                    pullUpI.attr("src", "images/PullUp.png");
                                    pullUpL.html('上拉加载更多');
                                    pullUpEl['class'] = pullUpEl.attr('class');
                                    pullUpEl.attr('class', '').hide();
                                    myScroll.refresh();
                                    loadingStep = 0;
                                }, 1000);
                            }
                            else {
                                pullUpI.attr("src", "images/iconLoading.gif");
                                pullUpL.html('加载中...');
                                loadingStep = 2;
                                pullUpAction();
                            }
                        })
                    }, function (e) {
                        //alert("myScroll.onERROR: " + e.message);
                    });
                    // alert(this.y + " && " + this.maxScrollY);
                }
                //下拉
                else if (pullDownEl.attr('class').match('flip|loading')) {
                    pullDownEl.removeClass('flip').addClass('loading');
                    pullDownI.attr("src", "images/iconLoading.gif");
                    pullDownL.html('加载中...');
                    loadingStep = 2;
                    pullDownAction();
                }
            }
            else if (loadingStep == 0) {
                // pullDownL.hide();
                pullUpEl.hide();
                pullDownEl.hide();
            }
            runing();
        });
    }
}
function changetable(tx) {
    // alert("测试进入changetable");
    tx.executeSql('alter table User add column unloginHash text', [], function (tx, res) {
        // alert("测试1添加列成功");
    });
    tx.executeSql('alter table User add column loginHash text', [], function (tx, res) {
        // alert("测试2添加列成功");
    });
    tx.executeSql('alter table Item_list_category_unlogin add column PartId text', [], function (tx, res) {
        // alert("测试3添加列成功");
    });
    tx.executeSql('alter table Item_list_category_login add column PartId text', [], function (tx, res) {
        // alert("测试4添加列成功");
    });
    tx.executeSql('alter table Item_list_unlogin add column PartId text', [], function (tx, res) {
        // alert("测试5添加列成功");
    });
    tx.executeSql('alter table Item_list_login add column PartId text', [], function (tx, res) {
        // alert("测试6添加列成功");
    });
    opTable(tx);
}
//第一次打开前端数据库表
function opTable(tx) {
    // alert("测试opTable(tx)");
    tx.executeSql('CREATE TABLE IF NOT EXISTS User (id integer primary key, UserlgID text, LoginState text, DeviceUserID text, UserID text, UserName text, UserImg text, UserSign text, unloginHash text, loginHash text)');//用户表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Categorys_login (id integer primary key, CategorysID text, Name text, CategorysOrder text, Type text, Link text)');//登录下分类表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Categorys_unlogin (id integer primary key, CategorysID text, Name text, CategorysOrder text, Type text, Link text)');//未登录下分类表
    tx.executeSql('DROP TABLE IF EXISTS item_cong');
    tx.executeSql('DROP TABLE IF EXISTS item_colg');
    tx.executeSql('CREATE TABLE IF NOT EXISTS item_co_unlogin (ItemID text primary key, Type text, Title text, MediaName text, Tag text, PubDate text, Summary text, Category text, ImageUrl text)');//未登录收藏表
    tx.executeSql('CREATE TABLE IF NOT EXISTS item_co_login (ItemID text primary key, Type text, Title text, MediaName text, Tag text, PubDate text, Summary text, Category text, ImageUrl text)');//登录收藏表
    tx.executeSql('CREATE TABLE IF NOT EXISTS OperateID (id integer primary key, OperateID text)');//登录用户操作ID表
    tx.executeSql('DROP TABLE IF EXISTS UpdataTime');
    tx.executeSql('CREATE TABLE IF NOT EXISTS updateTime_unlogin (TopIndex text primary key, Time text)');//记录未登录时导航每一条的刷新时间
    tx.executeSql('CREATE TABLE IF NOT EXISTS updateTime_login (TopIndex text primary key, Time text)');//记录登录时导航每一条的刷新时间
    tx.executeSql('DROP TABLE IF EXISTS Search_record_unlogin');
    tx.executeSql('DROP TABLE IF EXISTS Search_record_login');
    tx.executeSql('CREATE TABLE IF NOT EXISTS SearchRecord_unlogin (Title text primary key, Time text)');//未登录搜索记录表
    tx.executeSql('CREATE TABLE IF NOT EXISTS SearchRecord_login (Title text primary key, Time text)');//登录搜索记录表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_unlogin (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');//未登录其他分类的文章表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_login (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');//登录其他分类的文章表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_unlogin (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');//未登录推荐文章表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_login (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');//登录推荐文章表
    tx.executeSql('CREATE TABLE IF NOT EXISTS Record_TopIndex (id integer primary key, TopIndex text)');//记录导航上的位置
    tx.executeSql('CREATE TABLE IF NOT EXISTS Record_Position_unlogin (TopIndex text primary key, PositionX text, PositionY text, ItemID text)');//记录导航上的位置以及当前导航下的新闻位置和新闻的最后一条ItemID
    tx.executeSql('CREATE TABLE IF NOT EXISTS Record_Position_login (TopIndex text primary key, PositionX text, PositionY text, ItemID text)');//记录导航上的位置以及当前导航下的新闻位置和新闻的最后一条ItemID
    tx.executeSql('CREATE TABLE IF NOT EXISTS Record_read_unlogin (id integer primary key, ItemID text, UNIQUE(ItemID))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Record_read_login (id integer primary key, ItemID text, UNIQUE(ItemID))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_unlogin (Symbol text,UNIQUE(Symbol))');//记录未登录的自选股
    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_login (Symbol text,UNIQUE(Symbol))');//记录登录的自选股
    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_block_unlogin (ID text,UNIQUE(ID))');//记录未登录的自选主题
    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_block_login (ID text,UNIQUE(ID))');//记录登录的自选主题
    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_block_login (ID text,UNIQUE(ID))');//记录登录的自选主题

    tx.executeSql('CREATE TABLE IF NOT EXISTS All_stock (Symbol text, StockID text, Name text,SearchSSN text)');//记录所有的股票

    SelectUser(tx);
}
//在打开app情况下进入首页
function opTableSecond(tx) {
    SelectUser(tx);
}
//从用户表中获取用户信息和登录状态
function SelectUser(tx) {
    // alert("测试进入SelectUser");
    tx.executeSql('select * from User', [], function (tx, res) {
        if (res.rows.length == 0) {
            var type = "0", nickName = "";
            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success1, ajax_fail1);
            function ajax_success1(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    UserID = obj;
                    UserStatus = "unlogin";
                    CategoryHash = "";
                    db.transaction(function (tx) {
                        tx.executeSql('replace INTO User (id, DeviceUserID, LoginState) VALUES (?,?,?)', [1, UserID, "0"], function (tx, res) {
                            //从缓存中取数据
                            if (GetQueryString("firstLoad") == "no") {
                                categorysSe();
                            }
                            else {
                                categorys();
                                AllStock();
                            }
                            // 
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
                $("#all").addClass("Page");
                $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
                $("#refesh").bind("click", function (event) {
                    $('#refesh').remove();
                    $("#loading").removeClass("Page");
                    $("#all").removeClass("Page");
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
                // alert("测试7res.rows.item(0).unloginHash=" + res.rows.item(0).unloginHash);
                CategoryHash = res.rows.item(0).unloginHash;
                if (GetQueryString("firstLoad") == "no") {
                    categorysSe();
                }
                else {
                    categorys();
                    AllStock();
                }
                // categorysSe();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    CategoryHash = res.rows.item(0).loginHash;
                    $('#icon_My .HeaderImg_left').attr('src', res.rows.item(0).UserImg);
                    if (GetQueryString("firstLoad") == "no") {
                        categorysSe();
                    }
                    else {
                        categorys();
                        AllStock();
                    }
                    // categorysSe();
                }
            }
        }
    });
}
//判断是否自动更新
function autoUpdate() {
    db.transaction(function (tx) {
        tx.executeSql("select * from updateTime_" + UserStatus + " where TopIndex=?", [TopIndex], function (tx, res) {
            var myDate = new Date();
            if (res.rows.length == 0) {
                tx.executeSql("replace INTO updateTime_" + UserStatus + "(TopIndex,Time) VALUES (?,?)", [TopIndex, myDate.getTime()], function (tx, res) {
                    if (TopIndex == 0) {
                        pullDownEl.show();
                        pullDownL.show();
                        pullDownEl.removeClass('flip').addClass('loading');
                        pullDownI.attr("src", "images/iconLoading.gif");
                        pullDownL.html('加载中...');
                        loadingStep = 2;
                        pullDownAction();
                    }
                    else {
                        if (category != "PushHistory") {
                            pullDownElMore[TopIndex].show();
                            pullDownLMore[TopIndex].show();
                            pullDownElMore[TopIndex].removeClass('flip').addClass('loading');
                            pullDownIMore[TopIndex].attr("src", "images/iconLoading.gif");
                            pullDownLMore[TopIndex].html('加载中...');
                            loadingStepMore[TopIndex] = 2;
                            pullDownAction();
                        }
                    }
                });
            }
            else {
                if (res.rows.length > 0) {
                    var Diffdate = (myDate.getTime() - res.rows.item(0).Time) / 1000 / 60 / 60;//求现在时间和缓存中时间相差小时
                    if (Diffdate > 3) {
                        if (TopIndex == 0) {
                            pullDownEl.show();
                            pullDownL.show();
                            pullDownEl.removeClass('flip').addClass('loading');
                            pullDownI.attr("src", "images/iconLoading.gif");
                            pullDownL.html('加载中...');
                            loadingStep = 2;
                            pullDownAction();
                        }
                        else {
                            if (category != "PushHistory") {
                                pullDownElMore[TopIndex].show();
                                pullDownLMore[TopIndex].show();
                                pullDownElMore[TopIndex].removeClass('flip').addClass('loading');
                                pullDownIMore[TopIndex].attr("src", "images/iconLoading.gif");
                                pullDownLMore[TopIndex].html('加载中...');
                                loadingStepMore[TopIndex] = 2;
                                pullDownAction();
                            }
                        }
                    }
                    else {
                        ////alert("更新时间没有超过3小时,不用更新");
                    }
                }
            }
        });
    }, function (e) {

    });

}
//获取所有的股票
function AllStock() {
    httpGet("Reader/AllStock", "", true, ajax_success, ajax_fail);
    function ajax_success(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS All_stock');//删除自选股表
                tx.executeSql('CREATE TABLE IF NOT EXISTS All_stock (Symbol text, StockID text, Name text,SearchSSN text)');//记录所有的股票
                for (var i = 0; i < obj.length; i++) {
                    tx.executeSql('replace INTO All_stock (Symbol, StockID, Name, SearchSSN) VALUES(?,?,?,?)', [obj[i].Symbol, obj[i].StockID, obj[i].Name, obj[i].Symbol + obj[i].Name + ziTopin(obj[i].Name)], function (tx, res) {
                        // alert("添加成功");
                    });
                }
            }, function (e) {
                // alert("itemListInAndSe3ERROR: " + e.message);
            });

        }
        else {
            //用户没有
        }
    }
    function ajax_fail() {
    }
}
//判断分类内容并显示
function categorys() {
    httpGet("Reader/Categorys?userID=" + UserID + "&hash=" + CategoryHash + "&version=" + "1.1", "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            // alert("测试obj.Hash=" + obj.Hash);
            // alert("测试hash值不一样");
            var nowhash = obj.Hash;
            db.transaction(function (tx) {
                tx.executeSql("UPDATE User SET " + UserStatus + "Hash =? where id =?", [nowhash, 1], function (tx, res) {
                    ////alert("将最后一次ID存入：" + UserlgID);
                })
            }, function (e) {
                // alert("obj.HashERROR: " + e.message);
            });
            var obj = obj.Categorys;
            categorysInAndSe(obj);
        }
        else {
            if (obj = "null") {
                // alert("测试hash值一样");
                categorysSe();
            }
        }
        if (UserStatus == "login") {
            update_lg();
        }
    }
    function ajax_fail2(netStatus) {
        // categorysSe();
        // alert("测试Category fail="+netStatus);

        $("#loading").addClass("Page");
        $("#all").addClass("Page");
        $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $('#refesh').remove();
            $("#loading").removeClass("Page");
            $("#all").removeClass("Page");
            setTimeout(function () {
                categorys();
            }, 1000);
        })
    }
}
//从用户分类的数据查数据库
function categorysSe() {
    var date = new Date();
    db.transaction(function (tx) {
        tx.executeSql('select * from Categorys_' + UserStatus, [], function (tx, res) {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    $("#nav-ul").append('<li><a><input IndexID="' + i + '" type="hidden" class="hidden" value="' + res.rows.item(i).CategorysID + '"/>' + res.rows.item(i).Name + '</a><div class="bur_bottom Page"></div></li>');
                    if (res.rows.item(i).CategorysID != "Recommend") {
                        if (res.rows.item(i).CategorysID != "PushHistory") {

                            $(".all").append('<div class="main" id="contentA' + i + '"><div class="info" id="scroller' + i + '"><div id="pullDown' + i + '" class="ub ub-pc c-gra" style="margin:10px 0;"><img class="pullDownIcon" src="images/PullDown.png"><span class="pullDownLabel">下拉刷新</span></div><ul class="infoList" id="indexlist' + i + '"></ul><div id="pullUp' + i + '" class="ub ub-pc c-gra"  style="margin:10px 0;"><img class="pullUpIcon" src="images/PullUp.png"><span class="pullUpLabel">上拉加载更多</span></div><div class="clear" style="height:49px"></div></div></div>');
                        }
                        else {
                            var Push_i = i;
                            $(".all").append('<div class="main" id="contentA' + i + '"><div class="info" id="scroller' + i + '"><ul class="infoList" id="indexlist' + i + '"></ul><div id="pullUp' + i + '" class="ub ub-pc c-gra" style="margin:10px 0;"><img class="pullUpIcon" src="images/PullUp.png"><span class="pullUpLabel">上拉加载更多</span></div><div class="clear" style="height:49px"></div></div></div>');
                        }
                    }

                }

                if (sessionStorage.W_TopIndex == undefined || sessionStorage.W_TopIndex == "" || sessionStorage.W_category == undefined || sessionStorage.W_category == "") {
                    TopIndex = "0";
                }
                else {
                    if ($('#nav-ul').find('li').eq(sessionStorage.W_TopIndex).find('.hidden').val() == sessionStorage.W_category) {
                        TopIndex = sessionStorage.W_TopIndex;
                    }
                    else {
                        TopIndex = "0";
                    }
                }
                $('#nav-smartSetup').navigator('switchTo', TopIndex);//初始化标签的位置
                // if (res.rows.length < 7) {
                //     $("#nav-ul li").css("width", ($(window).width() - 55) / res.rows.length + "px");
                // }
                if (TopIndex == "0") {
                    $("#contentA").siblings().addClass("Page");
                }
                else {
                    $("#contentA" + TopIndex).siblings().addClass("Page");
                }
            }
            else {
                // alert("发现没有分类的信息");
                categorys();
            }
            //checkConnection();
        });
    }, function (e) {
        // alert("categorys1ERROR: " + e.message);
    });
    //打开app行为
    // if (GetQueryString("firstLoad") != "no") {
    //     httpGet("Reader/OpenApp?userID=" + UserID + "&version=" + AppModel + "&sysinfo=" + device.platform + "&network=" + navigator.connection.type + "&model=" + device.model + "&deviceVersion=" + device.version, "", true, ajax_success15, ajax_fail15)
    //     function ajax_success15(obj) {
    //     }
    //     function ajax_fail15() {
    //     }
    // }
}
//将用户分类的数据插入前端数据库
function categorysInAndSe(obj) {
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS Categorys_' + UserStatus);
        tx.executeSql('CREATE TABLE IF NOT EXISTS Categorys_' + UserStatus + ' (id integer primary key, CategorysID text, Name text, CategorysOrder text, Type text, Link text)');
    }, function (e) {
        // alert("categorysERROR: " + e.message);
    });
    db.transaction(function (tx) {
        for (var i = 0; i < obj.length; i++) {
            tx.executeSql('INSERT INTO Categorys_' + UserStatus + ' (CategorysID, Name, CategorysOrder, Type, Link) VALUES(?,?,?,?,?)', [obj[i].Id, obj[i].Name, obj[i].Order, obj[i].Type, obj[i].Link], function (tx, res) {

            });
        }
        db.transaction(function (tx) {
            tx.executeSql('select * from Categorys_' + UserStatus, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    $("#nav-ul").append('<li><a><input IndexID="' + i + '" type="hidden" class="hidden" value="' + res.rows.item(i).CategorysID + '"/>' + res.rows.item(i).Name + '</a><div class="bur_bottom Page"></div></li>');
                    if (res.rows.item(i).CategorysID != "Recommend") {
                        if (res.rows.item(i).CategorysID != "PushHistory") {
                            $(".all").append('<div class="main" id="contentA' + i + '"><div class="info" id="scroller' + i + '"><div id="pullDown' + i + '" class="ub ub-pc c-gra" style="margin:10px 0;"><img class="pullDownIcon" src="images/PullDown.png"><span class="pullDownLabel">下拉刷新</span></div><ul class="infoList" id="indexlist' + i + '"></ul><div id="pullUp' + i + '" class="ub ub-pc c-gra" style="margin:10px 0;"><img class="pullUpIcon" src="images/PullUp.png"><span class="pullUpLabel">上拉加载更多</span></div><div class="clear" style="height:49px"></div></div></div>');
                        }
                        else {
                            var Push_i = i;
                            $(".all").append('<div class="main" id="contentA' + i + '"><div class="info" id="scroller' + i + '"><ul class="infoList" id="indexlist' + i + '"></ul><div id="pullUp' + i + '" class="ub ub-pc c-gra" style="margin:10px 0;"><img class="pullUpIcon" src="images/PullUp.png"><span class="pullUpLabel">上拉加载更多</span></div><div class="clear" style="height:49px"></div></div></div>');
                        }
                    }

                }
                if (sessionStorage.W_TopIndex == undefined || sessionStorage.W_TopIndex == "" || sessionStorage.W_category == undefined || sessionStorage.W_category == "") {
                    TopIndex = "0";
                }
                else {
                    if ($('#nav-ul').find('li').eq(sessionStorage.W_TopIndex).find('.hidden').val() == sessionStorage.W_category) {
                        TopIndex = sessionStorage.W_TopIndex;
                    }
                    else {
                        TopIndex = "0";
                    }
                }
                $('#nav-smartSetup').navigator('switchTo', TopIndex);//初始化标签的位置
                // if (res.rows.length < 7) {
                //     $("#nav-ul li").css("width", ($(window).width() - 10) / res.rows.length + "px");
                // }
                if (TopIndex == "0") {
                    $("#contentA").siblings().addClass("Page");
                }
                else {
                    $("#contentA" + TopIndex).siblings().addClass("Page");
                }
                //checkConnection();
            });
        }, function (e) {
            // alert("categorys1ERROR: " + e.message);
        });
    }, function (e) {
        // alert("categorys1ERROR: " + e.message);
    });

}
//历史推送添加
function push_add() {
    loadingStepMore[TopIndex] = 2;
    httpGet("Reader/GetStockOpendays?endTime=" + endTime + "&sortType=1&count=8", "", true, ajax_success20, ajax_fail20);
    function ajax_success20(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 1) {
                var datt = obj[obj.length - 1].substring(0, obj[obj.length - 1].indexOf("T")) + " 20:00:00";
                startTime = getDateTimeStamp(datt) / 1000;
                httpGet("Reader/HistoryRecommend?userID=" + UserID + "&startTime=" + startTime + "&endTime=" + endTime + "&type=15", "", true, ajax_success13, ajax_fail13);
                function ajax_success13(obj) {
                    if (obj != "" && obj != null && obj != "null") {
                        for (var item in obj) {
                            var push_year = new Date(item).getFullYear();
                            var push_month = (new Date(item).getMonth() + 1);
                            var push_date = new Date(item).getDate();
                            var push_week = "天一二三四五六".charAt(new Date(item).getDay());
                            var push_blank = false;
                            if (Push_lastMouth == push_year + "年" + push_month + "月") {
                            }
                            else {
                                Push_lastMouth = push_year + "年" + push_month + "月";
                                $("#indexlist" + TopIndex).append('<li class="push_mouth">' + Push_lastMouth + '</li>');
                                push_blank = true;
                            }
                            $("#indexlist" + TopIndex).append('<li id="' + getDateTimeStamp(item) + '"><div style="overflow:hidden"><div class="push"><div class="push_date"><span style="border-bottom: 1px solid rgb(48, 48, 52); font-size: 20px; padding-bottom: 2px;">' + push_date + '</span><br><span>星期' + push_week + '</span></div><div class="push_box"><ul></ul></div></div></div></li>');
                            if (push_blank) {
                                $("#" + getDateTimeStamp(item)).find(".push_box").prepend('<div class="push_blank"></div>');
                            }
                            for (var j = 0; j < obj[item].length; j++) {
                                strlist = "";
                                strlist += '<li id="' + TopIndex + '_' + obj[item][j].Id + '"><img src="images/push_circle.png"><p>';
                                if (obj[item][j].Type == "2") {
                                    strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="morningPush" /><span style="color:#FF5656">【早餐】</span>';
                                }
                                else {
                                    if (obj[item][j].Type == "3") {
                                        strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="noonPush" /><span style="color:#3588E2">【中餐】</span>';
                                    }
                                    else {
                                        if (obj[item][j].Type == "4") {
                                            strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="afternoonPush" /><span style="color:#BA5101">【下午茶】</span>';
                                        }
                                        else {
                                            if (obj[item][j].Type == "5") {
                                                strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="latePush" /><span style="color:#4445A8">【晚餐】</span>';
                                            }
                                        }
                                    }
                                }
                                strlist += '<span style="font-weight:bold">' + obj[item][j].Title + '</span>';
                                if (obj[item][j].Summary != "" && obj[item][j].Summary != "null" && obj[item][j].Summary != null) {
                                    strlist += '<span>' + obj[item][j].Summary + '</span>';
                                }
                                strlist += '</p></li>';

                                $("#" + getDateTimeStamp(item)).find("ul").append(strlist);
                                bind_indexlist(obj[item][j].Id, TopIndex + '_' + obj[item][j].Id);
                            }
                        }
                        pullUpElMore[TopIndex].removeClass('loading');
                        pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                        pullUpLMore[TopIndex].html('上拉加载更多');
                        pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                        pullUpElMore[TopIndex].attr('class', '').hide();
                        myScrollMore[TopIndex].refresh();
                        loadingStepMore[TopIndex] = 0;
                    }
                    else {
                        pullUpIMore[TopIndex].addClass("Page");
                        pullUpLMore[TopIndex].html('无更多数据');
                        setTimeout(function () {
                            pullUpIMore[TopIndex].removeClass("Page");
                            pullUpElMore[TopIndex].removeClass('loading');
                            pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                            pullUpLMore[TopIndex].html('上拉加载更多');
                            pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                            pullUpElMore[TopIndex].attr('class', '').hide();
                            myScrollMore[TopIndex].refresh();
                            loadingStepMore[TopIndex] = 0;
                        }, 1000);
                    }
                    loadingStepMore[TopIndex] = 0;
                }
                function ajax_fail13() {
                    pullUpLMore[TopIndex].html('获取失败，请重试');
                    setTimeout(function () {
                        pullUpElMore[TopIndex].removeClass('loading');
                        pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                        pullUpLMore[TopIndex].html('上拉加载更多');
                        pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                        pullUpElMore[TopIndex].attr('class', '').hide();
                        myScrollMore[TopIndex].refresh();
                        loadingStepMore[TopIndex] = 0;
                    }, 1000);
                }
            }
            else {
                pullUpIMore[TopIndex].addClass("Page");
                pullUpLMore[TopIndex].html('无更多数据');
                setTimeout(function () {
                    pullUpIMore[TopIndex].removeClass("Page");
                    pullUpElMore[TopIndex].removeClass('loading');
                    pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                    pullUpLMore[TopIndex].html('上拉加载更多');
                    pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                    pullUpElMore[TopIndex].attr('class', '').hide();
                    myScrollMore[TopIndex].refresh();
                    loadingStepMore[TopIndex] = 0;
                }, 1000);
            }
        }
        else {
            pullUpIMore[TopIndex].addClass("Page");
            pullUpLMore[TopIndex].html('无更多数据');
            setTimeout(function () {
                pullUpIMore[TopIndex].removeClass("Page");
                pullUpElMore[TopIndex].removeClass('loading');
                pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                pullUpLMore[TopIndex].html('上拉加载更多');
                pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                pullUpElMore[TopIndex].attr('class', '').hide();
                myScrollMore[TopIndex].refresh();
                loadingStepMore[TopIndex] = 0;
            }, 1000);
        }
    }
    function ajax_fail20() {
        pullUpIMore[TopIndex].addClass("Page");
        pullUpLMore[TopIndex].html('获取失败，请重试');
        setTimeout(function () {
            pullUpIMore[TopIndex].removeClass("Page");
            pullUpElMore[TopIndex].removeClass('loading');
            pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
            pullUpLMore[TopIndex].html('上拉加载更多');
            pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
            pullUpElMore[TopIndex].attr('class', '').hide();
            myScrollMore[TopIndex].refresh();
            loadingStepMore[TopIndex] = 0;
        }, 1000);
    }
}
//历史推送首次获取
function push_history() {
    loadingStepMore[TopIndex] = 2;
    httpGet("Reader/GetStockOpendays?endTime=" + endTime + "&sortType=1&count=8", "", true, ajax_success19, ajax_fail19);
    function ajax_success19(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 1) {
                var datt = obj[obj.length - 1].substring(0, obj[obj.length - 1].indexOf("T")) + " 20:00:00";
                startTime = getDateTimeStamp(datt) / 1000;
                httpGet("Reader/HistoryRecommend?userID=" + UserID + "&startTime=" + startTime + "&endTime=" + endTime + "&type=15", "", true, ajax_success17, ajax_fail17);
                function ajax_success17(obj) {
                    if (obj != "" && obj != null && obj != "null") {
                        for (var item in obj) {
                            var push_year = new Date(item).getFullYear();
                            var push_month = (new Date(item).getMonth() + 1);
                            var push_date = new Date(item).getDate();
                            var push_week = "天一二三四五六".charAt(new Date(item).getDay());
                            var push_blank = false;
                            if (Push_lastMouth == push_year + "年" + push_month + "月") {
                            }
                            else {
                                Push_lastMouth = push_year + "年" + push_month + "月";
                                $("#indexlist" + TopIndex).append('<li class="push_mouth">' + Push_lastMouth + '</li>');
                                push_blank = true;
                            }
                            $("#indexlist" + TopIndex).append('<li id="' + getDateTimeStamp(item) + '"><div style="overflow:hidden"><div class="push"><div class="push_date"><span style="border-bottom: 1px solid rgb(48, 48, 52); font-size: 20px; padding-bottom: 2px;">' + push_date + '</span><br><span>星期' + push_week + '</span></div><div class="push_box"><ul></ul></div></div></div></li>');
                            if (push_blank) {
                                $("#" + getDateTimeStamp(item)).find(".push_box").prepend('<div class="push_blank"></div>');
                            }
                            for (var j = 0; j < obj[item].length; j++) {
                                strlist = "";
                                strlist += '<li id="' + TopIndex + '_' + obj[item][j].Id + '"><img src="images/push_circle.png"><p>';
                                if (obj[item][j].Type == "2") {
                                    strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="morningPush" /><span style="color:#FF5656">【早餐】</span>';
                                }
                                else {
                                    if (obj[item][j].Type == "3") {
                                        strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="noonPush" /><span style="color:#3588E2">【中餐】</span>';
                                    }
                                    else {
                                        if (obj[item][j].Type == "4") {
                                            strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="afternoonPush" /><span style="color:#BA5101">【下午茶】</span>';
                                        }
                                        else {
                                            if (obj[item][j].Type == "5") {
                                                strlist += '<input PushDate="' + obj[item][j].PushDate + '" type="hidden" class="type" value="latePush" /><span style="color:#4445A8">【晚餐】</span>';
                                            }
                                        }
                                    }
                                }
                                strlist += '<span style="font-weight:bold">' + obj[item][j].Title + '</span>';
                                if (obj[item][j].Summary != "" && obj[item][j].Summary != "null" && obj[item][j].Summary != null) {
                                    strlist += '<span>' + obj[item][j].Summary + '</span>';
                                }
                                strlist += '</p></li>';

                                $("#" + getDateTimeStamp(item)).find("ul").append(strlist);
                                bind_indexlist(obj[item][j].Id, TopIndex + '_' + obj[item][j].Id);
                            }
                        }
                        $("#loading").addClass("Page");
                        myScrollMore[TopIndex].refresh();
                    }
                    else {
                        $("#loading").addClass("Page");
                        $('#indexlist' + TopIndex).append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无推送/(ㄒoㄒ)/~~</div>');
                        myScrollMore[TopIndex].refresh();
                    }
                    loadingStepMore[TopIndex] = 0;
                }
                function ajax_fail17() {
                    loadingStepMore[TopIndex] = 0;
                    $("#loading").addClass("Page");
                    $("#all").addClass("Page");
                    $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
                    $("#refesh").bind("click", function (event) {
                        $('#refesh').remove();
                        $("#loading").removeClass("Page");
                        $("#all").removeClass("Page");
                        setTimeout(function () {
                            push_history();
                            myScrollMore[TopIndex].refresh();
                        }, 1000);
                    })
                }
            }
            else {
                $("#loading").addClass("Page");
                $('#indexlist' + TopIndex).append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无推送/(ㄒoㄒ)/~~</div>');
                myScrollMore[TopIndex].refresh();
            }
        }
        else {
            $("#loading").addClass("Page");
            $('#indexlist' + TopIndex).append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无推送/(ㄒoㄒ)/~~</div>');
            myScrollMore[TopIndex].refresh();
        }
    }
    function ajax_fail19() {
        loadingStepMore[TopIndex] = 0;
        $("#loading").addClass("Page");
        $("#all").addClass("Page");
        $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $('#refesh').remove();
            $("#loading").removeClass("Page");
            $("#all").removeClass("Page");
            setTimeout(function () {
                push_history();
                myScrollMore[TopIndex].refresh();
            }, 1000);
        })
    }
}
//判断是不是打开app，并记录打开app行为，查看前端数据库
function itemListSe() {
    // if (GetQueryString("firstLoad") == "no") {
    // }
    // else {
    //记录第一次打开app的行为
    $.ajax({
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", AccessToken);
        },
        url: "https://api.palaspom.com/Reader/OpenApp?userID=" + UserID,
        success: function (data) {
        },
        error: function (err) {
            alert("记录用户打开app问题： " + err.message);
        }
    });
    // }
    // $('#scroller').removeClass('Page');
    // $('#nav-ul').removeClass('Page');
    // itemListSe1();
}
//查询缓存中数据(首次打开,缓存中有数据)
function itemListSe1() {
    // alert("测试itemListSe1");
    if (TopIndex != "0") {
        //alert("其他分类下有缓存数据：" + categoryName);
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
        }, function (e) {
            // alert("itemListSeERROR: " + e.message);
        });
        //打开的时候如果有缓存,那么只保留最新的200条
        db.transaction(function (tx) {
            tx.executeSql('delete from Item_list_category_' + UserStatus + ' where idd <= (select max(idd)-1000 from Item_list_category_' + UserStatus + ')');
        }, function (e) {
            // alert("itemListSe1ERROR: " + e.message);
        });

        if (GetQueryString("firstLoad") == "no") {
            db.transaction(function (tx) {
                tx.executeSql('select * from Record_Position_' + UserStatus + ' where TopIndex=?', [TopIndex], function (tx, res) {
                    if (res != null && res.rows != null && res.rows.length > 0 && res.rows.item(0).ItemID != null) {
                        //获取离开首页的时候的scroll的位置
                        PositionX = res.rows.item(0).PositionX;
                        PositionY = res.rows.item(0).PositionY;
                        db.transaction(function (tx) {
                            tx.executeSql('select * from Item_list_category_' + UserStatus + ' where ItemID=?', [res.rows.item(0).ItemID], function (tx, res) {
                                if (res != null && res.rows != null && res.rows.length > 0) {
                                    var positionidd = res.rows.item(0).idd;
                                    //取大于idd的文章显示
                                    db.transaction(function (tx) {
                                        tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=? and idd>=?  order by idd desc', [category, positionidd], function (tx, res) {
                                            if (res != null && res.rows != null && res.rows.length > 0) {
                                                for (var i = 0; i < res.rows.length; i++) {
                                                    bind_list(res.rows.item(i));
                                                }
                                                isImgLoad(function () {
                                                    myScrollMore[TopIndex].scrollTo(parseInt(PositionX), parseInt(PositionY), 0);
                                                    $("#loading").addClass("Page");
                                                    myScrollMore[TopIndex].refresh();
                                                    autoUpdate();
                                                    runing();
                                                });
                                                touchTag();
                                            }
                                            else {
                                                getlist1();
                                            }
                                        });
                                    }, function (e) {
                                        // alert("itemListSe2ERROR: " + e.message);
                                    });
                                }
                            });
                        }, function (e) {
                            // alert("itemListSe2ERROR: " + e.message);
                        });
                    }
                    else {
                        db.transaction(function (tx) {
                            tx.executeSql('select * from Item_list_category_' + UserStatus + ' order by idd desc', [], function (tx, res) {
                                if (res != null && res.rows != null && res.rows.length > 0) {
                                    db.transaction(function (tx) {
                                        tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=?  order by idd desc', [category], function (tx, res) {
                                            if (res != null && res.rows != null && res.rows.length > 0) {
                                                if (res.rows.length >= 10) {
                                                    for (var i = 0; i < 10; i++) {
                                                        bind_list(res.rows.item(i));
                                                    }
                                                }
                                                else {
                                                    for (var i = 0; i < res.rows.length; i++) {
                                                        bind_list(res.rows.item(i));
                                                    }
                                                }
                                                isImgLoad(function () {
                                                    $("#loading").addClass("Page");
                                                    myScrollMore[TopIndex].refresh();
                                                    autoUpdate();
                                                });
                                                runing();
                                                touchTag();
                                            }
                                            else {
                                                getlist();
                                            }
                                        });
                                    }, function (e) {
                                        // alert("itemListSe2ERROR: " + e.message);
                                    });
                                }
                                else {
                                    getlist1();
                                }
                            })
                        }, function (e) {
                            // alert("itemListSe2ERROR: " + e.message);
                        });
                    }
                });
            }, function (e) {
                // alert("itemListSe2ERROR: " + e.message);
            });
        }
        else {
            db.transaction(function (tx) {
                tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=?  order by idd desc', [category], function (tx, res) {
                    if (res != null && res.rows != null && res.rows.length > 0) {
                        if (res.rows.length >= 10) {
                            for (var i = 0; i < 10; i++) {
                                bind_list(res.rows.item(i));
                            }
                        }
                        else {
                            for (var i = 0; i < res.rows.length; i++) {
                                bind_list(res.rows.item(i));
                            }
                        }

                        isImgLoad(function () {
                            $("#loading").addClass("Page");
                            // navigator.splashscreen.hide();
                            myScrollMore[TopIndex].refresh();
                            autoUpdate();
                        });
                        runing();
                        touchTag();
                    }
                    else {
                        getlist1();
                    }
                });
            }, function (e) {
                // alert("itemListSe2ERROR: " + e.message);
            });
        }
    }
    //从推荐列表中取数据
    else {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
        }, function (e) {
            // alert("itemListSeERROR: " + e.message);
        });
        //打开的时候如果有缓存,那么只保留最新的200条
        db.transaction(function (tx) {
            tx.executeSql('delete from item_list_' + UserStatus + ' where idd <= (select max(idd)-200 from item_list_' + UserStatus + ')');
        }, function (e) {
            // alert("itemListSe1ERROR: " + e.message);
        });
        if (GetQueryString("firstLoad") == "no") {
            db.transaction(function (tx) {
                tx.executeSql('select * from Record_Position_' + UserStatus + ' where TopIndex=?', [TopIndex], function (tx, res) {
                    if (res != null && res.rows != null && res.rows.length > 0 && res.rows.item(0).ItemID != null) {
                        //获取离开首页的时候的scroll的位置
                        PositionX = res.rows.item(0).PositionX;
                        PositionY = res.rows.item(0).PositionY;
                        db.transaction(function (tx) {
                            tx.executeSql('select * from Item_list_' + UserStatus + ' where ItemID=?', [res.rows.item(0).ItemID], function (tx, res) {
                                if (res != null && res.rows != null && res.rows.length > 0) {
                                    var positionidd = res.rows.item(0).idd;
                                    //取大于idd的文章显示

                                    db.transaction(function (tx) {
                                        tx.executeSql('select * from item_list_' + UserStatus + ' where idd>=? order by idd desc', [positionidd], function (tx, res) {
                                            if (res != null && res.rows != null && res.rows.length > 0) {
                                                for (var i = 0; i < res.rows.length; i++) {
                                                    bind_list(res.rows.item(i));
                                                }
                                                isImgLoad(function () {
                                                    myScroll.scrollTo(parseInt(PositionX), parseInt(PositionY), 0);
                                                    $("#loading").addClass("Page");
                                                    myScroll.refresh();
                                                    autoUpdate();
                                                    runing();
                                                });
                                                touchTag();
                                            }
                                            else {
                                                getlist1();
                                            }
                                        });
                                    }, function (e) {
                                        // alert("itemListSe2ERROR: " + e.message);
                                    });
                                }
                            });
                        }, function (e) {
                            // alert("itemListSe2ERROR: " + e.message);
                        });
                    }
                    else {
                        db.transaction(function (tx) {
                            tx.executeSql('select * from item_list_' + UserStatus + '  order by idd desc', [], function (tx, res) {
                                if (res != null && res.rows != null && res.rows.length > 0) {
                                    if (res.rows.length >= 10) {
                                        for (var i = 0; i < 10; i++) {
                                            bind_list(res.rows.item(i));
                                        }
                                    }
                                    else {
                                        for (var i = 0; i < res.rows.length; i++) {
                                            bind_list(res.rows.item(i));
                                        }
                                    }
                                    isImgLoad(function () {
                                        $("#loading").addClass("Page");
                                        myScroll.refresh();
                                        autoUpdate();
                                    });
                                    runing();
                                    touchTag();
                                }
                                else {
                                    getlist1();
                                }
                            });
                        }, function (e) {
                            // alert("itemListSe2ERROR: " + e.message);
                        });
                    }
                });
            }, function (e) {
                // alert("itemListSe2ERROR: " + e.message);
            });
        }
        else {
            db.transaction(function (tx) {
                tx.executeSql('select * from item_list_' + UserStatus + '  order by idd desc', [], function (tx, res) {
                    if (res != null && res.rows != null && res.rows.length > 0) {
                        if (res.rows.length >= 10) {
                            for (var i = 0; i < 10; i++) {
                                bind_list(res.rows.item(i));
                            }
                        }
                        else {
                            for (var i = 0; i < res.rows.length; i++) {
                                bind_list(res.rows.item(i));
                            }
                        }
                        isImgLoad(function () {
                            $("#loading").addClass("Page");
                            // updateShow();
                            // navigator.splashscreen.hide();
                            myScroll.refresh();
                            autoUpdate();
                        });
                        runing();
                        touchTag();
                    }
                    else {
                        getlist1();
                    }
                });
            }, function (e) {
                // alert("itemListSe2ERROR: " + e.message);
            });
        }
    }
}
//客户端无缓存数据,但是服务器端有缓存数据
function getlist1() {
    if (TopIndex != "0") {
        loadingStepMore[TopIndex] = 2;
        httpGet("Reader/HistoryReadItems?userID=" + UserID + "&category=true&version=" + NowVerision, "", true, ajax_success3, ajax_fail3);
        function ajax_success3(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                db.transaction(function (tx) {
                    tx.executeSql('DROP TABLE IF EXISTS Item_list_category_' + UserStatus);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
                }, function (e) {
                    // alert("getlist1ERROR: " + e.message);
                });
                db.transaction(function (tx) {
                    for (var i = 0; i < obj.length; i++) {
                        tx.executeSql('INSERT INTO Item_list_category_' + UserStatus + '  (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [obj.length - parseInt(i) - 1, obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
                    }

                    db.transaction(function (tx) {
                        tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=? order by idd desc', [category], function (tx, res) {
                            if (res != null && res.rows != null && res.rows.length > 0) {
                                if (res.rows.length >= 10) {
                                    for (var i = 0; i < 10; i++) {
                                        bind_list(res.rows.item(i));
                                    }
                                }
                                else {
                                    for (var i = 0; i < res.rows.length; i++) {
                                        bind_list(res.rows.item(i));
                                    }
                                }
                                isImgLoad(function () {
                                    $("#loading").addClass("Page");
                                    if (GetQueryString("firstLoad") == "no") {
                                        myScrollMore[TopIndex].refresh();
                                        autoUpdate();
                                    }
                                    else {
                                        // navigator.splashscreen.hide();
                                        myScrollMore[TopIndex].refresh();
                                        autoUpdate();
                                    }
                                });
                                runing();
                                touchTag();
                            }
                            else {
                                getlist();
                            }
                        });
                    }, function (e) {
                        // alert("getlist3ERROR: " + e.message);
                    });
                }, function (e) {
                    // alert("getlist21ERROR: " + e.message);
                });
            }
            else {
                getlist();
            }
            loadingStepMore[TopIndex] = 0;
        }
        function ajax_fail3() {
            // getlist();
            loadingStepMore[TopIndex] = 0;
            $("#loading").addClass("Page");
            $("#all").addClass("Page");
            $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
            $("#refesh").bind("click", function (event) {
                $('#refesh').remove();
                $("#loading").removeClass("Page");
                $("#all").removeClass("Page");
                setTimeout(function () {
                    getlist1();
                    myScrollMore[TopIndex].refresh();
                }, 1000);
            })
        }
    }
    else {
        loadingStep = 2;
        httpGet("Reader/HistoryReadItems?userID=" + UserID + "&category=false&version=" + NowVerision, "", true, ajax_success4, ajax_fail4);
        function ajax_success4(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                db.transaction(function (tx) {
                    tx.executeSql('DROP TABLE IF EXISTS Item_list_' + UserStatus);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
                }, function (e) {
                    // alert("getlist1ERROR: " + e.message);
                });
                db.transaction(function (tx) {
                    for (var i = 0; i < obj.length; i++) {
                        tx.executeSql('INSERT INTO item_list_' + UserStatus + '  (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [obj.length - parseInt(i) - 1, obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
                    }
                    db.transaction(function (tx) {
                        tx.executeSql('select * from item_list_' + UserStatus + '  order by idd desc', [], function (tx, res) {
                            if (res != null && res.rows != null && res.rows.length > 0) {
                                if (res.rows.length >= 10) {
                                    for (var i = 0; i < 10; i++) {
                                        bind_list(res.rows.item(i));
                                    }
                                }
                                else {
                                    for (var i = 0; i < res.rows.length; i++) {
                                        bind_list(res.rows.item(i));
                                    }
                                }
                                isImgLoad(function () {
                                    $("#loading").addClass("Page");
                                    if (GetQueryString("firstLoad") == "no") {
                                        myScroll.refresh();
                                        autoUpdate();
                                    }
                                    else {
                                        // updateShow();
                                        myScroll.refresh();
                                        autoUpdate();
                                    }
                                });
                                runing();
                                touchTag();
                            }
                            else {
                                getlist();
                            }
                        });
                    }, function (e) {
                        // alert("getlist3ERROR: " + e.message);
                    });
                }, function (e) {
                    // alert("getlist2ERROR: " + e.message);
                });
            }
            else {
                getlist();
            }
            loadingStep = 0;
        }
        function ajax_fail4() {
            loadingStep = 0;
            $("#loading").addClass("Page");
            $("#all").addClass("Page");
            $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
            $("#refesh").bind("click", function (event) {
                $('#refesh').remove();
                $("#loading").removeClass("Page");
                $("#all").removeClass("Page");
                setTimeout(function () {
                    getlist1();
                    myScroll.refresh();
                }, 1000);
            })
        }
    }
}
//客户端和服务器端都没有缓存数据
function getlist() {
    // alert("测试getlist");
    if (TopIndex != "0") {
        loadingStepMore[TopIndex] = 2;
    }
    else {
        loadingStep = 2;
    }
    var myDate = new Date();
    httpGet("Reader/Articles?userID=" + UserID + "&count=30&category=" + category + "&dateTime=" + parseInt(myDate.getTime() / 1000) + "&authorName=&version=" + NowVerision, "", true, ajax_success5, ajax_fail5);
    function ajax_success5(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            itemListInAndSe(obj);
        }
        else {
            $("#loading").addClass("Page");
            if (GetQueryString("firstLoad") == "no") {
                if (TopIndex != "0") {
                    $('#indexlist' + TopIndex).append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无新资讯/(ㄒoㄒ)/~~</div>');
                    myScrollMore[TopIndex].refresh();
                }
                else {
                    $('#indexlist').append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无新资讯/(ㄒoㄒ)/~~</div>');
                    myScroll.refresh();
                }
            }
            else {
                // navigator.splashscreen.hide();
                if (TopIndex != "0") {
                    $('#indexlist' + TopIndex).append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无新资讯/(ㄒoㄒ)/~~</div>');
                    myScrollMore[TopIndex].refresh();
                }
                else {
                    $('#indexlist').append('<div style="padding-top:100px"><img style="width:130px;padding:10px 0;" src="images/no_content.png"/></div><div style="color:#999">暂无新资讯/(ㄒoㄒ)/~~</div>');
                    myScroll.refresh();
                }
            }
        }
        if (TopIndex != "0") {
            loadingStepMore[TopIndex] = 0;
        }
        else {
            loadingStep = 0;
        }
    }
    function ajax_fail5() {
        if (TopIndex != "0") {
            loadingStepMore[TopIndex] = 0;
        }
        else {
            loadingStep = 0;
        }
        $("#loading").addClass("Page");
        $("#all").addClass("Page");
        $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $('#refesh').remove();
            $("#loading").removeClass("Page");
            $("#all").removeClass("Page");
            setTimeout(function () {
                getlist();
                myScroll.refresh();
            }, 1000);
        })
    }
}
//客户端和服务器端都没有缓存数据，数据插入客户端并显示
function itemListInAndSe(obj) {
    if (TopIndex != "0") {
        var iddd;
        db.transaction(function (tx) {
            //tx.executeSql('DROP TABLE IF EXISTS Item_list_category_' + UserStatus);
            tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
        }, function (e) {
            // alert("itemListInAndSe11ERROR: " + e.message);
        });
        db.transaction(function (tx) {
            tx.executeSql('select * from Item_list_category_' + UserStatus + ' order by idd desc', [], function (tx, res) {
                if (res.rows.length == 0) {
                    db.transaction(function (tx) {
                        for (var i = 0; i < obj.length; i++) {
                            tx.executeSql('INSERT INTO Item_list_category_' + UserStatus + '  (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [9 - parseInt(i), obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
                        }
                        db.transaction(function (tx) {
                            tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=?  order by idd desc', [category], function (tx, res) {
                                for (var i = 0; i < res.rows.length; i++) {
                                    bind_list(res.rows.item(i));
                                }
                                isImgLoad(function () {
                                    $("#loading").addClass("Page");
                                    if (GetQueryString("firstLoad") == "no") {
                                        // if (TopIndex != "0") {
                                        myScrollMore[TopIndex].refresh();
                                        // }
                                        // else {
                                        //     myScroll.refresh();
                                        // }
                                    }
                                    else {
                                        // navigator.splashscreen.hide();
                                        // if (TopIndex != "0") {
                                        myScrollMore[TopIndex].refresh();
                                        // }
                                        // else {
                                        //     myScroll.refresh();
                                        // }
                                    }
                                });
                                runing();
                                touchTag();
                            });
                        }, function (e) {
                            // alert("itemListInAndSe3ERROR: " + e.message);
                        });
                    }, function (e) {
                        // alert("itemListInAndSe2ERROR: " + e.message);
                    });
                }
                else {
                    iddd = res.rows.item(0).idd;
                    db.transaction(function (tx) {
                        var j = 0;
                        for (var i = 0; i < obj.length; i++) {
                            j = parseInt(j) + 1;
                            tx.executeSql('INSERT INTO Item_list_category_' + UserStatus + '  (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [parseInt(j) + parseInt(iddd), obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
                        }
                        db.transaction(function (tx) {
                            tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=?  order by idd desc', [category], function (tx, res) {
                                for (var i = 0; i < res.rows.length; i++) {
                                    bind_list(res.rows.item(i));
                                }
                                isImgLoad(function () {
                                    $("#loading").addClass("Page");
                                    if (GetQueryString("firstLoad") == "no") {
                                        // if (TopIndex != "0") {
                                        myScrollMore[TopIndex].refresh();
                                        // }
                                        // else {
                                        //     myScroll.refresh();
                                        // }
                                    }
                                    else {
                                        // navigator.splashscreen.hide();
                                        // if (TopIndex != "0") {
                                        myScrollMore[TopIndex].refresh();
                                        // }
                                        // else {
                                        //     myScroll.refresh();
                                        // }
                                    }
                                });
                                runing();
                                touchTag();
                            });
                        }, function (e) {
                            // alert("itemListInAndSe3ERROR: " + e.message);
                        });
                    }, function (e) {
                        // alert("itemListInAndSe3ERROR: " + e.message);
                    });
                }
            });
        }, function (e) {
            // alert("itemListInAndSe4ERROR: " + e.message);
        });
    }
    else {
        db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS Item_list_' + UserStatus);
            tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
        }, function (e) {
            // alert("itemListInAndSe12ERROR: " + e.message);
        });
        db.transaction(function (tx) {
            for (var i = 0; i < obj.length; i++) {
                tx.executeSql('INSERT INTO item_list_' + UserStatus + '  (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [9 - parseInt(i), obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
            }
            db.transaction(function (tx) {
                tx.executeSql('select * from item_list_' + UserStatus + '  order by idd desc', [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        bind_list(res.rows.item(i));
                    }
                    isImgLoad(function () {
                        $("#loading").addClass("Page");
                        if (GetQueryString("firstLoad") == "no") {
                            // if (TopIndex != "0") {
                            //     myScrollMore[TopIndex].refresh();
                            // }
                            // else {
                            myScroll.refresh();
                            // }
                        }
                        else {
                            // navigator.splashscreen.hide();
                            // if (TopIndex != "0") {
                            //     myScrollMore[TopIndex].refresh();
                            // }
                            // else {
                            // updateShow();
                            myScroll.refresh();
                            // }
                        }
                    });
                    runing();
                    touchTag();
                });
            }, function (e) {
                // alert("itemListInAndSe3ERROR: " + e.message);
            });
        }, function (e) {
            // alert("itemListInAndSe4ERROR: " + e.message);
        });
    }
}
//下拉新闻插入数据库
function itemListIn(obj) {
    if (TopIndex != "0") {
        var iddd;
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_category_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
        }, function (e) {
            // alert("itemListInAndSe13ERROR: " + e.message);
        });
        db.transaction(function (tx) {
            tx.executeSql('select * from Item_list_category_' + UserStatus + ' order by idd desc', [], function (tx, res) {
                iddd = res.rows.item(0).idd;
            });
        }, function (e) {
            // alert("itemListInAndSe4ERROR: " + e.message);
        });
        db.transaction(function (tx) {
            var j = 0;
            for (var i = obj.length - 1; i >= 0; i--) {
                j = parseInt(j) + 1;
                tx.executeSql('REPLACE INTO Item_list_category_' + UserStatus + ' (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [parseInt(j) + parseInt(iddd), obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
            }
        }, function (e) {
            // alert("itemListIn1ERROR: " + e.message);
        });
    }
    else {
        var iddd;
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Item_list_' + UserStatus + ' (id integer primary key, idd integer, ItemID text, Type text, Title text, Url text, MediaName text, HTMLText text, Tag text, PubDate text, Summary text, Category text, ImageUrl text, PushDate text, Struct text, PartId text)');
        }, function (e) {
            // alert("itemListIn2ERROR: " + e.message);
        });
        db.transaction(function (tx) {
            tx.executeSql('select * from item_list_' + UserStatus + '  order by idd desc', [], function (tx, res) {
                if (res.rows.length == 0) {
                    iddd = 0;
                }
                else {
                    iddd = res.rows.item(0).idd;
                }
            });
        }, function (e) {
            // alert("itemListIn3ERROR: " + e.message);
        });
        db.transaction(function (tx) {
            var j = 0;
            for (var i = obj.length - 1; i >= 0; i--) {
                j = parseInt(j) + 1;
                tx.executeSql('REPLACE INTO item_list_' + UserStatus + ' (idd, ItemID, Type, Title, Url, MediaName, HTMLText, Tag, PubDate, Summary, Category, ImageUrl, PushDate, PartId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [parseInt(j) + parseInt(iddd), obj[i].Id, obj[i].Type, obj[i].Title, obj[i].Url, obj[i].MediaName, obj[i].HTMLText, obj[i].Tag, obj[i].PubDate, JSON.stringify(obj[i].Summary), obj[i].Category, obj[i].ImageUrl, obj[i].PushDate, obj[i].PartId], function (tx, res) { });
            }
        }, function (e) {
            // alert("itemListIn2ERROR: " + e.message);
        });
    }

}
//判断网络状态
function checkConnection() {
    //alert("进入checkConnection");
    // var networkState = navigator.connection.type;
    // var states = {};
    // states[Connection.UNKNOWN] = 'Unknown connection';
    // states[Connection.ETHERNET] = 'Ethernet connection';
    // states[Connection.WIFI] = 'WiFi connection';
    // states[Connection.CELL_2G] = 'Cell 2G connection';
    // states[Connection.CELL_3G] = 'Cell 3G connection';
    // states[Connection.CELL_4G] = 'Cell 4G connection';
    // states[Connection.CELL] = 'Cell generic connection';
    // states[Connection.NONE] = 'No network connection';

    // //alert('Connection type: ' + states[networkState]);

    // if (states[networkState] == 'No network connection') {
    //     window.plugins.toast.showShortCenter("无网络，请连接网络后打开APP");
    // }
    // else {
    itemListSe1();
    if (TopIndex == 0) {
        bind_topSix();
    }
    // getlist();
    // }
}
//从服务器页面html往上添加
function bind_listUp(obj) {
    if (TopIndex != "0") {
        var strhot = '', strlist = '';
        if (obj.Type == "0") {
            //主题的原来版本
            strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" value="' + obj.Id + '" class="hidden"><input type="hidden" PubDate="' + obj.PubDate + '" PushDate="' + obj.PushDate + '" value="' + obj.Type + '" class="type"><div class="topic_title"><p><img style="width:30px;margin-right:4px;margin-bottom:4px" src="images/topic_img.png"/>' + obj.Title + '</p></div><div class="topic_img"><img src="images/hot_default.png" original="http://www.taikorcdn.com/' + obj.ImageUrl + '" class="cover" onerror="this.src=' + "'images/hot_error.png'" + '"><div class="maskimg"><img src="images/Mask.png"></div></div><div><span class="label-left">';
            if (getDateInOneHour(obj.PubDate)) {
                strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
            }
            else {
                strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
            }
            if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
            strlist += '</span></a></div></div></div></li>';
            $('#indexlist' + TopIndex).prepend(strlist);
            bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
        }
        else {
            //资讯格式
            if (obj.Type == "1" || obj.Type == "10") {
                strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="smallPic-title"><p>' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
                if (getDateInOneHour(obj.PubDate)) {
                    strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
                }
                else {
                    strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
                }
                if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
                strlist += '</span><span class="label-right nolike"><img src="images/icon-cross.png" style="width:14px;margin-right:12px;"></span></div></a></div></div></div></li>';

                $('#indexlist' + TopIndex).prepend(strlist);
                bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
            }
        }
    }
    else {
        var strhot = '', strlist = '';
        if (obj.Type == "0") {
            //主题的原来版本
            strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" value="' + obj.Id + '" class="hidden"><input type="hidden" PubDate="' + obj.PubDate + '" PushDate="' + obj.PushDate + '" value="' + obj.Type + '" class="type"><div class="topic_title"><p><img style="width:30px;margin-right:4px;margin-bottom:4px" src="images/topic_img.png"/>' + obj.Title + '</p></div><div class="topic_img"><img src="images/hot_default.png" original="http://www.taikorcdn.com/' + obj.ImageUrl + '" class="cover" onerror="this.src=' + "'images/hot_error.png'" + '"><div class="maskimg"><img src="images/Mask.png"></div></div><div><span class="label-left">';
            if (getDateInOneHour(obj.PubDate)) {
                strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
            }
            else {
                strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
            }
            if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
            strlist += '</span></a></div></div></div></li>';
            $('#indexlist').prepend(strlist);
            bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
        }
        else {
            //资讯格式
            if (obj.Type == "1" || obj.Type == "10") {
                if (obj.Type == "10") {
                    strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="smallPic-title"><p><img style="width:20px;margin-right:4px;margin-bottom:4px" src="images/hot.png"/>' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
                }
                else {
                    strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="smallPic-title"><p>' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
                }
                if (getDateInOneHour(obj.PubDate)) {
                    strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
                }
                else {
                    strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
                }
                if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
                strlist += '</span><span class="label-right nolike"><img src="images/icon-cross.png" style="width:14px;margin-right:12px;"></span></div></a></div></div></div></li>';

                $('#indexlist').prepend(strlist);
                bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
            }
            else {
                if (obj.Type == "9") {
                    strlist = '<li id="' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="gap-point"></div><div class="booler-box"><a href="#"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="booler-body"><div class="booler-right"><p>' + obj.Title + '</p></div><div class="booler-left"><span>由布尔财经机器编辑推送</span><img src="images/booler.png"></div></div></a></div><div class="gap-point"></div></div></div></li>';
                    $('#indexlist').prepend(strlist);
                }
                else {
                    if ((obj.PushDate).length > "9999999999") {
                        var myDate = new Date(parseInt(obj.PushDate));
                    }
                    else {
                        if ((obj.PushDate) <= "9999999999") {
                            var myDate = new Date(parseInt(obj.PushDate) * 1000);//把十位时间戳变成十三位时间戳，再变成时间
                        }
                    }
                    // var myDate = new Date(parseInt(obj.PushDate) * 1000);//把十位时间戳变成十三位时间戳，再变成时间
                    if (myDate.getDay() != 0 && myDate.getDay() != 6) {//时间看是星期几，如果是星期六和星期天，则不推出早中收盘推送
                        //早推送格式
                        if (obj.Type == "2") {
                            if ($('#indexlist>li:first-child').find(".type").val() != "morning" || ($('#indexlist>li:first-child').find(".type").val() == "morning" && $('#indexlist>li:first-child').find(".type").attr("PushDate") != obj.PushDate)) {
                                strlist = '<li id="morning' + obj.Id + '" class="deleteli" ><input class="hidden" type="hidden" value="morning' + obj.Id + '"><input class="type" type="hidden" value="morning" PushDate="' + obj.PushDate + '"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 早间推送 】</div><div id="morning_list" class="morning_list"><div id="morning_ul"><ul></ul></div></div></li>';
                                $('#indexlist').prepend(strlist);
                                bind_indexlist("morning" + obj.Id, "morning" + obj.Id);
                                $("#morning" + obj.Id).find(".morning_list").after('<div id="point' + obj.Id + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                                var count = stockids.split(",");
                                addPointDown(obj.Id, count);
                                $('#indexlist>li:first-child').find("#morning_ul ul").prepend('<li id="' + TopIndex + '_' + obj.Id + '" class="moring_deleteli"><div style="overflow:hidden"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" value="' + obj.Type + '"><div class="recommand-title"><p>' + obj.Title + '</p></div></div></li>');
                                bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
                            }
                            else {
                                $('#indexlist>li:first-child').find("#morning_ul ul").prepend('<li id="' + TopIndex + '_' + obj.Id + '" class="moring_deleteli"><div style="overflow:hidden"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" value="' + obj.Type + '"><div class="recommand-title"><p>' + obj.Title + '</p></div></div></li>');
                                bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
                            }
                        }
                        else {
                            //午推送格式
                            if (obj.Type == "3") {
                                strlist = '<li class="deleteli" id="' + TopIndex + '_' + obj.Id + '"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 午间推送 】</div><div class="noon-box"><div class="noon-backg"><p><span class="push_head">【午间盘面总结】</span><span>' + obj.Title + '</span></p></div><div class="clear"></div></div></div></div></li>';
                                $('#indexlist').prepend(strlist);
                                bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
                                $("#" + TopIndex + '_' + obj.Id).find(".noon-box").after('<div id="point' + obj.Id + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                                var count = stockids.split(",");
                                var pointId = obj.Id;
                                addPointDown(pointId, count);
                            }
                            else {
                                //收盘推送格式
                                if (obj.Type == "4") {
                                    strlist = '<li class="deleteli" id="' + TopIndex + '_' + obj.Id + '"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 收盘推送 】</div><div class="afternoon-box"><div class="afternoon-backg"><p><span class="push_head">【收盘盘面总结】</span><span>' + obj.Title + '</span></p></div><div class="clear"></div></div></div></div></li>';
                                    $('#indexlist').prepend(strlist);
                                    bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
                                    $("#" + TopIndex + '_' + obj.Id).find(".afternoon-box").after('<div id="point' + obj.Id + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                                    var count = stockids.split(",");
                                    var pointId = obj.Id;
                                    addPointDown(pointId, count);
                                }
                            }
                        }
                    }
                    //晚推送格式
                    if (obj.Type == "5") {
                        strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj.Id + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="late"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 晚间新闻 】</div><div class="late-box"><div class="late-backg"><img class="cover" src="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '"><div class="maskimg"><img src="images/Mask.png"></div><div class="late-title">' + obj.Title + '</div></div><div class="late_banner"><div class="banner_li"><div class="maskimg"><img src="images/Mark_late.png"></div><img class="cover" src="http://www.taikorcdn.com/reader_special/b/2d4778b3eb9b6789844df520bbf0d36f_big.jpg"></div><div class="banner_li" style="margin:0 0.8%"><div class="maskimg"><img src="images/Mark_late.png"></div><img class="cover" src="http://www.taikorcdn.com/reader_special/b/2d4778b3eb9b6789844df520bbf0d36f_big.jpg"></div><div class="banner_li"><div class="maskimg"><img src="images/Mark_late.png"></div><img class="cover" src="http://www.taikorcdn.com/reader_special/b/2d4778b3eb9b6789844df520bbf0d36f_big.jpg"></div><div class="clear"></div></div><div class="clear"></div></div><div class="gap-point"></div></div></div></li>';
                        $('#indexlist').prepend(strlist);
                        bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
                    }
                }
            }
        }
    }
}
//从前端数据库取数据往下添加
function bind_list(obj) {
    if (TopIndex != "0") {
        var strhot = '', strlist = '';
        if (obj.Type == "0") {
            //主题的原来版本
            strlist = '<li id="' + TopIndex + '_' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" value="' + obj.ItemID + '" class="hidden"><input type="hidden" PubDate="' + obj.PubDate + '" PushDate="' + obj.PushDate + '" value="' + obj.Type + '" class="type"><div class="topic_title"><p><img style="width:30px;margin-right:4px;margin-bottom:4px" src="images/topic_img.png"/>' + obj.Title + '</p></div><div class="topic_img"><img original="http://www.taikorcdn.com/' + obj.ImageUrl + '" class="cover" src="images/hot_default.png" onerror="this.src=' + "'images/hot_error.png'" + '"><div class="maskimg"><img src="images/Mask.png"></div></div><div><span class="label-left">';
            if (getDateInOneHour(obj.PubDate)) {
                strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
            }
            else {
                strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
            }
            if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
            strlist += '</span></a></div></div></div></li>';
            $('#indexlist' + TopIndex).append(strlist);
            bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
        }
        else {
            //资讯格式
            if (obj.Type == "1" || obj.Type == "10") {
                // alert("测试obj.Type==10");
                strlist = '<li id="' + TopIndex + '_' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="smallPic-title"><p>' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
                if (getDateInOneHour(obj.PubDate)) {
                    strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
                }
                else {
                    strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
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
                strlist += '</span><span class="label-right nolike"><img src="images/icon-cross.png" style="width:14px;margin-right:12px;"></span></div></a></div></div></div></li>';
                $('#indexlist' + TopIndex).append(strlist);
                db.transaction(function (tx1) {
                    tx1.executeSql('select * from Record_read_' + UserStatus + ' where ItemID=?', [obj.ItemID], function (tx1, res1) {
                        if (res1 != null && res1.rows != null && res1.rows.length > 0) {
                            $('#' + TopIndex + '_' + obj.ItemID).find('.smallPic-title').addClass('smallPic-title-read');
                        }
                    });
                }, function (e) {
                    // alert("获取已读文章: " + e.message);
                });
                bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
            }
        }
    }
    else {
        var strhot = '', strlist = '';
        if (obj.Type == "0") {
            //主题的原来版本
            strlist = '<li id="' + TopIndex + '_' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" value="' + obj.ItemID + '" class="hidden"><input type="hidden" PubDate="' + obj.PubDate + '" PushDate="' + obj.PushDate + '" value="' + obj.Type + '" class="type"><div class="topic_title"><p><img style="width:30px;margin-right:4px;margin-bottom:4px" src="images/topic_img.png"/>' + obj.Title + '</p></div><div class="topic_img"><img original="http://www.taikorcdn.com/' + obj.ImageUrl + '" class="cover" src="images/hot_default.png" onerror="this.src=' + "'images/hot_error.png'" + '"><div class="maskimg"><img src="images/Mask.png"></div></div><div><span class="label-left">';
            if (getDateInOneHour(obj.PubDate)) {
                strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
            }
            else {
                strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
            }
            if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
            strlist += '</span></a></div></div></div></li>';
            $('#indexlist').append(strlist);
            bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
        }
        else {
            //资讯格式
            if (obj.Type == "1" || obj.Type == "10") {
                if (obj.Type == "10") {
                    strlist = '<li id="' + TopIndex + '_' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="smallPic-title"><p><img style="width:20px;margin-right:4px;margin-bottom:4px" src="images/hot.png" />' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
                }
                else {
                    strlist = '<li id="' + TopIndex + '_' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="smallPic-title"><p>' + obj.Title + '</p></div><div class="smallPic-img"><img class="cover" alt="" original="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '" src="images/news_default.png" onerror="this.src=' + "'images/news_error.png'" + '"></div><div class="small-label"><span class="label-left">';
                }
                if (getDateInOneHour(obj.PubDate)) {
                    strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
                }
                else {
                    strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
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
                strlist += '</span><span class="label-right nolike"><img src="images/icon-cross.png" style="width:14px;margin-right:12px;"></span></div></a></div></div></div></li>';
                $('#indexlist').append(strlist);
                db.transaction(function (tx1) {
                    tx1.executeSql('select * from Record_read_' + UserStatus + ' where ItemID=?', [obj.ItemID], function (tx1, res1) {
                        if (res1 != null && res1.rows != null && res1.rows.length > 0) {
                            $('#' + TopIndex + '_' + obj.ItemID).find('.smallPic-title').addClass('smallPic-title-read');
                        }
                    });
                }, function (e) {
                    // alert("获取已读文章1: " + e.message);
                });
                bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
            }
            else {
                if (obj.Type == "9") {
                    $('#indexlist>li:last-child').find(".location").css("border", "none");
                    strlist = '<li id="' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="gap-point"></div><div class="lis"><div class="booler-box"><a href="#"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="booler-body"><div class="booler-right"><p>' + obj.Title + '</p></div><div class="booler-left"><span>由布尔财经机器编辑推送</span><img src="images/booler.png"></div></div></a></div><div class="gap-point"></div></div></div></li>';
                    $('#indexlist').append(strlist);
                }
                else {
                    if ((obj.PushDate).length == 13) {
                        var myDate = new Date(parseInt(obj.PushDate));
                    }
                    else {
                        if ((obj.PushDate).length == 10) {
                            var myDate = new Date(parseInt(obj.PushDate) * 1000);//把十位时间戳变成十三位时间戳，再变成时间
                        }
                    }
                    if (myDate.getDay() != 0 && myDate.getDay() != 6) {//时间看是星期几，如果是星期六和星期天，则不推出早中收盘推送
                        //早推送格式
                        if (obj.Type == "2") {
                            if ($('#indexlist>li:last-child').find(".type").val() != "morning" || ($('#indexlist>li:last-child').find(".type").val() == "morning" && $('#indexlist>li:last-child').find(".type").attr("PushDate") != obj.PushDate)) {
                                $('#indexlist>li:last-child').find(".location").css("border", "none");
                                strlist = '<li id="morning' + obj.ItemID + '" class="deleteli" ><input class="hidden" type="hidden" value="morning' + obj.ItemID + '"><input class="type" type="hidden" value="morning" PushDate="' + obj.PushDate + '"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 早间推送 】</div><div id="morning_list" class="morning_list"><div id="morning_ul"><ul></ul></div></div></li>';
                                $('#indexlist').append(strlist);
                                bind_indexlist("morning" + obj.ItemID, "morning" + obj.ItemID);
                                $("#morning" + obj.ItemID).find(".morning_list").after('<div id="point' + obj.ItemID + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                                var count = stockids.split(",");
                                addPointDown(obj.ItemID, count);
                                $('#indexlist>li:last-child').find("#morning_ul ul").append('<li id="' + TopIndex + '_' + obj.ItemID + '" class="moring_deleteli"><div style="overflow:hidden"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" value="' + obj.Type + '"><div class="recommand-title"><p>' + obj.Title + '</p></div></div></li>');
                                bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
                            }
                            else {
                                $('#indexlist>li:last-child').find("#morning_ul ul").append('<li id="' + TopIndex + '_' + obj.ItemID + '" class="moring_deleteli"><div style="overflow:hidden"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" value="' + obj.Type + '"><div class="recommand-title"><p>' + obj.Title + '</p></div></div></li>');
                                bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
                            }
                        }
                        else {
                            //午推送格式
                            if (obj.Type == "3") {
                                $('#indexlist>li:last-child').find(".location").css("border", "none");
                                strlist = '<li class="deleteli" id="' + TopIndex + '_' + obj.ItemID + '"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 午间推送 】</div><div class="noon-box"><div class="noon-backg"><p><span class="push_head">【午间盘面总结】</span><span>' + obj.Title + '</span></p></div><div class="clear"></div></div></div></div></li>';
                                $('#indexlist').append(strlist);
                                bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
                                $("#" + TopIndex + '_' + obj.ItemID).find(".noon-box").after('<div id="point' + obj.ItemID + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                                var count = stockids.split(",");
                                var pointId = obj.ItemID;
                                addPointDown(pointId, count);
                            }
                            else {
                                //收盘推送格式
                                if (obj.Type == "4") {
                                    $('#indexlist>li:last-child').find(".location").css("border", "none");
                                    strlist = '<li class="deleteli" id="' + TopIndex + '_' + obj.ItemID + '"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="' + obj.Type + '"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 收盘推送 】</div><div class="afternoon-box"><div class="afternoon-backg"><p><span class="push_head">【收盘盘面总结】</span><span>' + obj.Title + '</span></p></div><div class="clear"></div></div></div></div></li>';
                                    $('#indexlist').append(strlist);
                                    bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
                                    $("#" + TopIndex + '_' + obj.ItemID).find(".afternoon-box").after('<div id="point' + obj.ItemID + '"class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                                    var count = stockids.split(",");
                                    var pointId = obj.ItemID;
                                    addPointDown(pointId, count);
                                }
                            }
                        }
                    }
                    //晚推送格式
                    if (obj.Type == "5") {
                        $('#indexlist>li:last-child').find(".location").css("border", "none");
                        strlist = '<li id="' + TopIndex + '_' + obj.ItemID + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj.ItemID + '"><input type="hidden" class="type" PushDate="' + obj.PushDate + '" value="late"><div class="push_title">【 ' + GetPushDate(obj.PushDate) + ' 晚间新闻 】</div><div class="late-box"><div class="late-backg"><img class="cover" src="http://www.taikorcdn.com/reader/' + obj.ImageUrl + '"><div class="maskimg"><img src="images/Mask.png"></div><div class="late-title">' + obj.Title + '</div></div><div class="late_banner"><div class="banner_li"><div class="maskimg"><img src="images/Mark_late.png"></div><img class="cover" src="http://www.taikorcdn.com/reader_special/b/2d4778b3eb9b6789844df520bbf0d36f_big.jpg"></div><div class="banner_li" style="margin:0 0.8%"><div class="maskimg"><img src="images/Mark_late.png"></div><img class="cover" src="http://www.taikorcdn.com/reader_special/b/2d4778b3eb9b6789844df520bbf0d36f_big.jpg"></div><div class="banner_li"><div class="maskimg"><img src="images/Mark_late.png"></div><img class="cover" src="http://www.taikorcdn.com/reader_special/b/2d4778b3eb9b6789844df520bbf0d36f_big.jpg"></div><div class="clear"></div></div><div class="clear"></div></div><div class="gap-point"></div></div></div></li>';
                        $('#indexlist').append(strlist);
                        bind_indexlist(obj.ItemID, TopIndex + '_' + obj.ItemID);
                    }
                }
            }
        }
    }
}
//主题页上拉从服务器往下添加
function bind_listTop(obj) {
    var strhot = '', strlist = '';
    if (obj.Type == "0") {
        //主题的后来版本
        strlist = '<li id="' + TopIndex + '_' + obj.Id + '" class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="location"><a href="#"><input type="hidden" value="' + obj.Id + '" class="hidden"><input type="hidden" PubDate="' + obj.PubDate + '" PushDate="' + obj.PushDate + '" value="' + obj.Type + '" class="type"><div class="topic_title"><p><img style="width:30px;margin-right:4px;margin-bottom:4px" src="images/topic_img.png"/>' + obj.Title + '</p></div><div class="topic_img"><img src="images/hot_default.png" original="http://www.taikorcdn.com/' + obj.ImageUrl + '" class="cover" onerror="this.src=' + "'images/hot_error.png'" + '"><div class="maskimg"><img src="images/Mask.png"></div></div><div><span class="label-left">';
        if (getDateInOneHour(obj.PubDate)) {
            strlist += '<span class="time-red">' + getDateDiff(obj.PubDate) + '</span>';
        }
        else {
            strlist += '<span>' + getDateDiff(obj.PubDate) + '</span>';
        }
        if (obj.Tag != "" && obj.Tag != null && obj.Tag != undefined) {
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
        $('#indexlist' + TopIndex).append(strlist);
        bind_indexlist(obj.Id, TopIndex + '_' + obj.Id);
    }
}
//置顶6图图片显示
function bind_topSix() {
    // httpGet("Reader/HeadArticles?userID=" + UserID + '&dateTime=1481535001', "", true, ajax_success17, ajax_fail17);  //四次推送测试
    httpGet("Reader/HeadArticles?userID=" + UserID, "", true, ajax_success17, ajax_fail17);
    function ajax_success17(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                if (obj[0].Type == 2) {
                    $('#PushTop').append('<ul id="PushTop_ul"></ul>');
                    for (var i = 0; i < obj.length; i++) {
                        if ($("#PushTop_ul").find("li:first-child").find(".type").val() != "morning") {
                            strlist = '<li id="morning' + obj[i].Id + '" class="deleteli" ><input class="hidden" type="hidden" value="morning' + obj[i].Id + '"><input class="type" type="hidden" value="morning" PushDate="' + obj[i].PushDate + '"><div class="push_title">【 ' + GetPushDate(obj[i].PushDate) + ' 早间推送 】</div><div id="morning_list" class="morning_list"><div id="morning_ul"><ul></ul></div></div></li>';
                            $("#PushTop_ul").append(strlist);
                            bind_indexlist("morning" + obj[i].Id, "morning" + obj[i].Id);
                            $("#morning" + obj[i].Id).find(".morning_list").after('<div id="point' + obj[i].Id + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                            var count = stockids.split(",");
                            addPointDown(obj[i].Id, count);
                            $("#PushTop_ul").find("li:first-child").find("#morning_ul ul").append('<li id="' + TopIndex + '_' + obj[i].Id + '" class="moring_deleteli"><div style="overflow:hidden"><input type="hidden" class="hidden" value="' + obj[i].Id + '"><input type="hidden" class="type" value="' + obj[i].Type + '"><div class="recommand-title"><p>' + obj[i].Title + '</p></div></div></li>');
                            bind_indexlist(obj[i].Id, TopIndex + '_' + obj[i].Id);
                        }
                        else {
                            $("#PushTop_ul").find("li:first-child").find("#morning_ul ul").append('<li id="' + TopIndex + '_' + obj[i].Id + '" class="moring_deleteli"><div style="overflow:hidden"><input type="hidden" class="hidden" value="' + obj[i].Id + '"><input type="hidden" class="type" value="' + obj[i].Type + '"><div class="recommand-title"><p>' + obj[i].Title + '</p></div></div></li>');
                            bind_indexlist(obj[i].Id, TopIndex + '_' + obj[i].Id);
                        }
                    }
                }
                else if (obj[0].Type == 3) {
                    $('#PushTop').append('<ul id="PushTop_ul"></ul>');
                    strlist = '<li class="deleteli" id="' + TopIndex + '_' + obj[0].Id + '"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj[0].Id + '"><input type="hidden" class="type" PushDate="' + obj[0].PushDate + '" value="' + obj[0].Type + '"><div class="push_title">【 ' + GetPushDate(obj[0].PushDate) + ' 午间推送 】</div><div class="noon-box"><div class="noon-backg"><p><span class="push_head">【午间盘面总结】</span><span>' + obj[0].Title + '</span></p></div><div class="clear"></div></div></div></div></li>';
                    $('#PushTop_ul').append(strlist);
                    bind_indexlist(obj[0].Id, TopIndex + '_' + obj[0].Id);
                    $("#" + TopIndex + '_' + obj[0].Id).find(".noon-box").after('<div id="point' + obj[0].Id + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                    var count = stockids.split(",");
                    var pointId = obj[0].Id;
                    addPointDown(pointId, count);
                }
                else if (obj[0].Type == 4) {
                    $('#PushTop').append('<ul id="PushTop_ul"></ul>');
                    strlist = '<li class="deleteli" id="' + TopIndex + '_' + obj[0].Id + '"><div style="overflow:hidden"><div class="lis"><input type="hidden" class="hidden" value="' + obj[0].Id + '"><input type="hidden" class="type" PushDate="' + obj[0].PushDate + '" value="' + obj[0].Type + '"><div class="push_title">【 ' + GetPushDate(obj[0].PushDate) + ' 收盘推送 】</div><div class="afternoon-box"><div class="afternoon-backg"><p><span class="push_head">【收盘盘面总结】</span><span>' + obj[0].Title + '</span></p></div><div class="clear"></div></div></div></div></li>';
                    $('#PushTop_ul').append(strlist);
                    bind_indexlist(obj[0].Id, TopIndex + '_' + obj[0].Id);
                    $("#" + TopIndex + '_' + obj[0].Id).find(".afternoon-box").after('<div id="point' + obj[0].Id + '" class="recommand-point"><ul class="pointbox-ul"></ul></div><div class="gap-point"></div>');
                    var count = stockids.split(",");
                    var pointId = obj[0].Id;
                    addPointDown(pointId, count);
                }
                else if (obj[0].Type == 5) {
                    $("#PushTop").append('<li class="deleteli"><div style="overflow:hidden"><div class="lis"><div class="push_title">【 ' + GetPushDate(obj[0].PushDate) + ' 晚间新闻 】</div><div class="late-box"><div id="swiper" class="swiper-container swiper-container-top swiper-container-horizontal"><div class="swiper-wrapper"></div></div><div id="swiper1" class="swiper-container swiper-container-bottom"><div class="swiper-wrapper"></div></div></div><div class="gap-point"></div></div></div></li>');
                    for (var i = 0; i < obj.length; i++) {
                        $('#swiper').find('.swiper-wrapper').append('<div id="' + TopIndex + '_' + obj[i].Id + '" class="swiper-slide"><input type="hidden" class="hidden" value="' + obj[i].Id + '"><input type="hidden" class="type" PushDate="' + obj[i].PushDate + '" value="' + obj[i].Type + '"><div class="late-backg"><img class="cover" original="http://www.taikorcdn.com/reader/' + obj[i].ImageUrl + '" src="images/late_default.png" onerror="this.src=' + "'images/late_error.png'" + '"><div class="maskimg"><img src="images/Mask.png"></div><div class="late-title">' + obj[i].Title + '</div></div></div>');
                        strlist = '<div class="banner_li swiper-slide"><img class="cover" original="http://www.taikorcdn.com/reader/' + obj[i].ImageUrl + '" src="images/late_default.png" onerror="this.src=' + "'images/late_error.png'" + '"></div>';
                        $('#swiper1').find('.swiper-wrapper').append(strlist);
                        bind_indexlist(obj[i].Id, TopIndex + '_' + obj[i].Id);
                    }
                    add_Swiper();
                }
            }
            else {
                $("#PushTop").addClass("Page");
            }
        }
        else {
            $("#PushTop").addClass("Page");
        }
        runing();
        myScroll.refresh();
    }
    function ajax_fail17() {
        bind_topSix();
    }

}
//swiper属性添加
function add_Swiper() {
    $swiper1 = $('#swiper1 .swiper-slide');
    mySwiper = new Swiper('.swiper-container-top', {
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        onTransitionStart: function (swiper) {
            $swiper1.eq(mySwiper.activeIndex).addClass('swiper-slide-active');
            $swiper1.eq(mySwiper.activeIndex).siblings().removeClass('swiper-slide-active');
        },
    })
    mySwiper1 = new Swiper('.swiper-container-bottom', {
        spaceBetween: 10,
        slidesPerView: 3,
    })
    $swiper1.each(function (i) {
        $(this).bind("click", function () {
            $(this).addClass('swiper-slide-active');
            $(this).siblings().removeClass('swiper-slide-active');
            mySwiper.slideTo(i, 200, false);
        })
    })
}
//绑定首页每个资讯的事件
function bind_indexlist(id, bindId) {
    $('#' + bindId).bind('click', function (event) {
        event.stopPropagation();
        if ((TopIndex == 0 && loadingStep == 0) || (TopIndex != 0 && loadingStepMore[TopIndex] == 0)) {
            if (TopIndex != 0) {
                if ($("#indexlist" + TopIndex + ">li:last-child").find(".type").val() == "morning") {
                    var lastliId = $("#indexlist" + TopIndex + ">li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
                }
                else {
                    var lastliId = $("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val();
                }
            }
            else {
                if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
                    var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
                }
                else {
                    var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
                }
            }
            //资讯
            if ($(this).find('.type').val() == "1" || $(this).find('.type').val() == "2" || $(this).find('.type').val() == "5" || $(this).find('.type').val() == "10") {
                if ($(this).find('.type').val() == "1" || $(this).find('.type').val() == "10") {
                    db.transaction(function (tx) {
                        tx.executeSql('delete from Record_read_' + UserStatus + ' where id not in(select id from Record_read_' + UserStatus + ' order by id desc limit 0,1000)', [], function (tx, res) {
                            tx.executeSql("replace INTO Record_read_" + UserStatus + " (ItemID) VALUES (?)", [id], function (tx, res) {
                            });
                        });
                    }, function (e) {
                        // alert("记录阅读的新闻: " + e.message);
                    });
                }
                var myDate = new Date();
                var newsType = $(this).find('.type').val();
                var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: $(this).find('.type').val() }; //用户进入文章行为需要传的参数
                // alert("UserID=" + UserID + " && LogItemID=" + id + " && LogTime=" + myDate.getTime() + " && LogState=1" + " && Type=" + $(this).find('.type').val());
                GotoNews(id, newsType, BehaviorLogData);
            }
            else {
                //早推送
                if ($(this).find('.type').val() == "morning") {
                    id = id.replace($(this).find('.type').val(), "");
                    var pointTime = $(this).find('.type').attr("PushDate" );
                    if (TopIndex != 0) {
                        db.transaction(function (tx) {
                            tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                                AddGoback('indexNews.html?firstLoad=no', 'earlyPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                // slide('left', 'lightblue', 1, 'earlyPush.html?itemid=' + id + '&pointTime=' + pointTime);
                            });
                        }, function (e) {
                            // alert("itemListSe1ERROR: " + e.message);
                        });
                    }
                    else {
                        db.transaction(function (tx) {
                            tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                                AddGoback('indexNews.html?firstLoad=no', 'earlyPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                // slide('left', 'lightblue', 1, 'earlyPush.html?itemid=' + id + '&pointTime=' + pointTime);
                            });
                        }, function (e) {
                            // alert("itemListSe1ERROR: " + e.message);
                        });
                    }
                }
                else {
                    //午推送
                    if ($(this).find('.type').val() == "3") {
                        // id = id.replace($(this).find('.type').val(), "");
                        var pointTime = $(this).find('.type').attr("PushDate");
                        if (TopIndex != 0) {
                            db.transaction(function (tx) {
                                tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                                    AddGoback('indexNews.html?firstLoad=no', 'noonPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                    // slide('left', 'lightblue', 1, 'noonPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                });
                            }, function (e) {
                                // alert("itemListSe1ERROR: " + e.message);
                            });
                        }
                        else {
                            db.transaction(function (tx) {
                                tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                                    AddGoback('indexNews.html?firstLoad=no', 'noonPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                    // slide('left', 'lightblue', 1, 'noonPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                });
                            }, function (e) {
                                // alert("itemListSe1ERROR: " + e.message);
                            });
                        }
                    }
                    else {
                        //收盘推送
                        if ($(this).find('.type').val() == "4") {
                            // id = id.replace($(this).find('.type').val(), "");
                            var pointTime = $(this).find('.type').attr("PushDate");
                            if (TopIndex != 0) {
                                db.transaction(function (tx) {
                                    tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                                        AddGoback('indexNews.html?firstLoad=no', 'afternoonPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                    });
                                }, function (e) {
                                    // alert("itemListSe1ERROR: " + e.message);
                                });
                            }
                            else {
                                db.transaction(function (tx) {
                                    tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                                        AddGoback('indexNews.html?firstLoad=no', 'afternoonPush.html?itemid=' + id + '&pointTime=' + pointTime);
                                    });
                                }, function (e) {
                                    // alert("itemListSe1ERROR: " + e.message);
                                });
                            }
                        }
                        else {
                            //晚推送
                            if ($(this).find('.type').val() == "late") {
                                var pointTime = $(this).find('.type').attr("PushDate");
                                if (TopIndex != 0) {
                                    db.transaction(function (tx) {
                                        tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                                            AddGoback('indexNews.html?firstLoad=no', 'latePush.html?pointTime=' + pointTime);
                                            // slide('left', 'lightblue', 1, 'latePush.html?pointTime=' + pointTime);
                                        });
                                    }, function (e) {
                                        // alert("itemListSe1ERROR: " + e.message);
                                    });
                                }
                                else {
                                    db.transaction(function (tx) {
                                        tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                                            AddGoback('indexNews.html?firstLoad=no', 'latePush.html?pointTime=' + pointTime);
                                            // slide('left', 'lightblue', 1, 'latePush.html?pointTime=' + pointTime);
                                        });
                                    }, function (e) {
                                        // alert("itemListSe1ERROR: " + e.message);
                                    });
                                }
                                // slide('left', 'lightblue', 1, 'latePush.html');
                            }
                            else {
                                //小布推文
                                if ($(this).find('.type').val() == "9") {
                                    // alert("小布推文");
                                }
                                else {
                                    if ($(this).find('.type').val() == "0") {
                                        if (TopIndex != 0) {
                                            db.transaction(function (tx) {
                                                tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                                                    AddGoback('indexNews.html?firstLoad=no', 'special.html?topicID=' + id);
                                                });
                                            }, function (e) {
                                                // alert("itemListSe1ERROR: " + e.message);
                                            });
                                        }
                                        else {
                                            db.transaction(function (tx) {
                                                tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                                                    AddGoback('indexNews.html?firstLoad=no', 'special.html?topicID=' + id);
                                                });
                                            }, function (e) {
                                                // alert("itemListSe1ERROR: " + e.message);
                                            });
                                        }
                                    }
                                    else {
                                        if ($(this).find('.type').val() == "unable") {
                                            window.plugins.toast.show("非交易时间没有此推送", 300, "center");
                                        }
                                        else {

                                            var pointTime = $(this).find('.type').attr("PushDate");
                                            if ($(this).find('.type').val() == "morningPush") {
                                                AddGoback('indexNews.html?firstLoad=no', 'earlyPush.html?pointTime=' + pointTime);
                                                // slide('left', 'lightblue', 1, 'earlyPush.html?pointTime=' + pointTime);
                                            }
                                            else {
                                                if ($(this).find('.type').val() == "noonPush") {
                                                    AddGoback('indexNews.html?firstLoad=no', 'noonPush.html?pointTime=' + pointTime);
                                                    // slide('left', 'lightblue', 1, 'noonPush.html?pointTime=' + pointTime);
                                                }
                                                else {
                                                    if ($(this).find('.type').val() == "afternoonPush") {
                                                        AddGoback('indexNews.html?firstLoad=no', 'afternoonPush.html?pointTime=' + pointTime);
                                                    }
                                                    else {
                                                        if ($(this).find('.type').val() == "latePush") {
                                                            AddGoback('indexNews.html?firstLoad=no', 'latePush.html?pointTime=' + pointTime);
                                                            // slide('left', 'lightblue', 1, 'latePush.html?pointTime=' + pointTime);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    $('#' + bindId).find('.nolike').bind('click', function (event) {
        event.stopPropagation();
        $("#app-index").after('<div id="cover" style="position: fixed; z-index: 2; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2;width:100%;height:100%"><div>');
        $("#cover").after('<div id="nointerest" class="nointerest"><img src="images/icon-nolike.png" style="width:100px;"></div>')
        $("#nointerest").css({ "top": ($(this).offset().top - 25) + "px" });
        $("#nointerest").css({ "left": ($(this).offset().left + 22) + "px" });
        //列表页里面点击了不感兴趣
        $("#nointerest").bind("click", function (event) {
            event.stopPropagation();
            var myDate = new Date();
            var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 6, Type: $("#" + id).find('.type').val() }; //用户不喜欢行为需要传的参数
            GotoNolike(BehaviorLogData, id);
        })
        //列表页不感兴趣后点击了空白地方
        $("#cover").bind("click", function (event) {
            event.stopPropagation();
            $("#cover").remove();
            $("#nointerest").remove();
        })
    })
}
//进入文章详情的行为记录
function GotoNews(id, newsType, BehaviorLogData) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success6, ajax_fail6);
    function ajax_success6(obj) {
        if (TopIndex != 0) {
            if ($("#indexlist" + TopIndex + ">li:last-child").find(".type").val() == "morning") {
                var lastliId = $("#indexlist" + TopIndex + ">li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
            }
            else {
                var lastliId = $("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val();
            }
        }
        else {
            if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
                var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
            }
            else {
                var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
            }
        }
        if (TopIndex != 0) {
            db.transaction(function (tx) {
                tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                    AddGoback('indexNews.html?firstLoad=no', 'newsInfo.html?itemid=' + id + '&newsType=' + newsType);
                    // slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType + '&fromPage=index');
                });
            }, function (e) {
                // alert("itemListSe1ERROR: " + e.message);
            });
        }
        else {
            db.transaction(function (tx) {
                tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                    AddGoback('indexNews.html?firstLoad=no', 'newsInfo.html?itemid=' + id + '&newsType=' + newsType);
                    // slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=' + newsType + '&fromPage=index');
                });
            }, function (e) {
                // alert("itemListSe1ERROR: " + e.message);
            });
        }
    }
    function ajax_fail6() {
        // window.plugins.toast.show("无网络或网络连接失败，请检查网络后重试", 500, "center");
        ajax_success6();
    }
}
//首页不喜欢行为的记录
function GotoNolike(BehaviorLogData, id) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success7, ajax_fail7);
    function ajax_success7(obj) {
        $("#" + id).remove();
        $("#cover").remove();
        $("#nointerest").remove();
        if (TopIndex != "0") {
            myScrollMore[TopIndex].refresh();
        }
        else {
            myScroll.refresh();
        }
        window.plugins.toast.showShortBottom("您的兴趣已反馈成功");
    }
    function ajax_fail7(netStatus) {
        $("#cover").remove();
        $("#nointerest").remove();
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

//上拉事件
function pullUpAction() {
    setTimeout(function () {
        db.transaction(function (tx) {
            if (TopIndex != "0") {
                tx.executeSql('select * from Item_list_category_' + UserStatus + ' where PartId=? order by idd desc', [category], function (tx, res) {
                    var z;
                    for (var i = 0; i < res.rows.length; i++) {
                        if ($("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val() == res.rows.item(i).ItemID) {
                            z = i + 1;
                            break;
                        }
                    }
                    for (var i = z; i < z + 10; i++) {
                        if (i < res.rows.length) {
                            bind_list(res.rows.item(i));
                        }
                        else {
                            break;
                        }
                    }
                    runing();
                    touchTag();
                    pullUpElMore[TopIndex].removeClass('loading');
                    pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                    pullUpLMore[TopIndex].html('上拉加载更多');
                    pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                    pullUpElMore[TopIndex].attr('class', '').hide();
                    myScrollMore[TopIndex].refresh();
                    loadingStepMore[TopIndex] = 0;
                })
            }
            else {
                tx.executeSql('select * from Item_list_' + UserStatus + ' order by idd desc', [], function (tx, res) {
                    var z;
                    for (var i = 0; i < res.rows.length; i++) {
                        if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
                            // alert("测试早推送");
                            var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
                        }
                        else {
                            var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
                        }
                        if (lastliId == res.rows.item(i).ItemID) {
                            z = i + 1;
                            break;
                        }
                    }
                    for (var i = z; i < z + 10; i++) {
                        if (i < res.rows.length) {
                            bind_list(res.rows.item(i));
                        }
                        else {
                            break;
                        }
                    }
                    runing();
                    touchTag();

                    pullUpEl.removeClass('loading');
                    pullUpI.attr("src", "images/PullUp.png");
                    pullUpL.html('上拉加载更多');
                    pullUpEl['class'] = pullUpEl.attr('class');
                    pullUpEl.attr('class', '').hide();
                    myScroll.refresh();
                    loadingStep = 0;
                })
            }
        }, function (e) {
            // alert("pullUpActionERROR: " + e.message);
        });
    }, 1000);
}
//主题页上拉
function pullUpActionTopic() {
    pulldownCount = 10;
    var pubdate = $("#indexlist" + TopIndex + ">li:last-child").find(".type").attr("PubDate");
    pubdate = getDateTimeStamp(pubdate) / 1000;
    httpGet("Reader/Articles?userID=" + UserID + "&count=" + pulldownCount + "&category=" + category + "&dateTime=" + pubdate + "&authorName=&version=" + NowVerision, "", true, ajax_success18, ajax_fail18);
    function ajax_success18(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 1) {
                for (var i = 1; i < obj.length; i++) {
                    bind_listTop(obj[i]);
                }
                pullUpElMore[TopIndex].removeClass('loading');
                pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                pullUpLMore[TopIndex].html('上拉加载更多');
                pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                pullUpElMore[TopIndex].attr('class', '').hide();
                myScrollMore[TopIndex].refresh();
                loadingStepMore[TopIndex] = 0;
            }
            else {
                pullUpIMore[TopIndex].addClass("Page");
                pullUpLMore[TopIndex].html('无更多数据');
                setTimeout(function () {
                    pullUpIMore[TopIndex].removeClass("Page");
                    pullUpElMore[TopIndex].removeClass('loading');
                    pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                    pullUpLMore[TopIndex].html('上拉加载更多');
                    pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                    pullUpElMore[TopIndex].attr('class', '').hide();
                    myScrollMore[TopIndex].refresh();
                    loadingStepMore[TopIndex] = 0;
                }, 1000);
            }
        }
        else {
            pullUpIMore[TopIndex].addClass("Page");
            pullUpLMore[TopIndex].html('无更多数据');
            setTimeout(function () {
                pullUpIMore[TopIndex].removeClass("Page");
                pullUpElMore[TopIndex].removeClass('loading');
                pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
                pullUpLMore[TopIndex].html('上拉加载更多');
                pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
                pullUpElMore[TopIndex].attr('class', '').hide();
                myScrollMore[TopIndex].refresh();
                loadingStepMore[TopIndex] = 0;
            }, 1000);
        }
    }
    function ajax_fail18() {
        pullUpLMore[TopIndex].html('获取失败，请重试');
        setTimeout(function () {
            pullUpElMore[TopIndex].removeClass('loading');
            pullUpIMore[TopIndex].attr("src", "images/PullUp.png");
            pullUpLMore[TopIndex].html('上拉加载更多');
            pullUpElMore[TopIndex]['class'] = pullUpElMore[TopIndex].attr('class');
            pullUpElMore[TopIndex].attr('class', '').hide();
            myScrollMore[TopIndex].refresh();
            loadingStepMore[TopIndex] = 0;
        }, 1000);
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
//下拉事件
function pullDownAction() {
    if (TopIndex != "0") {
        loadingStepMore[TopIndex] = 2;
    }
    else {
        loadingStep = 2;
    }
    if (category == "Topic") {
        var pulldownCount = 4;
    }
    else {
        var pulldownCount = 30;
    }
    setTimeout(function () {
        var myDate = new Date();
        httpGet("Reader/Articles?userID=" + UserID + "&count=" + pulldownCount + "&category=" + category + "&dateTime=" + parseInt(myDate.getTime() / 1000) + "&authorName=&version=" + NowVerision, "", true, ajax_success8, ajax_fail8);
        function ajax_success8(obj) {
            if (obj != null && obj != "" && obj != undefined) {
                var strhot = "", strlist = "";
                if (category != "Topic") {
                    $('#LiResh' + TopIndex).remove();
                    if (TopIndex != "0") {
                        $('#indexlist' + TopIndex).prepend('<li id="LiResh' + TopIndex + '" class="LiResh">刚刚看到这里，点击刷新</li>');
                        pullDownElMore[TopIndex].after('<div class="PullDownOver">成功为您更新' + obj.length + '条内容</div>');
                    }
                    else {
                        $('#indexlist').prepend('<li id="LiResh' + TopIndex + '" class="LiResh">刚刚看到这里，点击刷新</li>');
                        pullDownEl.after('<div class="PullDownOver">成功为您更新' + obj.length + '条内容</div>');
                    }
                    $('#LiResh' + TopIndex).bind("click", function () {
                        if (TopIndex != "0") {
                            if (loadingStepMore[TopIndex] == 0) {
                                myScrollMore[TopIndex].scrollTo(0, 0, 0, IScroll.utils.ease.elastic);
                                pullDownElMore[TopIndex].show();
                                pullDownLMore[TopIndex].show();
                                pullDownElMore[TopIndex].removeClass('flip').addClass('loading');
                                pullDownIMore[TopIndex].attr("src", "images/iconLoading.gif");
                                pullDownLMore[TopIndex].html('加载中...');
                                loadingStepMore[TopIndex] = 2;
                                pullDownAction();
                            }
                        }
                        else {
                            // alert("测试loadingStep=" + loadingStep);
                            if (loadingStep == 0) {
                                myScroll.scrollTo(0, 0, 0, IScroll.utils.ease.elastic);
                                pullDownEl.show();
                                pullDownL.show();
                                pullDownEl.removeClass('flip').addClass('loading');
                                pullDownI.attr("src", "images/iconLoading.gif");
                                pullDownL.html('加载中...');
                                loadingStep = 2;
                                pullDownAction();
                            }
                        }
                    })
                }
                for (var i = obj.length - 1; i >= 0; i--) {
                    bind_listUp(obj[i]);
                }
                runing();
                touchTag();
                if (category != "Topic") {
                    itemListIn(obj);
                }
                else {
                    isImgLoad(function () {
                        $("#loading").addClass("Page");
                        myScrollMore[TopIndex].refresh();
                    });
                }
                if (TopIndex != "0") {
                    var myDate = new Date();
                    //下拉时更新更新表中时间
                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO updateTime_" + UserStatus + "(TopIndex,Time) VALUES (?,?)", [TopIndex, myDate.getTime()], function (tx, res) {
                            // alert("更新时间插入成功：" + TopIndex);
                        });
                    }, function (e) {
                        //alert("pullDownActionERROR: " + e.message);
                    });
                    pullDownElMore[TopIndex].removeClass('loading');
                    pullDownIMore[TopIndex].attr("src", "images/PullDown.png");
                    pullDownLMore[TopIndex].html('下拉刷新');
                    pullDownElMore[TopIndex]['class'] = pullDownElMore[TopIndex].attr('class');
                    pullDownElMore[TopIndex].attr('class', '').hide();
                    pullDownLMore[TopIndex].hide();
                    myScrollMore[TopIndex].refresh();
                    loadingStepMore[TopIndex] = 0;
                }
                else {
                    var myDate = new Date();
                    //下拉时更新更新表中时间
                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO updateTime_" + UserStatus + "(TopIndex,Time) VALUES (?,?)", [TopIndex, myDate.getTime()], function (tx, res) {
                            // alert("更新时间插入成功：" + TopIndex);
                        });
                    }, function (e) {
                        //alert("pullDownActionERROR: " + e.message);
                    });
                    pullDownEl.removeClass('loading');
                    pullDownI.attr("src", "images/PullDown.png");
                    pullDownL.html('下拉刷新');
                    pullDownEl['class'] = pullDownEl.attr('class');
                    pullDownEl.attr('class', '').hide();
                    pullDownL.hide();
                    myScroll.refresh();
                    loadingStep = 0;
                }
                if (category != "Topic") {
                    setTimeout(function () {
                        $(".PullDownOver").remove();
                    }, 1000);
                }
            }
            else {
                if (TopIndex != "0") {
                    pullDownIMore[TopIndex].addClass("Page");
                    pullDownLMore[TopIndex].html('没有最新数据了');
                }
                else {
                    pullDownI.addClass("Page");
                    pullDownL.html('没有最新数据了');
                }
                setTimeout(function () {
                    if (TopIndex != "0") {
                        pullDownIMore[TopIndex].removeClass("Page");
                        pullDownElMore[TopIndex].removeClass('loading');
                        pullDownIMore[TopIndex].attr("src", "images/PullDown.png");
                        pullDownLMore[TopIndex].html("下拉刷新");
                        pullDownElMore[TopIndex]['class'] = pullDownElMore[TopIndex].attr('class');
                        pullDownElMore[TopIndex].attr('class', '').hide();
                        pullDownLMore[TopIndex].hide();
                        myScrollMore[TopIndex].refresh();
                        loadingStepMore[TopIndex] = 0;
                    }
                    else {
                        pullDownI.removeClass("Page");
                        pullDownEl.removeClass('loading');
                        pullDownI.attr("src", "images/PullDown.png");
                        pullDownL.html("下拉刷新");
                        pullDownEl['class'] = pullDownEl.attr('class');
                        pullDownEl.attr('class', '').hide();
                        pullDownL.hide();
                        myScroll.refresh();
                        loadingStep = 0;
                    }
                }, 1000);
            }
        }
        function ajax_fail8(netStatus) {
            if (TopIndex != "0") {
                if (category == "Topic") {
                    pullDownLMore[TopIndex].html('拉取失败');
                    setTimeout(function () {
                        pullDownElMore[TopIndex].removeClass('loading');
                        pullDownIMore[TopIndex].attr("src", "images/PullDown.png");
                        pullDownLMore[TopIndex].html('下拉刷新');
                        pullDownElMore[TopIndex]['class'] = pullDownElMore[TopIndex].attr('class');
                        pullDownElMore[TopIndex].attr('class', '').hide();
                        pullDownLMore[TopIndex].hide();
                        myScrollMore[TopIndex].refresh();
                        loadingStepMore[TopIndex] = 0;
                    }, 1000);
                    $("#loading").addClass("Page");
                    $("#all").addClass("Page");
                    $("#app-index").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
                    $("#refesh").bind("click", function (event) {
                        $('#refesh').remove();
                        $("#loading").removeClass("Page");
                        $("#all").removeClass("Page");
                        pullDownAction();
                        myScrollMore[TopIndex].refresh();
                    })
                }
                else {
                    pullDownLMore[TopIndex].html('拉取失败');
                    setTimeout(function () {
                        pullDownElMore[TopIndex].removeClass('loading');
                        pullDownIMore[TopIndex].attr("src", "images/PullDown.png");
                        pullDownLMore[TopIndex].html('下拉刷新');
                        pullDownElMore[TopIndex]['class'] = pullDownElMore[TopIndex].attr('class');
                        pullDownElMore[TopIndex].attr('class', '').hide();
                        pullDownLMore[TopIndex].hide();
                        myScrollMore[TopIndex].refresh();
                        loadingStepMore[TopIndex] = 0;
                    }, 1000);
                }
            }
            else {
                pullDownL.html('拉取失败');
                setTimeout(function () {
                    pullDownEl.removeClass('loading');
                    pullDownI.attr("src", "images/PullDown.png");
                    pullDownL.html('下拉刷新');
                    pullDownEl['class'] = pullDownEl.attr('class');
                    pullDownEl.attr('class', '').hide();
                    pullDownL.hide();
                    myScroll.refresh();
                    loadingStep = 0;
                }, 1000);
            }
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
    }, 1000);
}
//从服务器取SQL语句，更新
function update_lg() {
    db.transaction(function (tx) {
        tx.executeSql("select * from User", [], function (tx, res) {
            if (res.rows.item(0).UserlgID != null && res.rows.item(0).UserlgID != "") {
                var hashId = res.rows.item(0).UserlgID;
                db.transaction(function (tx) {
                    tx.executeSql("select * from OperateID where id > (select id from OperateID where OperateID=?)", [hashId], function (tx, res) {
                        var count = res.rows.length;
                        update_ajax(hashId, count);
                    })
                }, function (e) {
                    //alert("1update_lgERROR: " + e.message);
                });
            }
            else {
                var hashId = "";
                var count = 0;
                update_ajax(hashId, count);
            }
        })
    }, function (e) {
        //alert("1update_lgERROR: " + e.message);
    });
}
function update_ajax(hashId, count) {
    httpGet("Reader/UserCollection?userID=" + UserID + "&hashId=" + hashId + "&count=" + count, "", true, ajax_success9, ajax_fail9);
    function ajax_success9(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            hashId = obj[obj.length - 1].ID;
            db.transaction(function (tx) {
                tx.executeSql("UPDATE User SET UserlgID=? where id =?", [hashId, 1], function (tx, res) {
                    ////alert("将最后一次ID存入：" + UserlgID);
                })
            }, function (e) {
                //alert("update_lg1ERROR: " + e.message);
            });
            for (var i = 0; i < obj.length; i++) {
                var TxtSQL = obj[i].TxtSQL;//替换summary里面的单引号
                db.executeSql(TxtSQL, [], function (res) {
                },
                    function (error) {
                        //alert('TxtSQL1 error: ' + error.message + "&&" + obj[i].ID);
                    });
            }
        }
        else {

        }
    }
    function ajax_fail9() {
    }
}
function touchicon_My(event) {
    event.preventDefault();
    AddGoback('indexNews.html?firstLoad=no', 'indexMy.html');
    // slide('left', 'lightblue', 1, 'indexMy.html');
}
function touchBannerAdd(event) {
    event.preventDefault();
    AddGoback('indexNews.html?firstLoad=no', 'BannerAdd.html');
}
//下面导航的点击事件(进入我的首页)
function touchMy(event) {
    event.preventDefault();
    if (TopIndex != 0) {
        if ($("#indexlist" + TopIndex + ">li:last-child").find(".type").val() == "morning") {
            var lastliId = $("#indexlist" + TopIndex + ">li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
        }
        else {
            var lastliId = $("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val();
        }
    }
    else {
        if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
            var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
        }
        else {
            var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
        }
    }
    if (TopIndex != 0) {
        db.transaction(function (tx) {
            tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                slideQuick('left', 'lightblue', 1, 'myChose.html');
            });
        }, function (e) {
            // alert("itemListSe1ERROR: " + e.message);
        });
    }
    else {
        db.transaction(function (tx) {
            tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                slideQuick('left', 'lightblue', 1, 'myChose.html');
            });
        }, function (e) {
            // alert("itemListSe1ERROR: " + e.message);
        });
    }

    if ($("#indexlist>li").length == "0") {
        slideQuick('left', 'lightblue', 1, 'myChose.html');
    }
}
//下面导航的点击事件(进入机会首页)
function touchOpp(event) {
    event.preventDefault();
    if (TopIndex != 0) {
        if ($("#indexlist" + TopIndex + ">li:last-child").find(".type").val() == "morning") {
            var lastliId = $("#indexlist" + TopIndex + ">li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
        }
        else {
            var lastliId = $("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val();
        }
    }
    else {
        if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
            var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
        }
        else {
            var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
        }
    }
    if (TopIndex != 0) {
        db.transaction(function (tx) {
            tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                slideQuick('right', 'lightblue', 1, 'index.html?firstLoad=no');
            });
        }, function (e) {
            // alert("itemListSe1ERROR: " + e.message);
        });
    }
    else {
        db.transaction(function (tx) {
            tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                slideQuick('right', 'lightblue', 1, 'index.html?firstLoad=no');
            });
        }, function (e) {
            // alert("itemListSe1ERROR: " + e.message);
        });
    }

    if ($("#indexlist>li").length == "0") {
        slideQuick('right', 'lightblue', 1, 'index.html?firstLoad=no');
    }
}
//判断网址后面是否带参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//点击顶部标签进行相应响应和switchTo事件响应，首次打开（推荐），后面根据点击或者记录的顶部标签位置
function top_tagclick(top_id, top_tag, top_name) {
    // alert(top_tag + "&&" + top_name + "&&" + top_id);
    sessionStorage.W_TopIndex = top_id;
    sessionStorage.W_category = top_tag;
    $('#gotop').addClass("Page");
    $('#refesh').remove();
    $("#loading").removeClass("Page");
    category = top_tag;
    categoryName = top_name;
    TopIndex = top_id;
    // db.transaction(function (tx) {
    //     tx.executeSql('REPLACE INTO Record_TopIndex(id, TopIndex) VALUES (?,?)', [1, top_id], function (tx, res) { });
    // }, function (e) {
    //     // alert("itemListInAndSe2ERROR: " + e.message);
    // });
    if (TopIndex == "0") {
        $("#indexlist").css("min-height", $(window).height());//设置最小高度，用来保证文章不够一屏时也能上拉下拉
        $("#contentA").removeClass("Page");
        $("#contentA").siblings().addClass("Page");
        if ($("#indexlist").html() == "") {
            loaded();
            checkConnection();
            myScroll.refresh();
        }
        else {
            $("#loading").addClass("Page");
            myScroll.refresh();
        }
    }
    else {
        $("#indexlist" + TopIndex).css("min-height", $(window).height());//设置最小高度，用来保证文章不够一屏时也能上拉下拉
        $("#contentA" + TopIndex).removeClass("Page");
        $("#contentA" + TopIndex).siblings().addClass("Page");
        if (category == "Topic" && $("#indexlist" + TopIndex).html() == "") {
            loaded();
            pullDownAction();
            // myScrollMore[TopIndex].refresh();
        }
        else {
            if (category == "Topic" && $("#indexlist" + TopIndex).html() != "") {
                $("#loading").addClass("Page");
                myScrollMore[TopIndex].refresh();
            }
            else {
                if ($("#indexlist" + TopIndex).html() == "" && category != "PushHistory") {
                    loaded();
                    checkConnection();
                    myScrollMore[TopIndex].refresh();
                }
                else {
                    if ($("#indexlist" + TopIndex).html() != "" && category != "PushHistory") {
                        $("#loading").addClass("Page");
                        myScrollMore[TopIndex].refresh();
                    }
                    else {
                        if ($("#indexlist" + TopIndex).html() != "") {
                            loaded();
                            $("#loading").addClass("Page");
                            myScrollMore[TopIndex].refresh();
                        }
                        else {
                            var date = new Date();
                            var dat = new Date(getDateTimeStamp(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 20:00:00"));
                            endTime = parseInt(dat.getTime() / 1000);
                            loaded();
                            push_history();
                        }
                    }
                }
            }
        }
    }
}
//列表页所有图片随屏滚动显示
function runing() {
    var $winH = $(window).height();//获取窗口高度
    var $img = $(".deleteli img");
    var $imgH = parseInt($img.height() / 100);//图片到一半的时候显示
    var $srcDef = "a.gif";

    $img.each(function (i) {//遍历img
        if ($img.eq(i).attr("src") == "images/news_default.png" || $img.eq(i).attr("src") == "images/hot_default.png" || $img.eq(i).attr("src") == "images/late_default.png") {//如果图片加载失败,用我们的备用图
            var $src = $img.eq(i).attr("original");//获取当前img URL地址
            var $scroTop = $img.eq(i).offset();//获取图片位置
            if ($scroTop.top + $imgH >= $(window).scrollTop() && $(window).scrollTop() + $winH >= $scroTop.top + $imgH) {//判断窗口至上往下的位置
                if ($img.eq(i).attr("src") == $srcDef) {
                    $img.eq(i).hide();
                }
                //$img.eq(i).attr("src", function () { return $src }).fadeIn(300);//元素属性的交换  zepto没有fadeIn和fadeOut
                $img.eq(i).attr("src", $src);
                //$img.eq(1).attr("src", "images/aa.png");
            }
        }
    })
}
//下拉时添加指数格式
function addPointDown(pointId, count) {
    httpGet("Reader/Stocks?stockIds=" + stockids + "&sortType=0&count=" + count.length, "", true, ajax_success11, ajax_fail11);
    function ajax_success11(obj) {
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
                $('#point' + pointId + ' .pointbox-ul').append('<li class="pointbox-li"><ul id="point-li' + j + '" class="point-ul"></ul><div class="clear"></div></li>');
                for (var z = j * 3; z < j * 3 + 3; z++) {
                    if (obj[z].Pricechange > 0) {
                        $('#point' + pointId + ' #point-li' + j).append('<li id="' + obj[z].Symbol + '"><p>' + obj[z].Name + '</p><p class="pointRed">' + obj[z].Trade.toFixed(2) + '</p><p class="pointRed"><span>+' + obj[z].Pricechange.toFixed(2) + '</span><span>+' + obj[z].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                    else {
                        $('#point' + pointId + ' #point-li' + j).append('<li id="' + obj[z].Symbol + '"><p>' + obj[z].Name + '</p><p class="point">' + obj[z].Trade.toFixed(2) + '</p><p class="point"><span>' + obj[z].Pricechange.toFixed(2) + '</span><span>' + obj[z].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                }
            }
            if (m > 0) {
                $('#point' + pointId + ' .pointbox-ul').append('<li class="pointbox-li"><ul id="point-li' + n + '" class="point-ul"></ul><div class="clear"></div></li>');
                for (var i = 0; i < m; i++) {
                    if (obj[z + i].Pricechange > 0) {
                        $('#point' + pointId + ' #point-li' + n).append('<li id="' + obj[z + i].Symbol + '"><p>' + obj[z + i].Name + '</p><p class="pointRed">' + obj[z + i].Trade.toFixed(2) + '</p><p class="pointRed"><span>+' + obj[z + i].Pricechange.toFixed(2) + '</span><span>+' + obj[z + i].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                    else {
                        $('#point' + pointId + ' #point-li' + n).append('<li id="' + obj[z + i].Symbol + '"><p>' + obj[z + i].Name + '</p><p class="point">' + obj[z + i].Trade.toFixed(2) + '</p><p class="point"><span>' + obj[z + i].Pricechange.toFixed(2) + '</span><span>' + obj[z + i].Changepercent.toFixed(2) + '%</span></p></li>');
                    }
                }
            }
        }
        else {
        }
        // var date = new Date();
        // date = Date.parse(date);
        // httpGet("Reader/EmotionIndexs?type=1&count=1&rate=0&datetime=" + date, "", true, ajax_success14, ajax_fail14);
        // function ajax_success14(obj) {
        //     if (obj != null && obj != "" && obj != undefined) {
        //         var DiffValue = obj[0].Difference;
        //         var IntsValue = obj[0].Intensity;
        //         $('#point' + pointId).after('<div class="emotion"><div id="EmotionDiff' + pointId + '" class="emotionEchart"></div><div id="EmotionInts' + pointId + '" class="emotionEchart"></div><div class="clear"></div></div>');
        //         if ($(window).width() < 600) {
        //             $(".emotionEchart").css("height", parseInt($(window).width() / 2) + "px");
        //         }
        //         var myChart = echarts.init(document.getElementById('EmotionDiff' + pointId + ''));
        //         var DiffName = "";
        //         switch (DiffValue) {
        //             case -1:
        //                 DiffValue = 1;
        //                 DiffName = "消极";
        //                 break;
        //             case 0:
        //                 DiffValue = 3;
        //                 DiffName = "中性";
        //                 break;
        //             default:
        //                 DiffValue = 5;
        //                 DiffName = "乐观";
        //         }
        //         option = {
        //             tooltip: {
        //                 formatter: "{a} <br/>当前指数 : " + DiffName,
        //             },
        //             toolbox: {
        //                 show: false,
        //                 feature: {
        //                     mark: { show: true },
        //                     restore: { show: true },
        //                     saveAsImage: { show: true }
        //                 }
        //             },
        //             series: [
        //                 {
        //                     name: '分歧指数',
        //                     type: 'gauge',
        //                     center: ['50%', '50%'],    // 默认全局居中
        //                     min: 0,                     // 最小值
        //                     max: 6,                   // 最大值
        //                     precision: 0,               // 小数精度，默认为0，无小数点
        //                     splitNumber: 6,
        //                     axisLine: {            // 坐标轴线
        //                         show: true,        // 默认显示，属性show控制显示与否
        //                         lineStyle: {       // 属性lineStyle控制线条样式
        //                             color: [[0.333, '#f6d338'], [0.666, '#459eff'], [1, '#77d238']],
        //                             width: 10
        //                         }
        //                     },
        //                     axisTick: {            // 坐标轴小标记
        //                         show: false,        // 属性show控制显示与否，默认不显示
        //                         splitNumber: 5,    // 每份split细分多少段
        //                         length: 8,         // 属性length控制线长
        //                         lineStyle: {       // 属性lineStyle控制线条样式
        //                             color: '#eee',
        //                             width: 1,
        //                             type: 'solid'
        //                         }
        //                     },
        //                     axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        //                         show: true,
        //                         formatter: function (v) {
        //                             switch (v + '') {
        //                                 case '1': return '消极';
        //                                 case '3': return '中性';
        //                                 case '5': return '乐观';
        //                                 default: return '';
        //                             }
        //                         },
        //                         textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //                             color: '#555'
        //                         },
        //                     },
        //                     splitLine: {           // 分隔线
        //                         show: false,        // 默认显示，属性show控制显示与否
        //                         length: 10,         // 属性length控制线长
        //                         lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        //                             color: '#eee',
        //                             width: 2,
        //                             type: 'solid'
        //                         }
        //                     },
        //                     pointer: {
        //                         length: '70%',
        //                         width: 4,
        //                         color: 'auto'
        //                     },
        //                     title: {
        //                         show: true,
        //                         offsetCenter: [0, '100%'],       // x, y，单位px
        //                         textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //                             color: '#666',
        //                             fontSize: 14
        //                         }
        //                     },
        //                     detail: {
        //                         show: true,
        //                         backgroundColor: 'rgba(0,0,0,0)',
        //                         borderWidth: 0,
        //                         borderColor: '#64879f',
        //                         width: 100,
        //                         height: 40,
        //                         offsetCenter: [0, '60%'],       // x, y，单位px
        //                         formatter: '当前指数',
        //                         textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //                             color: '#64879f',
        //                             fontSize: 12
        //                         }
        //                     },
        //                     data: [{ value: DiffValue, name: '分歧指数' }]
        //                 }
        //             ]
        //         };
        //         var myChart1 = echarts.init(document.getElementById('EmotionInts' + pointId + ''));
        //         option1 = {
        //             tooltip: {
        //                 formatter: "{a} <br/>当前指数 : " + IntsValue + "%",
        //             },
        //             toolbox: {
        //                 show: false,
        //                 feature: {
        //                     mark: { show: true },
        //                     restore: { show: true },
        //                     saveAsImage: { show: true }
        //                 }
        //             },
        //             series: [
        //                 {
        //                     name: '强弱指数',
        //                     type: 'gauge',
        //                     center: ['50%', '50%'],    // 默认全局居中
        //                     min: 0,                     // 最小值
        //                     max: 100,                   // 最大值
        //                     precision: 0,               // 小数精度，默认为0，无小数点
        //                     splitNumber: 10,
        //                     axisLine: {            // 坐标轴线
        //                         show: true,        // 默认显示，属性show控制显示与否
        //                         lineStyle: {       // 属性lineStyle控制线条样式
        //                             color: [[0.1, '#4AA3EB'], [0.2, '#4AC9D5'], [0.3, '#60DC78'], [0.4, '#75E057'], [0.5, '#B0E451'], [0.6, '#DCE149'], [0.7, '#F6D742'], [0.8, '#FBAB2E'], [0.9, '#F77231'], [1, '#F44646']],
        //                             width: 10
        //                         }
        //                     },
        //                     axisTick: {            // 坐标轴小标记
        //                         show: false,        // 属性show控制显示与否，默认不显示
        //                         splitNumber: 5,    // 每份split细分多少段
        //                         length: 8,         // 属性length控制线长
        //                         lineStyle: {       // 属性lineStyle控制线条样式
        //                             color: '#eee',
        //                             width: 1,
        //                             type: 'solid'
        //                         }
        //                     },
        //                     axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
        //                         show: true,
        //                         formatter: function (v) {
        //                             switch (v + '') {
        //                                 case '0': return '0';
        //                                 case '10': return '10';
        //                                 case '20': return '20';
        //                                 case '30': return '30';
        //                                 case '40': return '40';
        //                                 case '50': return '50';
        //                                 case '60': return '60';
        //                                 case '70': return '70';
        //                                 case '80': return '80';
        //                                 case '90': return '90';
        //                                 case '100': return '100';
        //                                 default: return '';
        //                             }
        //                         },
        //                         textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //                             color: '#64879f',
        //                             fontSize: 10
        //                         }
        //                     },
        //                     splitLine: {           // 分隔线
        //                         show: true,        // 默认显示，属性show控制显示与否
        //                         length: 15,         // 属性length控制线长
        //                         lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
        //                             color: '#eee',
        //                             width: 2,
        //                             type: 'solid'
        //                         }
        //                     },
        //                     pointer: {
        //                         length: '70%',
        //                         width: 4,
        //                         color: 'auto'
        //                     },
        //                     title: {
        //                         show: true,
        //                         offsetCenter: [0, '100%'],       // x, y，单位px
        //                         textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //                             color: '#666',
        //                             fontSize: 14
        //                         }
        //                     },
        //                     detail: {
        //                         show: true,
        //                         backgroundColor: 'rgba(0,0,0,0)',
        //                         borderWidth: 0,
        //                         borderColor: '#64879f',
        //                         width: 100,
        //                         height: 40,
        //                         offsetCenter: [0, '60%'],       // x, y，单位px
        //                         formatter: '{value}%',
        //                         textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        //                             color: '#333',
        //                             fontSize: 18
        //                         }
        //                     },
        //                     data: [{ value: IntsValue, name: '强弱指数' }]
        //                 }
        //             ]
        //         };
        //         myChart.setOption(option);
        //         myChart1.setOption(option1);
        //     }
        // }
        // function ajax_fail14() {
        // }
    }
    function ajax_fail11() {
    }
}
function touchTag() {
    $(".tag-label").each(function () {
        $(this).unbind();
        $(this).bind("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            // alert($(this).text());
            var SearchKey = encodeURI(encodeURI($(this).text()));
            if (TopIndex != 0) {
                if ($("#indexlist" + TopIndex + ">li:last-child").find(".type").val() == "morning") {
                    var lastliId = $("#indexlist" + TopIndex + ">li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
                }
                else {
                    var lastliId = $("#indexlist" + TopIndex + ">li:last-child").find('.hidden').val();
                }
            }
            else {
                if ($("#indexlist>li:last-child").find(".type").val() == "morning") {
                    var lastliId = $("#indexlist>li:last-child #morning_ul ul>li:last-child").find('.hidden').val();
                }
                else {
                    var lastliId = $("#indexlist>li:last-child").find('.hidden').val();
                }
            }
            if (TopIndex != 0) {
                db.transaction(function (tx) {
                    tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScrollMore[TopIndex].x, myScrollMore[TopIndex].y, lastliId], function (tx, res) {
                        AddGoback('indexNews.html?firstLoad=no', 'searchResult.html?SearchKey=' + SearchKey);
                        // slide('left', 'lightblue', 1, 'searchResult.html?SearchKey=' + SearchKey + '&FfromPage=index');
                    });
                }, function (e) {
                    // alert("itemListSe1ERROR: " + e.message);
                });
            }
            else {
                db.transaction(function (tx) {
                    tx.executeSql('replace into Record_Position_' + UserStatus + '(TopIndex, PositionX, PositionY, ItemID) VALUES (?,?,?,?)', [TopIndex, myScroll.x, myScroll.y, lastliId], function (tx, res) {
                        AddGoback('indexNews.html?firstLoad=no', 'searchResult.html?SearchKey=' + SearchKey);
                        // slide('left', 'lightblue', 1, 'searchResult.html?SearchKey=' + SearchKey + '&FfromPage=index');
                    });
                }, function (e) {
                    // alert("itemListSe1ERROR: " + e.message);
                });
            }

        })
    })
}
function add_leadSwiper() {
    myLeadSwiper = new Swiper('.swiper-container-lead', {
        autoplay: 2000,
        pagination: '.swiper-pagination',
        // paginationClickable: true,
        onReachEnd: function (swiper) {
            $("#lead .swiper-pagination,#lead .leadJupm").remove();
            $("#leadSlideEnd").html('开启' + AppModel + '全新体验');
            $("#leadSlideEnd").removeClass("Page");
            if ($("#leadSlideEnd").length > 0) {
                document.getElementById('leadSlideEnd').addEventListener("touchstart", touchleadJupm, false);
            }
        },
        onSlideChangeEnd: function (swiper) {
            if (myLeadSwiper.isEnd) {
                myLeadSwiper.stopAutoplay();
                myLeadSwiper.lockSwipes();
            }
        }
    })
}
//引导页的跳过
function touchleadJupm(event) {
    event.preventDefault();
    $("#lead").remove();
}
//app更新显示
function updateShow() {
    httpGet("Reader/AppControl?devicePlatform=" + device.platform + "&appVersion=" + AppModel, "", true, ajax_success21, ajax_fail21);
    function ajax_success21(obj) {
        localStorage.B_DisplayUserControl = obj.DisplayUserControl;//用来存储登录界面是否显示  (true 显示   false 不显示)
        if (obj.HasNewVersion) {
            $("#sure").removeClass("Page");
            document.getElementById('sure_ok').addEventListener("touchstart", touchupdateOk, false);//点击确定更新
            document.getElementById('cancel_ok').addEventListener("touchstart", touchupdateJupm, false);//点击取消更新
        }
    }
    function ajax_fail21(netStatus) {
        if (netStatus == "abort") {
            window.plugins.toast.show("无网络，请检查网络后重试", 500, "center");
        }
        else {
            if (netStatus == "timeout") {
                window.plugins.toast.show("网络超时，请检查网络后重试", 500, "center");
            }
            // else {
            //     if (netStatus == "error") {
            //         window.plugins.toast.show("获取失败，稍后重试", 500, "center");
            //     }
            // }
        }
    }
}
//app更新的前往
function touchupdateOk(event) {
    $("#sure").remove();
    if (device.platform == "iOS") {
        window.open('https://itunes.apple.com/us/app/bu-er-cai-jing/id1020559120?l=zh&ls=1&mt=8', '_system');
    }
    else {
        if (device.platform == "Android") {
            window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.taikor.news', '_system');
        }
    }
}
//app更新的跳过
function touchupdateJupm(event) {
    event.preventDefault();
    $("#sure").remove();
}
