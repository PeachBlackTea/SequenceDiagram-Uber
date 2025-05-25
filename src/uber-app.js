// 사용자 클래스
class User {
  constructor(name, location) {
    this.name = name;
    this.location = location;
  }

  requestRide(app, pickup, drop) {
    console.log(`${this.name} 요청: 차량 호출 (출발지: ${pickup}, 목적지: ${drop})`);
    app.processRideRequest(this, pickup, drop);
  }

  receiveNotification(message) {
    console.log(`[사용자 알림] ${message}`);
  }

  writeReview(app, rating, comment) {
    console.log(`${this.name} 리뷰 작성: 별점 ${rating}, ${comment}`);
    app.submitReview(this, rating, comment);
  }
}

// 앱 클래스
class RideApp {
  constructor() {
    this.mapService = new MapService();
    this.notificationService = new NotificationService();
    this.paymentGateway = new PaymentGateway();
  }

  processRideRequest(user, pickup, drop) {
    const routeInfo = this.mapService.calculateRoute(pickup, drop);
    console.log(`경로 및 예상 요금: ${routeInfo.route}, ${routeInfo.estimatedCost}원`);
    this.notificationService.notifyDrivers(`새 호출 요청: ${pickup} -> ${drop}`);

    // 기사 수락 모의
    const driver = new Driver("김기사", "서울");
    driver.acceptRide(this, user, pickup, drop);
  }

  notifyUser(user, message) {
    user.receiveNotification(message);
  }

  processPayment(user) {
    this.paymentGateway.processPayment(user, (status) => {
      if (status === "success") {
        this.notifyUser(user, "결제가 완료되었습니다. 영수증을 확인하세요.");
      }
    });
  }

  submitReview(user, rating, comment) {
    console.log(`리뷰 저장: ${user.name} - 별점 ${rating}, ${comment}`);
  }
}

// 지도 서비스 클래스
class MapService {
  calculateRoute(pickup, drop) {
    console.log(`지도 서비스: 경로 계산 (${pickup} -> ${drop})`);
    return { route: `${pickup} -> ${drop}`, estimatedCost: 12000 };
  }
}

// 알림 서비스 클래스
class NotificationService {
  notifyDrivers(message) {
    console.log(`[알림 시스템] 기사들에게 알림: ${message}`);
  }

  sendNotification(user, message) {
    console.log(`[알림 시스템] ${user.name}에게 알림: ${message}`);
  }
}

// 기사 클래스
class Driver {
  constructor(name, location) {
    this.name = name;
    this.location = location;
  }

  acceptRide(app, user, pickup, drop) {
    console.log(`${this.name} 기사: 호출 수락 (${pickup} -> ${drop})`);
    app.notifyUser(user, `${this.name} 기사가 호출을 수락했습니다.`);
    this.startRide(app, user, pickup, drop);
  }

  startRide(app, user, pickup, drop) {
    console.log(`${this.name} 기사: 운행 시작 (${pickup} -> ${drop})`);
    app.notifyUser(user, "운행이 시작되었습니다. 실시간 위치를 확인하세요.");
    setTimeout(() => this.endRide(app, user), 5000); // 5초 후 운행 종료 모의
  }

  endRide(app, user) {
    console.log(`${this.name} 기사: 운행 종료`);
    app.notifyUser(user, "운행이 종료되었습니다.");
    app.processPayment(user);
  }
}

// 결제 시스템 클래스
class PaymentGateway {
  processPayment(user, callback) {
    console.log(`결제 시스템: 결제 처리 중 (${user.name})`);
    setTimeout(() => {
      console.log("결제 완료");
      callback("success");
    }, 2000);
  }
}

// --- 시뮬레이션 ---
const user = new User("이승환", "강남");
const rideApp = new RideApp();

// 차량 호출 요청
user.requestRide(rideApp, "강남역", "서울역");

// 10초 후 리뷰 작성 (모의)
setTimeout(() => {
  user.writeReview(rideApp, 5, "아주 친절했어요!");
}, 10000);

