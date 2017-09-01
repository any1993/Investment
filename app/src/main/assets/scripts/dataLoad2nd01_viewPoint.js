/**
 * Created by Kris on 2016/12/19.
 */

var endTime = (Date.parse(new Date())/1000);
var VpointFlag = 0;
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

    //加载大V看多观点（3）
    RiseViewPoint();
    //加载大V看空观点（3）
    FallViewPoint();
    //加载普通看多观点（3）
    RiseViewPointNV();
    //加载普通看空观点（3）
    FallViewPointNV();

    ////加载看涨个股（5）
    //RiseStocks();
    ////加载看涨主题（5）
    //RiseTopics();
    ////加载看空个股（5）
    //FallStocks();
    ////加载看空主题（5）
    //FallTopics();

}

function RiseViewPoint(){
    httpGet("Reader/PersonPoints?personId=&count=3&dateTime="+endTime+"&getDetail=false&isExpert=True&sentiment=1", "", true, ajax_successVPUp, ajax_failVPUp);
    function ajax_successVPUp(obj) {
        //console.log(obj);

        if( obj != null && obj != undefined && obj != ""){
            for( var i = 0 ; i < 3; i++){
                if( i >= obj.length ){
                    break;
                }
                $(".viewHeadContentText .viewHeadSummaryRise").append("" +
                " <div class='viewSummaryBox Rise'> " +
                "<img class='viewAuthorHeadPortrait' src='../img/headimg.jpg'> " +
                "<div class='viewAuthorName'></div> " +
                "<div class='viewSummaryTime'></div> " +
                "<div class='viewSummaryText'></div> </div>" +
                "");

                $(".viewHeadSummaryRise .Rise").eq(i).attr("itemId",obj[i].PointId);
                $(".viewHeadSummaryRise .viewAuthorHeadPortrait").eq(i).attr("src",obj[i].ImageUrl);
                $(".viewHeadSummaryRise .viewSummaryText").eq(i).text(obj[i].Title);
                $(".viewHeadSummaryRise .viewAuthorName").eq(i).text(obj[i].PersonName);
                $(".viewHeadSummaryRise .viewSummaryTime").eq(i).text(getDateDiff(dateTrans(obj[i].PubDate)));
            }


            $(".viewHeadSummaryRise .Rise").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "opportunityPage4_viewPoint.html?ReportsId="+$(this).attr('itemId'));
                })
            });

            loadend();
        }
    }

    function ajax_failVPUp(obj) {
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2'>");
            RiseViewPoint();
            FallViewPoint();
        });
    }
}

function FallViewPoint(){
    httpGet("Reader/PersonPoints?personId=&count=3&dateTime="+endTime+"&getDetail=false&isExpert=True&sentiment=3", "", true, ajax_successVPDown, ajax_failVPDown);
    function ajax_successVPDown(obj) {
        //console.log(obj);

        if( obj != null && obj != undefined && obj != ""){
            for( var k = 0 ; k < 3; k++){
                if( k >= obj.length ){
                    break;
                }
                $(".viewHeadContentText .viewHeadSummaryDown").append("" +
                " <div class='viewSummaryBox Down'> " +
                "<div class='viewSummaryTime'></div> " +
                "<div class='viewAuthorName'></div> " +
                "<img class='viewAuthorHeadPortrait' src='../img/headimg.jpg'> " +
                "<div class='viewSummaryText'></div> </div>" +
                "");

                $(".viewHeadSummaryDown .Down").eq(k).attr("itemId",obj[k].PointId);
                $(".viewHeadSummaryDown .viewAuthorHeadPortrait").eq(k).attr("src",obj[k].ImageUrl);
                $(".viewHeadSummaryDown .viewSummaryText").eq(k).text(obj[k].Title);
                $(".viewHeadSummaryDown .viewAuthorName").eq(k).text(obj[k].PersonName);
                $(".viewHeadSummaryDown .viewSummaryTime").eq(k).text(getDateDiff(dateTrans(obj[k].PubDate)));
            }
            $(".viewHeadSummaryDown .Down").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "opportunityPage4_viewPoint.html?ReportsId="+$(this).attr('itemId'));
                })
            });

            loadend();

        }
    }
    function ajax_failVPDown(obj) {
        $(".Load1").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load1 .loadingImg2").on("click",function(){
            $(".Load1 .loadingImg2").remove();
            $(".Load1 .notcontent").remove();
            $(".Load1").html("<img src='img/loading.gif' class='loadingImg2'>");
            RiseViewPoint();
            FallViewPoint();
        });
    }
}



function RiseViewPointNV(){
    httpGet("Reader/PersonPoints?personId=&count=3&dateTime="+endTime+"&getDetail=false&isExpert=false&sentiment=1", "", true, ajax_successPUp, ajax_failPUp);
    function ajax_successPUp(obj) {
        //console.log(obj);

        if( obj != null && obj != undefined && obj != ""){
            for( var j = 0 ; j < 3; j++){
                if( j >= obj.length ){
                    break;
                }
                $(".viewSecondaryBox.onRise").append("" +
                " <div class='viewSummaryBox2'> " +
                "<div class='viewSummaryText2'></div> " +
                //"<img class='viewAuthorHeadPortrait' src='img/headimg.jpg'> " +
                "<div class='viewAuthorName'>——</div> " +
                "<div class='viewSummaryTime'></div> </div>" +
                "");

                $(".onRise .viewSummaryBox2").eq(j).attr("itemId",obj[j].PointId);
                //if( obj[j].ImageUrl != null && obj[j].ImageUrl != undefined  ){
                //    $(".viewSecondaryBox.onRise .viewAuthorHeadPortrait").eq(j).attr("src",obj[j].ImageUrl);
                //}


                $(".viewSecondaryBox.onRise .viewSummaryText2").eq(j).text(obj[j].Title);

                if( obj[j].PersonName != null && obj[j].PersonName != undefined  ){
                    $(".viewSecondaryBox.onRise .viewAuthorName").eq(j).text(obj[j].PersonName);
                }
                $(".viewSecondaryBox.onRise .viewSummaryTime").eq(j).text(getDateDiff(dateTrans(obj[j].PubDate)));
            }


            $(".onRise .viewSummaryBox2").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "opportunityPage4_viewPoint.html?ReportsId="+$(this).attr('itemId'));
                })
            });

            $(".Load2").css("display","none");

        }
    }

    function ajax_failPUp(obj) {
        $(".Load2").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load2 .loadingImg2").on("click",function(){
            $(".Load2 .loadingImg2").remove();
            $(".Load2 .notcontent").remove();
            $(".Load2").html("<img src='img/loading.gif' class='loadingImg2'>");
            RiseViewPointNV();
        });

    }

}


function FallViewPointNV(){
    httpGet("Reader/PersonPoints?personId=&count=3&dateTime="+endTime+"&getDetail=false&isExpert=false&sentiment=3", "", true, ajax_successVPUp, ajax_failVPUp);
    function ajax_successVPUp(obj) {
        //console.log(obj);

        if( obj != null && obj != undefined && obj != ""){

            for( var l = 0 ; l < 3; l++){
                if( l >= obj.length ){
                    break;
                }
                $(".viewSecondaryBox.onDown").append("" +
                " <div class='viewSummaryBox2'> " +
                "<div class='viewSummaryText2'></div> " +
                //"<img class='viewAuthorHeadPortrait' src='img/headimg.jpg'> " +
                "<div class='viewAuthorName'>——</div> " +
                "<div class='viewSummaryTime'></div> </div>" +

                "");

                $(".onDown .viewSummaryBox2").eq(l).attr("itemId",obj[l].PointId);

                //if( obj[l].ImageUrl != null && obj[l].ImageUrl != undefined  ){
                //    $(".viewSecondaryBox.onDown .viewAuthorHeadPortrait").eq(l).attr("src",obj[l].ImageUrl);
                //}

                $(".viewSecondaryBox.onDown .viewSummaryText2").eq(l).text(obj[l].Title);

                if( obj[l].PersonName != null && obj[l].PersonName != undefined  ){
                    $(".viewSecondaryBox.onDown .viewAuthorName").eq(l).text(obj[l].PersonName);
                }

                $(".viewSecondaryBox.onDown .viewSummaryTime").eq(l).text(getDateDiff(dateTrans(obj[l].PubDate)));
            }

            $(".onDown .viewSummaryBox2").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "opportunityPage4_viewPoint.html?ReportsId="+$(this).attr('itemId'));
                })
            });

            $(".Load3").css("display","none");

        }
    }

    function ajax_failVPUp(obj) {
        $(".Load3").html("<img src='img/logo.png' class='loadingImg2'><span class='notcontent'>加载失败，点击重新加载</span>");
        $(".Load3 .loadingImg2").on("click",function(){
            $(".Load3 .loadingImg2").remove();
            $(".Load3 .notcontent").remove();
            $(".Load3").html("<img src='img/loading.gif' class='loadingImg2'>");
            FallViewPointNV();
        });
    }
}



function RiseStocks(){
    //httpGet("Reader/ViewPoints?sortType=0&type=2&count=5", "", true, ajax_successVP, ajax_failVP);
    function ajax_successVP(obj) {
        //console.log(obj);

        //if( obj != null && obj != undefined && obj != ""){
        //    for( var i = 0 ; i < 3; i++){
        //        if( i >= obj.length ){
        //            break;
        //        }
        //        $(".viewHeadSummaryRise .viewAuthorHeadPortrait").eq(i).attr("src",obj[i].ImageUrl);
        //        $(".viewHeadSummaryRise .viewSummaryText").eq(i).text(obj[i].Title);
        //        $(".viewHeadSummaryRise .viewAuthorName").eq(i).text(obj[i].PersonName);
        //        $(".viewHeadSummaryRise .viewSummaryTime").eq(i).text(getDateDiff(dateTrans(obj[i].PubDate)));
        //    }
        //
        //    for( var j = 3 ; j < 6; j++){
        //        if( j >= obj.length ){
        //            break;
        //        }
        //        $(".viewSecondaryBox.onRise .viewAuthorHeadPortrait").eq(j-3).attr("src",obj[j].ImageUrl);
        //        $(".viewSecondaryBox.onRise .viewSummaryText2").eq(j-3).text(obj[j].Title);
        //        $(".viewSecondaryBox.onRise .viewAuthorName").eq(j-3).text(obj[j].PersonName);
        //        $(".viewSecondaryBox.onRise .viewSummaryTime").eq(j-3).text(getDateDiff(dateTrans(obj[j].PubDate)));
        //    }
        //}
    }

    function ajax_failVP(obj) {

    }
}

function RiseTopics(){

}

function FallStocks(){

}

function FallTopics(){

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
    AddGoback(localStorage.N_url, 'forecastingPage3_ViewPoints.html');
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href ='forecastingPage3_ViewPoints.html';
    //parent.location='index.html';
}


function loadend(){
    if( VpointFlag >= 1 ){
        VpointFlag = 0;

        $(".Load1").css("display","none");
        $(".viewHeadContentText").css("display","block");

    }else{
        VpointFlag += 1;
    }
}