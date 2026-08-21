import { useFormik } from "formik";
import { useContext, useState } from "react";

import { Link, redirect } from "react-router-dom";
import Navbar from "../../Layout/Navbar";
import "../../styles/login.css";
import variables from "../../styles/variables.module.scss";
import { AdminAuthContext } from "../../Context/AdminContext";
import Toast from "../Toast";
const initialValues = {
  UID : "",
  password: "",
};

function AdminLogin() {
  const { loginAdminC } = useContext(AdminAuthContext);
  const [disableButton, setDisableButton] = useState(false);
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
    onSubmit: async (values, action) => {
      setDisableButton(true);
      try {
        const { response } = await loginAdminC(values);
        if (response.status === 200) {
          setToast({
            status: "success",
            message: "Login successfull",
            isVisible: true,
          });
          setDisableButton(false);
        }
      } catch (error) {
        console.log(error)
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
                <h1 className="login-heading">Admin</h1>
                <small className="login-info">Please enter your details</small>
              </div>
            
                <form onSubmit={handleSubmit} className="form-container">
                  <div className="input-wrapper-text">
                    <label htmlFor="UID">UID</label>
                    <input
                      name="UID"
                      value={values.UID}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></input>
                  </div>
                  <div className="input-wrapper-text">
                  <label htmlFor="password">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}

                    ></input>
              
                  </div>
                  <button
                    type="submit"
                    className="normal-button submit-button"
                    disabled={disableButton}
                  >
                    Log In
                  </button>
                  <hr></hr>
                </form>
          
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminLogin;
