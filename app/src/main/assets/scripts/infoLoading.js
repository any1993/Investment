//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var ItemId = GetQueryString("itemid");
var newsType = GetQueryString("newsType");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var newsSummary = "", newsImg = "http://www.taikorcdn.com/reader/images/icon.png";
var HPushDate = new Array();
$(function () {
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //function onDeviceReady() {
    //    document.addEventListener('pause', onPause.bind(this), false);
    //    document.addEventListener('resume', onResume.bind(this), false);
    //    jpushEffect();
        setTimeout(function () {
            Touch();
            //db = window.sqlitePlugin.openDatabase({ name: "my.db" }, function (db) {
            //    db.transaction(function (tx) {
            //        SelectUser(tx);
            //    }, function (err) {
            //        // alert('Open database my.db ERROR1: ' + err.message);
            //    });
            //});
        }, 200);
    bind_info();
    //    function onPause() {
    //        //此应用程序已被暂停。保存应用程序状态
    //        jpushEffect();
    //    };
    //
    //    function onResume() {
    //        //此应用程序已被重新激活。恢复应用程序的状态
    //        jpushEffect();
    //        window.location.reload();
    //    };
    //}
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
                            // Touch();
                            bind_info();
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
                // Touch();
                bind_info();
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    // Touch();
                    bind_info();
                }
            }

        }
    });
}
function Touch() {
    document.getElementById("icon-back").addEventListener("touchstart", touchStartBack, false);
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
    document.getElementById("collect-button").addEventListener("touchstart", touchstartCollect, false);
    touchback();
}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//从前端数据库或者服务器去取数据
function bind_info() {
    setTimeout(function () {
        //打开的时候如果有缓存,那么只保留最新的200条
        //db.transaction(function (tx) {
        //    tx.executeSql('delete from item_list_' + UserStatus + ' where idd <= (select max(idd)-200 from item_list_' + UserStatus + ')');
        //}, function (e) {
        //    // alert("itemListSe1ERROR: " + e.message);
        //});
        //db.transaction(function (tx) {
        //    tx.executeSql('select * from item_list_' + UserStatus + '  where ItemID =?', [ItemId], function (tx, res) {
        //        if (res != null && res.rows != null && res.rows.length > 0) {
        //            var obj = res.rows.item(0);
        //            $('#info-title').html(obj.Title);
        //            $('#info-timer').html(obj.PubDate);
        //            $('#info-mediaName').html(obj.MediaName);
        //            if (obj.Summary != null && obj.Summary != "" && obj.Summary != "null") {
        //                var summary = eval('(' + obj.Summary + ')');
        //                newsSummary = summary[0];
        //            }
        //            if (obj.ImageUrl != null && obj.ImageUrl != "" && obj.ImageUrl != "null") {
        //                newsImg = "http://www.taikorcdn.com/reader/" + obj.ImageUrl;
        //            }
        //            var strlist = '';
        //            if (obj.Tag != null && obj.Tag != "" && obj.Tag != undefined) {
        //                var tag = obj.Tag.split(",");
        //                for (var j = 0; j < tag.length; j++) {
        //                    if (tag[j].indexOf(":") != -1) {
        //                        strlist += '<span class="tag-label">' + tag[j].substring(0, tag[j].indexOf(":")) + '</span>';
        //                    }
        //                    else {
        //                        strlist += '<span class="tag-label">' + tag[j] + '</span>';
        //                    }
        //                }
        //                $('#info-tag').append(strlist);
        //            }
        //            if (obj.HTMLText != null && obj.HTMLText != "" && obj.HTMLText != "null" && obj.Struct != null && obj.Struct != "" && obj.Struct != "null") {
        //                $('#info-htmltext').html(obj.HTMLText);
        //                infoHTMLimg();
        //                infoHTMLimgattr();
        //                $(".info-page").removeClass("Page");
        //                bind_struct(eval('(' + obj.Struct + ')'));
        //                $("#loading").remove();
        //            }
        //            else {
        //                httpGet("Reader/ArticleDetail?itemID=" + ItemId + "&type=0&isCache=false&version=" + NowVerision, "", true, ajax_success2, ajax_fail2);
        //                function ajax_success2(obj) {
        //                    if (obj != null && obj != "" && obj != undefined) {
        //                        if (obj.HTMLText != null && obj.HTMLText != "") {
        //                            $('#info-htmltext').html(obj.HTMLText);
        //                            infoHTMLimg();
        //                            infoHTMLimgattr();
        //                        }
        //                        $(".info-page").removeClass("Page");
        //                        bind_struct(obj.Struct);
        //                        db.transaction(function (tx) {
        //                            tx.executeSql("UPDATE item_list_" + UserStatus + " SET HTMLText=?,Struct=? where ItemID=?", [obj.HTMLText, JSON.stringify(obj.Struct), ItemId], function (tx, res) {
        //                            });
        //                        }, function (e) {
        //                        });
        //                        $("#loading").remove();
        //
        //                    }
        //                    else {
        //                        //下拉时获取指数为空
        //                    }
        //                }
        //                function ajax_fail2() {
        //                    $("#loading").remove();
        //                    $("#app-info").append('<div id="refesh" class="refesh"><img style="width:180px;" src="images/ajax_fail.png"/><br><span>点击屏幕，重新加载</span></div>');
        //                    $("#refesh").bind("click", function (event) {
        //                        $('#refesh').remove();
        //                        $("#app-info").append('<div id="loading" class="loadingimg"><img src="images/loading.gif" style="width:80px"><br><span>正在加载中...</span></div>');
        //                        setTimeout(function () {
        //                            $("#analysis-theme ul").empty();
        //                            $("#info-relate ul").empty();
        //                            $("#refesh").remove();
        //                            bind_info();
        //                        }, 1000);
        //                    })
        //                }
        //            }
        //            httpGet("Reader/ArticleDetail?itemID=" + ItemId + "&type=0&isCache=false&version=" + NowVerision, "", true, ajax_success3, ajax_fail3);
        //            function ajax_success3(obj) {
        //                if (obj != null && obj != "" && obj != undefined) {
        //                    if (obj.ReleatedNews != null && obj.ReleatedNews != "") {
        //                        strlist = '';
        //                        for (var i = 0; i < obj.ReleatedNews.length; i++) {
        //                            strlist = '<li id=' + obj.ReleatedNews[i].Id + '><p>' + obj.ReleatedNews[i].Title + '</p><p class="relate-date">' + obj.ReleatedNews[i].PubDate + '</p></li>';
        //                            $('#relate-text ul').append(strlist);
        //                            bind_relatelist(obj.ReleatedNews[i].Id);
        //                        }
        //                    }
        //                    else {
        //                        $("#relate-title,#info-relate").addClass("Page");
        //                    }
        //                }
        //                else {
        //                    $("#relate-title,#info-relate").addClass("Page");
        //                }
        //            }
        //            function ajax_fail3() {
        //                //相关新闻获取失败
        //                $("#info-relate ul").html('<div id="refeshInRelate" style="position:relative;width:100%;height:100px;"><div id="refeshRelate" class="refesh"><img style="width:50px;" src="images/no_content.png"/><br><span>加载失败，点我刷新</span></div><div>');
        //                $("#refeshRelate").bind("click", function (event) {
        //                    $("#analysis-theme ul").empty();
        //                    $("#info-relate ul").empty();
        //                    setTimeout(function () {
        //                        bind_info();
        //                    }, 1000);
        //                })
        //                $("#analysis-theme ul").html('<div id="refeshInAnalysis" style="position:relative;width:100%;height:100px;"><div id="refeshAnalysis" class="refesh"><img style="width:50px;" src="images/no_content.png"/><br><span>加载失败，点我刷新</span></div><div>');
        //                $("#refeshAnalysis").bind("click", function (event) {
        //                    $("#analysis-theme ul").empty();
        //                    $("#info-relate ul").empty();
        //                    setTimeout(function () {
        //                        bind_info();
        //                    }, 1000);
        //                })
        //            }
        //        }
        //        else {
                    var strlist = '';
                    httpGet("Reader/ArticleDetail?itemID=" + ItemId + "&type=0&isCache=false&version=" + NowVerision, "", true, ajax_success5, ajax_fail5);
                    function ajax_success5(obj) {
                        // $(".info-page").removeClass("Page");
                        if (obj != null && obj != "" && obj != undefined) {
                            $('#info-title').html(obj.Title);
                            $('#info-timer').html(obj.PubDate);
                            $('#info-mediaName').html(obj.MediaName);
                            var strlist = '';
                            if (obj.Tag != null && obj.Tag != "" && obj.Tag != undefined) {
                                var tag = obj.Tag.split(",");
                                for (var j = 0; j < tag.length; j++) {
                                    if (tag[j].indexOf(":") != -1) {
                                        strlist += '<span class="tag-label">' + tag[j].substring(0, tag[j].indexOf(":")) + '</span>';
                                    }
                                    else {
                                        strlist += '<span class="tag-label">' + tag[j] + '</span>';
                                    }
                                }
                                $('#info-tag').append(strlist);
                            }
                            //摘要赋值
                            if (obj.Summary != null && obj.Summary != "") {
                                newsSummary = obj.Summary[0];
                            }
                            if (obj.ImageUrl != null && obj.ImageUrl != "" && obj.ImageUrl != "null") {
                                newsImg = "http://www.taikorcdn.com/reader/" + obj.ImageUrl;
                            }
                            $('#info-htmltext').html(obj.HTMLText);
                            infoHTMLimg();
                            infoHTMLimgattr();
                            $(".info-page").removeClass("Page");
                            bind_struct(obj.Struct);
                            $("#loading").remove();
                            
                            if (obj.ReleatedNews != null && obj.ReleatedNews != "") {
                                strlist = '';
                                for (var i = 0; i < obj.ReleatedNews.length; i++) {
                                    strlist = '<li id=' + obj.ReleatedNews[i].Id + '><p>' + obj.ReleatedNews[i].Title + '</p><p class="relate-date">' + obj.ReleatedNews[i].PubDate + '</p></li>';
                                    $('#relate-text ul').append(strlist);
                                    bind_relatelist(obj.ReleatedNews[i].Id);
                                }
                            }
                            else {
                                $("#relate-title,info-relate").addClass("Page");
                            }
                        }
                        else {
                            //下拉时获取指数为空
                        }
                    }
                    function ajax_fail5() {
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
                //}
        //    });
        //}, function (e) {
        //    // alert("itemListSe2ERROR: " + e.message);
        //});
        //sqlite通配符查找
        // var pipei = "产业";
        // db.transaction(function (tx) {
        //     tx.executeSql('select * from item_list_' + UserStatus + '  where Title LIKE ?', ['%' + pipei + '%'], function (tx, res) {
        //         if (res != null && res.rows != null && res.rows.length > 0) {
        //             for (var i = 0; i < res.rows.length; i++) {
        //                 alert(res.rows.item(i).Title);
        //             }
        //         }
        //         else {
        //             alert("没有数据")
        //         }
        //     });
        // }, function (e) {
        //     // alert("itemListSe2ERROR: " + e.message);
        // });
        //db.transaction(function (tx) {
        //    tx.executeSql('select * from item_co_' + UserStatus + ' where ItemID =?', [ItemId], function (tx, res) {
        //        if (res != null && res.rows != null && res.rows.length > 0) {
        //            $("#collect-button").attr("src", "images/infoBottom/collected.png");
        //        }
        //        else {
        //            $("#collect-button").attr("src", "images/infoBottom/collect.png");
        //        }
        //    });
        //}, function (e) {
        //    // alert("itemListSe1ERROR: " + e.message);
        //});
        touchBottom();
    }, 100);

}
//添加文章结构信息
function bind_struct(Struct) {
    //判断分析主体类型
    if (Struct != null && Struct != "" && Struct.StructId != null && Struct.StructId != "") {
        //主题
        if (Struct.Category == "主题市场") {
            var EmotionsData = [];
            var EchartDay = [];
            var HotsData = [];
            var StructId = Struct.StructId
            $('#topic_box').removeClass('Page');
            if (Struct.Keypoint != null && Struct.Keypoint != "") {
                $('#topic_box').find('.struct_summary_text').html(Struct.Keypoint);
            }
            else {
                $('#topic_box').find('.struct_summary').addClass("Page");
            }
            httpGet("Reader/Topic?topicID=" + Struct.StructId, "", true, ajax_success15, ajax_fail15);
            var HotsData = [];
            function ajax_success15(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    $("#topic_blo_name").html('<input type="hidden" value="' + Struct.StructId + '" class="hidden">' + Struct.Subject);
                    document.getElementById("topic_blo_name").addEventListener("touchstart", touch_topic, false);
                    if (obj.HistoryHot != null && obj.HistoryHot != "" && obj.HistoryHot != undefined) {
                        for (var i = 0; i < obj.HistoryHot.length; i++) {
                            HotsData.push(obj.HistoryHot[i]);
                            if (i == obj.HistoryHot.length - 1) {
                                $("#topic_hot_num").html(obj.HistoryHot[i]);
                            }
                        }
                        // option.series[1].data = HotsData;
                    }
                    if (obj.Changepercent != null && obj.Changepercent != "" && obj.Changepercent != undefined) {
                        if (obj.Changepercent >= 0) {
                            $("#topic_blo_Chper").css("color", "#fd3642");

                            $("#topic_blo_Chper").html("+" + Math.round(obj.Changepercent * 100) / 100 + "%");
                        }
                        else {
                            $("#topic_blo_Chper").css("color", "#20c062");
                            $("#topic_blo_Chper").html(Math.round(obj.Changepercent * 100) / 100 + "%");
                        }
                    }

                    httpGet("Reader/EmotionIndexs/" + StructId + "?type=1&count=7&rate=0", "", true, ajax_success17, ajax_fail17);
                    function ajax_success17(obj) {
                        if (obj != null && obj != "" && obj != undefined) {
                            for (var i = 0; i < obj.length; i++) {
                                EmotionsData.push(obj[i].Emotion.toFixed(0));
                                GetDateStr(-i);
                                EchartDay.unshift(HPushDate[4] + '-' + HPushDate[2]);
                                if (i == obj.length - 1) {
                                    $("#topic_emt_num").html(obj[i].Emotion.toFixed(0));
                                }
                            }
                        }
                        info_echart_line(EchartDay, EmotionsData, HotsData, 1);
                    }
                    function ajax_fail17() {
                        $('#topic_box').addClass('Page');
                    }
                }
            }
            function ajax_fail15() {

            }
            httpGet("Reader/ArticleInfo?structId=" + Struct.StructId, "", true, ajax_success16, ajax_fail16);
            function ajax_success16(obj) {
                if (obj != null && obj != "" && obj != undefined) {
                    if (obj.Tendency == 0) {
                        $("#topic_blo_info img").attr("src", "images/info_struct/chiping.png");
                    }
                    else {
                        if (obj.Tendency == 1) {
                            $("#topic_blo_info img").attr("src", "images/info_struct/lihao.png");
                        }
                        else {
                            if (obj.Tendency == -1) {
                                $("#topic_blo_info img").attr("src", "images/info_struct/likong.png");
                            }
                        }
                    }
                    $("#topic_art_num").html(obj.ArticleCount);
                    var affect_Data = [];
                    affect_Data = [{ value: obj.GoodArticleCount, name: '正面', itemStyle: { normal: { color: '#F7524C' } } }, { value: obj.BadArticleCount, name: '负面', itemStyle: { normal: { color: '#1DBF90' } } }, { value: (obj.ArticleCount - obj.BadArticleCount - obj.GoodArticleCount), name: '中性', itemStyle: { normal: { color: '#3D91E3' } } }];
                    info_echart_pie(affect_Data, 1);
                }
            }
            function ajax_fail16() {
            }
        }
        else {
            //个股
            if (Struct.Category == "股票") {
                var EmotionsData = [];
                var EchartDay = [];
                var StructId = Struct.StructId
                $('#block_box').removeClass('Page');
                if (Struct.Keypoint != null && Struct.Keypoint != "") {
                    $('#block_box').find('.struct_summary_text').html(Struct.Keypoint);
                }
                else {
                    $('#block_box').find('.struct_summary').addClass('Page');
                }

                httpGet("Reader/Stocks?stockIds=" + Struct.StructId, "", true, ajax_success18, ajax_fail18);
                function ajax_success18(obj) {
                    if (obj != null && obj != "" && obj != undefined) {
                        $("#block_blo_name").html('<input type="hidden" value="' + obj[0].Symbol + '" class="hidden"><span>' + obj[0].Name + '</span><br><span style="font-size:12px;color:#999;">' + obj[0].Code + '</span>');
                        document.getElementById("block_blo_name").addEventListener("touchstart", touch_block, false);
                        if (obj[0].Changepercent >= 0) {
                            $("#block_blo_Chper").css("color", "#fd3642");

                            $("#block_blo_Chper").html("+" + Math.round(obj[0].Changepercent * 100) / 100 + "%");
                        }
                        else {
                            $("#block_blo_Chper").css("color", "#20c062");
                            $("#block_blo_Chper").html(Math.round(obj[0].Changepercent * 100) / 100 + "%");
                        }
                        $("#block_blo_Trade").html(obj[0].Trade);
                    }

                    httpGet("Reader/EmotionIndexs/" + StructId + "?type=0&count=7&rate=0", "", true, ajax_success20, ajax_fail20);
                    function ajax_success20(obj) {
                        if (obj != null && obj != "" && obj != undefined) {
                            for (var i = 0; i < obj.length; i++) {
                                EmotionsData.push(obj[i].Emotion.toFixed(0));
                                //GetDateStr(-i);
                                EchartDay.unshift(HPushDate[4] + '-' + HPushDate[2]);
                            }
                            info_echart_line(EchartDay, EmotionsData, '', 2)
                        }
                    }
                    function ajax_fail20() {
                        $('#block_box').addClass('Page');
                    }
                }
                function ajax_fail18() {

                }
                httpGet("Reader/ArticleInfo?structId=" + Struct.StructId, "", true, ajax_success19, ajax_fail19);
                function ajax_success19(obj) {
                    if (obj != null && obj != "" && obj != undefined) {
                        if (obj.Tendency == 0) {
                            $("#block_blo_info img").attr("src", "images/info_struct/chiping.png");
                        }
                        else {
                            if (obj.Tendency == 1) {
                                $("#block_blo_info img").attr("src", "images/info_struct/lihao.png");
                            }
                            else {
                                if (obj.Tendency == -1) {
                                    $("#block_blo_info img").attr("src", "images/info_struct/likong.png");
                                }
                            }
                        }
                        $("#block_art_num").html(obj.ArticleCount);
                        var affect_Data = [];
                        affect_Data = [{ value: obj.GoodArticleCount, name: '正面', itemStyle: { normal: { color: '#F7524C' } } }, { value: obj.BadArticleCount, name: '负面', itemStyle: { normal: { color: '#1DBF90' } } }, { value: (obj.ArticleCount - obj.BadArticleCount - obj.GoodArticleCount), name: '中性', itemStyle: { normal: { color: '#3D91E3' } } }];
                        info_echart_pie(affect_Data, 2);
                    }
                }
                function ajax_fail19() {

                }
            }
            else {
                //全市场
                if (Struct.Category == "板块指数" || Struct.Category == "全市场") {
                    $('#market_box').removeClass('Page');
                    if (Struct.Keypoint != null && Struct.Keypoint != "") {
                        $('#market_box').find('.struct_summary_text').html(Struct.Keypoint);
                    }
                    else {
                        $('#market_box').find('.struct_summary').addClass('Page');
                    }
                    $('#market_box').find('#market_name').html(Struct.Subject);
                    httpGet("Reader/ArticleInfo?structId=" + Struct.StructId, "", true, ajax_success21, ajax_fail21);
                    function ajax_success21(obj) {
                        if (obj != null && obj != "" && obj != undefined) {
                            if (obj.Tendency == 0) {
                                $("#market_info img").attr("src", "images/info_struct/chiping.png");
                            }
                            else {
                                if (obj.Tendency == 1) {
                                    $("#market_info img").attr("src", "images/info_struct/lihao.png");
                                }
                                else {
                                    if (obj.Tendency == -1) {
                                        $("#market_info img").attr("src", "images/info_struct/likong.png");
                                    }
                                }
                            }
                            $("#market_lihao_num").html(obj.GoodArticleCount + "篇");
                            $("#market_likong_num").html(obj.BadArticleCount + "篇");
                        }
                    }
                    function ajax_fail21() {

                    }
                    httpGet("Reader/EmotionIndexs/" + Struct.StructId + "?type=2&count=7&rate=0", "", true, ajax_success22, ajax_fail22);
                    function ajax_success22(obj) {
                        var EmotionsData = [];
                        var EchartDay = [];
                        if (obj != null && obj != "" && obj != undefined) {
                            for (var i = 0; i < obj.length; i++) {
                                EmotionsData.push(obj[i].Emotion.toFixed(0));
                                GetDateStr(-i);
                                EchartDay.unshift(HPushDate[4] + '-' + HPushDate[2]);
                            }
                        }
                        info_echart_line(EchartDay, EmotionsData, '', 3)
                    }
                    function ajax_fail22() {
                        $('#market_box').addClass('Page');
                    }
                }
            }
        }
    }
}
//第一个情绪，热度echart生成
function info_echart_line(xAxisData, seriesData, seriesData1, type) {
    //定义情绪指数图表
    //主题的情绪表
    if (type == 1) {
        option = {
            tooltip: {
                confine: true,
                trigger: 'axis',
                showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            },
            legend: {
                y: 'bottom',
                // icon: 'bar',
                // itemWidth: 12,
                // itemHeight: 20,
                data: [{ name: '情绪指数', icon: 'circle', }, { name: '热度指数', icon: 'bar', }]
            },
            grid: {
                x: 35,
                y: 20,
                x2: 35,
                y2: 60,
                borderWidth: 0,
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
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    name: '情绪指数',
                    nameTextStyle: { color: ['#666'] },
                    type: 'value',
                    scale: true,
                    splitNumber: 5,
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 0.5,
                            type: 'solid'
                        }
                    },
                    boundaryGap: [0, 0],
                    axisLabel: {
                        //margin: -40,
                    },
                    splitArea: { show: false },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                },
                {
                    name: '热度指数',
                    nameTextStyle: { color: ['#666'] },
                    type: 'value',
                    scale: true,
                    splitNumber: 5,
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 0.5,
                            type: 'solid'
                        }
                    },
                    boundaryGap: [0, 0],
                    axisLabel: {
                        //margin: -40,
                    },
                    splitArea: { show: false },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                }
            ],
            series: [
                {
                    name: '情绪指数',
                    type: 'line',
                    itemStyle: { normal: { color: "#ff7a00" } },
                    symbol: 'circle',
                    data: [],
                },
                {
                    name: '热度指数',
                    type: 'line',
                    itemStyle: { normal: { color: "#fccb45" } },
                    symbol: 'rectangle',
                    yAxisIndex: 1,
                    data: [],
                },
            ]
        };
    }
    //个股和全市场的表
    else {
        option = {
            tooltip: {
                confine: true,
                trigger: 'axis',
                showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            },
            legend: {
                y: 'bottom',
                icon: 'bar',
                itemWidth: 12,
                itemHeight: 20,
                data: [{ name: '情绪指数' }]
            },
            grid: {
                x: 35,
                y: 20,
                x2: 35,
                y2: 60,
                borderWidth: 0,
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
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    splitNumber: 5,
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: ['#e5e5e5'],
                            width: 0.5,
                            type: 'solid'
                        }
                    },
                    boundaryGap: [0, 0],
                    axisLabel: {
                        //margin: -40,
                    },
                    splitArea: { show: false },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                },
            ],
            series: [
                {
                    name: '情绪指数',
                    type: 'line',
                    itemStyle: { normal: { color: "#ff7a00" } },
                    symbol: 'circle',
                    // yAxisIndex: 1,
                    data: [],
                },
            ]
        };
    }
    option.series[0].data = seriesData;
    if (type == 1) {
        option.series[1].data = seriesData1;
        var myChart1 = echarts.init(document.getElementById('topic_echart'));
    }
    else {
        if (type == 2) {
            var myChart1 = echarts.init(document.getElementById('block_echart'));
        }
        else {
            if (type == 3) {
                var myChart1 = echarts.init(document.getElementById('market_echart'));
            }
        }
    }
    myChart1.setOption(option);

}
//第二个饼图echart生成
function info_echart_pie(seriesData, type) {
    option1 = {
        title: {
            show: false,
            text: '情感倾向',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            confine: true,
            // position: function ([x, y]) {
            //     if ($(window).width < 375)
            //         return [20, y]
            // },
            formatter: "{a} <br/>{b} : {c}<br/>{d}%"
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: ['正面', '负面', '中性'],
        },
        calculable: false,
        series: [
            {
                name: '情感倾向',
                type: 'pie',
                center: ['50%', '30%'],
                itemStyle: {
                    normal: {
                        label: { show: false }, labelLine: { show: false }
                    }
                },
                data: [
                ]
            }
        ]
    };
    option1.series[0].data = seriesData;
    if (type == 1) {
        var myChart2 = echarts.init(document.getElementById('affect_topic_block'));
        if ($('#affect_topic_block').innerWidth() < 200) {
            option1.series[0].radius = '90%';
        }
    }
    else {
        if (type == 2) {
            var myChart2 = echarts.init(document.getElementById('affect_block_block'));
            if ($('#affect_block_block').innerWidth() < 200) {
                option1.series[0].radius = '90%';
            }
        }
    }
    myChart2.setOption(option1);
}
//文章分析的股票和主题点击
function touch_block(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'stock.html?stockId=' + $(this).find('.hidden').val());
}
function touch_topic(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId=' + $(this).find('.hidden').val());
}
//文章查看全文按钮
function touchStartInfo(event) {
    event.preventDefault();
    InfoAjax();
}
function InfoAjax() {
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 8, Type: newsType }; //用户阅读全文行为需要传的参数
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success7, ajax_fail7);
    function ajax_success7(obj) {
        $('#htmlMore').addClass("Page");
        $('#info-htmltext').removeClass('info-htmltextHidden');
        // $('.info-button').html('收回全文<img src="images/icon-up.png">');
        $('#info-button').remove();
    }
    function ajax_fail7() {
        ajax_success7();
    }
}
//文章返回按钮
function touchStartBack(event) {
    event.preventDefault();
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 3, Type: newsType }; //用户退出文章行为需要传的参数
    NewsBackAjax(BehaviorLogData);

}
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 3, Type: newsType }; //用户退出文章行为需要传的参数
    NewsBackAjax(BehaviorLogData);
}
function NewsBackAjax(BehaviorLogData) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success8, ajax_fail8);
    function ajax_success8(obj) {
        Gotoback();
    }
    function ajax_fail8() {
        ajax_success8();
    }
}
//文章分享按钮操作
function touchStartShare(event) {
    event.preventDefault();
    $("#app-info").after('<div style="position: fixed; z-index: 1; background: rgb(0, 0, 0) none repeat scroll 0% 0%; top: 0px; opacity: 0.2; height: 100%; width: 100%;" id="cover"></div>');
    $("#cover").after('<div id="share-box" class="share-box"><div class="share-icon"><div class="share-half share-top"><ul><li id="wechatFrd-button"><div class="share-pic"><img src="images/share/icon-frie.png"></div><div class="share-word">朋友圈</div></li><li id="wechat-button"><div class="share-pic"><img src="images/share/icon-wec.png"></div><div class="share-word">微信</div></li><li id="weibo-button"><div class="share-pic"><img src="images/share/icon-weibo.png"></div><div class="share-word">新浪微博</div></li></ul></div><div class="share-half"><ul><li id="sms-button"><div class="share-pic"><img src="images/share/icon-sms.png"></div><div class="share-word">短信</div></li><li id="copy-button"><div class="share-pic"><img src="images/share/icon-link.png"></div><div class="share-word">复制链接</div></li><li id="refresh-button"><div class="share-pic"><img src="images/share/icon-refr.png"></div><div class="share-word">刷新</div></li><li id="report-button"><div class="share-pic"><img src="images/share/icon-repo.png"></div><div class="share-word">举报</div></li></ul></div></div><div style="height:8px"></div><div id="share-cancel" class="share-cancel">取消</div></div>');
    $("#share-box").animate({ bottom: "0" }, 500);
    document.getElementById("wechatFrd-button").addEventListener("touchstart", touchstartWechatFrd, false);
    document.getElementById("wechat-button").addEventListener("touchstart", touchstartWechat, false);
    document.getElementById("weibo-button").addEventListener("touchstart", touchstartWebo, false);
    document.getElementById("sms-button").addEventListener("touchstart", touchstartSms, false);
    document.getElementById("copy-button").addEventListener("touchstart", touchstartCopy, false);
    document.getElementById("refresh-button").addEventListener("touchstart", touchstartRefresh, false);
    document.getElementById("report-button").addEventListener("touchstart", touchstartReport, false);
    document.getElementById("share-cancel").addEventListener("touchstart", touchstartCancel, false);
    document.getElementById("share-button").removeEventListener("touchstart", touchStartShare, false);
}
//文章收藏操作
function touchstartCollect(event) {
    event.preventDefault();
    var YesCollect;
    if ($(this).attr("src") == "images/infoBottom/collect.png") {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 2, Type: newsType }; //用户收藏文章的行为
        YesCollect = "yes";
        CollectAjax(YesCollect, BehaviorLogData);
        update_co(ItemId, newsType);
    }
    else {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 7, Type: newsType }; //用户取消收藏文章的行为
        YesCollect = "no";
        CollectAjax(YesCollect, BehaviorLogData);
        delete_co(ItemId);
    }
}
function CollectAjax(YesCollect, BehaviorLogData) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success9, ajax_fail9);
    function ajax_success9(obj) {
        if (UserStatus == "login") {
            update_ID(obj);
        }
        if (YesCollect == "yes") {
            $("#collect-button").attr("src", "images/infoBottom/collected.png");
            window.plugins.toast.show("收藏成功", 300, "center");
        }
        else {
            $("#collect-button").attr("src", "images/infoBottom/collect.png");
            window.plugins.toast.show("取消收藏", 300, "center");
        }
    }
    function ajax_fail9(netStatus) {
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
//微信朋友圈分享
function touchstartWechatFrd(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: $("#info-title").text(),
            description: newsSummary,
            thumb: newsImg,
            mediaTagName: "TEST-TAG-001",
            messageExt: $("#info-title").text(),
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType,    // webpage
            }
        },
        scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, function () {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户分享文章行为需要传的参数
        var ShareType = "1";
        share_ajax(ShareType, BehaviorLogData);
    }, function (reason) {
        window.plugins.toast.showShortBottom("朋友圈分享取消");
    });

    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//微信分享文章
function touchstartWechat(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    //摘要的第一句作为描述
    //var dp = $("#info-summary ul li:nth-child(1)").text();
    Wechat.share({
        message: {
            title: $("#info-title").text(),
            description: newsSummary,
            thumb: newsImg,
            mediaTagName: "TEST-TAG-001",
            messageExt: $("#info-title").text(),
            messageAction: "<action>dotalist</action>",
            media: {
                type: Wechat.Type.LINK,   // webpage
                webpageUrl: "http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType,    // webpage
            }
        },
        scene: Wechat.Scene.SESSION   // share to SESSION
    }, function () {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户分享文章行为需要传的参数
        var ShareType = "2";
        share_ajax(ShareType, BehaviorLogData)
    }, function (reason) {
        window.plugins.toast.showShortBottom("微信朋友分享取消");
    });

    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//微博分享文章
function touchstartWebo(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    var args = {};
    args.url = "http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType;
    args.title = $("#info-title").text();
    args.description = newsSummary;
    args.imageUrl = "http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png";//if you don't have imageUrl,for android http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png will be the defualt one
    args.defaultText = "";
    YCWeibo.shareToWeibo(function () {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户退出文章行为需要传的参数
        var ShareType = "3";
        share_ajax(ShareType, BehaviorLogData);
    }, function (failReason) {
        window.plugins.toast.showShortBottom("微博分享取消");
    }, args);

    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//短信分享文章
function touchstartSms(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.plugins.socialsharing.shareViaSMS("http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType, null /* see the note below */, function (msg) {
        var myDate = new Date();
        var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 4, Type: newsType }; //用户退出文章行为需要传的参数
        var ShareType = "4";
        share_ajax(ShareType, BehaviorLogData);

    }, function (msg) {
        window.plugins.toast.showShortBottom("短信分享取消");
    })
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
function share_ajax(ShareType, BehaviorLogData) {
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success10, ajax_fail10);
    function ajax_success10(obj) {
        if (ShareType == "1") {
            window.plugins.toast.showShortBottom("朋友圈分享成功");
        }
        else {
            if (ShareType == "2") {
                window.plugins.toast.showShortBottom("微信朋友分享成功");
            }
            else {
                if (ShareType == "3") {
                    window.plugins.toast.showShortBottom("微博分享成功");
                }
                else {
                    if (ShareType == "4") {
                        window.plugins.toast.showShortBottom("短信分享成功");
                    }
                }
            }
        }
    }
    function ajax_fail10(netStatus) {
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
//复制链接
function touchstartCopy(event) {
    event.preventDefault();
    cordova.plugins.clipboard.copy("http://m.boolcj.com/newsInfo.html?itemid=" + ItemId + "&newsType=" + newsType, function (msg) {
        window.plugins.toast.showShortBottom("复制链接成功");
        $("#share-box").animate({ bottom: "-335px" }, 500, function () {
            $("#cover").remove();
            $("#share-box").remove();
        });
    }, function (msg) {
        window.plugins.toast.showShortBottom("复制链接失败，请重试");
    });
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//文章刷新按钮
function touchstartRefresh(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 300, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    window.location.reload();
    window.plugins.toast.showShortBottom("刷新成功");
}
//举报页面
function touchstartReport(event) {
    event.preventDefault();
    AddGoback(localStorage.N_url, 'report.html?itemid=' + ItemId);
    // slide('left', 'lightblue', 1, 'report.html?itemid=' + ItemId + '&newsType=' + newsType + '&fromPage=' + fromPage);
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//文章取消分享按钮
function touchstartCancel(event) {
    event.preventDefault();
    $("#share-box").animate({ bottom: "-335px" }, 500, function () {
        $("#cover").remove();
        $("#share-box").remove();
    });
    document.getElementById("share-button").addEventListener("touchstart", touchStartShare, false);
}
//更新返回的TxtSQL语句的ID
function update_ID(data) {
    db.transaction(function (tx) {
        tx.executeSql("insert INTO OperateID (OperateID) VALUES(?)", [data], function (tx, res) {
            ////alert("添加成功");
        });
    }, function (e) {
        //alert("update_ID1ERROR: " + e.message);
    });
    db.transaction(function (tx) {
        tx.executeSql("select * from OperateID", [], function (tx, res) {
            ////alert(res.rows.length + "&&" + res.rows.item(res.rows.length - 1).Ceshi);
        });
    }, function (e) {
        //alert("update_ID2ERROR: " + e.message);
    });
}
//更新收藏文章
function update_co(id, Model) {
    db.transaction(function (tx) {
        tx.executeSql('select * from item_list_' + UserStatus + '  where ItemID=?', [id], function (tx, res) {
            if (res != null && res.rows != null && res.rows.length > 0) {
                db.transaction(function (tx) {
                    tx.executeSql('REPLACE INTO item_co_' + UserStatus + '(ItemID, Type, Title, MediaName, Tag, PubDate, Summary, Category, ImageUrl) VALUES(?,?,?,?,?,?,?,?,?)', [id, Model, res.rows.item(0).Title, res.rows.item(0).MediaName, res.rows.item(0).Tag, getDateTimeStamp(res.rows.item(0).PubDate) / 1000, res.rows.item(0).Summary, res.rows.item(0).Category, res.rows.item(0).ImageUrl], function (tx, res) {
                        //插入收藏的文章
                    });
                }, function (e) {
                    // alert("itemListInAndSe3ERROR: " + e.message);
                });
            }
            else {
                updatecoAjax(id, Model);
            }
        });
    }, function (e) {
        // alert("itemListInAndSe3ERROR: " + e.message);
    });
}
function updatecoAjax(id, Model) {
    httpGet("Reader/ArticleDetail?itemID=" + ItemId + "&type=0&isCache=false&version=" + NowVerision, "", true, ajax_success11, ajax_fail11);
    function ajax_success11(obj) {
        db.transaction(function (tx) {
            tx.executeSql('REPLACE INTO item_co_' + UserStatus + '(ItemID, Type, Title, MediaName, Tag, PubDate, Summary, Category, ImageUrl) VALUES(?,?,?,?,?,?,?,?,?)', [id, Model, obj.Title, obj.MediaName, obj.Tag, getDateTimeStamp(obj.PubDate) / 1000, JSON.stringify(obj.Summary), obj.Category, obj.ImageUrl], function (tx, res) {
                //插入收藏的文章
            });
        }, function (e) {
            // alert("itemListInAndSe3ERROR: " + e.message);
        });
    }
    function ajax_fail11() {
        //下拉时获取指数失败
    }
}
//取消收藏文章
function delete_co(id) {
    db.transaction(function (tx) {
        tx.executeSql("delete from item_co_" + UserStatus + "  where ItemID =?", [id], function (tx, res) {
        });
    }, function (e) {
        // alert("update_co1ERROR: " + e.message);
    });
}
//点击进入相关推荐文章
function bind_relatelist(id) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        relatelistAjax(id);
    })
}
function relatelistAjax(id) {
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: 1 }; //用户进入文章行为需要传的参数
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success12, ajax_fail12);
    function ajax_success12(obj) {
        var RelatedNewsData = { ItemID: id, FItemID: ItemId, UserID: UserID, Time: myDate.getTime() }; //用户进入相关文章行为需要传的参数
        httpPost("Reader/UserBehaviorLog", RelatedNewsData, true, ajax_success13, ajax_fail13);
        function ajax_success13(obj) {
            AddGoback(localStorage.N_url, 'relateInfo.html?relateItemid=' + id + '&relateNewsType=1');
        }
        function ajax_fail13() {
            ajax_success13();
        }
    }
    function ajax_fail12() {
        ajax_success12();
    }
}
//点击进入相关主题下面文章
function bind_relateTopic(id) {
    $('#' + id).bind('click', function (event) {
        event.stopPropagation();
        relateTopicAjax(id);
    })
}
function relateTopicAjax(id) {
    var myDate = new Date();
    var BehaviorLogData = { AuthorID: UserID, LogItemID: id, LogTime: myDate.getTime(), LogState: 1, Type: 1 }; //用户进入文章行为需要传的参数
    httpPost("Reader/UserBehaviorLog", BehaviorLogData, true, ajax_success14, ajax_fail14);
    function ajax_success14(obj) {
        //用户进入文章的相关主题记录行为
        AddGoback(localStorage.N_url, 'relateInfo.html?relateItemid=' + id + '&relateNewsType=1');
    }
    function ajax_fail14() {
        ajax_success14();
    }
}
//手指滑动返回上一个页面
function touchback() {
    var screenWidth = document.documentElement.clientWidth;
    var yScrolls, yScrolle;
    $("#app-info").on("touchstart", function (e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("#app-info").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        // $("#info-htmltext").prepend("yScrolls："+yScrolls+" && "+"yScrolle："+yScrolle);
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            var myDate = new Date();
            var BehaviorLogData = { AuthorID: UserID, LogItemID: ItemId, LogTime: myDate.getTime(), LogState: 3, Type: newsType }; //用户退出文章行为需要传的参数
            NewsBackAjax(BehaviorLogData);
        }
    });
}



//滑动到底部
function touchBottom() {
    $(window).scroll(function () {
        // $(window).unbind('scroll');
        if ($(this).scrollTop() + $(this).height() == $(document).height()) {
            $('.go_bottom').removeClass('Page');
        }
        else {
            if ($(this).scrollTop() + $(this).height() + 60 <= $(document).height()) {
                $('.go_bottom').addClass('Page');
            }
        }
    })
}