import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/hero.jpg";
import variables from "../styles/variables.module.scss";
import SearchBar from "../Components/User/SearchBar";
import { recommendProducts } from "../Api/api";
function Hero() {
  const navigate = useNavigate()
  function handleBrowseProducts(){
    navigate("/?rawQuery=tshirts")
  }
  const res = recommendProducts()
  console.log(res)
  return (
    <>
      
      <div className="hero-container">
        <div className="wrapper">
          <div className="hero">
          
            <div className="hero-header">
              <h1>
                Discover Your Perfect<br></br>
                <span style={{ color: variables.accent_color }}>Product</span>{" "}
                Today
              </h1>
              <p>
                At Zooptick, we combine the ease of online shopping with the
                personal touch of in-store visits.
              </p>
              {/* <div className="button-group">
                <button onClick={handleBrowseProducts} className="normal-button" style={{fontSize : '1.6rem'}}>Browse Products</button>
                <Link to="/onboard" className="become-a-seller">Become a Seller</Link>
              </div> */}
            </div>
            <SearchBar />
            <div className="hero-image-container">
              <img src={hero}></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Hero;
