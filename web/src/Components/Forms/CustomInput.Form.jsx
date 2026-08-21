import variables from "../../styles/variables.module.scss";

function CustomInput({
  type,
  labelFor,
  inputFor,
  handleChange,
  handleBlur,
  isError,
  isTouched,
  val
}) {
  return (
    <>
      <div className="input-wrapper-text">
        <label htmlFor={inputFor}>{labelFor}</label>
        <input
          name={inputFor}
          type={type || ''}
          value={val}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            borderColor:
              isError && isTouched ? variables.error : variables.light_gray,
          }}
        ></input>
        <p className="input-error-text">
          {isError && isTouched ? isError : ""}
        </p>
      </div>
    </>
  );
}
export default CustomInput