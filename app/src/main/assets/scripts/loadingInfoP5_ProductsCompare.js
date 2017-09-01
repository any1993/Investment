/**
 * Created by Kris on 2017/2/27.
 */

var ItemId = GetQueryString("itemId");

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);


    $.ajax({
        type: "GET",
        async:true,
        url: "https://api.palaspom.com/Investment/ProductArchives?productID={productID}",
        dataType:'json',
        beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "");
        },
        success: function (data) {
            console.log(data);
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