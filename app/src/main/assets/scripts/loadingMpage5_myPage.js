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
    document.getElementById('b4').addEventListener("click", toMainPage4, false);
    //document.getElementById('b5').addEventListener("click", toMainPage5, false);

    $(".mypageClose").on("click",function(){
        $(".mypageWelcome").css("display","none");
    })
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