/**
 * Created by aa on 2016/4/25.
 */
var AccessToken;
var nullu = "", NowVerision = "2.0", UserID = "";
var db;
var flagp = 0;
var thisScroll = 0;
var tagSelected = 0;;
var tagSelect=0;


$(function () {
    FastClick.attach(document.body);
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
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
            pageOnload();
        }, 200);
    }
    //pageOnload();

    if( sessionStorage.pageScrollTpc == undefined ){
        sessionStorage.pageScrollTpc = document.body.scrollTop;
        thisScroll = sessionStorage.pageScrollTpc;
        scollto(thisScroll);
    }else{
        thisScroll = sessionStorage.pageScrollTpc;
        scollto(thisScroll);
    }

});


function pageOnload() {
    var screenWidth =document.documentElement.clientWidth;
    var yScrolls,yScrolle,startX,startY,moveEndX,moveEndY, X,Y;
    $("body").on("touchstart", function(e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("body").on("touchend", function(e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && ((X > (screenWidth * 0.33)) || startX < 10)) {
            Gotoback();
        }
    });

    $(".reload").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        sessionStorage.removeItem("pageScrollTpc");
        sessionStorage.removeItem("dataTopicsTypeTag");
        location.reload(true);
    });

    if( sessionStorage.dataTopicsTypeTag == undefined ){

    }else if( sessionStorage.dataTopicsTypeTag == 0 ){
        $(".text1PTopics>.SelectTag").eq(1).removeClass("selected");
        $(".text1PTopics>.SelectTag").eq(0).addClass("selected");
        $(".TopicMainBox").eq(1).removeClass("showed");
        $(".TopicMainBox").eq(0).addClass("showed");
    }else if( sessionStorage.dataTopicsTypeTag == 1 ){
        $(".text1PTopics>.SelectTag").eq(0).removeClass("selected");
        $(".text1PTopics>.SelectTag").eq(1).addClass("selected");
        $(".TopicMainBox").eq(0).removeClass("showed");
        $(".TopicMainBox").eq(1).addClass("showed");
    }

    //pageLocationChange 1
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    //加载上升最快主题榜
    RisingTopics();
    //加载热门主题榜
    HotTopics();

}

//加载上升最快主题榜
function RisingTopics(){
    httpGet("Reader/Topics?sortType=0&count=10","",true,ajax_success01,ajax_fail01);
    function ajax_success01(obj){
        if(obj != null && obj != "" && obj != [] && obj != undefined){
            var themeAmount = 10;
            var colorlist = ["#ff8903", "#f5a623", "#ffc039","#FFD139","#FFD139","#FFD139","#FFD139","#FFD139","#FFD139","#FFD139","#FFD139","#FFD139"];
            for (var e = 0; e < themeAmount; e++) {

                if( e >= obj.length ){
                    break;
                }
                $(".risingTopicList").append("<div id='themeid_r" + e + "' class='themeBox'> " +
                "<div class='themeImfBox1'> <span>平均涨跌幅</span> <span class='percentageOfTopic'>+9.99%</span>  </div> " +
                "<div class='themeImfBox2'> " +
                "<span class='themeTitle'>主题题目</span> " +
                "<span class='themeKey'>重点内容</span> " +
                "<span class='themeTime3'></span>" +
                "<span>热度</span> <span class='heat'>****</span> <span>加速度</span> <span class='acceleration'>****</span>" +
                "<br><span>相关个股:</span> <span class='sharesAbout1'></span> <span class='sharesAbout2'></span> <span class='sharesAbout3'></span>" +
                "</div> " +
                "<div class='clear'></div> </div>");

                //if( obj[e].TopicId != null && obj[e].TopicId != undefined && obj[e].TopicId != ""){
                    $(".risingTopicList .themeBox").eq(e).attr("itemId", obj[e].TopicId);
                //}
                $(".risingTopicList .themeTitle").eq(e).text(obj[e].TopicName);
                $(".risingTopicList .heat").eq(e).text(obj[e].HotValue);
                $(".risingTopicList .acceleration").eq(e).text(obj[e].SpeedValue);
                $(".risingTopicList .themeImfBox1").eq(e).css({backgroundColor: colorlist[e]});
                if( obj[e].Summury != null && obj[e].Summury != "" && obj[e].Summury != {}){
                    $(".risingTopicList .themeKey").eq(e).text(obj[e].Summury);
                }else{
                    $(".risingTopicList .themeKey").eq(e).text("暂无主题内容概括");
                }

                if( obj[e].Changepercent != null && obj[e].Changepercent != undefined ){
                    if( obj[e].Changepercent >0 ){
                        $(".risingTopicList .percentageOfTopic").eq(e).text("+"+returnFloat(obj[e].Changepercent)+"%");
                    }else if( obj[e].Changepercent  <= 0 ){
                        $(".risingTopicList .percentageOfTopic").eq(e).text(returnFloat(obj[e].Changepercent)+"%");
                    }
                }else{
                    $(".risingTopicList .percentageOfTopic").eq(e).text("--.--%");
                }


                if( obj[e].Stocks != null && obj[e].Stocks != [] && obj[e].Stocks != ""){
                    $(".risingTopicList .themeTime3").eq(e).text(getDateDiff(dateTrans(obj[e].Stocks[0].Stock.Ticktime)));
                    if( redDateDiff(dateTrans(obj[e].Stocks[0].Stock.Ticktime)) == 'colorr'){
                        $(".risingTopicList .themeTime3").eq(e).css("color","#fd3642");
                    }
                    for( var s = 0 ; s < obj[e].Stocks.length; s ++ ){
                        $(".risingTopicList .sharesAbout"+(s+1)).eq(e).text(obj[e].Stocks[s].Stock.Name);
                    }
                }else{
                    $(".risingTopicList .sharesAbout1").eq(e).text("暂无");
                }

                if( obj[e].Articles != null && obj[e].Articles != "" && obj[e].Articles != []) {
                    $(".risingTopicList .themeTime3").eq(e).text(getDateDiff(dateTrans(obj[e].Articles[0].PubDate)));
                }
            }
            loadend();
            $(".Load_1").css("display","none");
        }else{
            $(".Load_1").css("display","none");
            $(".mainbox").eq(0).css("display","none");
            loadend();
        }
    }
    function ajax_fail01(){
        console.log("上升主题加载失败");
        $(".Load_1").html("<img src='img/no_content.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        loadend();
        $(".Load_1 .loadingImg2").on("click",function(){
            $(".Load_1 .loadingImg2").remove();
            $(".Load_1 .notcontent").remove();
            $(".Load_1").html("<img src='img/loading.gif' class='loadingImg2'>");
            RisingTopics();
        });
    }

}

//加载热门主题榜
function HotTopics(){
    httpGet("Reader/Topics?sortType=2&count=10","",true,ajax_success02,ajax_fail02);
    function ajax_success02(obj){
        //console.log(obj);
        if(obj != null && obj != "" && obj != [] && obj != undefined){
            var colorlist2=["#dd243a","#f14439","#fa6020","#FF7F3D","#FF7F3D","#FF7F3D","#FF7F3D","#FF7F3D","#FF7F3D","#FF7F3D","#FF7F3D","#FF7F3D"];
            var themeAmount2 = 10;
            for (var h = 0; h < themeAmount2; h++) {
                if( h >= obj.length ){
                    break;
                }
                $(".hotTopicList").append("<div id='themeid_h" + h + "'class='themeBox'> " +
                "<div class='themeImfBox1'> <span>平均涨跌幅</span> <span class='percentageOfTopic'></span>  </div> " +
                "<div class='themeImfBox2'> " +
                "<span class='themeTitle'>主题题目</span> " +
                "<span class='themeKey'>重点内容</span> " +
                "<span class='themeTime3'></span>" +
                "<span>热度</span> <span class='heat'>****</span> <span>加速度</span> <span class='acceleration'>****</span>" +
                "<br><span>相关个股:</span> <span class='sharesAbout1'></span> <span class='sharesAbout2'></span> <span class='sharesAbout3'></span>" +
                "</div> " +
                "<div class='clear'></div> </div>");
                $(".hotTopicList .themeBox").eq(h).attr("itemId", obj[h].TopicId);
                $(".hotTopicList .themeTitle").eq(h).text(obj[h].TopicName);
                $(".hotTopicList .heat").eq(h).text(obj[h].HotValue);
                $(".hotTopicList .acceleration").eq(h).text(obj[h].SpeedValue);
                $(".hotTopicList .themeImfBox1").eq(h).css({backgroundColor: colorlist2[h]});
                if( obj[h].Summury != null && obj[h].Summury != "" && obj[h].Summury != {}){
                    $(".hotTopicList .themeKey").eq(h).text(obj[h].Summury);
                }else{
                    $(".hotTopicList .themeKey").eq(h).text("暂无主题内容概括");
                }

                if( obj[h].Changepercent != null && obj[h].Changepercent != undefined ){
                    if( obj[h].Changepercent >0 ){
                        $(".hotTopicList .percentageOfTopic").eq(h).text("+"+returnFloat(obj[h].Changepercent)+"%");
                    }else if( obj[h].Changepercent  <= 0 ){
                        $(".hotTopicList .percentageOfTopic").eq(h).text(returnFloat(obj[h].Changepercent)+"%");
                    }
                }else{
                    $(".hotTopicList .percentageOfTopic").eq(h).text("--.--%");
                }

                if( obj[h].Stocks != null && obj[h].Stocks != [] && obj[h].Stocks != ""){
                    $(".hotTopicList .themeTime3").eq(h).text(getDateDiff(dateTrans(obj[h].Stocks[0].Stock.Ticktime)));
                    if( redDateDiff(dateTrans(obj[h].Stocks[0].Stock.Ticktime)) == 'colorr'){
                        $(".hotTopicList .themeTime3").eq(h).css("color","#fd3642");
                    }
                    for( var s = 0 ; s < obj[h].Stocks.length; s ++ ){
                        $(".hotTopicList .sharesAbout"+(s+1)).eq(h).text(obj[h].Stocks[s].Stock.Name);
                    }
                }else{
                    $(".hotTopicList .sharesAbout1").eq(h).text("暂无");
                }

                if( obj[h].Articles != null && obj[h].Articles != "" && obj[h].Articles != []) {
                    $(".hotTopicList .themeTime3").eq(h).text(getDateDiff(dateTrans(obj[h].Articles[0].PubDate)));
                }
            }
            loadend();
            $(".Load2").css("display","none");
        }else{
            loadend();
            $(".Load2").css("display","none");
            $(".mainbox").eq(1).css("display","none");
        }
    }
    function ajax_fail02(){
        console.log("热门主题加载失败");
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        loadend();
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
            HotTopics();
        });
    }

}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.removeItem("pageScrollTpc");
    sessionStorage.removeItem("dataTopicsTypeTag");
    Gotoback();
    //window.location.href ='index.html'+'?scroll='+ScrollMain;
    //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+ScrollMain);
    //parent.location='index.html';
}

function loadend(){
    if(flagp >= 1){
        flagp = 0;
        //$(".loadingPrevent").css("display","none");

        if( tagSelected == 1 ){
            $(".text1PTopics>.SelectTag").eq(0).removeClass("selected");
            $(".text1PTopics>.SelectTag").eq(1).addClass("selected");
            $(".TopicMainBox").eq(0).removeClass("showed");
            $(".TopicMainBox").eq(1).addClass("showed");
            tagSelect = 1;
        }

        $(".text1PTopics>.SelectTag").each(function(index){
            $(this).on("click",function(){
                $(".text1PTopics>.SelectTag").removeClass("selected");
                $(".TopicMainBox").removeClass("showed");
                $(".TopicMainBox").eq(index).addClass("showed");
                $(this).addClass("selected");
                sessionStorage.dataTopicsTypeTag = index;
                tagSelect = index;
            })
        });

        //pageLocationChange
        $(".themeBox").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                sessionStorage.pageScrollTpc = document.body.scrollTop;
                AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));

                //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=1'+"&scroll="+ScrollMain+"&thisScroll="+document.body.scrollTop+"&tagSelect="+tagSelect;
                //slide('left', 'lightblue', 1,'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=1'+"&scroll="+ScrollMain+"&thisScroll="+document.body.scrollTop+"&tagSelect="+tagSelect);
                //parent.location="opportunityPage3o1_TopicDetails.html?itemId="+$(this).attr('itemId')+"&from=1";
            })
        });

        scollto(thisScroll);
    }else{
        flagp += 1;
    }
}

function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },0);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}