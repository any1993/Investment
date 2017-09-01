/**
 * Created by aa on 2016/4/21.
 */
var AccessToken;
var foreScroll=parseInt(GetQueryString("scroll"));
var nullu = "", NowVerision = "2.0", UserID = "";
var db;
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
            //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+foreScroll);
            //window.location.href = 'index.html'+'?scroll='+foreScroll;
            //parent.location='index.html';
        }
    });

    //pageLocationChange
    document.getElementById('backpage3').addEventListener("click", touchBack, false);
    document.addEventListener("backbutton", touchBack, false);
    //加载下单榜
    TradeStocksOnload();
}


//加载下单榜
function TradeStocksOnload(){
    //主题买入
    httpGet("Reader/TradeBlocks?sortType=0&count=12","",true,ajax_success01,ajax_fail01);
    function ajax_success01(obj){
        if (obj != null && obj != "" && obj != undefined){
            var num = obj.length;
            for (var a = 0; a < 12; a++) {
                if(a >= num){continue;}
                $(".datalistBP2 .sharesBoxTB:eq(0)").append("" +
                "<tr class='sharesImf_list'><td>" +
                "<span class='share_nameC topicLink'>主题名称</span></td> <td>" +
                "<span class='buyin'></span></td> <td>" +
                "<span class='sellout'></span></td> <td>" +
                "<span class='price'></span></td> <td>" +
                "<span class='raf'></span></td> </tr>");

                $(".sharesBoxTB:eq(0) .share_nameC").eq(a).attr("itemId",obj[a].Block.ID);
                $(".sharesBoxTB:eq(0) .share_nameC").eq(a).text(obj[a].Block.Name);
                $(".sharesBoxTB:eq(0) .buyin").eq(a).text(obj[a].BuyCount);
                $(".sharesBoxTB:eq(0) .sellout").eq(a).text(obj[a].SellCount);
                if( obj[a].Block.AvgPrice > 0 ){
                    $(".sharesBoxTB:eq(0) .price").eq(a).text(returnFloat(obj[a].Block.AvgPrice));
                }else if( obj[a].Block.AvgPrice <= 0 ){
                    $(".sharesBoxTB:eq(0) .price").eq(a).text("——");
                }
                if(obj[a].Block.ChangePercent >= 0){
                    $(".sharesBoxTB:eq(0) .raf").eq(a).text("+"+returnFloat(obj[a].Block.ChangePercent)+"%");
                }else{
                    $(".sharesBoxTB:eq(0) .raf").eq(a).text(returnFloat(obj[a].Block.ChangePercent)+"%");
                    $(".sharesBoxTB:eq(0) .raf").eq(a).css("color","#20c062");
                }
            }
            $(".loading").css("display","none");

            $(".sharesBoxTB:eq(0) .topicLink").unbind("click");
            $(".sharesBoxTB:eq(0) .topicLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);

                })
            });

        }
    }
    function ajax_fail01(){
        console.log("流入板块加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            TradeStocksOnload();
        });
    }

    //主题卖出
    httpGet("Reader/TradeBlocks?sortType=1&count=12","",true,ajax_success02,ajax_fail02);
    function ajax_success02(obj2){
        if (obj2 != null && obj2 != "" && obj2 != undefined){
            var num = obj2.length;
            for (var a = 0; a < 12; a++) {
                if(a >= num){continue;}
                $(".datalistBP2 .sharesBoxTB:eq(1)").append("<tr class='sharesImf_list'> <td>" +
                "<span class='share_nameC topicLink'>主题名称</span></td> <td>" +
                "<span class='buyin'></span></td> <td>" +
                "<span class='sellout'></span></td><td>" +
                "<span class='price'></span></td><td>" +
                "<span class='raf'></span></td> </tr>");


                $(".sharesBoxTB:eq(1) .share_nameC").eq(a).attr("itemId",obj2[a].Block.ID);
                $(".sharesBoxTB:eq(1) .share_nameC").eq(a).text(obj2[a].Block.Name);
                $(".sharesBoxTB:eq(1) .buyin").eq(a).text(obj2[a].BuyCount);
                $(".sharesBoxTB:eq(1) .sellout").eq(a).text(obj2[a].SellCount);

                if( obj2[a].Block.AvgPrice > 0 ){
                    $(".sharesBoxTB:eq(1) .price").eq(a).text(returnFloat(obj2[a].Block.AvgPrice));
                }else if( obj2[a].Block.AvgPrice <= 0 ){
                    $(".sharesBoxTB:eq(1) .price").eq(a).text("——");
                }
                //$(".sharesBoxTB:eq(1) .price").eq(a).text(returnFloat(obj2[a].Block.AvgPrice));
                if(obj2[a].Block.ChangePercent >= 0){
                    $(".sharesBoxTB:eq(1) .raf").eq(a).text("+"+returnFloat(obj2[a].Block.ChangePercent)+"%");
                }else{
                    $(".sharesBoxTB:eq(1) .raf").eq(a).text(returnFloat(obj2[a].Block.ChangePercent)+"%");
                    $(".sharesBoxTB:eq(1) .raf").eq(a).css("color","#20c062");
                }

                $(".sharesBoxTB:eq(1) .topicLink").unbind("click");
                $(".sharesBoxTB:eq(1) .topicLink").each(function(){
                    $(this).on("click",function(event){
                        event.stopPropagation();
                        event.preventDefault();
                        AddGoback(localStorage.N_url, 'opportunityPage3o1_TopicDetails.html?itemId='+$(this).attr("itemId")+'&scroll='+document.body.scrollTop);

                    })
                });
            }
            $(".loading").css("display","none");
        }
    }
    function ajax_fail02(){
        console.log("流出板块加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            TradeStocksOnload();
        });
    }


    //股票买入
    httpGet("Reader/TradeStocks?sortType=0&count=12","",true,ajax_success03,ajax_fail03);
    function ajax_success03(obj3){
        //console.log(obj3);
        if (obj3 != null && obj3 != "" && obj3 != undefined){
            var num = obj3.length;
            for (var a = 0; a < num; a++) {
                $(".datalistBP2 .sharesBoxT").eq(0).append("<tr class='sharesImf_list'> <td>" +
                "<span class='share_nameC stockLink'>股票名称</span>" +
                "<small class='sharesNum'></small></td> <td>" +
                "<span class='buyin'></span></td><td>" +
                "<span class='sellout'></span></td><td>" +
                "<span class='price'></span></td><td>" +
                "<span class='raf'>N/A</span></td></tr>");

                $(".sharesBoxT:eq(0) .share_nameC").eq(a).attr("itemId",obj3[a].Stock.Symbol);
                $(".sharesBoxT:eq(0) .share_nameC").eq(a).text(obj3[a].Stock.Name);
                $(".sharesBoxT:eq(0) .sharesNum").eq(a).text(obj3[a].Stock.Code);
                $(".sharesBoxT:eq(0) .buyin").eq(a).text(obj3[a].BuyCount);
                $(".sharesBoxT:eq(0) .sellout").eq(a).text(obj3[a].SellCount);
                if( obj3[a].Stock.Trade > 0 ){
                    $(".sharesBoxT:eq(0) .price").eq(a).text(returnFloat(obj3[a].Stock.Trade));
                }else if( obj3[a].Stock.Trade <= 0 ){
                    $(".sharesBoxT:eq(0) .price").eq(a).text("——");
                }
                if(obj3[a].Stock.Changepercent >= 0){
                    $(".sharesBoxT:eq(0) .raf").eq(a).text("+"+returnFloat(obj3[a].Stock.Changepercent)+"%");
                }else{
                    $(".sharesBoxT:eq(0) .raf").eq(a).text(returnFloat(obj3[a].Stock.Changepercent)+"%");
                    $(".sharesBoxT:eq(0) .raf").eq(a).css("color","#20c062");
                }
            }
            $(".loading").css("display","none");

            $(".sharesBoxT:eq(0) .stockLink").unbind("click");
            $(".sharesBoxT:eq(0) .stockLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();

                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });
        }
    }
    function ajax_fail03(){
        console.log("流入个股加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            TradeStocksOnload();
        });
    }

    httpGet("Reader/TradeStocks?sortType=1&count=12","",true,ajax_success04,ajax_fail04);
    function ajax_success04(obj4){
        if (obj4 != null && obj4 != "" && obj4 != undefined){
            var num = obj4.length;
            for (var a = 0; a < num; a++) {
                $(".datalistBP2 .sharesBoxT").eq(1).append("<tr class='sharesImf_list'><td>" +
                "<span class='share_nameC stockLink'></span>" +
                "<small class='sharesNum'></small></td><td>" +
                "<span class='buyin'></span></td><td>" +
                "<span class='sellout'></span></td><td>" +
                "<span class='price'></span></td><td>" +
                "<span class='raf'></span></td></tr>");

                $(".sharesBoxT:eq(1) .share_nameC").eq(a).attr("itemId",obj4[a].Stock.Symbol);
                $(".sharesBoxT:eq(1) .share_nameC").eq(a).text(obj4[a].Stock.Name);
                $(".sharesBoxT:eq(1) .sharesNum").eq(a).text(obj4[a].Stock.Code);
                $(".sharesBoxT:eq(1) .buyin").eq(a).text(obj4[a].BuyCount);
                $(".sharesBoxT:eq(1) .sellout").eq(a).text(obj4[a].SellCount);
                if( obj4[a].Stock.Trade > 0 ){
                    $(".sharesBoxT:eq(1) .price").eq(a).text(returnFloat(obj4[a].Stock.Trade));
                }else if( obj4[a].Stock.Trade <= 0 ){
                    $(".sharesBoxT:eq(1) .price").eq(a).text("——");
                }
                //$(".sharesBoxT:eq(1) .price").eq(a).text(returnFloat(obj4[a].Stock.Trade));
                if(obj4[a].Stock.Changepercent >= 0){
                    $(".sharesBoxT:eq(1) .raf").eq(a).text("+"+returnFloat(obj4[a].Stock.Changepercent)+"%");
                }else{
                    $(".sharesBoxT:eq(1) .raf").eq(a).text(returnFloat(obj4[a].Stock.Changepercent)+"%");
                    $(".sharesBoxT:eq(1) .raf").eq(a).css("color","#20c062");
                }
            }
            $(".loading").css("display","none");
            $(".sharesBoxT:eq(0) .stockLink").unbind("click");
            $(".sharesBoxT:eq(0) .stockLink").each(function(){
                $(this).on("click",function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    AddGoback(localStorage.N_url, "stock.html?stockId="+$(this).attr("itemId"));
                    //window.location.href ="stock.html?stockId="+$(this).attr("itemId");
                    //slide('left','lightblue',1,'stock.html?stockId='+$(this).attr("itemId"));
                })
            });
        }
    }
    function ajax_fail04(){
        console.log("流出个股加载失败");
        $(".loading").html("<img src='img/logo.png' class='loadingImg'><br><span class='loadingSpan'>加载失败，点击重新加载</span>");
        $(".loading .loadingImg").on("click",function(){
            $(".loading .loadingImg").remove();
            $(".loading .loadingSpan").remove();
            $(".loading").html("<img src='img/loading.gif' class='loadingImg'><br><span class='loadingSpan'>加载中……</span>");
            TradeStocksOnload();
        });
    }



    $(".btnOfStocks>.Bors").each(function(index){
        $(this).on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".btnOfStocks>.Bors").removeClass("Selected");
            $(this).addClass("Selected");
            $(".bosBox").removeClass("listDisplay");
            $(".bosBox").eq(index).addClass("listDisplay");

        })
    });

    $(".sharesBoxTB .toSellPage").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".sharesBoxTB").eq(1).removeClass("listHide");
        $(".sharesBoxTB").eq(0).addClass("listHide");
    });

    $(".sharesBoxTB .toBuyPage").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".sharesBoxTB").eq(0).removeClass("listHide");
        $(".sharesBoxTB").eq(1).addClass("listHide");
    })

    $(".sharesBoxT .toSellPage").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".sharesBoxT").eq(1).removeClass("listHide");
        $(".sharesBoxT").eq(0).addClass("listHide");
    });

    $(".sharesBoxT .toBuyPage").on("click",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".sharesBoxT").eq(0).removeClass("listHide");
        $(".sharesBoxT").eq(1).addClass("listHide");
    })

}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    Gotoback();
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html'+'?scroll='+foreScroll);
    //window.location.href = 'index.html'+'?scroll='+foreScroll;
    //parent.location='index.html';
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}