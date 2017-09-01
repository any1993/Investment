/**
 * Created by aa on 2016/4/21.
 */
var AccessToken;
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var db;
var w=document.documentElement.clientWidth;
var pn=0;
if(w >= 356){pn=5;}else if(w < 356&& w >= 336){pn=4;}else if(w < 336 && w >= 316){pn=3;}else if(w < 316 && w >= 300){pn=2;}else{pn=0;}
var flagp = 0;
$(function () {
    FastClick.attach(document.body);
    //document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    pageOnload();
    //function onDeviceReady() {
    //    document.addEventListener('pause', onPause.bind(this), false);
    //    document.addEventListener('resume', onResume.bind(this), false);
    //    jpushEffect();
    //    function onPause() {
    //        //此应用程序已被暂停。保存应用程序状态
    //    }
    //    function onResume() {
    //        //此应用程序已被重新激活。恢复应用程序的状态
    //        jpushEffect();
    //        window.location.reload();
    //    }
    //    setTimeout(function () {
    //        pageOnload();
    //    }, 200);
    //}
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
            //window.location.href ='index.html';
            //slide('right', 'lightblue', 1, 'index.html');
            //parent.location= 'index.html';
        }
    });
    //pageLocationChange
    document.getElementById('backpage2').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    //看涨观点榜_市场板块
    ViewPointsOnloadT0();
    //看涨观点榜_主题板块
    ViewPointsOnloadT1();
    //看涨观点榜_个股板块
    ViewPointsOnloadT2();


    $("#m_selectBox>li").each(function(index){

        $(this).on("click",function() {
            $("#m_selectBox>li").removeClass("select");
            $(this).addClass("select");

            if( index == 0 ){
                $(".viewPointStockPage").addClass("viewPointPageDisplay");
                $(".viewPointTopicPage").removeClass("viewPointPageDisplay");
                $(".viewPointCategoryPage").removeClass("viewPointPageDisplay");
            }else if( index == 1 ){
                $(".viewPointStockPage").removeClass("viewPointPageDisplay");
                $(".viewPointTopicPage").addClass("viewPointPageDisplay");
                $(".viewPointCategoryPage").removeClass("viewPointPageDisplay");
            }else if( index == 2 ){
                $(".viewPointStockPage").removeClass("viewPointPageDisplay");
                $(".viewPointTopicPage").removeClass("viewPointPageDisplay");
                $(".viewPointCategoryPage").addClass("viewPointPageDisplay");
            }else{
                $(".viewPointStockPage").addClass("viewPointPageDisplay");
                $(".viewPointTopicPage").removeClass("viewPointPageDisplay");
                $(".viewPointCategoryPage").removeClass("viewPointPageDisplay");
            }

        })

    })


}

//主题板块
function ViewPointsOnloadT0(){
    httpGet("Reader/ViewPoints?sortType=0&type=1&count=10","",true,ajax_successT0,ajax_failT0);
    function ajax_successT0(obj){
        //console.log(obj);
        if (obj != undefined && obj != null && obj != "" ){

                for (var m = 0; m < obj.length; m++) {
                    $(".viewPointTopicPage").append("" +
                    "<div class='viewPointBox'> <div class='viewPointHeadImf'> " +
                    "<div class='viewPointTitleName'></div> " +
                    "<img src='images/icon_rise.png' class='viewPointTypeImg'> " +
                    "<div class='viewPointPeopleNum'></div> " +
                    "<div class='viewPointBasicText1'>看涨比</div> " +
                    "<div class='viewPointPeoplePercent'></div> </div> " +
                    "<div class='viewPointContents'> " +
                    "<div class='viewPointContentsText'> </div> " +
                    //"<div class='viewpointContentBtn' state='off'> <img class='viewPointLongCover' src='images/viewPointCover.png'> <div class='viewPointBasicText2'>展开</div> <img class='viewPointOCBtn' src='images/viewPointOpen.png'> </div> " +
                    "</div> </div>" +
                    "");
                    $(".viewPointTopicPage .viewPointTitleName").eq(m).text(obj[m].StockName);
                    $(".viewPointTopicPage .viewPointPeoplePercent").eq(m).text(returnFloat(obj[m].PointScale * 100) + "%");
                    $(".viewPointTopicPage .viewPointPeopleNum").eq(m).text(obj[m].ViewPoints[0].PersonCount + "人");
                    $(".viewPointTopicPage .viewPointContentsText").eq(m).text(obj[m].ViewPoints[0].Summury);

                    if (obj[m].ViewPoints[0].Summury.length >= 75) {

                    } else if (obj[m].ViewPoints[0].Summury.length < 75) {
                        $(".viewPointTopicPage .viewpointContentBtn").eq(m).css("display", "none");
                        //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("opacity","0");
                        //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("height","10px");
                        //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("z-index","-5");
                    }

                    if (obj[m].ViewPoints[0].PointType == "看涨") {
                        $(".viewPointTopicPage .viewPointTypeImg").eq(m).attr("src", "images/icon_rise.png");
                        $(".viewPointTopicPage .viewPointPeoplePercent").eq(m).css("color", "#F95153");
                        //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgRs");
                    } else if (obj[m].ViewPoints[vp].PointType == "看平") {
                        $(".viewPointTopicPage .viewPointTypeImg").eq(m).attr("src", "images/icon_unchange.png");
                        $(".viewPointTopicPage .viewPointPeoplePercent").eq(m).css("color", "#309DFB");
                        //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgUc");
                    } else if (obj[m].ViewPoints[vp].PointType == "看跌") {
                        $(".viewPointTopicPage .viewPointTypeImg").eq(m).attr("src", "images/icon_fall.png");
                        $(".viewPointTopicPage .viewPointPeoplePercent").eq(m).css("color", "#00C066");
                        //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgFl");
                    } else {
                        $(".viewPointTopicPage .viewPointTypeImg").eq(m).attr("src", "images/icon_rise.png");
                        $(".viewPointTopicPage .viewPointPeoplePercent").eq(m).css("color", "#F95153");
                        //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgRs");
                    }

                }


            //$(".viewpoint").css("display","none");
            loadend();
        }
    }
    function ajax_failT0(){
        console.log("市场板块观点加载失败");
        $(".loading").html("<img src='images/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='images/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            ViewPointsOnloadT0();
            ViewPointsOnloadT1();
            ViewPointsOnloadT2();
        });
    }

}


//品类板块
function ViewPointsOnloadT1(){
    httpGet("Reader/ViewPoints?sortType=0&type=0&count=10","",true,ajax_successT1,ajax_failT1);
    function ajax_successT1(obj){
        if (obj != null && obj != "" && obj != undefined){
            for (var m = 0; m < obj.length; m++) {
                $(".viewPointCategoryPage").append("" +
                "<div class='viewPointBox'> <div class='viewPointHeadImf'> " +
                "<div class='viewPointTitleName'></div> " +
                "<img src='images/icon_rise.png' class='viewPointTypeImg'> " +
                "<div class='viewPointPeopleNum'></div> " +
                "<div class='viewPointBasicText1'>看涨比</div> " +
                "<div class='viewPointPeoplePercent'></div> </div> " +
                "<div class='viewPointContents'> " +
                "<div class='viewPointContentsText'> </div> " +
                //"<div class='viewpointContentBtn' state='off'> <img class='viewPointLongCover' src='images/viewPointCover.png'> <div class='viewPointBasicText2'>展开</div> <img class='viewPointOCBtn' src='images/viewPointOpen.png'> </div> " +
                "</div> </div>" +
                "");
                $(".viewPointCategoryPage .viewPointTitleName").eq(m).text(obj[m].StockName);
                $(".viewPointCategoryPage .viewPointPeoplePercent").eq(m).text(returnFloat(obj[m].PointScale * 100) + "%");
                $(".viewPointCategoryPage .viewPointPeopleNum").eq(m).text(obj[m].ViewPoints[0].PersonCount + "人");
                $(".viewPointCategoryPage .viewPointContentsText").eq(m).text(obj[m].ViewPoints[0].Summury);

                if (obj[m].ViewPoints[0].Summury.length >= 75) {

                } else if (obj[m].ViewPoints[0].Summury.length < 75) {
                    $(".viewPointCategoryPage .viewpointContentBtn").eq(m).css("display", "none");
                    //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("opacity","0");
                    //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("height","10px");
                    //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("z-index","-5");
                }

                if (obj[m].ViewPoints[0].PointType == "看涨") {
                    $(".viewPointCategoryPage .viewPointTypeImg").eq(m).attr("src", "images/icon_rise.png");
                    $(".viewPointCategoryPage .viewPointPeoplePercent").eq(m).css("color", "#F95153");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgRs");
                } else if (obj[m].ViewPoints[vp].PointType == "看平") {
                    $(".viewPointCategoryPage .viewPointTypeImg").eq(m).attr("src", "images/icon_unchange.png");
                    $(".viewPointCategoryPage .viewPointPeoplePercent").eq(m).css("color", "#309DFB");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgUc");
                } else if (obj[m].ViewPoints[vp].PointType == "看跌") {
                    $(".viewPointCategoryPage .viewPointTypeImg").eq(m).attr("src", "images/icon_fall.png");
                    $(".viewPointCategoryPage .viewPointPeoplePercent").eq(m).css("color", "#00C066");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgFl");
                } else {
                    $(".viewPointCategoryPage .viewPointTypeImg").eq(m).attr("src", "images/icon_rise.png");
                    $(".viewPointCategoryPage .viewPointPeoplePercent").eq(m).css("color", "#F95153");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgRs");
                }

            }
            loadend();
        }
    }
    function ajax_failT1(){
        console.log("主题板块观点加载失败");
        $(".loading").html("<img src='images/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='images/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            ViewPointsOnloadT0();
            ViewPointsOnloadT1();
            ViewPointsOnloadT2();
        });
    }
}


//个股板块
function ViewPointsOnloadT2(){
    httpGet("Reader/ViewPoints?sortType=0&type=2&count=10","",true,ajax_successT2,ajax_failT2);
    function ajax_successT2(obj){
        if (obj != null && obj != "" && obj != undefined){
            for (var m = 0; m < obj.length; m++) {
                $(".viewPointStockPage").append("" +
                "<div class='viewPointBox'> <div class='viewPointHeadImf'> " +
                "<div class='viewPointTitleName'></div> " +
                "<img src='images/icon_rise.png' class='viewPointTypeImg'> " +
                "<div class='viewPointPeopleNum'></div> " +
                "<div class='viewPointBasicText1'>看涨比</div> " +
                "<div class='viewPointPeoplePercent'></div> </div> " +
                "<div class='viewPointContents'> " +
                "<div class='viewPointContentsText'> </div> " +
                //"<div class='viewpointContentBtn' state='off'> <img class='viewPointLongCover' src='images/viewPointCover.png'> <div class='viewPointBasicText2'>展开</div> <img class='viewPointOCBtn' src='images/viewPointOpen.png'> </div> " +
                "</div> </div>" +
                "");
                $(".viewPointStockPage .viewPointTitleName").eq(m).text(obj[m].StockName);
                $(".viewPointStockPage .viewPointPeoplePercent").eq(m).text(returnFloat(obj[m].PointScale*100)+"%");
                $(".viewPointStockPage .viewPointPeopleNum").eq(m).text(obj[m].ViewPoints[0].PersonCount+"人");
                $(".viewPointStockPage .viewPointContentsText").eq(m).text(obj[m].ViewPoints[0].Summury);

                if( obj[m].ViewPoints[0].Summury.length >= 75 ){

                }else if( obj[m].ViewPoints[0].Summury.length < 75 ){
                    $(".viewPointStockPage .viewpointContentBtn").eq(m).css("display","none");
                    //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("opacity","0");
                    //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("height","10px");
                    //$(".viewPointStockPage .viewpointContentBtn").eq(m).css("z-index","-5");
                }

                if(obj[m].ViewPoints[0].PointType ==  "看涨" ){
                    $(".viewPointStockPage .viewPointTypeImg").eq(m).attr("src","images/icon_rise.png");
                    $(".viewPointStockPage .viewPointPeoplePercent").eq(m).css("color","#F95153");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgRs");
                }else if(obj[m].ViewPoints[vp].PointType ==  "看平" ){
                    $(".viewPointStockPage .viewPointTypeImg").eq(m).attr("src","images/icon_unchange.png");
                    $(".viewPointStockPage .viewPointPeoplePercent").eq(m).css("color","#309DFB");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgUc");
                }else if(obj[m].ViewPoints[vp].PointType ==  "看跌" ){
                    $(".viewPointStockPage .viewPointTypeImg").eq(m).attr("src","images/icon_fall.png");
                    $(".viewPointStockPage .viewPointPeoplePercent").eq(m).css("color","#00C066");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(0).addClass("imgFl");
                }else{
                    $(".viewPointStockPage .viewPointTypeImg").eq(m).attr("src","images/icon_rise.png");
                    $(".viewPointStockPage .viewPointPeoplePercent").eq(m).css("color","#F95153");
                    //$(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgRs");
                }
                //for(var vp = 0; vp < obj[m].ViewPoints.length; vp++){
                //    $(".p_page .sharesBox").eq(m).append(" <div class='viewpoint'> <img class='viewtag'> <span class='text8 view_num'></span> <span class='text8'>人</span> <span class='text7 summuryOfView'></span> <div class='expertBox boxOfImg'></div> <div class='clear'></div></div>");
                //    if(obj[m].ViewPoints[vp].PointType ==  "看涨" ){
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).attr("src","images/icon_rise.png");
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgRs");
                //    }else if(obj[m].ViewPoints[vp].PointType ==  "看平" ){
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).attr("src","images/icon_unchange.png");
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgUc");
                //    }else if(obj[m].ViewPoints[vp].PointType ==  "看跌" ){
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).attr("src","images/icon_fall.png");
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgFl");
                //    }else{
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).attr("src","images/icon_rise.png");
                //        $(".p_page .sharesBox:eq("+m+") .viewtag").eq(vp).addClass("imgRs");
                //    }
                //    $(".p_page .sharesBox:eq("+m+") .view_num").eq(vp).text(obj[m].ViewPoints[vp].PersonCount);
                //    $(".p_page .sharesBox:eq("+m+") .summuryOfView").eq(vp).text(obj[m].ViewPoints[vp].Summury);
                //    var photoamount =obj[m].ViewPoints[vp].Persons.length;
                //    if(photoamount>pn){photoamount=pn;}
                //    for(var ep = 0; ep < photoamount; ep++){
                //        $(".p_page .sharesBox:eq("+m+") .boxOfImg").eq(vp).append("<img src='"+obj[m].ViewPoints[vp].Persons[ep].ImageUrl+"' class='exp_head '>");
                //    }
                //}
            }
            
            loadend();
        }
    }
    function ajax_failT2(){
        console.log("个股板块观点加载失败");
        $(".loading").html("<img src='images/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='images/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            ViewPointsOnloadT0();
            ViewPointsOnloadT1();
            ViewPointsOnloadT2();
        });
    }


}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();

    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //window.location.href = 'chanceSecondary01_viewPoint.html';
    //parent.location='index.html';
}

function loadend(){
    if(flagp >= 2){
        flagp = 0;


        $(".viewPointStockPage .viewPointBox .viewpointContentBtn").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();

                if(  $(this).attr("state") == "off" ){
                    $(this).attr("state","on");
                    $(".viewPointStockPage .viewPointBox .viewPointContentsText").eq(index).css("max-height","none");
                    $(".viewPointStockPage .viewPointBox .viewPointLongCover").eq(index).css("opacity","0");
                    $(".viewPointStockPage .viewPointBox .viewPointBasicText2").eq(index).text("收起");
                    $(".viewPointStockPage .viewPointBox .viewPointOCBtn").eq(index).attr("src","images/viewPointClose.png" );

                }else if( $(this).attr("state") == "on" ){
                    $(this).attr("state","off");
                    $(".viewPointStockPage .viewPointBox .viewPointContentsText").eq(index).css("max-height","45px");
                    $(".viewPointStockPage .viewPointLongCover").eq(index).css("opacity","1");
                    $(".viewPointStockPage .viewPointBasicText2").eq(index).text("展开");
                    $(".viewPointStockPage .viewPointOCBtn").eq(index).attr("src","images/viewPointOpen.png" );
                }
            })
        });



        $(".viewPointTopicPage .viewPointBox .viewpointContentBtn").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();

                if(  $(this).attr("state") == "off" ){
                    $(this).attr("state","on");
                    $(".viewPointTopicPage .viewPointBox .viewPointContentsText").eq(index).css("max-height","none");
                    $(".viewPointTopicPage .viewPointBox .viewPointLongCover").eq(index).css("opacity","0");
                    $(".viewPointTopicPage .viewPointBox .viewPointBasicText2").eq(index).text("收起");
                    $(".viewPointTopicPage .viewPointBox .viewPointOCBtn").eq(index).attr("src","images/viewPointClose.png" );

                }else if( $(this).attr("state") == "on" ){
                    $(this).attr("state","off");
                    $(".viewPointTopicPage .viewPointBox .viewPointContentsText").eq(index).css("max-height","45px");
                    $(".viewPointTopicPage .viewPointLongCover").eq(index).css("opacity","1");
                    $(".viewPointTopicPage .viewPointBasicText2").eq(index).text("展开");
                    $(".viewPointTopicPage .viewPointOCBtn").eq(index).attr("src","images/viewPointOpen.png" );
                }


            })
        });



        $(".viewPointCategoryPage .viewPointBox .viewpointContentBtn").each(function(index){
            $(this).on("click",function(e){
                e.stopPropagation();
                e.preventDefault();

                if(  $(this).attr("state") == "off" ){
                    $(this).attr("state","on");
                    $(".viewPointCategoryPage .viewPointBox .viewPointContentsText").eq(index).css("max-height","none");
                    $(".viewPointCategoryPage .viewPointBox .viewPointLongCover").eq(index).css("opacity","0");
                    $(".viewPointCategoryPage .viewPointBox .viewPointBasicText2").eq(index).text("收起");
                    $(".viewPointCategoryPage .viewPointBox .viewPointOCBtn").eq(index).attr("src","images/viewPointClose.png" );

                }else if( $(this).attr("state") == "on" ){
                    $(this).attr("state","off");
                    $(".viewPointCategoryPage .viewPointBox .viewPointContentsText").eq(index).css("max-height","45px");
                    $(".viewPointCategoryPage .viewPointLongCover").eq(index).css("opacity","1");
                    $(".viewPointCategoryPage .viewPointBasicText2").eq(index).text("展开");
                    $(".viewPointCategoryPage .viewPointOCBtn").eq(index).attr("src","images/viewPointOpen.png" );
                }


            })
        });



        var swiper;
        swiper = new Swiper('.swiper2', {
            pagination : '.pagination2',
            paginationClickable :true,
            noSwiping:true,
            loop:false,
            grabCursor: true,
            autoHeight:true
        });
        $('.pagination2 .swiper-pagination-switch').click(function(){
            swiper.swipeTo($(this).index())
        });
        $(".loading").css("display","none");
    }else{
        flagp += 1;
    }
}