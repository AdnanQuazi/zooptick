import {
  IconAdjustmentsHorizontal,
  IconClock,
  IconCoinRupee,
  IconCurrencyRupee,
  IconLocation,
  IconMapPin,
  IconMapPinFilled,
  IconPhone,
  IconPhoneFilled,
  IconPointFilled,
  IconSearch,
} from "@tabler/icons-react";
import footwear from "../../assets/clothing.jpg";
import "../../styles/store.css";
import variables from "../../styles/variables.module.scss";
import { useSearchParams } from "react-router-dom";
import Error404 from "../Error404";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useState } from "react";
import { fetchProducts, getStoreName } from "../../Api/api";

import Product from "./Products";
import { AuthContext } from "../../Context/AuthContext";
function Store() {
  const [openFilter, setOpenFilter] = useState(false);
  const { BASEURL } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("_id");
  const [brand, setBrand] = useState([]);
  const [subCategory, setSubcategory] = useState([]);
  const [rating, setRating] = useState(false);
  const [price, setPrice] = useState("0");
  const [searchInput, setSearchInput] = useState("");
  const [seachQuery, setSearchQuery] = useState({
    mode: "store",
    storeId: query,
    search: searchInput,
    brand,
    rating,
    price,
    subCategory,
  });

  const handleApplyChanges = () => {
    setSearchQuery((prevData) => {
      return {
        ...prevData,
        brand,
        price,
        subCategory,
      }
    })
  }

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      setSearchQuery((prevData) => {
        return {
          ...prevData,
          search: searchInput,
        };
      });
    }
  };

  useEffect(() => {
    setSearchQuery((prevData) => {
      return {
        ...prevData,
        brand,
        price,
        subCategory,
      };
    });
  }, [brand, subCategory]);

  const { data, isError, isFetching } = useQuery({
    queryKey: ["storeInfo"],
    queryFn: (obj) => {
      return getStoreName(query);
    },
    retry: 1,
  });

  const products = useInfiniteQuery({
    queryKey: ["productsListStore"],
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...seachQuery, pageParam }), // 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const [productsData, setProductsData] = useState("");

  useEffect(() => {
    setProductsData(products.data?.pages.flatMap((data) => data)[0]);
  }, [products]);
  console.log(productsData);

  const refetchProducts = (e) => {
    setSearchQuery((prev) => {
      return {
        ...prev,
        search: e.target.value || "",
      };
    });
  };

  useEffect(() => {
    if (seachQuery.search === "") {
      products.refetch();
      return;
    }
    queryClient.setQueryData(["productsList"], (data) => ({
      pages: data?.pages?.slice(0, 1),
      pageParams: data?.pageParams?.slice(0, 1),
    }));
    products.refetch();
  }, [seachQuery]);
  function debounce(cb, delay = 500) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  const handlebBrandChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setBrand((prevData) => {
        return [...prevData, value];
      });
    } else {
      setBrand((prevData) => {
        return prevData.filter((item) => item !== value);
      });
    }
  };
  const handleSubCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSubcategory((prevData) => {
        return [...prevData, value];
      });
    } else {
      setSubcategory((prevData) => {
        return prevData.filter((item) => item !== value);
      });
    }
  };
  function handleOpenTimings() {}
  const clearFilters = () => {
    setBrand("");
    setSubcategory("");
  };

  if (!query) {
    return (
      <>
        <Error404 />
      </>
    );
  }
  if (isFetching) {
    return <></>;
  }
  console.log(productsData);
  return (
    <>
      <div className="card-container">
        <div className="image-container">
          <img
            src={data.shopLogo ? data.shopLogo : data.shopImage}
            alt="Chef"
            className="background-image"
          />
        </div>
        <div className="store-details-container">
          <div className="text-container">
            <div className="header">
              <h1 className="store-name-heading">{data.soldBy}</h1>
              <p
                style={{
                  color: data.storeOpen ? variables.success : variables.error,
                }}
              >
                <IconPointFilled
                  size={20}
                  color={data.storeOpen ? variables.success : variables.error}
                />
                {data.storeOpen ? "Open Now" : "Closed Now"}
              </p>
            </div>
            <div className="store-details">
              <p>{data.address}</p>
              <div className="btn-group">
                <a href={`tel:${data.contactNumber}`} className="call-now">
                  <IconPhone size={20} stroke={2} /> {data.contactNumber}
                </a>
                {/* <a target="_blank" href={`https://www.google.com/maps/dir//${data.lat},${data.long}`} className="call-now">
                <IconPhone size={20} stroke={1.6} /> {data.contactNumber}
              </a> */}
              </div>
              <button className="show-timings" onClick={handleOpenTimings}>
                <IconClock size={20} stroke={2} /> Show Timings
              </button>
            </div>
          </div>
        </div>
        <div className="search-bar">
          <IconSearch
            size={20}
            stroke={1.4}
            color={variables.dark_gray}
          ></IconSearch>
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
        <div className="filter-product-container">
          <div
            className="filters"
            style={{ bottom: openFilter ? "0" : "-100%" }}
          >
            <div className="filters-heading">
              <h1 className="filter-header">Filters</h1>
              <div className="buttons-group" style={{display : "flex" , gap : "1rem"}}>
                <button className="secondary-button" onClick={clearFilters}>
                  Clear All
                </button>
                <button className="secondary-button" onClick={handleApplyChanges}>Apply Changes</button>
              </div>
            </div>
            <div className="filter">
              <h1 className="filter-header">BRANDS</h1>
              <ul>
                {productsData &&
                  productsData.brands.map((item, index) => {
                    return (
                      <li key={item}>
                        <input
                          type="checkbox"
                          value={item}
                          onChange={(e) => {
                            handlebBrandChange(e);
                          }}
                          checked={brand.includes(item)}
                        ></input>
                        {item}
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="filter">
              <h1 className="filter-header">CATEGORIES</h1>
              <ul>
                {productsData &&
                  productsData.subCategories.map((item) => {
                    return (
                      <li key={item}>
                        <input
                          type="checkbox"
                          value={item}
                          onChange={(e) => {
                            handleSubCategoryChange(e);
                          }}
                          checked={subCategory.includes(item)}
                        ></input>
                        {item}
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="filter">
              <h1 className="filter-header">PRICE</h1>
              <div className="price-input-container">
                <input
                  type="range"
                  min="1"
                  max="10000"
                  onChange={handlePriceChange}
                ></input>
                <p><IconCurrencyRupee size={20} stroke={2}/> {price}</p>
              </div>
            </div>
          </div>
          <div className="products-header-footer-container">
            <div className="product-header">
              <span>
                showing{" "}
                {
                  products.data?.pages.flatMap((data) => data.showing)[
                    products.data?.pages.flatMap((data) => data.showing)
                      .length - 1
                  ]
                }{" "}
                of {productsData?.totalProducts}
              </span>
            </div>
            <div className="products-container" style={{ marginTop: "2rem" }}>
              {products.data?.pages
                .flatMap((data) => data.products)
                .map((item) => {
                  return (
                    <Product
                      key={item._id}
                      data={item}
                      loadEditOption={false}
                    />
                  );
                })}
            </div>
            <div
              className="load-more-button-container"
              style={{ margin: "6rem 0", marginBottom: "10rem" }}
            >
              {products.hasNextPage && (
                <button
                  type="button"
                  disabled={products.isFetching}
                  onClick={() => products.fetchNextPage()}
                  className="normal-button center-button"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
          <div className="filter-sorting-button-group">
            <button
              onClick={() => {
                setOpenFilter((prevData) => !prevData);
              }}
              type="button"
              className=""
            >
              <IconAdjustmentsHorizontal
                size={22}
                stroke={1.4}
              ></IconAdjustmentsHorizontal>{" "}
              FILTER
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Store;
