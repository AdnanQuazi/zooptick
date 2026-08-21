import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Layout/Navbar";
import { addToWishlist, getStoreId, product } from "../../Api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import variables from "../../styles/variables.module.scss";
import "../../styles/product.css";
import Toast from "../Toast";
import returns from "../../assets/return.png";
import refunds from "../../assets/refund.png";
import cancel from "../../assets/delivery-box.png";
import exchange from "../../assets/exchange.png";

import {
  IconHeart,
  IconHeartFilled,
  IconShoppingCartFilled,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
const convertNewlinesToBreaks = (text) => {
  return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
};
function Productpage() {
  const { user, fetchProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const [sizeVariation, setSizeVariation] = useState(null);
  const [colorVariation, setColorVariation] = useState(null);
  const [searchParams] = useSearchParams();
  const _id = searchParams.get("_id");

  useEffect(() => {
    setOpenCart(false);
  }, [sizeVariation, colorVariation]);

  const { data, isError, isFetching } = useQuery({
    queryKey: ["product"],
    queryFn: (obj) => {
      return product(_id);
    },
  });
  const getInitialCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      return cart ? cart : {};
    } catch (e) {
      return {};
    }
  };

  const [cart, setCart] = useState(getInitialCart());

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchStoreId = async (productId) => {
    const data = await getStoreId(productId);
    return data;
  };
  const addToCart = async () => {
    try {
      if(!user){
        return navigate("/login")
      }
      const { storeId } = await fetchStoreId(data._id);
      if (!sizeVariation) {
        setToast({
          isVisible: true,
          message: "Please Select Size",
          status: "error",
        });
        return;
      }
      if (!colorVariation) {
        setToast({
          isVisible: true,
          message: "Please Select Color",
          status: "error",
        });
        return;
      }

      setCart((prevData) => {
        const storeCart = prevData[storeId] || {};
        const productId = data._id;
        const productKey = `${productId}-${sizeVariation}-${colorVariation}`;
        const existingProduct = storeCart[productKey];

        if (existingProduct) {
          // Increase quantity if the product with the same size and color already exists
          return {
            ...prevData,
            [storeId]: {
              ...storeCart,
              [productKey]: {
                ...existingProduct,
                quantity: existingProduct.quantity + 1,
              },
            },
          };
        } else {
          // Add a new product if it doesn't exist
          return {
            ...prevData,
            [storeId]: {
              ...storeCart,
              [productKey]: {
                productId,
                productName: data.productName,
                desc: data.desc,
                photoUrl: data.images[0],
                size: sizeVariation,
                color: colorVariation,
                price: data.price,
                image: data.images[0],
                quantity: 1,
              },
            },
          };
        }
      });

      setOpenCart(true);
      setToast({
        isVisible: true,
        message: "Product Added To Cart",
        status: "success",
      });
    } catch (error) {
      setToast({
        isVisible: true,
        message: "Failed to add product to cart",
        status: "error",
      });
    }
  };
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const navigateToCart = () => {
    navigate("/cart");
  };
  const updateWishlist = useMutation({
    mutationFn: (data) => {
      return addToWishlist(data);
    },
    onSuccess: (message) => {
      setToast({ isVisible: true, message, status: "success" });
      fetchProfile();
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message.response.data.message,
        status: "error",
      });
    },
  });
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
      {data && (
        <div className="product-outer-container">
          <div className="wrapper">
            <div className="product-container">
              <div className="images-container">
                {data.variants[0].Images.map((image) => {
                  return <img key={image} src={image}></img>;
                })}
              </div>
              <div className="details-container">
                <h1 className="title">{data.productName}</h1>
                <div className="rating-container">
                  <div className="average-rating">
                    <span>{data.reviews.averageRating}</span>
                    <IconStarFilled
                      size={14}
                      stroke={1.4}
                      color={variables.accent_color}
                    ></IconStarFilled>
                  </div>
                  <div className="separator">|</div>
                  <div className="total-reviews">
                    <span>{data.reviews.numberOfReviews} Ratings</span>
                  </div>
                </div>
                <hr></hr>
                <div className="price-container">
                  <h2 className="product-price">Rs {data.price}</h2>
                  <h2 className="product-price-striked">MRP {data.MRP}</h2>
                </div>
                <small className="tax-note">Inclusive of all taxes</small>
                <div className="variations-container-size">
                  <h2>Select Size</h2>
                  <div className="variations-data-container">
                    {data.category === "Clothing" && data.sizes
                      && Object.keys(data?.sizes)?.map((keyName) => {
                          if (data?.sizes[keyName]?.quantity > 0) {
                            return (
                              <button
                                key={keyName}
                                style={{
                                  outlineColor:
                                    sizeVariation === keyName
                                      ? variables.accent_color
                                      : variables.light_gray,
                                }}
                                onClick={() => {
                                  setSizeVariation(keyName);
                                }}
                              >
                                {keyName}
                              </button>
                            );
                          } else {
                            return (
                              <button
                                key={keyName}
                                disabled={true}
                                style={{
                                  textDecoration: "line-through",
                                  cursor: "no-drop",
                                }}
                              >
                                {keyName}
                              </button>
                            );
                          }
                        })}
                    {data.category === "Footwear" &&
                      data.sizesFootwear["UK/IND"].map((item, index) => {
                        if (data.sizesFootwear.Quantity[index] > 0) {
                          return (
                            <button
                              key={"UK/IND"}
                              style={{
                                outlineColor:
                                  sizeVariation === `UK/IND-${item}`
                                    ? variables.accent_color
                                    : variables.light_gray,
                              }}
                              onClick={() => {
                                setSizeVariation(`UK/IND-${item}`);
                              }}
                            >
                              {`UK/IND-${item}`}
                            </button>
                          );
                        } else {
                          return (
                            <button
                              key={"UK/IND"}
                              disabled={true}
                              style={{
                                textDecoration: "line-through",
                                cursor: "no-drop",
                              }}
                            >
                              {`UK/IND-${item}`}
                            </button>
                          );
                        }
                      })}
                  </div>
                </div>
                {data.colors.length > 0 && (
                  <div className="variations-container-color">
                    <h2>Select Color</h2>
                    <div className="variations-data-container">
                      {data.colors.map((color) => {
                        return (
                          <div key={color} className="color-button-container">
                            <button
                              className="color-buttons"
                              style={{
                                outlineColor:
                                  colorVariation === color
                                    ? variables.accent_color
                                    : variables.light_gray,
                              }}
                              onClick={() => {
                                setColorVariation(color);
                              }}
                            >
                              {color}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="main-buttons-container">
                  {openCart ? (
                    <button
                      type="button"
                      onClick={navigateToCart}
                      className="add-to-cart icon-with-text-button"
                    >
                      {" "}
                      <IconShoppingCartFilled
                        size={22}
                        stroke={1.4}
                      ></IconShoppingCartFilled>{" "}
                      GO TO CART
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={addToCart}
                      className="add-to-cart icon-with-text-button"
                    >
                      {" "}
                      <IconShoppingCartFilled
                        size={22}
                        stroke={1.4}
                      ></IconShoppingCartFilled>{" "}
                      ADD TO CART
                    </button>
                  )}
                  {!user?.wishlist?.includes(data._id) ? (
                    <button
                      type="button"
                      className="icon-button-transparent"
                      onClick={() => {
                        updateWishlist.mutate({ task: "add", id: data._id });
                      }}
                    >
                      <IconHeart size={30} stroke={1.4}></IconHeart>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="icon-button-transparent"
                      onClick={() => {
                        updateWishlist.mutate({ task: "remove", id: data._id });
                      }}
                    >
                      <IconHeartFilled
                        size={30}
                        stroke={1.4}
                        color={variables.error}
                      ></IconHeartFilled>
                    </button>
                  )}
                </div>
                <hr></hr>
                <div className="services-container">
                  <div className="service">
                    <img src={returns}></img>
                    <p>Spot Returns</p>
                  </div>
                  <div className="service">
                    <img src={exchange}></img>
                    <p>Spot Exchange</p>
                  </div>
                  <div className="service">
                    <img src={cancel}></img>
                    <p>Spot Cancellations</p>
                  </div>{" "}
                  <div className="service">
                    <img src={refunds}></img>
                    <p>100% Refund</p>
                  </div>
                </div>
                <a href="/terms" className="services-note">
                  Please refer to our terms and policies for more details*
                </a>
                <div className="description-container">
                  <h1>Description</h1>
                  {convertNewlinesToBreaks(data.desc)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Productpage;
