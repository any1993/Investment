/**
 * Created by Kris on 2017/2/21.
 */


$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);
    document.getElementById('editBtn').addEventListener("click", editDisplay, false);
    //document.getElementById('guaranteedEdit').addEventListener("click", guaranteedEdit, false);
    //document.getElementById('pageBack').addEventListener("click", touchBack, false);
    //document.getElementById('b1').addEventListener("click", toMainPage1, false);
    //document.getElementById('b2').addEventListener("click", toMainPage2, false);
    ////document.getElementById('b3').addEventListener("click", toMainPage3, false);
    //document.getElementById('b4').addEventListener("click", toMainPage4, false);
    //document.getElementById('b5').addEventListener("click", toMainPage5, false);


    $(".basicBtnAdd").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='mainPage3_ProductEdit.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });
    $("#customBtn").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='mainPage3_ProductEdit.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });


    $(".basicBtnAdd").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='mainPage3_ProductEdit.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    })


}

function editDisplay(){


    $(".choiceIcon").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".choiceIcon").attr("src","img/choiceUN.png");
            $(this).attr("src","img/chosen.png");
            //$(".explain").eq(index).css("color","#999999");
            //$(".explain").eq(index).css("borderColor","#999999");

        })
    });


    if( $("#editBtn").attr('state') == "off" ){
        $(".homePageProductList").removeClass("tableDisplay");
        $(".homePageProductEditList").addClass("tableDisplay");
        $(".editSubmitBox").css("display","block");
        $("footer").css("display","none");
        $("#editBtn").attr("state","on");
        $("#editBtn").text("完成");

    }else if( $("#editBtn").attr('state') == "on"  ){
        $(".homePageProductEditList").removeClass("tableDisplay");
        $(".homePageProductList").addClass("tableDisplay");
        $(".editSubmitBox").css("display","none");
        $("footer").css("display","block");
        $("#editBtn").attr("state","off");
        $("#editBtn").text("编辑");

    }else{
        $(".homePageProductEditList").removeClass("tableDisplay");
        $(".homePageProductList").addClass("tableDisplay");
        $(".editSubmitBox").css("display","none");
        $("footer").css("display","block");

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
function guaranteedEdit(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.location.href = 'mainPage3P2_GuaranteedProductEdit.html';
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
    window.location.href = 'mainPage3_ProductEdit.html';
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