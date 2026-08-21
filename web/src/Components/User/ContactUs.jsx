import { IconBrandWhatsapp, IconLocationPin, IconMail, IconMailFilled, IconMapPinFilled } from "@tabler/icons-react"
import variables from "../../styles/variables.module.scss";
import Navbar from "../../Layout/Navbar"
import "../../styles/contactus.css"
import Footer from "../../Layout/Footer";
function ContactUs(){
    return <>
        <Navbar />
        <div className="contact-us-outer-container">
            <div className="wrapper">
            <h1>Thanks for choosing Zooptick</h1>
                <div className="contact-us-container">
                    <div className="contact">
                        <div className="icon-container"><IconMapPinFilled color={variables.accent_color} size={50}></IconMapPinFilled></div>
                        <div className="contact-data"><p>Zooptick , PO , Kondhali , Taluka Katol , dist : Nagpur</p></div>
                    </div>
                    <div className="contact">
                        <div className="icon-container"><IconBrandWhatsapp color={variables.accent_color} size={50}></IconBrandWhatsapp></div>
                        <div className="contact-data"><p>+91 94048 11241</p></div>
                    </div>
                    <div className="contact">
                        <div className="icon-container"><IconMailFilled color={variables.accent_color} size={50}></IconMailFilled></div>
                        <div className="contact-data"><p>care@zooptick.com</p></div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
}
export default ContactUs