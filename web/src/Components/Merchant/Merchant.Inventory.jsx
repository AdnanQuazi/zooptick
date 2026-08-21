import {
  IconCameraCancel,
  IconCaretDown,
  IconDotsVertical,
  IconEdit,
  IconSearch,
  IconTrash,
  IconCircleX,
  IconX,
  IconCurrency,
  IconCurrencyRupee,
  IconPlus,
  IconMinus,
  IconCheck,
} from "@tabler/icons-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchInventory,
  product,
  updateProduct,
  updateStocktoDB,
} from "../../Api/api";
import Toast from "../Toast";
import variables from "../../styles/variables.module.scss";
import { useEffect, useState } from "react";
import useOutsideClick from "../User/useOutsideClick";
import { useNavigate } from "react-router-dom";
function Inventory() {
  const [products, setProducts] = useState("");
  const [openMenu, setOpenMenu] = useState("");
  const [openRows, setOpenRows] = useState({});
  const navigate = useNavigate();
  const navigateToEdit = (e, data) => {
    e.stopPropagation();
    navigate("../products/edit-product", { state: data });
  };

  const result = useInfiniteQuery({
    queryKey: ["inventory"],
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => fetchInventory({ pageParam }), // 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
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

  const handleSearch = debounce(async (e) => {
    const response = await fetchInventory({search : e.target.value})
    console.log(response)
  })
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
      queryClient.invalidateQueries("inventory");
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
      queryClient.invalidateQueries("inventory");
    }
  };

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const queryClient = useQueryClient();
  const update_stock = useMutation({
    mutationFn: (param) => {
      return updateStocktoDB(param);
    },
    onSuccess: (message) => {
      setToast({ isVisible: true, message, status: "success" });
      queryClient.invalidateQueries("inventory");
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: "Something went wrong",
        status: "success",
      });
    },
  });

  useEffect(() => {
    if (result.data) {
      setProducts(() => {
        const allProducts = result.data?.pages.flatMap((page) => page.products);
        return allProducts;
      });
    }
  }, [result.data]);
  function handleOpenMenu(i) {
    setOpenMenu(i);
  }
  const toggleRow = (id) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  function stockChange(productIndex, variantIndex, stock) {
    setProducts((prevData) => {
      const newProducts = [...prevData];
      if (stock >= 0) {
        newProducts[productIndex].variants[variantIndex].Stock = stock;
      }
      return newProducts;
    });
  }
  function cancelStock(productIndex) {
    // setProducts((prevData) => {
    //   const newProducts = [...prevData]
    //   console.log(result.data?.pages[0].products[productIndex].variants)
    //   newProducts[productIndex].variants = result.data?.pages[0].products[productIndex].variants
    //   return newProducts
    // })
  }
  function updateStock(id) {
    const variant = products.filter((p) => p._id == id);
    update_stock.mutate({ variant: variant[0].variants, filter: id });
  }
  const menuRef = useOutsideClick(() => setOpenMenu());
  if (!products) return <div>Loading...</div>;
  return (
    <>
      {toast.isVisible && (
        <Toast
          status={toast.status}
          message={toast.message}
          handleCloseToast={handleCloseToast}
        />
      )}
      <h1>Inventory</h1>
      <div className="search-container">
        <IconSearch size={24} stroke={1.5}></IconSearch>
        <input type="text" placeholder="Search Product / SKU..." onChange={handleSearch}></input>
      </div>
      {/* <div className="analytics-container">
        <div className="analytic">
            <h2>Total SKU's</h2>
            <h1>200</h1>
        </div>
      </div> */}
      <div className="inventory">
        <div className="table-container-orders" style={{ width: "auto" }}>
          <table style={{ width: "auto" }}>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Product</th>
                <th>Status</th>
                <th>Variant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <>
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="product-name-image">
                      <div className="productName-img">
                        <img src={product.variants[0].Images[0]}></img>
                        <p className="productName">{product.productName}</p>
                      </div>
                    </td>
                    <td>
                      <p
                        className="product-status"
                        style={{
                          backgroundColor: product.status
                            ? variables.success
                            : variables.warning,
                        }}
                      >
                        {product.status ? "Active" : "Inactive"}
                      </p>
                    </td>
                    <td>{product.variants.length} Variant(s)</td>
                    <td>
                      <div className="action-menu-container">
                        <button
                          type="button"
                          className="table-drop-button"
                          onClick={() => {
                            handleOpenMenu(index);
                          }}
                        >
                          <IconDotsVertical
                            size={20}
                            stroke={1.7}
                          ></IconDotsVertical>
                        </button>
                        {openMenu === index && (
                          <div className="menu" ref={menuRef}>
                            <ul>
                              <li className="menu-item">
                                <button
                                  onClick={() => {
                                    toggleRow(product._id);
                                  }}
                                >
                                  <IconCaretDown size={18} stroke={2} /> Show
                                  Variants
                                </button>
                              </li>
                              <li className="menu-item">
                                <button
                                  onClick={(e) => {
                                    navigateToEdit(e, product._id);
                                  }}
                                >
                                  <IconEdit size={18} stroke={2} /> Edit
                                </button>
                              </li>
                              <li className="menu-item">
                                {product.status ? (
                                  <button
                                    style={{ color: variables.error }}
                                    onClick={() => {
                                      handleDeactivateProduct(product._id);
                                    }}
                                  >
                                    <IconX size={18} stroke={2} /> Disable
                                  </button>
                                ) : (
                                  <button
                                    style={{ color: variables.success }}
                                    onClick={() => {
                                      handleActivateProduct(product._id);
                                    }}
                                  >
                                    <IconCheck size={18} stroke={2} /> Enable
                                  </button>
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="hidden-row">
                    <td colSpan={10} style={{ width: "100%", padding: "0" }}>
                      <div
                        className={`hidden-row`}
                        style={{
                          height: !openRows[product._id] ? "0" : "auto",
                        }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th>SKU</th>
                              {product.selectedVariations.map((e) => (
                                <th>{e}</th>
                              ))}
                              <th>MRP</th>
                              <th>Selling Price</th>
                              <th>In-Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.variants.map((variant, vIndex) => (
                              <tr>
                                <td>{variant.SKU}</td>
                                {product.selectedVariations.map((e) => (
                                  <td>{variant[e]}</td>
                                ))}
                                <td>
                                  <p className="price">
                                    <IconCurrencyRupee size={18} stroke={1.5} />{" "}
                                    {variant.MRP}
                                  </p>
                                </td>
                                <td>
                                  <p className="price">
                                    <IconCurrencyRupee size={18} stroke={1.5} />{" "}
                                    {variant.sellingPrice}
                                  </p>
                                </td>
                                <td>
                                  <div className="in-stock-container">
                                    <button
                                      className="icon-button"
                                      style={{
                                        backgroundColor: variables.error,
                                        border: "none",
                                      }}
                                      onClick={() => {
                                        stockChange(
                                          index,
                                          vIndex,
                                          parseInt(variant.Stock) - 1
                                        );
                                      }}
                                    >
                                      <IconMinus size={18} stroke={1.8} />
                                    </button>
                                    <p
                                      style={{
                                        width: "3ch",
                                        textAlign: "center",
                                      }}
                                    >
                                      {variant.Stock}
                                    </p>
                                    <button
                                      className="icon-button"
                                      style={{
                                        backgroundColor: variables.success,
                                        border: "none",
                                      }}
                                      onClick={() => {
                                        stockChange(
                                          index,
                                          vIndex,
                                          parseInt(variant.Stock) + 1
                                        );
                                      }}
                                    >
                                      <IconPlus size={18} stroke={1.8} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="action-button-group">
                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                              cancelStock(index);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="status-button collected"
                            onClick={() => {
                              updateStock(product._id);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="">
        {result.hasNextPage && (
          <button
            type="button"
            disabled={result.isFetching}
            onClick={() => result.fetchNextPage()}
            className="normal-button center-button"
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
}
export default Inventory;
