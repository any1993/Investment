/**
 * Created by Kris on 2016/11/28.
 */

var AccessToken;
var TopIndex = GetQueryString("TopIndex");
var pageScroll=parseInt(GetQueryString("scroll"));
//var nullu = "", NowVerision = "2.0", UserID = "";
//var userID="";
var Auditing = 0, nullu = "", NowVerision = "2.0", UserID = "", AppModel = "2.5.0";//是否显示登录界面   //空字符  //目前版本   //用户标识

var db, dbV, dbVNowversion = "2.1"; //前端数据库定义
var UserStatus = "unlogin"; //记录用户登录状态

var timeArr2 = [];

var indexOfSH=[];
//var indexOfSHTime=[];
var emotionsOfSH=[];

var indexOfSZ=[];
//var indexOfSZTime=[];
var emotionsOfSZ=[];

var indexOfCB=[];
//var indexOfCBTime=[];
var emotionsOfCB=[];

var indexColorOfSH="#FFFFFF";
var emotionColorOfSH="#FFFFFF";
var indexColorOfCB="#FFFFFF";
var emotionColorOfCB="#FFFFFF";
var indexColorOfSZ="#FFFFFF";
var emotionColorOfSZ="#FFFFFF";

var topicBlockColorList = ["#F74C59","#F74C59","#F74C59","#F74C59","#F74C59","#F74C59"];
var ifBlockColor = [0,0,0,0,0,0];
var topicDataTemp;
var dow = 0;
var wod = 0;
var option1 = {};
var myChart;
var flagp = 0;
var flagNp = 0;

var Auditing = 0, nullu = "", category = "Recommend", categoryName = "推荐", NowVerision = "2.0", UserID = "br_1091827413";//是否显示登录界面   //空字符  //目前版本   //用户标识

var openFromtime;
var openEndtime;
var myDate = new Date();
var dateArray = [];
var dateTemp;
var flag = 1;
var option_t1 = {};
var flagw = 1;
var flagsr = 0;

var StockSetTime = new Date();
StockSetTime = StockSetTime.toString();
StockSetTime = StockSetTime.substring(0,16)+"09:00:00"+StockSetTime.substring(24,42);
var fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
var endTime = (Date.parse(new Date())/1000);

var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天

var StockTimeAxis = ["09:15"];

var priceOfSHMin = [];
var emotionsOfSHMin = [];
var settelmentOfSH = [];
var shMin = 0;
var shMax = 0;

var priceOfSZMin = [];
var emotionsOfSZMin = [];
var settelmentOfSZ = [];
var szMin = 0;
var szMax = 0;

var priceOfCBMin = [];
var emotionsOfCBMin = [];
var settelmentOfCB = [];
var cbMin = 0;
var cbMax = 0;

var indexOfChartDisplay = 0;
var timeSwitchListener = 0;


//缓存相关
//var cacheTag = 0 ;
var mainScroll = 0  ;
var cacheData01 ;
var cacheData02 ;
var cacheData03 ;
var cacheData04 ;
var cacheData05 ;
var cacheData06 ;
var cacheData07 ;
var cacheData08 ;
var cacheData09 ;


//情绪指数变化值测试
function loadendScroll(){
    if(flagsr >= 2){
        scollto(pageScroll);
        flagsr = 0;
    }else{flagsr += 1;}
}


$(function () {
    FastClick.attach(document.body);
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    //pageOnload();
    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        jpushEffect();
        function onPause() {
            //此应用程序已被暂停。保存应用程序状态
        }
        function onResume() {
            //此应用程序已被重新激活。恢复应用程序的状态
            jpushEffect();
            window.location.reload();
        }
        setTimeout(function () {
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
                // add_leadSwiper();


                //add
                if (GetQueryString("firstLoad") != "no") {
                    httpGet("Reader/OpenApp?userID=" + UserID + "&version=" + AppModel + "&sysinfo=" + device.platform + "&network=" + navigator.connection.type + "&model=" + device.model + "&deviceVersion=" + device.version, "", true, ajax_success15, ajax_fail15);
                    function ajax_success15(obj) {

                    }
                    function ajax_fail15() {
                    }

                    //console.log(localStorage.B_AppModel);
                    if (localStorage.B_AppModel == undefined || localStorage.B_AppModel == "") {
                        localStorage.B_AppModel = AppModel;
                        $("#lead").removeClass("Page");
                        add_leadSwiper();
                    }else if (localStorage.B_AppModel != AppModel) {
                        if (parseInt(localStorage.B_AppModel.replace(/\./g, '')) < parseInt(AppModel.replace(/\./g, ''))) {
                            localStorage.B_AppModel = AppModel;
                            $("#lead").removeClass("Page");
                            add_leadSwiper();
                        }else{

                        }
                    }
                    //else{
                    //    //$("#lead").addClass("Page");
                    //    add_leadSwiper();
                    //}

                    updateShow();

                }

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
    }


    //add_leadSwiper();
    //pageOnload();
});


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
    tx.executeSql('CREATE TABLE IF NOT EXISTS All_stock (Symbol text, StockID text, Name text,SearchSSN text)');//记录所有的股票

    SelectUser(tx);
}
//在打开app情况下进入首页
function opTableSecond(tx) {

    SelectUser(tx);
}
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
                    if (GetQueryString("firstLoad") != "no"){
                        AllStock();
                    }
                    pageOnload();

                    if( sessionStorage.pageScrollMhp == undefined ){
                        sessionStorage.pageScrollMhp = document.body.scrollTop;
                        mainScroll = sessionStorage.pageScrollMhp;
                        scollto(mainScroll);
                    }else{
                        mainScroll = sessionStorage.pageScrollMhp;
                        scollto(mainScroll);
                    }

                    db.transaction(function (tx) {
                        tx.executeSql("replace INTO User (id, LoginState, DeviceUserID) VALUES (?,?,?)", [1, "0", UserID], function (tx, res) {
                            ////alert("插入设备登录信息成功");
                        });
                    }, function (err) {
                        //alert('Open database my.db ERROR4: ' + err.message);
                    });
                }
                else {
                    //用户没有
                }
            }
            function ajax_fail1() {
            }
        }
        else {
            if (res.rows.item(0).LoginState == "0") {
                UserID = res.rows.item(0).DeviceUserID;
                UserStatus = "unlogin";
                if (GetQueryString("firstLoad") != "no"){
                    AllStock();
                }
                pageOnload();

                if( sessionStorage.pageScrollMhp == undefined ){
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    mainScroll = sessionStorage.pageScrollMhp;
                    scollto(mainScroll);
                }else{
                    mainScroll = sessionStorage.pageScrollMhp;
                    scollto(mainScroll);
                }
            }
            else {
                if (res.rows.item(0).LoginState == "1" || res.rows.item(0).LoginState == "2") {
                    UserID = res.rows.item(0).UserID;
                    UserStatus = "login";
                    $('#indexMy').attr('src',res.rows.item(0).UserImg);
                    if (GetQueryString("firstLoad") != "no"){
                        AllStock();
                    }
                    pageOnload();

                    if( sessionStorage.pageScrollMhp == undefined ){
                        sessionStorage.pageScrollMhp = document.body.scrollTop;
                        mainScroll = sessionStorage.pageScrollMhp;
                        scollto(mainScroll);
                    }else{
                        mainScroll = sessionStorage.pageScrollMhp;
                        scollto(mainScroll);
                    }

                }
            }
        }
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
                alert("itemListInAndSe3ERROR: " + e.message);
            });

        }
        else {
            //用户没有
        }
    }
    function ajax_fail() {
    }
}


function pageOnload() {
    //资讯页
    document.getElementById('imf').addEventListener("click", touchImf, false);
    //document.getElementById('decs').addEventListener("click", touchFore, false);
    //自选页
    document.getElementById('myChoice').addEventListener("click", touchMy, false);
    //个人主页
    document.getElementById('indexMy').addEventListener("click", touchMyIndex, false);

    //首页搜索
    document.getElementById('search_button').addEventListener('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();
        sessionStorage.pageScrollMhp = document.body.scrollTop;
        AddGoback('index.html?firstLoad=no', 'indexSearch.html');
    }, false);

    //更多资金流入流出
    document.getElementById('capitalFlow_more').addEventListener("click", touchCapitalmore, false);
    //更多热门事件
    document.getElementById('event_more').addEventListener("click", touchEventmore, false);
    //更多热门主题
    document.getElementById('topic_more').addEventListener("click", touchTopicmore, false);

    //投资组合
    document.getElementById('investGroups').addEventListener("click", touchGroup, false);
    //市场观点
    document.getElementById('viewPoints').addEventListener("click", touchLong, false);

    document.getElementById('viewPointsV').addEventListener("click", touchLong, false);

    //下单榜
    document.getElementById('stocksList').addEventListener("click", touchOrder, false);

    //股吧热度
    document.getElementById('stockBarHeat').addEventListener("click", touchStocksBar, false);
    //涨停复牌
    document.getElementById('limitUpResumption').addEventListener("click", touchLimitUpResumption, false);

    //龙虎榜
    document.getElementById('billboard').addEventListener("click", touchBillboard, false);
    //公告事件
    document.getElementById('noticeEvent').addEventListener("click", touchNoticeEvents, false);
    //盈利预测
    document.getElementById('forecasting').addEventListener("click", touchForecasting, false);
    //控制人变更
    document.getElementById('controlChange').addEventListener("click", touchControlChange, false);

    //document.addEventListener("backbutton", touchBack, false);

    ClearGoback();

    option1 = {
        tooltip : {
            trigger: 'axis'
            //position : function(p) {
            //    // 位置回调
            //    return [p[0] - 50, p[1] - 50];
            //}
        },
        legend: {
            data:['行情指数',"昨日收盘",'情绪指数'],
            selected:{
                '行情指数':true, '昨日收盘':true, '情绪指数':true
            },
            show:true,
            x:'center', y:'bottom',
            itemHeight: 8,
            itemGap:32,
            itemWidth: 12,
            //padding:[0,0,0,0],
            textStyle: { fontSize: 12,color:'#999' }
        },
        grid:{x:50,x2:40,y:35,y2:45},
        animationDuration:100,
        xAxis : [{
            type : 'category',
            boundaryGap : false,
            //splitNumber: 17,
            splitLine : {show: false},
            axisLine:{
                lineStyle:{
                    color: '#999',
                    width: 1,
                    type: 'solid'}
            },

            //axisTick:{
            //    interval:0,
            //    inside:true,
            //    lineStyle:{
            //        color: '#999',
            //        width: 1,
            //        type: 'solid'}
            //},
            axisLabel : {
                //inside:true,
                show:true,
                textStyle:{color: '#999'}
            }, data : []}],
        yAxis : [
            {
                name:"价格指数(元)",
                type : 'value',
                //boundaryGap:0.2,
                max:shMax,
                min:shMin,
                splitLine : {show: false},
                axisLine:{
                    lineStyle:{
                        color: '#999',
                        width: 1,
                        type: 'solid'}
                },
                axisTick:{
                    interval:0,
                    inside:true,
                    lineStyle:{
                        color: '#999',
                        width: 1,
                        type: 'solid'}
                },
                axisLabel : {

                    show:true, interval: 10, textStyle: {color:'#999',fontSize: 12}}, scale:true},
            {
                name:"情绪指数",
                type : 'value',
                boundaryGap:0.1,
                //boundaryGap:[0,0.5],
                min:0,
                splitLine : {show: false},
                axisLine:{
                    lineStyle:{
                        color: '#999',
                        width: 1,
                        type: 'solid'}
                },
                axisTick:{
                    interval:0,
                    inside:true,
                    lineStyle:{
                        color: '#999',
                        width: 1,
                        type: 'solid'}
                },
                axisLabel : {

                    show:true, interval: 10, textStyle: {color:'#999',fontSize: 12}},

                scale:true}],
        series : [
            {   name:'行情指数', type:'line',
                symbol:'rectangle',symbolSize:5|5,
                smooth:true, zlevel:2,z:1,
                itemStyle: {normal: {color:"#333333"}},
                data:[] },
            {   name:'情绪指数', type:'line',
                symbol:'circle',
                symbolSize:5|5,smooth:true, yAxisIndex:1, zlevel:2,z:2,
                itemStyle: {normal: {color:"#FFA049"}},
                data:[]},
            {   name:'昨日收盘',
                type:'line',
                symbol:'rectangle',
                symbolSize:0|0,
                //zlevel:2,z:1,
                itemStyle: {normal: {color:"#FB96FF"}},
                lineStyle:{normal: {type:'dashed'}},
                data:[]
            }
        ]
    };

    $(".LoadingCover").fadeOut();

    //加载置顶图
    bind_topSix();

    //加载上证指数
    myChart = echarts.init(document.getElementById('indexChartMain'));
    BlockPricesOnload();
    openDateSetDay();
    //openDaySetTime();

    //首页资金流入信息
    FlowOfSHIndex();

    //加载热门事件
    EventsOnload();

    //加载热门主题
    TopicsOnload();

    //加载热门投资组合
    InvestGroupOnload();

    //加载大V投资观点
    VipViewPointOnload();

    //openDaySetTime();
    //openDaySetTime();
    //BlockPricesOnload();

    $(".emotionLeft,.indexRight").on('click',ChartsClick);

    function ChartsClick(){
        //$(".ChartAnimationBox").animate("z-index", "30");
        //$(".ChartAnimationBox").animate({height:'210px'},100);
        $(".moreSwitch").attr("src","img/indexClose.png");

        $(".indexChartsDisplay").delay(100);
        $(".indexChartsDisplay").fadeIn(100);

        $(".emotionMainBox").animate({'z-index':'31'},50);
        $(".ChartMainBox").animate({'z-index':'30'},100);
        $(".ChartMainBox").animate({"opacity": "1"},100);

        $(".emotionLeft,.indexRight").unbind('click');

        $('.emotionLeft,.indexRight').on('click',function(e){
            //console.log("1");
            $(".indexChartsDisplay").fadeOut(100);
            $(".moreSwitch").attr("src","img/indexOpen.png");
            $(".emotionMainBox").animate({'z-index':'0'},50);
            $(".ChartMainBox").animate({'z-index':'-100'},50);
            $(".ChartMainBox").animate({"opacity": "0"},50);
            //$(".indexChartsDisplay").css("z-index", "-100");
            //$(".indexChartsDisplay").css("opacity", "0");
            //$(".indexChartsDisplay").css("height", "900px");

            $(".emotionLeft,.indexRight").unbind('click');
            $(".emotionLeft,.indexRight").on('click',ChartsClick);
        });

        $('.indexChartsDisplay').on('click',function(e){
            //console.log("1");
            $(".indexChartsDisplay").fadeOut(100);
            $(".moreSwitch").attr("src","img/indexOpen.png");
            $(".emotionMainBox").animate({'z-index':'0'},50);
            $(".ChartMainBox").animate({'z-index':'-100'},50);
            $(".ChartMainBox").animate({"opacity": "0"},50);
            //$(".indexChartsDisplay").css("z-index", "-100");
            //$(".indexChartsDisplay").css("opacity", "0");
            //$(".indexChartsDisplay").css("height", "900px");
            $(".emotionLeft,.indexRight").on('click',ChartsClick);

            $(".indexChartsDisplay").unbind('click');
        });

        $('.ChartMainBox').on('click',function(e){
            e.stopPropagation();
        });
    }



    //console.log(myDate.getHours());
//    30秒刷新数据（市场情绪与指数）
    setInterval(function(){
        if( myDate.getHours() >= 9 && myDate.getHours() < 15 && nowDayOfWeek != 6 && nowDayOfWeek != 7){
            //$(".indexSwitch>.indexSwitchBtn").unbind('click');

            openDaySetTime();
            openDateSetDay();
            //$(".indexRight").delay(100);
            if( indexOfChartDisplay  == 0 ){
                $(".indexRight").animate({backgroundColor: indexColorOfSH},100);
                $(".emotionLeft").animate({backgroundColor: emotionColorOfSH},100);
            }else if( indexOfChartDisplay  == 1 ){
                $(".indexRight").animate({backgroundColor: indexColorOfSZ},100);
                $(".emotionLeft").animate({backgroundColor: emotionColorOfSZ},100);
            }else if( indexOfChartDisplay  == 2 ){
                $(".indexRight").animate({backgroundColor: indexColorOfCB},100);
                $(".emotionLeft").animate({backgroundColor: emotionColorOfCB},100);
            }else{
                $(".indexRight").animate({backgroundColor: indexColorOfSH},100);
                $(".emotionLeft").animate({backgroundColor: emotionColorOfSH},100);
            }
            $(".indexRight").animate({backgroundColor: "#FFFFFF"},300);
            $(".emotionLeft").animate({backgroundColor: "#FFFFFF"},300);
        }
        //console.log(emotionsOfSHMin);
        //console.log(endTime);
    },30000);


//    10秒刷新数据（主题块）
    setInterval(function(){
        if( myDate.getHours() >= 9 && myDate.getHours() < 15 && nowDayOfWeek != 6 && nowDayOfWeek != 7){
            //解绑click
            $(".topicBox").unbind('click');
            //刷新数据，若数据出现改变则设定背景色变化
            TopicsOnDisplay();

            //随机生成一个变化色块（1/20概率出现）
            for( var i = 0 ; i < ifBlockColor.length; i++){
                if( Math.random() > 0.83 ){
                    ifBlockColor[i] = 1;
                }else{
                    ifBlockColor[i] = 0;
                }
            }
            //console.log(ifBlockColor);

            //色块闪烁动画
            for ( var j = 0; j < 6; j++ ){
                if( ifBlockColor[j] == 1){
                    $(".topicBox").eq(j).animate({backgroundColor: topicBlockColorList[j]},100);
                }
            }
            $(".topicBox").animate({backgroundColor: "#FFFFFF"},300);
        }

    },10000);


}




//加载大盘数据
function BlockPricesOnload() {
    //刷新每日分時時間

    StockTimeAxis[0] = "09:15";
    for( var min = 16 ; min < 60 ; min++ ){
        StockTimeAxis.push("09:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("10:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        StockTimeAxis.push("10:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("11:0"+min);
    }
    for( var min = 10 ; min <= 30 ; min++ ){
        StockTimeAxis.push("11:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("13:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        StockTimeAxis.push("13:"+min);
    }
    for( var min = 0 ; min < 10 ; min++ ){
        StockTimeAxis.push("14:0"+min);
    }
    for( var min = 10 ; min < 60 ; min++ ){
        StockTimeAxis.push("14:"+min);
    }
    StockTimeAxis.push("15:00");
    //console.log(StockTimeAxis);
    openDaySetTime();
    //openDateSetDay();
}



function openDateSetDay(){
    timeArr2 = [];
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=10","",true,ajax_successTD,ajax_failTD);
    function ajax_successTD(obj){
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 555 ){
                for(var i = 1; i < 6; i++){
                    timeArr2.unshift(obj[i].substring(5,10));
                }
            }else if( dateDiff3 >= 555 ){
                for(var i = 0; i < 5; i++){
                    timeArr2.unshift(obj[i].substring(5,10));
                }
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            for(var i = 0; i < 5; i++){
                timeArr2.unshift(obj[i].substring(5,10));
            }
        }
        DayPriceOnload();
        //console.log(timeArr2);
    }
    function ajax_failTD(){
        openDateSetDay();
    }
}


//分时图新API测试///////////////////////////////////////////////////////////////////////////////////////////////////////

function openDaySetTime(){
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    //var dateDiff2 = parseInt(getNowFormatDate(dateTemp1).substring(11,13));
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));

    //httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=0&count=1","",true,ajax_successTM,ajax_failTM);
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=2","",true,ajax_successTM,ajax_failTM);
    function ajax_successTM(obj){
        if( dateDiff1 == obj[0].substring(0,10) ){
            if(  dateDiff3 < 555 ){
                fromTimeOfStockByDay = Date.parse(obj[1])/1000;
                endTime = Date.parse(obj[1])/1000 + 86400;
            }else if( dateDiff3 >= 555 ){
                fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
                endTime = (Date.parse(new Date())/1000);
            }
        }else if( dateDiff1 != obj[0].substring(0,10) ){
            fromTimeOfStockByDay = Date.parse(obj[0])/1000;
            endTime = Date.parse(obj[0])/1000 + 86400;
        }
        //console.log(fromTimeOfStockByDay);
        //console.log(new Date(fromTimeOfStockByDay*1000).toLocaleString());
        //console.log(endTime);
        //console.log(new Date(endTime*1000).toLocaleString());
        NewChartOnload();
    }
    function ajax_failTM(){
        fromTimeOfStockByDay = Date.parse(StockSetTime)/1000;
        endTime = (Date.parse(new Date())/1000);
    }

}

function NewChartOnload() {
    //openDaySetTime();
    //endTime = (Date.parse(new Date())/1000);
    //console.log(   );
    //console.log(endTime);
    //console.log(StockTimeAxis);

    for (var ts = 0; ts < StockTimeAxis.length; ts++) {
        priceOfSHMin[ts] = "-";
        emotionsOfSHMin[ts] = "-";
        priceOfSZMin[ts] = "-";
        emotionsOfSZMin[ts] = "-";
        priceOfCBMin[ts] = "-";
        emotionsOfCBMin[ts] = "-";
    }

    //三指数
    //httpGet("Reader/StockHistory?type=2&stockId=sh000001&fromTime=" + fromTimeOfStockByDay + "&endTime=" + endTime, "", true, ajax_successNP1, ajax_failNP1);
    httpGet("Reader/StockPrice?type=2&stockIds=sh000001,sz399006,sz399001&fromTime=" + fromTimeOfStockByDay + "&endTime=" + endTime +"&count=0", "", true, ajax_successNP1, ajax_failNP1);
    function ajax_successNP1(obj) {

        if (obj != null && obj != "" && obj != undefined) {

            //上证分时数据
            var absMaxS1 = 0;
            for (var i = 0; i < obj["sh000001"].length; i++) {
                priceOfSHMin[xTimeListStockTransformMin(obj["sh000001"][i][0].substring(11, 16))] = returnFloat(obj["sh000001"][i][1]) ;

                for (var j = 0; j < priceOfSHMin.length; j++) {
                    settelmentOfSH[j] = returnFloat(obj["sh000001"][i][7]);
                }
                if( Math.abs(  obj["sh000001"][i][1] - obj["sh000001"][i][7] ) >= absMaxS1 ){
                    absMaxS1 = Math.abs( obj["sh000001"][i][1] - obj["sh000001"][i][7] )
                }
            }
            shMax = Math.round( obj["sh000001"][0][7] + absMaxS1 ) + 3;
            shMin = Math.round( obj["sh000001"][0][7] - absMaxS1 ) - 3;

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (priceOfSHMin[t] == "-" ) {
                    priceOfSHMin[t] = priceOfSHMin[t + 1];
                }
            }

            //深证分时数据
            var absMaxS2 = 0;
            for (var i = 0; i < obj["sz399001"].length; i++) {
                priceOfSZMin[xTimeListStockTransformMin(obj["sz399001"][i][0].substring(11, 16))] = returnFloat(obj["sz399001"][i][1]) ;

                for (var j = 0; j < priceOfSZMin.length; j++) {
                    settelmentOfSZ[j] = returnFloat(obj["sz399001"][i][7]);
                }
                if( Math.abs(  obj["sz399001"][i][1] - obj["sz399001"][i][7] ) >= absMaxS2 ){
                    absMaxS2 = Math.abs( obj["sz399001"][i][1] - obj["sz399001"][i][7] )
                }
            }
            szMax = Math.round( obj["sz399001"][0][7] + absMaxS2 ) + 3;
            szMin = Math.round( obj["sz399001"][0][7] - absMaxS2 ) - 3;

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (priceOfSZMin[t] == "-" ) {
                    priceOfSZMin[t] = priceOfSZMin[t + 1];
                }
            }

            //创业板分时数据
            var absMaxS3 = 0;
            for (var i = 0; i < obj["sz399006"].length; i++) {
                priceOfCBMin[xTimeListStockTransformMin(obj["sz399006"][i][0].substring(11, 16))] = returnFloat(obj["sz399006"][i][1]) ;

                for (var j = 0; j < priceOfCBMin.length; j++) {
                    settelmentOfCB[j] = returnFloat(obj["sz399006"][i][7]);
                }
                if( Math.abs(  obj["sz399006"][i][1] - obj["sz399006"][i][7] ) >= absMaxS3 ){
                    absMaxS3 = Math.abs( obj["sz399006"][i][1] - obj["sz399006"][i][7] )
                }
            }
            cbMax = Math.round( obj["sz399006"][0][7] + absMaxS3 ) + 3;
            cbMin = Math.round( obj["sz399006"][0][7] - absMaxS3 ) - 3;

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (priceOfCBMin[t] == "-" ) {
                    priceOfCBMin[t] = priceOfCBMin[t + 1];
                }
            }

        }
        NewLoadend();
        //console.log("上证指数:");
        //console.log(priceOfSHMin);
    }

    function ajax_failNP1() {
        console.log("加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });

    }


    //上证情绪
    httpGet("Reader/EmotionIndexs/sh000001?type=0&count=30&rate=2&datetime=" + endTime + "&fromTime=" + fromTimeOfStockByDay, "", true, ajax_successN1, ajax_failN1);
    function ajax_successN1(obj) {
        //console.log(obj);

        if (obj != null && obj != "" && obj != undefined) {
            //var emotionMark = obj[0].Emotion;
            var emotionMark02 = 0;
            var emotionMarkChangeArray02 = [];

            for (var i = 0; i < obj.length; i++) {
                emotionsOfSHMin[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))] = Math.round(obj[i].Emotion * 100) / 100;

                if( !isNaN( obj[i].Emotion )){
                    emotionMark02 += parseInt(obj[i].Emotion);
                }
                if (emotionMark02 != undefined && emotionMark02 != 0 && emotionMark02 != null) {
                    emotionMarkChangeArray02[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))] = returnFloat(( obj[i].Emotion - (emotionMark02 / (i + 1)) ) / (emotionMark02 / (i + 1)) * 100) + "%";
                    $(".shEmotionChange").text(emotionMarkChangeArray02[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))]);
                }


                if (obj[i].Emotion != undefined && obj[i].Emotion != null) {
                    $(".shEmotion").text(returnFloat(obj[i].Emotion));
                    //$(".shEmotionChange").text(emotionMarkChangeArray02[ i ]);
                    //console.log(emotionMarkChangeArray02);
                    if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) < 0) {
                        //console.log("1");
                        $(".shEmotion").css("color", "#20c062");
                        $(".shEmotionChange").css("color", "#20c062");
                        emotionColorOfSH = "#20c062";
                    } else if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) == 0) {
                        //console.log("2");
                        $(".shEmotion").css("color", "#333333");
                        $(".shEmotionChange").css("color", "#333333");
                        emotionColorOfSH = "#F74C59";
                    } else if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) > 0) {
                        //console.log("3");
                        $(".shEmotion").css("color", "#F74C59");
                        $(".shEmotionChange").css("color", "#F74C59");
                        emotionColorOfSH = "#F74C59";
                    } else {
                        //console.log("e");
                        $(".shEmotion").css("color", "#F74C59");
                        $(".shEmotionChange").css("color", "#F74C59");
                        emotionColorOfSH = "#F74C59";
                    }
                }

            }

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (emotionsOfSHMin[t] == "-" ) {
                    emotionsOfSHMin[t] = emotionsOfSHMin[t + 1];
                }
            }

        }
        NewLoadend();
        //console.log("上证情绪:");
        //console.log(emotionsOfSHMin);
    }

    function ajax_failN1() {
        console.log("加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
    }


    //创版情绪
    httpGet("Reader/EmotionIndexs/sz399006?type=0&count=30&rate=2&datetime="+endTime+"&fromTime="+fromTimeOfStockByDay,"",true,ajax_successN2,ajax_failN2);
    function ajax_successN2(obj){
        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined) {
            var emotionMark02 = 0;
            var emotionMarkChangeArray02 = [];
            for (var i = 0; i < obj.length; i++) {
                emotionsOfSZMin[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))] = Math.round(obj[i].Emotion * 100) / 100;

                if( !isNaN( obj[i].Emotion )){
                    emotionMark02 += parseInt(obj[i].Emotion);
                }
                if (emotionMark02 != undefined && emotionMark02 != 0 && emotionMark02 != null) {
                    emotionMarkChangeArray02[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))] = returnFloat((( obj[i].Emotion - (emotionMark02 / (i + 1)) ) / (emotionMark02 / (i + 1)) ) * 100) + "%";

                    //console.log(emotionMarkChangeArray02);

                    $(".szEmotionChange").text(emotionMarkChangeArray02[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))]);

                }

                //if( obj[i].Emotion != undefined && obj[i].Emotion != null ){
                //    $(".szEmotion").text(returnFloat(obj[i].Emotion));
                //}

                if (obj[i].Emotion != undefined && obj[i].Emotion != null) {
                    $(".szEmotion").text(returnFloat(obj[i].Emotion));

                    if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) < 0) {
                        $(".szEmotion").css("color", "#20c062");
                        $(".szEmotionChange").css("color", "#20c062");
                        emotionColorOfCB = "#20c062";
                    } else if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) == 0) {
                        $(".szEmotion").css("color", "#333333");
                        $(".szEmotionChange").css("color", "#333333");
                        emotionColorOfCB = "#F74C59";
                    } else if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) > 0) {
                        $(".szEmotion").css("color", "#F74C59");
                        $(".szEmotionChange").css("color", "#F74C59");
                        emotionColorOfCB = "#F74C59";
                    }
                }

            }


            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (emotionsOfSZMin[t] == "-" ) {
                    emotionsOfSZMin[t] = emotionsOfSZMin[t + 1];
                }
            }

        }
        NewLoadend();
        //console.log("创版情绪:");
        //console.log(emotionsOfSZMin);
    }

    function ajax_failN2() {
        console.log("加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
    }


    //深证情绪
    httpGet("Reader/EmotionIndexs/sz399001?type=0&count=30&rate=2&datetime=" + endTime + "&fromTime=" + fromTimeOfStockByDay, "", true, ajax_successN3, ajax_failN3);
    function ajax_successN3(obj) {
        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined) {
            var emotionMark02 = 0;
            var emotionMarkChangeArray02 = [];

            for (var i = 0; i < obj.length; i++) {
                emotionsOfCBMin[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))] = Math.round(obj[i].Emotion * 100) / 100;

                if( !isNaN( obj[i].Emotion )){
                    emotionMark02 += parseInt(obj[i].Emotion);
                }
                if (emotionMark02 != undefined && emotionMark02 != 0 && emotionMark02 != null) {
                    emotionMarkChangeArray02[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))] = returnFloat(( obj[i].Emotion - (emotionMark02 / (i + 1)) ) / (emotionMark02 / (i + 1)) * 100) + "%";

                    //console.log(obj[i].Emotion);
                    //console.log(emotionMark02);
                    $(".hsEmotionChange").text(emotionMarkChangeArray02[xTimeListStockTransformMin(obj[i].CreatTime.substring(11, 16))]);
                }


                //if( obj[i].Emotion != undefined && obj[i].Emotion != null ){
                //    $(".hsEmotion").text(returnFloat(obj[i].Emotion));
                //}

                if (obj[i].Emotion != undefined && obj[i].Emotion != null) {
                    $(".hsEmotion").text(returnFloat(obj[i].Emotion));

                    if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) < 0) {
                        $(".hsEmotion").css("color", "#20c062");
                        $(".hsEmotionChange").css("color", "#20c062");
                        emotionColorOfSZ = "#20c062";
                    } else if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) == 0) {
                        $(".hsEmotion").css("color", "#333333");
                        $(".hsEmotionChange").css("color", "#333333");
                        emotionColorOfSZ = "#F74C59";
                    } else if (( obj[i].Emotion - (emotionMark02 / (i + 1)) ) > 0) {
                        $(".hsEmotion").css("color", "#F74C59");
                        $(".hsEmotionChange").css("color", "#F74C59");
                        emotionColorOfSZ = "#F74C59";
                    }
                }

            }

            for (var t = StockTimeAxis.length-1 ; t > 1; t--) {
                if (emotionsOfCBMin[t] == "-" ) {
                    emotionsOfCBMin[t] = emotionsOfCBMin[t + 1];
                }
            }

        }
        NewLoadend();
        //console.log("沪深情绪:");
        //console.log(emotionsOfCBMin);
    }

    function ajax_failN3() {
        console.log("加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
    }


}


//图表按钮
function NewLoadend(){
    //console.log(flagNp);
    if( flagNp >= 9 ){
        flagNp = 0;
        $(".LoadingCover").fadeOut();
        option1.xAxis[0].data = StockTimeAxis;

        $(".indexSwitch>.indexSwitchBtn").unbind("click");
        $(".indexMainChartTimeSwitchBox>.indexMainChartTimeSwitchBtn").unbind("click");

        if( indexOfChartDisplay  == 0 ){

            if( timeSwitchListener == 0 ){
                myChart.clear();
                option1.xAxis[0].data = StockTimeAxis;
                option1.yAxis[0].max = shMax;
                option1.yAxis[0].min = shMin;
                option1.series[0].data = priceOfSHMin;
                option1.series[1].data = emotionsOfSHMin;
                option1.series[2].data = settelmentOfSH;
                myChart.setOption(option1);
            }else if( timeSwitchListener == 1  ){
                myChart.clear();
                option1.xAxis[0].data = timeArr2;
                option1.yAxis[0].max = null;
                option1.yAxis[0].min = null;
                option1.series[0].data = indexOfSH;
                option1.series[1].data = emotionsOfSH;
                option1.series[2].data = [];
                myChart.setOption(option1);
            }

        }else if( indexOfChartDisplay  == 1 ){
            if( timeSwitchListener == 0 ){
                myChart.clear();
                option1.xAxis[0].data = StockTimeAxis;
                option1.yAxis[0].max = szMax;
                option1.yAxis[0].min = szMin;
                option1.series[0].data = priceOfSZMin;
                option1.series[1].data = emotionsOfSZMin;
                option1.series[2].data = settelmentOfSZ;
                myChart.setOption(option1);
            }else if( timeSwitchListener == 1   ){
                myChart.clear();
                option1.xAxis[0].data = timeArr2;
                option1.yAxis[0].max = null;
                option1.yAxis[0].min = null;
                option1.series[0].data = indexOfSZ;
                option1.series[1].data = emotionsOfSZ;
                option1.series[2].data = [];
                myChart.setOption(option1);
            }
        }else if( indexOfChartDisplay  == 2 ){
            if(  timeSwitchListener == 0 ){
                myChart.clear();
                option1.xAxis[0].data = StockTimeAxis;
                option1.yAxis[0].max = cbMax;
                option1.yAxis[0].min = cbMin;
                option1.series[0].data = priceOfCBMin;
                option1.series[1].data = emotionsOfCBMin;
                option1.series[2].data = settelmentOfCB;
                myChart.setOption(option1);
            }else if(  timeSwitchListener == 1 ){
                myChart.clear();
                option1.xAxis[0].data = timeArr2;
                option1.yAxis[0].max = null;
                option1.yAxis[0].min = null;
                option1.series[0].data = indexOfCB;
                option1.series[1].data = emotionsOfCB;
                option1.series[2].data = [];
                myChart.setOption(option1);
            }
        }else{
            if( timeSwitchListener == 0 ){
                myChart.clear();
                option1.xAxis[0].data = StockTimeAxis;
                option1.yAxis[0].max = shMax;
                option1.yAxis[0].min = shMin;
                option1.series[0].data = priceOfSHMin;
                option1.series[1].data = emotionsOfSHMin;
                option1.series[2].data = settelmentOfSH;
                myChart.setOption(option1);
            }else if( timeSwitchListener == 1  ){
                myChart.clear();
                option1.xAxis[0].data = timeArr2;
                option1.yAxis[0].max = null;
                option1.yAxis[0].min = null;
                option1.series[0].data = indexOfSH;
                option1.series[1].data = emotionsOfSH;
                option1.series[2].data = [];
                myChart.setOption(option1);
            }
        }
        //myChart.setOption(option1);

        $(".indexSwitch>.indexSwitchBtn").each(function(index){

            $(this).on("click",function(){
                //console.log(index);
                $(".indexSwitch>.indexSwitchBtn").removeClass("selected");
                $(".emotionMainBox>.indexRight").removeClass("indexDisplay");
                $(".emotionMainBox>.emotionLeft").removeClass("display");
                //$(".emotionMainBox>.indexRight").removeClass("indexDisplay");
                $(this).addClass("selected");
                $(".emotionMainBox>.indexRight").eq(index).addClass("indexDisplay");
                $(".emotionMainBox>.emotionLeft").eq(index).addClass("display");
                //$(".emotionMainBox>.indexRight").eq(index).addClass("indexDisplay");
                if(index == 0){
                    if( timeSwitchListener == 0 ){
                        myChart.clear();
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.yAxis[0].max = shMax;
                        option1.yAxis[0].min = shMin;
                        option1.series[0].data = priceOfSHMin;
                        option1.series[1].data = emotionsOfSHMin;
                        option1.series[2].data = settelmentOfSH;
                        myChart.setOption(option1);
                    }else if( timeSwitchListener == 1  ){
                        myChart.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.yAxis[0].max = null;
                        option1.yAxis[0].min = null;
                        option1.series[0].data = indexOfSH;
                        option1.series[1].data = emotionsOfSH;
                        option1.series[2].data = [];
                        myChart.setOption(option1);
                    }

                    //myChart.clear();
                    indexOfChartDisplay  = 0;
                    //console.log("上证天")
                }else if(index ==1){

                    if( timeSwitchListener == 0 ){
                        myChart.clear();
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.yAxis[0].max = szMax;
                        option1.yAxis[0].min = szMin;
                        option1.series[0].data = priceOfSZMin;
                        option1.series[1].data = emotionsOfSZMin;
                        option1.series[2].data = settelmentOfSZ;
                        myChart.setOption(option1);
                    }else if( timeSwitchListener == 1   ){
                        myChart.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.yAxis[0].max = null;
                        option1.yAxis[0].min = null;
                        option1.series[0].data = indexOfSZ;
                        option1.series[1].data = emotionsOfSZ;
                        option1.series[2].data = [];
                        myChart.setOption(option1);
                    }

                    //console.log("深证天")
                    indexOfChartDisplay  = 1;
                }else if(index ==2){
                   if(  timeSwitchListener == 0 ){
                       myChart.clear();
                       option1.xAxis[0].data = StockTimeAxis;
                       option1.yAxis[0].max = cbMax;
                       option1.yAxis[0].min = cbMin;
                       option1.series[0].data = priceOfCBMin;
                       option1.series[1].data = emotionsOfCBMin;
                       option1.series[2].data = settelmentOfCB;
                       myChart.setOption(option1);
                   }else if(  timeSwitchListener == 1 ){
                       myChart.clear();
                       option1.xAxis[0].data = timeArr2;
                       option1.yAxis[0].max = null;
                       option1.yAxis[0].min = null;
                       option1.series[0].data = indexOfCB;
                       option1.series[1].data = emotionsOfCB;
                       option1.series[2].data = [];
                       myChart.setOption(option1);
                   }
                    //console.log("创业天")
                    indexOfChartDisplay  = 2;
                }else{
                    if( timeSwitchListener == 0 ){
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.yAxis[0].max = shMax;
                        option1.yAxis[0].min = shMin;
                        option1.series[0].data = priceOfSHMin;
                        option1.series[1].data = emotionsOfSHMin;
                        option1.series[2].data = settelmentOfSH;
                        myChart.setOption(option1);
                    }else if( timeSwitchListener == 1  ){
                        myChart.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.yAxis[0].max = null;
                        option1.yAxis[0].min = null;
                        option1.series[0].data = indexOfSH;
                        option1.series[1].data = emotionsOfSH;
                        option1.series[2].data = [];
                        myChart.setOption(option1);
                    }

                    //myChart.clear();
                    indexOfChartDisplay  = 0;
                    //console.log("bug")
                }
                $(".chartBox1>div.chart1Data.dataShow").removeClass("dataShow");
                $(".chartBox1>div.chart1Data").eq(index).addClass("dataShow");

                $(".chartBox1>div.chart1Data.dataShow").removeClass("dataShow");
                $(".chartBox1>div.chart1Data").eq(index+3).addClass("dataShow");


            })
        });





        $(".indexMainChartTimeSwitchBox>.indexMainChartTimeSwitchBtn").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".indexMainChartTimeSwitchBox>.indexMainChartTimeSwitchBtn").removeClass("selected");
                $(this).addClass("selected");

                if( index == 0){
                    option1.legend.data[1]="昨日收盘";
                    option1.legend.selected.昨日收盘=true;
                    if( indexOfChartDisplay == 0 ){
                        myChart.clear();
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.yAxis[0].max = shMax;
                        option1.yAxis[0].min = shMin;
                        option1.series[0].data = priceOfSHMin;
                        option1.series[1].data = emotionsOfSHMin;
                        option1.series[2].data = settelmentOfSH;
                        myChart.setOption(option1);
                        //console.log("上证天")
                    }else if( indexOfChartDisplay == 1 ){
                        myChart.clear();
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.yAxis[0].max = szMax;
                        option1.yAxis[0].min = szMin;
                        option1.series[0].data = priceOfSZMin;
                        option1.series[1].data = emotionsOfSZMin;
                        option1.series[2].data = settelmentOfSZ;
                        myChart.setOption(option1);
                        //console.log("创业天")
                    }else if( indexOfChartDisplay == 2 ){
                        myChart.clear();
                        option1.xAxis[0].data = StockTimeAxis;
                        option1.yAxis[0].max = cbMax;
                        option1.yAxis[0].min = cbMin;
                        option1.series[0].data = priceOfCBMin;
                        option1.series[1].data = emotionsOfCBMin;
                        option1.series[2].data = settelmentOfCB;
                        myChart.setOption(option1);
                        //console.log("沪深天")
                    }
                    timeSwitchListener = 0;

                }else if( index == 1){
                    option1.legend.data[1]="隐藏收盘";
                    option1.legend.selected.昨日收盘=false;
                    if( indexOfChartDisplay == 0 ){
                        myChart.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.yAxis[0].max = null;
                        option1.yAxis[0].min = null;
                        option1.series[0].data = indexOfSH;
                        option1.series[1].data = emotionsOfSH;
                        option1.series[2].data = [];
                        myChart.setOption(option1);
                        //console.log("上证天")
                    }else if( indexOfChartDisplay == 1 ){
                        myChart.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.yAxis[0].max = null;
                        option1.yAxis[0].min = null;
                        option1.series[0].data = indexOfSZ;
                        option1.series[1].data = emotionsOfSZ;
                        option1.series[2].data = [];
                        myChart.setOption(option1);
                        //console.log("深证天")
                    }else if( indexOfChartDisplay == 2 ){
                        myChart.clear();
                        option1.xAxis[0].data = timeArr2;
                        option1.yAxis[0].max = null;
                        option1.yAxis[0].min = null;
                        option1.series[0].data = indexOfCB;
                        option1.series[1].data = emotionsOfCB;
                        option1.series[2].data = [];
                        myChart.setOption(option1);
                        //console.log("创业板")
                    }
                    timeSwitchListener = 1;

                }
            })
        });





    }else{
        flagNp += 1;
    }

}



//加载五日数据
function DayPriceOnload(){
    //上证
    //天行情

    for (var ts = 0; ts < timeArr2.length; ts++) {
        indexOfSH[ts] = "-";
        emotionsOfSH[ts] = "-";
        indexOfCB[ts] = "-";
        emotionsOfCB[ts] = "-";
        indexOfSZ[ts] = "-";
        emotionsOfSZ[ts] = "-";
    }

    //console.log(timeArr2);
    //console.log(indexOfSH);

    httpGet("Reader/StockHistory?type=0&stockId=sh000001&fromTime=0&endTime=0&count=14","",true,ajax_success11,ajax_fail11);
    function ajax_success11(obj){
        if (obj != null && obj != "" && obj != undefined){
            //console.log(obj);
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                        indexOfSH[t] = returnFloat(obj[i].Trade);
                    }else{

                    }
                }
            }

            for( var idx = 0 ; idx < indexOfSH.length ; idx++){
                if( indexOfSH[idx] != "-" ){
                    $(".shPrice").text(returnFloat(indexOfSH[idx]));
                }
            }

            if( obj[obj.length-1].Changepercent < 0 ){
                $(".shPercent").text(returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".shPrice").css("color", "#20c062");
                $(".shPercent").css("color", "#20c062");
                //$(".shEmotion").css("color", "#20c062");
                indexColorOfSH = "#20c062";

            }else if(  obj[obj.length-1].Changepercent == 0 ){
                $(".shPercent").text(returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".shPrice").css("color", "#333333");
                $(".shPercent").css("color", "#333333");
                //$(".shEmotion").css("color", "#333333");
                indexColorOfSH = "#F74C59";

            }else if(  obj[obj.length-1].Changepercent > 0 ){
                $(".shPercent").text("+"+returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".shPrice").css("color", "#F74C59");
                $(".shPercent").css("color", "#F74C59");
                //$(".shEmotion").css("color", "#F74C59");
                indexColorOfSH = "#F74C59";
            }else{
                $(".shPercent").text("+"+returnFloat(obj[obj.length-1].Changepercent)+"%");
            }

            //console.log(indexOfSH);
            NewLoadend();
        }
    }
    function ajax_fail11(){
        console.log("上证天行情加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
        //$(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".chartBox1").css("z-index","-1");
        //$(".Load1 .loadingImg2").on("click",function(){
        //    $(".Load1 .loadingImg2").remove();
        //    $(".Load1 .notcontent").remove();
        //    $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
        //    BlockPricesOnload();
        //    $(".chartBox1").css("z-index","1");
        //});
    }

    //天情绪
    httpGet("Reader/EmotionIndexs/sh000001?type=0&count=14&rate=0&datetime=0","",true,ajax_success13,ajax_fail13);
    function ajax_success13(obj13){
        //console.log(obj13);
        if (obj13 != null && obj13 != "" && obj13 != undefined){
            var obj = obj13;
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].CreatTime.substring(5,10) == timeArr2[t]){
                        emotionsOfSH[t] = returnFloat(obj[i].Emotion);
                    }else{

                    }
                }
            }
            //console.log(emotionsOfSH);
            NewLoadend();
        }
    }
    function ajax_fail13(){
        console.log("上证天情绪加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
        //$(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".chartBox1").css("z-index","-1");
        //$(".Load1 .loadingImg2").on("click",function(){
        //    $(".Load1 .loadingImg2").remove();
        //    $(".Load1 .notcontent").remove();
        //    $(".Load1").html("<img src='img/loading.gzif' class='loadingImg2 LoadM'>");
        //    BlockPricesOnload();
        //    $(".chartBox1").css("z-index","1");
        //});
    }


    //创业板
    //天行情
    httpGet("Reader/StockHistory?type=0&stockId=sz399006&fromTime=0&endTime=0&count=14","",true,ajax_success21,ajax_fail21);
    function ajax_success21(obj){
        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined){
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                        indexOfCB[t] = returnFloat(obj[i].Trade);
                    }else{

                    }
                }
            }

            for( var idx = 0 ; idx < indexOfCB.length ; idx++){
                if( indexOfCB[idx] != "" ){
                    $(".szPrice").text(returnFloat(indexOfCB[idx]));
                }
            }

            //$(".szPrice").text(returnFloat(indexOfCB[indexOfCB.length-1]));

            if( obj[obj.length-1].Changepercent < 0 ){
                $(".szPercent").text(returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".szPrice").css("color", "#20c062");
                $(".szPercent").css("color", "#20c062");
                //$(".shEmotion").css("color", "#20c062");
                indexColorOfCB = "#20c062";

            }else if(  obj[obj.length-1].Changepercent == 0 ){
                $(".szPercent").text(returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".szPrice").css("color", "#333333");
                $(".szPercent").css("color", "#333333");
                //$(".shEmotion").css("color", "#333333");
                indexColorOfCB = "#F74C59";

            }else if(  obj[obj.length-1].Changepercent > 0 ){
                $(".szPercent").text("+"+returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".szPrice").css("color", "#F74C59");
                $(".szPercent").css("color", "#F74C59");
                //$(".shEmotion").css("color", "#F74C59");
                indexColorOfCB = "#F74C59";
            }else{
                $(".szPercent").text("+"+returnFloat(obj[obj.length-1].Changepercent)+"%");
            }

            //console.log(indexOfSZ);
            NewLoadend();
        }
    }
    function ajax_fail21(){
        console.log("创版天行情加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
        //$(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".chartBox1").css("z-index","-1");
        //$(".Load1 .loadingImg2").on("click",function(){
        //    $(".Load1 .loadingImg2").remove();
        //    $(".Load1 .notcontent").remove();
        //    $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
        //    BlockPricesOnload();
        //    $(".chartBox1").css("z-index","1");
        //});
    }
    //天情绪
    httpGet("Reader/EmotionIndexs/sz399006?type=0&count=14&rate=0&datetime=0","",true,ajax_success23,ajax_fail23);
    function ajax_success23(obj23){
        if (obj23 != null && obj23 != "" && obj23 != undefined){
            //console.log(obj23);
            var obj = obj23;
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].CreatTime.substring(5,10) == timeArr2[t]){
                        emotionsOfCB[t] = returnFloat(obj[i].Emotion);
                    }else{

                    }
                }
            }

            //console.log(emotionsOfSZ);


            NewLoadend();
        }
    }
    function ajax_fail23(){
        console.log("创业天情绪加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
        //$(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".chartBox1").css("z-index","-1");
        //$(".Load1 .loadingImg2").on("click",function(){
        //    $(".Load1 .loadingImg2").remove();
        //    $(".Load1 .notcontent").remove();
        //    $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
        //    BlockPricesOnload();
        //    $(".chartBox1").css("z-index","1");
        //});
    }

    //深证
    //天行情
    httpGet("Reader/StockHistory?type=0&stockId=sz399001&fromTime=0&endTime=0&count=10","",true,ajax_success31,ajax_fail31);
    function ajax_success31(obj){
        if (obj != null && obj != "" && obj != undefined){
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].Ticktime.substring(5,10) == timeArr2[t]){
                        indexOfSZ[t] = returnFloat(obj[i].Trade);
                    }else{

                    }
                }
            }

            for( var idx = 0 ; idx < indexOfSZ.length ; idx++){
                if( indexOfSZ[idx] != "" ){
                    $(".hsPrice").text(returnFloat(indexOfSZ[idx]));
                }
            }

            //$(".hsPrice").text(returnFloat(indexOfSZ[indexOfSZ.length-1]));

            if( obj[obj.length-1].Changepercent < 0 ){
                $(".hsPercent").text(returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".hsPrice").css("color", "#20c062");
                $(".hsPercent").css("color", "#20c062");
                //$(".shEmotion").css("color", "#20c062");
                indexColorOfSZ = "#20c062";

            }else if(  obj[obj.length-1].Changepercent == 0 ){
                $(".hsPercent").text(returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".hsPrice").css("color", "#333333");
                $(".hsPercent").css("color", "#333333");
                //$(".shEmotion").css("color", "#333333");
                indexColorOfSZ = "#F74C59";

            }else if(  obj[obj.length-1].Changepercent > 0 ){
                $(".hsPercent").text("+"+returnFloat(obj[obj.length-1].Changepercent)+"%");
                $(".hsPrice").css("color", "#F74C59");
                $(".hsPercent").css("color", "#F74C59");
                //$(".shEmotion").css("color", "#F74C59");
                indexColorOfSZ = "#F74C59";
            }else{
                $(".hsPrice").text("+"+returnFloat(obj[obj.length-1].Changepercent)+"%");
            }

            //console.log(indexOfSZ);
            NewLoadend();
        }
    }
    function ajax_fail31(){
        console.log("深证天行情加载失败");
        $(".LoadingCover").html("<img src='img/logo.png' class='loadingImg'><span class='loadingSpan'>加载失败，点击重新加载</span>");
        //$(".LoadingCover").css("z-index","5");
        $(".LoadingCover .loadingImg").on("click",function(){
            $(".LoadingCover .loadingImg").remove();
            $(".LoadingCover .loadingSpan").remove();
            $(".LoadingCover").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            openDaySetTime();
            openDateSetDay();
        });
        //$(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".chartBox1").css("z-index","-1");
        //$(".Load1 .loadingImg2").on("click",function(){
        //    $(".Load1 .loadingImg2").remove();
        //    $(".Load1 .notcontent").remove();
        //    $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
        //    BlockPricesOnload();
        //    $(".chartBox1").css("z-index","1");
        //});
    }

    //天情绪
    httpGet("Reader/EmotionIndexs/sz399001?type=0&count=10&rate=0&datetime=0","",true,ajax_success33,ajax_fail33);
    function ajax_success33(obj33){
        if (obj33 != null && obj33 != "" && obj33 != undefined){
            var obj = obj33;
            for (var i = 0; i < obj.length; i++) {
                for(var t = 0; t < timeArr2.length ; t++){
                    if( obj[i].CreatTime.substring(5,10) == timeArr2[t]){
                        emotionsOfSZ[t] = returnFloat(obj[i].Emotion);
                    }else{

                    }
                }
            }
            NewLoadend();
        }
    }
    function ajax_fail33(){
        console.log("深证天情绪加载失败");
        //$(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".chartBox1").css("z-index","-1");
        //$(".Load1 .loadingImg2").on("click",function(){
        //    $(".Load1 .loadingImg2").remove();
        //    $(".Load1 .notcontent").remove();
        //    $(".Load1").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
        //    BlockPricesOnload();
        //    $(".chartBox1").css("z-index","1");
        //});
    }
}

//首页资金流入信息
function FlowOfSHIndex(){

    if( sessionStorage.dataHp02 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/CapitalFlow/sh000001?type=0&skipHour=1&fromTime="+(endTime - 259200)+"&endTime="+endTime+"&onlyMainForce=false","",true,ajax_successFS,ajax_failFS);
    }else{
        cacheData02 = JSON.parse(sessionStorage.dataHp02);
        ajax_successFS(cacheData02);
    }

    function ajax_successFS(obj){
        sessionStorage.dataHp02=JSON.stringify(obj);

        if(obj != null && obj != "" && obj != undefined){
            if( obj[obj.length-1].MainForce >= 0 ){
                $(".capitalMpageForceInSH").text(returnFloat(obj[obj.length-1].MainForce/10000));
            }else if( obj[obj.length-1].MainForce < 0){
                $(".capitalMpageForceInIOTextSH").text("流出");
                $(".capitalMpageForceInSH").text(returnFloat(obj[obj.length-1].MainForce/10000*(-1)));
                $(".ForceInOfSH").css("color","#20c062");
            }
            $(".Load0").css("display","none");
        }else{
            $(".capitalMpageImf").css("display","none");
            $(".Load0").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");

            $(".Load0").css("z-index","5");
            $(".Load0 .loadingImg2").on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".Load0 .loadingImg2").remove();
                $(".Load0 .notcontent").remove();
                $(".Load0").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
                FlowOfSHIndex();
            });
        }

    }

    function ajax_failFS(obj){
        console.log("资金流数据加载失败");
        $(".Load0").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");

        $(".Load0").css("z-index","5");
        $(".Load0 .loadingImg2").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".Load0 .loadingImg2").remove();
            $(".Load0 .notcontent").remove();
            $(".Load0").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            FlowOfSHIndex();
        });
    }



    if( sessionStorage.dataHp03 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/CapitalFlow/sz399006?type=0&skipHour=1&fromTime="+(endTime - 259200)+"&endTime="+endTime+"&onlyMainForce=false","",true,ajax_successFSCB,ajax_failFSCB);
    }else{
        cacheData03 = JSON.parse(sessionStorage.dataHp03);
        ajax_successFSCB(cacheData03);
    }

    function ajax_successFSCB(obj){
        sessionStorage.dataHp03=JSON.stringify(obj);

        if(obj != null && obj != "" && obj != undefined){
            if( obj[obj.length-1].MainForce >= 0 ){
                $(".capitalMpageForceInCB").text(returnFloat(obj[obj.length-1].MainForce/10000));
            }else if( obj[obj.length-1].MainForce < 0){
                $(".capitalMpageForceInIOTextCB").text("流出");
                $(".capitalMpageForceInCB").text(returnFloat(obj[obj.length-1].MainForce/10000*(-1)));
                $(".ForceInOfCB").css("color","#20c062");
            }
            $(".Load0").css("display","none");
        }else{
            $(".capitalMpageImf").css("display","none");
            $(".Load0").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");

            $(".Load0").css("z-index","5");
            $(".Load0 .loadingImg2").on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".Load0 .loadingImg2").remove();
                $(".Load0 .notcontent").remove();
                $(".Load0").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
                FlowOfSHIndex();
            });
        }

    }

    function ajax_failFSCB(obj){
        console.log("资金流数据加载失败");
        $(".Load0").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");

        $(".Load0").css("z-index","5");
        $(".Load0 .loadingImg2").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".Load0 .loadingImg2").remove();
            $(".Load0 .notcontent").remove();
            $(".Load0").html("<img src='img/loading.gif' class='loadingImg2 LoadM'>");
            FlowOfSHIndex();
        });
    }


}



//加载热门事件
function EventsOnload() {
    if( sessionStorage.dataHp04 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/Events?sortType=2&count=3","",true,ajax_success4,ajax_fail4);

    }else{
        cacheData04 = JSON.parse(sessionStorage.dataHp04);
        ajax_success4(cacheData04);
    }

    function ajax_success4(obj){
        sessionStorage.dataHp04=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined && obj != []){
            //console.log(obj);
            for (var e = 0; e < obj.length; e++) {
                $(".eventsMainBox").append("" +
                "<div class='eventBox'> " +
                "<div  class='eventNumMain'></div> " +
                "<span class='eventTitle'></span> " +
                "<div class='eventSummary'></div> " +
                "<span class='eventPubtime'></span>" +
                "<span class='basicTextPub'>更新</span>" +
                "<span class='basicText1' style='margin-left: 10px;'>追踪</span>" +
                "<span class='basicText1 eventLastTime'></span>" +
                "<img  class='stockTrendIcon' src='img/risetag.png'> " +
                "<div class='stockName1'></div> " +
                "<span class='stockChange1'></span> </div>"+
                //"<div id='hotEvents" + e + "' class='eventsBox'> " +
                //"<div class='eventsItemBox1'> <div class='eventNumMain'></div> <span class='articleTitle'>事件标题</span> <div class='heatdiv'></div> </div> " +
                //"<div class='eventsItemBox2'> <span>更新时间:</span> <span class='issueTime'></span><span>热度持续:</span> <span class='lasting'></span></div>" +
                //"<div class='eventsItemBox2 eventStocksList'> <span>相关个股:</span> <span class='sharesAbout1'></span> <span class='sharesAbout2'></span></div>" +
                //"<div class='eventsItemBox3'> " +
                //    //"<img class='Tagpic' src='img/tag.png'> " +
                //"<div class='eventTag tag1'></div><div class='eventTag tag2'></div><div class='eventTag tag3'></div></div>" +
                "");
            }
            for (var m = 0; m < obj.length; m++) {
                $(".eventsMainBox .eventBox").eq(m).attr("itemId", obj[m].EventID);
                $(".eventsMainBox .eventTitle").eq(m).text(obj[m].Title);
                $(".eventsMainBox .eventNumMain").eq(m).text((m+1));

                //$(".hotEventsBox .heat").eq(m).text(obj[m].HotLevel);
                if (obj[m].LastAppear > 0) {
                    $(".eventsMainBox .eventPubtime").eq(m).text(getTimeDiff(obj[m].LastAppear));
                }
                if (obj[m].FirstAppear > 0) {
                    $(".eventsMainBox .eventLastTime").eq(m).text(timeBetween(obj[m].FirstAppear,obj[m].LastAppear));
                }
                if( redTimeDiff(obj[m].FirstAppear) == 'colorr'){
                    $(".eventsMainBox .eventLastTime").eq(m).css("color","#fd3642");
                }
                if (obj[m].Topic != null && obj[m].Topic != "") {
                    $(".eventsMainBox .themeName").eq(m).text(obj[m].Topic.TopicName);
                }
                if (obj[m].RelateStocks != null && obj[m].RelateStocks != "") {
                    if (obj[m].RelateStocks.length == 1) {
                        $(".eventsMainBox .stockName1").eq(m).text(obj[m].RelateStocks[0].Stock.Name);
                        if( obj[m].RelateStocks[0].Stock.Changepercent >= 0){
                            $(".eventsMainBox .stockChange1").eq(m).text("+"+returnFloat(obj[m].RelateStocks[0].Stock.Changepercent)+"%");
                        }else{
                            $(".eventsMainBox .stockChange1").eq(m).text(returnFloat(obj[m].RelateStocks[0].Stock.Changepercent)+"%");

                            $(".eventsMainBox .stockChange1").eq(m).css("color","#00C167");
                            $(".eventsMainBox .stockName1").eq(m).css("color","#00C167");
                            $(".eventsMainBox .stockTrendIcon").eq(m).attr("src","img/falltag.png");

                        }
                    } else if (obj[m].RelateStocks.length >= 2) {
                        $(".eventsMainBox .stockName1").eq(m).text(obj[m].RelateStocks[0].Stock.Name);
                        if( obj[m].RelateStocks[0].Stock.Changepercent >= 0){
                            $(".eventsMainBox .stockChange1").eq(m).text("+"+returnFloat(obj[m].RelateStocks[0].Stock.Changepercent)+"%");
                        }else{
                            $(".eventsMainBox .stockChange1").eq(m).text(returnFloat(obj[m].RelateStocks[0].Stock.Changepercent)+"%");
                            $(".eventsMainBox .stockChange1").eq(m).css("color","#00C167");
                            $(".eventsMainBox .stockName1").eq(m).css("color","#00C167");
                            $(".eventsMainBox .stockTrendIcon").eq(m).attr("src","img/falltag.png");
                        }
                        //$(".eventsMainBox .sharesAbout2").eq(m).text(obj[m].RelateStocks[1].Stock.Name);
                    }
                } else {
                    $(".eventsMainBox .eventStocksList").eq(m).css("display", "none");
                    $(".eventsMainBox .stockTrendIcon").eq(m).css("display", "none");
                }
                //if( obj[m].Tag == null || obj[m].Tag ==[] || obj[m].Tag.length ==0 ){
                //    $(".Tagpic").eq(m).css("display","none");
                //}
                //for (var tg = 0; tg < obj[m].Tag.length; tg++) {
                //    if (tg >= 3) {break;}
                //    if( tg == (obj[m].Tag.length-1) || tg == 2){
                //        $(".hotEventsBox .tag" + (tg + 1)).eq(m).text(obj[m].Tag[tg]);
                //    }else{
                //        $(".hotEventsBox .tag" + (tg + 1)).eq(m).text(obj[m].Tag[tg]);
                //    }
                //    $(".tag" + (tg + 1)).eq(m).css("display", "inline-block");
                //}
                //if (obj[m].Scope != null && obj[m].Scope != "") {
                //    $(".eventsMainBox .influenceScope").eq(m).text(obj[m].Scope);
                //}
                //if (obj[m].Type != null && obj[m].Type != "") {
                //    $(".eventsMainBox .InfluenceDegree").eq(m).text(obj[m].Type);
                //}
            }

            $(".eventsMainBox .eventNumMain").eq(0).css("background-color","#FE3A3C");
            $(".eventsMainBox .eventNumMain").eq(1).css("background-color","#FF5825");
            $(".eventsMainBox .eventNumMain").eq(2).css("background-color","#FFB835");
            //loadendScroll();
            //$(".Load2").css("display","none");

            //pageLocationChange
            $(".eventBox").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', 'opportunityPage2o1_EventDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);

                    //window.location.href ='opportunityPage2o1_EventDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;

                    //slide('left','lightblue',1,'opportunityPage2o1_EventDetails.html?itemId='+$(this).attr("itemId")+'&from=-1'+'&scroll='+document.body.scrollTop);
                    //parent.location='opportunityPage2o1_EventDetails.html?itemId='+$(this).attr("itemId")+'&from=-1';
                })
            });
            //$(".follow_btn,.follow_btnU").each(function(){
            //    $(this).on("click",function(event){
            //        event.stopPropagation();
            //        if ($(this).attr("state") == "on"){
            //            $(this).removeClass("follow_btn");
            //            $(this).addClass("follow_btnU");
            //            $(this).attr("state","off");
            //            $(this).text("已跟踪");
            //            //console.log($(this).parent().attr("itemId"));
            //        }else{
            //            $(this).removeClass("follow_btnU");
            //            $(this).addClass("follow_btn");
            //            $(this).attr("state","on");
            //            $(this).text("跟踪");
            //        }
            //    })
            //})
            $(".Load1").css("display","none");
        }else{
            //$(".eventsMainBox").css("display","none");
            $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load1 .loadingImg2").on("click",function(){
                $(".Load1 .loadingImg2").remove();
                $(".Load1 .notcontent").remove();
                $(".Load1").html("<img src='img/loading.gif' class='loadingImg2'>");
                EventsOnload();
            });
        }
    }
    function ajax_fail4(){
        console.log("热门事件加载失败");

        //$(".eventsMainBox").css("display","none");
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2'>");
            EventsOnload();
        });
    }

}

//加载热门主题榜
function TopicsOnload() {

    if( sessionStorage.dataHp05 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/Topics?sortType=2&count=7","",true,ajax_success5,ajax_fail5);

    }else{
        cacheData05 = JSON.parse(sessionStorage.dataHp05);
        ajax_success5(cacheData05);
    }

    function ajax_success5(obj){
        sessionStorage.dataHp05=JSON.stringify(obj);

        if (obj != null && obj != "" && obj != undefined){
            //var topicsAmount = 3;
            //var colorlist = ["#ff8903", "#f5a623", "#ffc039"];

            topicDataTemp = obj;
            if( obj != null && obj != "" && obj != undefined) {
                for (var e = 0; e < obj.length; e++) {
                    if( e >= 6 ){
                        break;
                    }

                    $(".topicMainBox").append("" +
                    "<div class='topicBox'> " +
                    "<span class='topicName'></span> " +
                    "<span class='topicChange'></span> " +
                    "<span class='topicFSstock'>华泰证券</span> " +
                    "<span class='topicFSstockChange'>-0.31%</span> </div>" +
                    //"<div id='themeid_r" + e + "' class='themeBox'> " +
                    //"<div class='themeImfBox1'> <span>平均涨跌幅</span> <span class='percentageOfTopic'></span>  </div> " +
                    //"<div class='themeImfBox2'> " +
                    //"<span class='themeTitle'>主题题目</span> " +
                    //"<span class='themeKey'>重点内容</span> " +
                    //"<span class='themeTime3'></span>" +
                    //"<br><span>热度</span> <span class='heat'>****</span> <span>加速度</span> <span class='acceleration'>****</span>" +
                    //"<br><span>相关个股:</span> <span class='sharesAbout1'></span> <span class='sharesAbout2'></span> <span class='sharesAbout3'></span>" +
                    //"</div> " +
                    //"<div class='clear'></div> </div>" +
                    "");

                    if( obj[e].TopicId != null && obj[e].TopicId != undefined){
                        $(".topicMainBox .topicBox").eq(e).attr("itemId", obj[e].TopicId);
                    }
                    $(".topicMainBox .topicName").eq(e).text(obj[e].TopicName);
                    //$(".topicMainBox .heat").eq(e).text(obj[e].HotValue);
                    //$(".topicMainBox .acceleration").eq(e).text(obj[e].SpeedValue);
                    //$(".topicMainBox .themeImfBox1").eq(e).css({backgroundColor: colorlist[e]});
                    //if( obj[e].Summury != null && obj[e].Summury != "" && obj[e].Summury != {}){
                    //    $(".topicMainBox .themeKey").eq(e).text(obj[e].Summury);
                    //}else{
                    //    $(".topicMainBox .themeKey").eq(e).text("暂无主题内容概括");
                    //}

                    if( obj[e].Changepercent != null && obj[e].Changepercent != undefined ){
                        if( obj[e].Changepercent >= 0 ){
                            $(".topicMainBox .topicChange").eq(e).text("+"+returnFloat(obj[e].Changepercent)+"%");
                            $(".topicMainBox .topicChange").eq(e).css("color","#F74C59");
                            topicBlockColorList[e] = "#F74C59";
                        }else if( obj[e].Changepercent  < 0 ){
                            $(".topicMainBox .topicChange").eq(e).text(returnFloat(obj[e].Changepercent)+"%");
                            $(".topicMainBox .topicChange").eq(e).css("color","#20c062");
                            topicBlockColorList[e] = "#20c062";
                        }
                    }else{
                        $(".topicMainBox .percentageOfTopic").eq(e).text("--.--%");
                    }

                    if( obj[e].Stocks != null && obj[e].Stocks != [] && obj[e].Stocks != ""){
                        //$(".topicMainBox .themeTime3").eq(e).text(getDateDiff(dateTrans(obj[e].Stocks[0].Stock.Ticktime)));
                        //if( redDateDiff(dateTrans(obj[e].Stocks[0].Stock.Ticktime)) == 'colorr'){
                        //    $(".topicMainBox .themeTime3").eq(e).css("color","#fd3642");
                        //}

                        //for( var s = 0 ; s < obj[e].Stocks.length; s ++ ){
                            $(".topicMainBox .topicFSstock").eq(e).text(obj[e].Stocks[0].Stock.Name);
                            if( obj[e].Stocks[0].Stock.Changepercent >= 0 ){
                                $(".topicMainBox .topicFSstockChange").eq(e).text("+"+returnFloat(obj[e].Stocks[0].Stock.Changepercent)+"%");
                            }else{
                                $(".topicMainBox .topicFSstockChange").eq(e).text(returnFloat(obj[e].Stocks[0].Stock.Changepercent)+"%");
                                $(".topicMainBox .topicFSstockChange").eq(e).css("color","#20c062");
                            }

                        //}
                    }else{
                        //$(".topicMainBox .topicFSstock").eq(e).text("暂无");
                    }

                    //if( obj[e].Articles != null && obj[e].Articles != "" && obj[e].Articles != []) {
                    //    $(".topicMainBox .themeTime3").eq(e).text(getDateDiff(dateTrans(obj[e].Articles[0].PubDate)));
                    //}

                }
            }else{
                $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
                $(".Load2 .loadingImg2").on("click",function(){
                    $(".Load2 .loadingImg2").remove();
                    $(".Load2 .notcontent").remove();
                    $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
                    TopicsOnload();
                });
            }
            //loadendScroll();
            //$(".Load3").css("display","none");
            //pageLocationChange
            $(".topicBox").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=-1'+'&scroll='+document.body.scrollTop);
                    //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from=-1";
                })
            });

            $(".Load2").css("display", "none");
        }else{
            $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
            $(".Load2 .loadingImg2").on("click",function(){
                $(".Load2 .loadingImg2").remove();
                $(".Load2 .notcontent").remove();
                $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
                EventsOnload();
            });
        }
    }

    function ajax_fail5(){
        console.log("上升主题加载失败");
        //$(".topicMainBox").css("display","none");
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
            EventsOnload();
        });

    }
}

//热门主题数据刷新
function TopicsOnDisplay() {
    httpGet("Reader/Topics?sortType=2&count=6","",true,ajax_success5,ajax_fail5);
    function ajax_success5(obj){
        sessionStorage.dataHp05=JSON.stringify(obj);
        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined){
            //var topicsAmount = 3;
            //var colorlist = ["#ff8903", "#f5a623", "#ffc039"];
            if( obj != null && obj != "" && obj != undefined) {
                for (var e = 0; e < obj.length; e++) {
                    if( e >= obj.length ){
                        break;
                    }
                    if( obj[e].TopicId != null && obj[e].TopicId != undefined){
                        $(".topicMainBox .topicBox").eq(e).attr("itemId", obj[e].TopicId);
                    }
                    $(".topicMainBox .topicName").eq(e).text(obj[e].TopicName);
                    //$(".topicMainBox .heat").eq(e).text(obj[e].HotValue);
                    //$(".topicMainBox .acceleration").eq(e).text(obj[e].SpeedValue);
                    //$(".topicMainBox .themeImfBox1").eq(e).css({backgroundColor: colorlist[e]});
                    //if( obj[e].Summury != null && obj[e].Summury != "" && obj[e].Summury != {}){
                    //    $(".topicMainBox .themeKey").eq(e).text(obj[e].Summury);
                    //}else{
                    //    $(".topicMainBox .themeKey").eq(e).text("暂无主题内容概括");
                    //}

                    if( obj[e].Changepercent != null && obj[e].Changepercent != undefined ){
                        if( obj[e].Changepercent >= 0 ){
                            $(".topicMainBox .topicChange").eq(e).text("+"+returnFloat(obj[e].Changepercent)+"%");
                            $(".topicMainBox .topicChange").eq(e).css("color","#F74C59");
                            topicBlockColorList[e] = "#F74C59";
                        }else if( obj[e].Changepercent  < 0 ){
                            $(".topicMainBox .topicChange").eq(e).text(returnFloat(obj[e].Changepercent)+"%");
                            $(".topicMainBox .topicChange").eq(e).css("color","#20c062");
                            topicBlockColorList[e] = "#20c062";
                        }
                    }else{
                        $(".topicMainBox .percentageOfTopic").eq(e).text("--.--%");
                    }

                    if( obj[e].Stocks != null && obj[e].Stocks != [] && obj[e].Stocks != ""){
                        //$(".topicMainBox .themeTime3").eq(e).text(getDateDiff(dateTrans(obj[e].Stocks[0].Stock.Ticktime)));
                        //if( redDateDiff(dateTrans(obj[e].Stocks[0].Stock.Ticktime)) == 'colorr'){
                        //    $(".topicMainBox .themeTime3").eq(e).css("color","#fd3642");
                        //}

                        //for( var s = 0 ; s < obj[e].Stocks.length; s ++ ){
                        $(".topicMainBox .topicFSstock").eq(e).text(obj[e].Stocks[0].Stock.Name);
                        if( obj[e].Stocks[0].Stock.Changepercent >= 0 ){
                            $(".topicMainBox .topicFSstockChange").eq(e).text("+"+returnFloat(obj[e].Stocks[0].Stock.Changepercent)+"%");
                        }else{
                            $(".topicMainBox .topicFSstockChange").eq(e).text(returnFloat(obj[e].Stocks[0].Stock.Changepercent)+"%");
                            $(".topicMainBox .topicFSstockChange").eq(e).css("color","#20c062");
                        }

                        //}
                    }else{
                        //$(".topicMainBox .topicFSstock").eq(e).text("暂无");
                    }

                    //if( obj[e].Articles != null && obj[e].Articles != "" && obj[e].Articles != []) {
                    //    $(".topicMainBox .themeTime3").eq(e).text(getDateDiff(dateTrans(obj[e].Articles[0].PubDate)));
                    //}

                    if( topicDataTemp[e].TopicId != obj[e].TopicId  ||
                        topicDataTemp[e].Changepercent != obj[e].Changepercent ||
                        topicDataTemp[e].Stocks[0].Stock.Name != obj[e].Stocks[0].Stock.Name ||
                        topicDataTemp[e].Stocks[0].Stock.Changepercent != obj[e].Stocks[0].Stock.Changepercent ){

                        ifBlockColor[e] = 1;
                    }
                }
            }else{
                $(".topicMainBox").css("display","none");
                //$(".Load3").css("display","none");
            }
            //loadendScroll();
            //$(".Load3").css("display","none");


            //pageLocationChange
            $(".topicBox").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=-1'+'&scroll='+document.body.scrollTop);
                    //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from=-1";
                })
            });


            $(".Load2").css("display", "none");
        }else{
            $(".topicMainBox").css("display","none");
            $(".Load2").css("display","none");
        }
    }

    function ajax_fail5(){
        console.log("上升主题加载失败");
        $(".topicMainBox").css("display","none");

        //$(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        //$(".Load3 .loadingImg2").on("click",function(){
        //    $(".Load3 .loadingImg2").remove();
        //    $(".Load3 .notcontent").remove();
        //    $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
        //    TopicsOnload();
        //});
    }
}

//InvestGroupOnload
//加载首页投资组合
function InvestGroupOnload() {

    if( sessionStorage.dataHp06 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/InvestGroups?count=1&skip=0&sortType=2", "", true, ajax_successIGDaily, ajax_failIGDaily);

    }else{
        cacheData06 = JSON.parse(sessionStorage.dataHp06);
        ajax_successIGDaily(cacheData06);
    }

    function ajax_successIGDaily(obj){
        sessionStorage.dataHp06=JSON.stringify(obj);

        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined){
            $(".DailyGroup").attr("itemId",obj[0].GroupId);
            $(".DailyGroup .groupHeadPortrait").attr("src",obj[0].ImageUrl);
            $(".DailyGroup .groupAuthorName").text(obj[0].AuthorName);
            $(".DailyGroup .groupMainName").text(obj[0].GroupName);
            if( obj[0].DayRate >= 0 ){
                $(".DailyGroup .groupChangePercent").text("+"+obj[0].DayRate+"%");
            }else if( obj[0].DayRate < 0){
                $(".DailyGroup .groupChangePercent").text(obj[0].DayRate+"%");
                $(".DailyGroup .groupChangePercent").css("background-color","#20c062");
            }

            if(obj[0].Stocks != undefined &&  obj[0].Stocks != null && obj[0].Stocks != ""){   //存在stock内容
                //显示股票数据
                $(".DailyGroup .groupFSstock").text(obj[0].Stocks[0].StockInfo.Name);
                $(".DailyGroup .groupFSstockCode").text("("+ stocksIdTransform(obj[0].Stocks[0].StockInfo.Symbol) + ")");

                if( obj[0].Stocks[0].Current != undefined && obj[0].Stocks[0].Current != null  && obj[0].Stocks[0].Current != "" ){    //存在current字段
                    //买卖图标显示，仓位数据待定
                    $(".DailyGroup .groupTradeType").css("display","block");

                    if( obj[0].Stocks[0].Current.Percent != undefined && obj[0].Stocks[0].Current.Percent != null  && obj[0].Stocks[0].Current.Percent != "" ) {
                        //显示仓位数据，买卖图标待定

                        if (obj[0].Stocks[0].Current.PrevPercent != undefined && obj[0].Stocks[0].Current.PrevPercent != null && obj[0].Stocks[0].Current.PrevPercent != "") { //存在PrevPercent字段
                            if (  obj[0].Stocks[0].Current.Percent >= obj[0].Stocks[0].Current.PrevPercent) {
                                //    买，显示仓位变化，显示股票
                                $(".DailyGroup .groupFSstockPercent").text("+"+returnFloat( obj[0].Stocks[0].Current.Percent - obj[0].Stocks[0].Current.PrevPercent )+"%");
                                $(".DailyGroup .groupTradeType").addClass("buyIcon");
                                $(".DailyGroup .groupTradeType").text("买");

                            }else{
                                //    卖，显示仓位变化，显示股票
                                $(".DailyGroup .groupFSstockPercent").text("-"+returnFloat( obj[0].Stocks[0].Current.PrevPercent - obj[0].Stocks[0].Current.Percent )+"%");
                                $(".DailyGroup .groupTradeType").addClass("sellIcon");
                                $(".DailyGroup .groupTradeType").text("卖");

                            }
                        } else if (obj[0].Stocks[0].History != undefined && obj[0].Stocks[0].History != null && obj[0].Stocks[0].History != "") {  //不存在PrevPercent字段但存在History字段
                            if (obj[0].Stocks[0].History[0] != undefined && obj[0].Stocks[0].History[0] != null && obj[0].Stocks[0].History[0] != "") {  //存在History字段，里面有Percent
                                if (obj[0].Stocks[0].History[0].Percent != undefined && obj[0].Stocks[0].History[0].Percent != null && obj[0].Stocks[0].History[0].Percent != "") {  //存在History字段，里面有Percent
                                    if (obj[0].Stocks[0].Current.Percent >= obj[0].Stocks[0].History[0].Percent) {
                                        //    买，显示仓位，显示股票

                                        $(".DailyGroup .groupFSstockPercent").text("+" + returnFloat(obj[0].Stocks[0].Current.Percent - obj[0].Stocks[0].History[0].Percent) + "%");
                                        $(".DailyGroup .groupTradeType").addClass("buyIcon");
                                        $(".DailyGroup .groupTradeType").text("买");

                                    } else {
                                        //    卖，显示仓位，显示股票
                                        $(".DailyGroup .groupFSstockPercent").text("-" + returnFloat(obj[0].Stocks[0].History[0].Percent - obj[0].Stocks[0].Current.Percent) + "%");
                                        $(".DailyGroup .groupTradeType").addClass("sellIcon");
                                        $(".DailyGroup .groupTradeType").text("卖");
                                    }

                                } else {//存在History字段，但里面没有Percent
                                    //    买，显示仓位，显示股票
                                    $(".DailyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].Current.Percent) + "%");
                                    $(".DailyGroup .groupTradeType").addClass("buyIcon");
                                    $(".DailyGroup .groupTradeType").text("买");

                                }
                            }else {//存在History字段，但里面没有Percent
                                //    买，显示仓位，显示股票
                                $(".DailyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].Current.Percent) + "%");
                                $(".DailyGroup .groupTradeType").addClass("buyIcon");
                                $(".DailyGroup .groupTradeType").text("买");

                            }

                        } else {  //不存在PrevPercent字段也没有History字段
                            //    买，显示仓位，显示股票
                            //console.log("here");
                            $(".DailyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].Current.Percent)+"%");
                            $(".DailyGroup .groupTradeType").addClass("buyIcon");
                            $(".DailyGroup .groupTradeType").text("买");

                        }
                    }else{
                        $(".DailyGroup .groupbasicText1").css("display","none");

                    }

                }else{ //无current字段
                    //仓位为空，买卖为空
                    $(".DailyGroup .groupbasicText1").css("display","none");
                }
            }else{ //无stock字段
                //隐藏股票数据
                $(".DailyGroup .groupbasicText1").css("display","none");
            }





            //        $(".DailyGroup .groupTradeType").addClass("buyIcon");
            //        $(".DailyGroup .groupTradeType").text("买");
            ////    }else if( obj[0].Stocks[0].CurrentPercent.Percent < obj[0].Stocks[0].HistoryPercent[0].Percent ){
            //        $(".DailyGroup .groupTradeType").addClass("sellIcon");
            //        $(".DailyGroup .groupTradeType").text("卖");
            //    }else{
            //        $(".DailyGroup .groupTradeType").addClass("buyIcon");
            //        $(".DailyGroup .groupTradeType").text("买");
            //    $(".DailyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].CurrentPercent.Percent)+"%");
            //    $(".DailyGroup .groupFSstock").text(obj[0].Stocks[0].StockInfo.Name);
            //    $(".DailyGroup .groupFSstockCode").text( stocksIdTransform(obj[0].Stocks[0].StockInfo.Symbol));
            //    $(".DailyGroup .groupTradeType").addClass("buyIcon");
            //    $(".DailyGroup .groupTradeType").text("买");




            $(".DailyGroup").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', "forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId'));
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=-1'+'&scroll='+document.body.scrollTop);
                    //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from=-1";
                })
            });

            $(".Load3").css("display", "none");

        }

    }

    function ajax_failIGDaily(obj) {

        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
            InvestGroupOnload();
        });
    }






    if( sessionStorage.dataHp07 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/InvestGroups?count=1&skip=0&sortType=0", "", true, ajax_successIGMonthly, ajax_failIGMonthly);

    }else{
        cacheData07 = JSON.parse(sessionStorage.dataHp07);
        ajax_successIGMonthly(cacheData07);
    }

    function ajax_successIGMonthly(obj){
        sessionStorage.dataHp07=JSON.stringify(obj);

        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined){
            $(".MonthlyGroup").attr("itemId",obj[0].GroupId);
            $(".MonthlyGroup .groupHeadPortrait").attr("src",obj[0].ImageUrl);
            $(".MonthlyGroup .groupAuthorName").text(obj[0].AuthorName);
            $(".MonthlyGroup .groupMainName").text(obj[0].GroupName);
            if( obj[0].MonthRate >= 0 ){
                $(".MonthlyGroup .groupChangePercent").text("+"+obj[0].MonthRate+"%");
            }else if( obj[0].MonthRate < 0){
                $(".MonthlyGroup .groupChangePercent").text(obj[0].MonthRate+"%");
                $(".MonthlyGroup .groupChangePercent").css("background-color","#20c062");
            }

            if(obj[0].Stocks != undefined &&  obj[0].Stocks != null && obj[0].Stocks != ""){   //存在stock内容
                //显示股票数据
                $(".MonthlyGroup .groupFSstock").text(obj[0].Stocks[0].StockInfo.Name);
                $(".MonthlyGroup .groupFSstockCode").text("("+ stocksIdTransform(obj[0].Stocks[0].StockInfo.Symbol) + ")");

                if( obj[0].Stocks[0].Current != undefined && obj[0].Stocks[0].Current != null  && obj[0].Stocks[0].Current != "" ){    //存在current字段
                    //买卖图标显示，仓位数据待定
                    $(".MonthlyGroup .groupTradeType").css("display","block");

                    if( obj[0].Stocks[0].Current.Percent != undefined && obj[0].Stocks[0].Current.Percent != null  && obj[0].Stocks[0].Current.Percent != "" ) {
                        //显示仓位数据，买卖图标待定

                        if (obj[0].Stocks[0].Current.PrevPercent != undefined && obj[0].Stocks[0].Current.PrevPercent != null && obj[0].Stocks[0].Current.PrevPercent != "") { //存在PrevPercent字段
                            if (  obj[0].Stocks[0].Current.Percent >= obj[0].Stocks[0].Current.PrevPercent) {
                                //    买，显示仓位变化，显示股票
                                $(".MonthlyGroup .groupFSstockPercent").text("+"+returnFloat( obj[0].Stocks[0].Current.Percent - obj[0].Stocks[0].Current.PrevPercent )+"%");
                                $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
                                $(".MonthlyGroup .groupTradeType").text("买");

                            }else{
                                //    卖，显示仓位变化，显示股票
                                $(".MonthlyGroup .groupFSstockPercent").text("-"+returnFloat( obj[0].Stocks[0].Current.PrevPercent - obj[0].Stocks[0].Current.Percent )+"%");
                                $(".MonthlyGroup .groupTradeType").addClass("sellIcon");
                                $(".MonthlyGroup .groupTradeType").text("卖");

                            }
                        } else if (obj[0].Stocks[0].History != undefined && obj[0].Stocks[0].History != null && obj[0].Stocks[0].History != "") {  //不存在PrevPercent字段但存在History字段
                            if (obj[0].Stocks[0].History[0] != undefined && obj[0].Stocks[0].History[0] != null && obj[0].Stocks[0].History[0] != "") {  //存在History字段，里面有Percent
                                if (obj[0].Stocks[0].History[0].Percent != undefined && obj[0].Stocks[0].History[0].Percent != null && obj[0].Stocks[0].History[0].Percent != "") {  //存在History字段，里面有Percent
                                    if (obj[0].Stocks[0].Current.Percent >= obj[0].Stocks[0].History[0].Percent) {
                                        //    买，显示仓位，显示股票

                                        $(".MonthlyGroup .groupFSstockPercent").text("+" + returnFloat(obj[0].Stocks[0].Current.Percent - obj[0].Stocks[0].History[0].Percent) + "%");
                                        $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
                                        $(".MonthlyGroup .groupTradeType").text("买");

                                    } else {
                                        //    卖，显示仓位，显示股票
                                        $(".MonthlyGroup .groupFSstockPercent").text("-" + returnFloat(obj[0].Stocks[0].History[0].Percent - obj[0].Stocks[0].Current.Percent) + "%");
                                        $(".MonthlyGroup .groupTradeType").addClass("sellIcon");
                                        $(".MonthlyGroup .groupTradeType").text("卖");
                                    }

                                } else {//存在History字段，但里面没有Percent
                                    //    买，显示仓位，显示股票
                                    $(".MonthlyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].Current.Percent) + "%");
                                    $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
                                    $(".MonthlyGroup .groupTradeType").text("买");

                                }
                            }else {//存在History字段，但里面没有Percent
                                //    买，显示仓位，显示股票
                                $(".MonthlyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].Current.Percent) + "%");
                                $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
                                $(".MonthlyGroup .groupTradeType").text("买");

                            }

                        } else {  //不存在PrevPercent字段也没有History字段
                            //    买，显示仓位，显示股票
                            //console.log("here");
                            $(".MonthlyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].Current.Percent)+"%");
                            $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
                            $(".MonthlyGroup .groupTradeType").text("买");

                        }
                    }else{
                        $(".MonthlyGroup .groupbasicText1").css("display","none");

                    }

                }else{ //无current字段
                    //仓位为空，买卖为空
                    $(".MonthlyGroup .groupbasicText1").css("display","none");
                }
            }else{ //无stock字段
                //隐藏股票数据
                $(".MonthlyGroup .groupbasicText1").css("display","none");
            }

            //if(obj[0].Stocks != null &&  obj[0].Stocks != undefined && obj[0].Stocks != "") {
            //    if (obj[0].Stocks[0].Current.Percent != null && obj[0].Stocks[0].History != null) {
            //        if( obj[0].Stocks[0].Current.Percent >= obj[0].Stocks[0].History[0].Percent ){
            //            $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
            //            $(".MonthlyGroup .groupTradeType").text("买");
            //        }else if( obj[0].Stocks[0].Current.Percent < obj[0].Stocks[0].Current[0].Percent ){
            //            $(".MonthlyGroup .groupTradeType").addClass("sellIcon");
            //            $(".MonthlyGroup .groupTradeType").text("卖");
            //        }else{
            //            $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
            //            $(".MonthlyGroup .groupTradeType").text("买");
            //        }
            //        $(".MonthlyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].CurrentPercent.Percent)+"%");
            //        $(".MonthlyGroup .groupFSstock").text(obj[0].Stocks[0].StockInfo.Name);
            //        $(".MonthlyGroup .groupFSstockCode").text( stocksIdTransform(obj[0].Stocks[0].StockInfo.Symbol));
            //
            //    }else{
            //        $(".MonthlyGroup .groupTradeType").addClass("buyIcon");
            //        $(".MonthlyGroup .groupTradeType").text("买");
            //        $(".MonthlyGroup .groupFSstockPercent").text(returnFloat(obj[0].Stocks[0].CurrentPercent.Percent)+"%");
            //        $(".MonthlyGroup .groupFSstock").text(obj[0].Stocks[0].StockInfo.Name);
            //        $(".MonthlyGroup .groupFSstockCode").text( stocksIdTransform(obj[0].Stocks[0].StockInfo.Symbol));
            //    }
            //}


            $(".MonthlyGroup").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', "forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId'));
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=-1'+'&scroll='+document.body.scrollTop);
                    //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from=-1";
                })
            });

            $(".Load3").css("display", "none");
        }

    }

    function ajax_failIGMonthly(obj) {
        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
            InvestGroupOnload();
        });
    }
}


//加载首页投资观点
function VipViewPointOnload() {

    if( sessionStorage.dataHp08 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/PersonPoints?personId=&count=3&dateTime="+endTime+"&getDetail=false&isExpert=True&sentiment=*", "", true, ajax_successVP, ajax_failVP);

    }else{
        cacheData08 = JSON.parse(sessionStorage.dataHp08);
        ajax_successVP(cacheData08);
    }

    function ajax_successVP(obj){
        sessionStorage.dataHp08=JSON.stringify(obj);

        if( obj != null && obj != undefined && obj != ""){
            for( var i = 0 ; i < obj.length; i++){
                $(".viewMainBox").append("" +
                " <div class='viewBox'> " +
                "<img class='viewAuthorHead' > " +
                "<div class='viewContent'> " +
                "<span class='viewTitle'></span> " +
                "<span class='viewSource'></span> " +
                "<span class='viewPubtime'></span> </div> </div>" +
                "");

                $(".viewMainBox .viewAuthorHead").eq(i).attr("src",obj[i].ImageUrl);
                $(".viewMainBox .viewBox").eq(i).attr("itemId",obj[i].PointId);
                $(".viewMainBox .viewTitle").eq(i).text(obj[i].Title);
                $(".viewMainBox .viewSource").eq(i).text(obj[i].PersonName);
                $(".viewMainBox .viewPubtime").eq(i).text(obj[i].PubDate.substring(5,10)+"  "+"  "+obj[i].PubDate.substring(11,16));
            }


            $(".viewMainBox .viewBox").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', "opportunityPage4_viewPoint.html?ReportsId="+$(this).attr('itemId'));
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=-1'+'&scroll='+document.body.scrollTop);
                    //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from=-1";
                })
            });


        }
        $(".Load4").css("display", "none");
    }

    function ajax_failVP(obj) {
        $(".Load4").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load4 .loadingImg2").on("click",function(){
            $(".Load4 .loadingImg2").remove();
            $(".Load4 .notcontent").remove();
            $(".Load4").html("<img src='img/loading.gif' class='loadingImg2'>");
            VipViewPointOnload();
        });
    }

}





function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//pageLocationChange 2
function touchImf(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    //window.location.href = 'index.html?firstLoad=no&TopIndex='+TopIndex;
    if (GetQueryString('firstLoad') != "no") {
        slideQuick('left', 'lightblue', 1, 'indexNews.html');
    }
    else {
        slideQuick('left', 'lightblue', 1, 'indexNews.html?firstLoad=no');
    }
    //parent.location='index.html?firstLoad=no&TopIndex='+TopIndex;
}


//function touchFore(event){
//    event.stopPropagation();
//    event.preventDefault();
//    AddGoback('index.html?firstLoad=no', 'toolPages/tool0_0_mainPage.html');
//    //window.location.href = 'toolPages/tool0_0_mainPage.html';
//    //slideQuick('left',   'lightblue', 1, 'forecastingPages/forecastingPage1_Main.html');
//    //parent.location= 'forecastingPages/forecastingPage1_Main.html';
//}

function touchMy(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    //window.location.href ='myChose.html';
    slideQuick('left',   'lightblue', 1, 'myChose.html');
    //parent.location= 'indexMy.html';
}

function touchMyIndex(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'indexMy.html');
    //window.location.href ='indexMy.html';
    //slideQuick('left',   'lightblue', 1, 'indexMy.html');
    //parent.location= 'indexMy.html';
}
function touchEventmore(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'opportunityPage2_Events.html?tagLt=0'+'&scroll='+document.body.scrollTop);
    //window.location.href = 'opportunityPage2_Events.html?tagLt=0'+'&scroll='+document.body.scrollTop;
    //slide('left',   'lightblue', 1, 'opportunityPage2_Events.html?tagLt=0'+'&scroll='+document.body.scrollTop);
    //parent.location= 'opportunityPage2_Events.html?tagLt=0';
}


function touchCapitalmore(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'chanceSecondary10_capitalFlow.html');
    //window.location.href = 'chanceSecondary10_capitalFlow.html';
    //slide('left',   'lightblue', 1, 'opportunityPage2_Events.html?tagLt=0'+'&scroll='+document.body.scrollTop);
    //parent.location= 'opportunityPage2_Events.html?tagLt=0';
}

function touchTopicmore(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'opportunityPage3_Topics.html'+'?scroll='+document.body.scrollTop);
    //window.location.href = 'opportunityPage3_Topics.html'+'?scroll='+document.body.scrollTop;
    //parent.location= 'opportunityPage3_Topics.html';
}


function touchGroup(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'chanceSecondary09_investGroup.html');
    //window.location.href ='chanceSecondary09_investGroup.html';
    //window.location.href ='forecastingPage2_InvestGroups.html';
    //slide('left',   'lightblue', 1, 'forecastingPage2_InvestGroups.html');
    //parent.location= 'forecastingPage2_InvestGroups.html';
}
function touchLong(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'chanceSecondary01_viewPoint.html');
    //window.location.href ='chanceSecondary01_viewPoint.html';
    //window.location.href ='forecastingPage3_ViewPoints.html';
    //slide('left',   'lightblue', 1, 'forecastingPage3_ViewPoints.html');
    //parent.location= 'forecastingPage3_ViewPoints.html';
}
function touchOrder(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'forecastingPage4_TradeStocks.html'+'?scroll='+document.body.scrollTop);
    //window.location.href ='forecastingPage4_TradeStocks.html'+'?scroll='+document.body.scrollTop;
    //slide('left',   'lightblue', 1, 'forecastingPage4_TradeStocks.html'+'?scroll='+document.body.scrollTop);
    //parent.location= 'forecastingPage4_TradeStocks.html';
}

function touchForecasting(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'chanceSecondary07_forecasting.html');
    //window.location.href ='chanceSecondary07_forecasting.html';
    //window.location.href ='tool0_1_forecastStocksList.html';
}

function touchControlChange(event){
    event.stopPropagation();
    event.preventDefault();
    window.plugins.toast.show("该功能暂未开放", 500, "center");
    //AddGoback('index.html?firstLoad=no', 'chanceSecondary08_ctrlChange.html');
    //window.location.href ='chanceSecondary08_ctrlChange.html';
}
function touchStocksBar(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'tool2_0_StockBar.html');
    //window.location.href ='tool2_0_StockBar.html';
}

function touchLimitUpResumption(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'chanceSecondary03_resumption.html');
    //window.location.href ='chanceSecondary03_resumption.html';
}
function touchBillboard(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'chanceSecondary05_billboard.html');
    //window.location.href ='chanceSecondary05_billboard.html';
    //window.location.href ='tool3_0_Billboard.html';
}

function touchNoticeEvents(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.pageScrollMhp = document.body.scrollTop;
    AddGoback('index.html?firstLoad=no', 'tool4_0_NoticeEvents.html');
    //window.location.href = 'tool4_0_NoticeEvents.html';
}

//function touchControllerChange(event){
//    event.stopPropagation();
//    event.preventDefault();
//    window.location.href ='tool5_0_ControlChanges.html';
//}


function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },0);
}



function bind_topSix() {
    //for (var i = 0; i < 4; i++) {
    //    $("#swiper").find(".swiper-wrapper").append('' +
    //    '<div id="swiper' + i + '" class="swiper-slide">' +
    //    //'<input type="hidden" class="hidden" value="">' +
    //    //'<input type="hidden" class="type" PushDate="" value="">' +
    //    '<img  class="cover" >' +
    //    //'<div class="maskimg"><img src="images/Mask.png"></div>' +
    //    '<div class="top-title"><p></p></div>' +
    //    '</div>');
    //}
    //
    //var mySwiper = new Swiper ('.swiper-container', {
    //    //direction: 'vertical',
    //    autoplay : 8000,
    //    autoplayDisableOnInteraction : false,
    //    loop: true
    //    // 如果需要分页器
    //    //pagination: '.swiper-pagination'
    //    // 如果需要滚动条
    //    //scrollbar: '.swiper-scrollbar'
    //});

    if( sessionStorage.dataHp01 == undefined || sessionStorage.timeStampMhp == undefined ||(Date.parse(new Date())-sessionStorage.timeStampMhp) > 120000){
        sessionStorage.timeStampMhp=Date.parse(new Date());
        httpGet("Reader/Articles?userID=" + UserID + "&count=4&category=top", "", true, ajax_success17, ajax_fail17);
    }else{
        cacheData01 = JSON.parse(sessionStorage.dataHp01);
        ajax_success17(cacheData01);
    }

    function ajax_success17(obj){
        sessionStorage.dataHp01=JSON.stringify(obj);

        if( obj != undefined && obj != null && obj != ""){
            for(var i = 0; i < obj.length;i++){

                $(".NewsBoxCover").eq(i).attr("src","http://www.taikorcdn.com/reader/"+obj[i].ImageUrl);
                $(".NewsBox>span").eq(i).text(obj[i].Title);
                $(".NewsBox").eq(i).attr("itemId",obj[i].Id);
                $(".NewsBox").eq(i).attr("newsType",obj[i].Type);

            }
            //

            if( obj.length == 1){
                var mySwiper = new Swiper ('.swiper-container-banner', {
                })
            }else{
                var mySwiper = new Swiper ('.swiper-container-banner', {
                    //direction: 'vertical',
                    autoplay : 8000,
                    autoplayDisableOnInteraction : false,
                    loop: true,
                    // 如果需要分页器
                    pagination: '.swiper-pagination',
                    paginationClickable :true
                    // 如果需要滚动条
                    //scrollbar: '.swiper-scrollbar'
                })
            }

            $(".swiper-wrapper .NewsBox").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    sessionStorage.pageScrollMhp = document.body.scrollTop;
                    AddGoback('index.html?firstLoad=no', 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=' + $(this).attr("newsType"));
                    //window.location.href = 'newsInfo.html?itemid=' + $(this).attr("itemId") + '&newsType=' + $(this).attr("newsType") + '&fromPage=index';
                    //window.location.href ='tool1_2_Summary.html?itemId='+$(this).attr("itemId")+'&authorName='+encodeURI(AuthorName)+'&AgencyID='+ItemId+'&stockID='+StockId+'&scroll='+document.body.scrollTop;

                    //slide('left','lightblue',1,'tool1_2_Summary.html?itemId='+$(this).attr("itemId")+'&authorName='+encodeURI(AuthorName)+'&AgencyID='+ItemId+'&stockID='+StockId+'&scroll='+document.body.scrollTop);
                })
            });

        }else{
            //$(".swiper-wrapper").append("<div class='swiper-slide' ><div class='NewsBox' style='background-image: url('img/top_error.png')'></div> ");
            //$(".NewsBox").css("background-image","url('img/top_error.png')");

        }


        //$(".swiper-container,.swiper-wrapper,.swiper-slide .swiper-slide-active,.NewsBox,.NewsMask").css("height", (document.documentElement.clientWidth * 200/375) + "px");
        //window.addEventListener("resize", function() {
        //    $(".swiper-container,.swiper-wrapper,.swiper-slide .swiper-slide-active,.NewsBox,.NewsMask").css("height", (document.documentElement.clientWidth * 200/375) + "px");
        //});

        //$('.ChartAnimationBox').css("top", ($('.emotionMainBox').offset().top-4)+"px");
        //$('.ChartMainBox').css("top", ($('.emotionMainBox').offset().top-4)+"px;");
        //
        ////$('.emotionMainBox').offset().top
        //
        //window.addEventListener("resize", function() {
        //    $('.ChartAnimationBox').css("top", ($('.emotionMainBox').offset().top-4)+"px");
        //    $('.ChartMainBox').css("top", ($('.emotionMainBox').offset().top-4)+"px;");
        //    //$(".swiper-container,.swiper-wrapper,.swiper-slide .swiper-slide-active,.NewsBox,.NewsMask").css("height", (document.documentElement.clientWidth * 200/375) + "px");
        //});





    }
    function ajax_fail17() {
    }
}




function add_leadSwiper() {
    myLeadSwiper = new Swiper('.swiper-container-lead', {
        autoplay: 2000,
        autoplayStopOnLast : true,
        pagination: '.Cover-swiper-pagination',
        paginationClickable: true,
        onReachEnd: function (swiper) {
            $("#lead .Cover-swiper-pagination,#lead .leadJupm").remove();
            $("#leadSlideEnd").html('开启' + AppModel + '全新体验');


            if ($("#leadSlideEnd").length > 0) {

                $("#leadSlideEnd").removeClass("Page");
                //document.getElementById('leadSlideEnd').addEventListener("touchstart", touchleadJupm, false);
                document.getElementById('leadSlideEnd').addEventListener("click", touchleadJupm, false);
            }
        },
        onSlideChangeEnd: function (swiper) {
            if (myLeadSwiper.isEnd) {
                myLeadSwiper.stopAutoplay();
                myLeadSwiper.lockSwipes();
            }
        }
    });

    $(".leadJupm").on("click",function(event){
        touchleadJupm(event);
    });

}
//引导页的跳过
function touchleadJupm(event) {
    event.preventDefault();
    $("#lead").fadeOut();
    $(".LoadingCover").fadeOut();
}







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