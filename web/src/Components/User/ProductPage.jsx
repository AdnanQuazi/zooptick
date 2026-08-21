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
  const [searchParams] = useSearchParams();
  const _id = searchParams.get("_id");

  const { data, isError, isFetching, isPending } = useQuery({
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

  const [images, setImages] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [price, setPrice] = useState();
  const [inclusiveTax, setInclusiveTax] = useState();
  const [MRP, setMRP] = useState();
  const [matchingVariant, setMatchingVariant] = useState();
  const [variantId, setVariantId] = useState();
  const addToCart = async () => {
    try {
      if (!user) {
        return navigate("/login");
      }
      const { storeId } = await fetchStoreId(data._id);
      for (const v of data.selectedVariations) {
        if (!selectedVariant[v] || selectedVariant[v] === "") {
          setToast({
            isVisible: true,
            message: `Please Select ${v}`,
            status: "error",
          });
          return;
        }
      }

      setCart((prevData) => {
        const storeCart = prevData[storeId] || {};
        const productId = data._id;
        const productKey = `${productId}-${variantId}`;
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
                desc: data.desc || "",
                price: price,
                inclusiveTax: (parseFloat(inclusiveTax)).toFixed(2),
                image: images[0],
                quantity: 1,
                variantId,
                variant: { ...selectedVariant },
                tax: data["GST rate slab"] || 0,
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

  useEffect(() => {
    // Set initial selected variant and images when data is available
    if (data && data.variants.length > 0) {
      const initialVariant = data.variants[0];
      const initialSelectedVariant = data.selectedVariations.reduce(
        (acc, key) => {
          acc[key] = initialVariant[key];
          return acc;
        },
        {}
      );

      setSelectedVariant(initialSelectedVariant);
      setImages(initialVariant.Images);
      setPrice(initialVariant.sellingPrice);
      setInclusiveTax(initialVariant.inclusiveTax);
      setMRP(initialVariant.MRP);
      setVariantId(initialVariant._id);
      setMatchingVariant(initialVariant);
    }
  }, [data]);

  useEffect(() => {
    if (!isPending) {
      setImages(data.variants[0].Images);
    }
  }, [data]);

  const getFilteredVariants = (category, value) => {
    return data.variants.filter((variant) => {
      return Object.keys(selectedVariant).every((key) => {
        if (key === category) return true; // Skip the current category to avoid self-filtering
        return variant[key] === selectedVariant[key];
      });
    });
  };

  const handleVariantSelection = (key, value) => {
    const updatedVariant = { ...selectedVariant, [key]: value };
    setSelectedVariant(updatedVariant);

    // Find the variant that matches the updated selection
    const matchingVariant = data.variants.find((variant) =>
      Object.keys(updatedVariant).every((k) => variant[k] === updatedVariant[k])
    );

    if (matchingVariant) {
      setImages(matchingVariant.Images);
      setPrice(matchingVariant.sellingPrice);
      setInclusiveTax(matchingVariant.inclusiveTax);
      setMRP(matchingVariant.MRP);
      setVariantId(matchingVariant._id);
      setOpenCart(false);
      setMatchingVariant(matchingVariant);
    }
  };
  console.log(variantId);
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
                {images.map((image) => {
                  return <img key={image} src={image}></img>;
                })}
              </div>
              <div className="details-container">
                <h1 className="title">
                  {matchingVariant?.Condition === "Used" ? "(Refurbished)" : ""}{" "}
                  {data.productName}
                </h1>
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
                  <h2 className="product-price">
                    Rs{" "}
                    {parseFloat(price)}
                  </h2>
                  <h2 className="product-price-striked">MRP {MRP}</h2>
                </div>
                <small className="tax-note">Inclusive of all taxes</small>
                <>
                  {data.selectedVariations.map((category) => {
                    const seen = new Set();
                    const filteredVariants = getFilteredVariants(category);
                    return (
                      <div key={category} className="variations-container-size">
                        <h2>Select {category}</h2>
                        <div className="variations-data-container">
                          {filteredVariants.map((variant) => {
                            if (!seen.has(variant[category])) {
                              seen.add(variant[category]);

                              return (
                                <button
                                  key={`${category}-${variant[category]}`}
                                  style={{
                                    outlineColor:
                                      selectedVariant[category] ===
                                      variant[category]
                                        ? variables.accent_color
                                        : variables.light_gray,
                                  }}
                                  onClick={() => {
                                    handleVariantSelection(
                                      category,
                                      variant[category]
                                    );
                                  }}
                                >
                                  {variant[category]}
                                </button>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
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
                {/* <div className="services-container">
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
                </a> */}

                <div className="description-container">
                  <h1>SELLER</h1>
                  <a
                    className="seller-link"
                    target="_blank"
                    href={`/store/?_id=${data.storeId}`}
                  >
                    {data.shopName}
                  </a>
                </div>
                <div className="description-container">
                  <h1>BRAND</h1>
                  <p>{data.brand}</p>
                </div>
                <div className="description-container">
                  <h1>DESCRIPTION</h1>
                  <p>{convertNewlinesToBreaks(data.desc)}</p>
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
