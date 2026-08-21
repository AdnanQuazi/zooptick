import { IconDeviceFloppy, IconPencil } from "@tabler/icons-react";
import { useFormik } from "formik";
import { MerchantPersonalDetailsSchema } from "../../schemas/Merchant.YourAccount.Schema";
import variables from "../../styles/variables.module.scss";
import { useContext, useState } from "react";
import TimingsForm from "./Merchant.Timings";
import {
  getMerchantAccountInfo,
  updateMerchantAccountInfo,
} from "../../Api/api";
import statesAndCities from "../AddressData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "../Toast";
import Error404 from "../Error404";
import { AuthContext } from "../../Context/AuthContext";

function MerchantAccount() {
  const {BASEURL} = useContext(AuthContext)
  const queryClient = useQueryClient();
  const [editable, setEditable] = useState(true);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const { data, isError, isLoading } = useQuery({
    queryKey: ["initialMerchantInfo"],
    queryFn: (obj) => {
      return getMerchantAccountInfo();
    },
    retry : 1
  });
  console.log(data)
  const initialValues = {
    ownerName: "null",
    shopName: "null",
    contactNumber: "null",
    email: "null",
    state: "null",
    city: "null",
    address: "null",
    shopImage : "",
    businessType: "null",
    timings: "null",
  };

  const updateMerchantInfo = useMutation({
    mutationFn: (info, of) => {
      return updateMerchantAccountInfo(info);
    },
    onSuccess: (message) => {
      console.log(data);
      setToast({ isVisible: true, message, status: "success" });
      setEditable(true);
      queryClient.invalidateQueries(["initialMerchantInfo"]);
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message.response.data.message,
        status: "error",
      });
    },
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: data || initialValues,
    enableReinitialize: true,
    validationSchema: MerchantPersonalDetailsSchema,
    onSubmit: (values, action) => {
      updateMerchantInfo.mutate({ ...values, of: "personalInfo" });
    },
  });
  if(isError){
    return <>
      <Error404 />
    </>
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
      
      <h1>Your Account</h1>
      {data && <div className="dashboard-containers">
        <div className="basic-details-container">
          <div className="profile-details-container">
            <img className="profile-picture-button" src={values.shopImage}></img>
            <div className="name-address-container">
              <h2>{values.shopName}</h2>
              <small>{values.address}</small>
            </div>
          </div>
          <hr></hr>
          <div className="personal-details-container">
            <form className="form-container" onSubmit={handleSubmit}>
              <h2 className="form-heading">Personal Information</h2>
              <div className="form-inputs-container">
                <div className="input-wrapper-text">
                  <label htmlFor="ownerName">Owner Name</label>
                  <input
                    name="ownerName"
                    value={values.ownerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={editable}
                    style={{
                      borderColor:
                        errors.ownerName && touched.ownerName
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input>
                  <p className="input-error-text">
                    {errors.ownerName && touched.ownerName
                      ? errors.ownerName
                      : ""}
                  </p>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="shopName">Shop Name</label>
                  <input
                    name="shopName"
                    value={values.shopName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={editable}
                    style={{
                      borderColor:
                        errors.shopName && touched.shopName
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input>
                  <p className="input-error-text">
                    {errors.shopName && touched.shopName ? errors.shopName : ""}
                  </p>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly
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
                  <label htmlFor="contactNumber">Contact Number</label>
                  <div className="styled-input">
                    <div className="input-type">+91</div>
                    <div className="line"></div>
                    <input
                      name="contactNumber"
                      value={values.contactNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={editable}
                      style={{
                        borderColor:
                          errors.contactNumber && touched.contactNumber
                            ? variables.error
                            : variables.light_gray,
                      }}
                    ></input>
                  </div>
                  <p className="input-error-text">
                    {errors.contactNumber && touched.contactNumber
                      ? errors.contactNumber
                      : ""}
                  </p>
                </div>
              </div>
              <h2 className="form-heading">Address</h2>
              <div className="form-inputs-container">
                <div className="input-wrapper-text">
                  <label htmlFor="state">State</label>
                  {/* <input
                    name="state"
                    value={values.ownerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={editable}
                    style={{
                      borderColor:
                        errors.ownerName && touched.ownerName
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input> */}
                  <select
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor:
                        errors.state && touched.state
                          ? variables.error
                          : variables.light_gray,
                    }}
                    disabled={editable}
                  >
                    {Object.keys(statesAndCities).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <p className="input-error-text">
                    {errors.state && touched.state ? errors.state : ""}
                  </p>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="city">City</label>
                  <select
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor:
                        errors.city && touched.city
                          ? variables.error
                          : variables.light_gray,
                    }}
                    disabled={editable}
                  >
                    {statesAndCities[values.state]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <p className="input-error-text">
                    {errors.city && touched.city ? errors.city : ""}
                  </p>
                </div>
                <div className="input-wrapper-text">
                  <label htmlFor="address">Address</label>
                  <input
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={editable}
                    style={{
                      borderColor:
                        errors.address && touched.address
                          ? variables.error
                          : variables.light_gray,
                    }}
                  ></input>
                  <p className="input-error-text">
                    {errors.address && touched.address ? errors.address : ""}
                  </p>
                </div>
              </div>
              <div className="buttons-container">
                <button
                  className="edit-button "
                  type="button"
                  onClick={() => setEditable((editable) => !editable)}
                >
                  EDIT
                </button>
                <button
                  className="submit-button save-button"
                  type="submit"
                  disabled={editable}
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="secondary-details-container">
          <TimingsForm
            timings={values.timings}
            updateMerchantInfo={updateMerchantInfo}
          />
        </div>
      </div>}
    </>
  );
}
export default MerchantAccount;
