/**
 * Created by Kris on 2017/2/27.
 */

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);



    $(".proLibTableInfo").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='secondaryPage_ProductDetails.html';
        //$(".choiceIcon").attr("src","img/choiceUN.png");
        //$(this).attr("src","img/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $(".typeTagSwitchType01").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".typeTagSwitchType01").removeClass("selected");
            $(this).addClass("selected");
        })
    });
    $(".typeTagSwitchType02").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".typeTagSwitchType02").removeClass("selected");
            $(this).addClass("selected");
        })
    });
    $(".typeTagSwitchType03").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".typeTagSwitchType03").removeClass("selected");
            $(this).addClass("selected");
        })
    });



    $(".bestCbmSelectBox>.bestCbmSelectBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".editPageSubmitBtn02").unbind("click");
            $(".clickHideBack").unbind("click");

            $(".bestCbmSelectBox>.bestCbmSelectBtn").removeClass("selected");
            $(".bestCbmSelectBox>.bestCbmSelectBtn>.proLibBtnIcon").attr("src","img/btnUn.png");
            $(this).addClass("selected");
            $(".bestCbmSelectBox>.bestCbmSelectBtn>.proLibBtnIcon").eq(index).attr("src","img/btnBuy.png");

            $(".proLibSecondarySelectInfoBox").css("display","block");
            $(".proLibSecondarySelectInfoBlock").removeClass("selected");
            $(".proLibSecondarySelectInfoBlock").eq(index).addClass("selected");


            $(".editPageSubmitBtn02").each(function(index) {
                $(this).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(".proLibSecondarySelectInfoBox").css("display", "none");
                    $(".bestCbmSelectBox>.bestCbmSelectBtn").removeClass("selected");
                    $(".bestCbmSelectBox>.bestCbmSelectBtn>.proLibBtnIcon").attr("src", "img/btnUn.png");
                    $(".proLibSecondarySelectInfoBlock").removeClass("selected");

                    if( $('.proLibSecondarySelectBtnBox:eq('+index+')>.proLibSecondarySelectTimeBtn.selected').html() == "不限" ){
                        if( index == 0){
                            $(".bestCbmSelectBtnText").eq(index).text("按风格");
                        }else if( index == 1 ){
                            $(".bestCbmSelectBtnText").eq(index).text("按比例");
                        }else if( index == 2 ){
                            $(".bestCbmSelectBtnText").eq(index).text("按管理人");
                        }
                    }else{
                        $(".bestCbmSelectBtnText").eq(index).text($('.proLibSecondarySelectBtnBox:eq('+index+')>.proLibSecondarySelectTimeBtn.selected').html());
                    }
                    //console.log()
                    })
            });

            $(".clickHideBack").on("click",function(e){
                e.stopPropagation();
                e.preventDefault();
                $(".proLibSecondarySelectInfoBox").css("display","none");
                $(".bestCbmSelectBox>.bestCbmSelectBtn").removeClass("selected");
                $(".bestCbmSelectBox>.bestCbmSelectBtn>.proLibBtnIcon").attr("src","img/btnUn.png");
                $(".proLibSecondarySelectInfoBlock").removeClass("selected");
            });

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