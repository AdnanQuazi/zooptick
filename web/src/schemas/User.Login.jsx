import * as Yup from "yup";

export const loginSchema = Yup.object({
    email : Yup.string().email("Please enter a valid email").required("Please Enter Email"),
    password : Yup.string().required("Please Enter Password"),
   
})