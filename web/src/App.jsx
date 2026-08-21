import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SignupPage from "./Components/Signup.page";
import Navbar from "./Layout/Navbar";
import HowItWorks from "./Layout/HowItWorks";
import Footer from "./Layout/Footer";
import Hero from "./Layout/Hero";
import HeroInfo from "./Layout/Hero.info";
import { useSearchParams } from "react-router-dom";
import SearchPage from "./Components/User/SearchPage";
// import { messaging } from "./firebase";
// import { getToken } from "firebase/messaging";
// import { onMessage } from "firebase/messaging";
// import Cart from "./Components/User/Cart";
function App() {
  const [count, setCount] = useState(0);
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("rawQuery");
  const city = searchParams.get("city");

  // async function requestPermission() {
  //   const permission = await Notification.requestPermission();
  //   if (permission === "granted") {
  //     const token = await getToken(messaging, {
  //       vapidKey:
  //         "BL_sRNs6IC4azeBzv9gdS9yU6As8qJipd3QwNIeyXIx5CRSA2F4c6sP2HxVebUYIWaNbdIlcXbqJHoHq3Pv8e9s",
  //     });
  //     localStorage.setItem("deviceId" , token)
  //   } else if (permission === "denied") {
  //   }
  // }
  // useEffect(() => {
  //   requestPermission();
  //   onMessage(messaging,(payload)=>{
  //     console.log(payload)
  //     const notificationTitle = payload.notification.title;
  //     const notificationOptions = {
  //       body: payload.notification.body,
  //       icon: payload.notification.image,
  //     };
  //     self.registration.showNotification(notificationTitle, notificationOptions);
  //   })
  // }, []);
  return (
    <>
      <Navbar />
      {rawQuery ? (
        <SearchPage rawQuery={rawQuery} city={city}/>
      ) : (
        <>
          <Hero />
          <HeroInfo />
          <HowItWorks />
        </>
      )}
      <Footer />
    </>
  );
}

export default App;
