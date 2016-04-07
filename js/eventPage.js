(function() {
  function insertStr(str, index, insert) {
    return str.slice(0, index) + insert + str.slice(index, str.length);
  }
  chrome.browserAction.onClicked.addListener(function() {
    var latestVersion = "2.5.x";
    var latestJaVersion = "2.4.x";
    function isActive(tab) {
      return tab.active === true
    }
    function isOnPlay(url) {
      var index = url.indexOf("https://playframework.com/documentation/");
      return index !== -1;
    }
    function isJapanese(url) {
      return url.indexOf("/ja/") !== -1
    }
    function currentVersion(url) {
      function currentEnVersion(enUrl) {
        return enUrl.substr(40, 5);
      }
      function currentJaVersion(jaUrl) {
        return jaUrl.substr(43, 5);
      }
      if (isJapanese(url)) {
        return currentJaVersion(url)
      } else {
        return currentEnVersion(url)
      }
    }
    function isLatest(url) {
      if (isJapanese(url)) {
        return currentVersion(url) === latestJaVersion
      } else {
        return currentVersion(url) === latestVersion
      }
    }
    function toVersion(url, version) {
      var current = currentVersion(url);
      return url.replace(current, version)
    }
    function toLatest(url) {
      if (isJapanese(url)) {
        return toVersion(url, latestJaVersion)
      } else {
        return toVersion(url, latestVersion)
      }
    }
    function toJapanese(url) {
      if (isJapanese(url)) {
        return url
      } else {
        return insertStr(url, 40, "ja/")
      }
    }
    function toEnglish(url) {
      if (isJapanese(url)) {
        return url.replace("ja/", "")
      } else {
        return url
      }
    }
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      var tab = tabs.find(isActive);
      var url = tab.url;
      if (isOnPlay(url)) {
        if (isLatest(url)) {
          if (isJapanese(url)) {
            var latestEnglishUrl = toLatest(toEnglish(url));
            chrome.tabs.update(tab.id, {url: latestEnglishUrl});
          } else {
            var latestJapaneseUrl = toLatest(toJapanese(url));
            chrome.tabs.update(tab.id, {url: latestJapaneseUrl});
          }
        } else {
          var latestUrl = toLatest(url);
          chrome.tabs.update(tab.id, {url: latestUrl});
        }
      } else {
        window.open("https://playframework.com/documentation/2.5.x/Home");
      }
    });
  });
}).call(this);