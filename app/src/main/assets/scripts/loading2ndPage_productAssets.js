/**
 * Created by Kris on 2017/2/27.
 */
/**
 * Created by Kris on 2017/2/24.
 */
var ItemId = GetQueryString("itemId");
//var ItemId = "e777bb93cc256de8d6e86b25d3a7e572";

var fundClassification01 ;
var fundClassification02 ;
var fundClassification03 ;
var fundClassification04 ;
var fundClassification05 ;
var fundClassification06 ;

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

    //获取组合详情
    $.ajax({
        type: "get",
        async:true,
        url: "https://api.palaspom.com/Investment/Portfolio?portfolioID="+ItemId,
        dataType:'json',
        success: function (data) {
            console.log("组合详情");
            console.log(data);

            if( data != undefined && data != null && data != ""){

                if( data.Products != undefined && data.Products != null && data.Products != "" ){
                    for( var i = 0 ; i < data.Products.length ; i++){
                        if( data.Products[i].Classification == 1 ){
                            if( fundClassification01 == undefined){
                                fundClassification01 = 0
                            }

                            fundClassification01 += parseFloat(data.Products[i].Proportion*100) ;

                            $(".assetsTableDisplay01").append("" +
                            " <tr class='AssetsAllocationTableImf' >" +
                            "<td>"+data.Products[i].ProductName+"</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedProfitRate)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].MaxRetracement)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedVolatility)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].SharpeRate)+"</td> " +
                            "<td>"+returnFloat(data.Products[i].Proportion*100)+"%</td> " +
                            "</tr>" +
                            "")
                        }else if( data.Products[i].Classification == 2 ){
                            if( fundClassification02 == undefined){
                                fundClassification02 = 0
                            }
                            fundClassification02 += parseFloat(data.Products[i].Proportion) * 100 ;
                            $(".assetsTableDisplay02").append("" +
                            " <tr class='AssetsAllocationTableImf' >" +
                            "<td>"+data.Products[i].ProductName+"</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedProfitRate)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].MaxRetracement)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedVolatility)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].SharpeRate)+"</td> " +
                            "<td>"+returnFloat(data.Products[i].Proportion*100)+"%</td> " +
                            "</tr>" +
                            "")
                        }else if( data.Products[i].Classification == 3 ){
                            if( fundClassification03 == undefined){
                                fundClassification03 = 0
                            }
                            fundClassification03 += parseFloat(data.Products[i].Proportion) * 100 ;
                            $(".assetsTableDisplay03").append("" +
                            " <tr class='AssetsAllocationTableImf' >" +
                            "<td>"+data.Products[i].ProductName+"</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedProfitRate)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].MaxRetracement)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedVolatility)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].SharpeRate)+"</td> " +
                            "<td>"+returnFloat(data.Products[i].Proportion*100)+"%</td> " +
                            "</tr>" +
                            "")
                        }else if( data.Products[i].Classification == 4 ){
                            if( fundClassification04 == undefined){
                                fundClassification04 = 0
                            }
                            fundClassification04 += parseFloat(data.Products[i].Proportion) * 100 ;
                            $(".assetsTableDisplay04").append("" +
                            " <tr class='AssetsAllocationTableImf' >" +
                            "<td>"+data.Products[i].ProductName+"</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedProfitRate)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].MaxRetracement)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedVolatility)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].SharpeRate)+"</td> " +
                            "<td>"+returnFloat(data.Products[i].Proportion*100)+"%</td> " +
                            "</tr>" +
                            "")
                        }else if( data.Products[i].Classification == 5 ){
                            if( fundClassification05 == undefined){
                                fundClassification05 = 0
                            }
                            fundClassification05 += parseFloat(data.Products[i].Proportion) * 100 ;
                            $(".assetsTableDisplay05").append("" +
                            " <tr class='AssetsAllocationTableImf' >" +
                            "<td>"+data.Products[i].ProductName+"</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedProfitRate)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].MaxRetracement)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedVolatility)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].SharpeRate)+"</td> " +
                            "<td>"+returnFloat(data.Products[i].Proportion*100)+"%</td> " +
                            "</tr>" +
                            "")
                        }else{
                            if( fundClassification06 == undefined){
                                fundClassification06 = 0
                            }
                            fundClassification06 += parseFloat(data.Products[i].Proportion) * 100 ;
                            $(".assetsTableDisplay06").append("" +
                            " <tr class='AssetsAllocationTableImf' >" +
                            "<td>"+data.Products[i].ProductName+"</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedProfitRate)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].MaxRetracement)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].AnnualizedVolatility)+"%</td> " +
                            "<td>"+returnFloat(data.Products[i].SharpeRate)+"</td> " +
                            "<td>"+returnFloat(data.Products[i].Proportion*100)+"%</td> " +
                            "</tr>" +
                            "")
                        }
                    }


                    if( fundClassification01 != undefined){
                        //console.log(fundClassification01);
                        $(".FundDataBoxPercent01").text(returnFloat(fundClassification01) + "%");
                    }else{
                        $(".FundDataBox01").css("display","none");
                    }

                    if( fundClassification02 != undefined){
                        $(".FundDataBoxPercent02").text(returnFloat(fundClassification02) + "%");
                    }else{
                        $(".FundDataBox02").css("display","none");
                    }

                    if( fundClassification03 != undefined){
                        $(".FundDataBoxPercent03").text(returnFloat(fundClassification03) + "%");
                    }else{
                        $(".FundDataBox03").css("display","none");
                    }

                    if( fundClassification04 != undefined){
                        $(".FundDataBoxPercent04").text(returnFloat(fundClassification04) + "%");
                    }else{
                        $(".FundDataBox04").css("display","none");
                    }

                    if( fundClassification05 != undefined){
                        $(".FundDataBoxPercent05").text(returnFloat(fundClassification05) + "%");
                    }else{
                        $(".FundDataBox05").css("display","none");
                    }

                    if( fundClassification06 != undefined){
                        $(".FundDataBoxPercent06").text(returnFloat(fundClassification06) + "%");
                    }else{
                        $(".FundDataBox06").css("display","none");
                    }


                }else{
                    $(".mainBox").css("display","none");
                    $("body").append("<div class='noDataDisplayBlock' style='height: 160px;line-height: 160px;'>暂无产品配置数据</div>");

                }


            }else{
                $(".mainBox").css("display","none");
                $("body").append("<div class='noDataDisplayBlock' style='height: 160px;line-height: 160px;'>暂无产品配置数据</div>");

            }




        },
        error:function(e){
            //alert("error:"+e);
        }
    });
    //$(".productDetailsBtnBox>.productDetailsBtn").each(function(index){
    //    $(this).on("click",function(event){
    //        event.stopPropagation();
    //        event.preventDefault();
    //        $(".productDetailsBtnBox>.productDetailsBtn").removeClass("seleted");
    //        $(this).addClass("seleted");
    //
    //        $(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
    //        $(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
    //
    //        //$(this).css("color","#999999");
    //        //$(".explain").eq(index).css("color","#999999");
    //        //$(".explain").eq(index).css("borderColor","#999999");
    //    })
    //});
    //
    ////document.getElementById('editBtn').addEventListener("click", editDisplay, false);
    //
    //
    //$(".ChartContentSwitchBtnBox>.ChartContentSwitchBtn1").each(function(index){
    //    $(this).on("click",function(event){
    //        event.stopPropagation();
    //        event.preventDefault();
    //        $(".ChartContentSwitchBtnBox>.ChartContentSwitchBtn1").removeClass("seleted");
    //        $(this).addClass("seleted");
    //        //$(".productDetailsChartsBox>.productDetailsChartContent").removeClass("seleted");
    //        //$(".productDetailsChartsBox>.productDetailsChartContent").eq(index).addClass("seleted");
    //
    //    })
    //});

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

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
