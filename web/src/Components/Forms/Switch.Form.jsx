function Switch({ name, value, handleChange, handleBlur }) {
  return (
    <>
      <div className="container">
        <label className="switch" htmlFor="checkbox">
          <input
            type="checkbox"
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            id="checkbox"
          />
          <div className="slider round"></div>
        </label>
      </div>
    </>
  );
}
export default Switch;
