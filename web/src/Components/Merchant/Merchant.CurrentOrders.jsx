import {
  IconCaretDownFilled,
  IconChevronDown,
  IconCurrencyRupee,
  IconDots,
  IconPointFilled,
} from "@tabler/icons-react";
import {
  getMerchantAccountInfo,
  getMerchantOrders,
  updateOrderStatus,
} from "../../Api/api";
import noOrder from "../../assets/noOrder.svg";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import avatar from "../../assets/avatar.jpg";
import variables from "../../styles/variables.module.scss";
import Toast from "../Toast";
import Modal from "./Modal";

function MerchantCurrentOrders() {
  const ORDER_READY_FOR_PICKUP = {
    header: "Ready for Pickup ?",
    body: "You cannot cancel the order after marking it as Ready ",
    action: "Confirm",
  };
  const ORDER_COMPLETED = {
    header: "Order Collected ?",
    body: "This order will be marked as completed",
    action: "Confirm",
  };
  const [modal, setModal] = useState({
    open: false,
    color: "",
    header: "",
    body: "",
    action: "",
  });
  const queryClient = useQueryClient();
  const update_order_status = useMutation({
    mutationFn: (param) => {
      return updateOrderStatus(param);
    },
    onSuccess: (message) => {
      setToast({ isVisible: true, message, status: "success" });
      queryClient.invalidateQueries("merchantOrders");
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: "Something went wrong",
        status: "success",
      });
    },
  });

  const queryResult = useInfiniteQuery({
    queryKey: ["merchantOrders"],
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getMerchantOrders({ pageParam }), // 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const [openRows, setOpenRows] = useState({});

  const setColor = (status) => {
    if (status === "Awaiting Confirmation")
      return { backgroundColor: variables.warning };
    if (status === "Ready for Pickup")
      return { backgroundColor: variables.info };
    if (status === "Collecetd") return { backgroundColor: variables.success };
  };

  const toggleRow = (id) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const orders = queryResult.data?.pages;
  console.log(orders);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const handleOrderStatusUpdate = (args) => {
    update_order_status.mutate(args);
  };
  const handleOpenModal = (e, _id, spreader) => {
    e.stopPropagation();
    setModal((prevData) => {
      return {
        ...prevData,
        open: true,
        args: _id,
        color: "red",
        header: spreader.header,
        body: spreader.body,
        action: spreader.action,
      };
    });
  };

  const sortedOrders = orders
    ?.flatMap((data) => data) // Flatten the array of arrays if needed
    .sort((a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime)); // Sort in descending order
  return (
    <>
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <h1>CURRENT ORDERS</h1>
      <div className="dashboard-current-order">
        {orders?.length < 1 ? (
          <img src={noOrder}></img>
        ) : (
          <div className="table-container-orders">
            <table>
              <thead>
                <tr>
                  <th>Sr no.</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders?.map((order, index) => (
                    <>
                      <tr key={index}>
                        <td style={{ minWidth: "auto" }}>{index + 1}</td>
                        <td className="order-id">{order.orderId}</td>
                        <td>{convertToIST(order.bookingDateTime)}</td>
                        <td>
                          <div className="avatar-container">
                            <img
                              src={avatar}
                              className="avatar"
                              alt="avatar"
                            ></img>
                            <div className="user-details">
                              <p>{order.userName}</p>
                              <p>{order.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            className="order-status"
                            style={setColor(order.orderStatus)}
                          >
                            {order.orderStatus}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="table-drop-button"
                            onClick={() => {
                              toggleRow(order.orderId);
                            }}
                          >
                            <IconChevronDown size={20}></IconChevronDown>
                          </button>
                        </td>
                      </tr>
                      <tr className="hidden-row">
                        <td colSpan={6} style={{ width: "100%", padding: "0" }}>
                          <div
                            className={`hidden-row`}
                            style={{
                              height: !openRows[order.orderId] ? "0" : "auto",
                            }}
                          >
                            <table>
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Qty</th>
                                  <th>Price</th>
                                  <th>Tax</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.products.map((product) => (
                                  <tr>
                                    <td>
                                      <div className="product-data">
                                        <img src={product.image}></img>
                                        <div className="product-details">
                                          <p className="product-name">
                                            {product.name}
                                          </p>
                                          {Object.keys(product.variant).map(v => {
                                            return <p className="product-size">
                                              {v} - {product.variant[v]}
                                            </p>
                                          })}
                                        </div>
                                      </div>
                                    </td>
                                    <td>{product.quantity}</td>
                                    <td>
                                      <div className="price-container">
                                        <IconCurrencyRupee
                                          size={18}
                                          stroke={1.8}
                                        ></IconCurrencyRupee>
                                        {product.price}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="price-container">
                                        <IconCurrencyRupee
                                          size={18}
                                          stroke={1.8}
                                        ></IconCurrencyRupee>
                                        {product.totalTax}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="price-container">
                                        <IconCurrencyRupee
                                          size={18}
                                          stroke={1.8}
                                        ></IconCurrencyRupee>
                                        {product.grandTotal}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
                              </div>
                            </div>
                            <div className="action-button-group">
                              {order.orderStatus !== "Collected" && (
                                <button type="button" className="cancel-button">
                                  Cancel Order
                                </button>
                              )}
                              {order.orderStatus == "Awaiting Confirmation" && (
                                <button
                                  className="status-button ready-for-pickup"
                                  onClick={(e) => {
                                    handleOpenModal(
                                      e,
                                      {
                                        status: "Ready for Pickup",
                                        orderId: order.orderId,
                                      },
                                      ORDER_READY_FOR_PICKUP
                                    );
                                  }}
                                >
                                  Order Ready for Pickup
                                </button>
                              )}
                              {order.orderStatus == "Ready for Pickup" && (
                                <button
                                  className="status-button collected"
                                  disabled={order.orderStatus === "Collected"}
                                  onClick={(e) => {
                                    handleOpenModal(
                                      e,
                                      {
                                        status: "Collected",
                                        orderId: order.orderId,
                                      },
                                      ORDER_COMPLETED
                                    );
                                  }}
                                >
                                  Mark as Collected
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal.open && (
        <Modal
          modal={modal}
          setModal={setModal}
          task={handleOrderStatusUpdate}
        />
      )}
    </>
  );
}
export default MerchantCurrentOrders;

function convertToIST(dateString) {
  const date = new Date(dateString);

  // Convert to Indian Standard Time (IST)
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const istDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  // Format the date and time
  const formattedDate = istDate.replace(",", " -");
  return formattedDate;
}
