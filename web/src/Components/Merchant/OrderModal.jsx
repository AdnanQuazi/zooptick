import success from "../../assets/successAnimation.webm";
import poppers from "../../assets/partyAnimation.webm";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { replace } from "formik";
import decline from "../../assets/decline.png"
import variables from "../../styles/variables.module.scss";

function OrderModal({ status, setShowRejected , setNamee }) {
  const navigate = useNavigate();
  function handleOkay() {
    navigate("/");
  }
  function handleClose() {
    setShowRejected(false);
  }
  return (
    <div className="animated-modal-container">
      <div className="modal">
        {status === "success" ? (
          <>
            {" "}
            <video id="poppers-gif" autoPlay muted>
              <source src={poppers} type="video/webm"></source>
            </video>
            <video id="success-gif" autoPlay muted>
              <source src={success} type="video/webm"></source>
            </video>
            <div className="modal-header">
              <h1>Booking Succesfull</h1>
            </div>
            <div className="modal-body">
              <p>
                Your Booking is succesfull
              </p>
            </div>
            <button className="normal-button" onClick={handleOkay}>
              Okay
            </button>
          </>
        ) : status === "failed" ? (
          <>
            <div className="modal-header" style={{marginTop : "0"}}>
              <img style={{width: "10rem"}} src={decline}></img>
              <h1 >Booking Failed</h1>
            </div>
            <div className="modal-body">
              <p>
               Booking failed due to some reason
              </p>
            </div>
            <button className="normal-button" style={{backgroundColor : variables.error,borderColor : variables.error}} onClick={handleOkay}>
              Okay
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default OrderModal;
