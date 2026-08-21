import { useState } from "react";
import Navbar from "../../Layout/Navbar";
import Toast from "../Toast";
import { forgotPassword } from "../../Api/api";
import { useMutation } from "@tanstack/react-query";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const forgot_password = useMutation({
    mutationFn: (param) => {
      return forgotPassword(param);
    },
    onSuccess: (message) => {
      setEmail("")
      console.log(message)
      setToast({ isVisible: true, message, status: "success" });
    },
    onError: (message) => {
      setToast({ isVisible: true, message : message.response.data, status: "error" });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email)
    if (email === "") {
      setToast({ isVisible: true, message: "Please enter Email", status: "error" });
      return
    }
    if(!validateEmail(email)){
        setToast({ isVisible: true, message: "Please enter valid Email", status: "error" });
        return
    }
    forgot_password.mutate({email})
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  return (
    <>
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <Navbar />
      <div className="login-outer-container">
        <div className="wrapper">
          <div className="login-container">
            <div className="login">
              <div className="greetings-div">
                <h1 className="login-heading">Forgot Password</h1>
                <small className="login-info">Please enter your Email</small>
              </div>

              <form onSubmit={handleSubmit} className="form-container">
                <div className="input-wrapper-text">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></input>
                </div>

                <button type="submit" className="normal-button submit-button" disabled={forgot_password.isPending}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ForgotPassword;
