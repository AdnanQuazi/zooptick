import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../Api/api";
import Navbar from "../../Layout/Navbar";
import Product from "./Products";

function Wishlist() {
  const { data, isError, isFetching } = useQuery({
    queryKey: ["wishlist"],
    queryFn: (obj) => {
      return getWishlist();
    },
    retry: 1,
  });
  if (isFetching) {
    return <></>;
  }
  console.log(data);
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="wishlist">
          <h1 className="user-page-heading">Wishlist</h1>
          <div
            className="products-container wishlist-container"
            style={{ marginTop: "2rem" }}
          >
            {data.map((item) => {
              return (
                <Product key={item._id} data={item} loadEditOption={false} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default Wishlist;
