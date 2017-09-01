




$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    //document.getElementById('b1').addEventListener("click", toMainPage1, false);
    document.getElementById('b2').addEventListener("click", toMainPage2, false);
    document.getElementById('b3').addEventListener("click", toMainPage3, false);
    document.getElementById('b4').addEventListener("click", toMainPage4, false);
    document.getElementById('b5').addEventListener("click", toMainPage5, false);
    document.getElementById('productLib').addEventListener("click", touchToolPage01, false);
    document.getElementById('researchReport').addEventListener("click", touchToolPage02, false);
    document.getElementById('bestGroup').addEventListener("click", touchToolPage03, false);
    //document.getElementById('selectedClass').addEventListener("click", touchToolPage04, false);


    $(".wordExplain").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".analysisDisplayBlock").css("display","block");
            $(this).css("color","#999999");
            $(".explain").eq(index).css("color","#999999");
            $(".explain").eq(index).css("borderColor","#999999");

        })
    });

    $(".analysisDisplayBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".analysisDisplayBlock").css("display","none");
            //$(this).css("color","#999999");
            //$(".explain").eq(index).css("color","#999999");
            //$(".explain").eq(index).css("borderColor","#999999");
        })
    });


}

function editDisplay(){
    if( $("#editBtn").attr('state') == "off" ){
        $(".homePageProductList").removeClass("tableDisplay");
        $(".homePageProductEditList").addClass("tableDisplay");
        $(".editSubmitBox").css("display","block");
        $("#editBtn").attr("state","on");
        $("#editBtn").text("完成");

    }else if( $("#editBtn").attr('state') == "on"  ){
        $(".homePageProductEditList").removeClass("tableDisplay");
        $(".homePageProductList").addClass("tableDisplay");
        $(".editSubmitBox").css("display","none");
        $("#editBtn").attr("state","off");
        $("#editBtn").text("编辑");

    }else{
        $(".homePageProductEditList").removeClass("tableDisplay");
        $(".homePageProductList").addClass("tableDisplay");
        $(".editSubmitBox").css("display","none");
        $("#editBtn").attr("state","off");
        $("#editBtn").text("编辑");

    }


}

function touchBack(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //parent.location='index.html';
}

function toMainPage1(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'index.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function toMainPage2(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'toolPage01_ProductLibrary.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function toMainPage3(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'mainPage2_Optional.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function toMainPage4(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'mainPage4_Customer.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function toMainPage5(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'mainPage5_MyPage.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function touchToolPage01(event){
    event.stopPropagation();
    event.preventDefault();
    //window.location.href = 'toolPage00_MyOptional.html';
    window.location.href = 'mainPage2_Optional.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function touchToolPage02(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'toolPage02_ResearchReport.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}

function touchToolPage03(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.href = 'toolPage03_BestCombination.html';
    //window.history.back();
    //slide('right', 'lightblue', 1, 'index.html');
    //parent.location='index.html';
}