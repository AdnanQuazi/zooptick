import {
  IconBuilding,
  IconBuildingStore,
  IconBurger,
  IconCaretDown,
  IconCaretDownFilled,
  IconCaretUpDownFilled,
  IconCross,
  IconCurrentLocation,
  IconHeart,
  IconLock,
  IconLogout,
  IconMapPin,
  IconMapPinFilled,
  IconMenu2,
  IconNavigation,
  IconPassword,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import logo from "../assets/zooptick.png"
import profile from "../assets/avatar.jpg";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import variables from "../styles/variables.module.scss";
import { useNavigate } from "react-router-dom";
import { replace } from "formik";
import { useMutation } from "@tanstack/react-query";
import { getCurrentLocation } from "../Api/api";
function Navbar() {
  const navigate = useNavigate();
  const [profileMenu, setProfileMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [desktopProfileMenu, setdesktopProfileMenu] = useState(false);
  const { user, loading, logoutUser } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const [showGetLocation, setShowGetLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("currentLocation") || null
  );
  const fetchCurrentLocation = useMutation({
    mutationFn: ({ latitude, longitude }) => {
      return getCurrentLocation(latitude, longitude);
    },
    onSuccess: (message) => {
      localStorage.setItem(
        "currentLocation",
        `${message.address}`
      );
      localStorage.setItem("city", `${message.city}`);
      setCurrentLocation(`${message.address}`);
    },
    onError: (message) => {
      console.log(message);
    },
  });
  function CurrentLocation() {
    setShowGetLocation(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          localStorage.setItem("lat", latitude);
          localStorage.setItem("long", longitude);
          console.log("AshduhASd");
          fetchCurrentLocation.mutate({ latitude, longitude });
        },
        (error) => {}
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function navigateToCart() {
    navigate("/cart", replace);
  }
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      navigate(
        `/?rawQuery=${searchInput}&city=${localStorage.getItem("city") || ""}`
      );
    }
  };
  if (loading) {
    return <></>;
  }
  return (
    <>
      <div
        className="search-box-mobile"
        style={{ display: mobileSearch ? "flex" : "none" }}
      >
        <button
          type="button"
          id="icon-button"
          onClick={() => setMobileSearch((mobileSearch) => !mobileSearch)}
        >
          <IconX size={22} stroke={1.5} />
        </button>
        <input
          type="text"
          placeholder="Search..."
          id="nav-search"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        {/* <div className="search-options-container">
          {!currentLocation ? (
            <div className="search-location-options-container">
              <button
                type="button"
                className="show-location-options"
                onClick={() => {
                  setShowGetLocation((prevData) => !prevData);
                }}
              >
                <IconCaretDownFilled
                  size={22}
                  stroke={1.4}
                  color={variables.dark_gray}
                ></IconCaretDownFilled>
              </button>
              {showGetLocation && (
                <button
                  className="use-current-location-absolute"
                  onClick={CurrentLocation}
                >
                  <IconCurrentLocation size={22}></IconCurrentLocation>
                  Use current location
                </button>
              )}
            </div>
          ) : (
            <div className="search-location-options-container">
              <div className="lc">
                <IconMapPinFilled
                  size={22}
                  stroke={1.4}
                  color={variables.accent_color}
                ></IconMapPinFilled>
                <p>
                  {fetchCurrentLocation.isPending
                    ? "Loading..."
                    : currentLocation}
                </p>
              </div>
              <button
                type="button"
                className="show-location-options"
                onClick={() => {
                  setShowGetLocation((prevData) => !prevData);
                }}
              >
                <IconCaretDownFilled
                  size={22}
                  stroke={1.4}
                  color={variables.dark_gray}
                ></IconCaretDownFilled>
              </button>
              {showGetLocation && (
                <button
                  className="use-current-location-absolute"
                  onClick={CurrentLocation}
                >
                  <IconCurrentLocation size={22}></IconCurrentLocation>
                  Use current location
                </button>
              )}
            </div>
          )}
        </div> */}
      </div>
      <div
        className="nav-menu-mobile"
        style={{ top: mobileNav ? "8rem" : "-100%" }}
      >
        {user ? (
          <>
            <div className="profile-tab-menu">
              <div className="profile-pic-name-wrapper">
                <img src={profile}></img>
                <div className="profile-name-email-container">
                  <h3>{user.name}</h3>
                  <small>{user.email}</small>
                </div>
              </div>
              <button
                type="button"
                id="icon-button"
                onClick={() => setProfileMenu((profileMenu) => !profileMenu)}
              >
                <IconCaretDownFilled size={22} stroke={1.5} />
              </button>
            </div>
            <hr />
            <div
              className="profile-options-mobile"
              style={{ height: profileMenu ? "20rem" : "0" }}
            >
              <ul>
                <li>
                  <Link to='/wishlist'>
                    <IconHeart size={22} stroke={1.5} /> Wishlist
                  </Link>
                </li>
                <hr></hr>
                <li>
                  <Link to="/bookings">
                    <IconBuildingStore size={22} stroke={1.5} /> Bookings
                  </Link>
                </li>
                <hr></hr>
                <li>
                  <Link to='/forgot-password'>
                    <IconLock size={22} stroke={1.5} /> Change Password
                  </Link>
                </li>
                <hr></hr>
                <li>
                  <a className="logout-button" onClick={logoutUser}>
                    <IconLogout size={22} stroke={1.5} /> Logout
                  </a>
                </li>
                <hr></hr>
              </ul>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              style={{ width: "12ch" }}
              className="normal-button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
            <hr></hr>
          </>
        )}
        <div className="nav-links-container">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              {user?.role == "merchant" ? (
                <Link to="/dashboard/currentOrders">Dashboard</Link>
              ) : (
                <Link to="/onboard" style={{ color: variables.accent_color }}>
                  Become a Seller
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      <nav>
        <div className="nav-wrapper">
          <div className="nav-pc-contents">
            <div className="logo-search-container">
            <img onClick={()=>{navigate("/")}} className="logo" style={{cursor : "pointer"}} src={logo}></img>
              <div className="search-bar">
                {/* <div className="search-options-container">
                  {!currentLocation ? (
                    <button
                      className="use-current-location"
                      onClick={CurrentLocation}
                    >
                      <IconCurrentLocation size={22}></IconCurrentLocation>Use
                      current location
                    </button>
                  ) : (
                    <div className="search-location-options-container">
                      <div className="lc">
                        <IconMapPinFilled
                          size={22}
                          stroke={1.4}
                          color={variables.accent_color}
                        ></IconMapPinFilled>
                        <p>
                          {fetchCurrentLocation.isPending
                            ? "Loading..."
                            : currentLocation}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="show-location-options"
                        onClick={() => {
                          setShowGetLocation((prevData) => !prevData);
                        }}
                      >
                        <IconCaretDownFilled
                          size={22}
                          stroke={1.4}
                          color={variables.dark_gray}
                        ></IconCaretDownFilled>
                      </button>
                      <hr></hr>
                      {showGetLocation && (
                        <button
                          className="use-current-location-absolute"
                          onClick={CurrentLocation}
                        >
                          <IconCurrentLocation size={22}></IconCurrentLocation>
                          Use current location
                        </button>
                      )}
                    </div>
                  )}
                </div> */}
                <IconSearch size={22} stroke={1.5} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                ></input>
              </div>
            </div>
            <div className="nav-links-container">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about-us">About us</Link>
                </li>
                <li>
                  {user?.role == "merchant" ? (
                    <Link to="/dashboard/currentOrders">Dashboard</Link>
                  ) : (
                    <Link
                      to="/onboard"
                      style={{ color: variables.accent_color }}
                    >
                      Become a Seller
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <div className="nav-buttons-container">
              {user ? (
                <>
                  <div
                    className="desktop-profile-menu"
                    style={{ display: desktopProfileMenu ? "block" : "none" }}
                  >
                    <div className="profile-tab-menu">
                      <div className="profile-pic-name-wrapper">
                        <img src={profile}></img>
                        <div className="profile-name-email-container">
                          <h3>{user.name}</h3>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div
                      className="profile-options-desktop"
                      style={{ height: "fit-content" }}
                    >
                      <ul>
                        <li>
                          <Link to="/wishlist">
                            <IconHeart size={22} stroke={1.5} /> Wishlist
                          </Link>
                        </li>
                        <hr></hr>
                        <li>
                          <Link to="/bookings">
                            <IconBuildingStore size={22} stroke={1.5} />{" "}
                            Bookings
                          </Link>
                        </li>
                        <hr></hr>
                        <li>
                          <Link to="/forgot-password">
                            <IconLock size={22} stroke={1.5} /> Change Password
                          </Link>
                        </li>
                        <hr></hr>
                        <li>
                          <a className="logout-button" onClick={logoutUser}>
                            <IconLogout size={22} stroke={1.5} /> Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setdesktopProfileMenu((prevData) => !prevData);
                    }}
                    className="icon-button-transparent"
                  >
                    <IconUser size={22} stroke={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={navigateToCart}
                    className="icon-button-transparent"
                  >
                    <IconShoppingCart size={22} stroke={1.5} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    style={{ width: "12ch" }}
                    className="normal-button"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="nav-mobile-contents">
            <div className="logo-container">
              <img onClick={()=>{navigate("/")}} className="logo" style={{cursor : "pointer"}} src={logo}></img>
            </div>
            <div className="nav-buttons-container">
              <button
                type="button"
                className="icon-button-transparent"
                onClick={() => setMobileSearch((mobileSearch) => !mobileSearch)}
              >
                <IconSearch size={22} stroke={1.5} />
              </button>
              <button
                    type="button"
                    onClick={navigateToCart}
                    className="icon-button-transparent"
                  >
                    <IconShoppingCart size={22} stroke={1.5} />
                  </button>
              <button
                type="button"
                className="icon-button-transparent"
                onClick={() => {
                  setMobileNav((mobileNav) => !mobileNav);
                  setProfileMenu(false);
                }}
              >
                <IconMenu2 size={22} stroke={1.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
