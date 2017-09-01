// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


//用来对整体app的返回，通过localStorage记录app的所有路径
function AddGoback(url, url1) {
    localStorage.N_scrollTop = $(window).scrollTop();
    if (panduan(localStorage.G_back)) {
        localStorage.N_url = url1;
        var GbackAttr = JSON.parse(localStorage.G_back);
        GbackAttr.push(url);
        localStorage.G_back = JSON.stringify(GbackAttr);
        window.location.href = url1;
    }
    else {
        localStorage.N_url = url1;
        var GbackAttr = [];
        GbackAttr.push(url);
        localStorage.G_back = JSON.stringify(GbackAttr);
        window.location.href = url1;
    }
}
function Gotoback() {
    if (panduan(localStorage.G_back)) {
        var GbackAttr = JSON.parse(localStorage.G_back);
        var back_url = GbackAttr.pop();
        localStorage.G_back = JSON.stringify(GbackAttr);
        localStorage.N_url = back_url;
        window.location.href = back_url;
    }
    else {
        window.location.href = 'index.html';
    }
}
function ClearGoback() {
    localStorage.G_back = "";
    localStorage.N_url = "";
}

//判断是否为空或者不存在
function panduan(obj) {
    if (obj !== undefined && obj !== null && obj !== "null" && obj !== "" && obj !== "undefined") {
        return true;
    }
    else {
        return false;
    }
}
