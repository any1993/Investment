/**
 * Created by Kris on 2017/2/27.
 */

var ItemId = GetQueryString("itemId");
//var ItemId = "7934";
//var ItemId = GetQueryString("itemId");

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);


    $.ajax({
        type: "GET",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductArchives?productID="+ItemId,
        dataType:'json',
        //beforeSend: function (xhr) {
        //        xhr.setRequestHeader("Authorization", "");
        //},
        success: function (data) {
            //console.log(data);
            $(".data_Name").text(data.ProductName);
            $(".data_Code").text(data.ProductCode);

            if( data.EstablishDate != 0 ){
                var Establish = new Date(parseInt(data.EstablishDate) * 1000).toLocaleString();
            }
            if( data.MaturityDate != 0 ){
                var MaturityDate = new Date(parseInt(data.MaturityDate) * 1000).toLocaleString();
            }

            if( data.PurchaseDate != 0 ){
                var PurchaseDate = new Date(parseInt(data.PurchaseDate) * 1000).toLocaleString();
            }

            $(".data_Establish").text(Establish);
            $(".data_Date").text(MaturityDate);
            $(".data_Purchase").text(PurchaseDate);
            var fundType = "";
            if( data.Type == 0 ){
                fundType = "—";
            }else if( data.Type == 1 ){
                fundType = "偏股型";
            }else if( data.Type == 2 ){
                fundType = "偏债型";
            }else if( data.Type == 3 ){
                fundType = "货币型";
            }else if( data.Type == 4 ){
                fundType = "指数型";
            }else if( data.Type == 5 ){
                fundType = "QDII";
            }else{
                fundType = "—";
            }
            $(".pageTitleFundName").html(data.ProductName+"<br>基金档案");
            $(".title").html(data.ProductName+" 基金档案");
            $(".data_Type").text(fundType);
            $(".data_Unit").text(data.UnitValue);
            $(".data_Min").text(data.MinimumAmount);
            $(".data_Manager").text(data.FundManager);
            $(".data_Custodian").text(data.FundCustodian);
            $(".data_Registrant").text(data.Registrant);
        },
        error:function(e){
            console.log(e);
            //alert("error:"+e);
        }
    });




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