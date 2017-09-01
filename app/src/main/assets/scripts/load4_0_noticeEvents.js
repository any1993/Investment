/**
 * Created by aa on 2016/8/9.
 */
var tag = 0;
var endTime = Math.round(new Date()/1000);
//当天数据
var fromTimeOfDay = Math.round(new Date() / 1000)-86400;
//五天数据
var fromTimeOfDay5 = Math.round(new Date() / 1000)-432000;
//十天数据
var fromTimeOfDay10 = Math.round(new Date() / 1000)-864000;
//三十天数据
var fromTimeOfMonth = Math.round(new Date() / 1000)-2592000;
//六十天数据
var fromTimeOfMonth2 = Math.round(new Date() / 1000)-5184000-5184000-5184000;

var loadflag = 0;


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
    //pageOnload();
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

    $(".switchOfNews>.switchN1").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            sessionStorage.dataToolNEtypeTag1 = index;
            if( index == 0 ){
                $(".BulkBox").addClass("boxDisplay");
                $(".IncreaseBox").removeClass("boxDisplay");
            }else if( index == 1 ){
                $(".IncreaseBox").addClass("boxDisplay");
                $(".BulkBox").removeClass("boxDisplay");
            }
            $(".switchOfNews>.switchN1").removeClass("thisDisplay");
            $(this).addClass("thisDisplay");
        })
    });

    if( sessionStorage.dataToolNEtypeTag1 == undefined ){

    }else if( sessionStorage.dataToolNEtypeTag1 == 0 ){
        $(".switchOfNews>.switchN1").removeClass("thisDisplay");
        $(".switchOfNews>.switchN1").eq(0).addClass("thisDisplay");
        $(".BulkBox").addClass("boxDisplay");
        $(".IncreaseBox").removeClass("boxDisplay");
    }else if( sessionStorage.dataToolNEtypeTag1 == 1 ){
        $(".switchOfNews>.switchN1").removeClass("thisDisplay");
        $(".switchOfNews>.switchN1").eq(1).addClass("thisDisplay");
        $(".IncreaseBox").addClass("boxDisplay");
        $(".BulkBox").removeClass("boxDisplay");
    }

    dataOnLoad();
}



function dataOnLoad(){
    //加载异常定增
    httpGet("Reader/AbnormalIncreases?fromTime="+fromTimeOfMonth2+"&endTime="+endTime,"",true,ajax_successListI,ajax_failListI);
    function ajax_successListI(obj){
        //console.log("异常定增");
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){
            $(".IncreaseBox .boxTime").text(obj[0].OccurTime.substring(0,10));
            for( var i = 0; i < obj.length; i++){
                $(".newsTable").append(" <tr class='abnormalTableContent'> " +
                "<td> <span class='barStocksName'></span> <span class='stocksCode'></span> </td> " +
                "<td class='thisTopicRelated'></td> " +
                "<td class='increasePrice'></td> " +
                "<td class='diffPricePercent' ></td> " +
                "<td class='lockUpPeriod' ></td> </tr> " +
                "<tr class='abnormalTableNews' > " +
                "<td class='abnormalNewsBlock'> <div class='abnormalNewsBox'></div> " +
                "<div class='newsClearBlock' style='height: 45px;'></div> </td> </tr>");

                $(".newsTable .barStocksName").eq(i).text(obj[i].StockName);
                $(".newsTable .barStocksName").eq(i).attr("itemId", obj[i].StockID);

                $(".newsTable .stocksCode").eq(i).text(stocksIdTransform(obj[i].StockID));

                $(".newsTable .thisTopicRelated").eq(i).text(obj[i].RelatedTopicName);
                $(".newsTable .thisTopicRelated").eq(i).attr("itemId",obj[i].RelatedTopicID);

                $(".newsTable .increasePrice").eq(i).text(returnFloat(obj[i].IncreasePrice));

                $(".newsTable .diffPricePercent").eq(i).text(returnFloat(obj[i].DiffPricePercent)+"%");

                if(obj[i].DiffPricePercent < 0 ){
                    $(".newsTable .diffPricePercent").eq(i).css("color", "#2DC25D");
                }

                if(obj[i].LockPeriod != null && obj[i].LockPeriod != "" && obj[i].LockPeriod != undefined ){
                    $(".newsTable .lockUpPeriod").eq(i).text(obj[i].LockPeriod);
                }else{
                    $(".newsTable .lockUpPeriod").eq(i).text("-");
                }

                if( obj[i].AbnormalReason != "" &&  obj[i].AbnormalReason != null && obj[i].AbnormalReason != undefined ){
                    $(".newsTable .abnormalNewsBox").eq(i).html(obj[i].AbnormalReason+"<div class='IncreasesTime'>"+obj[i].OccurTime.substring(0,10)+"</div>");

                }else{
                    $(".newsTable .abnormalNewsBox").eq(i).html("—"+"<div class='IncreasesTime'>"+obj[i].OccurTime.substring(0,10)+"</div>");
                }

            }

            $(".abnormalNewsBox").css("width", (document.documentElement.clientWidth - 30) + "px");
            window.addEventListener("resize", function() {
                $(".abnormalNewsBox").css("width", (document.documentElement.clientWidth - 30) + "px");
            });


            $(".newsTable .barStocksName").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });
            $(".newsTable .thisTopicRelated").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                    //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
                })
            });

        }else{

        }
        loadend();
    }
    function ajax_failListI(){
        console.log("加载失败");
        loadflag = 0;
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            dataOnLoad();
        });

    }


    //加载异常大宗
    httpGet("Reader/AbnormalBlocks?fromTime="+fromTimeOfMonth+"&endTime="+endTime,"",true,ajax_successListB,ajax_failListB);
    function ajax_successListB(obj){
        //console.log("异常大宗");
        //console.log(obj);
        if( obj != null && obj != "" && obj != undefined){
            $(".BulkBox .boxTime").text(obj[0].OccurTime.substring(0,10));
            for( var i = 0; i < obj.length; i++){
                $(".bulkImfItem1").append("<div class='bulkListName'> " +
                "<div class='barStocksName'></div> " +
                "<div class='stocksCode'></div></div>");

                $(".bulkImfItemScroll").append("<tr class='bulkDetails'> " +
                "<td class='relatedTopicName'></td> " +
                "<td class='percentInMonth'></td> " +
                "<td class='lastOccurTime'></td> " +
                "<td class='closePrice'></td> " +
                "<td class='transPrice'></td> " +
                "<td class='priceSpreadPercent'></td> " +
                "<td class='priceChangePercent'></td> " +
                "<td class='volume'></td> " +
                "<td class='buySeat'></td> " +
                "<td class='sellSeat'></td> </tr>");


                $(".bulkImfItem1 .barStocksName").eq(i).text(obj[i].StockName);
                $(".bulkImfItem1 .barStocksName").eq(i).attr("itemId", obj[i].StockID);

                $(".bulkImfItem1 .stocksCode").eq(i).text(stocksIdTransform(obj[i].StockID));

                $(".bulkImfItemScroll .relatedTopicName").eq(i).text(obj[i].RelatedTopicName);
                $(".bulkImfItemScroll .relatedTopicName").eq(i).attr("itemId",obj[i].RelatedTopicID);

                $(".bulkImfItemScroll .percentInMonth").eq(i).text(returnFloat(obj[i].PercentInMonth)+"%");

                if( obj[i].OccurTime.substring(0,1) == 0){
                    $(".bulkImfItemScroll .lastOccurTime").eq(i).text("-");
                }else{
                    $(".bulkImfItemScroll .lastOccurTime").eq(i).text(obj[i].OccurTime.substring(0,10));
                }

                $(".bulkImfItemScroll .closePrice").eq(i).text(returnFloat(obj[i].ClosePrice));
                if(obj[i].PriceChangePercent < 0 ){
                    $(".bulkImfItemScroll .closePrice ").eq(i).css("color", "#1DBF60 ");
                }


                $(".bulkImfItemScroll .transPrice").eq(i).text(returnFloat(obj[i].TransPrice));
                if(obj[i].PriceSpreadPercent < 0 ){
                    $(".bulkImfItemScroll .transPrice ").eq(i).css("color", "#1DBF60 ");
                }


                if(obj[i].PriceSpreadPercent > 0 ){
                    $(".bulkImfItemScroll .priceSpreadPercent").eq(i).text("+"+returnFloat(obj[i].PriceSpreadPercent)+"%");
                }else if(obj[i].PriceSpreadPercent == 0 ){
                    $(".bulkImfItemScroll .priceSpreadPercent").eq(i).text(returnFloat(obj[i].PriceSpreadPercent)+"%");
                    $(".bulkImfItemScroll .priceSpreadPercent ").eq(i).css("color", "#333333 ");
                }else if(obj[i].PriceSpreadPercent < 0 ){
                    $(".bulkImfItemScroll .priceSpreadPercent").eq(i).text(returnFloat(obj[i].PriceSpreadPercent)+"%");
                    $(".bulkImfItemScroll .priceSpreadPercent ").eq(i).css("color", "#1DBF60 ");
                }


                if(obj[i].PriceChangePercent > 0 ){
                    $(".bulkImfItemScroll .priceChangePercent").eq(i).text("+"+returnFloat(obj[i].PriceChangePercent)+"%");
                }else if(obj[i].PriceChangePercent == 0 ){
                    $(".bulkImfItemScroll .priceChangePercent").eq(i).text(returnFloat(obj[i].PriceChangePercent)+"%");
                    $(".bulkImfItemScroll .priceChangePercent ").eq(i).css("color", "#333333 ");
                }else if(obj[i].PriceChangePercent < 0 ){
                    $(".bulkImfItemScroll .priceChangePercent").eq(i).text(returnFloat(obj[i].PriceChangePercent)+"%");
                    $(".bulkImfItemScroll .priceChangePercent ").eq(i).css("color", "#1DBF60 ");
                }

                //$(".bulkImfItemScroll .priceChangePercent").eq(i).text(Math.round(obj[i].PriceChangePercent*100)/100);
                //if(obj[i].PriceChangePercent < 0 ){
                //    $(".bulkImfItemScroll .priceChangePercent ").eq(i).css("color", "#1DBF60 ");
                //}
                $(".bulkImfItemScroll .volume").eq(i).text(returnFloat(obj[i].Volume));
                $(".bulkImfItemScroll .buySeat").eq(i).html(obj[i].BuySeat.replace( "公司" , '公司<br>'));
                $(".bulkImfItemScroll .sellSeat").eq(i).html(obj[i].SellSeat.replace( "公司" , '公司<br>'));
            }
            $(".bulkImfItem1").append(" <div class='bulkListName'></div>");
            $(".bulkImfItemScroll").append("<tr class='bulkDetails'> <td></td> </tr>");
        }else{

        }

        $(".bulkImfItem1 .barStocksName").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
            })
        });

        $(".bulkImfItemScroll .relatedTopicName").each(function(){
            $(this).on("click",function(event){
                event.stopPropagation();
                event.preventDefault();
                AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId"));
                //window.location.href ="stock.html?stockId="+$(this).attr("itemId")+"&fromPage=noticeEvents";
                //slide('left','lightblue',1,"stock.html?stockId="+$(this).attr("itemId")+"&fromPage=salesDetails&salesID="+ItemId+"&scroll="+document.body.scrollTop);
            })
        });
        loadend();

    }
    function ajax_failListB(){
        console.log("加载失败");
        loadflag = 0;
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            dataOnLoad();
        });

    }

}



function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.location.href = 'index.html';
    //slide('right', 'lightblue', 1, 'index.html');
}


function loadend(){
    if(loadflag >= 1){
        loadflag = 0;

        $(".loading").css("display", "none");

        //scollto(thisScroll);
    }else{
        loadflag += 1;
    }


    //$(".loading").css("display", "none");
}