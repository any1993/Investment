/**
 * Created by Kris on 2017/2/27.
 */


var ItemId = GetQueryString("itemId");

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
        url: "https://api.palaspom.com/Investment/ProductHeavilyHeld?productID="+ItemId,
        dataType:'json',
        success: function (data) {
            console.log(data);
        },
        error:function(e){
            console.log(e);
            //alert("error:"+e);
        }
    });

    //var myChart = echarts.init(document.getElementById('fundHeavilyChart01'));
    //var myChart02 = echarts.init(document.getElementById('fundHeavilyChart02'));
    var option2 = {
        tooltip : {trigger: 'item'},
        legend: {orient : 'vertical', x : "64%",y:20, itemGap:15, itemHeight:14, itemWidth:14, textStyle:{fontSize:12}, data:["股票","现金","债券","其他资产"]},
        calculable : true,
        series : [
            {   name:'资产配置', type:'pie', center:["35%", 75],radius : ['40%', '70%'], legendHoverLink:true,
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
                    {value: 87.32, name: "股票"},
                    {value: 7.81, name: "现金"},
                    {value: 3.99, name: "债券"},
                    {value: 0.89, name: "其他资产"}]
            }]
    };

    var option3 = {
        tooltip : {trigger: 'item'},

        legend: {
            orient : 'vertical', x : "50%",y:20,
            grid:{x:0,y:0,x2:0,y2:0},
            itemGap:10, itemHeight:12, itemWidth:12, textStyle:{fontSize:12},
            data:[
                "制造业",
                "信息技术服务业",
                "金融业",
                "批发和零售业",
                "房地产业",
                "采矿业",
                "农林牧渔业",
                "文化、体育和娱乐业",
                "公共设施管理业",
                "租赁和商务服务费"
            ]
        },
        calculable : true,
        series : [
            {   name:'资产配置', type:'pie', center:["25%", 75],radius : ['20%', '40%'], legendHoverLink:true,
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
                    {value: 51.44, name: "制造业"},
                    {value: 7.83, name: "信息技术服务业"},
                    {value: 6.30, name: "金融业"},
                    {value: 5.61, name: "批发和零售业"},
                    {value: 4.87, name: "房地产业"},
                    {value: 2.45, name: "采矿业"},
                    {value: 2.44, name: "农林牧渔业"},
                    {value: 1.93, name: "文化、体育和娱乐业"},
                    {value: 1.72, name: "公共设施管理业"},
                    {value: 1.60, name: "租赁和商务服务费"}
                ]
            }]
    };


    //myChart.setOption(option2);
    //myChart02.setOption(option3);

    $("#fundArchives").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='informationPage01P1_FundArchives.html';
        //$(".choiceIcon").attr("src","images/choiceUN.png");
        //$(this).attr("src","images/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $("#fundCompany").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='informationPage03_FundCompanyDetails.html';
        //$(".choiceIcon").attr("src","images/choiceUN.png");
        //$(this).attr("src","images/chosen.png");
        //$(".explain").eq(index).css("color","#999999");
        //$(".explain").eq(index).css("borderColor","#999999");

    });

    $("#fundCost").on("click",function(event){
        event.stopPropagation();
        event.preventDefault();
        window.location.href ='informationPage01P2_FundCost.html';
        //$(".choiceIcon").attr("src","images/choiceUN.png");
        //$(this).attr("src","images/chosen.png");
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

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}