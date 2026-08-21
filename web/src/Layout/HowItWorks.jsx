import howitworks from "../assets/howitworks.png";
import { useTranslation } from "react-i18next";

function HowItWorks() {
  const { t } = useTranslation();
  return (
    <div className="how-it-works-container">
      <div className="wrapper">
        <div className="how-it-works">
          <div className="how-it-works-image-container">
            <img src={howitworks} alt="how-it-works"></img>
          </div>
          <div className="steps-container">
            <div className="step">
                <h2 className="step-heading">1. {t("howItWorks.step1Title")}</h2>
                <h3 className="step-info">{t("howItWorks.step1Desc")}</h3>
            </div>
            <div className="step">
                <h2 className="step-heading">2. {t("howItWorks.step2Title")}</h2>
                <h3 className="step-info">{t("howItWorks.step2Desc")}</h3>
            </div>
            <div className="step">
                <h2 className="step-heading">3. {t("howItWorks.step3Title")}</h2>
                <h3 className="step-info">{t("howItWorks.step3Desc")}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HowItWorks;
