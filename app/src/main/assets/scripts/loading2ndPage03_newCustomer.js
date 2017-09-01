/**
 * Created by Kris on 2017/2/27.
 */

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

    $(".newCusImfChosenIcon").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".newCusImfChosenIcon").attr("src","img/choiceUN.png");
            $(this).attr("src","img/chosen.png");
            //$(".explain").eq(index).css("color","#999999");
            //$(".explain").eq(index).css("borderColor","#999999");

        })
    });


    $(".basicBtn2").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='secondaryPage04_NewProductList.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });


    $(".newCusImfSaveBtn").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='secondaryPage04_NewProductList.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

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