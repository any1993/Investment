/**
 * Created by Kris on 2017/2/27.
 */

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

    $(".openDateMonthCalendarDateBox>.openDateMonthCalendarDate").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".openDateMonthCalendarDateBox>.openDateMonthCalendarDate").removeClass("selected");
            $(this).addClass("selected");

            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");

            //$(this).css("color","#999999");
            //$(".explain").eq(index).css("color","#999999");
            //$(".explain").eq(index).css("borderColor","#999999");
        })
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