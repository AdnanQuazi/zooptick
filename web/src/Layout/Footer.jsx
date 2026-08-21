import { IconBrandInstagram, IconMail } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import logo from "../assets/zooptickBlack.svg"

function Footer() {
  return (
    <div className="footer-container">
      <div className="wrapper">
        <div className="footer">
          <div className="footer-logo">
          <img className="logo" style={{height : "9rem"}} src={logo}></img>
          </div>
          <hr></hr>
          <div className="footer-links-container">
            <div className="footer-links">
              <h2 className="footer-link-heading">Site Map</h2>
              <ul>
                <li>
                    <Link to="/" >Home</Link>
                </li>
                <li>
                    <Link to="/about-us" >About Us</Link>
                </li>
                <li>
                    <Link to="/signup" >Sign Up</Link>
                </li>
                <li>
                    <Link to="/onboard" >Become a Seller</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h2 className="footer-link-heading">Legal</h2>
              <ul>
                <li>
                    <Link to="/about-us" >About Us</Link>
                </li>
                <li>
                    <Link to="/privacy-policy" >Privacy Policy</Link>
                </li>
                <li>
                    <Link to="/terms" >Terms & Conditions</Link>
                </li>
                <li>
                    <Link to="/refund-policy" >Refund & Cancellation Policy</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h2 className="footer-link-heading">Get in touch</h2>
              <ul>
                <li>
                    <Link to="/contact-us" >Contact Us</Link>
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
