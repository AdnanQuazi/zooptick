import errorimg from "../assets/error404.svg"
function Error404() {
  return (
    <div className="error-div">
      <img src={errorimg} alt="ERROR 404"></img>
    </div>
  );
}
export default Error404;
