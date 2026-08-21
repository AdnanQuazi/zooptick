import success from "../../assets/successAnimation.webm";
import poppers from "../../assets/partyAnimation.webm";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { replace } from "formik";
import decline from "../../assets/decline.png"
import variables from "../../styles/variables.module.scss";

function AnimatedModal({ status, setShowRejected , setNamee }) {
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
              <h1>Submitted Successfully</h1>
            </div>
            <div className="modal-body">
              <p>
                Your store details are currently under review. Please check your
                email for further updates and instructions.<br></br>We appreciate your
                patience.
              </p>
            </div>
            <button className="normal-button" onClick={handleOkay}>
              Okay
            </button>
            <small>Note - The review may take upto 48 hours</small>
          </>
        ) : status === "rejected" ? (
          <>
            <div className="modal-header" style={{marginTop : "0"}}>
              <img style={{width: "10rem"}} src={decline}></img>
              <h1 >Registration Rejected</h1>
            </div>
            <div className="modal-body">
              <p>
                We regret to inform you that your store registration has been
                rejected. Please review our guidelines and feel free to contact
                support for further assistance.
              </p>
            </div>
            <button className="normal-button" style={{backgroundColor : variables.error,borderColor : variables.error}} onClick={handleClose}>
              Register Again
            </button>
            <small>Please check your email for more details</small>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default AnimatedModal;
