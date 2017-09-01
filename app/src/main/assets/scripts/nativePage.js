//幻灯片切换
function slide(direction, color, slowdownfactor, hrf) {
  if (!hrf) {
    setTimeout(function () {
      // update the page inside this timeout
    }, 20);
  }
  // not passing in options makes the plugin fall back to the defaults defined in the JS API
  var theOptions = {
    'direction': direction,
    'duration': 200,
    'slowdownfactor': slowdownfactor,
    'href': hrf,
    'fixedPixelsTop': 0, // optional, the number of pixels of your fixed header, default 0 (iOS and Android)
    'fixedPixelsBottom': 0  // optional, the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  };
  if (device.platform == "Android") {//安卓的手机页面跳转模式更改
    window.location.href = '' + hrf + '';
  }
  else {
    window.plugins.nativepagetransitions.slide(
      theOptions,
      function () {
        console.log('------------------- slide transition finished');
      },
      function (msg) {
        alert('error: ' + msg);
      });
  }
}

function drawer(action, origin, color, href) {
  // not passing in options makes the plugin fall back to the defaults defined in the JS API
  window.plugins.nativepagetransitions.drawer({
    'action': action,
    'origin': origin,
    'duration': 350,
    'href': href
  },
    function () {
      console.log('------------------- drawer transition finished');
    },
    function (msg) {
      alert('error: ' + msg);
    });
}
//幻灯片切换
function slideQuick(direction, color, slowdownfactor, hrf) {
  if (!hrf) {
    setTimeout(function () {
      // update the page inside this timeout
    }, 20);
  }
  // not passing in options makes the plugin fall back to the defaults defined in the JS API
  var theOptions = {
    'direction': direction,
    'duration': 200,
    'slowdownfactor': slowdownfactor,
    'href': hrf,
    'fixedPixelsTop': 0, // optional, the number of pixels of your fixed header, default 0 (iOS and Android)
    'fixedPixelsBottom': 0  // optional, the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  };
  if (device.platform == "Android") {//安卓的手机页面跳转模式更改
    window.location.href = '' + hrf + '';
  }
  else {
    window.plugins.nativepagetransitions.slide(
      theOptions,
      function () {
        console.log('------------------- slide transition finished');
      },
      function (msg) {
        alert('error: ' + msg);
      });
  }
}