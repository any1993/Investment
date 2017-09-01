   function infoHTMLimg() {
    //点击详情页中的图片
    //获取文章全文中图片
    var $img = $("#info-htmltext img");
    imgrray = [];
    textrray = [];
    $img.each(function (i) {
        imgrray = imgrray.concat($img.eq(i).attr("src"));
        textrray = textrray.concat($img.eq(i).attr("title"));
    })
    $img.each(function (i) {
        $img.eq(i).bigic(imgrray, textrray);
    })
}
function infoHTMLimgattr() {
    //img标签外面的info-htmltext的子标签text-indent=0
    var $child = $("#info-htmltext").children();
    $child.each(function (i) {
        if ($(this).find("img").length > 0) {
            $(this).css("text-indent", "0");
        }
    })
    //点击详情页中的图片
    var $img = $("#info-htmltext img");
    $img.each(function (i) {
        $(this).removeAttr("onlick").removeAttr('hspace');
        //改变文章中图片显示大小
        var img = $(this);
        var realWidth;//真实的宽度
        var realHeight;//真实的高度
        //这里做下说明,$("<img/>")这里是创建一个临时的img标签,类似js创建一个new Image()对象！
        $("<img/>").attr("src", $(img).attr("src")).load(function () {
            realWidth = this.width;
            realHeight = this.height;
            //如果真实的宽度大于浏览器的宽度就按照100%显示
            if (realWidth >= 150) {
                $(img).css("width", "100%").css("height", "auto");
                ////alert("大于150宽度");
            }
            else {//如果小于浏览器的宽度按照原尺寸显示
                $(img).css("width", realWidth + 'px').css("height", realHeight + 'px');
                ////alert("小于150宽度");
            }
        });
    })
    //实现文章中内容链接打开在inappbrower，文章中含有img的a标签去掉href
    var $a = $("#info-htmltext a");//不含有img的a标签
    $a.each(function (i) {
        $(this).find("iframe body").removeAttr("href");
        $(this).removeAttr("onlick");
        var href = $(this).attr("href");
        $(this).removeAttr("href");
        $(this).attr("original", href);
        //点击文章详情的a标签在内置浏览器中打开外部链接
        // if ($(this).find("img").length == 0) {
        //     $(this).click(function () {
        //         var original = $(this).attr("original");
        //         window.open(original, '_blank', 'closebuttoncaption=返回,location=yes,toolbarposition=top');
        //     })
        // }
    })
    var $table=$("#info-htmltext"+" table");
    $table.each(function(i){
        if(($(document).width()-40)<$(this).attr("width")){
            $(this).attr("width",$(document).width()-40);
            $(this).css("table-layout","fixed");
        }
    })

}
    //详情页中图片变大显示
    (function ($) {
        $.fn.bigic = function (imgrray, textrray) {
            var nownum = 1;
            var text = "";
            var src = "";
            /*
                * 构造函数 @Bigic
                * 定义基础变量,初始化对象事件
                */
            function Bigic($obj) {
                this.$win = $(window);
                this.$obj = $obj;
                this.$popup,
                this.$img,
                this.nWinWid = 0;
                this.nWinHei = 0;
                this.nImgWid = 0;
                this.nImgHei = 0;
                this.nImgRate = 0;
                this.sImgStatus;
                this.sImgSrc,
                this.bMoveX = true,
                this.bMoveY = true;
                this.init();
            }
            /*
                * 初始化 绑定基础事件
                */
            Bigic.prototype.init = function () {
                var oThis = this,
                    timer = null;
                // 为图片绑定点击事件
                this.$obj.off('.bigic').on('click.bigic', function () {
                    var sTagName = this.tagName.toLowerCase();
                    if (sTagName == 'img') {
                        // 更新基础变量
                        oThis.sImgSrc = this.getAttribute('src');
                        oThis.sImgStatus = 'min';
                        // 显示弹窗
                        oThis.show();
                    } else {
                        //alert('非IMG标签');
                    }
                });
                // 浏览器缩放
                this.$win.off('.bigic').on('resize.bigic', function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        oThis.zoom();
                    }, 30);
                });
            }
            /*
                * 弹窗初始化
                */
            Bigic.prototype.show = function () {
                var oThis = this,
                    oImg = new Image();
                oThis.popup();   // 显示弹窗
                // 图片加载
                oImg.onload = function () {
                    oThis.nImgWid = this.width;
                    oThis.nImgHei = this.height;
                    oThis.nImgRate = oThis.nImgWid / oThis.nImgHei;
                    var height = oThis.nImgHei / 2;
                    //$('#LoadingBigic').remove();
                    oThis.$popup.append('<img id="imgBigic" class="img-bigic" src="' + oThis.sImgSrc + '" />');
                    for (var i = 0; i < imgrray.length; i++) {
                        if (imgrray[i] == $("#imgBigic").attr('src')) {
                            nownum = i + 1;
                            text = textrray[i];
                        }
                    }
                    oThis.$popup.append('<div id="text" class="img-bigic" style="bottom:50%; width:100%; z-index:1; text-align:center;margin-bottom:' + height + 'px"></div>');
                    oThis.$popup.append('<div id="imgnum" class="img-bigic" style="left:50%; top:50%; width:100px; margin-left:-50px; z-index:1; text-align:center;margin-top:' + height + 'px">' + nownum + '/' + imgrray.length + '</div>');
                    oThis.$img = $('#imgBigic');
                    oThis.zoom();
                    var Iheight = $("#imgBigic").css("height");
                    Iheight = Iheight.substring(0, Iheight.length - 2)
                    Iheight = Iheight / 2;
                    $("#text").css("margin-bottom", Iheight + "px").html(text);
                    $("#imgnum").css("margin-top", Iheight + "px");
                }
                oImg.src = oThis.sImgSrc;
            }

            Bigic.prototype.aginshow = function () {
                ////alert("aginshow");
                var oThis = this,
                    oImg = new Image();

                //oThis.popup();   // 显示弹窗

                // 图片加载

                oImg.onload = function () {
                    oThis.nImgWid = this.width;
                    oThis.nImgHei = this.height;
                    oThis.nImgRate = oThis.nImgWid / oThis.nImgHei;
                    var height = oThis.nImgHei / 2;
                    //$("#imgnum").css("margin-top", height + "px");
                    oThis.zoom();
                    var Iheight = $("#imgBigic").css("height");
                    Iheight = Iheight.substring(0, Iheight.length - 2)
                    Iheight = Iheight / 2;
                    $("#text").css("margin-bottom", Iheight + "px").html(text);
                    $("#imgnum").css("margin-top", Iheight + "px");
                }
                oImg.src = oThis.sImgSrc;
            }
            /*
                * 弹窗显示 及相关控件事件绑定
                */
            var startX3, startY3, endX3, endY3;
            Bigic.prototype.popup = function () {
                var sHtml = '',
                    oThis = this;
                // 生成HTML 选中DOM节点
                sHtml += '<div id="popupBigic" class="popup-bigic" style="width:' + this.nWinWid + 'px;height:' + this.nWinHei + 'px;">'
                        + '<div class="option-bigic">'
                        + '<span id="changeBigic" class="change-bigic min-bigic" state-bigic="min">放大</span>'
                        + '<span id="closeBigic" class="close-bigic">关闭</span>'
                        + '</div>'
                        //+ '<img id="LoadingBigic" class="loading-bigic" src="preloader.gif" />'
                        + '</div>';
                xx = $(document).scrollLeft();
                yy = $(document).scrollTop();
                $('#app-info').addClass('Page');
                $('body').append(sHtml);
                oThis.$popup = $('#popupBigic');
                document.getElementById("popupBigic").addEventListener("touchstart", touchStart3, false);
                document.getElementById("popupBigic").addEventListener("touchmove", touchMove3, false);
                document.getElementById("popupBigic").addEventListener("touchend", touchEnd3, false);
                function touchStart3(event) {
                    startX3 = 0, endX3 = 0, startY3 = 0, endY3 = 0;
                    var touch = event.touches[0];
                    startY3 = touch.pageY;
                    startX3 = touch.pageX;
                }
                function touchMove3(event) {
                    var touch = event.touches[0];
                    endX3 = touch.pageX;
                    endY3 = touch.pageY;
                }
                function touchEnd3(event) {
                    //$("#text").html('"X的差值："' + (startX3 - endX3) + ' &&  ' + '"Y的差值：" '+ Math.abs(startY3 - endY3));
                    if (((startX3 - endX3) > 40) && ((startX3 - endX3) > Math.abs(startY3 - endY3))) {
                        if (imgrray[imgrray.length - 1] != $("#imgBigic").attr('src')) {
                            for (var i = 0; i < imgrray.length - 1; i++) {
                                if (imgrray[i] == $("#imgBigic").attr('src')) {
                                    src = imgrray[i + 1];
                                    text = textrray[i + 1];
                                    nownum = i + 2;
                                }
                            }
                            $("#imgBigic").attr('src', src);
                            if (text == null) {
                                $("#text").html("");
                            }
                            else {
                                $("#text").html(text);
                            }
                            $("#imgnum").html(nownum + "/" + imgrray.length);
                            oThis.sImgSrc = src;
                            oThis.aginshow();
                        }
                    }
                    else
                        if (((endX3 - startX3) > 40) && ((endX3 - startX3) > Math.abs(startY3 - endY3))) {
                            if (imgrray[0] != $("#imgBigic").attr('src')) {
                                for (var i = 1; i < imgrray.length; i++) {
                                    if (imgrray[i] == $("#imgBigic").attr('src')) {
                                        src = imgrray[i - 1];
                                        text = textrray[i - 1];
                                        nownum = i;
                                    }
                                }
                                $("#imgBigic").attr('src', src);
                                if (text == null) {
                                    $("#text").html("");
                                }
                                else {
                                    $("#text").html(text);
                                }
                                $("#imgnum").html(nownum + "/" + imgrray.length);
                                oThis.sImgSrc = src;
                                oThis.aginshow();
                            }
                        }
                }
                $('#popupBigic').each(function () {
                    new RTP.PinchZoom($(this), {});
                    $(".pinch-zoom-container").css("min-height", $(window).height() + "px");
                });
                // 事件绑定 - 关闭弹窗
                $('#popupBigic').off().on('click', function () {
                    $(".pinch-zoom-container").fadeTo("normal", 0, function () {
                        $('.pinch-zoom-container').remove();
                        $('#app-info').removeClass('Page');
                        window.scroll(xx, yy);
                    });
                });
                $('#changeBigic').off().on('click', function () {
                    if (!document.getElementById('imgBigic')) return;
                    if ($(this).hasClass('min-bigic')) {
                        oThis.sImgStatus = 'max';
                        $(this).removeClass('min-bigic').addClass('max-bigic').html('缩小');
                    } else {
                        oThis.sImgStatus = 'min';
                        $(this).removeClass('max-bigic').addClass('min-bigic').html('放大');;
                    }
                    oThis.zoom();
                });
            }
            /*
                * 图片放大缩小控制函数
                */
            Bigic.prototype.zoom = function () {
                var nWid = 0, cnHei = 0,
                    nLeft = 0, nTop = 0,
                    nMal = 0, nMat = 0;
                // 弹窗未打开 或 非img 返回
                if (!document.getElementById('popupBigic') || !this.nImgWid) return;
                this.nWinWid = this.$win.width();
                this.nWinHei = this.$win.height();
                this.bMoveX = true;
                this.bMoveY = true;
                // 显示隐藏放大缩小按钮
                if (this.nImgWid > this.nWinWid || this.nImgHei > this.nWinHei) {
                    $('#changeBigic')[0].style.display = 'inline-block';
                } else {
                    $('#changeBigic')[0].style.display = 'none';
                }
                if (this.sImgStatus == 'min') {
                    nWid = this.nImgWid > this.nWinWid ? this.nWinWid : this.nImgWid;
                    nHei = nWid / this.nImgRate;
                    if (nHei > this.nWinHei) nHei = this.nWinHei;
                    nWid = nHei * this.nImgRate;
                    this.$img.css({ 'width': nWid + 'px', 'height': nHei + 'px', 'left': '50%', 'top': '50%', 'margin-top': -nHei / 2 + 'px', 'margin-left': -nWid / 2 + 'px' });
                    this.$popup.css({ 'width': this.nWinWid + 'px', 'height': this.nWinHei + 'px' });
                    this.move(false);
                } else {
                    if (this.nImgWid < this.nWinWid) {
                        nLeft = '50%'
                        nMal = this.nImgWid / 2;
                        this.bMoveX = false;
                    }
                    if (this.nImgHei < this.nWinHei) {
                        nTop = '50%'
                        nMat = this.nImgHei / 2;
                        this.bMoveY = false;
                    }
                    this.$img.css({ 'width': this.nImgWid + 'px', 'height': this.nImgHei + 'px', 'left': nLeft, 'top': nTop, 'margin-top': -nMat + 'px', 'margin-left': -nMal + 'px' });
                    this.$popup.css({ 'width': this.nWinWid + 'px', 'height': this.nWinHei + 'px' });
                    this.move(true);
                }
            }
            /*
                * 图片移动事件
                */
            Bigic.prototype.move = function (bln) {
                var _x, _y, _winW, _winH,
                    _move = false,
                    _boxW = this.nImgWid,
                    _boxH = this.nImgHei,
                    oThis = this;
                if (!oThis.$img) return;
                // 解除绑定
                if (!bln) {
                    oThis.$img.off('.bigic');
                    $(document).off('.bigic');
                    return;
                }
                // 弹窗移动
                oThis.$img.off('.bigic').on({
                    'click.bigic': function (e) {
                        e.preventDefault();
                    },
                    'mousedown.bigic': function (e) {
                        e.preventDefault();
                        _move = true;
                        _x = e.pageX - parseInt(oThis.$img.css("left"));
                        _y = e.pageY - parseInt(oThis.$img.css("top"));
                        _winW = oThis.nWinWid;
                        _winH = oThis.nWinHei;
                        oThis.$img.css('cursor', 'move');
                    }
                });
                $(document).off('.bigic').on({
                    'mousemove.bigic': function (e) {
                        e.preventDefault();
                        if (_move) {
                            var x = e.pageX - _x;
                            var y = e.pageY - _y;
                            if (x > 0) x = 0;
                            if (y > 0) y = 0;
                            if (_winW && x < _winW - _boxW) x = _winW - _boxW;
                            if (_winH && y < _winH - _boxH) y = _winH - _boxH;
                            if (oThis.bMoveX) oThis.$img[0].style.left = x + 'px';
                            if (oThis.bMoveY) oThis.$img[0].style.top = y + 'px';
                        }
                    },
                    'mouseup.bigic': function () {
                        _move = false;
                        oThis.$img.css('cursor', 'default');
                    }
                });
            }
            /*
                * 实例化
                */
            new Bigic($(this));
        };
    })(jQuery);
    