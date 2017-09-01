/**
 * Created by Kris on 2017/2/27.
 */

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    //document.getElementById('pageBack').addEventListener("click", touchBack, false);
    //document.getElementById('basicBtnMore').addEventListener("click", touchOpenDate, false);
    document.getElementById('b1').addEventListener("click", toMainPage1, false);
    //document.getElementById('b2').addEventListener("click", toMainPage2, false);
    document.getElementById('b3').addEventListener("click", toMainPage3, false);
    document.getElementById('b4').addEventListener("click", toMainPage4, false);
    document.getElementById('b5').addEventListener("click", toMainPage5, false);

    $(".proLibMainSelectBox>.proLibMainSelectBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".proLibMainSelectBox>.proLibMainSelectBtn").removeClass("selected");
            $(this).addClass("selected");
            if( index == 0 ){
                $(".TypeSwitchTag01").css("display","block");
            }else if( index == 1 ){
                $(".TypeSwitchTag01").css("display","none");
            }
            //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
            //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");

            //$(".explain").eq(index).css("color","#999999");
            //$(".explain").eq(index).css("borderColor","#999999");
        })
    });
    $(".proLibTableInfo").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='informationPage01_FundDetails.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });
    //informationPage01_FundDetails.html

    $(".timeTagSwitchType01").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".timeTagSwitchType01").removeClass("selected");
            $(this).addClass("selected");
        })
    });
    $(".timeTagSwitchType02").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".timeTagSwitchType02").removeClass("selected");
            $(this).addClass("selected");
        })
    });
    $(".timeTagSwitchType03").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".timeTagSwitchType03").removeClass("selected");
            $(this).addClass("selected");
        })
    });

    $(".proLibSecondarySwitchBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            if(  $(".proLibSecondarySwitchBtn").attr("src") == "img/SwitchOnBtn.png" ){
                $(".proLibSecondarySwitchBtn").attr("src","img/SwitchOffBtn.png")
            }else if( $(".proLibSecondarySwitchBtn").attr("src") == "img/SwitchOffBtn.png" ){
                $(".proLibSecondarySwitchBtn").attr("src","img/SwitchOnBtn.png")
            }
        })
    });

    $(".proLibSecondarySelectTypeName").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            //console.log($(".proLibSecondarySelectTypeName>.proLibSecondarySelectTypeBtn").attr("src"));
            //$(this>".proLibSecondarySelectTypeBtn").addClass("selected");

            if( $(".proLibSecondarySelectTypeBtn").eq(index).attr("src") == "img/LibTypeSelected.png" ){
                $(".proLibSecondarySelectTypeBtn").eq(index).attr("src","img/LibTypeUnSelected.png")
            }else if( $(".proLibSecondarySelectTypeBtn").eq(index).attr("src") == "img/LibTypeUnSelected.png" ){
                $(".proLibSecondarySelectTypeBtn").eq(index).attr("src","img/LibTypeSelected.png")
            }

        })
    });



    $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".proLibSecondarySubmitRightBtn").unbind("click");
            $(".clickHideBack").unbind("click");

            $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn").removeClass("selected");
            $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon").attr("src","img/btnUn.png");
            $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon2").attr("src","img/Select_Off.png");
            $(this).addClass("selected");


            if( index != 3 ){
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon").eq(index).attr("src","img/btnBuy.png");
            }else if( index == 3){
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon2").attr("src","img/Select_On.png");
            }

            $(".proLibSecondarySelectInfoBox").css("display","block");
            $(".proLibSecondarySelectInfoBlock").removeClass("selected");
            $(".proLibSecondarySelectInfoBlock").eq(index).addClass("selected");


            $(".proLibSecondarySubmitRightBtn").on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".proLibSecondarySelectInfoBox").css("display","none");
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn").removeClass("selected");
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon").attr("src","img/btnUn.png");
                $(".proLibSecondarySelectInfoBlock").removeClass("selected");

            });


            $(".clickHideBack").on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".proLibSecondarySelectInfoBox").css("display","none");
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn").removeClass("selected");
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon").attr("src","img/btnUn.png");
                $(".proLibSecondarySelectInfoBlock").removeClass("selected");
            });

            $(".iconGray01").on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".proLibSecondarySelectBox>.proLibSecondarySelectBtn>.proLibBtnIcon2").attr("src","img/Select_Off.png");
            });

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

function touchOpenDate(event){
    event.stopPropagation();
    event.preventDefault();
    //Gotoback();
    window.location.href = 'secondaryPage08_OpenDateList.html';
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
    //window.location.href = 'mainPage2_Optional.html';
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