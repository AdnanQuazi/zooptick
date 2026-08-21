import Footer from "../../Layout/Footer";
import Navbar from "../../Layout/Navbar";
import "../../styles/term.css";
function About() {
  return (
    <>
      <Navbar />
      <div className="info-section">
        <div className="wrapper">
          <div className="info-container">
            <div className="header-container">
              <h1>ABOUT US</h1>
            </div>
            <div className="info-set-container">
              <p className="info-body about-info">
                One in which the interests of the customer are always those of
                the company. We have created an atmosphere and community to
                support businesses as they continually improve. We have always
                attempted to tackle things in an unusual way at ZOOPTICK. In order
                to create one of the most distinctive and gratifying shop(s), we
                had to start from scratch and reevaluate a number of established
                practises.
              </p>
              <p className="info-body about-info">
                A marketplace platform called ZOOPTICK links shop(s), with frequent
                buyers, and offers QR/NFC to establishments. You may self-pickup
                item(s) from store(s), and our online store also offers a
                BOOKING option.
              </p>
              <p className="info-body about-info">
                We seek intelligent, enthusiastic shopper(s) who are at ease
                being themselves to reinvent the Retail sector and also want to
                enhance people's shopping experiences.
              </p>
              <p className="info-body about-info">
                As everyone is aware, going out to shop is both an adventure and
                an experience. So we researched the various shopping-related
                issues people confront and came to a conclusion about a
                solution. People don't just go to shop(s) to shop, they also
                want to have a nice time with their loved ones, friends, and
                other people. Here at ZOOPTICK, we make the entire shopping
                experience inventive, simple, hassle-free, fantastic, and a
                smart way to shop. Consequently, in order to make this whole
                experience enjoyable, We created ZOOPTICK to be lovely,
                hassle-free, and alluring.
              </p>
              <p className="info-body about-info">
                ZOOPTICK makes shopping enjoyable and hassle-free. While to buy
                something is a necessity, shopping intelligently takes skill. A
                great Shop takes you on a journey that involves much more than
                simply the product. Shopping is an experience and a process, and
                time is vital. We want to be the greatest retail technology firm
                in India and seek to enhance customers shopping behaviours at
                ZOOPTICK.
              </p>
              <h1>THANK YOU FOR VISITING ZOOPTICK</h1>
            </div>
            <div className="info-set-container">
              <h1 className="info-title">CONTACT US</h1>
              <p className="info-body">
                If you have queries regarding anything,
                please contact us by email : care@zooptick.com.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default About;
