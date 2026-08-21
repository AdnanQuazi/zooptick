import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import { sendOtp, signUp, verifyOtp } from "../Api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Toast from "./Toast";
import { Link, redirect, useNavigate } from "react-router-dom";
import "../styles/signup.css";
import variables from "../styles/variables.module.scss";
import Navbar from "../Layout/Navbar";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
const initialValues = {
  name: "",
  email: "",
  password: "",
  c_password: "",
};

function SignupPage() {
  const [openOtpInput, setOpenOtpInput] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [showPassword,setShowPassword] = useState(false)
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const navigate = useNavigate()
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values, action) => {
      setDisableButton(true);
      try {
        const response = await sendOtp(values.email);
        if (response.status === 200) {
          setToast({
            status: "success",
            message: "OTP sent successfully",
            isVisible: true,
          });
          setDisableButton(false);
          setOpenOtpInput(true);
        
        }
      } catch (error) {
        setToast({
          status: "error",
          message: error.response.data,
          isVisible: true,
        });
        setDisableButton(false);
      }
    },
  });

  const handleVerifyOtp = async () => {
    setDisableButton(true);
    try {
      const response = await verifyOtp(otp);

      if (response.status === 200) {
        const signUpResponse = await signUp(values);
        console.log(signUpResponse);
        if (signUpResponse.status === 200) {
          navigate("/")
        }
      }
    } catch (error) {
      console.log("Asdasd" , error)
      setToast({
        status: "error",
        message: error.response.data,
        isVisible: true,
      });
      setDisableButton(false);
    }
  };
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  return (
    <>
      <Navbar />
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <div className="signup-outer-container">
        <div className="wrapper">
          <div className="signup-container">
            <div className="signup">
              <div className="greetings-div">
                <h1 className="signup-heading">Welcome to Zooptick!</h1>
                <small className="signup-info">Please enter your details</small>
              </div>

              <form onSubmit={handleSubmit} className="form-container">
                <div className="input-wrapper-text">
                  <label htmlFor="name">Name</label>

                  <input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor:
                        errors.name && touched.name
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input>
                  <p className="input-error-text">
                    {errors.name && touched.name ? errors.name : ""}
                  </p>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor:
                        errors.email && touched.email
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input>
                  <p className="input-error-text">
                    {errors.email && touched.email ? errors.email : ""}
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
                    {errors.password && touched.password ? errors.password : ""}
                  </p>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="c_password">Confirm Password</label>
                  <input
                    name="c_password"
                    type="password"
                    value={values.c_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor:
                        errors.c_password && touched.c_password
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input>
                  <p className="input-error-text">
                    {errors.c_password && touched.c_password
                      ? errors.c_password
                      : ""}
                  </p>
                </div>
                {openOtpInput && (
                  <div className="input-wrapper-text">
                    <div className="styled-input">
                      <input
                        name="otp"
                        placeholder="OTP"
                        type="number"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      ></input>
                      <button
                        type="button"
                        className="verify-otp-button"
                        disabled={disableButton}
                        onClick={handleVerifyOtp}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="normal-button submit-button"
                  disabled={disableButton}
                >
                  Sign Up
                </button>
                <hr></hr>
                <p>
                  Already have an account? <Link to={"/login"}> Log In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignupPage;
