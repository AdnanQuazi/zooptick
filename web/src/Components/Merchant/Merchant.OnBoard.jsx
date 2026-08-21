import { Field, useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { object } from "yup";
import "../../styles/onBoardForm.css";
import { IconCamera, IconX } from "@tabler/icons-react";
import { createSchema } from "../../schemas/OnBoard.schema";
import variables from "../../styles/variables.module.scss";
import { getOnBoardConfig, onBoardUser } from "../../Api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import AnimatedModal from "./Animated.Modal";
import Toast from "../Toast";
import timer from "../../assets/timer.png";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const deepGet = (obj, keys) => keys.reduce((xs, x) => xs?.[x] ?? null, obj);

const deepGetByPaths = (obj, ...paths) =>
  paths.map((path) =>
    deepGet(
      obj,
      path
        .replace(/\[([^\[\]]*)\]/g, ".$1.")
        .split(".")
        .filter((t) => t !== "")
    )
  );

function OnBoard() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext); 

  useEffect(()=>{
    if(user?.registeredForStore == "approved"){
      navigate("/dashboard/yourAccount")
    }
  },[])

  if (user?.registeredForStore == "pending") {
    return (
      <div className="wrapper">
        <div className="onboard-status-container">
          <img src={timer}></img>
          <h1>Registration under review</h1>
          <p>
            Your store registration is currently under review. Our team is
            diligently processing your application. Please expect an update from
            us shortly.
          </p>
          <p></p>
        </div>
      </div>
    );
  }
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [namee, setNamee] = useState("haha");
  useEffect(() => {
    setShowRejected(user?.registeredForStore === "rejected" ? true : false);
  }, [user]);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });

  const { data, isError, isPending } = useQuery({
    queryKey: ["onBoardingConfig"],
    queryFn: (obj) => {
      return getOnBoardConfig();
    },
    retry: 1,
  });
  const [form, setForm] = useState({});
  useEffect(() => {
    if (!isPending) {
      setForm(data);
    }
  }, [data]);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        localStorage.setItem("lat", latitude);
        localStorage.setItem("long", longitude);
      },
      (error) => {}
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
  const traverseAndAppend = (obj, formData, parentKey = "") => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const formKey = parentKey ? `${parentKey}.${key}` : key;

      if (value instanceof File) {
        formData.append(formKey, value);
      } else if (typeof value === "object" && value !== null) {
        traverseAndAppend(value, formData, formKey);
      } else {
        formData.append(formKey, value);
      }
    });
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues: !isPending ? generateInitialValues(form) : "",
    enableReinitialize: true,
    validationSchema: !isPending && createSchema(form),
    initialTouched: {},
    onSubmit: (values) => {
      const formData = new FormData();
      traverseAndAppend(values, formData);
      formData.append("latitude", localStorage.getItem("lat"));
      formData.append("longitude", localStorage.getItem("long"));
      submitOnBoard.mutate(formData);
    },
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isSubmitting]);
  const submitOnBoard = useMutation({
    mutationFn: (formData) => {
      return onBoardUser(formData);
    },
    onSuccess: (message) => {
      resetForm();
      setShowSuccessModal(true);
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message.response.data?.message,
        status: "error",
      });
      console.log(message);
    },
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  return (
    <div className="form-container">
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      {showRejected && (
        <AnimatedModal
          status={"rejected"}
          setShowRejected={setShowRejected}
          setNamee={setNamee}
        />
      )}
      {showSuccessModal && <AnimatedModal status={"success"} />}
      <div className="wrapper">
        <form onSubmit={handleSubmit} className="onBoard-form">
          {/* <input name="ownerName" onChange={handleChange} onBlur={handleBlur}></input> */}
          {!isPending &&
            values &&
            Object.keys(form).map((keyName, index) => {
              if (Object.keys(form).length - 1 === index) {
                return generateForm(form[keyName], keyName, "set", true);
              } else {
                return generateForm(form[keyName], keyName, "set", false);
              }
            })}
        </form>
      </div>
    </div>
  );

  function generateForm(set, keyName, type = "set", formEnd = false) {
    let formSet = "";
    if (Array.isArray(set)) {
      return (
        <div className={`${type}-container`}>
          <h1 className={type}>{keyName}</h1>
          <div className="set-fields-container">
            {set.map((field) => generateField(field))}
          </div>
          {formEnd && (
            <button
              type="submit"
              className="form-submit"
              onSubmit={handleSubmit}
              disabled={submitOnBoard.isPending}
            >
              Submit
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div className="set-container">
          <h1 className={type}>{keyName}</h1>
          {Object.keys(set).map((subSet) => {
            return generateForm(set[subSet], subSet, "subset", false);
          })}
          {formEnd && (
            <button
              type="submit"
              className="form-submit"
              onSubmit={handleSubmit}
              disabled={submitOnBoard.isPending}
            >
              Submit
            </button>
          )}
        </div>
      );
    }
  }
  function generateField(field) {
    let fieldTouched = deepGetByPaths(touched, field.name)[0];
    let fieldError = deepGetByPaths(errors, field.name)[0];

    let style = {
      borderColor: fieldTouched && fieldError ? variables.error : "",
    };
    if (
      field.type === "text" ||
      field.type === "number" ||
      field.type === "tel" ||
      field.type === "email"
    ) {
      return (
        <div className="input-wrapper">
          <label htmlFor={field.name}>{field.label}</label>

          <input
            type={field.type}
            name={field.name}
            onChange={handleChange}
            onBlur={handleBlur}
            value={deepGetByPaths(values, field.name) || ""}
            style={style}
          />
          <p className="input-error">{fieldTouched && fieldError}</p>
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div className="input-wrapper">
          <label htmlFor={field.name}>{field.label}</label>
          <select
            name={field.name}
            onChange={handleChange}
            defaultValue=""
            className="minimal"
            style={style}
          >
            <option value="" disabled className="dummy-field">
              Select {field.label}
            </option>
            {field.depends
              ? field.depends?.with[values[field.depends.on]]?.map(
                  (option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  )
                )
              : field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            {}
          </select>
          <p className="input-error">{fieldTouched && fieldError}</p>
        </div>
      );
    }

    if (field.type === "radio") {
      return (
        <div className="input-wrapper">
          <label>{field.label}</label>
          <div className="radio-buttons-group">
            {field.options.map((option) => (
              <div className="radio-button">
                <input
                  type={field.type}
                  onChange={handleChange}
                  name={field.name}
                  value={option}
                  checked={values[field.name] === option}
                />
                <label key={option} htmlFor={field.name}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          <p className="input-error">{fieldTouched && fieldError}</p>
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <>
          <label htmlFor={field.name}>
            <input
              type={field.type}
              onChange={handleChange}
              name={field.name}
              value={field.value}
            />
            {field.value}
          </label>
        </>
      );
    }

    if (field.type === "file" && field.accept === "image/*") {
      return (
        <div className="input-image-wrapper">
          <label htmlFor={field.name}>{field.label}</label>
          {getDataFromKey(field.name) && (
            <div className="selected-image">
              <img src={generatePreviewImage(getDataFromKey(field.name))}></img>
              <button
                className="delete-image icon-button"
                onClick={() => {
                  setFieldValue(field.name, "");
                }}
              >
                <IconX size={18} stroke={1.4}></IconX>
              </button>
            </div>
          )}
          {!getDataFromKey(field.name) && (
            <>
              <label
                className="image-selector"
                style={{
                  color:
                    fieldTouched && fieldError
                      ? variables.error
                      : variables.accent_color,
                  ...style,
                }}
              >
                <IconCamera
                  size={35}
                  stroke={1.2}
                  style={{ pointerEvents: "none", ...style }}
                ></IconCamera>
                <input
                  type={field.type}
                  name={field.name}
                  accept={field.accept}
                  onChange={(event) =>
                    setFieldValue(field.name, event.currentTarget.files[0])
                  }
                />
              </label>
              <p className="input-error">{fieldTouched && fieldError}</p>
            </>
          )}
        </div>
      );
    }
  }

  function generateInitialValues(config) {
    let initialValues = {};
    Object.keys(config).forEach((keyName) => {
      if (Array.isArray(config[keyName])) {
        config[keyName].forEach((field) => {
          if (field.name.includes(".")) {
            const [parent, child] = field.name.split(".");
            if (!initialValues[parent]) {
              initialValues[parent] = {};
            }
            initialValues[parent][child] = field.type === "file" ? null : "";
          } else {
            initialValues[field.name] = field.type === "file" ? null : "";
          }
        });
      } else {
        initialValues = {
          ...initialValues,
          ...generateInitialValues(config[keyName]),
        };
      }
    });
    return initialValues;
  }

  function generatePreviewImage(file) {
    const fileURL = URL.createObjectURL(file);
    return fileURL;
  }
  function getDataFromKey(keyName) {
    let value = values;
    const receivedKey = keyName.split(".");
    for (let k of receivedKey) {
      value = value[k] || "";
    }
    return value;
  }

  function access(path, object) {
    return path.split(".").reduce((o, i) => o[i], object);
  }
}

export default OnBoard;
