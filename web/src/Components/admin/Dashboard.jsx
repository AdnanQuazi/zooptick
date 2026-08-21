import { useContext } from "react";
import { AdminAuthContext } from "../../Context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { getOnBoardConfig } from "../../Api/api";
import { object } from "yup";
import "../../styles/adminDashboard.css"
function Dashboard() {
  const { admin, fetchProfile } = useContext(AdminAuthContext);
  const stores = admin.stores;

  const handleApprove = (storeId) => {
    console.log(storeId);
  };
  const handleReject = (storeId, reason) => {
    console.log(storeId, reason);
  };

  return (
    <>
      <div className="wrapper">
          <h1>Dashboard</h1>
        <div className="admin-dashboard-container">

          {stores.map((store) => {
            return Object.keys(store).map((keyName) => {
              console.log(typeof store[keyName]);
              if (typeof store[keyName] !== "object") {
                if (keyName != "shopImage" && keyName != "shopLogo") {
                  return (
                    <div className="details-div">
                      <label className="key">{keyName}</label>
                      <h1 className="value">{store[keyName]}</h1>
                    </div>
                  );
                }
              }
            });
          })}
        </div>
      </div>
    </>
  );
}
export default Dashboard;
