/**
 * Created by Kris on 2017/2/27.
 */

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {

    document.getElementById('b1').addEventListener("click", toMainPage1, false);
    document.getElementById('b2').addEventListener("click", toMainPage2, false);
    document.getElementById('b3').addEventListener("click", toMainPage3, false);
    //document.getElementById('b4').addEventListener("click", toMainPage4, false);
    document.getElementById('b5').addEventListener("click", toMainPage5, false);

    $(".basicBtnAdd").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='secondaryPage03_NewCustomer.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $(".CustomerListTableImf").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='secondaryPage06_CustomerProductDetails.html';
    });
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