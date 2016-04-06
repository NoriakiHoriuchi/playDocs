(function() {
  chrome.browserAction.onClicked.addListener(function() {
    window.open("https://playframework.com/documentation/2.5.x/Home");
  });
}).call(this);