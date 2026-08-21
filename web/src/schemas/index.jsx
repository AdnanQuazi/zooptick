import * as Yup from "yup";

export const signUpSchema = Yup.object({
    name : Yup.string().min(2).max(25).required("Please Enter Your Name"),
    email : Yup.string().email("Please enter a valid email").required("Please enter your Email"),
    password : Yup.string().min(6).required("Please Enter Password"),
    c_password : Yup.string().required("Confirming your password is necessary").oneOf([Yup.ref("password"),null],"Password Must Match")
})