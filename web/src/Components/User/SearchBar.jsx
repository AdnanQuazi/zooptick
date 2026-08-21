import {
  IconCaretDownFilled,
  IconCurrentLocation,
  IconMapPin,
  IconMapPinFilled,
  IconPhone,
  IconPhoneCall,
  IconPhoneFilled,
  IconPinFilled,
  IconPointFilled,
  IconSearch,
} from "@tabler/icons-react";
import variables from "../../styles/variables.module.scss";
import { useEffect, useRef, useState } from "react";
import "../../styles/searchbar.css";
import { useMutation } from "@tanstack/react-query";
import { getCurrentLocation, searchStores } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import useOutsideClick from "./useOutsideClick";

function SearchBar() {
    const navigate = useNavigate()
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("currentLocation") || null
  );
  const [openLocationMenu, setOpenLocationMenu] = useState(false);
  const [stores, setStores] = useState([]);
  const storesRef = useOutsideClick(() => setStores([]));

  const handleKeyDown = async (event) => {
    const query = event.target.value
    if (event.key === "Enter") {
      navigate(
        `/?rawQuery=${query}&city=${localStorage.getItem("city") || ""}`
      );
    }
  };

  const fetchCurrentLocation = useMutation({
    mutationFn: ({ latitude, longitude }) => {
      return getCurrentLocation(latitude, longitude);
    },
    onSuccess: (message) => {
      localStorage.setItem("currentLocation", `${message.address}`);
      localStorage.setItem("city", `${message.city}`);
      setCurrentLocation(`${message.address}`);
    },
    onError: (message) => {
      console.log(message);
    },
  });
  const fetchStores = useMutation({
    mutationFn: (search) => {
      return searchStores(search);
    },
    onSuccess: (message) => {
      setStores(message);
    },
    onError: (message) => {
      console.log(message);
    },
  });

  function debounce(cb, delay = 500) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }
  const handleStoreChange = debounce((event) => {
    const value = event.target.value;
    fetchStores.mutate({ search: value });
  });

  function CurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          localStorage.setItem("lat", latitude);
          localStorage.setItem("long", longitude);
          fetchCurrentLocation.mutate({ latitude, longitude });
        },
        (error) => {}
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function handleLocationMenu() {
    setOpenLocationMenu((prev) => !prev);
  }
  return (
    <div className="search-box-group">
      <div className="search-products-container">
        <div className="location-container">
          <IconMapPinFilled size={22} color={variables.accent_color} />
          <p>{currentLocation ? currentLocation : "Location..."}</p>
          <button
            className="icon-button-transparent"
            onClick={handleLocationMenu}
          >
            <IconCaretDownFilled size={22} />
          </button>

          <div
            className={`location-menu ${
              openLocationMenu ? "location-menu-enter" : "location-menu-exit"
            }`}
          >
            <button
              className="detect-current-location"
              onClick={CurrentLocation}
            >
              <IconCurrentLocation
                size={22}
                stroke={1.2}
                color={variables.accent_color}
              />
              Detect Current Location
            </button>
          </div>
        </div>

        <hr></hr>
        <div className="search-box-products">
          <input placeholder="Search for Products..." onKeyDown={handleKeyDown}></input>
          <button className="search-button">
            <IconSearch size={22} />
          </button>
        </div>
      </div>

      <div className="search-store-container">
        <div className="search-box-store">
          <input
            placeholder="Search for Stores..."
            onChange={handleStoreChange}
          ></input>
          <button className="search-button">
            <IconSearch size={22} />
          </button>
        </div>

        {stores.length > 0 ? (
          <div className="store-results-container" ref={storesRef}>
            {stores.map((store) => (
              <>
                <div className="store" onClick={()=>{navigate(`/store/?_id=${store._id}`)}}>
                  <img src={store.shopLogo}></img>
                  <div className="details-container">
                    <div className="details-status">
                      <p className="name">{store.shopName}</p>
                      <p
                        style={{
                          color: store.storeOpen
                            ? variables.success
                            : variables.error,
                        }}
                      >
                        <IconPointFilled
                          size={20}
                          color={
                            store.storeOpen
                              ? variables.success
                              : variables.error
                          }
                        />
                        {store.storeOpen ? "Open Now" : "Closed Now"}
                      </p>
                    </div>
                    <p className="contact-number">{store.contactNumber}</p>
                    <p className="address">{store.address}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default SearchBar;
