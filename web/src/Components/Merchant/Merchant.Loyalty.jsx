import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { checkLoyalty, generateLoyalty, redeemLoyalty } from "../../Api/api";
import Toast from "../Toast";
import Modal from "./Modal";

function Loyalty() {
  const [modal, setModal] = useState({
    open: false,
    color: "red",
    header: "Redeem Gift Card ?",
    body: "Are you sure to redeem the gift card ?",
    action : "Redeem"
  });
  const [redeemCode, setRedeemCode] = useState("");
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const [code, setCode] = useState("");
  const [res, setRes] = useState("");
  const generateLoyaltyCode = useMutation({
    mutationFn: (info, of) => {
      return generateLoyalty(parseInt(amount));
    },
    onSuccess: (message) => {
      setCode(message.code);
      setToast({ isVisible: true, message: "Success", status: "success" });
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message.response.data,
        status: "error",
      });
    },
  });
  const checkLoyaltyCode = useMutation({
    mutationFn: (info, of) => {
      return checkLoyalty(redeemCode);
    },
    onSuccess: (message) => {
      setRes(`Code is valid for the amount of - Rs ${message.amount}`);
      setToast({ isVisible: true, message: "Code is valid", status: "success" });
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message.response.data,
        status: "error",
      });
    },
  });
  const redeemLoyaltyCode = useMutation({
    mutationFn: (info, of) => {
      return redeemLoyalty(redeemCode);
    },
    onSuccess: (message) => {
      setRes(message);
      setToast({ isVisible: true, message, status: "success" });
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message.response.data,
        status: "error",
      });
    },
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const handleRedeemCode = () =>{
    redeemLoyaltyCode.mutate(redeemCode);
  }
  return (
    <>
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <h1>Gift Card</h1>
      <div className="loyalty-container">
        <div className="loyalty-wrapper">
          <div className="loyalty-generator-container">
            <h2>Create New Code</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Amount in INR"
            ></input>
            <button
              type="button"
              className="normal-button"
              disabled={generateLoyaltyCode.isPending}
              onClick={() => {
                generateLoyaltyCode.mutate(amount);
              }}
            >
              Create
            </button>
            <h1 className="code-display">{code}</h1>
          </div>
          <div className="loyalty-redeem-container">
            <h2>Redeem / Check Code</h2>
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => {
                setRedeemCode(e.target.value);
              }}
              placeholder="Enter Loyalty Code"
            ></input>
            <button
              type="button"
              className="normal-button"
              disabled={generateLoyaltyCode.isPending}
              onClick={() => {
                checkLoyaltyCode.mutate(redeemCode);
              }}
            >
              Check code
            </button>
            <button
              type="button"
              className="normal-button secondary-button"
              disabled={generateLoyaltyCode.isPending}
              onClick={()=>{setModal((prevData) => {return {...prevData , open : true}})}}
            >
              Redeem code
            </button>
            {res && (
              <h2 className="valid-redeem-display">
               {res}
              </h2>
            )}
          </div>
        </div>
      </div>
      {modal.open && <Modal modal={modal} setModal={setModal} task={handleRedeemCode}/>}
    </>
  );
}
export default Loyalty;
