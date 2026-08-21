import { useEffect, useState } from "react";
import variables from "../styles/variables.module.scss";
import { IconAlertCircle, IconAlertCircleOff, IconCheck, IconCircleDashedCheck, IconInfoCircle } from "@tabler/icons-react";

function Toast({ status, message , handleCloseToast }) {
  const [close, setClose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClose(true);
      handleCloseToast()
    }, 2500);
    return () => {
      clearTimeout(timer);
      setClose(false);
    };
  }, []);

  return (
    <>
      <div
        className="toast-container"
        style={{
          display: close ? "none" : "flex",
          
        }}
      >
        <div
          className="toast-icon-container"
          style={{ backgroundColor: variables[status] }}
        >
          {status == "success" && (
            <IconCheck size={24} stroke={2} color="White"></IconCheck>
          )}
          {status == "error" && (
            <IconAlertCircleOff size={24} stroke={2} color="White"></IconAlertCircleOff>
          )}
          {status == "warning" && (
            <IconAlertCircle size={24} stroke={2} color="White"></IconAlertCircle>
          )}
          {status == "info" && (
            <IconInfoCircle size={24} stroke={2} color="White"></IconInfoCircle>
          )}
        </div>
        <div className="toast-message-container">
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}
export default Toast;
