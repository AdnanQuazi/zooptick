import jewellery from "../../assets/jewellery.jpg";
import clothing from "../../assets/clothing.jpg";
import footwear from "../../assets/footwear.jpg";
import { useEffect, useRef, useState } from "react";
import FootwearForm from "../Forms/Footwear.Form";
import { useFormik } from "formik";
import ImageInput from "../Forms/Image.Form";
import variables from "../../styles/variables.module.scss";
import { IconCross, IconPlus, IconX } from "@tabler/icons-react";
import Switch from "../Forms/Switch.Form";
import { MerchantAddProdcutSchema } from "../../schemas/Merchant.AddProductSchema";
import SearchWindow from "../Forms/SearchWindow.Form";
import {
  addProductToDB,
  getMerchantAccountInfo,
  getProductsCategoryList,
} from "../../Api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { object } from "yup";
import CustomSelect from "../Forms/CustomSelect.Form";
import CustomInput from "../Forms/CustomInput.Form";
import { json } from "react-router-dom";
import Toast from "../Toast";
import debounce from "lodash.debounce";
import DynamicForm from "./DynamicForm";
import EditForm from "./EditForm";
const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
  keys: ["Footwear", "Men"],
};

const options = {
  includeScore: true,
  threshold: 0.4,
};

function MerchantAddProdcut() {
  const { data, isError, isFetching } = useQuery({
    queryKey: ["initialMerchantInfo"],
    queryFn: (obj) => {
      return getMerchantAccountInfo();
    },
    retry: 1,
  });
  const [formStyle, setFormStyle] = useState("");
  // useEffect(() => {
  //   if (data) {
  //     setFormStyle("General Store");
  //   }
  // }, [data]);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(-1);
  const [colors, setColors] = useState("");
  const [tableSize, setTableSize] = useState(4);
  const [isVisible, setIsVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const initialValues = {
    category: formStyle,
    subCategory: "",
    subSubCategory: "",
    clothingType: "",
    gender: "",
    price: "",
    colors: [],
    sizes: {},
    sizesFootwear: {
      "UK/IND": ["", "", "", "", ""],
      US: ["", "", "", "", ""],
      EUR: ["", "", "", "", ""],
      Inches: ["", "", "", "", ""],
      Centimeter: ["", "", "", "", ""],
      Quantity: ["", "", "", "", ""],
    },
    images: [],
    productName: "",
    desc: "",
    MRP: "",
    condition: "New",
    brand: "",
  };
  const dummyData = [
    "Causal Shoes",
    "Formal Shoes",
    "Sports Shoes",
    "Sneakers",
    "Flip Flop/Slippers",
    "Boots",
    "Loafers",
    "Crocs",
    "Juti",
    "Ethnic",
    "Gladiators",
    "Heels",
    "Mules",
    "Loafers",
    "Boots",
    "Sneakers",
    "Sports Shoes",
    "Casual Shoes",
    "Formal Shoes",
    "Slider",
    "Slipper",
    "Slip-on",
    "CLogs",
    "Crocs",
  ];
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    status: "",
  });

  // const handleSubCategoryChange = (e) => {
  //   const selectedOptionLabel = e.target.options[e.target.selectedIndex].text;
  //   const i = e.target.options[e.target.selectedIndex].getAttribute("data-i");
  //   setSelectedSubCategoryIndex(i);
  //   setFieldValue("subCategory", selectedOptionLabel);
  // };
  const focusTimeout = useRef(null);
  const handleColorChange = () => {
    if (colors != "") {
      const finalColors = [...new Set([...values.colors, colors])];
      setFieldValue("colors", finalColors);
      setColors("");
    }
  };
  const addProduct = useMutation({
    mutationFn: (formData) => {
      return addProductToDB(formData);
    },
    onSuccess: (message) => {
      resetForm();
      setToast({ isVisible: true, message, status: "success" });
      
    },
    onError: (message) => {
      setToast({
        isVisible: true,
        message: message?.response?.data?.message,
        status: "error",
      });

    },
  });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: MerchantAddProdcutSchema,
    onSubmit: (values, action) => {
      const formData = new FormData();
      // const appendFormData = (data, root = '') => {
      //   for (let key in data) {
      //     const value = data[key];
      //     const formKey = root ? `${root}[${key}]` : key;

      //     if (Array.isArray(value)) {
      //       value.forEach((item, index) => {
      //         if (typeof item === 'object' && item !== null) {
      //           appendFormData(item, `${formKey}[${index}]`);
      //         } else {
      //           formData.append(`${formKey}[${index}]`, item);
      //         }
      //       });
      //     } else if (typeof value === 'object' && value !== null) {
      //       appendFormData(value, formKey);
      //     } else {
      //       formData.append(formKey, value);
      //     }
      //   }
      // };

      // appendFormData(values);
      console.log(formData);
      for (let key in values) {
        const jsonString = JSON.stringify(values[key]);
        formData.append(key, jsonString);
      }
      addProduct.mutate(formData);
      values.images.forEach((image) => {
        formData.append("images", image);
      });
    },
    onReset: () => {},
  });
  const fetchProductsDataList = useMutation({
    mutationFn: (param) => {
      return getProductsCategoryList(param);
    },
    onSuccess: (message) => {
      const arr = message.map((elem) => {
        if (typeof elem == "string") {
          return elem;
        }
      });

      const fuse = new Fuse(arr, options);
      const result = fuse.search(values.subCategory);
      setCategoryList(result);
    },
    onError: (message) => {},
  });
  let timeoutId;
  const handleSubCategoryChange = (e) => {
    const query = e.target.value;
    setFieldValue("subCategory", query);
    fetchProductsDataList.mutate({
      category: values.category,
      gender: values.gender,
    });
  };
  if (isFetching) {
    return <h1>LOADING</h1>;
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
      <h1>Add Product</h1>
      {formStyle == "" ? <div className="add-product-container">
          <div className="category-container">
            <h2 className="form-data-heading">
              Please select a category of your product
            </h2>
            <div className="categories-inner-container">
              <div
                className="category"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 1)100%), url(${clothing})`,
                }}
                onClick={() => setFormStyle("Clothing")}
              >
                <h2>Clothing</h2>
              </div>
              <div
                className="category"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 1)100%), url(${footwear})`,
                }}
                onClick={() => setFormStyle("Footwear")}
              >
                <h2>Footwear</h2>
              </div>
              <div
                className="category"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 1)100%), url(${jewellery})`,
                }}
                onClick={() => setFormStyle("Bangles")}
              >
                <h2>Bangles</h2>
              </div>
            </div>
          </div>
        </div> : <DynamicForm category={formStyle} addProduct={addProduct}/>}
    </>
  );
}
export default MerchantAddProdcut;
