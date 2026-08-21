import { useInfiniteQuery } from "@tanstack/react-query";
import { getOrders } from "../../Api/api";
import Navbar from "../../Layout/Navbar";
import variables from "../../styles/variables.module.scss";
import {
  IconBuildingStore,
  IconCurrencyRupee,
  IconLocationPin,
  IconMapPin,
  IconMapPinFilled,
  IconPhone,
} from "@tabler/icons-react";
import "../../styles/bookings.css";
function Bookings() {
  const setColor = (status) => {
    if (status === "Awaiting Confirmation")
      return { backgroundColor: variables.warning };
    if (status === "Ready for Pickup")
      return { backgroundColor: variables.info };
    if (status === "Collected") return { backgroundColor: variables.success };
  };

  const queryResult = useInfiniteQuery({
    queryKey: ["orders"],
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getOrders({ pageParam }), // 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const orders = queryResult.data?.pages;
  console.log(orders);
  const sortedOrders = orders
    ?.flatMap((data) => data) // Flatten the array of arrays if needed
    .sort((a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime)); // Sort in descending order
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="bookings">
          <h1 className="user-page-heading">Bookings</h1>
          <div
            className="products-container bookings-container"
            style={{ marginTop: "2rem" }}
          >
            {sortedOrders?.map((order, index) => (
              <div className="order-container" key={index}>
                <div className="header">
                  <div className="store-details-container">
                    <div className="store-image">
                      <img src={order.storeImage}></img>
                    </div>
                    <div className="store-name-container">
                      <h1 className="store-name">
                        <IconBuildingStore size={20} stroke={2}></IconBuildingStore>
                        {order.storeName}
                      </h1>
                      <p className="store-address">
                        <IconMapPin size={20} stroke={1.5}> </IconMapPin>
                        {order.address}
                      </p>
                      <p className="store-contact">
                        <IconPhone size={20} stroke={1.5}></IconPhone> {order.contact}
                      </p>
                    </div>
                  </div>
                  <div className="order-status" style={setColor(order.orderStatus)}>
                    <p>{order.orderStatus}</p>
                  </div>
                  
                </div>
                <div className="body">
                  {order.products.map((product, index) => (
                    <div className="order" key={index}>
                      <div className="order-image-container">
                        <img className="order-image" src={product.image}></img>
                      </div>
                      <div className="order-details-container">
                        <h1 className="product-name">{product.name}</h1>
                        <div className="order-variants-container">
                          <div className="variant">
                            <p className="variantAttr">Size: </p>
                            <p className="variantVal">{product.size}</p>
                          </div>
                          <div className="variant">
                            <p className="variantAttr">Color: </p>
                            <p className="variantVal">{product.color}</p>
                          </div>
                        </div>
                        <div className="quantity-container">
                          <p className="variantAttr">Qty: </p>
                          <p className="variantVal">{product.quantity}</p>
                        </div>
                        <div className="price-container">
                          <IconCurrencyRupee
                            size={20}
                            stroke={1.8}
                          ></IconCurrencyRupee>
                          {(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="footer">
                  <div className="summary-container">
                    <div className="totals">
                      <div className="sub-total">
                        <p>Sub Total:</p>
                        <p>
                          <div className="price-container">
                            <IconCurrencyRupee
                              size={18}
                              stroke={1.8}
                            ></IconCurrencyRupee>
                            {order.amount.toFixed(2)}
                          </div>
                        </p>
                      </div>
                      <div className="discount">
                        <p>Discount:</p>
                        <p>0.00</p>
                      </div>
                      <div className="grand-total">
                        <p>Grand Total:</p>
                        <p>
                          <div className="price-container">
                            <IconCurrencyRupee
                              size={18}
                              stroke={1.8}
                            ></IconCurrencyRupee>
                            {order.amount.toFixed(2)}
                          </div>
                        </p>
                      </div>
                        <h1>{order.orderId}</h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Bookings;
