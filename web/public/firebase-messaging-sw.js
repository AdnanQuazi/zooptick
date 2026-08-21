importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyCgvAixJGchd1H8mFQInrGNIKlP4uaL7Q8",
    authDomain: "noxsh-z.firebaseapp.com",
    projectId: "noxsh-z",
    storageBucket: "noxsh-z.appspot.com",
    messagingSenderId: "404639498818",
    appId: "1:404639498818:web:7a6523579fa91c76b4e3db",
    measurementId: "G-L2QPWWP2JY"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// messaging.onMessage((payload) => {
//     console.log('Message received. ', payload);
//     // ...
//   });
  
messaging.onBackgroundMessage((payload) => {
    console.log(payload)
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
