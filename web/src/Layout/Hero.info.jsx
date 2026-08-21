import variables from "../styles/variables.module.scss";
import marketing from "../assets/marketing.jpg";
import booknow from "../assets/booknow.jpg";
import favstore from "../assets/favstore.jpg";
function HeroInfo() {
  return (
    <>
      <div className="hero-info-container">
        <div className="wrapper">
          <div className="hero-info">
            <div className="hero-info-header">
              <h1>
                From Click To Pick In Hours
                <span style={{ color: variables.accent_color }}></span>
              </h1>
              <p>
                The days of searching offline/online stores for your favourite
                or necessary things and waiting days for delivery are over. Shop
                offline in a SMART way with SMART choices and SMOOTHER shopping
              </p>
            </div>
            <div className="hero-info-image-container">
              <img src={marketing}></img>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-info-container">
        <div className="wrapper">
          <div className="hero-info">
            <div className="hero-info-image-container">
              <img src={booknow}></img>
            </div>
            <div className="hero-info-header">
              <h1>
                Shop From Your Favourite Store
                <span style={{ color: variables.accent_color }}></span>
              </h1>
              <p>
                Indulge in offline retail therapy like never before. <br /> The
                days when a ceratin thing required faith are long gone. You may
                now shop with ease at your favourite and reliable store thanks
                to ZOOPTICK
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-info-container">
        <div className="wrapper">
          <div className="hero-info">
            <div className="hero-info-header">
              <h1>
                No Longer Restrictions On Order Based On Location.
                <span style={{ color: variables.accent_color }}></span>
              </h1>
              <p>
               There is no longer a need to limit yourself to your shop's location. Now you can receive orders from anywhere in your city
              </p>
            </div>
            <div className="hero-info-image-container">
              <img src={favstore}></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HeroInfo;
