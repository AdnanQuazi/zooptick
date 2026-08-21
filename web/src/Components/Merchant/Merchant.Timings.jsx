import { IconDeviceFloppy, IconPencil } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
function TimingsForm({ timings , updateMerchantInfo}) {
  const [editable, setEditable] = useState(true);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: timings,
    enableReinitialize: true,
    onSubmit: (values, action) => {
      updateMerchantInfo.mutate({...values,of :"timings"})
    },
  });

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="form-heading">Timings</h2>
        <div className="form-timing-input-container">
          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Mon.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Mon?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">MON</span>
            <input
              type="time"
              id="time"
              name="Mon.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Mon?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Mon.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Mon?.to || ""}
              readOnly={editable}
            ></input>
          </div>
          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Tue.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Tue?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">TUE</span>
            <input
              type="time"
              id="time"
              name="Tue.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Tue?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Tue.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Tue?.to || ""}
              readOnly={editable}
            ></input>
          </div>
          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Wed.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Wed?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">WED</span>
            <input
              type="time"
              id="time"
              name="Wed.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Wed?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Wed.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Wed?.to || ""}
              readOnly={editable}
            ></input>
          </div>
          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Thu.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Thu?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">THU</span>
            <input
              type="time"
              id="time"
              name="Thu.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Thu?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Thu.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Thu?.to || ""}
              readOnly={editable}
            ></input>
          </div>

          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Fri.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Fri?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">FRI</span>
            <input
              type="time"
              id="time"
              name="Fri.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Fri?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Fri.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Fri?.to || ""}
              readOnly={editable}
            ></input>
          </div>
          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Sat.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Sat?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">SAT</span>
            <input
              type="time"
              id="time"
              name="Sat.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Sat?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Sat.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Sat?.to || ""}
              readOnly={editable}
            ></input>
          </div>
          <div className="input-container">
            <input
              type="checkbox"
              id="checkbox-input"
              name="Sun.status"
              onChange={handleChange}
              onBlur={handleBlur}
              checked={values?.Sun?.status || false}
              readOnly={editable}
            ></input>
            <span id="day">SUN</span>
            <input
              type="time"
              id="time"
              name="Sun.from"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Sun?.from || ""}
              readOnly={editable}
            ></input>
            <span id="to">-</span>
            <input
              type="time"
              id="time"
              name="Sun.to"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.Sun?.to || ""}
              readOnly={editable}
            ></input>
          </div>
        </div>
        <div className="buttons-container">
          <button
            className="edit-button"
            type="button"
            onClick={() => setEditable((editable) => !editable)}
          >
          EDIT
          </button>
          <button className="submit-button save-button" type="submit" disabled={editable}>
            SAVE CHANGES
          </button>
        </div>
      </form>
    </>
  );
}

export default TimingsForm;
