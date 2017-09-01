/**
 * Created by aa on 2016/4/21.
 */


$(function(){

    $.ajax({
        type: "GET",
        url:"data/sharesdatademo.json",
        dataType: "json",
        success: function (data) {
            var obj = data;
            var shareslist=document.getElementsByClassName("sharesBox2");
            for(var i=0;i < shareslist.length;i++) {
                $(".sharesBox2 .name").eq(i).text(obj.shares[i].name);
                $(".sharesBox2 .sharesNum").eq(i).text(obj.shares[i].code);
                $(".sharesBox2 .buyin").eq(i).text(obj.shares[i].buy);
                $(".sharesBox2 .sellout").eq(i).text(obj.shares[i].sell);
                $(".sharesBox2 .price").eq(i).text(obj.shares[i].presentPrice);
                $(".sharesBox2 .raf").eq(i).text(obj.shares[i].raf);

            }
        }
    })
})
