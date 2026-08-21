import jewellery from "../../assets/jewellery.jpg";
import clothing from "../../assets/clothing.jpg";
import footwear from "../../assets/footwear.jpg";
import { useContext, useEffect, useRef, useState } from "react";
import FootwearForm from "../Forms/Footwear.Form";
import { useFormik } from "formik";
import ImageInput from "../Forms/Image.Form";
import variables from "../../styles/variables.module.scss";
import { IconCircleX, IconCross, IconPlus, IconX } from "@tabler/icons-react";
import Switch from "../Forms/Switch.Form";
import { MerchantEditProdcutSchema } from "../../schemas/Merchant.EditProductSchema";
import SearchWindow from "../Forms/SearchWindow.Form";
import { editProduct, getProductsCategoryList, product } from "../../Api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { object } from "yup";
import CustomSelect from "../Forms/CustomSelect.Form";
import CustomInput from "../Forms/CustomInput.Form";
import { json, useLocation } from "react-router-dom";
import Toast from "../Toast";
import { AuthContext } from "../../Context/AuthContext";
import EditForm from "./EditForm";
const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
  keys: ["Footwear", "Men"],
};

const productsData = {
  Footwear: {
    Men: [
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
      { Accessories: ["Socks", "Insoles"] },
    ],
    Women: [
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
      { Accessories: ["Socks", "Insoles", { hello: "ahahah" }] },
      { Blah: { hi: ["Hi"] } },
    ],
    Kids: {
      Boys: [
        "School Shoes",
        "Sports Shoes",
        "Flats",
        "Sandals",
        "Sneakers",
        "Flip Flops",
        "Slippers",
        { Accessories: ["Socks", "Insoles"] },
      ],
      Girls: [
        "School Shoes",
        "Sports Shoes",
        "Flats",
        "Sandals",
        "Sneakers",
        "Flip Flops",
        "Slippers",
        { Accessories: ["Socks", "Insoles"] },
      ],
    },
  },
};

const options = {
  includeScore: true,
  threshold: 0.4,
};

function EditProduct() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data, isError, isPending , isFetching} = useQuery({
    queryKey: ["editProduct"],
    queryFn: (obj) => {
      return product(location.state);
    },
  });

  // const [formStyle, setFormStyle] = useState("");
  // const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(-1);
  // const [colors, setColors] = useState("");
  // const [tableSize, setTableSize] = useState(4);
  // const [isVisible, setIsVisible] = useState(false);
  // const [categoryList, setCategoryList] = useState([]);
  // const {BASEURL} = useContext(AuthContext)
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
  // const focusTimeout = useRef(null);
  // const handleColorChange = () => {
  //   const finalColors = [...new Set([...values.colors, colors])];
  //   setFieldValue("colors", finalColors);
  //   setColors("");
  // };
  //   const addProduct = useMutation({
  //     mutationFn: (formData) => {
  //       return addProductToDB(formData);
  //     },
  //     onSuccess: (message) => {
  //       resetForm();
  //       setToast({ isVisible: true, message, status: "success" });
  //       setEditable(true);
  //     },
  //     onError: (message) => {
  //       setToast({
  //         isVisible: true,
  //         message: message.response.data.message,
  //         status: "error",
  //       });
  //     },
  //   });
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  const [loading,setLoading] = useState(false)
  const handleEditProduct = async (formData) => {
    try {
      setLoading(true)
      const response = await editProduct(formData);
      if (response) {
        setLoading(false)
        setToast({
          isVisible: true,
          message: "Product Edited",
          status: "success",
        });
        queryClient.invalidateQueries("editProduct");
      }
      
    } catch (error) {
      console.log(error)
      setLoading(false)
      setToast({
        isVisible: true,
        message: error?.response.data,
        status: "error",
      });
    }

  };
  // const [finalData,setFinalData] = useState({
  //   category:  "",
  //   subCategory: "",
  //   subSubCategory: "",
  //   clothingType: "",
  //   gender: "",
  //   price: "",
  //   colors: [],
  //   sizes: {
  //     XS: { quantity: "" },
  //     S: { quantity: "" },
  //     M: { quantity: "" },
  //     L: { quantity: "" },
  //     XL: { quantity: "" },
  //     XXL: { quantity: "" },
  //   },
  //   sizesFootwear: {
  //     "UK/IND": ["", "", "", "", ""],
  //     US: ["", "", "", "", ""],
  //     EUR: ["", "", "", "", ""],
  //     Inches: ["", "", "", "", ""],
  //     Centimeter: ["", "", "", "", ""],
  //     Quantity: ["", "", "", "", ""],
  //   },
  //   images: [],
  //   productName: "",
  //   desc: "",
  //   MRP: "",
  //   condition: "",
  //   brand: "",
  // })
  // const {
  //   values,
  //   errors,
  //   touched,
  //   handleChange,
  //   handleBlur,
  //   handleSubmit,
  //   setFieldValue,
  //   resetForm,
  // } = useFormik({
  //   initialValues: finalData,
  //   enableReinitialize: true,
  //   validationSchema: MerchantEditProdcutSchema,
  //   onSubmit: (values, action) => {
  //     console.log(values);
  //     const formData = new FormData();
  //     for (let key in values) {
  //       const jsonString = JSON.stringify(values[key]);
  //       formData.append(key, jsonString);
  //     }

  //     values.images.forEach((image) => {
  //       formData.append("images", image);
  //     });
  //     handleEditProduct(formData);
  //   },
  //   onReset: () => {},
  // });

  // const fetchProductsDataList = useMutation({
  //   mutationFn: (param) => {
  //     return getProductsCategoryList(param);
  //   },
  //   onSuccess: (message) => {
  //     const arr = message.map((elem) => {
  //       if (typeof elem == "string") {
  //         return elem;
  //       }
  //     });

  //     const fuse = new Fuse(arr, options);
  //     const result = fuse.search(values.subCategory);
  //     setCategoryList(result);
  //   },
  //   onError: (message) => {},
  // });

  if(isFetching){
    return <></>
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
      <h1>Edit Product</h1>
      {!isFetching && (
        <>
        <EditForm category={data.category} defaultValues={data} loading={loading} editProduct={handleEditProduct}/>
        </>
      )}
    </>
  );
}
export default EditProduct;
