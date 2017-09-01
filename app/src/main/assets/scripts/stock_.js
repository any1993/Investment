//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var stockId = GetQueryString("stockId");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var iNowString = 0, iNow = 0, iNow2 = 0, iFromString = 0, StockHistoryType = 0, Stockcount = 0, openDaysCount = 0, openDaysCount2 = 0, iFromString1 = 0, iFromString2 = 0, iNowString2 = 0;
var K_type = "A";
var A_TicktimeData = [], A_TradeData = [], A_AmountData = [], A_AmountDataColor = [], A_SettlementData = [];
var B_TicktimeData = [], B_TradeData = [], B_AmountData = [], B_AmountDataColor = [];
var C_TicktimeData = [], C_TradeData = [], C_AmountData = [], C_AmountDataColor = [];
var D_TicktimeData = [], D_TradeData = [], D_AmountData = [], D_AmountDataColor = [];
var E_TicktimeData = [], E_TradeData = [], E_AmountData = [], E_AmountDataColor = [];
var EPSProfitTimeline = [];
var ThisYearAvgEPS = [], NextYearAvgEPS = [], ThisYearAvgNetProfit = [], NextYearAvgNetProfit = [];
var ThisYearEPS = [], NextYearEPS = [], ThisYearNetProfit = [], NextYearNetProfit = [];
var ThisYearEPS1 = [], NextYearEPS1 = [], ThisYearNetProfit1 = [], NextYearNetProfit1 = [];
var ThisYearEPS2 = [], NextYearEPS2 = [], ThisYearNetProfit2 = [], NextYearNetProfit2 = [];
var forcesXAxis = [], forcesSeries0 = [], forcesSeries1 = [], forcesSeries2 = [], MainForceColor = [];
var lastValue = '';
var click_able = true;
var relate_Topic = false, stock_bodies = false;
var Bottom_type = "bottom_AA", from0 = 0, from1 = 0, from2 = 0, from3 = 0;
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
    //    };

        setTimeout(function () {
            document.getElementById('fore').addEventListener("touchstart", touchFore, false);
            Touch();
            //db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
            //    db.transaction(function (tx) {
            //        SelectUser(tx);
            //    }, function (err) {
            //        //alert('Open database my.db ERROR1: ' + err.message);
            //    });
            //});
        }, 200);
    //};

    bind_info();

})

function SelectUser(tx) {
    tx.executeSql("select * from User", [], function (tx, res) {
        if (res.rows.length == 0) {
            var type = "0", nickName = "";
            httpGet("Reader/Login?UserID=" + nullu + "&type=" + type + "&value=" + device.uuid + "&nickName=" + nickName + "&version=" + NowVerision, "", true, ajax_success, ajax_fail);
            function ajax_success(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    UserID = obj;
                    UserStatus = "unlogin";
                    bind_info();
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
            function ajax_fail() {
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
    //返回按钮
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    touchback();
    document.getElementById("K_title_hour").addEventListener("touchstart", function () {
        if (click_able) {
            if (!$(this).hasClass("K_title_box_clicked")) {
                click_able = false;
                K_type = "A";
                $(this).siblings().removeClass("K_title_box_clicked");
                $(this).addClass("K_title_box_clicked");
                //分时K线图
                iNowString = Date.parse(new Date());
                iNow = Date.parse(new Date()) / 1000;
                iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
                //分时的价格指数和成交金额
                StockHistoryType = 2;
                A_TicktimeData = [], A_TradeData = [], A_AmountData = [], A_AmountDataColor = [], A_SettlementData = [];
                openDaysCount = 2;
                // touch_K_echart();
                echarts_loading();
                OPendays_k();
            }
        }
    }, false);
    document.getElementById("K_title_five").addEventListener("touchstart", function () {
        if (click_able) {
            if (!$(this).hasClass("K_title_box_clicked")) {
                click_able = false;
                K_type = "B";
                $(this).siblings().removeClass("K_title_box_clicked");
                $(this).addClass("K_title_box_clicked");
                if (B_TicktimeData != "" && B_TradeData != "" && B_AmountData != "" && B_AmountDataColor != "") {
                    K_echart(B_TicktimeData, B_TradeData, B_AmountData, B_AmountDataColor);
                }
                else {
                    iNowString = Date.parse(new Date());
                    iNow = Date.parse(new Date()) / 1000;
                    iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
                    //五日的价格指数和成交金额
                    StockHistoryType = 2;
                    openDaysCount = 5;
                    echarts_loading();
                    OPendays_k();
                }
            }
        }
    }, false);
    document.getElementById("K_title_day").addEventListener("touchstart", function () {
        if (click_able) {
            if (!$(this).hasClass("K_title_box_clicked")) {
                click_able = false;
                K_type = "C";
                $(this).siblings().removeClass("K_title_box_clicked");
                $(this).addClass("K_title_box_clicked");
                if (C_TicktimeData != "" && C_TradeData != "" && C_AmountData != "" && C_AmountDataColor != "") {
                    K_echart(C_TicktimeData, C_TradeData, C_AmountData, C_AmountDataColor);
                }
                else {
                    iNowString = Date.parse(new Date());
                    openDaysCount = 90;
                    iFromString = iNowString - openDaysCount * 24 * 60 * 60 * 1000;//获取一个时间90天前的时间戳  13位
                    //日K(90天)
                    StockHistoryType = 0;
                    echarts_loading();
                    touch_K_echart();
                }
            }
        }
    }, false);
    document.getElementById("K_title_week").addEventListener("touchstart", function () {
        if (click_able) {
            if (!$(this).hasClass("K_title_box_clicked")) {
                click_able = false;
                K_type = "D";
                $(this).siblings().removeClass("K_title_box_clicked");
                $(this).addClass("K_title_box_clicked");
                if (D_TicktimeData != "" && D_TradeData != "" && D_AmountData != "" && D_AmountDataColor != "") {
                    K_echart(D_TicktimeData, D_TradeData, D_AmountData, D_AmountDataColor);
                }
                else {
                    iNowString = Date.parse(new Date());
                    openDaysCount = 365;
                    iFromString = iNowString - openDaysCount * 24 * 60 * 60 * 1000;
                    //周K(一年)
                    StockHistoryType = 1;
                    echarts_loading();
                    touch_K_echart();
                }
            }
        }
    }, false);
    document.getElementById("K_title_mouth").addEventListener("touchstart", function () {
        if (click_able) {
            if (!$(this).hasClass("K_title_box_clicked")) {
                click_able = false;
                K_type = "E";
                $(this).siblings().removeClass("K_title_box_clicked");
                $(this).addClass("K_title_box_clicked");
                if (E_TicktimeData != "" && E_TradeData != "" && E_AmountData != "" && E_AmountDataColor != "") {
                    K_echart(E_TicktimeData, E_TradeData, E_AmountData, E_AmountDataColor);
                }
                else {
                    iNowString = Date.parse(new Date());
                    openDaysCount = 1825;
                    iFromString = iNowString - openDaysCount * 24 * 60 * 60 * 1000;
                    //月K
                    StockHistoryType = 3;
                    echarts_loading();
                    touch_K_echart();
                }
            }
        }
    }, false);
    // document.getElementById("stock_bulish_title").addEventListener("touchstart", function () {
    //     if (!$(this).hasClass("K_title_box_clicked")) {
    //         $(this).addClass("K_title_box_clicked");
    //         $(this).siblings().removeClass("K_title_box_clicked");
    //         $("#stock_data_bulish").removeClass("Page");
    //         $("#stock_data_topic").addClass("Page");
    //     }
    // }, false);
    // document.getElementById("stock_topic_title").addEventListener("touchstart", function () {
    //     if (!$(this).hasClass("K_title_box_clicked")) {
    //         $(this).addClass("K_title_box_clicked");
    //         $(this).siblings().removeClass("K_title_box_clicked");
    //         $("#stock_data_topic").removeClass("Page");
    //         $("#stock_data_bulish").addClass("Page");
    //         if (!relate_Topic) {
    //             Relate_Topic();
    //         }
    //     }
    // }, false);
    document.getElementById("stock_heroes_title").addEventListener("touchstart", function () {
        if (!$(this).hasClass("K_title_box_clicked")) {
            $(this).addClass("K_title_box_clicked");
            $(this).siblings().removeClass("K_title_box_clicked");
            $("#stock_heroes").removeClass("Page");
            $("#stock_warehouse").addClass("Page");
        }
    }, false);
    document.getElementById("stock_warehouse_title").addEventListener("touchstart", function () {
        if (!$(this).hasClass("K_title_box_clicked")) {
            $(this).addClass("K_title_box_clicked");
            $(this).siblings().removeClass("K_title_box_clicked");
            $("#stock_warehouse").removeClass("Page");
            $("#stock_heroes").addClass("Page");
        }
    }, false);
    document.getElementById("stock_bodies_title").addEventListener("touchstart", function () {
        if (!$(this).hasClass("K_title_box_clicked")) {
            $(this).addClass("K_title_box_clicked");
            $(this).siblings().removeClass("K_title_box_clicked");
            $("#bodies_box").removeClass("Page");
            $("#profit_box").addClass("Page");
            if (!stock_bodies) {
                $('#bodies_box').append('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无机构评级</div>');
            }
        }
    }, false);
    document.getElementById("profit_box_title").addEventListener("touchstart", function () {
        if (!$(this).hasClass("K_title_box_clicked")) {
            $(this).addClass("K_title_box_clicked");
            $(this).siblings().removeClass("K_title_box_clicked");
            $("#profit_box").removeClass("Page");
            $("#bodies_box").addClass("Page");
            if (ThisYearEPS == "" && ThisYearEPS1 == "" && ThisYearEPS2 == "") {
                //获取盈利预测
                Profit_echart();
            }
        }
    }, false);
    document.getElementById("thisYear").addEventListener("touchstart", function () {
        if (!$(this).hasClass("profit_left_selected") && $("#eps").hasClass("profit_right_selected")) {
            $(this).addClass("profit_left_selected");
            $(this).siblings().removeClass("profit_left_selected");
            Profit_EPS_echart("当年EPS", ThisYearEPS, ThisYearEPS1, ThisYearEPS2, '当年平均EPS', ThisYearAvgEPS);
        }
        else {
            if (!$(this).hasClass("profit_left_selected") && $("#onlyProfit").hasClass("profit_right_selected")) {
                $(this).addClass("profit_left_selected");
                $(this).siblings().removeClass("profit_left_selected");
                Profit_EPS_echart("当年净利润", ThisYearNetProfit, ThisYearNetProfit1, ThisYearNetProfit2, '当年平均净利润', ThisYearAvgNetProfit);
            }
        }
    }, false);
    document.getElementById("nextYear").addEventListener("touchstart", function () {
        if (!$(this).hasClass("profit_left_selected") && $("#eps").hasClass("profit_right_selected")) {
            $(this).addClass("profit_left_selected");
            $(this).siblings().removeClass("profit_left_selected");
            Profit_EPS_echart("次年EPS", NextYearEPS, NextYearEPS1, NextYearEPS2, '次年平均EPS', NextYearAvgEPS);
        }
        else {
            if (!$(this).hasClass("profit_left_selected") && $("#onlyProfit").hasClass("profit_right_selected")) {
                $(this).addClass("profit_left_selected");
                $(this).siblings().removeClass("profit_left_selected");
                Profit_EPS_echart("次年净利润", NextYearNetProfit, NextYearNetProfit1, NextYearNetProfit2, '次年平均净利润', NextYearAvgNetProfit);
            }
        }
    }, false);
    document.getElementById("eps").addEventListener("touchstart", function () {
        $('#Profit_danwei').addClass('Page');
        $('#eps_danwei').removeClass('Page');
        if (!$(this).hasClass("profit_right_selected") && $("#thisYear").hasClass("profit_left_selected")) {
            $(this).addClass("profit_right_selected");
            $(this).siblings().removeClass("profit_right_selected");
            Profit_EPS_echart("当年EPS", ThisYearEPS, ThisYearEPS1, ThisYearEPS2, '当年平均EPS', ThisYearAvgEPS);
        }
        else {
            if (!$(this).hasClass("profit_right_selected") && $("#nextYear").hasClass("profit_left_selected")) {
                $(this).addClass("profit_right_selected");
                $(this).siblings().removeClass("profit_right_selected");
                Profit_EPS_echart("次年EPS", NextYearEPS, NextYearEPS1, NextYearEPS2, '次年平均EPS', NextYearAvgEPS);
            }
        }
    }, false);
    document.getElementById("onlyProfit").addEventListener("touchstart", function () {
        $('#Profit_danwei').removeClass('Page');
        $('#eps_danwei').addClass('Page');
        if (!$(this).hasClass("profit_right_selected") && $("#thisYear").hasClass("profit_left_selected")) {
            $(this).addClass("profit_right_selected");
            $(this).siblings().removeClass("profit_right_selected");
            Profit_EPS_echart("当年净利润", ThisYearNetProfit, ThisYearNetProfit1, ThisYearNetProfit2, '当年平均净利润', ThisYearAvgNetProfit);
        }
        else {
            if (!$(this).hasClass("profit_right_selected") && $("#nextYear").hasClass("profit_left_selected")) {
                $(this).addClass("profit_right_selected");
                $(this).siblings().removeClass("profit_right_selected");
                Profit_EPS_echart("次年净利润", NextYearNetProfit, NextYearNetProfit1, NextYearNetProfit2, '次年平均净利润', NextYearAvgNetProfit);
            }
        }
    }, false);
    $(".analyse_title div").each(function () {
        if ($(this).attr("id") != undefined) {
            document.getElementById($(this).attr("id")).addEventListener("touchstart", function () {
                $('#stock_loading').addClass('Page');
                $('#stock_loading img').removeClass('Page');
                $('#stock_loading span').html('加载中......');
                touchBottom();
                Bottom_type = $(this).attr("id");
                if (!$(this).hasClass("analyse_title_selected")) {
                    $(this).addClass("analyse_title_selected");
                    $(this).siblings().removeClass("analyse_title_selected");
                    $("#" + $(this).find(".hidden").val()).removeClass("Page");
                    $("#" + $(this).find(".hidden").val()).siblings().addClass("Page");
                }
            }, false);
        }
    })
    document.getElementById("stock_addChose").addEventListener("touchstart", function () {
        if (!$('#stock_addChose').hasClass('UnableAdd')) {
            //个股添加自选
            httpGet("Reader/AddUserStocks/" + stockId + "?userID=" + UserID + "&type=0", "", true, ajax_success5, ajax_fail5);
            function ajax_success5(obj) {
                if (obj !== null && obj !== "" && obj !== undefined) {
                    if (obj == 0 || obj == 1) {
                        db.transaction(function (tx) {
                            tx.executeSql('replace INTO Chose_stock_' + UserStatus + ' (Symbol) VALUES(?)', [stockId], function (tx, res) {
                                $('#stock_addChose').addClass('UnableAdd')
                                $('#stock_addChose').find('img').attr('src', 'images/stock_added.png');
                                window.plugins.toast.show("加入自选成功", 500, "center");
                            });
                        }, function (e) {
                            //alert("update_ID1ERROR: " + e.message);
                        });
                    }
                    else {
                        window.plugins.toast.show("加入自选失败！", 500, "center");
                    }
                }
                else {
                    window.plugins.toast.show("加入自选失败！", 500, "center");
                }
            }
            function ajax_fail5() {
                window.plugins.toast.show("加入自选失败！", 500, "center");
            }
        }
        //个股取消自选
        else {
            httpGet("Reader/DelUserStocks/" + stockId + "?userID=" + UserID + "&type=0", "", true, ajax_success10, ajax_fail10);
            function ajax_success10(obj) {
                if (obj !== null && obj !== "" && obj !== undefined) {
                    if (obj == 0 || obj == 1) {
                        db.transaction(function (tx) {
                            tx.executeSql('delete from Chose_stock_' + UserStatus + ' where Symbol=?', [stockId], function (tx, res) {
                                $('#stock_addChose').removeClass('UnableAdd')
                                $('#stock_addChose').find('img').attr('src', 'images/stock_add.png');
                                window.plugins.toast.show("取消自选成功", 500, "center");
                            });
                        }, function (e) {
                            alert("update_ID1ERROR: " + e.message);
                        });
                    }
                    else {
                        window.plugins.toast.show("取消自选失败！", 500, "center");
                    }
                }
                else {
                    window.plugins.toast.show("取消自选失败！", 500, "center");
                }
            }
            function ajax_fail10() {
                window.plugins.toast.show("取消自选失败！", 500, "center");
            }
        }
    }, false);

    //下拉显示股票更多信息
    document.getElementById("stock_more").addEventListener("touchstart", function () {
        // $('#stock_more').bind('click', function () {
        if ($(this).find('img').attr('src') == 'images/moreDown.png') {
            $(this).find('img').attr('src', 'images/moreUp.png')
            $('#stock_moreBox').removeClass('Page');
            $("#app-info").after('<div id="cover" style="position: fixed; z-index: 2; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2;width:100%;height:100%"><div>');
            document.getElementById("cover").addEventListener("touchstart", function () {
                $('#stock_more').find('img').attr('src', 'images/moreDown.png')
                $('#stock_moreBox').addClass('Page');
                $('#cover').remove();
            })
        }
        else {
            if ($(this).find('img').attr('src') == 'images/moreUp.png') {
                $(this).find('img').attr('src', 'images/moreDown.png')
                $('#stock_moreBox').addClass('Page');
                $('#cover').remove();
            }
        }
    })
}
function echarts_loading() {
    myChart1.clear();
    myChart2.clear();
    myChart1.showLoading({
        text: '',    //loading话术
    });
    // myChart2.showLoading({
    //     text: '正在努力的读取数据中...',    //loading话术
    //     effect: 'bar',
    // });
}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//从前端数据库或者服务器去取数据
function bind_info() {
    //个股信息api
    //db.transaction(function (tx) {
    //    // tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_unlogin (Symbol text,UNIQUE(Symbol))');//记录未登录的自选股
    //    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_' + UserStatus + ' (Symbol text,UNIQUE(Symbol))');//记录登录的自选股
    //    tx.executeSql('select * from Chose_stock_' + UserStatus + ' where Symbol=?', [stockId], function (tx, res) {
    //        if (res != null && res.rows != null) {
    //            if (res.rows.length > 0) {
    //                $('#stock_addChose').addClass('UnableAdd')
    //                $('#stock_addChose').find('img').attr('src', 'images/stock_added.png');
    //            }
    //        }
    //    });
    //}, function (e) {
    //    alert("update_co1ERROR: " + e.message);
    //});
    httpGet("Reader/Stocks?stockIds=" + stockId, "", true, ajax_success1, ajax_fail1);
    function ajax_success1(obj) {
        if (obj != null && obj != "" && obj != undefined && obj.length > 0) {
            $('#stock_name').html(obj[0].Name);
            $('#stock_code').html(obj[0].Code);
            $('#stock_Trade').html(obj[0].Trade);
            if (obj[0].Pricechange > 0) {
                //根据股票涨跌设置头部颜色
                // StatusBar.backgroundColorByHexString("#F74C59");
                // $('#stock_top,#stock_title').css('background-color', '#F74C59');
                $('#stock_Trade').css('color', '#F74C59');
                $("#stock_priceChange").css('color', '#F74C59').html("+" + obj[0].Pricechange.toFixed(2));
                $("#stock_priceChangePre").css('color', '#F74C59').html("+" + obj[0].Changepercent.toFixed(2) + '%');
            }
            else {
                //根据股票涨跌设置头部颜色
                if (obj[0].Pricechange < 0) {
                    // StatusBar.backgroundColorByHexString("#18AF55");
                    // $('#stock_top,#stock_title').css('background-color', '#18AF55');

                    $('#stock_Trade').css('color', '#18AF55');
                    $("#stock_priceChange").css('color', '#18AF55').html(obj[0].Pricechange);
                    $("#stock_priceChangePre").css('color', '#18AF55').html(obj[0].Changepercent.toFixed(2) + '%');
                }
                else {
                    $("#stock_priceChange").html(obj[0].Pricechange);
                    $("#stock_priceChangePre").html(obj[0].Changepercent.toFixed(2) + '%');
                }
            }
            // $("#stock_time").html(GetTimeRegular(obj[0].Ticktime));
            $("#stock_Open,#stock_Open1").html(obj[0].Open);
            if (obj[0].Trade < obj[0].Open) {
                $("#stock_Open").addClass('stock_point_red');
            }
            else {
                if (obj[0].Trade > obj[0].Open) {
                    $("#stock_Open").addClass('stock_point_green');
                }
            }
            $("#stock_Settlement,#stock_Settlement1").html(obj[0].Settlement);
            if (obj[0].Trade < obj[0].Settlement) {
                $("#stock_Settlement").addClass('stock_point_red');
            }
            else {
                if (obj[0].Trade > obj[0].Settlement) {
                    $("#stock_Settlement").addClass('stock_point_green');
                }
            }
            $("#stock_High").html(obj[0].High);
            $("#stock_Low").html(obj[0].Low);
            if (obj[0].Volume < 10000) {
                $("#stock_Volume").html(obj[0].Volume.toFixed(2) + '手');
            }
            else if (obj[0].Volume >= 10000 && obj[0].Volume < 100000000) {
                $("#stock_Volume").html((obj[0].Volume / 10000).toFixed(2) + '万手');
            }
            else if (obj[0].Volume >= 100000000) {
                $("#stock_Volume").html((obj[0].Volume / 100000000).toFixed(2) + '亿手');
            }

            if (obj[0].Amount < 10000) {
                $("#stock_Amount,#stock_Amount1").html(obj[0].Amount.toFixed(2) + '万');
            }
            else if (obj[0].Amount >= 10000) {
                $("#stock_Amount,#stock_Amount1").html((obj[0].Amount / 10000).toFixed(2) + '亿');
            }
            $("#stock_VolumeRatio").html(obj[0].VolumeRatio.toFixed(2));
            $("#stock_TransferRate,#stock_TransferRate1").html(obj[0].TransferRate.toFixed(2) + '%');
            $(".info-page").removeClass("Page");
            $("#loading").remove();
        }
    }
    function ajax_fail1(obj) {
        $("#loading").remove();
        $("#app-info").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $('#refesh').remove();
            $("#app-info").append('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
            setTimeout(function () {
                $("#analysis-theme ul").empty();
                $("#info-relate ul").empty();
                $("#refesh").remove();
                bind_info();
            }, 1000);
        })
    }
    //分时K线图
    iNowString = Date.parse(new Date());
    var date = new Date();
    // alert(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " 14:30:30");
    iNowString2 = getDateTimeStamp(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " 15:00:00");
    iNow2 = iNowString2 / 1000;
    iNow = Date.parse(new Date()) / 1000;
    // iNow = Date.parse(new Date('2016-11-13 09:40')) / 1000;//测试数据
    iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
    //分时的价格指数和成交金额
    StockHistoryType = 2;
    openDaysCount = 2;
    // touch_K_echart();
    OPendays_k();
    openDaysCount2 = 7;
    OPendays_forces();
    main_heroes();
    main_warehouse();
    stock_bodies = true;
    $('#bodies_box').append('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无机构评级</div>');
    Profit_echart();//盈利预测
    Relate_Topic();//相关主题
    bottom_A();
    bottom_B();
    bottom_C();
    bottom_D();
    bottom_E();
    bottom_F();
    touchBottom();
}
//获取K线图交易日和K线图
function OPendays_k() {
    httpGet("Reader/GetStockOpendays?endTime=" + iNow + "&sortType=1&count=" + openDaysCount, "", true, ajax_success, ajax_fail);
    function ajax_success(obj) {
        if (K_type == 'A') {
            if (obj != null && obj != "" && obj != undefined) {
                var date = new Date();
                // var date = new Date('2016-11-13 09:40');//测试数据
                var hour = date.getHours();
                var Minutes = date.getMinutes();
                if (date.getMonth() < 9) {
                    var dayDate = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + date.getDate();
                }
                else {
                    var dayDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                }
                //当前时间是交易日
                if (obj[0].substring(0, obj[0].indexOf("T")) == dayDate) {
                    if (hour < 9 || (hour == 9 && Minutes <= 15)) {
                        var datt = obj[1].substring(0, obj[1].indexOf("T")) + " 00:00:00";
                        var dat = obj[1].substring(0, obj[1].indexOf("T")) + " 23:59:59";
                        iNowString = getDateTimeStamp(dat);
                        iFromString = getDateTimeStamp(datt);
                        touch_K_echart();
                    }
                    else {
                        var datt = obj[0].substring(0, obj[0].indexOf("T")) + " 00:00:00";
                        var dat = obj[0].substring(0, obj[0].indexOf("T")) + " 23:59:59";
                        iNowString = getDateTimeStamp(dat);
                        iFromString = getDateTimeStamp(datt);
                        touch_K_echart();

                    }
                }
                //当前时间不是交易日
                else {
                    // alert("不在交易时间");
                    var datt = obj[0].substring(0, obj[0].indexOf("T")) + " 00:00:00";
                    var dat = obj[0].substring(0, obj[0].indexOf("T")) + " 23:59:59";
                    // alert(datt+' && '+dat);
                    iNowString = getDateTimeStamp(dat);
                    iFromString = getDateTimeStamp(datt);
                    touch_K_echart();
                }
            }
        }
        else {
            if (obj != null && obj != "" && obj != undefined) {
                var datt = obj[obj.length - 1].substring(0, obj[obj.length - 1].indexOf("T")) + " 00:00:00";
                iFromString = getDateTimeStamp(datt);
                touch_K_echart();
            }
        }
    }
    function ajax_fail() {
        click_able = true;
    }
}
function touch_K_echart() {
    httpGet("Reader/StockPrice?type=" + StockHistoryType + "&stockIds=" + stockId + "&fromTime=" + iFromString + "&endTime=" + iNowString + "&count=" + Stockcount, "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj[stockId].length; i++) {
                if (K_type == "A") {
                    A_TradeData.push(obj[stockId][i][1]);//价格
                    A_AmountData.push(obj[stockId][i][6]);//成交量
                    A_SettlementData.push(obj[stockId][i][7]);//昨收
                    if (i == 0) {
                        if (obj[stockId][i][8] > 0) {
                            A_AmountDataColor.push('#F74C59');
                        }
                        else {
                            if (obj[stockId][i][8] < 0) {
                                A_AmountDataColor.push('#1DBF60');
                            }
                            else {
                                A_AmountDataColor.push('#999999');
                            }
                        }
                    }
                    else {
                        if (obj[stockId][i][1] > obj[stockId][i - 1][1]) {
                            A_AmountDataColor.push('#F74C59');
                        }
                        else {
                            if (obj[stockId][i][1] < obj[stockId][i - 1][1]) {
                                A_AmountDataColor.push('#1DBF60');
                            }
                            else {
                                A_AmountDataColor.push('#999999');
                            }
                        }
                    }
                }
                else {
                    if (K_type == "B") {
                        B_TicktimeData.push(obj[stockId][i][0].substring(5, 16));
                        B_TradeData.push(obj[stockId][i][1]);
                        B_AmountData.push(obj[stockId][i][6]);
                        if (i == 0) {
                            if (obj[stockId][i][8] > 0) {
                                B_AmountDataColor.push('#F74C59');
                            }
                            else {
                                if (obj[stockId][i][9] < 0) {
                                    B_AmountDataColor.push('#1DBF60');
                                }
                                else {
                                    B_AmountDataColor.push('#999999');
                                }
                            }
                        }
                        else {
                            if (obj[stockId][i][1] > obj[stockId][i - 1][1]) {
                                B_AmountDataColor.push('#F74C59');
                            }
                            else {
                                if (obj[stockId][i][1] < obj[stockId][i - 1][1]) {
                                    B_AmountDataColor.push('#1DBF60');
                                }
                                else {
                                    B_AmountDataColor.push('#999999');
                                }
                            }
                        }
                    }
                    else {
                        if (K_type == "C") {
                            C_TicktimeData.push(obj[stockId][i][0].substring(5, 10));
                            if (i == obj[stockId].length - 1 && time_range('00:00', '15:00')) {
                                C_TradeData.push([obj[stockId][i][2], obj[stockId][i][1], obj[stockId][i][5], obj[stockId][i][3]]);
                            }
                            else {
                                C_TradeData.push([obj[stockId][i][2], obj[stockId][i][4], obj[stockId][i][5], obj[stockId][i][3]]);
                            }
                            C_AmountData.push(obj[stockId][i][6]);

                            if (obj[stockId][i][4] > obj[stockId][i][2]) {
                                C_AmountDataColor.push('#F74C59');
                            }
                            else {
                                if (obj[stockId][i][4] < obj[stockId][i][2]) {
                                    C_AmountDataColor.push('#1DBF60');
                                }
                                else {
                                    C_AmountDataColor.push('#999999');
                                }
                            }
                        }
                        else {
                            if (K_type == "D") {
                                D_TicktimeData.push(obj[stockId][i][0].substring(5, 10));
                                if (i == obj[stockId].length - 1 && time_range('00:00', '15:00')) {
                                    D_TradeData.push([obj[stockId][i][2], obj[stockId][i][1], obj[stockId][i][5], obj[stockId][i][3]]);
                                }
                                else {
                                    D_TradeData.push([obj[stockId][i][2], obj[stockId][i][4], obj[stockId][i][5], obj[stockId][i][3]]);
                                }
                                D_AmountData.push(obj[stockId][i][6]);

                                if (obj[stockId][i][4] > obj[stockId][i][2]) {
                                    D_AmountDataColor.push('#F74C59');
                                }
                                else {
                                    if (obj[stockId][i][4] < obj[stockId][i][2]) {
                                        D_AmountDataColor.push('#1DBF60');
                                    }
                                    else {
                                        D_AmountDataColor.push('#999999');
                                    }
                                }
                            }
                            else {
                                if (K_type == "E") {
                                    E_TicktimeData.push(obj[stockId][i][0].substring(0, 10));
                                    if (i == obj[stockId].length - 1 && time_range('00:00', '15:00')) {
                                        E_TradeData.push([obj[stockId][i][2], obj[stockId][i][1], obj[stockId][i][5], obj[stockId][i][3]]);
                                    }
                                    else {
                                        E_TradeData.push([obj[stockId][i][2], obj[stockId][i][4], obj[stockId][i][5], obj[stockId][i][3]]);
                                    }
                                    E_AmountData.push(obj[stockId][i][6]);

                                    if (obj[stockId][i][4] > obj[stockId][i][2]) {
                                        E_AmountDataColor.push('#F74C59');
                                    }
                                    else {
                                        if (obj[stockId][i][4] < obj[stockId][i][2]) {
                                            E_AmountDataColor.push('#1DBF60');
                                        }
                                        else {
                                            E_AmountDataColor.push('#999999');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (K_type == "A") {
                A_TicktimeData = range_timeArr('9:15', '9:25', 60000)
                A_TicktimeData = A_TicktimeData.concat(range_timeArr('9:30', '11:30', 60000));
                A_TicktimeData = A_TicktimeData.concat(range_timeArr('13:00', '15:00', 60000));
                K_echart(A_TicktimeData, A_TradeData, A_AmountData, A_AmountDataColor);
            }
            else {
                if (K_type == "B") {
                    K_echart(B_TicktimeData, B_TradeData, B_AmountData, B_AmountDataColor);
                }
                else {
                    if (K_type == "C") {
                        K_echart(C_TicktimeData, C_TradeData, C_AmountData, C_AmountDataColor);
                    }
                    else {
                        if (K_type == "D") {
                            K_echart(D_TicktimeData, D_TradeData, D_AmountData, D_AmountDataColor);
                        }
                        else {
                            if (K_type == "E") {
                                K_echart(E_TicktimeData, E_TradeData, E_AmountData, E_AmountDataColor);
                            }
                        }
                    }
                }
            }
        }
        else {
            K_echart('', '', '', '');
        }
    }
    function ajax_fail2() {
        click_able = true;
    }
}

function K_echart(TicktimeData, TradeData, AmountData, AmountDataColor) {
    if (K_type == "B") {
        option1 = {
            tooltip: {
                confine: true,
                trigger: 'axis',
                showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                formatter: function (params) {
                    if (K_type == "B") {
                        var res = params[0].name.substring(6, 11);
                        for (var i = 0, l = params.length; i < l; i++) {
                            res += '<br>' + params[i].seriesName + ' : ' + params[i].value;
                        }
                        return res;
                    }
                    else {
                        var res = params[0].name;
                        for (var i = 0, l = params.length; i < l; i++) {
                            res += '<br>' + params[i].seriesName + ' : ' + params[i].value;
                        }
                        return res;
                    }
                },
            },
            legend: {
                show: false,
                data: ['价格指数', '成交量']
            },
            grid: {
                x: 40,
                y: 20,
                x2: 20,
                y2: 40,
            },
            xAxis: [
                {
                    type: 'category',
                    position: 'bottom',
                    boundaryGap: false,
                    axisLabel: {
                        show: true,
                        interval: function (index, data) {
                            if (K_type == "B") {
                                if (data.substring('0', '5') == lastValue) {
                                    return false;
                                }
                                else {
                                    lastValue = data.substring('0', '5');
                                    return true;
                                }
                            }
                            else {
                                return true;
                            }
                        },
                        formatter: function (value) {
                            if (K_type == "B") {
                                return value.substring('0', '5');
                            }
                            else {
                                return value;
                            }
                        }
                    },
                    axisTick: { alignWithLabel: false },
                    splitNumber: 6,
                    splitLine:
                    {
                        show: true,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data: TicktimeData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisTick: { show: false, onGap: false },
                    splitNumber: 2,
                    // interval: 2,
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    boundaryGap: [0.05, 0.05],
                    axisLabel: {
                        //margin: -40,
                    },
                    splitArea: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                },
            ],
            series: [
                {
                    name: '价格指数',
                    type: 'line',
                    itemStyle: { normal: { areaStyle: { type: 'default', color: '#DEE9FE' }, lineStyle: { color: '#378eff', width: 1 } } },
                    symbol: 'none',
                    data: [],
                }
            ]
        };
    }
    else {
        if (K_type == "A") {
            option1 = {
                tooltip: {
                    confine: true,
                    trigger: 'axis',
                    showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                },
                legend: {
                    show: false,
                    data: ['价格指数', '成交量']
                },
                grid: {
                    x: 40,
                    y: 20,
                    x2: 20,
                    y2: 40,
                },
                xAxis: [
                    {
                        type: 'category',
                        position: 'bottom',
                        boundaryGap: false,
                        axisLabel: {
                            show: true,
                            // interval: function (index, data) {
                            //     // alert(index + ' && ' + data);
                            //     var hour = data.substring(0, data.indexOf(':'));
                            //     var Minutes = data.substring(data.indexOf(':') + 1, data.length);
                            //     if ((index % 15 === 0 && hour <= 9 && Minutes < 25) || ((index - 11) % 30 === 0 && ((hour < 12 && hour > 9) || (hour <= 9 && Minutes > 25))) || ((index - 132) != 0 && (index - 132) % 30 === 0 && hour > 12)) {
                            //         return true;
                            //     }
                            //     else {
                            //         return false;
                            //     }

                            // },
                        },
                        axisTick: { alignWithLabel: true },
                        splitLine:
                        {
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: ['#333'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        data: TicktimeData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        axisTick: { show: false, onGap: false },
                        // interval: 2,
                        splitNumber: 1,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#e5e5e5'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        boundaryGap: [0, 0],
                        // axisLabel: {
                        //     show: true,
                        //     interval: function (index, data) {
                        //         alert(index + ' && ' + data);

                        //     },
                        // },
                        splitArea: { show: false },
                        axisLine: {
                            lineStyle: {
                                color: ['#333'],
                                width: 1,
                                type: 'solid'
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: '价格指数',
                        type: 'line',
                        itemStyle: { normal: { areaStyle: { type: 'default', color: '#DEE9FE' }, lineStyle: { color: '#378eff', width: 1 } } },
                        symbol: 'none',
                        data: [],
                    },
                    {
                        name: '昨收',
                        type: 'line',
                        itemStyle: { normal: { lineStyle: { color: '#fb96ff', type: 'dotted' } } },
                        symbol: 'none',
                        z: 3,
                        data: [],
                    }
                ]
            };
        }
        else {
            option1 = {
                title: {
                    show: false,
                    text: '指数图'
                },
                tooltip: {
                    confine: true,
                    trigger: 'axis',
                    showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        var res = params[0].name;
                        res += '<br/>' + params[0].seriesName;
                        res += '<br/>  开盘 : ' + params[0].value[0] + '  最高 : ' + params[0].value[3];
                        res += '<br/>  收盘 : ' + params[0].value[1] + '  最低 : ' + params[0].value[2];
                        return res;
                    }
                },
                legend: {
                    show: false,
                    data: ['价格指数', '成交量']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataZoom: { show: true },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                grid: {
                    x: 40,
                    y: 20,
                    x2: 20,
                    y2: 40,
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        axisTick: { alignWithLabel: true },
                        splitLine:
                        {
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: ['#333'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        data: TicktimeData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        axisTick: { alignWithLabel: true },
                        boundaryGap: [0, 0],
                        splitNumber: 4,
                        splitArea: { show: false },
                        splitLine:
                        {
                            lineStyle: {
                                color: ['#e5e5e5'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: ['#333'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                    }
                ],
                series: [
                    {
                        name: '价格指数',
                        type: 'k',
                        itemStyle: {
                            normal: {
                                color: '#F74C59',           // 阳线填充颜色
                                color0: '#1DBF60',   // 阴线填充颜色
                                borderColor: null,
                                borderColor0: null
                            },
                        },
                        data: []
                    },
                ]
            };

        }
    }
    if (TradeData == '') {
        $('#K_echart1').addClass('Page');
        $('#K_echart1_null').removeClass('Page');
    }
    else {
        $('#K_echart1').removeClass('Page');
        $('#K_echart1_null').addClass('Page');
    }
    myChart1 = echarts.init(document.getElementById('K_echart1'));
    option1.series[0].data = TradeData;
    if (K_type == "A") {
        option1.series[1].data = A_SettlementData;

        if (panduan(TradeData) && panduan(A_SettlementData[0])) {
            minTradeData = Math.min.apply(null, TradeData);
            maxTradeData = Math.max.apply(null, TradeData);
            // alert('minTradeData=' + minTradeData + ' && maxTradeData=' + maxTradeData);
            minCha = Math.abs((A_SettlementData[0] - minTradeData).toFixed(2));
            maxCha = Math.abs((A_SettlementData[0] - maxTradeData).toFixed(2));
            // alert('minCha=' + minCha + ' && maxCha=' + maxCha);
            if (minCha > maxCha) {
                min = (A_SettlementData[0] - minCha).toFixed(2);
                max = (A_SettlementData[0] + minCha).toFixed(2);
            }
            else {
                min = (A_SettlementData[0] - maxCha).toFixed(2);
                max = (A_SettlementData[0] + maxCha).toFixed(2);
            }
            // alert('min=' + min + ' && max=' + max);
        }
        else {
            min = "null";
            max = "null";
        }
        option1.yAxis[0].min = min;
        option1.yAxis[0].max = max;
    }
    else {
        if (K_type == "B") {
            if (panduan(TradeData)) {
                minTradeData = Math.min.apply(null, TradeData);
                maxTradeData = Math.max.apply(null, TradeData);
                Cha = (maxTradeData - minTradeData).toFixed(2);
                if (minTradeData - Cha > 0) {
                    min = (minTradeData - Cha).toFixed(2);
                }
                // alert('min=' + min + ' && max=' + max);
            }
            else {
                min = "null";
                max = "null";
            }
            option1.yAxis[0].min = min;
            option1.yAxis[0].max = maxTradeData;
        }
    }
    myChart1.setOption(option1);

    if (K_type == "B") {
        option2 = {
            tooltip: {
                confine: true,
                trigger: 'axis',
                showDelay: 0,
                // position: function ([x, y]) { return [x, 20] },
                formatter: function (params) {
                    if (K_type == "B") {
                        var res = params[0].name.substring(6, 11);
                        for (var i = 0, l = params.length; i < l; i++) {
                            res += '<br>' + params[i].seriesName + ' : ' + params[i].value;
                        }
                        return res;
                    }
                    else {
                        var res = params[0].name;
                        for (var i = 0, l = params.length; i < l; i++) {
                            res += '<br>' + params[i].seriesName + ' : ' + params[i].value;
                        }
                        return res;
                    }
                }
            },
            legend: {
                show: false,
                data: ['价格指数', '成交量']
            },
            // dataZoom: {
            //     y: 200,
            //     show: true,
            //     realtime: true,
            //     start: 50,
            //     end: 100
            // },
            grid: {
                x: 40,
                y: 30,
                x2: 20,
                y2: 10,
            },
            xAxis: [
                {
                    show: true,
                    type: 'category',
                    position: 'bottom',
                    splitNumber: 6,
                    boundaryGap: true,
                    axisLabel: {
                        show: false,
                        formatter: function (value) {
                            if (K_type == "B") {
                                return value.substring('0', '5');
                            }
                            else {
                                return value;
                            }
                        }
                    },
                    axisTick: { show: false, onGap: false },
                    splitLine:
                    {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data: TicktimeData
                }
            ],
            yAxis: [
                {
                    name: '成交量(手)',
                    nameTextStyle: { color: ['#666'] },
                    show: true,
                    type: 'value',
                    scale: true,
                    axisTick: { show: false, onGap: false },
                    splitNumber: 2,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    // boundaryGap: [0.05, 0.05],
                    axisLabel: {
                        show: false,
                        formatter: function (v) {
                            if (v > 10000) {
                                return Math.round(v / 10000) + ' 万';
                            }
                            else {
                                return v;
                            }
                        },
                        //margin: -40,
                    },
                    splitArea: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                }
            ],
            series: [
                {
                    name: '成交量',
                    type: 'bar',
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = AmountDataColor;
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    data: [],
                }
            ]
        };
    }
    else {
        option2 = {
            tooltip: {
                confine: true,
                trigger: 'axis',
                showDelay: 0,
                // position: function ([x, y]) { return [x, 20] }
            },
            legend: {
                show: false,
                data: ['价格指数', '成交量']
            },
            // dataZoom: {
            //     y: 200,
            //     show: true,
            //     realtime: true,
            //     start: 50,
            //     end: 100
            // },
            grid: {
                x: 40,
                y: 30,
                x2: 20,
                y2: 10,
            },
            xAxis: [
                {
                    show: true,
                    type: 'category',
                    position: 'bottom',
                    splitNumber: 2,
                    boundaryGap: true,
                    axisLabel: {
                        show: false,
                    },
                    axisTick: { show: false, onGap: false },
                    splitLine:
                    {
                        show: false,
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data: TicktimeData
                }
            ],
            yAxis: [
                {
                    name: '成交量(手)',
                    nameTextStyle: { color: ['#666'] },
                    show: true,
                    type: 'value',
                    scale: true,
                    axisTick: { show: false, onGap: false },
                    splitNumber: 2,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    // boundaryGap: [0.05, 0.05],
                    axisLabel: {
                        show: false,
                        // formatter: function (v) {
                        //     return Math.round(v / 10000) + ' 万'
                        // },
                        margin: -40,
                    },
                    splitArea: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: ['#333'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                }
            ],
            series: [
                {
                    name: '成交量',
                    type: 'bar',
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = AmountDataColor;
                                return colorList[params.dataIndex];
                            }
                        }
                    },
                    data: [],
                }
            ]
        };
    }

    if (AmountData == '') {
        $('#K_echart2').addClass('Page');
        $('#K_echart2_null').removeClass('Page');
    }
    else {
        $('#K_echart2').removeClass('Page');
        $('#K_echart2_null').addClass('Page');
    }
    myChart2 = echarts.init(document.getElementById('K_echart2'));
    option2.series[0].data = AmountData;
    myChart2.setOption(option2);

    // 或者可以直接传入需要联动的实例数组
    echarts.connect([myChart1, myChart2]);

    setTimeout(function () {
        window.onresize = function () {
            myChart1.resize();
            myChart2.resize();
        }
    }, 200);
    click_able = true;
}

//获取相关主题
function Relate_Topic() {
    httpGet("Reader/StockBlock?stockID=" + stockId, "", true, ajax_success11, ajax_fail11);
    function ajax_success11(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                if (obj.length >= 1) {
                    if (panduan(obj[0].Block)) {
                        $('#Topic_A .stock_topic_table').removeClass("Page");
                        $('#Topic_A .stock_topic_table').find('td').eq(0).attr('id', obj[0].Block.ID);
                        stock_Topic(obj, 0, 'A');
                        bind_indexlist4(obj[0].Block.ID);
                    }
                }
                if (obj.length >= 2) {
                    if (panduan(obj[1].Block)) {
                        $('#Topic_B .stock_topic_table').removeClass("Page");
                        $('#Topic_B .stock_topic_table').find('td').eq(0).attr('id', obj[1].Block.ID);
                        stock_Topic(obj, 1, 'B');
                        bind_indexlist4(obj[1].Block.ID);
                    }
                }
                if (obj.length >= 3) {
                    if (panduan(obj[2].Block)) {
                        $('#Topic_C .stock_topic_table').removeClass("Page");
                        $('#Topic_C .stock_topic_table').find('td').eq(0).attr('id', obj[2].Block.ID);
                        stock_Topic(obj, 2, 'C');
                        bind_indexlist4(obj[2].Block.ID);
                    }
                }
                if (obj.length >= 4) {
                    if (panduan(obj[3].Block)) {
                        $('#Topic_D .stock_topic_table').removeClass("Page");
                        $('#Topic_D .stock_topic_table').find('td').eq(0).attr('id', obj[3].Block.ID);
                        stock_Topic(obj, 3, 'D');
                        bind_indexlist4(obj[3].Block.ID);
                    }
                }
            }
            else {
                $('#stock_data_topic').append('<div style="width:100%;text-align:center;font-size:16px;color:#999">该股无相关主题</div>');
            }
        }
        else {
            $('#stock_data_topic').append('<div style="width:100%;text-align:center;font-size:16px;color:#999">该股无相关主题</div>');
        }
    }
    function ajax_fail11(obj) {
        //获取股票失败
    }
}
function stock_Topic(obj, i, select) {
    if (obj[i].Block.ChangePercent > 0) {
        $('#Topic_' + select).addClass('topic_border_red');
        $('#Topic_name_' + select).html(obj[i].Block.Name);
        $('#Topic_ChangePercent_' + select).addClass('stock_point_red').html(obj[i].Block.ChangePercent.toFixed(2) + '%');
        $('#relate_du_' + select).addClass('relate_du_red');
        $('#Topic_Relativity_' + select).html((obj[i].Relativity * 100).toFixed(0) + '%');
    }
    else {
        $('#Topic_' + select).addClass('topic_border_green');
        $('#Topic_name_' + select).html(obj[i].Block.Name);
        $('#Topic_ChangePercent_' + select).addClass('stock_point_green').html(obj[i].Block.ChangePercent.toFixed(2) + '%');
        $('#relate_du_' + select).addClass('relate_du_green');
        $('#Topic_Relativity_' + select).html((obj[i].Relativity * 100).toFixed(0) + '%');
    }
    // if (obj.Topics[i].Block.ChangePercent > 0) {
    //     $('#Topic_' + select).addClass('topic_border_red');
    //     $('#Topic_name_' + select).html(obj.Topics[i].Block.Name);
    //     $('#Topic_ChangePercent_' + select).addClass('stock_point_red').html(obj.Topics[i].Block.ChangePercent.toFixed(2) + '%');
    //     $('#relate_du_' + select).addClass('relate_du_red');
    //     $('#Topic_Relativity_' + select).html((obj.Topics[i].Relativity * 100).toFixed(0) + '%');
    // }
    // else {
    //     $('#Topic_' + select).addClass('topic_border_green');
    //     $('#Topic_name_' + select).html(obj.Topics[i].Block.Name);
    //     $('#Topic_ChangePercent_' + select).addClass('stock_point_green').html(obj.Topics[i].Block.ChangePercent.toFixed(2) + '%');
    //     $('#relate_du_' + select).addClass('relate_du_green');
    //     $('#Topic_Relativity_' + select).html((obj.Topics[i].Relativity * 100).toFixed(0) + '%');
    // }
}
//获取主力净流入交易日和主力净流入
function OPendays_forces() {
    httpGet("Reader/GetStockOpendays?endTime=" + iNow2 + "&sortType=1&count=" + openDaysCount2, "", true, ajax_success, ajax_fail);
    function ajax_success(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var datt = obj[obj.length - 1].substring(0, obj[obj.length - 1].indexOf("T")) + " 15:00:00";
            iFromString2 = getDateTimeStamp(datt);
            main_forces();
        }
    }
    function ajax_fail() {
    }
}
function main_forces() {
    //获取资金流向
    httpGet("Reader/CapitalFlow/" + stockId + "?type=0&skipHour=24&fromTime=" + iFromString2 + "&endTime=" + iNowString2, "", true, ajax_success12, ajax_fail12);
    function ajax_success12(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                var date = new Date(obj[i].CountTime * 1000);
                if (date.getDate() > 9) {
                    if (date.getMonth() < 9) {
                        forcesXAxis.push("0" + (date.getMonth() + 1) + "-" + date.getDate());
                    }
                    else {
                        forcesXAxis.push((date.getMonth() + 1) + "-" + date.getDate());
                    }
                }
                else {
                    if (date.getMonth() < 9) {
                        forcesXAxis.push("0" + (date.getMonth() + 1) + "-0" + date.getDate());
                    }
                    else {
                        forcesXAxis.push((date.getMonth() + 1) + "-0" + date.getDate());
                    }
                }
                forcesSeries2.push(obj[i].MainForce.toFixed(2));
            }
            //获取股票价格
            httpGet("Reader/StockHistory?type=" + "0" + "&stockId=" + stockId + "&fromTime=" + iFromString2 + "&endTime=" + iNowString2 + "&count=" + Stockcount, "", true, ajax_success3, ajax_fail3);
            function ajax_success3(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    for (var i = 0; i < obj.length; i++) {
                        for (var j = 0; j < forcesXAxis.length; j++) {
                            if (obj[i].Ticktime.substring(5, 10) == forcesXAxis[j]) {
                                forcesSeries0[j] = obj[i].Trade;
                                if (obj[i].Changepercent >= 0) {
                                    MainForceColor[j] = ('#F74C59');
                                }
                                else {
                                    MainForceColor[j] = ('#1DBF60');
                                }
                            }
                        }
                    }
                    for (var z = 0; z < forcesXAxis.length; z++) {
                        if (MainForceColor[z] == undefined || MainForceColor[z] == "") {
                            if (forcesSeries2[z] >= 0) {
                                MainForceColor[z] = ('#F74C59');
                            }
                            else {
                                MainForceColor[z] = ('#1DBF60');
                            }
                        }
                    }
                }
                //获取舆情声量
                httpGet("Reader/PublicSentimentTrends/" + stockId + "?type=0&fromTime=" + iFromString2 + "&endTime=" + iNowString2 + "&skipDay=1&isOpenDayOnly=true", "", true, ajax_success4, ajax_fail4);
                function ajax_success4(obj) {
                    if (obj != null && obj != "" && obj != undefined) {
                        for (var i = 0; i < obj.length; i++) {
                            // forcesXAxis.push(obj[i].Ticktime.substring(5, 10));
                            forcesSeries1.push(obj[i].IncreasePoint);
                        }
                        forces_echart(forcesXAxis, forcesSeries0, forcesSeries1, forcesSeries2, MainForceColor);
                    }
                    else {
                        forces_echart(forcesXAxis, forcesSeries0, forcesSeries1, forcesSeries2, MainForceColor);
                    }

                }
                function ajax_fail4() {
                }
            }
            function ajax_fail3() {
            }
        }
        else {
            forces_echart(forcesXAxis, forcesSeries0, forcesSeries1, forcesSeries2, MainForceColor);
        }
    }
    function ajax_fail12() {
    }
    //获取历史资金流向
    httpGet("Reader/HistoryCapitals/" + stockId + "?type=0&endTime=" + iNowString2 + "&count=7", "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            $('#Money_table_box').removeClass('Page');
            for (var i = obj.length - 1; i >= 0; i--) {
                var date = new Date(obj[i].CountTime * 1000);
                var strlist = "";
                strlist += '<tr><td>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '</td><td>' + obj[i].Price.toFixed(2) + '</td>';
                if (obj[i].Changepercent > 0) {
                    strlist += '<td class="stock_point_red">+' + obj[i].Changepercent.toFixed(2) + '%</td>';
                }
                else {
                    if (obj[i].Changepercent < 0) {
                        strlist += '<td class="stock_point_green">' + obj[i].Changepercent.toFixed(2) + '%</td>';
                    }
                    else {
                        strlist += '<td>' + obj[i].Changepercent.toFixed(2) + '%</td>';
                    }
                }
                if (obj[i].NetAmount > 0) {
                    strlist += '<td class="stock_point_red">+' + obj[i].NetAmount.toFixed(2) + '</td>';
                }
                else {
                    if (obj[i].NetAmount < 0) {
                        strlist += '<td class="stock_point_green">' + obj[i].NetAmount.toFixed(2) + '</td>';
                    }
                    else {
                        strlist += '<td>' + obj[i].NetAmount.toFixed(2) + '</td>';
                    }
                }
                strlist += '<td>' + obj[i].Amount.toFixed(2) + '</td></tr>';
                $("#Money_table").append(strlist);
            }
        }
    }
    function ajax_fail2() {

    }
}
function forces_echart(forcesXAxis, forcesSeries0, forcesSeries1, forcesSeries2, MainForceColor) {
    option3 = {
        tooltip: {
            confine: true,
            trigger: 'axis',
            showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        legend: {
            y: 'bottom',
            show: false,
            data: [{ name: '股票价格', icon: 'bar', }, { name: '舆情声量', icon: 'bar', }]
        },
        grid: {
            x: 45,
            y: 30,
            x2: 50,
            y2: 25,
        },
        xAxis: [
            {
                type: 'category',
                position: 'bottom',
                boundaryGap: false,
                axisLabel: { show: true },
                axisTick: { show: false, onGap: false },
                splitNumber: 2,
                splitLine:
                {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                data: forcesXAxis
            }
        ],
        yAxis: [
            {
                name: '价格指数(元)',
                nameTextStyle: { color: ['#666'] },
                type: 'value',
                scale: true,
                axisTick: { show: false, onGap: false },
                splitNumber: 5,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 1,
                        type: 'solid'
                    }
                },
                // boundaryGap: [0.05, 0.05],
                axisLabel: {
                    textStyle: {
                        color: ['#333'],
                    }
                },
                splitArea: { show: false },
            },
            {
                name: '舆情声量',
                nameTextStyle: { color: ['#666'] },
                type: 'value',
                scale: true,
                axisTick: { show: false, onGap: false },
                splitNumber: 5,
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 1,
                        type: 'solid'
                    }
                },
                // boundaryGap: [0.05, 0.05],
                axisLabel: {
                    textStyle: {
                        color: ['#333'],
                    }
                },
                splitArea: { show: false },
            }
        ],
        series: [
            {
                name: '股票价格',
                type: 'line',
                itemStyle: { normal: { lineStyle: { color: '#378eff' } } },
                symbol: 'none',
                // yAxisIndex: 1,
                data: [],
            },
            {
                name: '舆情声量',
                type: 'line',
                itemStyle: { normal: { lineStyle: { color: '#efba93' } } },
                symbol: 'none',
                yAxisIndex: 1,
                data: [],
            },

        ]
    };

    option5 = {
        tooltip: {
            confine: true,
            trigger: 'axis',
            showDelay: 0,
            formatter: function (params) {
                var res = params[0].name;
                res += '<br/>' + params[0].seriesName + ': ';
                res += params[0].value;
                return res;
            },
            // position: function ([x, y]) { return [x, 10] },
        },
        legend: {
            y: 'bottom',
            show: false,
            // icon: 'circle',
            // itemWidth: 12,
            // itemHeight: 4,
            // data: ['股票价格', '舆情声量', '主力净流入'],
            data: [{ name: '主力净流入', icon: 'bar', }]
        },
        grid: {
            x: 45,
            y: 30,
            x2: 20,
            y2: 40,
        },
        xAxis: [
            {
                show: true,
                type: 'category',
                position: 'bottom',
                splitNumber: 2,
                boundaryGap: true,
                axisLabel: {
                    show: false,
                },
                axisTick: { show: false, onGap: false },
                splitLine:
                {
                    show: false,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 1,
                        type: 'dashed'
                    }
                },
                data: forcesXAxis
            }
        ],
        yAxis: [
            {
                name: '主力净流入(万元)',
                nameTextStyle: { color: ['#666'] },
                show: true,
                type: 'value',
                scale: true,
                axisTick: { show: false, onGap: false },
                splitNumber: 2,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 1,
                        type: 'solid'
                    }
                },
                // boundaryGap: [0.05, 0.05],
                axisLabel: {
                    show: true,
                    formatter: function (v) {
                        if (v > 10000) {
                            return (v / 10000) + '万';
                        }
                        else {
                            return v;
                        }
                    },
                    //margin: -40,
                },
                splitArea: { show: false },
            }
        ],
        series: [
            {
                name: '主力净流入',
                type: 'bar',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = MainForceColor;
                            return colorList[params.dataIndex];
                        }
                    }
                },
                data: [],
            }
        ]
    };
    if (forcesSeries0 == '' && forcesSeries1 == '') {
        $('#Money_echart_box').addClass('Page');
        $('#Money_echart_box_null').removeClass('Page');
    }
    else {
        $('#Money_echart_box').removeClass('Page');
        $('#Money_echart_box_null').addClass('Page');
    }
    myChart3 = echarts.init(document.getElementById('Money_echart_box'));
    option3.series[0].data = forcesSeries0;
    option3.series[1].data = forcesSeries1;
    myChart3.setOption(option3);

    if (forcesSeries2 == '') {
        $('#MainForce_echart_box').addClass('Page');
        $('#MainForce_echart_box_null').removeClass('Page');
    }
    else {
        $('#MainForce_echart_box').removeClass('Page');
        $('#MainForce_echart_box_null').addClass('Page');
    }
    myChart5 = echarts.init(document.getElementById('MainForce_echart_box'));
    option5.series[0].data = forcesSeries2;
    myChart5.setOption(option5);


    echarts.connect([myChart3, myChart5]);

    setTimeout(function () {
        window.onresize = function () {
            myChart3.resize();
            myChart5.resize();
        }
    }, 200);
}
//获取3个月内龙虎榜
function main_heroes() {
    var date = new Date();
    var iNowString3 = Date.parse(date);
    var iFromString3 = iNowString3 - 90 * 24 * 3600 * 1000;
    document.getElementById("mai_out_click").addEventListener("touchstart", function () {
        $("#heroes_table,#heroes_table2").addClass("Page");
        $("#heroes_table1").removeClass("Page");
    }, false);
    document.getElementById("mai_NormalOut_click").addEventListener("touchstart", function () {
        $("#heroes_table,#heroes_table2").addClass("Page");
        $("#heroes_table1").removeClass("Page");
    }, false);
    document.getElementById("mai_in_click").addEventListener("touchstart", function () {
        $("#heroes_table1,#heroes_table2").addClass("Page");
        $("#heroes_table").removeClass("Page");
    }, false);
    document.getElementById("mai_NormalIn_click").addEventListener("touchstart", function () {
        $("#heroes_table1,#heroes_table2").addClass("Page");
        $("#heroes_table").removeClass("Page");
    }, false);

    //三个月内龙虎榜买入排序
    httpGet("Reader/StockBillbordDetail?stockID=" + stockId + "&fromTime=" + iFromString3 + "&endTime=" + iNowString3 + "&sortType=0&maxCount=5", "", true, ajax_success13, ajax_fail13);
    function ajax_success13(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    var heroesCompany = obj[i].SeatName.substring(0, obj[i].SeatName.indexOf("公司") + 2);
                    var heroesDepartment = obj[i].SeatName.substring(obj[i].SeatName.indexOf("公司") + 2, obj[i].SeatName.length);
                    $("#heroes_table").append('<tr><td class="heroesTable_fist_td" style="padding-left: 15px;">' + heroesCompany + '<br>' + heroesDepartment + '</td><td>' + obj[i].UpTime.substring(2, 10) + '</td><td class="stock_point_red">' + obj[i].BuyAmount.toFixed(0) + '</td><td class="stock_point_green heroesTable_last_td" style="padding-right: 15px;">' + obj[i].SellAmount.toFixed(0) + '</td></tr>');
                }
            }
        }
        else {
            $('#heroes_table').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股3个月内龙虎榜无数据</div>');
        }
    }
    function ajax_fail13() {
    }
    //三个月内龙虎榜卖出排序
    httpGet("Reader/StockBillbordDetail?stockID=" + stockId + "&fromTime=" + iFromString3 + "&endTime=" + iNowString3 + "&sortType=2&maxCount=5", "", true, ajax_success21, ajax_fail21);
    function ajax_success21(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    var heroesCompany = obj[i].SeatName.substring(0, obj[i].SeatName.indexOf("公司") + 2);
                    var heroesDepartment = obj[i].SeatName.substring(obj[i].SeatName.indexOf("公司") + 2, obj[i].SeatName.length);
                    $("#heroes_table1").append('<tr><td class="heroesTable_fist_td" style="padding-left: 15px;">' + heroesCompany + '<br>' + heroesDepartment + '</td><td>' + obj[i].UpTime.substring(2, 10) + '</td><td class="stock_point_red">' + obj[i].BuyAmount.toFixed(0) + '</td><td class="stock_point_green heroesTable_last_td" style="padding-right: 15px;">' + obj[i].SellAmount.toFixed(0) + '</td></tr>');
                }
            }
        }
        else {
            $('#heroes_table1').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股3个月内龙虎榜无数据</div>');
        }
    }
    function ajax_fail21() {
    }
    //三个月内龙虎榜时间排序
    httpGet("Reader/StockBillbordDetail?stockID=" + stockId + "&fromTime=" + iFromString3 + "&endTime=" + iNowString3 + "&sortType=4&maxCount=5", "", true, ajax_success22, ajax_fail22);
    function ajax_success22(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    var heroesCompany = obj[i].SeatName.substring(0, obj[i].SeatName.indexOf("公司") + 2);
                    var heroesDepartment = obj[i].SeatName.substring(obj[i].SeatName.indexOf("公司") + 2, obj[i].SeatName.length);
                    $("#heroes_table2").append('<tr><td class="heroesTable_fist_td" style="padding-left: 15px;">' + heroesCompany + '<br>' + heroesDepartment + '</td><td>' + obj[i].UpTime.substring(2, 10) + '</td><td class="stock_point_red">' + obj[i].BuyAmount.toFixed(0) + '</td><td class="stock_point_green heroesTable_last_td" style="padding-right: 15px;">' + obj[i].SellAmount.toFixed(0) + '</td></tr>');
                }
            }
        }
        else {
            $('#heroes_table2').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股3个月内龙虎榜无数据</div>');
        }
    }
    function ajax_fail22() {
    }
}
//调仓数据
function main_warehouse() {
    var date = new Date();
    var iNowString3 = Date.parse(date);
    var iFromString3 = iNowString3 - 30 * 24 * 3600 * 1000;
    httpGet("Reader/StockInvestAdjustRecord?stockID=" + stockId + "&fromTime=" + iFromString3 + "&endTime=" + iNowString3 + "&maxCount=5", "", true, ajax_success14, ajax_fail14);
    function ajax_success14(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                var strlist = "";
                for (var i = 0; i < obj.length; i++) {
                    strlist += '<tr><td class="heroesTable_fist_td" style="padding-left: 15px;">' + obj[i].OccourTime.substring(0, 10) + '</td><td class="warehouse_name">' + obj[i].GroupName + '</td>';
                    if (obj[i].HistoryValue < obj[i].CurrentValue) {
                        strlist += '<td class="stock_point_red">' + obj[i].HistoryValue.toFixed(2) + '%→' + obj[i].CurrentValue.toFixed(2) + '%</td>';
                    }
                    else {
                        if (obj[i].HistoryValue > obj[i].CurrentValue) {
                            strlist += '<td class="stock_point_green">' + obj[i].HistoryValue.toFixed(2) + '%→' + obj[i].CurrentValue.toFixed(2) + '%</td>';
                        }
                        else {
                            strlist += '<td>' + obj[i].HistoryValue.toFixed(2) + '%->' + obj[i].CurrentValue.toFixed(2) + '%</td>';
                        }
                    }
                    strlist += '<td class="heroesTable_last_td" style="padding-right: 15px;">' + obj[i].OrderPrice + '</td></tr>';
                }
                $("#warehouse_table").append(strlist);
            }
        }
        else {
            $('#warehouse_table').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无调仓数据</div>');
        }
    }
    function ajax_fail14() {
    }
}
//获取盈利预测
function Profit_echart() {
    var date = new Date();
    iNowString1 = Date.parse(new Date());
    iFromString1 = iNowString1 - 1000 * 365 * 60 * 60 * 24;//获取一个时间的前365天及一年的时间戳
    httpGet("Reader/StockAverageRateInfos?stockId=" + stockId + "&fromTime=" + iFromString1 + "&endTime=" + iNowString1, "", true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.stockRateInfos != null && obj.stockRateInfos != "" && obj.stockRateInfos != undefined) {
                for (var i = obj.stockRateInfos.length - 1; i >= 0; i--) {
                    if (((i != 0) && obj.stockRateInfos[i].PubDate.substring(5, 10) != obj.stockRateInfos[i - 1].PubDate.substring(5, 10)) || i == 0) {
                        EPSProfitTimeline.push(obj.stockRateInfos[i].PubDate.substring(5, 10));
                    }
                    if (obj.stockRateInfos[i].AdjustRange > 0) {
                        ThisYearEPS.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].ThisYearEPS]);
                        NextYearEPS.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].NextYearEPS]);
                        ThisYearNetProfit.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].ThisYearNetProfit]);
                        NextYearNetProfit.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].NextYearNetProfit]);
                    }
                    else {
                        if (obj.stockRateInfos[i].AdjustRange < 0) {
                            ThisYearEPS1.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].ThisYearEPS]);
                            NextYearEPS1.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].NextYearEPS]);
                            ThisYearNetProfit1.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].ThisYearNetProfit]);
                            NextYearNetProfit1.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].NextYearNetProfit]);
                        }
                        else {
                            ThisYearEPS2.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].ThisYearEPS]);
                            NextYearEPS2.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].NextYearEPS]);
                            ThisYearNetProfit2.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].ThisYearNetProfit]);
                            NextYearNetProfit2.push([obj.stockRateInfos[i].PubDate.substring(5, 10), obj.stockRateInfos[i].NextYearNetProfit]);
                        }
                    }
                }
            }
            if (obj.stockAverageRateInfos != null && obj.stockAverageRateInfos != "" && obj.stockAverageRateInfos != undefined) {
                for (var i = obj.stockAverageRateInfos.length - 1; i >= 0; i--) {
                    // ThisYearAvgEPS.push([obj.stockAverageRateInfos[i].PubDate.substring(5, 10), obj.stockAverageRateInfos[i].ThisYearEPS]);
                    // NextYearAvgEPS.push([obj.stockAverageRateInfos[i].PubDate.substring(5, 10), obj.stockAverageRateInfos[i].NextYearEPS]);
                    // ThisYearAvgNetProfit.push([obj.stockAverageRateInfos[i].PubDate.substring(5, 10), obj.stockAverageRateInfos[i].ThisYearNetProfit]);
                    // NextYearAvgNetProfit.push([obj.stockAverageRateInfos[i].PubDate.substring(5, 10), obj.stockAverageRateInfos[i].NextYearNetProfit]);
                    ThisYearAvgEPS.push(obj.stockAverageRateInfos[i].ThisYearEPS);
                    NextYearAvgEPS.push(obj.stockAverageRateInfos[i].NextYearEPS);
                    ThisYearAvgNetProfit.push(obj.stockAverageRateInfos[i].ThisYearNetProfit);
                    NextYearAvgNetProfit.push(obj.stockAverageRateInfos[i].NextYearNetProfit);
                }
            }
            Profit_EPS_echart("当年EPS", ThisYearEPS, ThisYearEPS1, ThisYearEPS2, '当年平均EPS', ThisYearAvgEPS);
        }
        else {
            Profit_EPS_echart("当年EPS", ThisYearEPS, ThisYearEPS1, ThisYearEPS2, '当年平均EPS', ThisYearAvgEPS);
        }
    }
    function ajax_fail3() {

    }
}
function Profit_EPS_echart(seriesName, seriesData0, seriesData1, seriesData3, seriesName1, seriesData4) {
    //盈利预测散点图
    option4 = {
        title: {
            show: false,
            text: '盈利预测散点图',
        },
        tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                    type: 'dashed',
                    width: 1
                }
            },
        },
        grid: {
            x: 40,
            y: 10,
            x2: 20,
            y2: 40,
        },
        legend: {
            show: false,
            data: ['EPS', '平均EPS']
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataZoom: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: { show: false, onGap: false },
                scale: true,
                axisLabel: {
                    formatter: function (v) {
                        return v
                    }
                },
                data: []
            }
        ],
        yAxis: [
            {

                axisTick: { show: false, onGap: false },
                type: 'value',
                scale: true,
            }
        ],
        series: [
            {
                name: 'EPS',
                type: 'scatter',
                symbol: 'diamond',
                tooltip: {
                    confine: true,
                    trigger: 'item',
                    formatter: function (params) {
                        return params.seriesName + '<br/>'
                            + params.value[0] + ' , ' + params.value[1]
                    },
                    axisPointer: {
                        show: true
                    }
                },
                data: [],
                itemStyle: { normal: { color: '#F74C59' } },//红色点
            },
            {
                name: 'EPS',
                type: 'scatter',
                symbol: 'diamond',
                data: [],
                tooltip: {
                    confine: true,
                    trigger: 'item',
                    formatter: function (params) {
                        return params.seriesName + '<br/>'
                            + params.value[0] + ' , ' + params.value[1]
                    },
                    axisPointer: {
                        show: true
                    }
                },
                itemStyle: { normal: { color: '#1DBF60' } },//绿色点
            },
            {
                name: 'EPS',
                type: 'scatter',
                symbol: 'diamond',
                data: [],
                tooltip: {
                    confine: true,
                    trigger: 'item',
                    formatter: function (params) {
                        return params.seriesName + '<br/>'
                            + params.value[0] + ' , ' + params.value[1]
                    },
                    axisPointer: {
                        show: true
                    }
                },
                itemStyle: { normal: { color: '#999' } },//灰色点
            },
            {
                type: 'line',
                data: [],
                tooltip: {
                    confine: true,
                    trigger: 'item',
                    formatter: function (params) {
                        return params.seriesName + '<br/>'
                            + params.value
                    },
                    axisPointer: {
                        show: true
                    }
                },
                itemStyle: { normal: { color: '#3095ff' } },//蓝色平均线
                // itemStyle: { normal: { lineStyle: { color: '#3095ff' } } },
            },
        ]
    };

    if (seriesData0 == '' && seriesData1 == '' && seriesData3 == '') {
        $('#profit_box').addClass('Page');
        $('#profit_box_null').removeClass('Page');
    }
    else {
        $('#profit_box').removeClass('Page');
        $('#profit_box_null').addClass('Page');
    }
    option4.xAxis[0].data = EPSProfitTimeline;
    myChart4 = echarts.init(document.getElementById('profit_echart'));
    // myChart4.clear();
    //当年EPS散点图
    option4.series[0].name = seriesName;
    option4.series[1].name = seriesName;
    option4.series[2].name = seriesName;
    option4.series[3].name = seriesName1;
    option4.series[0].data = seriesData0;
    option4.series[1].data = seriesData1;
    option4.series[2].data = seriesData3;
    option4.series[3].data = seriesData4;
    myChart4.setOption(option4);
}
//获取热评
function bottom_A() {
    httpGet("Reader/StockHotJudge?stockID=" + stockId + "&from=" + from0 + "&size=10", "", true, ajax_success15, ajax_fail15);
    function ajax_success15(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var strlist = "";
            if (obj.length > 0) {
                from0 = obj.length;
                for (var i = 0; i < obj.length; i++) {
                    if (panduan(obj[i].JudgeDeatil)) {
                        if (obj[i].JudgeDeatil.length > 60) {
                            var JudgeDeatil = obj[i].JudgeDeatil.substring(0, 60) + '...';
                            $('#bottom_A ul').append('<li id="' + obj[i].JudgeID + '"><div class="content_comment" style="padding-bottom: 25px;"><div style="position:relative"><div class="head_comment"><img src="' + obj[i].ImageUrl + '" onerror="this.src=' + "'images/head_comment.png'" + '"/></div><div class="comment_name"><span>' + obj[i].UserName + '</span></div><div class="comment_from"><span style="margin-right:10px;">' + GetTimeRegular(obj[i].JudgeTime) + '</span><span>' + obj[i].JudgeSource + '</span></div><div class="comment_neirong">' + JudgeDeatil + '</div><div class="comment_neirong1 Page">' + obj[i].JudgeDeatil + '</div><div class="s_hidden_box"><img class="s_hidden" src="images/S_Hidden.png"></div><div class="s_button_box"><span id="hidden_' + obj[i].JudgeID + '" class="s_button_box_div"><span class="s_hidden_span">展开</span><img class="s_hidden_button" src="images/moreDown.png"></span></div><div id="hidden1_' + obj[i].JudgeID + '" class="s_button_right Page"><img class="s_hidden_RImg" src="images/moreUp1.png"></div></div></div><div class="clear"></div></li>');
                            bind_indexlist5('hidden_' + obj[i].JudgeID);
                            bind_indexlist6('hidden1_' + obj[i].JudgeID);
                            bind_indexlist7(obj[i].JudgeID);
                        }
                        else {
                            var JudgeDeatil = obj[i].JudgeDeatil;
                            $('#bottom_A ul').append('<li id="' + obj[i].JudgeID + '"><div class="content_comment"><div style="position:relative"><div class="head_comment"><img src="' + obj[i].ImageUrl + '" onerror="this.src=' + "'images/head_comment.png'" + '"/></div><div class="comment_name"><span>' + obj[i].UserName + '</span></div><div class="comment_from"><span style="margin-right:10px;">' + GetTimeRegular(obj[i].JudgeTime) + '</span><span>' + obj[i].JudgeSource + '</span></div><div class="comment_neirong">' + JudgeDeatil + '</div></div></div><div class="clear"></div></li>');
                            bind_indexlist7(obj[i].JudgeID);
                        }
                    }
                }
            }
        }
        else {
            $('#bottom_A').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无热评信息</div>');
        }
    }
    function ajax_fail15() {
    }
}
//获取观点
function bottom_B() {
    httpGet("Reader/StockPoint?stockID=" + stockId + "&from=" + from1 + "&size=10", "", true, ajax_success16, ajax_fail16);
    function ajax_success16(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var strlist = "";
            if (obj.length > 0) {
                from1 = obj.length;
                for (var i = 0; i < obj.length; i++) {
                    $('#bottom_B ul').append('<li id="' + obj[i].PointID + '"><div class="content_point"><div class="head_point"><div class="head_point_pic"><img onerror="this.src=' + "'images/head_comment.png'" + '" src="' + obj[i].UserImage + '"/><div class="V_icon"><img src="images/V_icon.png" /></div></div></div><div class="comment_name"><span style="margin-right:10px;">' + obj[i].UserName + '</span><span class="Page">' + obj[i].UserNickName + '</span></div><div class="comment_from"><span>' + GetTimeRegular(obj[i].PointTime) + '</span></div><div class="point_title">' + obj[i].PointTitle + '</div><div class="point_neirong">' + obj[i].PointDeatil + '</div></div><div class="clear"></div></li>');
                    bind_indexlist1(obj[i].PointID);
                }
                // $('#bottom_B ul').append(strlist);
            }
        }
        else {
            $('#bottom_B').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无观点信息</div>');
        }
    }
    function ajax_fail16() {
    }
}
//获取新闻
function bottom_C() {
    httpGet("Reader/StockNews?stockID=" + stockId + "&from=" + from2 + "&size=3", "", true, ajax_success17, ajax_fail17);
    function ajax_success17(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var strlist = "";
            if (obj.length > 0) {
                from2 = obj.length;
                for (var i = 0; i < obj.length; i++) {
                    $('#bottom_C ul').append('<li id="' + obj[i].NewsID + '"><p>' + obj[i].NewsTitle + '</p><p class="relate-date">' + GetTimeRegular(obj[i].NewsTime) + '</p></li>');
                    bind_indexlist(obj[i].NewsID);
                }
                // $('#bottom_C ul').append(strlist);
            }
        }
        else {
            $('#bottom_C').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无新闻信息</div>');
        }
    }
    function ajax_fail17() {
    }
}
//获取公告
function bottom_D() {
    httpGet("Reader/StockAnnouncements?stockID=" + stockId + "&from=" + from3 + "&size=10", "", true, ajax_success18, ajax_fail18);
    function ajax_success18(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var strlist = "";
            if (obj.length > 0) {
                from3 = obj.length;
                for (var i = 0; i < obj.length; i++) {
                    $('#bottom_D ul').append('<li id="' + obj[i].AnnounceID + '"><p><span class="notice_type">' + obj[i].AnnounceType + '</span>' + obj[i].AnnounceTitle + '</p><p class="relate-date">' + GetTimeRegular(obj[i].AnnounceTime) + '</p></li>');
                    bind_indexlist2(obj[i].AnnounceID);
                }
                // $('#bottom_D ul').append(strlist);
            }
        }
        else {
            $('#bottom_D').append('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无公告信息</div>');
        }
    }
    function ajax_fail18() {
    }
}
//获取研报
function bottom_E() {
    httpGet("Reader/StockReports?stockID=" + stockId + "&from=0&size=10", "", true, ajax_success19, ajax_fail19);
    function ajax_success19(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    var strlist = "";
                    if (obj[i].ReportTime != null && obj[i].ReportTime != "" && obj[i].ReportTime != "null") {
                        strlist += '<tr><td>' + obj[i].ReportTime.substring(0, 10) + '</td>';
                    }
                    else {
                        strlist += '<tr><td>' + '--' + '</td>';
                    }
                    if (obj[i].AgencyName != null && obj[i].AgencyName != "" && obj[i].AgencyName != "null") {
                        strlist += '<td>' + obj[i].AgencyName + '</td>';
                    }
                    else {
                        strlist += '<td>' + '--' + '</td>';
                    }
                    if (obj[i].ReportType != null && obj[i].ReportType != "" && obj[i].ReportType != "null") {
                        strlist += '<td>' + obj[i].ReportType + '</td>';
                    }
                    else {
                        strlist += '<td>' + '--' + '</td>';
                    }
                    if (obj[i].ReportTitle != null && obj[i].ReportTitle != "" && obj[i].ReportTitle != "null") {
                        strlist += '<td id="' + obj[i].ReportID + '">' + obj[i].ReportTitle + '</td></tr>';
                    }
                    else {
                        strlist += '<td>' + '--' + '</td></tr>';
                    }
                    $('#bottom_E table').append(strlist);
                    bind_indexlist3(obj[i].ReportID);
                }
            }
        }
        else {
            $('#bottom_E').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:5px 0 20px 0;">该股无研报信息</div>');
        }
    }
    function ajax_fail19() {
    }
}
//获取资料
function bottom_F() {
    httpGet("Reader/stockBasicInfo?stockID=" + stockId, "", true, ajax_success20, ajax_fail20);
    function ajax_success20(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.Company != null && obj.Company != "" && obj.Company != undefined) {
                $('#means_brief').html('<tr><td>公司名称</td><td>' + obj.Company.CompanyName + '</td></tr><tr><td>上市日期</td><td>' + obj.Company.BoardTime.substring(0, 10) + '</td></tr><tr><td>发行价格</td><td>' + obj.Company.BoardPrice + '</td></tr><tr><td>发行数量</td><td>' + obj.Company.BoadrAmount + '万股</td></tr><tr><td>所属地区</td><td>' + obj.Company.CompanyRegion + '</td></tr>');
            }
            else {
                $('#box_means_brief').addClass('Page');
            }
            if (obj.ProductEarningParts != null || obj.AreaEarningParts != null) {
                //收入构成（按产品）
                if (obj.ProductEarningParts != null && obj.ProductEarningParts != "" && obj.ProductEarningParts != undefined) {
                    for (var i = 0; i < obj.ProductEarningParts.length; i++) {
                        if (obj.ProductEarningParts[i].PartsIncome != null) {
                            if (Math.abs(obj.ProductEarningParts[i].PartsIncome) >= 10000) {
                                var PartsIncome = (obj.ProductEarningParts[i].PartsIncome / 10000).toFixed(2) + '亿';
                            }
                            else {
                                var PartsIncome = obj.ProductEarningParts[i].PartsIncome.toFixed(2) + '万';
                            }
                        }
                        else {
                            var PartsIncome = "--";
                        }
                        if (obj.ProductEarningParts[i].PartsCost != null) {
                            if (Math.abs(obj.ProductEarningParts[i].PartsCost) >= 10000) {
                                var PartsCost = (obj.ProductEarningParts[i].PartsCost / 10000).toFixed(2) + '亿';
                            }
                            else {
                                var PartsCost = obj.ProductEarningParts[i].PartsCost.toFixed(2) + '万';
                            }
                        }
                        else {
                            var PartsCost = "--";
                        }
                        if (obj.ProductEarningParts[i].PartsProfit != null) {
                            if (Math.abs(obj.ProductEarningParts[i].PartsProfit) >= 10000) {
                                var PartsProfit = (obj.ProductEarningParts[i].PartsProfit / 10000).toFixed(2) + '亿';
                            }
                            else {
                                var PartsProfit = obj.ProductEarningParts[i].PartsProfit.toFixed(2) + '万';
                            }
                        }
                        else {
                            var PartsProfit = "--";
                        }
                        $('#means_income_product').append('<tr><td>' + obj.ProductEarningParts[i].PartsName + '</td><td>' + PartsIncome + '</td><td>' + PartsCost + '</td><td>' + PartsProfit + '</td></tr>');
                    }
                }
                else {
                    $('#bottom_F_A').addClass('Page');
                }
                //收入构成（按地区）
                if (obj.AreaEarningParts != null && obj.AreaEarningParts != "" && obj.AreaEarningParts != undefined) {
                    for (var j = 0; j < obj.AreaEarningParts.length; j++) {
                        if (obj.AreaEarningParts[j].PartsIncome != null) {
                            if (Math.abs(obj.AreaEarningParts[j].PartsIncome) >= 10000) {
                                var PartsIncome = (obj.AreaEarningParts[j].PartsIncome / 10000).toFixed(2) + '亿';
                            }
                            else {
                                var PartsIncome = obj.AreaEarningParts[j].PartsIncome.toFixed(2) + '万';
                            }
                        }
                        else {
                            var PartsIncome = "--";
                        }
                        if (obj.AreaEarningParts[j].PartsCost != null) {
                            if (Math.abs(obj.AreaEarningParts[j].PartsCost) >= 10000) {
                                var PartsCost = (obj.AreaEarningParts[j].PartsCost / 10000).toFixed(2) + '亿';
                            }
                            else {
                                var PartsCost = obj.AreaEarningParts[j].PartsCost.toFixed(2) + '万';
                            }
                        }
                        else {
                            var PartsCost = "--";
                        }
                        if (obj.AreaEarningParts[j].PartsProfit != null) {
                            if (Math.abs(obj.AreaEarningParts[j].PartsProfit) >= 10000) {
                                var PartsProfit = (obj.AreaEarningParts[j].PartsProfit / 10000).toFixed(2) + '亿';
                            }
                            else {
                                var PartsProfit = obj.AreaEarningParts[j].PartsProfit.toFixed(2) + '万';
                            }
                        }
                        else {
                            var PartsProfit = "--";
                        }
                        $('#means_income_district').append('<tr><td>' + obj.AreaEarningParts[j].PartsName + '</td><td>' + PartsIncome + '</td><td>' + PartsCost + '</td><td>' + PartsProfit + '</td></tr>');
                    }
                }
                else {
                    $('#bottom_F_B').addClass('Page');
                }
            }
            else {
                $('#box_means_income1').addClass("Page");
            }
            //最新财务数据
            if (obj.FinancialData != null && obj.FinancialData != "" && obj.FinancialData != undefined) {
                if (obj.FinancialData.FinancialIndexs != null && obj.FinancialData.FinancialIndexs != "" && obj.FinancialData.FinancialIndexs != undefined) {
                    var date = obj.FinancialData.FinancialIndexs.AccountDate;
                    var year = date.substring(0, 4);
                    var month = parseInt(date.substring(5, 7));
                    $('#new_finance_year').html('会计年度：' + year + '年' + GetMonthToQuarter(month) + '季度');
                    if (obj.FinancialData.FinancialIndexs.SingleProfit != null) {
                        var SingleProfit = obj.FinancialData.FinancialIndexs.SingleProfit.toFixed(4);
                    }
                    else {
                        var SingleProfit = "--";
                    }
                    if (obj.FinancialData.FinancialIndexs.SinglesAssets != null) {
                        var SinglesAssets = obj.FinancialData.FinancialIndexs.SinglesAssets.toFixed(4);
                    }
                    else {
                        var SinglesAssets = "--";
                    }
                    if (obj.FinancialData.FinancialIndexs.AdjustAssets != null) {
                        var AdjustAssets = obj.FinancialData.FinancialIndexs.AdjustAssets.toFixed(4);
                    }
                    else {
                        var AdjustAssets = "--";
                    }
                    if (obj.FinancialData.FinancialIndexs.AssetsProfit != null) {
                        var AssetsProfit = obj.FinancialData.FinancialIndexs.AssetsProfit.toFixed(2);
                    }
                    else {
                        var AssetsProfit = "--";
                    }
                    if (obj.FinancialData.FinancialIndexs.CashCount != null) {
                        var CashCount = obj.FinancialData.FinancialIndexs.CashCount.toFixed(4);
                    }
                    else {
                        var CashCount = "--";
                    }
                    $('#new_finance_box').html('<tr><td>基本每股收益(元)</td><td>' + SingleProfit + '</td></tr><tr><td>每股净资产(元)</td><td>' + SinglesAssets + '</td></tr><tr><td>调整后每股净资产(元)</td><td>' + AdjustAssets + '</td></tr><tr><td>净资产收益率(摊薄)(％)</td><td>' + AssetsProfit + '</td></tr><tr><td>每股经营活动产生的现金流量净额(元)</td><td>' + CashCount + '</td></tr>');
                }
                else {
                    $('#bottom_F_C').addClass('Page');
                }
                //利润表
                if (obj.FinancialData.BussinessIncome != null) {
                    if (Math.abs(obj.FinancialData.BussinessIncome) >= 10000) {
                        var BussinessIncome = (obj.FinancialData.BussinessIncome / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var BussinessIncome = obj.FinancialData.BussinessIncome.toFixed(2) + '万';
                    }
                }
                else {
                    var BussinessIncome = "--";
                }
                if (obj.FinancialData.BussinessProfit != null) {
                    if (Math.abs(obj.FinancialData.BussinessProfit) >= 10000) {
                        var BussinessProfit = (obj.FinancialData.BussinessProfit / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var BussinessProfit = obj.FinancialData.BussinessProfit.toFixed(2) + '万';
                    }
                }
                else {
                    var BussinessProfit = "--";
                }
                if (obj.FinancialData.SumProfit != null) {
                    if (Math.abs(obj.FinancialData.SumProfit) >= 10000) {
                        var SumProfit = (obj.FinancialData.SumProfit / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var SumProfit = obj.FinancialData.SumProfit.toFixed(2) + '万';
                    }
                }
                else {
                    var SumProfit = "--";
                }
                if (obj.FinancialData.NetProfit != null) {
                    if (Math.abs(obj.FinancialData.NetProfit) >= 10000) {
                        var NetProfit = (obj.FinancialData.NetProfit / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var NetProfit = obj.FinancialData.NetProfit.toFixed(2) + '万';
                    }
                }
                else {
                    var NetProfit = "--";
                }
                $('#profit_table_box').html('<tr><td>营业收入</td><td>' + BussinessIncome + '</td></tr><tr><td>营业利润</td><td>' + BussinessProfit + '</td></tr><tr><td>利润总额</td><td>' + SumProfit + '</td></tr><tr><td>净利润</td><td>' + NetProfit + '</td></tr>');
                //资产负债表
                if (obj.FinancialData.SumAssets != null) {
                    if (Math.abs(obj.FinancialData.SumAssets) >= 10000) {
                        var SumAssets = (obj.FinancialData.SumAssets / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var SumAssets = obj.FinancialData.SumAssets.toFixed(2) + '万';
                    }
                }
                else {
                    var SumAssets = "--";
                }
                if (obj.FinancialData.DebtAssets != null) {
                    if (Math.abs(obj.FinancialData.DebtAssets) >= 10000) {
                        var DebtAssets = (obj.FinancialData.DebtAssets / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var DebtAssets = obj.FinancialData.DebtAssets.toFixed(2) + '万';
                    }
                }
                else {
                    var DebtAssets = "--";
                }
                if (obj.FinancialData.SumRights != null) {
                    if (Math.abs(obj.FinancialData.SumRights) >= 10000) {
                        var SumRights = (obj.FinancialData.SumRights / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var SumRights = obj.FinancialData.SumRights.toFixed(2) + '万';
                    }
                }
                else {
                    var SumRights = "--";
                }
                $('#Balance_box').html('<tr><td>资产总计</td><td>' + SumAssets + '</td></tr><tr><td>负债总计</td><td>' + DebtAssets + '</td></tr><tr><td>所有者权益(或股东权益)合计</td><td>' + SumRights + '</td></tr>');
                //现金流量表
                if (obj.FinancialData.BussinessCash != null) {
                    if (Math.abs(obj.FinancialData.BussinessCash) >= 10000) {
                        var BussinessCash = (obj.FinancialData.BussinessCash / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var BussinessCash = obj.FinancialData.BussinessCash.toFixed(2) + '万';
                    }
                }
                else {
                    var BussinessCash = "--";
                }
                if (obj.FinancialData.InvestCash != null) {
                    if (Math.abs(obj.FinancialData.InvestCash) >= 10000) {
                        var InvestCash = (obj.FinancialData.InvestCash / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var InvestCash = obj.FinancialData.InvestCash.toFixed(2) + '万';
                    }
                }
                else {
                    var InvestCash = "--";
                }
                if (obj.FinancialData.FinaceCash != null) {
                    if (Math.abs(obj.FinancialData.FinaceCash) >= 10000) {
                        var FinaceCash = (obj.FinancialData.FinaceCash / 10000).toFixed(2) + '亿';
                    }
                    else {
                        var FinaceCash = obj.FinancialData.FinaceCash.toFixed(2) + '万';
                    }
                }
                else {
                    var FinaceCash = "--";
                }
                $('#cash_flow_box').html('<tr><td>经营活动产生的现金流向净额</td><td>' + BussinessCash + '</td></tr><tr><td>投资活动产生的现金流量净额</td><td>' + InvestCash + '</td></tr><tr><td>筹资活动产生的现金流量净额</td><td>' + FinaceCash + '</td></tr>');
                //主营收入
                if (obj.FinancialData.MainEarningParts != null && obj.FinancialData.MainEarningParts != "" && obj.FinancialData.MainEarningParts != undefined) {
                    var date = obj.FinancialData.MainEarningParts[0].AccountDate;
                    var year = date.substring(0, 4);
                    var month = parseInt(date.substring(5, 7));
                    $('#main_means_year').html('会计年度：' + year + '年' + GetMonthToQuarter(month) + '季度');
                    if (obj.FinancialData.MainEarningParts[0].PartsIncome != null) {
                        if (Math.abs(obj.FinancialData.MainEarningParts[0].PartsIncome) >= 10000) {
                            var PartsIncome = (obj.FinancialData.MainEarningParts[0].PartsIncome / 10000).toFixed(2) + '亿';
                        }
                        else {
                            var PartsIncome = obj.FinancialData.MainEarningParts[0].PartsIncome.toFixed(2) + '万';
                        }
                    }
                    else {
                        var PartsIncome = "--";
                    }
                    if (obj.FinancialData.MainEarningParts[0].PartsCost != null) {
                        if (Math.abs(obj.FinancialData.MainEarningParts[0].PartsCost) >= 10000) {
                            var PartsCost = (obj.FinancialData.MainEarningParts[0].PartsCost / 10000).toFixed(2) + '亿';
                        }
                        else {
                            var PartsCost = obj.FinancialData.MainEarningParts[0].PartsCost.toFixed(2) + '万';
                        }
                    }
                    else {
                        var PartsCost = "--";
                    }
                    if (obj.FinancialData.MainEarningParts[0].PartsProfit != null) {
                        if (Math.abs(obj.FinancialData.MainEarningParts[0].PartsProfit) >= 10000) {
                            var PartsProfit = (obj.FinancialData.MainEarningParts[0].PartsProfit / 10000).toFixed(2) + '亿';
                        }
                        else {
                            var PartsProfit = obj.FinancialData.MainEarningParts[0].PartsProfit.toFixed(2) + '万';
                        }
                    }
                    else {
                        var PartsProfit = "--";
                    }
                    $('#main_means_box').append('<tr><td>' + obj.FinancialData.MainEarningParts[0].PartsName + '</td><td>' + PartsIncome + '</td><td>' + PartsCost + '</td><td>' + PartsProfit + '</td></tr>');
                }
                else {
                    $('#bottom_F_F').addClass('Page');
                }
            }
            else {
                $('#box_means_income2').addClass("Page");
            }
        }
        else {
            $('#bottom_F').html('<div style="width:100%;text-align:center;font-size:16px;color:#999;padding:20px 0;">该股无资料信息</div>');
        }
    }
    function ajax_fail20() {
    }
}
//相关热评点击绑定
function bind_indexlist5(id) {
    document.getElementById(id).addEventListener("touchstart", function (event) {
        event.stopPropagation();
        event.preventDefault();
        if ($(this).find('.s_hidden_button').attr('src') == 'images/moreDown.png') {
            $(this).find('.s_hidden_span').html('收起');
            $(this).parents('li').find('.s_hidden_box').remove();
            $(this).find('.s_hidden_button').attr('src', 'images/moreUp.png');
            $(this).parents('li').find('.comment_neirong').addClass('Page');
            $(this).parents('li').find('.comment_neirong1,.s_button_right').removeClass('Page');
        }
        else {
            $(this).find('.s_hidden_span').html('展开');
            $(this).parents('li').find('.s_button_box').before('<div class="s_hidden_box"><img class="s_hidden" src="images/S_Hidden.png"></div>');
            $(this).find('.s_hidden_button').attr('src', 'images/moreDown.png');
            $(this).parents('li').find('.comment_neirong1,.s_button_right').addClass('Page');
            $(this).parents('li').find('.comment_neirong').removeClass('Page');
        }
    }, false);
}

//相关热评的收起的点击
function bind_indexlist6(id) {
    document.getElementById(id).addEventListener("touchstart", function (event) {
        event.stopPropagation();
        event.preventDefault();
        $(this).parents('li').find('.s_hidden_span').html('展开');
        $(this).parents('li').find('.s_button_box').before('<div class="s_hidden_box"><img class="s_hidden" src="images/S_Hidden.png"></div>');
        $(this).parents('li').find('.s_hidden_button').attr('src', 'images/moreDown.png');
        $(this).parents('li').find('.comment_neirong1,.s_button_right').addClass('Page');
        $(this).parents('li').find('.comment_neirong').removeClass('Page');
    }, false);
}

//相关观点点击绑定
function bind_indexlist7(id) {
    $('#' + id).bind("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        AddGoback(localStorage.N_url, 'HotJudge.html?HotJudgeId=' + id);
    })
}
//相关观点点击绑定
function bind_indexlist1(id) {
    $('#' + id).bind("click", function () {
        AddGoback(localStorage.N_url, 'point.html?pointId=' + id);
    })
}
//相关新闻点击绑定
function bind_indexlist(id) {
    $('#' + id).bind("click", function () {
        // StatusBar.backgroundColorByHexString("#2B68B8");
        AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + id + '&newsType=1');
        // slide('left', 'lightblue', 1, 'newsInfo.html?itemid=' + id + '&newsType=1' + '&fromPage=stock&stockId=' + stockId);
    })
}
//相关公告点击绑定
function bind_indexlist2(id) {
    $('#' + id).bind("click", function () {
        // StatusBar.backgroundColorByHexString("#2B68B8");
        AddGoback(localStorage.N_url, 'Announcement.html?AnnouncementId=' + id);
        // slide('left', 'lightblue', 1, 'Announcement.html?AnnouncementId=' + id + '&fromPage=stock&stockId=' + stockId);
    })
}
//相关研报点击绑定
function bind_indexlist3(id) {
    $('#' + id).bind("click", function () {
        // StatusBar.backgroundColorByHexString("#2B68B8");
        AddGoback(localStorage.N_url, 'Reports.html?ReportsId=' + id);
        // slide('left', 'lightblue', 1, 'Reports.html?ReportsId=' + id + '&fromPage=stock&stockId=' + stockId);
    })
}
//相关主题点击绑定
function bind_indexlist4(id) {
    $('#' + id).bind("click", function () {
        // StatusBar.backgroundColorByHexString("#2B68B8");
        AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId=' + id);
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
        // $("#info-htmltext").prepend("yScrolls："+yScrolls+" && "+"yScrolle："+yScrolle);
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            backHistory();
        }
    });
}
function touchStartBack(event) {
    event.preventDefault();
    backHistory();
}
//返回上一个页面
function backHistory() {
    // StatusBar.backgroundColorByHexString("#2B68B8");
    Gotoback();
}
//滑动到底部
function touchBottom() {
    $(window).scroll(function () {
        // $(window).unbind('scroll');
        if ($(this).scrollTop() + $(this).height() == $(document).height()) {
            $(window).unbind('scroll');
            if (Bottom_type == "bottom_AA") {
                if (from0 != 0) {
                    $('#stock_loading').removeClass('Page');
                    if (from0 % 10 == 0) {
                        httpGet("Reader/StockHotJudge?stockID=" + stockId + "&from=" + from0 + "&size=10", "", true, ajax_success6, ajax_fail6);
                        function ajax_success6(obj) {
                            if (obj != null && obj != "" && obj != undefined) {
                                var strlist = "";
                                if (obj.length > 0) {
                                    from0 += obj.length;
                                    for (var i = 0; i < obj.length; i++) {
                                        if (panduan(obj[i].JudgeDeatil)) {
                                            if (obj[i].JudgeDeatil.length > 60) {
                                                var JudgeDeatil = obj[i].JudgeDeatil.substring(0, 60) + '...';
                                                $('#bottom_A ul').append('<li id="' + obj[i].JudgeID + '"><div class="content_comment" style="padding-bottom: 25px;"><div style="position:relative"><div class="head_comment"><img src="' + obj[i].ImageUrl + '" onerror="this.src=' + "'images/head_comment.png'" + '"/></div><div class="comment_name"><span>' + obj[i].UserName + '</span></div><div class="comment_from"><span style="margin-right:10px;">' + GetTimeRegular(obj[i].JudgeTime) + '</span><span>' + obj[i].JudgeSource + '</span></div><div class="comment_neirong">' + JudgeDeatil + '</div><div class="comment_neirong1 Page">' + obj[i].JudgeDeatil + '</div><div class="s_hidden_box"><img class="s_hidden" src="images/S_Hidden.png"></div><div class="s_button_box"><span id="hidden_' + obj[i].JudgeID + '" class="s_button_box_div"><span class="s_hidden_span">展开</span><img class="s_hidden_button" src="images/moreDown.png"></span></div><div id="hidden1_' + obj[i].JudgeID + '" class="s_button_right Page"><img class="s_hidden_RImg" src="images/moreUp1.png"></div></div></div><div class="clear"></div></li>');
                                                bind_indexlist5('hidden_' + obj[i].JudgeID);
                                                bind_indexlist6('hidden1_' + obj[i].JudgeID);
                                                bind_indexlist7(obj[i].JudgeID);
                                            }
                                            else {
                                                var JudgeDeatil = obj[i].JudgeDeatil;
                                                $('#bottom_A ul').append('<li id="' + obj[i].JudgeID + '"><div class="content_comment"><div style="position:relative"><div class="head_comment"><img src="' + obj[i].ImageUrl + '" onerror="this.src=' + "'images/head_comment.png'" + '"/></div><div class="comment_name"><span>' + obj[i].UserName + '</span></div><div class="comment_from"><span style="margin-right:10px;">' + GetTimeRegular(obj[i].JudgeTime) + '</span><span>' + obj[i].JudgeSource + '</span></div><div class="comment_neirong">' + JudgeDeatil + '</div></div></div><div class="clear"></div></li>');
                                                bind_indexlist7(obj[i].JudgeID);
                                            }
                                        }
                                    }
                                }
                                $('#stock_loading').addClass('Page');
                                touchBottom();
                            }
                            else {
                                $('#stock_loading img').addClass('Page');
                                $('#stock_loading span').html('没有更多数据了');
                            }
                        }
                        function ajax_fail6() {
                        }
                    }
                    else {
                        $('#stock_loading img').addClass('Page');
                        $('#stock_loading span').html('没有更多数据了');
                    }
                }
            }
            else if (Bottom_type == "bottom_BB") {
                if (from1 != 0) {
                    $('#stock_loading').removeClass('Page');
                    if (from1 % 10 == 0) {
                        httpGet("Reader/StockPoint?stockID=" + stockId + "&from=" + from1 + "&size=10", "", true, ajax_success7, ajax_fail7);
                        function ajax_success7(obj) {
                            if (obj != null && obj != "" && obj != undefined) {
                                var strlist = "";
                                if (obj.length > 0) {
                                    from1 += obj.length;
                                    for (var i = 0; i < obj.length; i++) {
                                        $('#bottom_B ul').append('<li id="' + obj[i].PointID + '"><div class="content_point"><div class="head_point"><div class="head_point_pic"><img onerror="this.src=' + "'images/head_comment.png'" + '" src="' + obj[i].UserImage + '"/><div class="V_icon"><img src="images/V_icon.png" /></div></div></div><div class="comment_name"><span style="margin-right:10px;">' + obj[i].UserName + '</span><span class="Page">' + obj[i].UserNickName + '</span></div><div class="comment_from"><span>' + GetTimeRegular(obj[i].PointTime) + '</span></div><div class="point_title">' + obj[i].PointTitle + '</div><div class="point_neirong">' + obj[i].PointDeatil + '</div></div><div class="clear"></div></li>');
                                        bind_indexlist1(obj[i].PointID);
                                    }
                                    // $('#bottom_B ul').append(strlist);
                                }
                                $('#stock_loading').addClass('Page');
                                touchBottom();
                            }
                            else {
                                $('#stock_loading img').addClass('Page');
                                $('#stock_loading span').html('没有更多数据了');
                            }
                        }
                        function ajax_fail7() {
                        }
                    }
                    else {
                        $('#stock_loading img').addClass('Page');
                        $('#stock_loading span').html('没有更多数据了');
                    }
                }
            }
            else if (Bottom_type == "bottom_CC") {
                if (from2 != 0) {
                    $('#stock_loading').removeClass('Page');
                    if (from2 % 3 == 0) {
                        httpGet("Reader/StockNews?stockID=" + stockId + "&from=" + from2 + "&size=3", "", true, ajax_success8, ajax_fail8);
                        function ajax_success8(obj) {
                            if (obj != null && obj != "" && obj != undefined) {
                                var strlist = "";
                                if (obj.length > 0) {
                                    from2 += obj.length;
                                    for (var i = 0; i < obj.length; i++) {
                                        $('#bottom_C ul').append('<li id="' + obj[i].NewsID + '"><p>' + obj[i].NewsTitle + '</p><p class="relate-date">' + GetTimeRegular(obj[i].NewsTime) + '</p></li>');
                                        bind_indexlist(obj[i].NewsID);
                                    }
                                }
                                $('#stock_loading').addClass('Page');
                                touchBottom();
                            }
                            else {
                                $('#stock_loading img').addClass('Page');
                                $('#stock_loading span').html('没有更多数据了');
                            }
                        }
                        function ajax_fail8() {
                        }
                    }
                    else {
                        $('#stock_loading img').addClass('Page');
                        $('#stock_loading span').html('没有更多数据了');
                    }
                }
            }
            else if (Bottom_type == "bottom_DD") {
                if (from3 != 0) {
                    $('#stock_loading').removeClass('Page');
                    if (from3 % 10 == 0) {
                        httpGet("Reader/StockAnnouncements?stockID=" + stockId + "&from=" + from3 + "&size=10", "", true, ajax_success9, ajax_fail9);
                        function ajax_success9(obj) {
                            if (obj != null && obj != "" && obj != undefined) {
                                var strlist = "";
                                if (obj.length > 0) {
                                    from3 += obj.length;
                                    for (var i = 0; i < obj.length; i++) {
                                        $('#bottom_D ul').append('<li id="' + obj[i].AnnounceID + '"><p><span class="notice_type">' + obj[i].AnnounceType + '</span>' + obj[i].AnnounceTitle + '</p><p class="relate-date">' + GetTimeRegular(obj[i].AnnounceTime) + '</p></li>');
                                        bind_indexlist2(obj[i].AnnounceID);
                                    }
                                    // $('#bottom_D ul').append(strlist);
                                }
                                $('#stock_loading').addClass('Page');
                                touchBottom();
                            }
                            else {
                                $('#stock_loading img').addClass('Page');
                                $('#stock_loading span').html('没有更多数据了');
                            }
                        }
                        function ajax_fail9() {
                        }
                    }
                    else {
                        $('#stock_loading img').addClass('Page');
                        $('#stock_loading span').html('没有更多数据了');
                    }
                }
            }
        }
    })
}