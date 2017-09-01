/**
 * Created by Kris on 2017/2/23.
 */
/**
 * Created by Kris on 2017/2/21.
 */


$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);
    //document.getElementById('b1').addEventListener("click", toMainPage1, false);
    //document.getElementById('b2').addEventListener("click", toMainPage2, false);
    ////document.getElementById('b3').addEventListener("click", toMainPage3, false);
    //document.getElementById('b4').addEventListener("click", toMainPage4, false);
    //document.getElementById('b5').addEventListener("click", toMainPage5, false);

    //document.getElementById('editBtn').addEventListener("click", editDisplay, false);


    $(".editPageTypeBox>.editPageType").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        $(".editPageTypeBox>.editPageType").removeClass("selected");
        $(this).addClass("selected");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $(".editPageSubmitBtn").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        //window.location.href = 'secondaryPage_ProductDetails.html';
        window.location.href = 'mainPage2_Optional.html';
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    })


}


//function editDisplay(){
//    if( $("#editBtn").attr('state') == "off" ){
//        $(".homePageProductList").removeClass("tableDisplay");
//        $(".homePageProductEditList").addClass("tableDisplay");
//        $(".editSubmitBox").css("display","block");
//        $("footer").css("display","none");
//        $("#editBtn").attr("state","on");
//        $("#editBtn").text("完成");
//
//    }else if( $("#editBtn").attr('state') == "on"  ){
//        $(".homePageProductEditList").removeClass("tableDisplay");
//        $(".homePageProductList").addClass("tableDisplay");
//        $(".editSubmitBox").css("display","none");
//        $("footer").css("display","block");
//        $("#editBtn").attr("state","off");
//        $("#editBtn").text("编辑");
//
//    }else{
//        $(".homePageProductEditList").removeClass("tableDisplay");
//        $(".homePageProductList").addClass("tableDisplay");
//        $(".editSubmitBox").css("display","none");
//        $("footer").css("display","block");
//
//        $("#editBtn").attr("state","off");
//        $("#editBtn").text("编辑");
//
//    }
//
//
//}


function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //parent.location='index.html';
}
