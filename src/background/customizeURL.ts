export const serviceDomains: object = {
  naver: {
    desktopHost: "www.naver.com",
    mobileHost: "m.naver.com",
    desktop: "www.naver.com",
    mobile: "m.naver.com"
  },
  naversearch: {
    desktopHost: "search.naver.com",
    mobileHost: "m.search.naver.com",
    desktop: "search.naver.com",
    mobile: "m.search.naver.com"
  },
  navershoppingsearch: {
    desktopHost: "search.shopping.naver.com",
    mobileHost: "msearch.shopping.naver.com",
    desktop: "search.shopping.naver.com/search/all",
    mobile: "msearch.shopping.naver.com/search/all"
  },
  naverplace: {
    desktopHost: "store.naver.com",
    mobileHost: "m.place.naver.com",
    desktop: "store.naver.com/restaurants/detail?id=",
    mobile: "m.place.naver.com/restaurant/"
  },
  naverreservation: {
    desktopHost: "booking.naver.com",
    mobileHost: "m.booking.naver.com",
    desktop: "booking.naver.com",
    mobile: "m.booking.naver.com"
  },
  naverblog: {
    desktopHost: "blog.naver.com",
    mobileHost: "m.blog.naver.com",
    desktop: "blog.naver.com",
    mobile: "m.blog.naver.com"
  },
  naverqna: {
    desktopHost: "kin.naver.com",
    mobileHost: "m.kin.naver.com",
    desktop: "kin.naver.com",
    mobile: "m.kin.naver.com/mobile"
  },
  naverpay: {
    desktopHost: "order.pay.naver.com",
    mobileHost: "m.pay.naver.com",
    desktop: "order.pay.naver.com",
    mobile: "m.pay.naver.com/o"
  },
  vlive: {
    desktopHost: "www.vlive.tv",
    mobileHost: "m.vlive.tv",
    desktop: "www.vlive.tv",
    mobile: "m.vlive.tv"
  },
  daum: {
    desktopHost: "www.daum.net",
    mobileHost: "m.daum.net",
    desktop: "www.daum.net",
    mobile: "m.daum.net"
  },
  daumsearch: {
    desktopHost: "search.daum.net",
    mobileHost: "m.search.daum.net",
    desktop: "search.daum.net",
    mobile: "m.search.daum.net"
  },
  coupang: {
    desktopHost: "www.coupang.com",
    mobileHost: "m.coupang.com",
    desktop: "www.coupang.com",
    mobile: "m.coupang.com"
  },
  facebook: {
    desktopHost: "www.facebook.com",
    mobileHost: "m.facebook.com",
    desktop: "www.facebook.com",
    mobile: "m.facebook.com"
  },
  youtube: {
    desktopHost: "www.youtube.com",
    mobileHost: "m.youtube.com",
    desktop: "www.youtube.com",
    mobile: "m.youtube.com"
  }
};

export const syncIgnore: string[] = ["https://m.vlive.tv/events"];

const parseURL = (url: string): string[] => {
  if (url) {
    const parsedHost = url.split("/")[2];
    for (const service in serviceDomains) {
      if (serviceDomains.hasOwnProperty(service)) {
        if (serviceDomains[service][`desktopHost`] === parsedHost)
          return [service, "desktop", "mobile"]; // from desktop to mobile
        if (serviceDomains[service][`mobileHost`] === parsedHost)
          return [service, "mobile", "desktop"]; // from mobile to desktop
      }
    }
  }
};

const customizeURL = (url: string, isFromSidebar: boolean): string => {
  const parsedURLInfo: string[] = parseURL(url);
  let replacedURL: string = url;
  if (parsedURLInfo) {
    const [service, from, to]: string[] = parsedURLInfo;
    switch (true) {
      case isFromSidebar && to === "mobile":
      case !isFromSidebar && to === "desktop":
        replacedURL = url;
        break;
      case service === "naverblog" && to === "desktop":
        const blogMobileURL: string = url
          .replace(serviceDomains[service][from], serviceDomains[service][to])
          .split("&proxyReferer=")[1];
        replacedURL = url.replace(
          serviceDomains[service][from],
          serviceDomains[service][to]
        );
        blogMobileURL && (replacedURL = decodeURIComponent(blogMobileURL));
        break;
      default: replacedURL = url.replace(serviceDomains[service][from], serviceDomains[service][to]);
        break;
    }
  }
  return replacedURL;
};

export default customizeURL;
