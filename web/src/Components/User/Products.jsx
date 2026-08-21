import {
  IconCameraCancel,
  IconCircle,
  IconCircleOff,
  IconEdit,
  IconEyeCancel,
  IconLocation,
  IconLocationCheck,
  IconLocationPin,
  IconPencil,
  IconPin,
  IconStarFilled,
  IconTrash,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import variables from "../../styles/variables.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
function Product({ data, modal, setModal, activateProduct, setToast , loadEditOption }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)
  const handleClick = () => {
    navigate(`/product?_id=${data._id}`);
  };
  const {BASEURL} =useContext(AuthContext)
  const navigateToEdit = (e,data) => {
    e.stopPropagation();
    navigate("./edit-product" , {state : data._id})

  };
  const handleOpenModal = (e, _id) => {
    e.stopPropagation();
    setModal((prevData) => {
      return {
        ...prevData,
        open: true,
        args: _id,
        color: "red",
        header: "Disable Product?",
        body:
          "Are you sure you want to deactivate product? This product wont be visible in search results",
        action: "Deactivate",
      };
    });
  };
  const loggedIn = true;
  const styles = {
    backgroundColor : data.status ? "white" : variables.light_gray,
    color : data.status ? "black" : variables.dark_gray 
  }
  return (
    <div
      onClick={handleClick}
      className="product"
      key={data._id}
      style={styles}
    >
      <div className="product-image-container">
        <img
          draggable="false"
          src={data.variants[0].Images[0]}
        ></img>
        <div className="rating-container">
          <span>
            {data.reviews.averageRating}
            <IconStarFilled size={13} stroke={1} />
          </span>
        </div>
      </div>
      <div className="product-details-container">
        {user?.role === 'merchant' && loadEditOption && (
          <div className="edit-product-div">
            <button
              onClick={(e)=> {
                navigateToEdit(e,data)
              }}
              className="icon-with-text-button"
              style={{ width: "100%" }}
            >
              <IconEdit size={20} stroke={1.4} />
              Edit
            </button>
            {data.status ? (
              <button
                onClick={(e) => {
                  handleOpenModal(e, data._id);
                }}
                className="icon-with-text-button danger-button"
                style={{ width: "100%" }}
              >
                <IconCircleOff size={20} stroke={1.4} />
                Disable
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  activateProduct(data._id);
                }}
                className="icon-with-text-button success-button"
                style={{ width: "100%" }}
              >
                <IconCircle size={20} stroke={1.4} />
                Enable
              </button>
            )}
          </div>
        )}
        <h3 className="product-title">{data.productName}</h3>
        <h4 className="product-desc">{data.desc}</h4>
        <div className="product-price">
          <span className="product-discount">Rs. {parseFloat(data.variants[0].sellingPrice)}</span>
          <span className="product-strikePrice">Rs. {data.variants[0].MRP}</span>
        </div>
        <div className="location-div">
        <IconLocationPin size={15} stroke={2}></IconLocationPin>
        <p className="address">{data.address}</p>
        <p className="city">{data.city}</p>
        </div>
      </div>
    </div>
  );
}
export default Product;
