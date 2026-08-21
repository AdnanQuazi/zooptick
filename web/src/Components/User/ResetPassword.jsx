import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../Toast";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../Api/api";
function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [c_password, setC_password] = useState("");
  const [showPassword,setShowPassword] = useState(false)

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const navigate = useNavigate()
  const reset_password = useMutation({
    mutationFn: (param) => {
      return resetPassword(param);
    },
    onSuccess: (message) => {
      setToast({ isVisible: true, message, status: "success" });
      setTimeout(()=>{
        navigate("/login")
      },1000)
    },
    onError: (message) => {
      setToast({ isVisible: true, message : message.response.data, status: "error" });
    },
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const handleSubmit = (e) => {
    e.preventDefault()

    if(!password){
        setToast({ isVisible: true, message: "Please enter password", status: "error" });
        return
    }
    if(!password.length >= 6){
        setToast({ isVisible: true, message: "Password length should be greater than 6", status: "error" });
        return
    }
    if(c_password != password){
        setToast({ isVisible: true, message: "Confirm password should match with password ", status: "error" });
        return
    }
    reset_password.mutate({token : token , password : password})
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
      <div className="login-outer-container">
        <div className="wrapper">
          <div className="login-container">
            <div className="login">
              <div className="greetings-div">
                <h1 className="login-heading">Reset Your Password</h1>
              </div>

              <form onSubmit={handleSubmit} className="form-container">
                <div className="input-wrapper-text">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-button">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e)=>{setPassword(e.target.value)}}
                    ></input>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword((prevData) => !prevData);
                      }}
                    >
                      {showPassword ? (
                        <IconEye size={22} stroke={1.8}></IconEye>
                      ) : (
                        <IconEyeClosed size={22} stroke={1.8}></IconEyeClosed>
                      )}
                    </button>
                  </div>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="c_password">Confirm Password</label>
                    <input
                      name="c_password"
                      type="password"
                      value={c_password}
                      onChange={(e)=>{setC_password(e.target.value)}}
                    ></input>
                </div>

                <button type="submit" className="normal-button submit-button" disabled={reset_password.isPending}>
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
export default ResetPassword;
