import { IconSearch, IconStar, IconStarFilled } from "@tabler/icons-react";
import clothing from "../../assets/clothing.jpg";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchProducts, updateProduct } from "../../Api/api";
import { useEffect, useRef, useState } from "react";
import Product from "../User/Products";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import Toast from "../Toast";

const dummyDelete = (_id) => {
  console.log(_id);
};

function MerchantProducts() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const [modal, setModal] = useState({
    open: false,
    color: "red",
    header: "Deactivate Product ?",
    body: "Are you sure you want to Deactivate this product?",
    action: "Delete",
  });
  const handleDeactivateProduct = async (_id) => {
    const response = await updateProduct({
      id: _id,
      product: { status: false },
    });
    if (response) {
      setToast({
        isVisible: true,
        message: "Product Deactivated",
        status: "error",
      });
      queryClient.invalidateQueries("productsList");
    }
  };
  const handleActivateProduct = async (_id) => {
    const response = await updateProduct({
      id: _id,
      product: { status: true },
    });
    if (response) {
      setToast({
        isVisible: true,
        message: "Product Activated",
        status: "success",
      });
      queryClient.invalidateQueries("productsList");
    }
  };

  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(false);
  const [price, setPrice] = useState("");
  const [seachQuery, setSearchQuery] = useState({
    mode: "merchant",
    search: "",
    brand,
    rating,
    price,
  });
  const [productData, setProductsData] = useState([]);

  const products = useInfiniteQuery({
    queryKey: ["productsList"],
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...seachQuery, pageParam }), // 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

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

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  return (
    <>
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <h1>Products</h1>
      <div className="search-container">
        <IconSearch size={24} stroke={1.5}></IconSearch>
        <input
          type="text"
          value={seachQuery.search}
          onChange={refetchProducts}
          placeholder="Search Product"
        ></input>
      </div>
      <div className="products-container">
        {products.data?.pages
          .flatMap((data) => data.products)
          .filter((prod) => prod.status)
          .map((item) => {
            return (
              <Product
                key={item._id}
                data={item}
                modal={modal}
                setModal={setModal}
                activateProduct={handleActivateProduct}
                setToast={setToast}
                loadEditOption={true}
              />
            );
          })}
      </div>
      <div className="load-more-button-container">
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
      <div className=""></div>
      {modal.open && (
        <Modal
          modal={modal}
          setModal={setModal}
          task={handleDeactivateProduct}
        />
      )}
    </>
  );
}
export default MerchantProducts;
