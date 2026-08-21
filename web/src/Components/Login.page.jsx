import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import { login, sendOtp, signUp, verifyOtp } from "../Api/api";
import { useContext, useState } from "react";
import Toast from "./Toast";
import { Link, redirect } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Navbar from "../Layout/Navbar";
import "../styles/login.css";
import variables from "../styles/variables.module.scss";
import { loginSchema } from "../schemas/User.Login";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const { loginUser } = useContext(AuthContext);
  const [disableButton, setDisableButton] = useState(false);
  const [showPassword,setShowPassword] = useState(false)
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema : loginSchema,
    onSubmit: async (values, action) => {
      setDisableButton(true);
      try {
        const { response } = await loginUser(values);
        if (response.status === 200) {
          setToast({
            status: "success",
            message: "Login successfull",
            isVisible: true,
          });
          setDisableButton(false);
        }
      } catch (error) {
        setToast({
          status: "error",
          message: error?.response?.data,
          isVisible: true,
        });
        setDisableButton(false);
      }
    },
  });

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
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
                <h1 className="login-heading">Welcome Back!</h1>
                <small className="login-info">Please enter your details</small>
              </div>
            
                <form onSubmit={handleSubmit} className="form-container">
                  <div className="input-wrapper-text">
                    <label htmlFor="email">E-Mail</label>
                    <input
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                      borderColor:
                        errors.email && errors.email
                          ? variables.error
                          : variables.light_gray,
                    }}
                    ></input>
                    <p className="input-error-text">
                    {errors.email && touched.email
                      ? errors.email
                      : ""}
                  </p>
                  </div>
                  <div className="input-wrapper-text">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-button">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                      borderColor:
                        errors.password && touched.password
                          ? variables.error
                          : variables.light_gray,
                    }}
                    ></input>
                    <button type="button" onClick={()=>{setShowPassword((prevData) => !prevData)}}>{showPassword ? <IconEye size={22} stroke={1.8}></IconEye> : <IconEyeClosed size={22} stroke={1.8}></IconEyeClosed>}</button>
                  </div>
                   <p className="input-error-text">
                    {errors.password && touched.password
                      ? errors.password
                      : ""}
                  </p>
                  </div>
                  <button
                    type="submit"
                    className="normal-button submit-button"
                    disabled={disableButton}
                  >
                    Log In
                  </button>
                  <p><Link to={"/forgot-password"}>Forgot Password ?</Link></p>

                  <hr></hr>
                  <p>Don't have an Account? <Link to={"/signup"}> Sign Up</Link></p>
                 
                </form>
          
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
