import howitworks from "../assets/howitworks.png";
function HowItWorks() {
  return (
    <div className="how-it-works-container">
      <div className="wrapper">
        <div className="how-it-works">
          <div className="how-it-works-image-container">
            <img src={howitworks} alt="how-it-works"></img>
          </div>
          <div className="steps-container">
            <div className="step">
                <h2 className="step-heading">1. Find</h2>
                <h3 className="step-info">Enter the name of the item you're looking for</h3>
            </div>
            <div className="step">
                <h2 className="step-heading">2. Choose Store</h2>
                <h3 className="step-info">Select shop/store based on your convenience</h3>
            </div>
            <div className="step">
                <h2 className="step-heading">3. Book & Pay</h2>
                <h3 className="step-info">Book the items by providing valid Email & Pay</h3>
            </div>
            <div className="step">
                <h2 className="step-heading">4. Delivery</h2>
                <h3 className="step-info">Visit the shop/store, Share OTP, Pick the item(s)</h3>
            </div>
          </div>
          <div className="note-container">
            <p>NOTE* When picking up an item please use the same Email address that you used while placing the order</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HowItWorks;
