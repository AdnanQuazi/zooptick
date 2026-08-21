import variables from "../../styles/variables.module.scss";

function CustomSelect({
  type,
  labelFor,
  inputFor,
  handleChange,
  handleBlur,
  isError,
  isTouched,
  val,
  data,
}) {

  return (
    <>
      <div className="input-wrapper-text">
        <label htmlFor={inputFor}>{labelFor}</label>
        <select
          name={inputFor}
          defaultValue={val}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            borderColor:
              isError && isTouched ? variables.error : variables.light_gray,
          }}
        >
          <option value="" disabled>
            Select a {labelFor}
          </option>
          {data.map((elem) => {
            return <option key={elem} value={elem}>{elem}</option>;
          })}
        </select>
        <p className="input-error-text">
          {isError && isTouched ? isError : ""}
        </p>
      </div>
    </>
  );
}
export default CustomSelect;
