/**
 * Created by aa on 2016/8/9.
 */

var timeTag = 0;
var themeTag = 0 ;
var pageScroll=parseInt(GetQueryString("scroll"));
var endTime = Math.round(new Date()/1000);
//当天数据
var fromTimeOfDay = Math.round(new Date() / 1000)-86400-86400;
//五天数据
var fromTimeOfDay5 = Math.round(new Date() / 1000)-432000-86400;
//十天数据
var fromTimeOfDay10 = Math.round(new Date() / 1000)-864000-86400;
//三十天数据
var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000-86400;
//六十天数据
var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000-86400;
var fp = 0;

$(function(){
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
            pageOnload();
        }, 200);
    }
});

function pageOnload() {
    document.getElementById('backpage').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
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
            //window.location.href = 'index.html'+'?scroll='+ScrollMain;
            //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+ScrollMain);
            //parent.location='index.html';
        }
    });

    $(".switchOfBoard>.switchBd").each(function(index){
        $(this).on("click",function(e){
            themeTag = index;
            sessionStorage.dataToolBtypeTag1 = index;
            e.stopPropagation();
            e.preventDefault();
            $(".loadBoard").css("display", "block");
            $(".switchOfBoard>.switchBd").removeClass("thisDisplay");
            $(".billBoardSwitchBox>.billBoardSwitch").removeClass("thisdisplay");
            $(this).addClass("thisDisplay");
            $(".billBoardSwitchBox>.billBoardSwitch").eq(index).addClass("thisdisplay");
            DataDisplayOnLoad();
        })
    });

    if( sessionStorage.dataToolBtypeTag1 == undefined ){

    }else if( sessionStorage.dataToolBtypeTag1 == 0 ){
        themeTag = 0;
        $(".switchOfBoard>.switchBd").removeClass("thisDisplay");
        $(".billBoardSwitchBox>.billBoardSwitch").removeClass("thisdisplay");
        $(".switchOfBoard>.switchBd").eq(0).addClass("thisDisplay");
        $(".billBoardSwitchBox>.billBoardSwitch").eq(0).addClass("thisdisplay");
    }else if( sessionStorage.dataToolBtypeTag1 == 1 ){
        themeTag = 1;
        $(".switchOfBoard>.switchBd").removeClass("thisDisplay");
        $(".billBoardSwitchBox>.billBoardSwitch").removeClass("thisdisplay");
        $(".switchOfBoard>.switchBd").eq(1).addClass("thisDisplay");
        $(".billBoardSwitchBox>.billBoardSwitch").eq(1).addClass("thisdisplay");
    }else if( sessionStorage.dataToolBtypeTag1 == 2 ){
        themeTag = 2;
        $(".switchOfBoard>.switchBd").removeClass("thisDisplay");
        $(".billBoardSwitchBox>.billBoardSwitch").removeClass("thisdisplay");
        $(".switchOfBoard>.switchBd").eq(2).addClass("thisDisplay");
        $(".billBoardSwitchBox>.billBoardSwitch").eq(2).addClass("thisdisplay");
    }

    $(".switchOfDays>.switchOfDaysBtn").each(function(index){
        $(this).on("click",function(e){
            timeTag = index;
            sessionStorage.dataToolBtypeTag2 = index;
            e.stopPropagation();
            e.preventDefault();
            $(".loadBoard").css("display", "block");
            $(".billBoardImfItem1").empty();
            $(".billBoardItemScrollBox").empty();
            $(".billBoardImfItem2").empty();
            $(".billBoardItemScrollBox2").empty();
            $(".billBoardImfItem3").empty();
            $(".billBoardItemScrollBox3").empty();
            $(".switchOfDays>.switchOfDaysBtn").removeClass("thisDisplay");
            //$(".billBoardSwitchBox>.billBoardSwitch").removeClass("thisdisplay");
            $(this).addClass("thisDisplay");
            //$(".billBoardSwitchBox>.billBoardSwitch").eq(index).addClass("thisdisplay");
            DataDisplayOnLoad()
        })
    });

    if( sessionStorage.dataToolBtypeTag2 == undefined ){

    }else if( sessionStorage.dataToolBtypeTag2 == 0 ){
        timeTag = 0;
        $(".switchOfDays>.switchOfDaysBtn").removeClass("thisDisplay");
        $(".switchOfDays>.switchOfDaysBtn").eq(0).addClass("thisDisplay");
    }else if( sessionStorage.dataToolBtypeTag2 == 1 ){
        timeTag = 1;
        $(".switchOfDays>.switchOfDaysBtn").removeClass("thisDisplay");
        $(".switchOfDays>.switchOfDaysBtn").eq(1).addClass("thisDisplay");
    }else if( sessionStorage.dataToolBtypeTag2 == 2 ){
        timeTag = 2;
        $(".switchOfDays>.switchOfDaysBtn").removeClass("thisDisplay");
        $(".switchOfDays>.switchOfDaysBtn").eq(2).addClass("thisDisplay");
    }else if( sessionStorage.dataToolBtypeTag2 == 3 ){
        timeTag = 3;
        $(".switchOfDays>.switchOfDaysBtn").removeClass("thisDisplay");
        $(".switchOfDays>.switchOfDaysBtn").eq(2).addClass("thisDisplay");
    }else if( sessionStorage.dataToolBtypeTag2 == 4 ){
        timeTag = 4;
        $(".switchOfDays>.switchOfDaysBtn").removeClass("thisDisplay");
        $(".switchOfDays>.switchOfDaysBtn").eq(2).addClass("thisDisplay");
    }

    DataDisplayOnLoad();
}



function DataDisplayOnLoad(){
    if(themeTag == 0){
        stockOnLoad();
    }else if(themeTag == 1){
        TopicOnLoad();
    }else if(themeTag == 2){
        SeatOnLoad();
    }else{
        stockOnLoad();
    }
}

function stockOnLoad(){
    var timeStampGet = 0;
    if( timeTag == 0 ){
        timeStampGet = fromTimeOfDay;
    }else if( timeTag == 1 ){
        timeStampGet = fromTimeOfDay5;
    }else if( timeTag == 2 ){
        timeStampGet = fromTimeOfDay10;
    }else if( timeTag == 3 ){
        timeStampGet = fromTimeOfMonth;
    }else if( timeTag == 4 ){
        timeStampGet = fromTimeOfMonth2;
    }else {
        timeStampGet = fromTimeOfDay;
    }
    httpGet("Reader/StocksBillboard?fromTime="+timeStampGet+"&endTime="+endTime+"&sortType=0&maxCount=30","",true,ajax_successList,ajax_failList);
    function ajax_successList(obj){
        //console.log(themeTag,timeTag);
        //console.log("股票列表:from "+timeStampGet+" to "+ endTime);
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){
            $(".billBoardImfItem1").empty();
            $(".billBoardItemScrollBox").empty();
            $(".billBoardImfItem1").append(" <div class='billBoardStockTitleFixed'>股票</div> ");
            $(".billBoardItemScrollBox").append("  <tr class='billBoardStocksTitle'> <td>所属主题</td> <td>上榜次数</td> <td>净买额占<br>总成交%</td> <td>龙虎榜<br>买入额(万)</td> <td>龙虎榜<br>卖出额(万)</td> <td>换手率</td> <td>流通市值(亿)</td> </tr>");


            for( var i = 0; i < obj.length; i++){
                $(".billBoardImfItem1").append("  <div class='billBoardStocksListName'> " +
                "<div class='billBoardStockName'></div> " +
                "<div class='billBoardStockCode'></div> </div>");
                
                $(".billBoardItemScrollBox").append("<tr class='billBoardStocksDetails'> " +
                "<td class='relatedBlockName'>  </td> " +
                "<td class='upCount'></td> " +
                "<td class='netBuyInAll'></td> " +
                "<td class='buyAmount'></td> " +
                "<td class='sellAmount'></td> " +
                "<td class='changePercent'></td> " +
                "<td class='marketValue'></td> </tr>");

                $(".billBoardImfItem1 .billBoardStocksListName").eq(i).attr("itemId", obj[i].StockID);
                $(".billBoardImfItem1 .billBoardStockName").eq(i).text(obj[i].StockName);
                $(".billBoardImfItem1 .billBoardStockCode").eq(i).text(stocksIdTransform(obj[i].StockID));

                $(".billBoardItemScrollBox .relatedBlockName").eq(i).text(obj[i].RelatedBlockName);
                $(".billBoardItemScrollBox .upCount").eq(i).text(obj[i].UpCount);
                if( returnFloat(obj[i].NetBuyInAll) > 0){
                    $(".billBoardItemScrollBox .netBuyInAll").eq(i).text("+"+returnFloat(obj[i].NetBuyInAll));
                }else{
                    $(".billBoardItemScrollBox .netBuyInAll").eq(i).text(returnFloat(obj[i].NetBuyInAll));
                }

                $(".billBoardItemScrollBox .buyAmount").eq(i).text(returnFloat(obj[i].BuyAmount/10000));
                $(".billBoardItemScrollBox .sellAmount").eq(i).text(returnFloat(obj[i].SellAmount/10000));
                $(".billBoardItemScrollBox .changePercent").eq(i).text(returnFloat(obj[i].ChangePercent)+"%");
                $(".billBoardItemScrollBox .marketValue").eq(i).text(returnFloat(obj[i].MarketValue/100000000));
            }

            $(".billBoardImfItem1 .billBoardStocksListName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    //console.log("股票"+$(this).attr("itemId")+"暂无详情页");
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=billboard";
                    //slide('left','lightblue',1,'stock.html?stockId="+$(this).attr("itemId")+"&fromPage=billboard');
                })
            });

            $(".billBoardImfItem1").append("<div class='billBoardStocksListName'></div>");
            $(".billBoardItemScrollBox").append("<tr class='billBoardStocksDetails'> <td></td> </tr>");
        }else{
            $(".billBoardImfItem1").empty();
            $(".billBoardItemScrollBox").empty();
            $(".billBoardImfItem1").append("<div class='billBoardStocksListName'></div>");
            $(".billBoardItemScrollBox").append("<tr class='billBoardStocksDetails'> <td></td> </tr>");
        }
        loadend();
    }
    function ajax_failList(){
        //$(".billBoardImfItem1").empty();
        //$(".billBoardItemScrollBox").empty();
        //$(".billBoardImfItem1").append("<div class='billBoardStocksListName'></div>");
        //$(".billBoardItemScrollBox").append("<tr class='billBoardStocksDetails'> <td></td> </tr>");
        console.log("加载失败");
        $(".thisLoad").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".thisLoad .loadingImg2").on("click",function(){
            $(".thisLoad .loadingImg2").remove();
            $(".thisLoad .notcontent").remove();
            $(".thisLoad").html("<img src='img/loading.gif' class='loadingImg2'>");
            stockOnLoad();
        });
    }
}

function TopicOnLoad(){
    var timeStampGet = 0;
    if( timeTag == 0 ){
        timeStampGet = fromTimeOfDay;
    }else if( timeTag == 1 ){
        timeStampGet = fromTimeOfDay5;
    }else if( timeTag == 2 ){
        timeStampGet = fromTimeOfDay10;
    }else if( timeTag == 3 ){
        timeStampGet = fromTimeOfMonth;
    }else if( timeTag == 4 ){
        timeStampGet = fromTimeOfMonth2;
    }else {
        timeStampGet = fromTimeOfDay;
    }

    httpGet("Reader/TopicsBillboard?fromTime="+timeStampGet+"&endTime="+endTime+"&sortType=0&maxCount=30","",true,ajax_successListT,ajax_failListT);
    function ajax_successListT(obj){
        //console.log(themeTag,timeTag);
        //console.log("主题列表:from "+timeStampGet+" to "+ endTime);
        //console.log(obj);

        if( obj != null && obj != "" && obj != undefined){
            $(".billBoardImfItem2").empty();
            $(".billBoardItemScrollBox2").empty();
            $(".billBoardImfItem2").append(" <div class='billBoardTopicTitleFixed'>主题</div>");
            $(".billBoardItemScrollBox2").append(" <tr class='billBoardTopicTitle'> <td>股票数</td> <td>席位数</td> <td>上榜次数</td> <td>净买额占<br>总成交%</td> <td>龙虎榜<br>买入额(万)</td> <td>龙虎榜<br>卖出额(万)</td> <td>流通市值(亿)</td> </tr>");

            for( var i = 0; i < obj.length; i++){
                $(".billBoardImfItem2").append("<div class='billBoardTopicListName'></div>");

                $(".billBoardItemScrollBox2").append("<tr class='billBoardTopicDetails'> " +
                "<td class='stockCount'></td> " +
                "<td class='seatCount'></td> " +
                "<td class='upCount'></td> " +
                "<td class='netBuyInAll'></td> " +
                "<td class='buyAmount'></td> " +
                "<td class='sellAmount'></td> " +
                //"<td class='changePercent'></td> " +
                "<td class='marketValue'></td></tr>");

                $(".billBoardImfItem2 .billBoardTopicListName").eq(i).attr("itemId", obj[i].BlockID);
                $(".billBoardImfItem2 .billBoardTopicListName").eq(i).text(obj[i].BlockName);

                $(".billBoardItemScrollBox2 .stockCount").eq(i).text(obj[i].StockCount);
                $(".billBoardItemScrollBox2 .seatCount").eq(i).text(obj[i].SeatCount);
                $(".billBoardItemScrollBox2 .upCount").eq(i).text(obj[i].UpCount);
                if( returnFloat(obj[i].NetBuyInAll) > 0){
                    $(".billBoardItemScrollBox2 .netBuyInAll").eq(i).text("+"+returnFloat(obj[i].NetBuyInAll));
                }else{
                    $(".billBoardItemScrollBox2 .netBuyInAll").eq(i).text(returnFloat(obj[i].NetBuyInAll));
                }

                $(".billBoardItemScrollBox2 .buyAmount").eq(i).text(returnFloat(obj[i].BuyAmount/10000));
                $(".billBoardItemScrollBox2 .sellAmount").eq(i).text(returnFloat(obj[i].SellAmount/10000));
                //$(".billBoardItemScrollBox2 .changePercent").eq(i).text(returnFloat(obj[i].ChangePercent)+"%");
                $(".billBoardItemScrollBox2 .marketValue").eq(i).text(returnFloat(obj[i].MarketValue/100000000));
            }

            $(".billBoardImfItem2 .billBoardTopicListName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=toolPages'+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'opportunityPages/opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&from=toolPages'+'&scroll='+document.body.scrollTop);
                })
            });

            $(".billBoardImfItem2").append("<div class='billBoardTopicListName'></div>");
            $(".billBoardItemScrollBox2").append("<tr class='billBoardTopicDetails'> <td></td> </tr>");
        }else{
            $(".billBoardImfItem2").empty();
            $(".billBoardItemScrollBox2").empty();
            $(".billBoardImfItem2").append("<div class='billBoardTopicListName'></div>");
            $(".billBoardItemScrollBox2").append("<tr class='billBoardTopicDetails'> <td></td> </tr>");
        }
        loadend();
    }
    function ajax_failListT(){
        //$(".billBoardImfItem2").empty();
        //$(".billBoardItemScrollBox2").empty();
        //$(".billBoardImfItem2").append("<div class='billBoardTopicListName'></div>");
        //$(".billBoardItemScrollBox2").append("<tr class='billBoardTopicDetails'> <td></td> </tr>");
        console.log("加载失败");
        $(".thisLoad").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".thisLoad .loadingImg2").on("click",function(){
            $(".thisLoad .loadingImg2").remove();
            $(".thisLoad .notcontent").remove();
            $(".thisLoad").html("<img src='img/loading.gif' class='loadingImg2'>");
            TopicOnLoad();
        });
    }

}

function SeatOnLoad(){
    var timeStampGet = 0;
    if( timeTag == 0 ){
        timeStampGet = fromTimeOfDay;
    }else if( timeTag == 1 ){
        timeStampGet = fromTimeOfDay5;
    }else if( timeTag == 2 ){
        timeStampGet = fromTimeOfDay10;
    }else if( timeTag == 3 ){
        timeStampGet = fromTimeOfMonth;
    }else if( timeTag == 4 ){
        timeStampGet = fromTimeOfMonth2;
    }else {
        timeStampGet = fromTimeOfDay;
    }


    httpGet("Reader/SeatsBillboard?fromTime="+timeStampGet+"&endTime="+endTime+"&sortType=0&maxCount=30","",true,ajax_successListS,ajax_failListS);
    function ajax_successListS(obj){
        //console.log(themeTag,timeTag);
        //console.log("席位列表:from "+timeStampGet+" to "+ endTime);
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){
            $(".billBoardImfItem3").empty();
            $(".billBoardItemScrollBox3").empty();
            $(".billBoardImfItemScroll3 .billBoardSeatDetails").remove();
            $(".billBoardImfItem3").append(" <div class='billBoardSeatTitleFixed'>营业部名称</div>");
            $('.billBoardItemScrollBox3').append("<tr class='billBoardSeatTitle'> <td rowspan='2'>买入股票前三</td> <td rowspan='2'>所属主题前三</td> <td rowspan='2'>上榜次数</td> <td rowspan='2'>累计买入净额<br>/流通市值</td> <td colspan='2'>上榜后1天</td> <td colspan='2'>上榜后2天</td> <td colspan='2'>上榜后3天</td> </tr>" +
            "<tr class='billBoardSeatTitleVice'> <td>平均涨幅</td> <td>上涨概率</td> <td>平均涨幅</td> <td>上涨概率</td> <td>平均涨幅</td> <td>上涨概率</td> </tr>");
            for( var i = 0; i < obj.length; i++){
                $(".billBoardImfItem3").append(" <div class='billBoardSeatListName'></div>");
                $(".billBoardItemScrollBox3").append(" <tr class='billBoardSeatDetails'> " +
                "<td class='topStocks'></td> " +
                "<td class='topTopics'></td> " +
                "<td class='upCount'></td> " +
                "<td class='netBuyPercent'></td> " +
                "<td class='firstDayUpPercent'></td> " +
                "<td class='firstDayUpChances'></td> " +
                "<td class='secondDayUpPercent'></td> " +
                "<td class='secondayUpChances'></td> " +
                "<td class='thirdDayUpPercent'></td> " +
                "<td class='thirdDayUpChances'></td></tr>");

                $(".billBoardImfItem3 .billBoardSeatListName").eq(i).attr("itemId", obj[i].SeatID);
                $(".billBoardImfItem3 .billBoardSeatListName").eq(i).html(obj[i].SeatName.replace( "公司" , '公司<br>'));
                $(".billBoardImfItem3 .billBoardSeatListName").eq(i).attr("itemName", obj[i].SeatName);

                if( obj[i].TopStocks != null && obj[i].TopStocks != "" && obj[i].TopStocks != undefined){
                    for( var sn = 0 ; sn < obj[i].TopStocks.length ; sn ++){
                        $(".billBoardItemScrollBox3 .topStocks").eq(i).append(obj[i].TopStocks[sn]+"  ");
                    }
                }
                if( obj[i].TopTopics != null && obj[i].TopTopics != "" && obj[i].TopTopics != undefined){
                    for( var tn = 0 ; tn < obj[i].TopTopics.length ; tn ++){
                        $(".billBoardItemScrollBox3 .topTopics").eq(i).append(obj[i].TopTopics[tn]+"  ");
                    }
                }
                $(".billBoardItemScrollBox3 .upCount").eq(i).text(obj[i].UpCount);
                if( returnFloat(obj[i].NetBuyPercent) > 0){
                    $(".billBoardItemScrollBox3 .netBuyPercent").eq(i).text("+"+returnFloat(obj[i].NetBuyPercent)+"%");
                }else{
                    $(".billBoardItemScrollBox3 .netBuyPercent").eq(i).text(returnFloat(obj[i].NetBuyPercent)+"%");
                }
                //$(".billBoardItemScrollBox3 .netBuyPercent").eq(i).text(Math.round(obj[i].NetBuyPercent*10000)/100);


                if( returnFloat(obj[i].FirstDayUpPercent) > 0){
                    $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).text("+"+returnFloat(obj[i].FirstDayUpPercent)+"%");
                    // $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).css("color", "#f74c59");
                }else if( returnFloat(obj[i].FirstDayUpPercent) == 0){
                    $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).text(returnFloat(obj[i].FirstDayUpPercent)+"%");
                    $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).css("color", "#333333");
                }else if( returnFloat(obj[i].FirstDayUpPercent) < 0){
                    $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).text(returnFloat(obj[i].FirstDayUpPercent)+"%");
                    $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).css("color", "#1DBF60");
                }
                //$(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).text(Math.round(obj[i].FirstDayUpPercent*100)/100);
                //if( obj[i].FirstDayUpPercent < 0 ){
                //    $(".billBoardItemScrollBox3 .firstDayUpPercent").eq(i).css("color", "#1DBF60 ");
                //}
                $(".billBoardItemScrollBox3 .firstDayUpChances").eq(i).text(returnFloat(obj[i].FirstDayUpChances)+"%");

                if( returnFloat(obj[i].SecondDayUpPercent) > 0){
                    $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).text("+"+returnFloat(obj[i].SecondDayUpPercent)+"%");
                    // $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).css("color", "#f74c59");
                }else if( returnFloat(obj[i].SecondDayUpPercent) == 0){
                    $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).text(returnFloat(obj[i].SecondDayUpPercent)+"%");
                    $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).css("color", "#333333");
                }else if( returnFloat(obj[i].SecondDayUpPercent) < 0){
                    $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).text(returnFloat(obj[i].SecondDayUpPercent)+"%");
                    $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).css("color", "#1DBF60");
                }
                //$(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).text(Math.round(obj[i].SecondDayUpPercent*100)/100);
                //if( obj[i].FirstDayUpPercent < 0 ){
                //    $(".billBoardItemScrollBox3 .secondDayUpPercent").eq(i).css("color", "#1DBF60 ");
                //}
                $(".billBoardItemScrollBox3 .secondayUpChances").eq(i).text(returnFloat(obj[i].SecondayUpChances)+"%");


                if( returnFloat(obj[i].ThirdDayUpPercent) > 0){
                    $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).text("+"+returnFloat(obj[i].ThirdDayUpPercent)+"%");
                    // $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).css("color", "#f74c59");
                }else if( returnFloat(obj[i].ThirdDayUpPercent) == 0){
                    $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).text(returnFloat(obj[i].ThirdDayUpPercent)+"%");
                    $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).css("color", "#333333");
                }else if( returnFloat(obj[i].ThirdDayUpPercent) < 0){
                    $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).text(returnFloat(obj[i].ThirdDayUpPercent)+"%");
                    $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).css("color", "#1DBF60");
                }
                //$(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).text(Math.round(obj[i].ThirdDayUpPercent*100)/100);
                //if( obj[i].FirstDayUpPercent < 0 ){
                //    $(".billBoardItemScrollBox3 .thirdDayUpPercent").eq(i).css("color", "#1DBF60 ");
                //}
                $(".billBoardItemScrollBox3 .thirdDayUpChances").eq(i).text(returnFloat(obj[i].ThirdDayUpChances)+"%");

            }

            $(".billBoardImfItem3 .billBoardSeatListName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    //console.log("暂无席位详情页");
                    var SeatNameURIChange = encodeURI(encodeURI($(this).attr("itemName")));
                    AddGoback(localStorage.N_url, 'tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&seatName='+SeatNameURIChange+'&scroll='+document.body.scrollTop);

                    //AddGoback(localStorage.N_url, 'tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                    //window.location.href ='tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'tool3_1_SalesDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);
                })
            });

            $(".billBoardImfItem3").append("<div class='billBoardSeatListName'></div>");
            $(".billBoardImfItemScroll3").append("<tr class='billBoardSeatDetails'> <td></td> </tr>");
        }else{
            $(".billBoardImfItem3").empty();
            $(".billBoardItemScrollBox3").empty();
            $(".billBoardImfItem3").append("<div class='billBoardSeatListName'></div>");
            $(".billBoardImfItemScroll3").append("<tr class='billBoardSeatDetails'> <td></td> </tr>");
        }
        loadend();
    }
    function ajax_failListS(){
        //$(".billBoardImfItem3").empty();
        //$(".billBoardItemScrollBox3").empty();
        //$(".billBoardImfItem3").append("<div class='billBoardSeatListName'></div>");
        //$(".billBoardImfItemScroll3").append("<tr class='billBoardSeatDetails'> <td></td> </tr>");
        console.log("加载失败");

        $(".thisLoad").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".thisLoad .loadingImg2").on("click",function(){
            $(".thisLoad .loadingImg2").remove();
            $(".thisLoad .notcontent").remove();
            $(".thisLoad").html("<img src='img/loading.gif' class='loadingImg2'>");
            SeatOnLoad();
        });
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.location.href = 'chanceSecondary05_billboard.html';
    //window.location.href = 'index.html';
    //slide('right', 'lightblue', 1, 'index.html');
}

function loadend(){
    if( fp == 0 ){
        scollto(pageScroll);
        fp += 1;
    }

    $(".loadBoard").css("display", "none");
}

function scollto(n){
    $("body,html").animate({
        scrollTop:n
    },100);
}
