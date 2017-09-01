/**
 * Created by Kris on 2016/12/19.
 */
var timeArr2 = [];
var lFlag = 0 ;
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
            pageOnload();
        }, 200);
    }
    //pageOnload();
});

function pageOnload() {
    document.getElementById('backpage1').addEventListener("click", touchBack, false);
    document.getElementById('toMorePages').addEventListener("click", touchMore, false);
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



    //加载最近三日调增100%的个股
    //    异步
    //获取最近3个工作日
    openDateSetDay();

    //加载研究员最新发表
    StocksByAuthorOnload();

}

function openDateSetDay(){
    var timestamp = Date.parse(new Date());
    var dateTemp1 = new Date();
    var dateDiff1 = getNowFormatDate(dateTemp1).substring(0,10);
    var dateDiff3 = parseInt(dateTemp1.toTimeString().substring(0,2))*60 +  parseInt(dateTemp1.toTimeString().substring(3,5));
    httpGet("Reader/GetStockOpendays?endTime="+timestamp+"&sortType=1&count=7","",true,ajax_successTD,ajax_failTD);
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
        ForcastingStocksOnload();
        //console.log(timeArr2);
    }
    function ajax_failTD(){
        openDateSetDay();
    }
}




function ForcastingStocksOnload(){
    httpGet("Reader/StockReportInfos?stockIds=&stockNames=&fromMonth=0&from=0&size=20&lessInstitutionNum=0&lessPercent=1000&ignoreLimit=false","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);

        if(obj != undefined && obj != null && obj != "" && obj != [] ){
            var trTag = 0;
            for( var i = 0; i < obj.length; i++){
                //if( obj[i].LastAdjustTime.substring(5,10) == timeArr2[0] || obj[i].LastAdjustTime.substring(5,10) == timeArr2[1] || obj[i].LastAdjustTime.substring(5,10) == timeArr2[2] ){

                    //console.log(i);
                    $(".ForecastTable.onDataTable").append("" +
                    "<tr class='ForecastTableImf'><td> " +
                    "<span class='stockName stockLink'></span> " +
                    "<span class='stockCode'></span></td> " +
                    "<td class='FtopicName'></td> " +
                    "<td class='FadjustDate'></td> " +
                    "<td class='FreportCount'></td> " +
                    "<td class='rise'></td></tr>"+
                    "");

                    $(".onDataTable .stockName").eq(trTag).attr("itemId",obj[i].StockID);
                    $(".onDataTable .stockName").eq(trTag).text(obj[i].StockName);
                    $(".onDataTable .stockCode").eq(trTag).text(stocksIdTransform(obj[i].StockID));
                    $(".onDataTable .FtopicName").eq(trTag).text(obj[i].RelatedTopicName);
                    $(".onDataTable .FadjustDate").eq(trTag).text(obj[i].LastAdjustTime.substring(5,10));
                    $(".onDataTable .FreportCount").eq(trTag).text(obj[i].AdjustReportCount);
                    if(obj[i].AdjustPercent >= 0){
                        $(".onDataTable .rise").eq(trTag).text("+"+returnFloat(obj[i].AdjustPercent)+"%");
                    }else if(obj[i].AdjustPercent <0 ){
                        $(".onDataTable .rise").eq(trTag).text(returnFloat(obj[i].AdjustPercent)+"%");
                        $(".onDataTable .rise").eq(trTag).css("color","#F74C59");
                    }
                    trTag ++;
                //}
            }
            $(".ForecastTable.onDataTable .stockLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url,  'tool1_0_EarningsForecasts.html?itemId='+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });
            loadend()
            $(".SecondryMainBoxTitle").eq(0).css("display","block");
            $(".ForecastTableBox").eq(0).css("display","block");
        }else{
            $(".SecondryMainBoxTitle").eq(0).css("display","none");
            $(".ForecastTableBox").eq(0).css("display","none");

        }

        loadend();


    }

    function ajax_failFS(obj){
        $(".SecondryMainBoxTitle").eq(0).css("display","none");
        $(".ForecastTableBox").eq(0).css("display","none");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            ForcastingStocksOnload();
            StocksByAuthorOnload();
        });
    }

}


//加载明星研究员数据
function StocksByAuthorOnload(){
    httpGet("Reader/RateInfosByConfident?count=5","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        if (obj != null && obj != "" && obj != undefined){
            for( var i = 0; i < obj.length; i++){
                $(".ForecastTableByAuthor").append("" +
                "<tr class='ForecastTableImf2'> " +
                "<td class='AuthorImfAgencyName'></td> " +
                "<td class='AuthorImfAuthorName'></td> " +
                "<td class='AuthorImfConfidLevel'></td> <td> " +
                "<span class='stockName'></span> " +
                "<span class='stockCode'></span> </td> " +
                "<td  class='AuthorImfAdjustRange'></td> </tr>" +
                "");

                $(".ForecastTableByAuthor .AuthorImfAgencyName").eq(i).text(obj[i].AgencyName.substring(0,4));

                //$(".ForecastTableByAuthor .AuthorImfAuthorName").eq(i).text(obj[i].Author);

                var authorList = obj[i].Author.split(",");
                for( var a = 0 ; a < authorList.length ; a++){
                    $(".ForecastTableByAuthor .AuthorImfAuthorName").eq(i).append("<span>"+authorList[a]+"</span>");
                    if( a != authorList.length -1){
                        $(".stocksDetails .RateAuthor").eq(i).append("，");
                    }
                    $(".ForecastTableByAuthor .AuthorImfAuthorName:eq("+i+") span").eq(a).attr("itemId", obj[i].AgencyID);

                    $(".ForecastTableByAuthor .AuthorImfAuthorName:eq("+i+") span").eq(a).attr("authorName", authorList[a]);
                    $(".ForecastTableByAuthor .AuthorImfAuthorName:eq("+i+") span").eq(a).attr("StockID", obj[i].StockId);
                }

                $(".ForecastTableByAuthor .AuthorImfConfidLevel").eq(i).text(returnFloat(obj[i].ConfidLevel));
                $(".ForecastTableByAuthor .stockName").eq(i).text(obj[i].StockName);
                $(".ForecastTableByAuthor .stockCode").eq(i).text(stocksIdTransform(obj[i].StockId));

                if(obj[i].AdjustRange >= 0){
                    $(".ForecastTableByAuthor .AuthorImfAdjustRange").eq(i).text("+"+returnFloat(obj[i].AdjustRange)+"%");
                    $(".ForecastTableByAuthor .AuthorImfAdjustRange").eq(i).css("color","#FD3642");
                }else if(obj[i].AdjustRange <0 ){
                    $(".ForecastTableByAuthor .AuthorImfAdjustRange").eq(i).text(returnFloat(obj[i].AdjustRange)+"%");
                    $(".ForecastTableByAuthor .AuthorImfAdjustRange").eq(i).css("color","#1DBF90");
                }

            }


            $(".ForecastTableByAuthor .AuthorImfAuthorName span").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    //console.log("评论员详情页暂未就绪");
                    var authorNameCode =  encodeURI(encodeURI($(this).attr("authorName")));


                    AddGoback(localStorage.N_url, 'tool1_1_Researcher.html?itemId='+$(this).attr("itemId")+'&authorName='+authorNameCode+"&stockID="+$(this).attr("StockID")+"&scroll="+document.body.scrollTop);
                    //window.location.href ='tool1_1_Researcher.html?itemId='+$(this).attr("itemId")+'&authorName='+authorNameCode+"&stockID="+ItemId+'&scroll='+document.body.scrollTop;
                    //slide('left','lightblue',1,'tool1_1_Researcher.html?itemId='+$(this).attr("itemId")+'&authorName='+authorNameCode+"&stockID="+ItemId+'&scroll='+document.body.scrollTop);
                })
            });

            loadend();
            $(".SecondryMainBoxTitle").eq(1).css("display","block");
            $(".ForecastTableByAuthor").css("display","block");
            $(".ForecastTableTilte2").eq(1).css("display","block");
        }else{
            $(".SecondryMainBoxTitle").eq(1).css("display","none");
            $(".ForecastTableByAuthor").css("display","none");
            $(".ForecastTableTilte2").eq(1).css("display","none");
        }

        loadend();
    }

    function ajax_failFS(obj){

        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            ForcastingStocksOnload();
            StocksByAuthorOnload();
        });
    }

}
function loadend(){
    if( lFlag >= 1 ){
        lFlag = 0;

        $(".loading").css("display", "none");
        //$(".viewHeadContentText").css("display","block");

    }else{
        lFlag += 1;
    }

}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //parent.location='index.html';
}
function touchMore(event){
    event.stopPropagation();
    event.preventDefault();
    AddGoback(localStorage.N_url, 'tool0_1_forecastStocksList.html');
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href ='tool0_1_forecastStocksList.html';
    //parent.location='index.html';
}