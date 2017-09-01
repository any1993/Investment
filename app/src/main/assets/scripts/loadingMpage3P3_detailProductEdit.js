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
    document.getElementById('toNextStep').addEventListener("click", toNextPage, false);




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

function toNextPage(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.location.href = 'mainPage3P31_DetailGroupAdding.html';
    //slide('right', 'lightblue', 1, 'index.html');
    //window.location.href = 'index.html';
    //parent.location='index.html';
}

