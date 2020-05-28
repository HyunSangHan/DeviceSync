import customizeURL, { serviceDomains } from "../src/background/customizeURL";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { request, expect } = chai;

const testURIs: object = {
  Naver : {
    desktop : "https://www.naver.com/",
    mobile : "https://m.naver.com/"
  },
  NaverSearch : {
    desktop : "https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=Whale+Browser+Sync",
    mobile : "https://m.search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=Whale+Browser+Sync"
  },
  NaverShoppingSearch : {
    desktop : "https://search.shopping.naver.com/search/all?query=vitamin",
    mobile : "https://msearch.shopping.naver.com/search/all?query=vitamin"
  },
  NaverPlace : {
    desktop : "https://store.naver.com/restaurants/detail?id=1728162345",
    mobile : "https://m.place.naver.com/restaurant/1728162345"
  },
  NaverReservation : {
    desktop : "https://booking.naver.com/booking/13/bizes/222724?area=plt",
    mobile : "https://m.booking.naver.com/booking/13/bizes/222724?area=plt"
  },
  NaverBlog : {
    desktop : "https://blog.naver.com/PostList.nhn?blogId=naver_diary",
    mobile : "https://m.blog.naver.com/PostList.nhn?blogId=naver_diary"
  },
  NaverQnA : {
    desktop : "https://kin.naver.com/qna/detail.nhn?d1id=8&dirId=80101&docId=353771577",
    mobile : "https://m.kin.naver.com/mobile/qna/detail.nhn?d1id=8&dirId=80101&docId=353771577"
  },
  NaverPay : {
    desktop : "https://order.pay.naver.com/home",
    mobile : "https://m.pay.naver.com/o/home"
  },
  NaverVlive : {
    desktop : "https://www.vlive.tv/home",
    mobile : "https://m.vlive.tv/home"
  },
  Daum : {
    desktop : "https://www.daum.net/",
    mobile : "https://m.daum.net/"
  },
  DaumSearch : {
    desktop : "https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=naver",
    mobile : "https://m.search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=naver"
  },
  Coupang : {
    desktop : "https://www.coupang.com/",
    mobile : "https://m.coupang.com/"
  },
  Facebook : {
    desktop : "https://www.facebook.com/",
    mobile : "https://m.facebook.com/"
  },
  Youtube : {
    desktop : "https://www.youtube.com/",
    mobile : "https://m.youtube.com/"
  },
}

const statusCodeIgnore: string[] = [
  "NaverBlog", "Coupang"
]

describe("The number of elements in the list", () => {
  it("should be the same", () => {
    expect(Object.keys(testURIs).length).to.equal(Object.keys(serviceDomains).length);
  });
});

describe("Services registered on the forced sync list", () => {
  for (const serviceName of Object.keys(testURIs)) {
    const { desktop, mobile } = testURIs[serviceName];
    const replacedMobileURI: string = customizeURL(desktop, false);
    const replacedDesktopURI: string = customizeURL(mobile, true);

    describe(serviceName, () => {
      it("should replace desktopURL with mobileURL", () => {
        expect(replacedMobileURI).to.equal(mobile);
      });

      it("should replace mobileURL with desktopURL", () => {
        expect(replacedDesktopURI).to.equal(desktop);
      });

      if (!statusCodeIgnore.includes(serviceName)) {
        it("should respond 200 status code by replacedMobileURI", done => {
          request(replacedMobileURI).get('/')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
        });

        it("should respond 200 status code by replacedDesktopURI", done => {
          request(replacedDesktopURI).get('/')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
        });
      }
    });
  }
});

describe("Services unregistered on the forced sync list", () => {
  const replacedMobileURI: string = customizeURL("http://phenomenon.kr", false);
  const replacedDesktopURI: string = customizeURL("http://phenomenon.kr", true);

  it("should not replace desktopURL with mobileURL", () => {
    expect(replacedMobileURI).to.equal("http://phenomenon.kr");
  });

  it("should not replace mobileURL with desktopURL", () => {
    expect(replacedDesktopURI).to.equal("http://phenomenon.kr");
  });
});
