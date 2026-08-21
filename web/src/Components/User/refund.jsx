import Footer from "../../Layout/Footer";
import Navbar from "../../Layout/Navbar";
import "../../styles/term.css";
function Refund() {
  return (
    <>
      <Navbar />
      <div className="info-section">
        <div className="wrapper">
          <div className="info-container">
            <div className="header-container">
              <h1>REFUND & CANCELLATION POLICY</h1>
            </div>
            <div className="info-set-container">
              <p className="info-body">
                Thank you for your purchase. We hope you are happy with your
                purchase. However,if you are not completely satisfied with your
                purchase for any resaon,you may cancel or exchange it to us for
                a full refund or an exchange before the specified conditions or
                alloted time slot.
              </p>
              <p>
                Please see below for more information on our
                return/exchange/refund/cancellation policy. The Terms and
                Conditions and Privacy Policy of ZOOPTICK will be applied to the
                refund/exchange and cancellation policy.
              </p>
            </div>
            <div className="info-set-container">
              <p>
                ZOOPTICK reserves the exclusive right to refuse or cancel any order
                and services that are listed at an incorrect price or are not
                available or for whatsoever reasons. This is enforceable
                irrespective of order confirmation or payment confirmation. In
                such events if the payment has been processed by ZOOPTICK the
                amount will be refunded via the same mode of original payment
                and user will be notified of the same with a reasonable mode of
                communication.{" "}
              </p>
              <p>
                To provide the best customer satisfaction, we provide the
                following solutions. Feel free to contact us if you have any
                questions regarding the Return/Exchange and Refund and
                Cancellation Policy by emailing us.
              </p>
            </div>
            <div className="info-set-container">
              <h1>RETURN POLICY</h1>
              <p>
                We strive to provide utmost attention to our customer needs. Due
                to the nature of the business, ZOOPTICK hereby adheres to the
                following cancellation and refund policies.
              </p>
              <p>
                No cancellation/return/exchange is possible after the
                order(s)/product(s) has been collected/picked up from the
                respective store. We do not accept returns/exchange(s) of any
                kind for any form of merchandise/item(s), whether it is
                collected/picked up or not.
              </p>
              <p>
                Returns are only possible before picking up the item(s) from the
                respective store.
              </p>
            </div>
            <div className="info-set-container">
              <h1>CANCELLATION POLICY</h1>
              <p>
                Booking of your order will begin after your payment has been
                confirmed.{" "}
              </p>
              <p>
                A product or item can only be returned or cancelled prior to the
                specified return time. After the ordered product is
                collected/picked up from the relevant retailer, there is no way
                to cancel, refund, or exchange it.
              </p>
              <p>
                Please be advised that exchanges are only permitted for any
                item(s) before or during pickup and will be subject to
                availability.
              </p>
              <p>
                Once your order has been picked up from the relevant store, we
                are unable to accept cancellation(s) or exchange(s).
              </p>
            </div>
            <div className="info-set-container">
              <h1 className="info-title">EXCHANGE POLICY</h1>
              <p className="info-body">
                Exchange can be done once only of undelivered items. You may ask
                for exchange the respective item(s) which you have booked.
              </p>
              <p className="info-body">
                Please be advised that exchanges are only permitted for any
                item(s) before or during pickup. Once your order has been picked
                up from the relevant store, we are unable to accept
                cancellation(s) or exchange(s).
              </p>
              <p className="info-body">
                We or any Vendor cannot guarantee the availability of any
                item(s), booked item(s), color, size, model, etc or price that
                you have previously seen on our website for exchange.
              </p>
            </div>

            <div className="info-set-container">
              <h1 className="info-title">REFUND POLICY</h1>
              <p className="info-body">
                Refund will be possible only in certain circumstances. For E.g.
                If you pay for an order and for some reason the order is not
                processed, you can ask us for a refund by emailing us or
                contacting the Merchant/Store Owner. If you cancel/return a
                product you will get a full refund. ZOOPTICK will process a refund
                to the original mode of payment chosen by you. If you paid via
                cash, you will get the refund in your bank account or any other
                suitable mode or it can be the same mode. Refund shall only be
                considered once the customer produces genuine reason or relevant
                documents and proof.
              </p>
              <p className="info-body">
                Refund may take up to 3-5 business days to get processed. If the
                Settlement Day falls on a bank holiday/or a non-business day,
                the refund shall be processed on the next working day.
              </p>
            </div>

            <div className="info-set-container">
              <h1 className="info-title">CONTACT US</h1>
              <p className="info-body">
                If you have any queries regarding this Refund and Cancellation
                policy or other related matters, please email us at
                care@ZOOPTICK.com.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Refund;
