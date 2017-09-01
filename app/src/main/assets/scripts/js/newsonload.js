/**
 * Created by aa on 2016/4/21.
 */

$(function(){

    $.ajax({
        type: "GET",
        url:"data/newsdatademo.json",
        dataType: "json",
        async:false,
        success: function (data) {
            var obj = data;
            var exp_num=document.getElementsByClassName("sharesBox1");
            for(var i=0;i < exp_num.length;i++){
                $(".sharesBox1 img").eq(i).attr("src",obj.experts[i].photoUrl);
                $(".sharesBox1 .nameA").eq(i).text(obj.experts[i].name);
                $(".comefrom").eq(i).text(obj.experts[i].from);
                $(".articleTitle").eq(i).text(obj.experts[i].articleTitle);
                $(".week_percent").eq(i).text(obj.experts[i].weeklyProfit);
            }
            var shares_num=15;
            for(var i=0;i < shares_num;i++){
                $(".sharesBox2 .share_name").eq(i).text(obj.shares[i].sharesName);
                $(".sharesBox2 .sharesNum").eq(i).text(obj.shares[i].sharesCode);
                $(".sharesBox2 .shares_price").eq(i).text(obj.shares[i].presentPrice);
                $(".sharesBox2 .UAD").eq(i).text(obj.shares[i].UAD);
                $(".sharesBox2 .shares_percent").eq(i).text(obj.shares[i].percentage);
                $(".sharesBox2 .flexA").eq(i).css("width",obj.shares[i].percentage);
            }



        }
    })
})
