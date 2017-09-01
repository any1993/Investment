//all functions combined

$(function(){
    //定义swiper 以及属性
   
    //观点榜标签页切换
    $("#m_selectBox li").each(function(index){
        $(this).on("touch click tap",function(){
            $("#m_selectBox li").removeClass("select");
            $("#modularpage li.select").removeClass("select");
            $("#modularpage li").eq(index).addClass("select");
            $(this).addClass("select");
        })
    })

    //加载组合榜
    $.ajax({
        type: "GET",
        url:"data/newsdatademo.json",
        dataType: "json", 
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


            var shares_num=document.getElementsByClassName("sharesBox2");
            for(var i=0;i < shares_num.length;i++){
                $(".sharesBox2 .share_name").eq(i).text(obj.shares[i].sharesName);
                $(".sharesBox2 .sharesNum").eq(i).text(obj.shares[i].sharesCode);
                $(".sharesBox2 .shares_price").eq(i).text(obj.shares[i].presentPrice);
                $(".sharesBox2 .UAD").eq(i).text(obj.shares[i].UAD);
                $(".sharesBox2 .shares_percent").eq(i).text(obj.shares[i].percentage);
                $(".sharesBox2 .flexA").eq(i).css("width",obj.shares[i].percentage);
            }

        }
    })


    //加载看涨榜
    $.ajax({
        type: "GET",
        url:"data/newsdatademo.json",
        dataType: "json", 
        success: function (data) {
            var obj = data;
            var bullishlist=document.getElementsByClassName("sharesBox");
            for(var i=0;i < bullishlist.length;i++) {
                $(".sharesBox .name").eq(i).text(obj.bullishlist[i].bullname);
                $(".sharesBox .ratio").eq(i).text(obj.bullishlist[i].ratio);


                //var h=document.documentElement.clientHeight;
                var w=document.documentElement.clientWidth;
                var pn=0;
                if(w >= 356){pn=5;}
                else if(w < 356 && w >= 336){pn=4;}
                else if(w < 336 && w >= 316){pn=3;}
                else if(w < 316 && w >= 300){pn=2;}
                else{pn=0;}

                $(".sharesBox .onrise").eq(i).text(obj.bullishlist[i].view[0].num);
                $(".sharesBox .viewofrise").eq(i).text(obj.bullishlist[i].view[0].viewof);
                var photoamountR =obj.bullishlist[i].view[0].photos.length;
                if(photoamountR > pn){
                    photoamountR=pn;}
                var photolistR = "";
                for(var j=0;j < photoamountR;j++){
                    photolistR += "<img src='"+obj.bullishlist[i].view[0].photos[j].url+"' class='exp_head '>";
                }
                $(".boxR").eq(i).append(photolistR);

                $(".sharesBox .onunchange").eq(i).text(obj.bullishlist[i].view[1].num);
                $(".sharesBox .viewofunchange").eq(i).text(obj.bullishlist[i].view[1].viewof);

                var photoamountU =obj.bullishlist[i].view[1].photos.length;
                if(photoamountU > pn){
                    photoamountU=pn;}
                var photolistU = "";
                for(var k=0;k < photoamountU;k++){
                    photolistU += "<img src='"+obj.bullishlist[i].view[1].photos[k].url+"' class='exp_head '>";
                }
                $(".boxU").eq(i).append(photolistU);

                $(".sharesBox .onfall").eq(i).text(obj.bullishlist[i].view[2].num);
                $(".sharesBox .viewoffall").eq(i).text(obj.bullishlist[i].view[2].viewof);
                var photoamountF=obj.bullishlist[i].view[2].photos.length;
                if(photoamountF > pn){
                    photoamountF=pn;}
                var photolistF = "";
                for(var f=0;f < photoamountF;f++){
                    photolistF += "<img src='"+obj.bullishlist[i].view[2].photos[f].url+"' class='exp_head '>";
                }
                $(".boxF").eq(i).append(photolistF);
            }
        }
    })

    //加载下单榜
    $.ajax({
        type: "GET",
        url:"data/sharesdatademo.json",
        dataType: "json", 
        success: function (data) {
            var obj = data;
            var shareslist=document.getElementsByClassName("sharesBox3");
            for(var i=0;i < shareslist.length;i++) {
                $(".sharesBox3 .name").eq(i).text(obj.shares[i].name);
                $(".sharesBox3 .sharesNum").eq(i).text(obj.shares[i].code);
                $(".sharesBox3 .buyin").eq(i).text(obj.shares[i].buy);
                $(".sharesBox3 .sellout").eq(i).text(obj.shares[i].sell);
                $(".sharesBox3 .price").eq(i).text(obj.shares[i].presentPrice);
                $(".sharesBox3 .raf").eq(i).text(obj.shares[i].raf);

            }
        }
    })
})
