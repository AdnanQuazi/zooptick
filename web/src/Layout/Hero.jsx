import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/hero.jpg";
import variables from "../styles/variables.module.scss";
import SearchBar from "../Components/User/SearchBar";
import { recommendProducts } from "../Api/api";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  function handleBrowseProducts(){
    navigate("/?rawQuery=tshirts");
  }
  const res = recommendProducts();
  return (
    <>
      <div className="hero-container">
        <div className="wrapper">
          <div className="hero">
            <div className="hero-header">
              <h1>
                {t("hero.title")}
              </h1>
              <p>
                {t("hero.subtitle")}
              </p>
            </div>
            <SearchBar />
            <div className="hero-image-container">
              <img src={hero} alt="Zooptick Hero"></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Hero;
