/**
 * Created by Kris on 2017/2/27.
 */

var ItemId = GetQueryString("itemId");
//var ItemId = "7806";
//var ItemId = GetQueryString("itemId");

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

//Investment/PortfolioHistoryProfit?PortfolioID=g01&accuracy=1&fromTime=1491892453&endtime=1494484453


    $.ajax({
        type: "GET",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductCost?productID="+ItemId,
        dataType:'json',
        success: function (data) {
            console.log(data);

            if( data != null && data != undefined){
                console.log(data);
                $(".pageTitleFundName").html(data.ProductName+"<br>手续费");
                $("title").html(data.ProductName+" - 基金费用详情");

                $(".DataDisplayNo01").text("1.2%");
                $(".DataDisplayNo02").text("0.9%");
                $(".DataDisplayNo03").text("0.6%");
                $(".DataDisplayNo04").text("1000元/笔");
                $(".DataDisplayNo05").text("1.5%");
                $(".DataDisplayNo06").text("1.2%");
                $(".DataDisplayNo07").text("0.8%");
                $(".DataDisplayNo08").text("1000元/笔");
                $(".DataDisplayNo09").text("1.5%");


                //$(".DataDisplayNo01").text(data.SubscriptionFee[0].FeeRatio);
                //$(".DataDisplayNo02").text(data.SubscriptionFee[1].FeeRatio);
                //$(".DataDisplayNo03").text(data.SubscriptionFee[2].FeeRatio);
                //$(".DataDisplayNo04").text(data.SubscriptionFee[3].FeeRatio);
                //$(".DataDisplayNo05").text(data.ApplyFee[0].FeeRatio);
                //$(".DataDisplayNo06").text(data.ApplyFee[1].FeeRatio);
                //$(".DataDisplayNo07").text(data.ApplyFee[2].FeeRatio);
                //$(".DataDisplayNo08").text(data.ApplyFee[3].FeeRatio);
                //$(".DataDisplayNo09").text(data.RedeemFee[0].FeeRatio);
                //$(".DataDisplayNo10").text(data.SubscriptionFee[0].FeeRatio);

            }else{
                //alert("暂无基金费用详情")
            }


        },
        error:function(e){
            console.log(e);
            //alert("error:"+e);
        }
    });





    //$.ajax({
    //    type: "GET",
    //    async:true,
    //    url: "https://api.palaspom.com/Investment/ProductHeavilyHeld?productID=11372",
    //    dataType:'json',
    //    success: function (data) {
    //        console.log(1);
    //        console.log(data);
    //    },
    //    error:function(e){
    //        console.log(e);
    //        //alert("error:"+e);
    //    }
    //});




    //$("#fundArchives").on("click",function(event){
    //    event.stopPropagation();
    //    event.preventDefault();
    //    window.location.href ='informationPage01P1_FundArchives.html';
    //});
    //$("#fundCompany").on("click",function(event){
    //    event.stopPropagation();
    //    event.preventDefault();
    //    window.location.href ='informationPage03_FundCompanyDetails.html';
    //});
    //$("#fundCost").on("click",function(event){
    //    event.stopPropagation();
    //    event.preventDefault();
    //    window.location.href ='informationPage01P2_FundCost.html';
    //});
    //$("#fundHeavily").on("click",function(event){
    //    event.stopPropagation();
    //    event.preventDefault();
    //    window.location.href ='informationPage01P3_FundHeavily.html';
    //});
}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.history.back();
    //window.location.href = 'index.html';
    //parent.location='index.html';
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}