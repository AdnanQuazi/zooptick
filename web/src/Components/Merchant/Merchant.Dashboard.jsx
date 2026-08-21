import {
  IconBox,
  IconBuildingWarehouse,
  IconGiftCard,
  IconLayoutSidebarLeftExpandFilled,
  IconLogout,
  IconMenu2,
  IconRosetteDiscount,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import Navbar from "../../Layout/Navbar";
import "../../styles/merchantDashboard.css";
import "../../styles/index.css";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import MerchantAccount from "./Merchant.YourAccount";
import MerchantCurrentOrders from "./Merchant.CurrentOrders";
import MerchantOrderHistory from "./Merchant.OrderHistory";
import MerchantAddProdcut from "./Merchant.AddProduct";
import MerchantProducts from "./Merchant.Products";
import EditProduct from "./Mechant.EditProdcut";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Loyalty from "./Merchant.Loyalty";
import logo from "../../assets/zooptickWhite.svg"
import MerchantInactiveProducts from "./Merchant.InactiveProducts";
import Inventory from "./Merchant.Inventory";
import useOutsideClick from "../User/useOutsideClick";

function MerchantDashboard() {
  const { "*": splat } = useParams();
  console.log(splat);
  const navigate = useNavigate()
  const {logoutUser} = useContext(AuthContext)
  const [width, setWidth] = useState(window.innerWidth);

  const [openSidebar,setOpenSidebar] = useState(width > 1150 ? true : false)
  return (
    <>
      <div className="dashboard-container">
        <div className="sidenav-container" style={{left : openSidebar ? "0" : "-100%"}}>
          <div className="logo-container">
            <img style={{cursor : "pointer"}} onClick={()=>{navigate("/")}} src={logo}></img>
          </div>  
          <div className="sidenav-links-container">
            <div className="sidenav-primary-links-container">
              <ul>
                <li>
                  <Link to="yourAccount">
                    <button
                      type="button"
                      className={`sidenav-links-button ${
                        splat === "yourAccount" && "active"
                      }`}
                    >
                      <IconUser size={24} stroke={2} /> Your Account
                    </button>
                  </Link>
                </li>
                <li id="dropdown-button">
                  <button
                    type="button"
                    className={`sidenav-links-button ${
                      (splat == "currentOrders" || splat === "orderHistory") &&
                      "active"
                    }`}
                  >
                    <IconShoppingBag size={24} stroke={2} /> Orders
                  </button>

                  <ul className="submenu">
                    <li>
                      <Link to="currentOrders">
                        <button type="button" className="submenu-button">
                          Current Orders
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="orderHistory">
                        <button type="button" className="submenu-button">
                          Order History
                        </button>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li id="dropdown-button">
                  <button
                    type="button"
                    className={`sidenav-links-button ${
                      (splat == "products" || splat === "addProduct" || splat === "inactiveProducts") &&
                      "active"
                    }`}
                  >
                    <IconBox size={24} stroke={2} /> Products
                  </button>
                  <ul className="submenu">
                    <li>
                      <Link to="addProduct">
                        <button type="button" className="submenu-button">
                          Add Product
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="products">
                        <button type="button" className="submenu-button">
                          Products List
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="inactiveProducts">
                        <button type="button" className="submenu-button">
                          Inactive Products
                        </button>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                <Link to="inventory">
                    <button
                      type="button"
                      className={`sidenav-links-button ${
                        splat === "inventory" && "active"
                      }`}
                    >
                      <IconBuildingWarehouse size={24} stroke={2} /> Inventory
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="loyalty">
                    <button
                      type="button"
                      className={`sidenav-links-button ${
                        splat === "loyalty" && "active"
                      }`}
                    >
                      <IconGiftCard size={24} stroke={2} /> Gift Card
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sidenav-secondary-links-container">
              <button onClick={logoutUser} type="button" className="sidenav-links-button">
                <IconLogout size={24} stroke={2} /> Logout
              </button>
            </div>
          </div>
        </div>
        <div className="dashboard-data-container">
        <button className="mobile-open-sidebar-button" type="button" onClick={()=>{setOpenSidebar((prevdata) => !prevdata)}}> <IconMenu2 size={22} stroke={1.4}></IconMenu2></button>
          <Routes>
            <Route path="yourAccount" element={<MerchantAccount />}></Route>
            <Route
              path="currentOrders"
              element={<MerchantCurrentOrders />}
            ></Route>
            <Route
              path="orderHistory"
              element={<MerchantOrderHistory />}
            ></Route>
            <Route path="products" element={<MerchantProducts />}></Route>
            <Route path="addProduct" element={<MerchantAddProdcut />}></Route>
            <Route path="products/edit-product" element={<EditProduct />}></Route>
            <Route path="inactiveProducts" element={<MerchantInactiveProducts />}></Route>
            <Route path="inventory" element={<Inventory />}></Route>
            <Route path="loyalty" element={<Loyalty />}></Route>
          </Routes>
        </div>
      </div>
       
    </>
  );
}
export default MerchantDashboard;
