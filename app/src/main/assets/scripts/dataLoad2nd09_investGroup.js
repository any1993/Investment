/**
 * Created by Kris on 2016/12/19.
 */


var lFlag = 0;
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

    $(".GroupSwitchBox>.GroupSwitchBtn").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".GroupSwitchBox>.GroupSwitchBtn").removeClass("selected");
            $(".GroupBoxContent>.GroupPagesMainBox").removeClass("display");
            $(this).addClass("selected");
            $(".GroupBoxContent>.GroupPagesMainBox").eq(index).addClass("display");

            //if( index == 0){
            //
            //}else if( index == 1){
            //
            //}
        })
    });


//    加载投资组合天排行
    InvestGroupsDailyOnload();

//    加载投资组合月总排行
    InvestGroupsMonthlyOnload();



}



function InvestGroupsDailyOnload(){
    httpGet("Reader/InvestGroups?count=10&skip=0&sortType=2","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        if ( obj != undefined &&  obj != null && obj != "" && obj != []) {
            for (var i = 0; i < obj.length; i++) {
                $(".GroupPagesMainBox.DailyList").append("" +
                "<div class='groupImfBox'> " +
                "<div class='groupProfit'>当日收益</div> " +
                "<div class='groupProfitData'>——</div> " +
                "<img class='groupAuthorHeadPic' onerror='this.src=" + '"img/headimg.jpg"' + "'>" +
                "<div class='groupAuthorNameP2'></div> " +
                "<div class='groupNameTitleP2'></div> " +
                "<div class='groupFSstockP2'></div> " +
                "<div class='groupFSstockPercentP2'>0.00%仓位</div> </div>"+
                "");

                $(".GroupPagesMainBox.DailyList .groupImfBox").eq(i).attr("itemId", obj[i].GroupId);
                $(".GroupPagesMainBox.DailyList .groupAuthorHeadPic").eq(i).attr("src",obj[i].ImageUrl);
                $(".GroupPagesMainBox.DailyList .groupAuthorNameP2").eq(i).text(obj[i].AuthorName);
                $(".GroupPagesMainBox.DailyList .groupNameTitleP2").eq(i).text(obj[i].GroupName);
                if( obj[i].DayRate >= 0 ){
                    $(".GroupPagesMainBox.DailyList .groupProfitData").eq(i).text(returnFloat(obj[i].DayRate)+"%");
                    $(".GroupPagesMainBox.DailyList .groupProfitData").eq(i).css("color","#FD3642");
                }else if( obj[i].DayRate < 0 ){
                    $(".GroupPagesMainBox.DailyList .groupProfitData").eq(i).text(returnFloat(obj[i].DayRate)+"%");
                    $(".GroupPagesMainBox.DailyList .groupProfitData").eq(i).css("color","#1DBF90");
                }




                //$(".GroupPagesMainBox.DailyList .groupFSstockP2").eq(i).text(obj[i].Stocks[0].StockInfo.Name);
                //$(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent)+"%仓位");

                if(obj[i].Stocks != undefined &&  obj[i].Stocks != null && obj[i].Stocks != ""){   //存在stock内容
                    //显示股票数据
                    $(".GroupPagesMainBox.DailyList .groupFSstockP2").eq(i).text(obj[i].Stocks[0].StockInfo.Name);

                    if( obj[i].Stocks[0].Current != undefined && obj[i].Stocks[0].Current != null  && obj[i].Stocks[0].Current != "" ){    //存在current字段
                        //买卖图标显示，仓位数据待定
                        $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).css("display","block");

                        if( obj[i].Stocks[0].Current.Percent != undefined && obj[i].Stocks[0].Current.Percent != null  && obj[i].Stocks[0].Current.Percent != "" ) {
                            //显示仓位数据，买卖图标待定

                            if (obj[i].Stocks[0].Current.PrevPercent != undefined && obj[i].Stocks[0].Current.PrevPercent != null && obj[i].Stocks[0].Current.PrevPercent != "") { //存在PrevPercent字段
                                if (  obj[i].Stocks[0].Current.Percent >= obj[i].Stocks[0].Current.PrevPercent) {
                                    //    买，显示仓位变化，显示股票
                                    $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text("+"+returnFloat( obj[i].Stocks[0].Current.Percent - obj[i].Stocks[0].Current.PrevPercent )+"%仓位");
                                }else{
                                    //    卖，显示仓位变化，显示股票
                                    $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text("-"+returnFloat( obj[i].Stocks[0].Current.PrevPercent - obj[i].Stocks[0].Current.Percent )+"%仓位");

                                }
                            } else if (obj[i].Stocks[0].History != undefined && obj[i].Stocks[0].History != null && obj[i].Stocks[0].History != "") {  //不存在PrevPercent字段但存在History字段
                                if (obj[i].Stocks[0].History[0] != undefined && obj[i].Stocks[0].History[0] != null && obj[i].Stocks[0].History[0] != "") {  //存在History字段，里面有Percent
                                    if (obj[i].Stocks[0].History[0].Percent != undefined && obj[i].Stocks[0].History[0].Percent != null && obj[i].Stocks[0].History[0].Percent != "") {  //存在History字段，里面有Percent
                                        if (obj[i].Stocks[0].Current.Percent >= obj[i].Stocks[0].History[0].Percent) {
                                            //    买，显示仓位，显示股票

                                            $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text("+" + returnFloat(obj[i].Stocks[0].Current.Percent - obj[i].Stocks[0].History[0].Percent) + "%仓位");

                                        } else {
                                            //    卖，显示仓位，显示股票
                                            $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text("-" + returnFloat(obj[i].Stocks[0].History[0].Percent - obj[i].Stocks[0].Current.Percent) + "%仓位");
                                        }

                                    } else {//存在History字段，但里面没有Percent
                                        //    买，显示仓位，显示股票
                                        $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent) + "%仓位");
                                    }
                                }else {//存在History字段，但里面没有Percent
                                    //    买，显示仓位，显示股票
                                    $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent) + "%仓位");
                                }

                            } else {  //不存在PrevPercent字段也没有History字段
                                //    买，显示仓位，显示股票
                                //console.log("here");
                                $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent)+"%仓位");

                            }
                        }else{
                            //$(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).css("display","none");

                        }

                    }else{ //无current字段
                        //仓位为空，买卖为空
                        $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).css("display","none");
                    }
                }else{ //无stock字段
                    //隐藏股票数据
                    $(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).css("display","none");
                }

            }


            $(".GroupPagesMainBox.DailyList .groupImfBox").each(function(index){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId'));
                    //window.location.href ="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from=secondaryPage";
                    //slide('left','lightblue',1,"forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index);
                    //parent.location="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index;
                })
            });


            loadend();
        }else{
            //loadend();
        }


    }

    function ajax_failFS(obj){

        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            InvestGroupsDailyOnload();
            InvestGroupsMonthlyOnload();
        });

    }

}



function InvestGroupsMonthlyOnload(){
    httpGet("Reader/InvestGroups?count=10&skip=0&sortType=0","",true,ajax_successFS,ajax_failFS);
    function ajax_successFS(obj){
        //console.log(obj);
        if ( obj != undefined &&  obj != null && obj != "" && obj != []) {
            for (var i = 0; i < obj.length; i++) {
                $(".GroupPagesMainBox.MonthlyList").append("" +
                "<div class='groupImfBox'> " +
                "<div class='groupProfit'>当月收益</div> " +
                "<div class='groupProfitData'>——</div> " +
                "<img class='groupAuthorHeadPic' onerror='this.src=" + '"img/headimg.jpg"' + "'>" +
                "<div class='groupAuthorNameP2'></div> " +
                "<div class='groupNameTitleP2'></div> " +
                "<div class='groupFSstockP2'></div> " +
                "<div class='groupFSstockPercentP2'>0.00%仓位</div> </div>"+
                "");

                $(".GroupPagesMainBox.MonthlyList .groupImfBox").eq(i).attr("itemId", obj[i].GroupId);
                $(".GroupPagesMainBox.MonthlyList .groupAuthorHeadPic").eq(i).attr("src",obj[i].ImageUrl);
                $(".GroupPagesMainBox.MonthlyList .groupAuthorNameP2").eq(i).text(obj[i].AuthorName);
                $(".GroupPagesMainBox.MonthlyList .groupNameTitleP2").eq(i).text(obj[i].GroupName);
                if( obj[i].MonthRate >= 0 ){
                    $(".GroupPagesMainBox.MonthlyList .groupProfitData").eq(i).text(returnFloat(obj[i].MonthRate)+"%");
                    $(".GroupPagesMainBox.MonthlyList .groupProfitData").eq(i).css("color","#FD3642");
                }else if( obj[i].MonthRate < 0 ){
                    $(".GroupPagesMainBox.MonthlyList .groupProfitData").eq(i).text(returnFloat(obj[i].MonthRate)+"%");
                    $(".GroupPagesMainBox.MonthlyList .groupProfitData").eq(i).css("color","#1DBF90");
                }

                //$(".GroupPagesMainBox.MonthlyList .groupFSstockP2").eq(i).text(obj[i].Stocks[0].StockInfo.Name);
                //$(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent)+"%仓位");


                if(obj[i].Stocks != undefined &&  obj[i].Stocks != null && obj[i].Stocks != ""){   //存在stock内容
                    //显示股票数据
                    $(".GroupPagesMainBox.MonthlyList .groupFSstockP2").eq(i).text(obj[i].Stocks[0].StockInfo.Name);

                    if( obj[i].Stocks[0].Current != undefined && obj[i].Stocks[0].Current != null  && obj[i].Stocks[0].Current != "" ){    //存在current字段
                        //买卖图标显示，仓位数据待定
                        $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).css("display","block");

                        if( obj[i].Stocks[0].Current.Percent != undefined && obj[i].Stocks[0].Current.Percent != null  && obj[i].Stocks[0].Current.Percent != "" ) {
                            //显示仓位数据，买卖图标待定

                            if (obj[i].Stocks[0].Current.PrevPercent != undefined && obj[i].Stocks[0].Current.PrevPercent != null && obj[i].Stocks[0].Current.PrevPercent != "") { //存在PrevPercent字段
                                if (  obj[i].Stocks[0].Current.Percent >= obj[i].Stocks[0].Current.PrevPercent) {
                                    //    买，显示仓位变化，显示股票
                                    $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text("+"+returnFloat( obj[i].Stocks[0].Current.Percent - obj[i].Stocks[0].Current.PrevPercent )+"%仓位");
                                }else{
                                    //    卖，显示仓位变化，显示股票
                                    $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text("-"+returnFloat( obj[i].Stocks[0].Current.PrevPercent - obj[i].Stocks[0].Current.Percent )+"%仓位");

                                }
                            } else if (obj[i].Stocks[0].History != undefined && obj[i].Stocks[0].History != null && obj[i].Stocks[0].History != "") {  //不存在PrevPercent字段但存在History字段
                                if (obj[i].Stocks[0].History[0] != undefined && obj[i].Stocks[0].History[0] != null && obj[i].Stocks[0].History[0] != "") {  //存在History字段，里面有Percent
                                    if (obj[i].Stocks[0].History[0].Percent != undefined && obj[i].Stocks[0].History[0].Percent != null && obj[i].Stocks[0].History[0].Percent != "") {  //存在History字段，里面有Percent
                                        if (obj[i].Stocks[0].Current.Percent >= obj[i].Stocks[0].History[0].Percent) {
                                            //    买，显示仓位，显示股票

                                            $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text("+" + returnFloat(obj[i].Stocks[0].Current.Percent - obj[i].Stocks[0].History[0].Percent) + "%仓位");

                                        } else {
                                            //    卖，显示仓位，显示股票
                                            $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text("-" + returnFloat(obj[i].Stocks[0].History[0].Percent - obj[i].Stocks[0].Current.Percent) + "%仓位");
                                        }

                                    } else {//存在History字段，但里面没有Percent
                                        //    买，显示仓位，显示股票
                                        $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent) + "%仓位");
                                    }
                                }else {//存在History字段，但里面没有Percent
                                    //    买，显示仓位，显示股票
                                    $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent) + "%仓位");
                                }

                            } else {  //不存在PrevPercent字段也没有History字段
                                //    买，显示仓位，显示股票
                                //console.log("here");
                                $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).text(returnFloat(obj[i].Stocks[0].Current.Percent)+"%仓位");

                            }
                        }else{
                            //$(".GroupPagesMainBox.DailyList .groupFSstockPercentP2").eq(i).css("display","none");

                        }

                    }else{ //无current字段
                        //仓位为空，买卖为空
                        $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).css("display","none");
                    }
                }else{ //无stock字段
                    //隐藏股票数据
                    $(".GroupPagesMainBox.MonthlyList .groupFSstockPercentP2").eq(i).css("display","none");
                }

            }


            $(".GroupPagesMainBox.MonthlyList .groupImfBox").each(function(index){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId'));
                    //window.location.href ="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from=secondaryPage";
                    //slide('left','lightblue',1,"forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index);
                    //parent.location="forecastingPage2o1_GroupDetails.html?itemId="+$(this).attr('itemId')+"&from="+loadAmount+"&scroll="+document.body.scrollTop+"&which="+index;
                })
            });

            loadend();

        }

    }

    function ajax_failFS(obj){
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            InvestGroupsDailyOnload();
            InvestGroupsMonthlyOnload();
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
    AddGoback(localStorage.N_url, 'forecastingPage2_InvestGroups.html');
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href ='forecastingPage2_InvestGroups.html';
    //parent.location='index.html';
}