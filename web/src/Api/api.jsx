import axios from "axios";
axios.defaults.withCredentials = true;
const url = "http://localhost:3000";
const headers = {
  "Content-Type": "application/json",
};
const formHeaders = {
  "Content-Type": "multipart/form-data",
};
export const sendOtp = async (email) => {
  const response = await axios.get(`${url}/verify-user?email=${email}`);
  return response;
};
export const verifyOtp = async (otp) => {
  const response = await axios.post(
    `${url}/verify-user`,
    {
      otp,
    },
    headers
  );
  return response;
};
export const userAuth = async () => {
  const response = await axios.get(`${url}/userAuth` , );
  return response;
};
export const recommendProducts = async () => {
  const response = await axios.post(`${url}/recommededProducts`);
  return response;
};
export const logout = async () => {
  const response = await axios.post(`${url}/logout`);
  return response;
};
export const signUp = async (data) => {
  const response = await axios.post(`${url}/signup`, { ...data }, headers);
  return response;
};
export const login = async (data) => {
  const response = await axios.post(`${url}/login`, { ...data }, headers);
  return response;
};
export const forgotPassword = async (params) => {
  const {data} = await axios.post(`${url}/forgot-password`, { ...params }, headers);
  return data;
};
export const resetPassword = async (params) => {
  const {data} = await axios.post(`${url}/reset-password/${params.token}`, { password : params.password }, headers);
  return data;
};
export const getMerchantAccountInfo = async () => {
  const { data } = await axios.get(`${url}/dashboard/yourAccount`);
  return data;
};
export const updateMerchantAccountInfo = async (info) => {
  const { data } = await axios.post(
    `${url}/dashboard/yourAccount`,
    info,
    headers
  );
  return data;
};
export const getProductsCategoryList = async (param) => {
  const { data } = await axios.post(
    `${url}/get-products-category-list`,
    param,
    headers
  );
  return data;
};
export const addProductToDB = async (formData) => {
  const { data } = await axios.post(`${url}/addProduct`, formData, formHeaders);
  return data;
};
export const fetchInventory = async (queryKey) => {
  const queries = queryKey;
  const queryParams = new URLSearchParams(queries).toString();
  const { data } = await axios.get(
    `${url}/inventory?${queryParams}`,
    headers
  );
  return data;
};
export const updateStocktoDB = async (body) => {
  const { data } = await axios.post(
    `${url}/update-stock?`, body ,
    headers
  );
  return data;
};
export const fetchProducts = async (queryKey) => {
  const queries = queryKey;
  console.log(queries);
  const queryParams = new URLSearchParams(queries).toString();
  const { data } = await axios.get(
    `${url}/getProducts?${queryParams}`,
    headers
  );
  return data;
};
export const updateProduct = async (info) => {
  const { data } = await axios.put(`${url}/updateProduct`, info, headers);
  return data;
};
export const checkSKU = async (SKU) => {
  const { data } = await axios.get(`${url}/check-sku/${SKU}`, headers);
  return data;
};
export const editProduct = async (formData) => {
  const { data } = await axios.put(`${url}/editProduct`, formData, formHeaders);
  return data;
};
export const product = async (_id) => {
  const { data } = await axios.get(`${url}/product?_id=${_id}`);
  return data;
};
export const getStoreId = async (_id) => {
  const { data } = await axios.post(
    `${url}/get-store-id`,
    { productId: _id },
    headers
  );
  return data;
};
export const getStoreName = async (_id) => {
  const { data } = await axios.post(
    `${url}/get-store-name`,
    { storeId : _id },
    headers
  );
  return data;
};
export const getOnBoardConfig = async () => {
  const { data } = await axios.get(`${url}/onBoard/config`);
  return data;
};
export const getProductConfig = async (category) => {
  const { data } = await axios.get(`${url}/product/config?category=${category}`);
  return data;
};
export const onBoardUser = async (formData) => {
  const { data } = await axios.post(`${url}/onBoarding`, formData, formHeaders);
  return data;
};
export const generateLoyalty = async (amount) => {
  const { data } = await axios.post(`${url}/generate-loyalty-code`, {amount : amount}, headers);
  return data;
};
export const checkLoyalty = async (code) => {
  const { data } = await axios.post(`${url}/validate-loyalty-code`, {code : code}, headers);
  return data;
};
export const redeemLoyalty = async (code) => {
  const { data } = await axios.post(`${url}/redeem-loyalty-code`, {code : code}, headers);
  return data;
};
export const getCurrentLocation = async (lat,long) => {
  const { data } = await axios.get(`${url}/location?lat=${lat}&long=${long}`);
  return data;
};
export const getMerchantOrders = async (queryKey) => {
  const queries = queryKey;
  const queryParams = new URLSearchParams(queries).toString();
  const { data } = await axios.post(`${url}/get-merchant-orders?${queryParams}`, headers);
  return data;
};
export const getOrders = async (queryKey) => {
  const queries = queryKey;
  const queryParams = new URLSearchParams(queries).toString();
  const { data } = await axios.post(`${url}/get-orders?${queryParams}`, headers);
  return data;
};
export const updateOrderStatus = async (params) => {
  const { data } = await axios.post(`${url}/update-order-status`,{...params} , headers);
  return data;
};
export const getWishlist = async () => {
  const { data } = await axios.get(`${url}/wishlist`);
  return data;
};
export const addToWishlist = async ({task,id}) => {
  const { data } = await axios.post(`${url}/update-wishlist`,{task,id});
  return data;
};

export const adminAuth = async () => {
  const response = await axios.get(`${url}/adminAuth`);
  return response;
};
export const loginAdmin = async (data) => {
  const response = await axios.post(`${url}/admin/login`, { ...data }, headers);
  return response;
};
export const searchStores = async (queryKey) => {
  const queries = queryKey;
  const queryParams = new URLSearchParams(queries).toString();
  const { data } = await axios.get(`${url}/search-stores?${queryParams}`, headers);
  return data;
};