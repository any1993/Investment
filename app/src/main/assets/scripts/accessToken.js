// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var A_userId = 'saner20160620171903';
var A_appSecert = '62b5213fcd3bbef7d50a413c5c5073973c6034e8441e881aed1951d15ce63c8dfb2501ec007d48c494ebd6082c41d76f32e53b6bfdbeed56a8cb811eb2073deb3e241b5f9c07ff2091ec420325d0f8da8afbe5a38c78c7d040c1cb5357fac2a56921f861b82aa6adc2d35efe464599dc634e68c41cd6d56508a08b854a0f3df2';
// var A_appSecert = '7425812abd295629bf5db238a615a11fcb99774657b0a61cb055f156a74a0e77cd18a09bbe79839ffcffdcad6b860d2b8fca5eadd122216973368be0ea974edc0c6f83b720a9ff5a04136043e91680976ba702095001a19a4f8b491a1e929156790eddda515c681d28ed42635b78e83806b2f1d03ccbc026007b0fc711c33b35';
var A_baseApiUrl = "https://api.palaspom.com/";

// var A_tokenExpiresTime = 0;
// localStorage.A_tokenType = "sdsd";
// var A_accessToken = "";
// var A_isAccessTokenSet = false;
// localStorage.clear();
var netStatus;
function IsAuthorized() {
    if (localStorage.A_isAccessTokenSet != undefined && localStorage.A_isAccessTokenSet != "" && localStorage.A_tokenType != undefined && localStorage.A_tokenType != "" && localStorage.A_accessToken != undefined && localStorage.A_accessToken != "" && localStorage.A_tokenExpiresTime != undefined && localStorage.A_tokenExpiresTime != "" && (localStorage.A_tokenExpiresTime > (new Date().getTime() + 600000))) {
        return true;
    }
    else {
        return false;
    }
}

//ajax get 异步机制函数方法

function httpGet(api, parameters, needAuthorized, ajax_success, ajax_fail) {
    var request;
    if ((!needAuthorized) || IsAuthorized() || RequestToken()) {
        if (api.indexOf("http") == 0) {       //传的api是以http开头
            if ((parameters.split("?").length - 1) < 0) {
                api = api + "?";
            }
            else {
                api = api + "&";
            }
            for (var item in parameters) {
                api = api + item + "=" + parameters[item] + "&";
            }
            api = api.substring(0, api.length - 1);
        }
        else {
            api = A_baseApiUrl + api;
        }
        try {
            request = $.ajax({
                type: "get",
                dataType: "json",
                timeout: 10000,
                beforeSend: function (xhr) {
                    if (needAuthorized) {
                        xhr.setRequestHeader("Authorization", localStorage.A_tokenType + ' ' + localStorage.A_accessToken);
                    }
                },
                url: api,
                success: function (data) {
                    ajax_success(data);
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'abort') {
                        ajax_fail('abort');
                    }
                    if (status == 'timeout' || status == 'error') {
                        if (RequestToken()) {
                            request = $.ajax({
                                type: "get",
                                dataType: "json",
                                beforeSend: function (xhr) {
                                    if (needAuthorized) {
                                        xhr.setRequestHeader("Authorization", localStorage.A_tokenType + ' ' + localStorage.A_accessToken);
                                    }
                                },
                                url: api,
                                success: function (data) {
                                    ajax_success(data);
                                },
                                complete: function (XMLHttpRequest, status) {
                                    if (status == "abort") {
                                        ajax_fail('abort');
                                    }
                                    if (status == 'timeout') {
                                        ajax_fail('timeout');
                                    }
                                    if (status == 'error') {
                                        ajax_fail('error');
                                    }
                                }
                            });
                        }
                        else {
                            ajax_fail(netStatus);
                        }
                        return request;
                    }
                }
            });
        }
        catch (err) {
            ajax_fail(netStatus);
        }
    }
    else {
        ajax_fail(netStatus);
    }
    return request;
}

//ajax post同步改成异步

function httpPost(api, parameters, needAuthorized, ajax_success, ajax_fail) {
    if ((!needAuthorized) || IsAuthorized() || RequestToken()) {
        if (api.indexOf("http") == 0) { }
        else {
            api = A_baseApiUrl + api;
        }
        try {
            $.ajax({
                type: "post",
                dataType: "json",
                timeout: 10000,
                data: parameters,
                beforeSend: function (xhr) {
                    if (needAuthorized) {
                        xhr.setRequestHeader("Authorization", localStorage.A_tokenType + ' ' + localStorage.A_accessToken);
                    }
                },
                url: api,
                success: function (data) {
                    ajax_success(data);
                },
                complete: function (XMLHttpRequest, status) {
                    if (status == 'abort') {
                        ajax_fail('abort');
                    }
                    if (status == 'error' || status == 'timeout') {
                        if (RequestToken()) {
                            $.ajax({
                                type: "post",
                                dataType: "json",
                                data: parameters,
                                beforeSend: function (xhr) {
                                    if (needAuthorized) {
                                        xhr.setRequestHeader("Authorization", localStorage.A_tokenType + ' ' + localStorage.A_accessToken);
                                    }
                                },
                                url: api,
                                success: function (data) {
                                    ajax_success(data);
                                },
                                complete: function (XMLHttpRequest, status) {
                                    if (status == "abort") {
                                        ajax_fail('abort');
                                    }
                                    if (status == 'timeout') {
                                        ajax_fail('timeout');
                                    }
                                    if (status == 'error') {
                                        ajax_fail('error');
                                    }
                                }
                            });
                        }
                        else {
                            ajax_fail(netStatus);
                        }
                    }
                }
            });
        }
        catch (err) {
            ajax_fail(netStatus);
        }
    }
    else {
        ajax_fail(netStatus);
    }
}

// function RequestToken() {
//     localStorage.A_isAccessTokenSet = false;
//     var returnData;
//     $.ajax({
//         type: "post",
//         url: "WebApplication1/Ashx/Handler1.ashx",//调用.net写的获取accesstoken
//         data: "",
//         success: function (msg) {
//             if (msg != null && msg != "") {
//                 var obj = eval("(" + msg + ")");
//                 localStorage.A_tokenExpiresTime = new Date().getTime() + (obj.ExpiresIn * 1000);
//                 localStorage.A_tokenType = obj.TokenType;
//                 localStorage.A_accessToken = obj.AccessToken;
//                 localStorage.A_isAccessTokenSet = true;
//                 returnData = true;
//             }
//             else {
//                 returnData = false;
//             }
//         },
//         error: function (e) {
//             returnData = false;
//         }
//     });
//     return returnData;
// }

function RequestToken() {
    localStorage.A_isAccessTokenSet = false;
    var returnData;
    try {
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: "https://api.palaspom.com/Oauth2/Authorize?userId=" + A_userId + "&appSecert=" + A_appSecert,
            success: function (data) {
                if (data != null && data != "") {
                    // A_tokenExpiresTime = new Date().getTime() + (data.ExpiresIn * 1000);
                    // A_tokenType = data.TokenType;
                    // A_accessToken = data.AccessToken;
                    localStorage.A_tokenExpiresTime = new Date().getTime() + (data.ExpiresIn * 1000);
                    localStorage.A_tokenType = data.TokenType;
                    localStorage.A_accessToken = data.AccessToken;
                    localStorage.A_isAccessTokenSet = true;
                    returnData = true;
                }
                else {
                    returnData = false;
                }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'abort') {
                    netStatus = 'abort';
                    returnData = false;
                }
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    netStatus = 'timeout';
                    returnData = false;
                }
                if (status == 'error') {
                    netStatus = 'error';
                    returnData = false;
                }
            }
        });
    }
    catch (err) {
        netStatus = 'error';
        returnData = false;
    }
    return returnData;
}