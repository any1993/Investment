/**
 * Created by Kris on 2017/2/27.
 */

var ItemId = GetQueryString("itemId");
//var ItemId = "10852";
var colorList = [
    '#F65261','#FF9B32','#FFCE30','#B6E056','#3CB787',
    '#4FA5F4','#8A65C8','#D562CB','#B75B80','#F48DA4'
];

$(function () {
    FastClick.attach(document.body);
    pageOnload();
});

function pageOnload() {
    document.getElementById('pageBack').addEventListener("click", touchBack, false);

    $.ajax({
        type: "GET",
        async:true,
        url: "https://api.palaspom.com/Investment/Company?companyID="+ItemId,
        //url: "http://192.168.2.22:88/Investment/Company?companyID="+ItemId,
        dataType:'json',
        //beforeSend: function (xhr) {
        //        xhr.setRequestHeader("Authorization", "");
        //},
        success: function (data) {
            console.log(data);
            if( data.CompanyLogo != null && data.CompanyLogo != undefined){
                $(".dataDisplayNo01").attr("src",data.CompanyLogo);
            }else{
                //$(".dataDisplayNo01").css("display","none");
            }

            if( data.DirectorImg != null && data.DirectorImg != undefined){
                $(".dataDisplayNo07").attr("src",data.DirectorImg);
            }else{
                //$(".dataDisplayNo07").css("opacity","0");
            }

            $(".dataDisplayNo02").text(data.CompanyName);

            var newDate=new Date();
            newDate.setTime(data.EstablishDate * 1000);
            $(".dataDisplayNo03").text("成立时间："+newDate.toISOString().substring(0,10));

            $(".dataDisplayNo04").text(data.Director);

            $(".dataDisplayNo05").text(returnNet(data.AssetScale/10000));

            $(".dataDisplayNo06").text(data.ScaleRanking);

            $(".dataDisplayNo08").text("("+data.Managers.length+")名");


            for(var i = 0; i < data.Managers.length; i++){
                $(".managerDataDisplayBox .fundCompanyManagerTable").eq(0).append("" +
                " <tr class='fundCompanyManagerTableInfo'>" +
                "<td>"+(i+1)+"</td>" +
                "<td>"+data.Managers[i].ManagerName+"</td> " +
                "<td>"+data.Managers[i].Period+"</td> " +
                "<td>"+returnFloat(data.Managers[i].AnnualizedProfitRate)+"%</td> " +
                "<td>"+data.Managers[i].ManagerScore+"</td> " +
                "</tr>"+
                "");
            }

            var amount01 = 0;
            var count01 = 0;
            var amount02 = 0;
            var count02 = 0;
            var amount03 = 0;
            var count03 = 0;
            var amount04 = 0;
            var count04 = 0;
            var amount05 = 0;
            var count05 = 0;

            for(var j = 0; j < data.Funds.length; j++){
                if( data.Funds[j].Type == 1){
                    $(".fundDataTableSwitch").eq(0).append("" +
                    " <tr class='fundCompanyManagerTableInfo'>" +
                    "<td>"+(count01+1)+"</td>" +
                    "<td>"+data.Funds[j].FundName+"</td> " +
                    "<td>"+returnFloat(data.Funds[j].AccumulatedProfitRate)+"%</td> " +
                    "<td>"+returnFloat(data.Funds[j].AnnualizedProfitRate)+"%</td> " +
                    "<td>"+returnNet(data.Funds[j].Scale/100000000)+"</td> " +
                    "</tr>"+
                    "");
                    count01++;
                    amount01 += data.Funds[j].Scale/100000000;
                }else if(  data.Funds[j].Type == 2 ){
                    $(".fundDataTableSwitch").eq(1).append("" +
                    " <tr class='fundCompanyManagerTableInfo'>" +
                    "<td>"+(count02+1)+"</td>" +
                    "<td>"+data.Funds[j].FundName+"</td> " +
                    "<td>"+returnFloat(data.Funds[j].AccumulatedProfitRate)+"%</td> " +
                    "<td>"+returnFloat(data.Funds[j].AnnualizedProfitRate)+"%</td> " +
                    "<td>"+returnNet(data.Funds[j].Scale/100000000)+"</td> " +
                    "</tr>"+
                    "");
                    count02++;
                    amount02 += data.Funds[j].Scale/100000000;
                }else if( data.Funds[j].Type == 3 ){
                    $(".fundDataTableSwitch").eq(2).append("" +
                    " <tr class='fundCompanyManagerTableInfo'>" +
                    "<td>"+(count03+1)+"</td>" +
                    "<td>"+data.Funds[j].FundName+"</td> " +
                    "<td>"+returnFloat(data.Funds[j].AccumulatedProfitRate)+"%</td> " +
                    "<td>"+returnFloat(data.Funds[j].AnnualizedProfitRate)+"%</td> " +
                    "<td>"+returnNet(data.Funds[j].Scale/100000000)+"</td> " +
                    "</tr>"+
                    "");
                    count03++;
                    amount03 += data.Funds[j].Scale/100000000;
                }else if( data.Funds[j].Type == 4 ){
                    $(".fundDataTableSwitch").eq(3).append("" +
                    " <tr class='fundCompanyManagerTableInfo'>" +
                    "<td>"+(count04+1)+"</td>" +
                    "<td>"+data.Funds[j].FundName+"</td> " +
                    "<td>"+returnFloat(data.Funds[j].AccumulatedProfitRate)+"%</td> " +
                    "<td>"+returnFloat(data.Funds[j].AnnualizedProfitRate)+"%</td> " +
                    "<td>"+returnNet(data.Funds[j].Scale/100000000)+"</td> " +
                    "</tr>"+
                    "");
                    count04++;
                    amount04 += data.Funds[j].Scale/100000000;
                }else if( data.Funds[j].Type == 5 ){
                    $(".fundDataTableSwitch").eq(4).append("" +
                    " <tr class='fundCompanyManagerTableInfo'>" +
                    "<td>"+(count05+1)+"</td>" +
                    "<td>"+data.Funds[j].FundName+"</td> " +
                    "<td>"+returnFloat(data.Funds[j].AccumulatedProfitRate)+"%</td> " +
                    "<td>"+returnFloat(data.Funds[j].AnnualizedProfitRate)+"%</td> " +
                    "<td>"+returnNet(data.Funds[j].Scale/100000000)+"</td> " +
                    "</tr>"+
                    "");
                    count05++;
                    amount05 += data.Funds[j].Scale/100000000;
                }else{
                //
                //    $(".fundDataTableSwitch").eq(0).append("" +
                //    " <tr class='fudndCompanyManagerTableInfo'>" +
                //    "<td>"+(count01+1)+"</td>" +
                //    "<td>"+data.Funds[j].FundName+"</td> " +
                //    "<td>"+data.Funds[j].AccumulatedProfitRate+"%</td> " +
                //    "<td>"+data.Funds[j].AnnualizedProfitRate+"%</td> " +
                //    "<td>"+returnNet(data.Funds[j].Scale/100000000)+"</td> " +
                //    "</tr>"+
                //    "");
                //    count01++;
                //    amount01 += data.Funds[j].Scale/100000000;
                }

            }

            $(".dataDisplayNo11").text("("+count01+")支");
            $(".dataDisplayNo12").text(returnNet(amount01) +"亿");

            $(".dataDisplayNo13").text("("+count02+")支");
            $(".dataDisplayNo14").text(returnNet(amount02) +"亿");

            $(".dataDisplayNo15").text("("+count03+")支");
            $(".dataDisplayNo16").text(returnNet(amount03) +"亿");

            $(".dataDisplayNo17").text("("+count04+")支");
            $(".dataDisplayNo18").text(returnNet(amount04) +"亿");

            $(".dataDisplayNo19").text("("+count05+")支");
            $(".dataDisplayNo20").text(returnNet(amount05) +"亿");

        },
        error:function(e){
            console.log(e);
            //alert("error:"+e);
        }
    });


    var myChart = echarts.init(document.getElementById('CompanyShareholderChart'));
    var option2 = {
        tooltip : {trigger: 'item'},
        legend: {orient : 'vertical', x : "54%",y:20, itemGap:12, itemHeight:14, itemWidth:14, textStyle:{fontSize:12}, data:["中信证券","山东农经开","鲍尔公司","山东海丰国际航运","南方工业资管"]},
        calculable : true,
        series : [
            {   name:'公司股东', type:'pie', center:["27%", 75],radius : ['40%', '75%'], legendHoverLink:true,
                itemStyle : {
                    normal : {
                        label : {show : false},
                        labelLine : {show : false},
                        color: function(params) {
                            // build a color map as your need.
                            return colorList[params.dataIndex]
                        }
                    },

                    emphasis : {label : {show : false}}},
                data:[
                    {value: 62.2, name: "中信证券"},
                    {value: 10, name: "山东农经开"},
                    {value: 10, name: "鲍尔公司"},
                    {value: 10, name: "山东海丰国际航运"},
                    {value: 7.8, name: "南方工业资管"}]
            }]
    };

    myChart.setOption(option2);

    $(".fundCompanyDetailBtn").each(function(index){
        $(this).on("click",function(event){
            $(".fundCompanyDetailBtn").removeClass("selected");
            $(this).addClass("selected");
        })
    });

    $(".managerBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".managerBtn>img").attr("src","images/ListOpenBtn.png");
            $(".managerBtn>img").eq(index).attr("src","images/ListCloseBtn.png");
            $(".managerDisplay").css("display","none");
            $(".managerDisplay").eq(index).css("display","block");
        })
    });


    $(".fundBtn").each(function(index){
        $(this).on("click",function(event){
            event.stopPropagation();
            event.preventDefault();
            $(".fundBtn>img").attr("src","images/ListOpenBtn.png");
            $(".fundBtn>img").eq(index).attr("src","images/ListCloseBtn.png");
            $(".fundDisplay").css("display","none");
            $(".fundDisplay").eq(index).css("display","block");
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


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}