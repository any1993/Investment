//文章详情页js文件
var nullu = "", NowVerision = "2.0", UserID = "br_1091827413";
var topicID = GetQueryString("topicID");
var db;
var UserStatus = "unlogin";//用户登录状态，unlogin:未登录 ，login:登录
var Special_ArticleType = [];
$(function () {
    Touch();
    bind_info();
})
function Touch() {
    touchback();
    //返回按钮
    $("#icon-back").bind("click", function () {
        Gotoback();
    });

    $("#url_close").bind("click", function () {
        $("#url_blank,#urlApp").remove();
    })
}
//获取URL的字段
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//从前端数据库或者服务器去取数据
function bind_info() {
    //个股信息api
    httpGet("Reader/GetTopicItem?topicID=" + topicID, "", true, ajax_success1, ajax_fail1);
    function ajax_success1(obj) {
        if (obj != null && obj != "" && obj != undefined) {
            $('#loading').addClass('Page');
            $('#special_html').removeClass('Page');
            $("#icon_dot").html('<img src="images/icon_dot_red.png" />');
            if (obj.SpecialPicture.length > 0) {
                $("#specialImg").append('<img src="http://www.taikorcdn.com/' + obj.SpecialPicture[0] + '" />');
            }
            $("#specialTitle").html(obj.HeatTopicName);
            $("#specilText").html(obj.Content);
            $("#BK_Title").html(obj.BK_Title);
            $("#BK_Text").html(obj.BK_Content);
            $("#specialVideo").html(obj.SpecialVideo[0]);
            if (obj.SpecialPicture.length > 1) {
                if (obj.SpecialPicture.length == 2) {
                    $("#specialImgAll").append('<div style="width:100%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[1] + '"/></div>');
                }
                else {
                    if (obj.SpecialPicture.length == 3) {
                        for (var i = 1; i < obj.SpecialPicture.length; i++) {
                            $("#specialImgAll").append('<div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[i] + '"/></div>');
                        }
                    }
                    else {
                        if (obj.SpecialPicture.length == 4) {
                            $("#specialImgAll").append('<div style="width:100%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[1] + '"/></div>');
                            $("#specialImgAll").append('<div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[2] + '"/></div>');
                            $("#specialImgAll").append('<div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[3] + '"/></div>')
                        }
                        else {
                            if (obj.SpecialPicture.length == 5) {
                                $("#specialImgAll").append('<div style="width:100%;"><div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[1] + '"/></div><div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[2] + '"/></div><div class="clear"></div></div>');
                                $("#specialImgAll").append('<div style="width:100%;"><div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[3] + '"/></div><div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[4] + '"/></div><div class="clear"></div></div>');
                            }
                            else {
                                if (obj.SpecialPicture.length == 6) {
                                    $("#specialImgAll").append('<div style="width:100%;"><div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[1] + '"/></div><div style="width:50%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[2] + '"/></div><div class="clear"></div></div>');
                                    $("#specialImgAll").append('<div style="width:100%;"><div style="width:33.33%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[3] + '"/></div><div style="width:33.33%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[4] + '"/></div><div style="width:33.33%;" class="specialImgCover"><img src="http://www.taikorcdn.com/' + obj.SpecialPicture[5] + '"/></div><div class="clear"></div></div>');
                                }
                            }
                        }
                    }
                }
                $("#specialImgAll").append('<div class="clear"></div>');
            }
            else {
                $("#specialImgAll").addClass("Page");
            }
            if (obj.TopicArticle.length > 0) {
                //将主题的TopicArticle的分类保存到数组中
                for (var i = 0; i < obj.TopicArticle.length; i++) {
                    if (i == 0 || obj.TopicArticle[i].ArticleType != obj.TopicArticle[i - 1].ArticleType) {
                        Special_ArticleType.push(obj.TopicArticle[i].ArticleType);
                    }
                }
                //通过判断在哪个数组中填写分类前面的类似1/3
                for (var i = 0; i < obj.TopicArticle.length; i++) {
                    if (i == 0 || obj.TopicArticle[i].ArticleType != obj.TopicArticle[i - 1].ArticleType) {
                        // Special_ArticleType.push(obj.TopicArticle[i].ArticleType);
                        for (var j = 0; j < Special_ArticleType.length; j++) {
                            if (obj.TopicArticle[i].ArticleType == Special_ArticleType[j]) {
                                break;
                            }
                        }
                        $("#topicArticle").append('<div class="topicType_Title"><span class="specialNumber">' + (j + 1) + "</span><span>/" + Special_ArticleType.length + '</span><span style="margin-left:5px;">' + obj.TopicArticle[i].ArticleType + '</span></div>');
                        $("#topicArticle").append('<div id="' + obj.TopicArticle[i].ItemID + '" style="position:relative"><div class="topicType_Text"><div class="topicType_Text_Title">' + obj.TopicArticle[i].Title + '</div><div class="topicType_Text_Img"><img src="http://www.taikorcdn.com/reader/' + obj.TopicArticle[i].ArticlePicture + '"/></div></div></div>');
                        bind_indexlist(obj.TopicArticle[i].ItemID);
                    }
                    else {
                        $("#topicArticle").append('<div id="' + obj.TopicArticle[i].ItemID + '" style="position:relative"><div class="topicType_Text topicType_Text_border"><div class="topicType_Text_Title">' + obj.TopicArticle[i].Title + '</div><div class="topicType_Text_Img"><img src="http://www.taikorcdn.com/reader/' + obj.TopicArticle[i].ArticlePicture + '"/></div></div></div>');
                        bind_indexlist(obj.TopicArticle[i].ItemID);
                    }
                }
            }
        }
    }
    function ajax_fail1(obj) {
        //获取股票失败
    }
}
//绑定主题相关文章点击
function bind_indexlist(id) {
    $('#' + id).bind("click", function () {
        AddGoback(localStorage.N_url, 'newsInfo.html?itemid=' + id + '&newsType=1');
        // window.location.href = 'newsInfo.html?itemid=' + id + '&newsType=1&fromPage=HeatTopic&HeatTopicID=' + topicID;
    })
}
//手指滑动返回上一个页面
function touchback() {
    var screenWidth = document.documentElement.clientWidth;
    var yScrolls, yScrolle;
    $("body").on("touchstart", function (e) {
        yScrolls = self.pageYOffset;
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("body").on("touchend", function (e) {
        yScrolle = self.pageYOffset;
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        // $("#info-htmltext").prepend("yScrolls："+yScrolls+" && "+"yScrolle："+yScrolle);
        if (yScrolls == yScrolle && Math.abs(X) > Math.abs(Y) && Math.abs(Y) < 40 && (X > 30 || startX < 10)) {
            Gotoback();
        }
    });
}