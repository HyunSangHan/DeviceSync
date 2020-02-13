'use strict'

let isSyncOn = false;
let prevDesktopURL = null;
let sidebarTabId = null;

whale.sidebarAction.onClicked.addListener(result => {
  isSyncOn = result.opened;
  toggleBadge(isSyncOn);
  
  if (isSyncOn) {
    whale.tabs.getSelected(null, tab => {
      const targetURL = tab.url;
      const customizedURL = customizeURL(targetURL, null);
      whale.sidebarAction.show({ url: customizedURL + "#is_triggered_by_tab#", reload: false });
    });
  }
  return
});

whale.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (isSyncOn) {
    const { isFromSidebar, currentURL, isFromSyncApp } = message;
    const targetURL = currentURL.split("#is_triggered_by_tab#")[0];
    const customizedURL = customizeURL(targetURL, isFromSidebar);
    const isTriggeredByTab = currentURL.split("#is_triggered_by_tab#")[1] === "";
    const isURLChanged = prevDesktopURL !== customizedURL;

    if (isFromSyncApp && isFromSidebar && !sidebarTabId) {
      sidebarTabId = sender.tab.id;
    };

    const isBrowserSyncRequest = sidebarTabId === sender.tab.id;
    const isAsyncDone = true;
    sendResponse({ isBrowserSyncRequest, isAsyncDone });
    
    if (isURLChanged) {
      if (isBrowserSyncRequest && isFromSidebar && !isTriggeredByTab) {
        // View on active tab(Desktop)
        prevDesktopURL = customizedURL;
        whale.tabs.update({ url: customizedURL, active: true });
      } else if (!isFromSidebar) {
        // View on sidebar(Mobile)
        prevDesktopURL = targetURL;
        whale.sidebarAction.show({ url: customizedURL + "#is_triggered_by_tab#", reload: false });
      };
    };
  }
  return
});

whale.tabs.onUpdated.addListener((tabId, { url }, tab) => {
  if (isSyncOn) {
    const customizedURL = customizeURL(url, null);
    prevDesktopURL = url;

    if (url !== undefined) {
      whale.sidebarAction.show({ url: customizedURL + "#is_triggered_by_tab#", reload: false });
    }
  }
  return
});

const toggleBadge = isSyncOn => {
  if (isSyncOn) {
    whale.sidebarAction.setTitle({
      title: `Browser Sync 켜짐`
    });
    whale.sidebarAction.setBadgeText({text: "ON"});
    whale.sidebarAction.setBadgeBackgroundColor({
      color: `#ff0000`
    });
  } else {
    whale.sidebarAction.setTitle({
      title: `Browser Sync 꺼짐`
    });
    whale.sidebarAction.setBadgeText({text: "OFF"});
    whale.sidebarAction.setBadgeBackgroundColor({
      color: `#aaaaaa`
    });
  }
  return
}

const serviceDomains = {
  "naver" : {
    "desktopHost" : "www.naver.com",
    "mobileHost" : "m.naver.com",
    "desktop" : "www.naver.com",
    "mobile" : "m.naver.com"
  },
  "naversearch" : {
    "desktopHost" : "search.naver.com",
    "mobileHost" : "m.search.naver.com",
    "desktop" : "search.naver.com",
    "mobile" : "m.search.naver.com"
  },
  "navershoppingsearch" : {
    "desktopHost" : "search.shopping.naver.com",
    "mobileHost" : "msearch.shopping.naver.com",
    "desktop" : "search.shopping.naver.com/search/all.nhn",
    "mobile" : "msearch.shopping.naver.com/search/all"
  },
  "naverplace" : {
    "desktopHost" : "store.naver.com",
    "mobileHost" : "m.place.naver.com",
    "desktop" : "store.naver.com/restaurants/detail?id=",
    "mobile" : "m.place.naver.com/restaurant/"
  },
  "naverreservation" : {
    "desktopHost" : "booking.naver.com",
    "mobileHost" : "m.booking.naver.com",
    "desktop" : "booking.naver.com",
    "mobile" : "m.booking.naver.com"
  },
  "naverblog" : {
    "desktopHost" : "blog.naver.com",
    "mobileHost" : "m.blog.naver.com",
    "desktop" : "blog.naver.com",
    "mobile" : "m.blog.naver.com"
  },
  "naverqna" : {
    "desktopHost" : "kin.naver.com",
    "mobileHost" : "m.kin.naver.com",
    "desktop" : "kin.naver.com",
    "mobile" : "m.kin.naver.com/mobile"
  },
  "naverpay" : {
    "desktopHost" : "order.pay.naver.com",
    "mobileHost" : "m.pay.naver.com",
    "desktop" : "order.pay.naver.com",
    "mobile" : "m.pay.naver.com/o"
  },
  "daum" : {
    "desktopHost" : "www.daum.net",
    "mobileHost" : "m.daum.net",
    "desktop" : "www.daum.net",
    "mobile" : "m.daum.net"
  },
  "daumsearch" : {
    "desktopHost" : "search.daum.net",
    "mobileHost" : "m.search.daum.net",
    "desktop" : "search.daum.net",
    "mobile" : "m.search.daum.net"
  },
  "coupang" : {
    "desktopHost" : "www.coupang.com",
    "mobileHost" : "m.coupang.com",
    "desktop" : "www.coupang.com",
    "mobile" : "m.coupang.com"
  },
  "facebook" : {
    "desktopHost" : "www.facebook.com",
    "mobileHost" : "m.facebook.com",
    "desktop" : "www.facebook.com",
    "mobile" : "m.facebook.com"
  },
  "youtube" : {
    "desktopHost" : "www.youtube.com",
    "mobileHost" : "m.youtube.com",
    "desktop" : "www.youtube.com",
    "mobile" : "m.youtube.com"
  }
}

const parseURL = url => {
  if (url) {
    const parsedHost = url.split("/")[2];
    for (const service in serviceDomains) {
      if (serviceDomains[service]["desktopHost"] === parsedHost) return [service, "desktop", "mobile"]; // from desktop to mobile
      if (serviceDomains[service]["mobileHost"] == parsedHost) return [service, "mobile", "desktop"]; // from mobile to desktop
    }
  }
  return
}

const customizeURL = (url, isFromSidebar) => {
  const parsedURLInfo = parseURL(url);
  let replacedURL = url;
  if (parsedURLInfo) {
    const [service, from, to] = parsedURLInfo;
    if (isFromSidebar && to === "mobile") {
      replacedURL = url;
    } else if (!isFromSidebar && to === "desktop") { 
      replacedURL = url;
    } else if (service === "naverblog" && to === "desktop") { 
      const blogMobileURL = url.replace(serviceDomains[service][from], serviceDomains[service][to]).split("&proxyReferer=")[1];
      replacedURL = url.replace(serviceDomains[service][from], serviceDomains[service][to]);
      blogMobileURL && ( replacedURL = decodeURIComponent(blogMobileURL) );
    } else {
      replacedURL = url.replace(serviceDomains[service][from], serviceDomains[service][to]);
    }
  }
  return replacedURL;
}