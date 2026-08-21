import { useContext, useEffect, useState } from "react";
import { getStoreName } from "../../Api/api";
import Navbar from "../../Layout/Navbar";
import "../../styles/cart.css";
import variables from "../../styles/variables.module.scss";
import {
  IconCurrencyRupee,
  IconMinus,
  IconPlus,
  IconTrashFilled,
} from "@tabler/icons-react";
import { AuthContext } from "../../Context/AuthContext";
import emptyCart from "../../assets/emptyCart.png";
import axios from "axios";
import OrderModal from "../Merchant/OrderModal";
function Cart() {
  const getInitialCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      return cart ? cart : {};
    } catch (e) {
      return {};
    }
  };
  const [loading, setLoading] = useState(false);
  const { BASEURL, user } = useContext(AuthContext);
  const [cart, setCart] = useState(getInitialCart());
  const [storeIds, setStoreIds] = useState(Object.keys(cart));
  const [storeNames, setStoreNames] = useState({});
  const [selectedStore, setSelectedStore] = useState(storeIds[0]);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [orderStatus,setOrderStatus] = useState()

  const isCartEmpty = (cart) => {
    // Check if the cart object is empty
    if (Object.keys(cart).length === 0) {
      return true;
    }

    // Check if all store IDs in the cart are empty
    for (const storeId in cart) {
      if (Object.keys(cart[storeId]).length > 0) {
        return false;
      }
    }

    return true;
  };

  const fetchStoreNames = async (storeIds) => {
    try {
      const responses = await Promise.all(
        storeIds.map((id) => getStoreName(id))
      );
      const names = responses.reduce((acc, response, index) => {
        acc[storeIds[index]] = response.soldBy; // Adjust according to your API response structure
        return acc;
      }, {});
      setStoreNames(names);
    } catch (error) {
      console.error("Error fetching store names:", error);
    }
  };
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Effect to fetch store names whenever storeIds changes
  useEffect(() => {
    if (storeIds.length > 0) {
      fetchStoreNames(storeIds);
    }
  }, [storeIds]);

  const deleteProduct = (productKey) => {
    setCart((prevData) => {
      const storeCart = prevData[selectedStore];
      const { [productKey]: _, ...newStoreCart } = storeCart;

      // Check if the new store cart is empty
      if (Object.keys(newStoreCart).length === 0) {
        const { [selectedStore]: __, ...newCart } = prevData;
        const remainingStoreIds = Object.keys(newCart);

        // Set selectedStore to the first available store if any exist, otherwise null
        setSelectedStore(
          remainingStoreIds.length > 0 ? remainingStoreIds[0] : null
        );
        setStoreIds(remainingStoreIds);
        return newCart;
      }

      return {
        ...prevData,
        [selectedStore]: newStoreCart,
      };
    });
  };
  const decreaseQuantity = (productKey) => {
    setCart((prevData) => {
      const storeCart = prevData[selectedStore];
      const product = storeCart[productKey];

      if (product.quantity === 1) {
        // Remove the product if the quantity is 1
        const { [productKey]: _, ...newStoreCart } = storeCart;

        // Check if the new store cart is empty
        if (Object.keys(newStoreCart).length === 0) {
          const { [selectedStore]: __, ...newCart } = prevData;
          return newCart;
        }

        return {
          ...prevData,
          [selectedStore]: newStoreCart,
        };
      } else {
        // Decrease the quantity by 1
        return {
          ...prevData,
          [selectedStore]: {
            ...storeCart,
            [productKey]: {
              ...product,
              quantity: product.quantity - 1,
            },
          },
        };
      }
    });
  };

  function addQuantity(productKey) {
    setCart((prevData) => {
      const storeCart = prevData[selectedStore] || {};
      const existingProduct = storeCart[productKey];
      return {
        ...prevData,
        [selectedStore]: {
          ...storeCart,
          [productKey]: {
            ...existingProduct,
            quantity: existingProduct.quantity + 1,
          },
        },
      };
    });
  }
  useEffect(() => {
    const subTotalValue = calculateTotalPrice();
    const taxValue = 0;
    const totalValue = subTotalValue + taxValue;

    setSubTotal(parseFloat(subTotalValue).toFixed(2));
    setTax(parseFloat(taxValue).toFixed(2));
    setTotal(parseFloat(totalValue).toFixed(2));
  }, [selectedStore, cart]);

  const calculateTax = () => {
    const storeCart = cart[selectedStore];
    if (!storeCart) {
      return 0; // If the storeId does not exist in the cart, return 0
    }
    return Object.values(storeCart).reduce((tax, product) => {
      return tax + taxation(product.tax, product.price, product.quantity);
    }, 0);
  };

  function taxation(taxPercentage, productPrice, quantity) {
    const totalPrice = productPrice * quantity;
    const taxAmount = (totalPrice * taxPercentage) / 100;
    return taxAmount;
  }

  const calculateTotalPrice = () => {
    const storeCart = cart[selectedStore];
    if (!storeCart) {
      return 0; // If the storeId does not exist in the cart, return 0
    }
    return Object.values(storeCart).reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  function handleStoreChange(store) {
    setSelectedStore(store);
  }

  const [amount, setamount] = useState(350);

  // handlePayment Function
  const removeFromCart = (keyToRemove) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[keyToRemove];
      return newCart;
    });
  };

  const handleCop = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASEURL}/cop-order`, {
        products: cart[selectedStore],
      });
      if(response.status === 200){
        setOrderStatus("success")
        setLoading(false)
        removeFromCart(selectedStore)
      }
    } catch (error) {
      setOrderStatus("failed")
      setLoading(false);
      console.log(error);
    }
  };
  const handlePayment = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await axios.post(`${BASEURL}/create-order`, {
        products: cart[selectedStore],
      });
      handlePaymentVerify(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // handlePaymentVerify Function
  const handlePaymentVerify = async (data) => {
    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID_PROD,
      amount: data.amount,
      currency: data.currency,
      name: "Zooptick",
      description: "Test Mode",
      order_id: data.id,
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: user?.name, //your customer's name
        email: user?.email,
      },
      handler: async (response) => {
        try {
          setLoading(true);
          const { data } = await axios.post(`${BASEURL}/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            products: cart[selectedStore],
          });

          if (data.message) {
            setLoading(false);
            console.log(data.message);
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      },
      theme: {
        color: "#a885e8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <Navbar />
      {orderStatus && <OrderModal status={orderStatus}/>}
      {isCartEmpty(cart) ? (
        <div className="emptycart-container">
          <img src={emptyCart}></img>
          <h1>Looks So Empty !</h1>
        </div>
      ) : (
        <div className="cart-outer-container">
          <div className="wrapper">
            <div className="cart-container">
              <div className="store-list-container">
                {storeIds &&
                  storeIds.map((store, index) => {
                    return (
                      <>
                        <button
                          onClick={() => {
                            handleStoreChange(store);
                          }}
                          className="store-selector-button"
                          style={{
                            borderBottom:
                              selectedStore === store
                                ? `2px solid ${variables.accent_color}`
                                : "",
                          }}
                        >
                          {storeNames[store]}
                        </button>
                      </>
                    );
                  })}
              </div>
              <div className="cart-data">
                {cart[selectedStore] && (
                  <div className="products-data">
                    {Object.entries(cart[selectedStore]).map(
                      ([productId, product]) => {
                        return (
                          <div className="product-div" key={product.name}>
                            <div className="product-details-container">
                              <div className="product-image-container">
                                <img src={product.image}></img>
                              </div>
                              <div className="product-data-container">
                                <h1 className="product-name">
                                  {product.productName}
                                </h1>
                                <div className="variations-container">
                                  {Object.keys(product.variant).map((k) => {
                                    return (
                                      <div className="variation-size">
                                        <span className="variation-key">
                                          {k} :
                                        </span>
                                        <span className="variation-value">
                                          {product.variant[k]}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="product-price">
                                  <h1 className="product-price-data">
                                    Rs {product.price}
                                  </h1>
                                </div>
                              </div>
                            </div>
                            <hr></hr>
                            <div className="product-buttons-container">
                              <div className="quantity-buttons-container">
                                <button
                                  onClick={() => {
                                    decreaseQuantity(productId);
                                  }}
                                >
                                  <IconMinus size={18} stroke={1.4}></IconMinus>
                                </button>
                                <span>{product.quantity}</span>
                                <button
                                  onClick={() => {
                                    addQuantity(productId);
                                  }}
                                >
                                  <IconPlus
                                    size={18}
                                    stroke={1.4}
                                    color={variables.success}
                                  ></IconPlus>
                                </button>
                              </div>

                              <button
                                onClick={() => {
                                  deleteProduct(productId);
                                }}
                                className="icon-with-text-button danger-button"
                              >
                                <IconTrashFilled
                                  size={18}
                                  stroke={1.4}
                                ></IconTrashFilled>{" "}
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                <div className="products-pricing">
                  <h1>Order Summary</h1>
                  <div className="sub-total-container">
                    <h2>Sub Total</h2>
                    <h2 className="price">
                      <IconCurrencyRupee size={20} stroke={1.8} />
                      {subTotal}
                    </h2>
                  </div>
                  {/* <div className="sub-total-container">
                    <h2>Tax</h2>
                    <h2 className="price">
                      <IconCurrencyRupee size={20} stroke={1.8} />
                      {tax}
                    </h2>
                  </div> */}
                  <div className="sub-total-container">
                    <h2>Booking Charges</h2>
                    <h2 className="price">Free</h2>
                  </div>
                  <hr></hr>
                  <div className="sub-total-container">
                    <h2>Total</h2>
                    <h2 className="price">
                      <IconCurrencyRupee size={20} stroke={1.8} />
                      {total}
                    </h2>
                  </div>
                  <div className="order-buttons-group">
                    <button
                      className="cop-button normal-button"
                      onClick={handleCop}
                      disabled={loading}
                    >
                      Pay With Cash
                    </button>
                    <button
                      className="checkout-button normal-button"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      Pay Now
                    </button>
                  </div>
                  <small>
                    Please check the store's opening and closing hours before
                    you arrive to pick up your product(s) to avoid any
                    inconvenience.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
