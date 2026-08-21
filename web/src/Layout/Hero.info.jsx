import variables from "../styles/variables.module.scss";
import marketing from "../assets/marketing.jpg";
import booknow from "../assets/booknow.jpg";
import favstore from "../assets/favstore.jpg";
import { useTranslation } from "react-i18next";

function HeroInfo() {
  const { t } = useTranslation();
  return (
    <>
      <div className="hero-info-container">
        <div className="wrapper">
          <div className="hero-info">
            <div className="hero-info-header">
              <h1>
                {t("hero.info1Title")}
                <span style={{ color: variables.accent_color }}></span>
              </h1>
              <p>{t("hero.info1Desc")}</p>
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
                {t("hero.info2Title")}
                <span style={{ color: variables.accent_color }}></span>
              </h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: t("hero.info2Desc"),
                }}
              ></p>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-info-container">
        <div className="wrapper">
          <div className="hero-info">
            <div className="hero-info-header">
              <h1>
                {t("hero.info3Title")}
                <span style={{ color: variables.accent_color }}></span>
              </h1>
              <p>{t("hero.info3Desc")}</p>
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
