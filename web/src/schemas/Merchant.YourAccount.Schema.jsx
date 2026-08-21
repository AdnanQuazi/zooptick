import * as Yup from "yup";

const phoneRegex = /^(\+91|\+91\-|0)?[7896]\d{9}$/;

export const MerchantPersonalDetailsSchema = Yup.object({
  ownerName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .min(2, "Name must be at least 2 characters long")
    .max(30, "Name cannot be longer than 30 characters")
    .required("Please enter your name"),
  shopName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .min(2, "Name must be at least 2 characters long")
    .max(30, "Name cannot be longer than 30 characters")
    .required("Please enter your shop name"),
  email: Yup.string().email().required("Please enter your email"),
  contactNumber: Yup.string()
    .matches(phoneRegex, "Phone number is not valid")
    .required("Contact number is required"),
  state: Yup.string().required("State is Required"),
  city: Yup.string().required("City is Required"),
  address: Yup.string()
    .required("Address is Required")
    .min(10, "Address must be at least 10 characters long")
    .max(150, "Address cannot be longer than 150 characters"),
});
