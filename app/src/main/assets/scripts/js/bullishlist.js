/**
 * Created by aa on 2016/4/21.
 */

$(function(){

        $("#m_selectBox li").each(function(index) {
            $(this).on("touch click tap", function () {
                $("#m_selectBox li").removeClass("select");
                $("#modularpage li.select").removeClass("select");
                $("#modularpage li").eq(index).addClass("select");
                $(this).addClass("select");
            })
        })

    $.ajax({
        type: "GET",
        url:"data/newsdatademo.json",
        async:false,
        success: function (data) {
            var obj = data;
            var bullishlist=document.getElementsByClassName("sharesBox");
            for(var i=0;i<bullishlist.length;i++) {
                $(".sharesBox .name").eq(i).text(obj.bullishlist[i].name);
                $(".sharesBox .ratio").eq(i).text(obj.bullishlist[i].ratio);


                //var h=document.documentElement.clientHeight;
                var w=document.documentElement.clientWidth;
                var pn=0;
                if(w>=356){pn=5;}
                else if(w<356 && w>=336){pn=4;}
                else if(w<336 && w>=316){pn=3;}
                else if(w<316 && w>=300){pn=2;}
                else{pn=0;}

                $(".sharesBox .onrise").eq(i).text(obj.bullishlist[i].view[0].num);
                $(".sharesBox .viewofrise").eq(i).text(obj.bullishlist[i].view[0].viewof);
                var photoamountR =obj.bullishlist[i].view[0].photos.length;
                if(photoamountR>pn){
                    photoamountR=pn;}
                var photolistR = "";
                for(var j=0;j<photoamountR;j++){
                    photolistR += "<img src='"+obj.bullishlist[i].view[0].photos[j].url+"' class='exp_head '>";
                }
                $(".boxR").eq(i).append(photolistR);

                $(".sharesBox .onunchange").eq(i).text(obj.bullishlist[i].view[1].num);
                $(".sharesBox .viewofunchange").eq(i).text(obj.bullishlist[i].view[1].viewof);

                var photoamountU =obj.bullishlist[i].view[1].photos.length;
                if(photoamountU>pn){
                    photoamountU=pn;}
                var photolistU = "";
                for(var k=0;k<photoamountU;k++){
                    photolistU += "<img src='"+obj.bullishlist[i].view[1].photos[k].url+"' class='exp_head '>";
                }
                $(".boxU").eq(i).append(photolistU);

                $(".sharesBox .onfall").eq(i).text(obj.bullishlist[i].view[2].num);
                $(".sharesBox .viewoffall").eq(i).text(obj.bullishlist[i].view[2].viewof);
                var photoamountF=obj.bullishlist[i].view[2].photos.length;
                if(photoamountF>pn){
                    photoamountF=pn;}
                var photolistF = "";
                for(var f=0;f<photoamountF;f++){
                    photolistF += "<img src='"+obj.bullishlist[i].view[2].photos[f].url+"' class='exp_head '>";
                }
                $(".boxF").eq(i).append(photolistF);
            }
        }
    })
})
