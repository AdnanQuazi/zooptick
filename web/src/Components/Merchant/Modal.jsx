import { useEffect } from "react";
import "../../styles/modal.css";
function Modal({ modal, setModal, task }) {
  const { open, header, color , body, args , action } = modal;
  // useEffect(() => {
  //   console.log("RAN");
  //   if (open) {
  //     document.body.style.overflowY = "hidden";
  //   } else {
  //     document.body.style.overflowY = "scroll";
  //   }
  //   return () => {
  //     document.body.style.overflowY = "scroll";
  //   };
  // }, [modal]);
  const handleModalClose = (e) => {
    e ? e.stopPropagation() : "";
    setModal((prevData) => {
      return { ...prevData, open: false };
    });
  };
  const handleModalClick = (e) => {
    task(args);
    handleModalClose();
  };
  return (
    <div className="modal-container">
      <div className="modal-normal">
        <div className="modal-header">{header}</div>
        <div className="modal-body">{body}</div>
        <div className="modal-button-group">
          <button
            type="button"
            onClick={handleModalClose}
            className="modal-secondary-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleModalClick}
            className="modal-primary-button"
            style={{color}}
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Modal;
