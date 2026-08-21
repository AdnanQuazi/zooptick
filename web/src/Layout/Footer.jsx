import { IconBrandInstagram, IconMail } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/zooptickBlack.svg";

function Footer() {
  const { t } = useTranslation();
  return (
    <div className="footer-container">
      <div className="wrapper">
        <div className="footer">
          <div className="footer-logo">
          <img className="logo" style={{height : "9rem"}} src={logo} alt="Zooptick Logo"></img>
          </div>
          <hr></hr>
          <div className="footer-links-container">
            <div className="footer-links">
              <h2 className="footer-link-heading">{t("footer.quickLinks")}</h2>
              <ul>
                <li>
                    <Link to="/" >{t("nav.home")}</Link>
                </li>
                <li>
                    <Link to="/about-us" >{t("footer.aboutUs")}</Link>
                </li>
                <li>
                    <Link to="/signup" >{t("nav.signup")}</Link>
                </li>
                <li>
                    <Link to="/onboard" >{t("nav.sellOnZooptick")}</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h2 className="footer-link-heading">{t("footer.legal")}</h2>
              <ul>
                <li>
                    <Link to="/about-us" >{t("footer.aboutUs")}</Link>
                </li>
                <li>
                    <Link to="/privacy-policy" >{t("footer.privacyPolicy")}</Link>
                </li>
                <li>
                    <Link to="/terms" >{t("footer.terms")}</Link>
                </li>
                <li>
                    <Link to="/refund-policy" >{t("footer.refundPolicy")}</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h2 className="footer-link-heading">{t("footer.contactUs")}</h2>
              <ul>
                <li>
                    <Link to="/contact-us" >{t("footer.contactUs")}</Link>
                </li>
                {/* <li>
                    <Link to="#" ><IconMail size={20} stroke={1.4}></IconMail> care@zooptick.com</Link>
                </li> */}
                {/* <li>
                    <Link to="#" ><IconBrandInstagram size={20} stroke={1.4}></IconBrandInstagram> @zooptick</Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Footer;
