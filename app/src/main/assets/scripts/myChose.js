var nullu = "", NowVerision = "2.0", UserID = "";
var UserStatus = "unlogin";
var K_type = "A", stockId = "sh000001";
var iNowString = 0, iNow = 0, iFromString = 0, StockHistoryType = 0, Stockcount = 0, openDaysCount = 0
var A_TicktimeData = [], A_TradeData = [];
var B_TicktimeData = [], B_TradeData = [];
var C_TicktimeData = [], C_TradeData = [];
var EditAble = 1;
var choseNumber = 0;
var deleteList = [];
var desc, asc;
var Stock_chose;
var myChart1, BeforeEditList = [], AfterEditList = [];
var addStock = 0;
var changeFirst = 1;
$(function () {
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        jpushEffect();
        ClearGoback();
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
            // document.getElementById('fore').addEventListener("touchstart", touchFore, false);
            document.getElementById('opp').addEventListener("touchstart", touchOpp, false);
            document.getElementById('imf').addEventListener("touchstart", touchImf, false);
            Touch();
            db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
                db.transaction(function (tx) {
                    SelectUser(tx);
                    keytouch();
                }, function (err) {
                    //alert('Open database my.db ERROR1: ' + err.message);
                });
            });
        }, 200);
    };

})

function Touch() {

    // var PinYin = ziTopin(' 中华人民共和国啦啦啦j');
    // for (var i = 0; i < PinYin.length; i++) {
    //     alert(PinYin[i]);
    // }

    //自选股  编辑
    document.getElementById('chose_edit').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (EditAble) {
            BeforeEditList = [];
            EditAble = 0;
            $(this).html('完成');
            $('#chose_content,#chose_scroll,#footer').addClass('Page');
            $('#chose_editBox,#chose_footer').removeClass('Page');
            if ($('#chose_stockTitle').hasClass('chose_titleClicked')) {
                $('#stock_edit').removeClass('Page');
                $('#stock_edit').find('tr').each(function (i) {
                    BeforeEditList.push($(this).find('.hidden').val());
                });
            }
            else if ($('#chose_topicTitle').hasClass('chose_titleClicked')) {
                $('#topic_edit').removeClass('Page');
                $('#topic_edit').find('tr').each(function (i) {
                    BeforeEditList.push($(this).find('.hidden').val());
                });
            }
        }
        else {
            EditAble = 1;
            $(this).html('编辑');
            $('#chose_content,#chose_scroll,#footer').removeClass('Page');
            $('#chose_editBox,#stock_edit,#topic_edit,#chose_footer').addClass('Page');
            $('#choseAll').attr('src', 'images/unchose.png');
            //点完成的时候清空选择的选项
            var $choseStock_img = $('#stock_edit').find('.chose_unchose');
            var $choseTopic_img = $('#topic_edit').find('.chose_unchose');
            $choseStock_img.each(function (i) {
                $(this).attr('src', 'images/unchose.png');
            })
            $choseTopic_img.each(function (i) {
                $(this).attr('src', 'images/unchose.png');
            })
            //点完成的时候向后台反馈更新排序
            if ($('#chose_stockTitle').hasClass("chose_titleClicked")) {
                var queneIDS = [];
                $('#stock_edit').find('tr').each(function (i) {
                    queneIDS.push($(this).find('.hidden').val());
                })
                if (BeforeEditList.toString() != queneIDS.toString()) {
                    httpGet('Reader/UpdateUserStocks?userID=' + UserID + '&type=0&queneIDS=' + queneIDS + '&deletedIDS=' + deleteList, '', true, ajax_success7, ajax_fail7);
                    function ajax_success7(obj) {
                        if (obj != null && obj != "" && obj != undefined && obj == true) {
                            deleteList = [];
                            choseNumber = 0;
                            $('#choseNumber').html('(0)');
                        }
                    }
                    function ajax_fail7() {
                        deleteList = [];
                        choseNumber = 0;
                        $('#choseNumber').html('(0)');
                    }
                }
                else {
                    deleteList = [];
                    choseNumber = 0;
                    $('#choseNumber').html('(0)');
                }
            }
            else if ($('#chose_topicTitle').hasClass('chose_titleClicked')) {
                var queneIDS = [];
                $('#topic_edit').find('tr').each(function (i) {
                    queneIDS.push($(this).find('.hidden').val());
                })
                if (BeforeEditList.toString() != queneIDS.toString()) {
                    httpGet('Reader/UpdateUserStocks?userID=' + UserID + '&type=1&queneIDS=' + queneIDS + '&deletedIDS=' + deleteList, '', true, ajax_success8, ajax_fail8);
                    function ajax_success8(obj) {
                        if (obj != null && obj != "" && obj != undefined && obj == true) {
                            deleteList = [];
                            choseNumber = 0;
                            $('#choseNumber').html('(0)');
                        }
                    }
                    function ajax_fail8() {
                        deleteList = [];
                        choseNumber = 0;
                        $('#choseNumber').html('(0)');
                    }
                }
                else {
                    deleteList = [];
                    choseNumber = 0;
                    $('#choseNumber').html('(0)');
                }
            }
        }
    })
    //刷新
    document.getElementById('refresh-button').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        ClearChoseAction();
        window.location.reload();
    }, false)
    //搜索
    document.getElementById('search-button').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('#my_chose').addClass('Page');
        $('#my_search').removeClass('Page');
        $('#searchR_ul').empty();
    }, false)
    //关闭搜索
    document.getElementById('close_search').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('#my_search').addClass('Page');
        $('#my_chose').removeClass('Page');
        if (addStock == 1) {
            bind_info();
            addStock = 0;
        }
        document.activeElement.blur();//隐藏软键盘
    }, false)
    //自选股个股点击
    document.getElementById('chose_stockTitle').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (EditAble) {
            if (!$(this).hasClass("chose_titleClicked")) {
                $(this).addClass("chose_titleClicked");
                $(this).siblings().removeClass("chose_titleClicked");
                $('#chose_stock').removeClass('Page');
                $('#chose_topic').addClass('Page');
            }
        }
    })
    //自选股主题点击
    document.getElementById('chose_topicTitle').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (EditAble) {
            if (!$(this).hasClass("chose_titleClicked")) {
                $(this).addClass("chose_titleClicked");
                $(this).siblings().removeClass("chose_titleClicked");
                $('#chose_topic').removeClass('Page');
                $('#chose_stock').addClass('Page');
            }
        }
    })
    //个股的价格排序
    document.getElementById('stock_price').addEventListener('touchstart', Order, false);
    //个股价格涨跌幅排序
    document.getElementById('stock_pricePrent').addEventListener('touchstart', Order, false);
    //主题价格排序
    document.getElementById('topic_price').addEventListener('touchstart', Order, false);
    //主题价格涨跌幅排序
    document.getElementById('topic_pricePrent').addEventListener('touchstart', Order, false);
    function Order(event) {
        event.preventDefault();
        event.stopPropagation();
        if ($(this).find('.chose_sortImg').attr("src") == "images/chose_down.png") {
            $(this).find('.chose_sortImg').attr("src", "images/chose_up.png");
            $('#' + $(this).attr("id") + 'Up').removeClass('Page');
            $('#' + $(this).attr("id") + 'Up').siblings().addClass('Page');
        }
        else if ($(this).find('.chose_sortImg').attr("src") == "images/chose_normal.png" || $(this).find('.chose_sortImg').attr("src") == "images/chose_up.png") {
            $(this).find('.chose_sortImg').attr("src", "images/chose_down.png");
            $('#' + $(this).attr("id") + 'Down').removeClass('Page');
            $('#' + $(this).attr("id") + 'Down').siblings().addClass('Page');
        }
    }
    //指数的选择
    document.getElementById('chose_SH').addEventListener('touchstart', ChartOrder, false);
    document.getElementById('chose_SZ').addEventListener('touchstart', ChartOrder, false);
    document.getElementById('chose_CY').addEventListener('touchstart', ChartOrder, false);
    function ChartOrder(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!$(this).hasClass('chose_clicked')) {
            $(this).addClass("Page").addClass('chose_clicked');
            $(this).siblings().removeClass('Page').removeClass('chose_clicked');
            $('#' + $(this).attr("id") + 'point').removeClass('Page');
            $('#' + $(this).attr("id") + 'point').siblings().addClass('Page');
            if ($(this).attr("id") == "chose_SH") {
                K_type = "A";
                A_TicktimeData = [], A_TradeData = [];
                iNowString = Date.parse(new Date());
                var date = new Date();
                iNow = Date.parse(new Date()) / 1000;
                iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
                //分时的价格指数和成交金额
                StockHistoryType = 2;
                openDaysCount = 2;
                echarts_loading();
                OPendays_k();
                stockId = 'sh000001'
            }
            else if ($(this).attr("id") == "chose_SZ") {
                K_type = "B";
                B_TicktimeData = [], B_TradeData = [];
                iNowString = Date.parse(new Date());
                var date = new Date();
                iNow = Date.parse(new Date()) / 1000;
                iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
                //分时的价格指数和成交金额
                StockHistoryType = 2;
                openDaysCount = 2;
                echarts_loading();
                OPendays_k();
                stockId = 'sz399001'
            }
            else if ($(this).attr("id") == "chose_CY") {
                K_type = "C";
                C_TicktimeData = [], C_TradeData = [];
                iNowString = Date.parse(new Date());
                var date = new Date();
                iNow = Date.parse(new Date()) / 1000;
                iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
                //分时的价格指数和成交金额
                StockHistoryType = 2;
                openDaysCount = 2;
                echarts_loading();
                OPendays_k();
                stockId = 'sz399006'
            }
        }
    }
    //全选的点击
    document.getElementById('choseAll').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('#chose_stockTitle').hasClass('chose_titleClicked')) {
            var $choseStock_img = $('#stock_edit').find('.chose_unchose');
            if ($(this).hasClass('chose_allClick')) {
                $(this).removeClass('chose_allClick').attr('src', 'images/unchose.png')
                $choseStock_img.each(function (i) {
                    $(this).attr('src', 'images/unchose.png');
                })
                choseNumber = 0;
                $('#choseNumber').html('(0)');
            }
            else {
                $(this).addClass('chose_allClick').attr('src', 'images/chosed.png');
                $choseStock_img.each(function (i) {
                    $(this).attr('src', 'images/chosed.png');
                })
                choseNumber = $choseStock_img.length;
                $('#choseNumber').html('(' + choseNumber + ')');
            }
        }
        else if ($('#chose_topicTitle').hasClass('chose_titleClicked')) {
            var $choseTopic_img = $('#topic_edit').find('.chose_unchose');
            if ($(this).hasClass('chose_allClick')) {
                $(this).removeClass('chose_allClick').attr('src', 'images/unchose.png');
                $choseTopic_img.each(function (i) {
                    $(this).attr('src', 'images/unchose.png');
                })
                choseNumber = 0;
                $('#choseNumber').html('(0)');
            }
            else {
                $(this).addClass('chose_allClick').attr('src', 'images/chosed.png');
                $choseTopic_img.each(function (i) {
                    $(this).attr('src', 'images/chosed.png');
                })
                choseNumber = $choseTopic_img.length;
                $('#choseNumber').html('(' + choseNumber + ')');
            }
        }
    }, false)
    //删除自选股的点击
    document.getElementById('deleteChose').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('#chose_stockTitle').hasClass('chose_titleClicked')) {
            var $choseStock_img = $('#stock_edit').find('.chose_unchose');
            $choseStock_img.each(function (i) {
                if ($(this).attr('src') == 'images/chosed.png') {
                    deleteList.push([$(this).parents('tr').find('.hidden').val()]);
                }
            })
            db.transaction(function (tx) {
                for (var i = 0; i < deleteList.length; i++) {
                    tx.executeSql('delete from Chose_stock_' + UserStatus + '  where Symbol =?', [deleteList[i]], function (tx, res) {
                    });
                    $('#Edit_' + deleteList[i]).remove();
                    $('#Stock_' + deleteList[i]).remove();
                    $('#stock_priceUp_' + deleteList[i]).remove();
                    $('#stock_priceDown_' + deleteList[i]).remove();
                    $('#stock_pricePrentUp_' + deleteList[i]).remove();
                    $('#stock_pricePrentDown_' + deleteList[i]).remove();
                }
            }, function (e) {
                //alert("update_co1ERROR: " + e.message);
            });
        }
        else if ($('#chose_topicTitle').hasClass('chose_titleClicked')) {
            var $choseTopic_img = $('#topic_edit').find('.chose_unchose');
            $choseTopic_img.each(function (i) {
                if ($(this).attr('src') == 'images/chosed.png') {
                    deleteList.push([$(this).parents('tr').find('.hidden').val()]);
                }
            })
            db.transaction(function (tx) {
                for (var i = 0; i < deleteList.length; i++) {
                    tx.executeSql('delete from Chose_block_' + UserStatus + '  where ID =?', [deleteList[i]], function (tx, res) {
                    });
                    $('#Edit_' + deleteList[i]).remove();
                    $('#Topic_' + deleteList[i]).remove();
                    $('#topic_priceUp_' + deleteList[i]).remove();
                    $('#topic_priceDown_' + deleteList[i]).remove();
                    $('#topic_pricePrentUp_' + deleteList[i]).remove();
                    $('#topic_pricePrentDown_' + deleteList[i]).remove();
                }

                tx.executeSql('select * from Chose_block_' + UserStatus, [], function (tx, res) {
                    // for (var j = 0; j < res.rows.length; j++) {
                    //     alert(res.rows.item(j).ID);
                    // }
                });
            }, function (e) {
                //alert("update_co1ERROR: " + e.message);
            });
        }
        choseNumber = 0;
        $('#choseNumber').html('(0)');
    }, false)
    //隐藏软键盘
    $(document).on('touchstart', function (e) {
        if (!$(e.target).is('#search_input') && $('#search_input').is(':focus')) {
            document.activeElement.blur();
        }
    });
}
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
function bind_info() {
    if (panduan(sessionStorage.C_TitleType) && panduan(sessionStorage.C_TitleNum) && panduan(sessionStorage.C_stockPImg) && panduan(sessionStorage.C_stockPpImg) && panduan(sessionStorage.C_topicPImg) && panduan(sessionStorage.C_topicPpImg)) {
        var Stype = sessionStorage.C_TitleType;
        var Snum = sessionStorage.C_TitleNum;
        $('#' + Stype.substring(0, 11)).removeClass('Page');
        $('#' + Stype.substring(0, 11)).siblings().addClass('Page');
        $('#' + Stype).addClass('chose_titleClicked');
        $('#' + Stype).siblings().removeClass('chose_titleClicked');
        $('#' + Snum).removeClass('Page');
        $('#' + Snum).siblings().addClass('Page');
        // alert(Snum.substring(Snum.length - 2, Snum.length));
        // alert(Stype + '_pricePrentDown');
        var ImgType = Snum.substring(0, 5);

        $('#stock_price').find('.chose_sortImg').attr('src', sessionStorage.C_stockPImg);
        $('#stock_pricePrent').find('.chose_sortImg').attr('src', sessionStorage.C_stockPpImg);
        $('#topic_price').find('.chose_sortImg').attr('src', sessionStorage.C_topicPImg);
        $('#topic_pricePrent').find('.chose_sortImg').attr('src', sessionStorage.C_topicPpImg);

    }
    httpGet("Reader/GetUserStocks?userID=" + UserID, "", true, ajax_success1, ajax_fail1);
    function ajax_success1(obj) {
        $("#my-index").removeClass('Page');
        $("#loading").addClass('Page');
        db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS Chose_stock_' + UserStatus);//删除自选股表
            tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_stock_' + UserStatus + '  (Symbol text,UNIQUE(Symbol))');//记录用户的自选股
        }, function (e) {
            //alert("itemListInAndSe3ERROR: " + e.message);
        });
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                $('#chose_stock .chose_stockW').removeClass('Page');
                $('#chose_stock .chose_stockNo').addClass('Page')
                $('#stock_Normal,#stock_edit_tbody').html('');
                db.transaction(function (tx) {
                    for (var i = 0; i < obj.length; i++) {
                        tx.executeSql('replace INTO Chose_stock_' + UserStatus + ' (Symbol) VALUES(?)', [obj[i].Symbol], function (tx, res) {
                        });
                        var priceColor = "";
                        var openColor = "";
                        var highColor = "";
                        var lowColor = "";
                        var Changepercent = "";
                        if (obj[i].Pricechange > 0) {
                            priceColor = "stock_point_red";
                            Changepercent = "+" + obj[i].Changepercent.toFixed(2) + '%';
                        }
                        else if (obj[i].Pricechange < 0) {
                            priceColor = "stock_point_green";
                            Changepercent = obj[i].Changepercent.toFixed(2) + '%';
                        }
                        else {
                            Changepercent = obj[i].Changepercent.toFixed(2) + '%';
                        }
                        if (obj[i].Open < obj[i].Settlement) {
                            openColor = "stock_point_green";
                        }
                        else if (obj[i].Open > obj[i].Settlement) {
                            openColor = "stock_point_red";
                        }
                        if (obj[i].High < obj[i].Settlement) {
                            highColor = "stock_point_green";
                        }
                        else if (obj[i].High > obj[i].Settlement) {
                            highColor = "stock_point_red";
                        }
                        if (obj[i].Low < obj[i].Settlement) {
                            lowColor = "stock_point_green";
                        }
                        else if (obj[i].Low > obj[i].Settlement) {
                            lowColor = "stock_point_red";
                        }
                        if (obj[i].BlockID == '' || obj[i].BlockID == null || obj[i].BlockID == 'null') {
                            var BlockName = '--';
                        }
                        else {
                            var BlockName = obj[i].BlockID;
                        }
                        $('#stock_Normal').append('<tr id="Stock_' + obj[i].Symbol + '"><td><input type="hidden" class="hidden" value="' + obj[i].Symbol + '"/><span class="chose_stockName">' + obj[i].Name + '</span><br><span class="chose_stockCode">' + obj[i].Code + '</span></td><td><span>' + obj[i].Trade + '</span></td><td><span class="' + priceColor + '">' + Changepercent + '</span></td><td><span class="' + priceColor + '">' + obj[i].Pricechange.toFixed(2) + '</span></td><td><span>' + BlockName + '</span></td><td><span>' + obj[i].Volume.toFixed(2) + '</span></td><td><span>' + obj[i].TransferRate.toFixed(2) + '%</span></td><td><span>' + obj[i].VolumeRatio.toFixed(2) + '</span></td><td><span  class="' + openColor + '">' + obj[i].Open + '</span></td><td><span>' + obj[i].Settlement + '</span></td><td><span class="' + highColor + '">' + obj[i].High + '</span></td><td><span class="' + lowColor + '">' + obj[i].Low + '</span></td></tr>');
                        // 个股的编辑
                        $('#stock_edit_tbody').append('<tr id="Edit_' + obj[i].Symbol + '"><td><input type="hidden" class="hidden" value="' + obj[i].Symbol + '"/><img id="chose_unchose_' + obj[i].Symbol + '" class="chose_unchose" src="images/unchose.png"/><span class="chose_stockName">' + obj[i].Name + '</span><br><span class="chose_stockCode">' + obj[i].Code + '</span></td><td><img id="chose_gotop_' + obj[i].Symbol + '" class="chose_gotop" src="images/gotop.png"/></td><td><img class="chose_move" src="images/move.png"/></td></tr>');
                        bind_SclickList('Stock_' + obj[i].Symbol, obj[i].Symbol);
                        bind_indexlist('chose_gotop_' + obj[i].Symbol);
                        bind_indexlist1('chose_unchose_' + obj[i].Symbol);
                    }
                    sortJson('Trade');
                    var PriceAsc = obj.sort(asc);
                    bind_Stocklist(PriceAsc, 'stock_priceUp');
                    var PriceDesc = obj.sort(desc);
                    bind_Stocklist(PriceDesc, 'stock_priceDown');
                    sortJson('Changepercent');
                    var percentAsc = obj.sort(asc);
                    bind_Stocklist(percentAsc, 'stock_pricePrentUp');
                    var percentdDesc = obj.sort(desc);
                    bind_Stocklist(percentdDesc, 'stock_pricePrentDown');
                    sortable_stock();
                }, function (e) {
                    //alert("itemListInAndSe3ERROR: " + e.message);
                });
            }
            else {
                $('#chose_stock .chose_stockW').addClass('Page');
                $('#chose_stock .chose_stockNo').removeClass('Page')
            }
        }
        else {
            $('#chose_stock .chose_stockW').addClass('Page');
            $('#chose_stock .chose_stockNo').removeClass('Page')
        }
        
    }
    function ajax_fail1(obj) {
        $("#loading").remove();
        $("#my_chose").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        $("#refesh").bind("click", function (event) {
            $('#refesh').remove();
            $("#my_chose").append('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
            setTimeout(function () {
                $("#refesh").remove();
                bind_info();
            }, 1000);
        })
    }
    httpGet("Reader/GetUserBlocks?userID=" + UserID, "", true, ajax_success2, ajax_fail2);
    function ajax_success2(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (obj.length > 0) {
                $('#chose_topic .chose_topicW').removeClass('Page');
                $('#chose_topic .chose_topicNo').addClass('Page')
                $('#topic_Normal,#topic_edit_tbody').html('');
                db.transaction(function (tx) {
                    tx.executeSql('DROP TABLE IF EXISTS Chose_block_' + UserStatus);//删除自选股表
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Chose_block_' + UserStatus + '  (ID text,UNIQUE(ID))');//记录用户的自选股
                    for (var i = 0; i < obj.length; i++) {
                        tx.executeSql('replace INTO Chose_block_' + UserStatus + ' (ID) VALUES(?)', [obj[i].ID], function (tx, res) {
                            // alert("添加成功");
                        });
                        var priceColor = "";
                        var openColor = "";
                        var highColor = "";
                        var lowColor = "";
                        var ChangePercent = "";
                        var AvgPrice = "";
                        if (obj[i].PriceChange > 0) {
                            priceColor = "stock_point_red";
                            ChangePercent = "+" + obj[i].ChangePercent.toFixed(2) + '%';
                        }
                        else if (obj[i].PriceChange < 0) {
                            priceColor = "stock_point_green";
                            ChangePercent = obj[i].ChangePercent.toFixed(2) + '%';
                        }
                        else {
                            ChangePercent = obj[i].ChangePercent.toFixed(2) + '%';
                        }
                        if (obj[i].Open < obj[i].Settlement) {
                            openColor = "stock_point_green";
                        }
                        else if (obj[i].Open > obj[i].Settlement) {
                            openColor = "stock_point_red";
                        }
                        if (obj[i].High < obj[i].Settlement) {
                            highColor = "stock_point_green";
                        }
                        else if (obj[i].High > obj[i].Settlement) {
                            highColor = "stock_point_red";
                        }
                        if (obj[i].Low < obj[i].Settlement) {
                            lowColor = "stock_point_green";
                        }
                        else if (obj[i].Low > obj[i].Settlement) {
                            lowColor = "stock_point_red";
                        }
                        if (obj[i].FSName == '' || obj[i].FSName == null || obj[i].FSName == 'null') {
                            FSName = '--';
                        }
                        else {
                            FSName = obj[i].FSName;
                        }
                        if (obj[i].AvgPrice != NaN && obj[i].AvgPrice != "NaN") {
                            AvgPrice = obj[i].AvgPrice.toFixed(2);
                            PriceChange = obj[i].PriceChange.toFixed(2);
                            Open = obj[i].Open.toFixed(2);
                            Settlement = obj[i].Settlement.toFixed(2);
                            High = obj[i].High.toFixed(2);
                            Low = obj[i].Low.toFixed(2)
                        }
                        else {
                            AvgPrice = "--";
                            PriceChange = "--";
                            Open = "--";
                            Settlement = "--";
                            High = "--";
                            Low = "--";
                        }
                        $('#topic_Normal').append('<tr id="Topic_' + obj[i].ID + '"><td><input type="hidden" class="hidden" value="' + obj[i].ID + '"/><span class="chose_stockName">' + obj[i].Name + '</span></td><td><span>' + AvgPrice + '</span></td><td><span class="' + priceColor + '">' + ChangePercent + '</span></td><td><span class="' + priceColor + '">' + PriceChange + '</span></td><td><span>' + FSName + '</span></td><td><span>' + obj[i].Volumn.toFixed(2) + '</span></td><td><span  class="' + openColor + '">' + Open + '</span></td><td><span>' + Settlement + '</span></td><td><span class="' + highColor + '">' + High + '</span></td><td><span class="' + lowColor + '">' + Low + '</span></td></tr>');
                        // 主题的编辑
                        $('#topic_edit_tbody').append('<tr id="Edit_' + obj[i].ID + '"><td><input type="hidden" class="hidden" value="' + obj[i].ID + '"/><img id="chose_unchose_' + obj[i].ID + '" class="chose_unchose" src="images/unchose.png"/><span class="chose_stockName">' + obj[i].Name + '</span></td><td><img id="chose_gotop_' + obj[i].ID + '" class="chose_gotop" src="images/gotop.png"/></td><td><img class="chose_move" src="images/move.png"/></td></tr>');
                        bind_TclickList('Topic_' + obj[i].ID, obj[i].ID);
                        bind_indexlist('chose_gotop_' + obj[i].ID);
                        bind_indexlist1('chose_unchose_' + obj[i].ID);
                    }
                    sortJson('AvgPrice');
                    var AvgPriceAsc = obj.sort(asc);
                    bind_Topiclist(AvgPriceAsc, 'topic_priceUp');
                    var AvgPriceDesc = obj.sort(desc);
                    bind_Topiclist(AvgPriceDesc, 'topic_priceDown');
                    sortJson('ChangePercent');
                    var percentAsc = obj.sort(asc);
                    bind_Topiclist(percentAsc, 'topic_pricePrentUp');
                    var percentdDesc = obj.sort(desc);
                    bind_Topiclist(percentdDesc, 'topic_pricePrentDown');
                    sortable_topic();
                }, function (e) {
                    //alert("itemListInAndSe3ERROR: " + e.message);
                });
            }
            else {
                $('#chose_topic .chose_topicW').addClass('Page');
                $('#chose_topic .chose_topicNo').removeClass('Page')
            }
        }
        else {
            $('#chose_topic .chose_topicW').addClass('Page');
            $('#chose_topic .chose_topicNo').removeClass('Page')
        }
    }
    function ajax_fail2(obj) {

    }

    //第一次初始化图表
    Inteval_K();
    //计时器5秒刷新一次,重复刷新数据
    if (time_range('09:30', '15:00')) {
        // alert('在时间范围内');
        window.setInterval("changeFirst=0;Inteval_K()", 5000);
    }
}
//手机键盘的搜索
function keytouch() {
    $('#search_input').on('keyup', function (e) {
        var theEvent = e || window.event;
        var keyPressed = theEvent.keyCode || theEvent.which;
        if (this.value.length >= 2) {
            $('#searchR_ul').html('');
            $('#searchIng').removeClass('Page');
            var searchValue = this.value;
            db.transaction(function (tx) {
                tx.executeSql('select * from All_stock where SearchSSN LIKE ?', ['%' + searchValue + '%'], function (tx, res) {
                    if (res != null && res.rows != null && res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            var obj = res.rows.item(i);
                            $('#searchR_ul').append('<li id="search_' + obj.Symbol + '" class="searchR_li"><input type="hidden" class="hidden" value="' + obj.Symbol + '"/><span><span class="searchR_code">' + obj.StockID + '</span><span>' + obj.Name + '</span></span><span class="float-right"><img id="add_' + obj.Symbol + '" src="images/search_add.png"/></span></li>');
                            bind_indexlist2('search_' + obj.Symbol);
                            bind_indexlist3('add_' + obj.Symbol);
                            tx.executeSql('select * from Chose_stock_' + UserStatus + ' where Symbol=?', [obj.Symbol], function (tx, res) {
                                if (res != null && res.rows != null) {
                                    if (res.rows.length > 0) {
                                        $('#add_' + res.rows.item(0).Symbol).attr('src', 'images/search_added.png');
                                    }
                                }
                            });
                        }
                    }
                    else {
                        $('#searchR_ul').append('<li class="searchR_li"><div style="width:100%;text-align:center">没有相关股票</div></li>');
                    }
                });
            }, function (e) {
                alert("股票查询通配符ERROR: " + e.message);
            });
        }
        return true;
    });
}
//获取股票的排序
function bind_Stocklist(obj, appenId) {
    $('#' + appenId).html('');
    for (var i = 0; i < obj.length; i++) {
        var priceColor = "";
        var openColor = "";
        var highColor = "";
        var lowColor = "";
        var Changepercent = "";
        if (obj[i].Pricechange > 0) {
            priceColor = "stock_point_red";
            Changepercent = "+" + obj[i].Changepercent.toFixed(2) + '%';
        }
        else if (obj[i].Pricechange < 0) {
            priceColor = "stock_point_green";
            Changepercent = obj[i].Changepercent.toFixed(2) + '%';
        }
        else {
            Changepercent = obj[i].Changepercent.toFixed(2) + '%';
        }
        if (obj[i].Open < obj[i].Settlement) {
            openColor = "stock_point_green";
        }
        else if (obj[i].Open > obj[i].Settlement) {
            openColor = "stock_point_red";
        }
        if (obj[i].High < obj[i].Settlement) {
            highColor = "stock_point_green";
        }
        else if (obj[i].High > obj[i].Settlement) {
            highColor = "stock_point_red";
        }
        if (obj[i].Low < obj[i].Settlement) {
            lowColor = "stock_point_green";
        }
        else if (obj[i].Low > obj[i].Settlement) {
            lowColor = "stock_point_red";
        }
        if (obj[i].BlockID == '' || obj[i].BlockID == null || obj[i].BlockID == 'null') {
            var BlockName = '--';
        }
        else {
            var BlockName = obj[i].BlockID;
        }
        $('#' + appenId).append('<tr id="' + appenId + '_' + obj[i].Symbol + '"><td><input type="hidden" class="hidden" value="' + obj[i].Symbol + '"/><span class="chose_stockName">' + obj[i].Name + '</span><br><span class="chose_stockCode">' + obj[i].Code + '</span></td><td><span>' + obj[i].Trade + '</span></td><td><span class="' + priceColor + '">' + Changepercent + '</span></td><td><span class="' + priceColor + '">' + obj[i].Pricechange.toFixed(2) + '</span></td><td><span>' + BlockName + '</span></td><td><span>' + obj[i].Volume.toFixed(2) + '</span></td><td><span>' + obj[i].TransferRate.toFixed(2) + '%</span></td><td><span>' + obj[i].VolumeRatio.toFixed(2) + '</span></td><td><span  class="' + openColor + '">' + obj[i].Open + '</span></td><td><span>' + obj[i].Settlement + '</span></td><td><span class="' + highColor + '">' + obj[i].High + '</span></td><td><span class="' + lowColor + '">' + obj[i].Low + '</span></td></tr>');
        bind_SclickList(appenId + '_' + obj[i].Symbol, obj[i].Symbol);
    }
}
//获取主题的排序
function bind_Topiclist(obj, appenId) {
    $('#' + appenId).html('');
    for (var i = 0; i < obj.length; i++) {
        var priceColor = "";
        var openColor = "";
        var highColor = "";
        var lowColor = "";
        var ChangePercent = "";
        if (obj[i].PriceChange > 0) {
            priceColor = "stock_point_red";
            ChangePercent = "+" + obj[i].ChangePercent.toFixed(2) + '%';
        }
        else if (obj[i].PriceChange < 0) {
            priceColor = "stock_point_green";
            ChangePercent = obj[i].ChangePercent.toFixed(2) + '%';
        }
        else {
            ChangePercent = obj[i].ChangePercent.toFixed(2) + '%';
        }
        if (obj[i].Open < obj[i].Settlement) {
            openColor = "stock_point_green";
        }
        else if (obj[i].Open > obj[i].Settlement) {
            openColor = "stock_point_red";
        }
        if (obj[i].High < obj[i].Settlement) {
            highColor = "stock_point_green";
        }
        else if (obj[i].High > obj[i].Settlement) {
            highColor = "stock_point_red";
        }
        if (obj[i].Low < obj[i].Settlement) {
            lowColor = "stock_point_green";
        }
        else if (obj[i].Low > obj[i].Settlement) {
            lowColor = "stock_point_red";
        }
        if (obj[i].FSName == '' || obj[i].FSName == null || obj[i].FSName == 'null') {
            FSName = '--';
        }
        else {
            FSName = obj[i].FSName;
        }
        if (obj[i].AvgPrice != NaN && obj[i].AvgPrice != "NaN") {
            AvgPrice = obj[i].AvgPrice.toFixed(2);
            PriceChange = obj[i].PriceChange.toFixed(2);
            Open = obj[i].Open.toFixed(2);
            Settlement = obj[i].Settlement.toFixed(2);
            High = obj[i].High.toFixed(2);
            Low = obj[i].Low.toFixed(2)
        }
        else {
            AvgPrice = "--";
            PriceChange = "--";
            Open = "--";
            Settlement = "--";
            High = "--";
            Low = "--";
        }
        $('#' + appenId).append('<tr id="' + appenId + '_' + obj[i].ID + '"><td><input type="hidden" class="hidden" value="' + obj[i].ID + '"/><span class="chose_stockName">' + obj[i].Name + '</span></td><td><span>' + AvgPrice + '</span></td><td><span class="' + priceColor + '">' + ChangePercent + '</span></td><td><span class="' + priceColor + '">' + PriceChange + '</span></td><td><span>' + FSName + '</span></td><td><span>' + obj[i].Volumn.toFixed(2) + '</span></td><td><span  class="' + openColor + '">' + Open + '</span></td><td><span>' + Settlement + '</span></td><td><span class="' + highColor + '">' + High + '</span></td><td><span class="' + lowColor + '">' + Low + '</span></td></tr>');
        bind_TclickList(appenId + '_' + obj[i].ID, obj[i].ID);
    }
}
//股票的点击
function bind_SclickList(id, stockid) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        ChoseAction();
        AddGoback('myChose.html', 'stock.html?stockId=' + stockid);
        // slideQuick('left', 'lightblue', 1, 'stock.html?stockId=' + stockid + '&fromPage=myChose');
    })
}
//主题的点击
function bind_TclickList(id, topicid) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        ChoseAction();
        AddGoback('myChose.html', 'opportunityPage3o1_TopicDetails.html?itemId=' + topicid);
    })
}

function Inteval_K() {
    //分时K线图
    iNowString = Date.parse(new Date());
    var date = new Date();
    iNow = Date.parse(new Date()) / 1000;
    iFromString = (iNow - (iNow + 8 * 3600) % 86400) * 1000;
    //分时的价格指数和成交金额
    StockHistoryType = 2;
    openDaysCount = 2;
    if ($('#chose_SH').hasClass('chose_clicked')) {
        K_type = "A", stockId = "sh000001";
        A_TicktimeData = [], A_TradeData = [];
        // echarts_loading();
        OPendays_k('A');
    }
    else if ($('#chose_SZ').hasClass('chose_clicked')) {
        K_type = "B", stockId = "sz399001";
        B_TicktimeData = [], B_TradeData = [];
        // echarts_loading();
        OPendays_k('B');
    }
    else if ($('#chose_CY').hasClass('chose_clicked')) {
        K_type = "C", stockId = "sz399006";
        C_TicktimeData = [], C_TradeData = [];
        // echarts_loading();  //图表的清空读取
        OPendays_k('C');
    }
}
//获取K线图交易日和K线图
function OPendays_k(K_choseType) {
    httpGet("Reader/GetStockOpendays?endTime=" + iNow + "&sortType=1&count=" + openDaysCount, "", true, ajax_success3, ajax_fail3);
    function ajax_success3(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            var date = new Date();
            // var date = new Date('2016-11-13 09:40');//测试数据
            var hour = date.getHours();
            var Minutes = date.getMinutes();
            //当前时间是交易日
            if (obj[0].substring(0, obj[0].indexOf("T")) == (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())) {
                if (hour < 9 || (hour == 9 && Minutes <= 15)) {
                    var datt = obj[1].substring(0, obj[1].indexOf("T")) + " 00:00:00";
                    var dat = obj[1].substring(0, obj[1].indexOf("T")) + " 23:59:59";
                    iNowString = getDateTimeStamp(dat);
                    iFromString = getDateTimeStamp(datt);
                    touch_K_echart();
                    if (K_choseType == 'A') {
                        touch_K_echart1("B", 'sz399001');
                        touch_K_echart1("C", 'sz399006');
                    }
                    else if (K_choseType == 'B') {
                        touch_K_echart1("A", 'sh000001');
                        touch_K_echart1("C", 'sz399006');
                    }
                    else if (K_choseType == 'C') {
                        touch_K_echart1("A", 'sh000001');
                        touch_K_echart1("B", 'sz399001');
                    }
                    // var datt = obj[obj.length - 1].substring(0, obj[obj.length - 1].indexOf("T")) + " 00:00:00";
                    // iFromString = getDateTimeStamp(datt);
                }
                else {
                    var datt = obj[0].substring(0, obj[0].indexOf("T")) + " 00:00:00";
                    var dat = obj[0].substring(0, obj[0].indexOf("T")) + " 23:59:59";
                    iNowString = getDateTimeStamp(dat);
                    iFromString = getDateTimeStamp(datt);
                    touch_K_echart();
                    if (K_choseType == 'A') {
                        touch_K_echart1("B", 'sz399001');
                        touch_K_echart1("C", 'sz399006');
                    }
                    else if (K_choseType == 'B') {
                        touch_K_echart1("A", 'sh000001');
                        touch_K_echart1("C", 'sz399006');
                    }
                    else if (K_choseType == 'C') {
                        touch_K_echart1("A", 'sh000001');
                        touch_K_echart1("B", 'sz399001');
                    }

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
                if (K_choseType == 'A') {
                    touch_K_echart1("B", 'sz399001');
                    touch_K_echart1("C", 'sz399006');
                }
                else if (K_choseType == 'B') {
                    touch_K_echart1("A", 'sh000001');
                    touch_K_echart1("C", 'sz399006');
                }
                else if (K_choseType == 'C') {
                    touch_K_echart1("A", 'sh000001');
                    touch_K_echart1("B", 'sz399001');
                }
            }
        }
    }
    function ajax_fail3() {
        click_able = true;
    }
}

function touch_K_echart() {
    httpGet("Reader/StockHistory?type=" + StockHistoryType + "&stockId=" + stockId + "&fromTime=" + iFromString + "&endTime=" + iNowString + "&count=" + Stockcount, "", true, ajax_success4, ajax_fail4);
    function ajax_success4(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                if (K_type == "A") {
                    A_TicktimeData.push(obj[i].Ticktime.substring(11, 16));
                    A_TradeData.push(obj[i].Trade);
                }
                else {
                    if (K_type == "B") {
                        B_TicktimeData.push(obj[i].Ticktime.substring(11, 16));
                        B_TradeData.push(obj[i].Trade);
                    }
                    else {
                        if (K_type == "C") {
                            C_TicktimeData.push(obj[i].Ticktime.substring(11, 16));
                            C_TradeData.push(obj[i].Trade);
                        }
                    }
                }
            }
            if (K_type == "A") {
                if (obj[obj.length - 1].Pricechange > 0) {
                    if (!changeFirst) {
                        jump_backColor('jump_leftPoint', '#FDA4AB');
                    }
                    $('#SH_Trade,#SH_TradeChange').addClass('stock_point_red');
                    $('#chose_SH').find('.chose_ChartPoint').addClass('stock_point_red');
                    $('#SH_TradeChange').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    $('#chose_SH').find('.chose_ChartPoint').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                }
                else {
                    if (!changeFirst) {
                        jump_backColor('jump_leftPoint', '#8BE0AE');
                    }
                    $('#SH_Trade,#SH_TradeChange').addClass('stock_point_green');
                    $('#chose_SH').find('.chose_ChartPoint').addClass('stock_point_green');
                    $('#SH_TradeChange').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    $('#chose_SH').find('.chose_ChartPoint').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                }
                $('#SH_Trade').html(obj[obj.length - 1].Trade);
                K_echart(A_TicktimeData, A_TradeData);
            }
            else {
                if (K_type == "B") {
                    if (obj[obj.length - 1].Pricechange > 0) {
                        if (!changeFirst) {
                            jump_backColor('jump_leftPoint', '#FDA4AB');
                        }
                        $('#SZ_Trade,#SZ_TradeChange').addClass('stock_point_red');
                        $('#chose_SZ').find('.chose_ChartPoint').addClass('stock_point_red');
                        $('#SZ_TradeChange').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                        $('#chose_SZ').find('.chose_ChartPoint').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    }
                    else {
                        if (!changeFirst) {
                            jump_backColor('jump_leftPoint', '#8BE0AE');
                        }
                        $('#SZ_Trade,#SZ_TradeChange').addClass('stock_point_green');
                        $('#chose_SZ').find('.chose_ChartPoint').addClass('stock_point_green');
                        $('#SZ_TradeChange').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                        $('#chose_SZ').find('.chose_ChartPoint').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    }
                    $('#SZ_Trade').html(obj[obj.length - 1].Trade);
                    K_echart(B_TicktimeData, B_TradeData);
                }
                else {
                    if (K_type == "C") {
                        if (obj[obj.length - 1].Pricechange > 0) {
                            if (!changeFirst) {
                                jump_backColor('jump_leftPoint', '#FDA4AB');
                            }
                            $('#CY_Trade,#CY_TradeChange').addClass('stock_point_red');
                            $('#chose_CY').find('.chose_ChartPoint').addClass('stock_point_red');
                            $('#CY_TradeChange').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                            $('#chose_CY').find('.chose_ChartPoint').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                        }
                        else {
                            if (!changeFirst) {
                                jump_backColor('jump_leftPoint', '#8BE0AE');
                            }
                            $('#CY_Trade,#CY_TradeChange').addClass('stock_point_green');
                            $('#chose_CY').find('.chose_ChartPoint').addClass('stock_point_green');
                            $('#CY_TradeChange').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                            $('#chose_CY').find('.chose_ChartPoint').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                        }
                        $('#CY_Trade').html(obj[obj.length - 1].Trade);
                        K_echart(C_TicktimeData, C_TradeData);
                    }
                }
            }
        }
        else {
            K_echart('', '', '', '');
        }
    }
    function ajax_fail4() {
        click_able = true;
    }
}

function K_echart(TicktimeData, TradeData) {
    option1 = {
        tooltip: {
            show: false,
            trigger: 'axis',
            showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            // position: function ([x, y]) { return [x, 20] },
        },
        legend: {
            show: false,
            data: ['价格指数']
        },
        grid: {
            x: 0,
            y: 0,
            x2: 10,
            y2: 0,
            borderWidth: 0
            // borderColor: "#e5e5e5"
        },
        xAxis: [
            {
                type: 'category',
                position: 'bottom',
                boundaryGap: false,
                axisLabel: {
                    show: false
                },
                axisTick: { show: false, onGap: false },
                splitNumber: 6,
                splitLine:
                {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 0.5,
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
                splitNumber: 2,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 0.5,
                        type: 'solid'
                    }
                },
                boundaryGap: [0, 0],
                axisLabel: {
                    // margin: -10,
                    show: false
                },
                splitArea: { show: false },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: ['#e5e5e5'],
                        width: 0.5,
                        type: 'solid'
                    }
                }
            }
        ],
        series: [
            {
                name: '价格指数',
                type: 'line',
                itemStyle: { normal: { areaStyle: { type: 'default', color: '#DEE9FE' }, lineStyle: { color: '#378eff' } } },
                symbol: 'none',
                data: []
            }
        ]
    };
    if (TradeData == '') {
        $('#K_echart1').addClass('Page');
        $('#K_echart1_null').removeClass('Page');
    }
    else{
        $('#K_echart1').removeClass('Page');
        $('#K_echart1_null').addClass('Page');
    }
    myChart1 = echarts.init(document.getElementById('K_echart1'));
    option1.series[0].data = TradeData;
    myChart1.setOption(option1);
}

function echarts_loading() {
    myChart1.clear();
    myChart1.showLoading({
        text: '读取数据中...',    //loading话术
        effect: 'bar'
        // textStyle: {
        //     fontSize: 14
        // }
    });
}
//下面导航的点击事件（进入首页）
function touchImf(event) {
    event.preventDefault();
    event.stopPropagation();
    ChoseAction();
    slideQuick('right', 'lightblue', 1, 'indexNews.html?firstLoad=no');
}
//下面导航的点击事件(进入机会首页)
function touchOpp(event) {
    event.preventDefault();
    event.stopPropagation();
    ChoseAction();
    slideQuick('right', 'lightblue', 1, 'index.html?firstLoad=no');
}

//判断网址后面是否带参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//只获取最近的一个指数指标
function touch_K_echart1(pointType, pointsStockId) {
    var StockHistoryType1 = 4;
    httpGet("Reader/StockHistory?type=" + StockHistoryType1 + "&stockId=" + pointsStockId + "&fromTime=" + iFromString + "&endTime=" + iNowString + "&count=" + Stockcount, "", true, ajax_success6, ajax_fail6);
    function ajax_success6(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            if (pointType == "A") {
                if (obj[obj.length - 1].Pricechange > 0) {
                    if (!changeFirst) {
                        jump_backColor('jump_SH', '#FDA4AB');
                    }
                    $('#SH_Trade,#SH_TradeChange').addClass('stock_point_red');
                    $('#chose_SH').find('.chose_ChartPoint').addClass('stock_point_red');
                    $('#SH_TradeChange').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    $('#chose_SH').find('.chose_ChartPoint').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                }
                else {
                    if (!changeFirst) {
                        jump_backColor('jump_SH', '#8BE0AE');
                    }
                    $('#SH_Trade,#SH_TradeChange').addClass('stock_point_green');
                    $('#chose_SH').find('.chose_ChartPoint').addClass('stock_point_green');
                    $('#SH_TradeChange').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    $('#chose_SH').find('.chose_ChartPoint').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                }
                $('#SH_Trade').html(obj[obj.length - 1].Trade);
            }
            else if (pointType == "B") {
                if (obj[obj.length - 1].Pricechange > 0) {
                    if (!changeFirst) {
                        jump_backColor('jump_SZ', '#FDA4AB');
                    }
                    $('#SZ_Trade,#SZ_TradeChange').addClass('stock_point_red');
                    $('#chose_SZ').find('.chose_ChartPoint').addClass('stock_point_red');
                    $('#SZ_TradeChange').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    $('#chose_SZ').find('.chose_ChartPoint').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                }
                else {
                    if (!changeFirst) {
                        jump_backColor('jump_SZ', '#8BE0AE');
                    }
                    $('#SZ_Trade,#SZ_TradeChange').addClass('stock_point_green');
                    $('#chose_SZ').find('.chose_ChartPoint').addClass('stock_point_green');
                    $('#SZ_TradeChange').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    $('#chose_SZ').find('.chose_ChartPoint').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                }
                $('#SZ_Trade').html(obj[obj.length - 1].Trade);
            }
            else {
                if (pointType == "C") {
                    if (obj[obj.length - 1].Pricechange > 0) {
                        if (!changeFirst) {
                            jump_backColor('jump_CY', '#FDA4AB');
                        }
                        $('#CY_Trade,#CY_TradeChange').addClass('stock_point_red');
                        $('#chose_CY').find('.chose_ChartPoint').addClass('stock_point_red');
                        $('#CY_TradeChange').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                        $('#chose_CY').find('.chose_ChartPoint').html('+' + obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    }
                    else {
                        if (!changeFirst) {
                            jump_backColor('jump_CY', '#8BE0AE');
                        }
                        $('#CY_Trade,#CY_TradeChange').addClass('stock_point_green');
                        $('#chose_CY').find('.chose_ChartPoint').addClass('stock_point_green');
                        $('#CY_TradeChange').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                        $('#chose_CY').find('.chose_ChartPoint').html(obj[obj.length - 1].Changepercent.toFixed(2) + '%');
                    }
                    $('#CY_Trade').html(obj[obj.length - 1].Trade);
                }
            }
        }
        else {
        }
    }
    function ajax_fail6() {
        click_able = true;
    }
}
//置顶
function bind_indexlist(id) {
    document.getElementById(id).addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parents('tr').insertBefore($(this).parents('tr').siblings().eq(0));
        if ($('#chose_stockTitle').hasClass('chose_titleClicked')) {
            var choseId = $(this).parents('tr').find('.hidden').val();
            $('#Stock_' + choseId).insertBefore($('#stock_Normal tr').eq(0));
        }
        else if ($('#chose_topicTitle').hasClass('chose_titleClicked')) {
            var choseId = $(this).parents('tr').find('.hidden').val();
            $('#Topic_' + choseId).insertBefore($('#topic_Normal tr').eq(0));
        }
    })
    // $("#" + id).bind("click", function () {
    // })
}
//选择
function bind_indexlist1(id) {
    document.getElementById(id).addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($(this).attr('src') == 'images/unchose.png') {
            $(this).attr('src', 'images/chosed.png');
            // deleteList.push([$(this).parents('tr').find('.hidden').val()]);
            choseNumber++;
            $('#choseNumber').html('(' + choseNumber + ')');
        }
        else {
            $(this).attr('src', 'images/unchose.png');
            // removeArr(deleteList, $(this).parents('tr').find('.hidden').val());
            choseNumber--;
            $('#choseNumber').html('(' + choseNumber + ')');
        }
    })
    // $("#" + id).bind("click", function () {
    // })
}
//搜索列表结果的股票点击
function bind_indexlist2(id) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        var stockid = $(this).find('.hidden').val();
        ChoseAction();
        AddGoback('myChose.html', 'stock.html?stockId=' + stockid);
    })
    // document.getElementById(id).addEventListener('touchstart', function (event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     // slide('left', 'lightblue', 1, 'stock.html?stockId=' + stockid + '&fromPage=myChose');

    // })
}
//搜索股票列表加入自选
function bind_indexlist3(id) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        addStock = 1;
        if ($(this).attr('src') == 'images/search_add.png') {
            var stockid = $(this).parents('li').find('.hidden').val();
            httpGet("Reader/AddUserStocks/" + stockid + "?userID=" + UserID + "&type=0", "", true, ajax_success10, ajax_fail10);
            function ajax_success10(obj) {
                if (obj !== null && obj !== "" && obj !== undefined) {
                    if (obj == 0 || obj == 1) {
                        db.transaction(function (tx) {
                            tx.executeSql('replace INTO Chose_stock_' + UserStatus + ' (Symbol) VALUES(?)', [stockid], function (tx, res) {
                                $('#add_' + stockid).attr('src', 'images/search_added.png');
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
            function ajax_fail10() {
                window.plugins.toast.show("加入自选失败！", 500, "center");
            }
        }
        else {
            if ($(this).attr('src') == 'images/search_added.png') {
                var stockid = $(this).parents('li').find('.hidden').val();
                httpGet("Reader/DelUserStocks/" + stockid + "?userID=" + UserID + "&type=0", "", true, ajax_success11, ajax_fail11);
                function ajax_success11(obj) {
                    if (obj !== null && obj !== "" && obj !== undefined) {
                        if (obj == 0 || obj == 1) {
                            db.transaction(function (tx) {
                                tx.executeSql('delete from Chose_stock_' + UserStatus + ' where Symbol=?', [stockid], function (tx, res) {
                                    $('#add_' + stockid).attr('src', 'images/search_add.png');
                                });
                            }, function (e) {
                                //alert("update_ID1ERROR: " + e.message);
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
                function ajax_fail11() {
                    window.plugins.toast.show("取消自选失败！", 500, "center");
                }
            }
        }
    })
    // document.getElementById(id).addEventListener('touchstart', function (event) {
    //         event.preventDefault();
    //     })
}
//个股移动列表
function sortable_stock() {
    var stock_edit = document.getElementById("stock_edit_tbody");
    Sortable.create(stock_edit, {
        handle: '.chose_move',
        animation: 150,
        ghostClass: 'ghost',
        onEnd: function (/**Event*/evt) {
            // alert(evt.oldIndex);  // element's old index within parent
            // alert(evt.newIndex);  // element's new index within parent
            if (evt.oldIndex > evt.newIndex) {
                $('#stock_Normal tr').eq(evt.oldIndex).insertBefore($('#stock_Normal tr').eq(evt.newIndex));//移动编辑的个股列表后，常规列表排列跟着改变
            }
            else if (evt.oldIndex < evt.newIndex) {
                $('#stock_Normal tr').eq(evt.oldIndex).insertAfter($('#stock_Normal tr').eq(evt.newIndex));//移动编辑的个股列表后，常规列表排列跟着改变
            }
        }
    });
}
//主题移动列表
function sortable_topic() {
    var topic_edit = document.getElementById("topic_edit_tbody");
    Sortable.create(topic_edit, {
        handle: '.chose_move',
        animation: 150,
        ghostClass: 'ghost',
        onEnd: function (/**Event*/evt) {
            // alert(evt.oldIndex);  // element's old index within parent
            // alert(evt.newIndex);  // element's new index within parent
            if (evt.oldIndex > evt.newIndex) {
                $('#topic_Normal tr').eq(evt.oldIndex).insertBefore($('#topic_Normal tr').eq(evt.newIndex));//移动编辑的个股列表后，常规列表排列跟着改变
            }
            else if (evt.oldIndex < evt.newIndex) {
                $('#topic_Normal tr').eq(evt.oldIndex).insertAfter($('#topic_Normal tr').eq(evt.newIndex));//移动编辑的个股列表后，常规列表排列跟着改变
            }
        }
    });
}
//删除数组中某个元素
function removeArr(Arrlist, id) {
    for (var i = 0; i < Arrlist.length; i++) {
        if (Arrlist[i] == id) {
            Arrlist.splice(i, 1);
            break;
        }
    }
}
function sortJson(colId) {
    desc = function (x, y) {
        return (x[colId] < y[colId]) ? 1 : -1
    }
    //对json进行升序排序函数  
    asc = function (x, y) {
        return (x[colId] > y[colId]) ? 1 : -1
    }
}
//判断是否为空或不存在
// function panduan(obj) {
//     if (obj !== undefined && obj !== null && obj !== "null" && obj !== "") {
//         return 1;
//     }
//     else {
//         return 0;
//     }
// }
//记录自选的行为记录
function ChoseAction() {
    if ($('#chose_stockTitle').hasClass('chose_titleClicked')) {
        sessionStorage.C_TitleType = "chose_stockTitle";
        var $titleNumber = $('#stock_sort').find('table');
        $titleNumber.each(function (i) {
            if (!$(this).hasClass('Page')) {
                sessionStorage.C_TitleNum = $(this).attr('id');
            }
        })
    }
    else if ($('#chose_topicTitle').hasClass('chose_titleClicked')) {
        sessionStorage.C_TitleType = "chose_topicTitle";
        var $titleNumber = $('#topic_sort').find('table');
        $titleNumber.each(function (i) {
            if (!$(this).hasClass('Page')) {
                sessionStorage.C_TitleNum = $(this).attr('id');
            }
        })
    }
    sessionStorage.C_stockPImg = $('#stock_price').find('.chose_sortImg').attr('src');
    sessionStorage.C_stockPpImg = $('#stock_pricePrent').find('.chose_sortImg').attr('src');
    sessionStorage.C_topicPImg = $('#topic_price').find('.chose_sortImg').attr('src');
    sessionStorage.C_topicPpImg = $('#topic_pricePrent').find('.chose_sortImg').attr('src');
}
//清空自选的行为记录
function ClearChoseAction() {
    sessionStorage.C_TitleType = "";
    sessionStorage.C_TitleNum = "";
    sessionStorage.C_stockPImg = "";
    sessionStorage.C_stockPpImg = "";
    sessionStorage.C_topicPpImg = "";
}
//更新跳动背景
function jump_backColor(id, Bcolor) {
    $('#' + id).css('display', 'block').css('background-color', Bcolor);
    $('#' + id).fadeOut(500);
}