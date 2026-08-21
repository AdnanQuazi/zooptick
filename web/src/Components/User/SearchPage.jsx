import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../Api/api";
import Product from "./Products";
import { IconAdjustmentsHorizontal, IconCurrencyRupee } from "@tabler/icons-react";
import noItems from "../../assets/Empty-pana.svg";
import Toast from "../Toast";
function SearchPage({ rawQuery, city }) {
  const queryClient = useQueryClient();
  const [openFilter, setOpenFilter] = useState(false);
  const [brand, setBrand] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);
  const [subCategory, setSubcategory] = useState([]);
  const [rating, setRating] = useState(false);
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const [seachQuery, setSearchQuery] = useState({
    mode: "store",
    search: rawQuery,
    brand,
    rating,
    price,
    subCategory,
    city,
    maxDistance,
    lat,
    long,
  });
  useEffect(() => {
    if (maxDistance > 0) {
      setLat(localStorage.getItem("lat"));
      setLong(localStorage.getItem("long"));
    }
  }, [maxDistance]);
  useEffect(() => {
    setSearchQuery((prevData) => {
      return {
        ...prevData,
        search: rawQuery,
        brand,
        price,
        subCategory,
        city,
        maxDistance,
        lat,
        long,
      };
    });
  }, [brand, subCategory, rawQuery, city, maxDistance, lat, long]);

  const handleApplyChanges = () => {
    setSearchQuery((prevData) => {
      return {
        ...prevData,
        search: rawQuery,
        brand,
        price,
        subCategory,
        city,
        maxDistance,
        lat,
        long,
      };
    })
  }

  const products = useInfiniteQuery({
    queryKey: ["productsQueryPage"],
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

  const handleDistanceChange = (e) => {
    if (e.target.value > 0) {
      if (localStorage.getItem("lat") && localStorage.getItem("long")) {
        setMaxDistance(e.target.value);
      } else {
        setToast({
          isVisible: true,
          message: "Please update location",
          status: "error",
        });
      }
    }
  };

  const clearFilters = () => {
    setBrand("");
    setSubcategory("");
    setMaxDistance(0);
  };

  if (!rawQuery) {
    return (
      <>
        <Error404 />
      </>
    );
  }
  return (
    <>
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <div className="filter-product-container">
        <div className="filters" style={{ bottom: openFilter ? "0" : "-100%" }}>
          <div className="filters-heading">
            <h1 className="filter-header">Filters</h1>
            <div
              className="buttons-group"
              style={{ display: "flex", gap: "1rem" }}
            >
              <button className="secondary-button" onClick={clearFilters}>
                Clear All
              </button>
              <button className="secondary-button" onClick={handleApplyChanges}>
                Apply Changes
              </button>
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
          <div className="filter" style={{height : "auto"}}>
            <h1>DISTANCE</h1>

            <select value={maxDistance} onChange={handleDistanceChange}>
              <option value={0} disabled>
                Select Distance
              </option>
              <option value={1}>Within 1 km</option>
              <option value={5}>Within 5 Km</option>
              <option value={10}>Within 10 km</option>
              <option value={20}>Within 20 km</option>
              <option value={50}>Within 50 km</option>
            </select>
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
              <p>
                <IconCurrencyRupee size={20} stroke={2} /> {price}
              </p>
            </div>
          </div>
        </div>
        <div className="products-header-footer-container">
          <div className="product-header">
            <span>
              showing{" "}
              {
                products.data?.pages.flatMap((data) => data.showing)[
                  products.data?.pages.flatMap((data) => data.showing).length -
                    1
                ]
              }{" "}
              of {productsData?.totalProducts}
            </span>
          </div>
          <div className="products-container" style={{ marginTop: "2rem" }}>
            {products.data?.pages.flatMap((data) => data.products).length >=
            1 ? (
              products.data?.pages
                .flatMap((data) => data.products)
                .filter((data) => data.status)
                .map((item) => {
                  return (
                    <Product
                      key={item._id}
                      data={item}
                      loadEditOption={false}
                    />
                  );
                })
            ) : (
              <img
                style={{ width: "50rem", display: "block", margin: "auto" }}
                src={noItems}
              ></img>
            )}
          </div>
          <div
            className="load-more-button-container"
            style={{ marginTop: "6rem" }}
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
    </>
  );
}
export default SearchPage;
