/**
 * Created by Kris on 2017/2/27.
 */

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

    $(".researchRptSearchInput").focus(function(){
        $(".researchRptSearchInput").attr("value","私募 月报");
        $(".proLibSecondarySelectInfoBox").css("display","block");
        $(".InputClear").css("opacity","1");
        $(".InputClear").css("z-index","5");


        $(".researchRptReportBox").on("click",function(e){
            e.stopPropagation();
            e.preventDefault();
        });

        $(".proLibSecondarySelectInfoBox").on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".proLibSecondarySelectInfoBox").css("display","none");
            $(".proLibSecondarySelectInfoBox").unbind("click");

        });
        //$(".StockSearchPageLoading").css("display","none");
        //$(".stockSearching").css("z-index","1");
        //$(".stockSearching").animate({"width":"82%"},200);
        //$(".stockSearchingBtn").animate({"opacity":"1"},200);
    });

    $(".InputClear").click(function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".InputClear").css({"opacity":"0"});
        $(".researchRptSearchInput").attr("value","");
        $(".proLibSecondarySelectInfoBox").css("display","none");
        $(".proLibSecondarySelectInfoBox").unbind("click");
    });


    $(".researchRptReportItem").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='secondaryPage09_VisitingReport.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $(".researchRptReportTypeBtnBox>.researchRptReportTypeBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".researchRptReportTypeBtnBox>.researchRptReportTypeBtn").removeClass("selected");
            $(this).addClass("selected");

            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");

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