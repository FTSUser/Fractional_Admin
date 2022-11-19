import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../../../utils/user.util";
import { ApiGet } from "../../../../helpers/API/ApiData";
import Admin from "../../../components/Roles/Admin";
import SuperAdmin from "../../../components/Roles/SuperAdmin";
import User from "../../../components/Roles/User";
import DistinctiveAmenities from "../../../components/Amenities/DistinctiveAmenities";
import StandardAmenities from "../../../components/Amenities/StandardAmenities";
import ContactUsAdmin from "../../../components/ContactUs/ContactUsAdmin";
import ContactUsGeneral from "../../../components/ContactUs/ContactUsGeneral";
import Properties from "../../../components/Properties/Properties";
import { toast } from "react-toastify";
import MarketingBanner from "../../../components/Banner/Banner";

export function MixedWidget1({ className }) {
  let userInfo = getUserInfo();

  const [selectedTable, setSelectedTable] = useState(
    userInfo?.admin?.role === "superadmin" ? "Properties" : "Properties"
  );
  const [countData, setCountData] = useState({});
  const [title, setTitle] = useState("");


  useEffect(() => {
    document.title = "Dashboard | OUR LEISURE HOME";
    setTitle("Dashboard | OUR LEISURE HOME");
  }, []);

  useEffect(() => {
    getcount();
  }, []);

  const getcount = async () => {
    // if (userInfo?.admin?.role === "superadmin") {
    await ApiGet(`admin/count`)
      .then((res) => {
        setCountData(res?.data?.payload);
      })
      .catch((err) => {
        toast.error(err);
      });
    // }
  };



  return (
    <div className="common-background-none">
    <div className={`card card-custom ${className}`}>
      {/* Header */}
      <div className="card-header border-0 py-1 px-1">
        <div className="card-body p-0 position-relative overflow-hidden">
          {/* Stat */}
          <div className="">
            <h2 className="heading-1 font-weight-bolder text-black pt-2 pl-6">
              {/* Overall Recoard */}
            </h2>
          </div>
          {userInfo?.admin?.role === "superadmin" ? (
            <>
              <div className="card-spacer">
                <div className="new-grid m-5">
                  <div className="new-grid-items card-cus-background" onClick={() => setSelectedTable("Users")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.userdata}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6"
                      
                    >
                      Total Users
                    </a>
                  </div>
                  <div className="new-grid-items card-cus-background" onClick={() => setSelectedTable("Admins")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.admindata}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6 mt-2"
                      
                    >
                      Total Admins
                    </a>
                  </div>
                  <div className="new-grid-items card-cus-background " onClick={() => setSelectedTable("SuperAdmins")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.superadmindata}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6 mt-2 mr-7"
                      
                    >
                      Total Super Admins
                    </a>
                  </div>
                  <div className="new-grid-items card-cus-background" onClick={() => setSelectedTable("Marketing Banner")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.popup}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6"
                      
                    >
                      Total Marketing Banner
                    </a>
                  </div>
               

                  {/* <div className="new-grid-items card-cus-background" onClick={() => setSelectedTable("Distinctive Amenities")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.distinctiveamenities}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6"
                      
                    >
                      Total Number Distinctive Amenities
                    </a>
                  </div> */}
                  <div className="new-grid-items card-cus-background" 
                  // onClick={() => setSelectedTable("Standard Amenities")}
                  >
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {/* {countData?.standardamenities} */}
                      0
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6 mt-2"
                    >
                      Total Sold Properties 
                    </a>
                  </div>
                  <div className="new-grid-items card-cus-background" 
                  // onClick={() => setSelectedTable("Standard Amenities")}
                  >
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {/* {countData?.standardamenities} */}
                      0
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6 mt-2"
                    >
                      Total Property Report
                    </a>
                  </div>
                  <div className="new-grid-items card-cus-background" onClick={() => setSelectedTable("Properties")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.property}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6 mt-2 mr-7"
                      
                    >
                      Total Properties
                    </a>
                  </div>
                  <div className="new-grid-items card-cus-background" onClick={() => setSelectedTable("ContactUs General")}>
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {countData?.contactusadmin}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6"
                      
                    >
                      Total Contact Us
                    </a>
                  </div>
                </div>
                </div>
              
              <div className="my-5 mx-5">
                {/* <StandardAmenities countStandard={setCountDataAll} /> */}

                {selectedTable === "Users" ? (
                  <User title={title} />
                ) : selectedTable === "Admins" ? (
                  <Admin getNewCount={getcount} title={title} />
                ) : selectedTable === "SuperAdmins" ? (
                  <SuperAdmin getNewCount={getcount} title={title} />
                ) : selectedTable === "Distinctive Amenities" ? (
                  <DistinctiveAmenities getNewCount={getcount} title={title} />
                ) : selectedTable === "Standard Amenities" ? (
                  <StandardAmenities getNewCount={getcount} title={title} />
                ) : selectedTable === "Marketing Banner" ? (
                  <MarketingBanner title={title} />
                ) : selectedTable === "ContactUs General" ? (
                  <ContactUsGeneral title={title} />
                ) : selectedTable === "Properties" ? (
                  <Properties getNewCount={getcount} title={title} />
                ) : (
                  <></>
                )}
              </div>

            </>
          ) : (
            <>
              <div className="card-spacer">
                <div className="row m-5">
                  <div className="col card-cus-background px-6 py-8 mr-5">
                    <span className=" font-weight-bold font-size-h3 d-block my-2">
                      {/* <CountUp end={totalMusic} /> */}
                      {countData?.property}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6"
                      onClick={() => setSelectedTable("Properties")}
                    >
                      Total Properties
                    </a>
                  </div>
                  <div className="col card-cus-background px-6 py-8 mr-5">
                    <span className="font-weight-bold font-size-h3 d-block my-2">
                      {/* <CountUp end={totalPurchase && totalPurchase} /> */}
                      {countData?.contactus}
                    </span>
                    <a
                      href="#"
                      className="font-weight-bold font-size-h6 mt-2"
                      onClick={() => setSelectedTable("ContactUs")}
                    >
                      Total ContactUs
                    </a>
                  </div>
                </div>
              </div>
              <div className="my-5 mx-5">
                {selectedTable === "Properties" ? (
                  <Properties getNewCount={getcount} title={title} />
                ) : selectedTable === "ContactUs" ? (
                  <ContactUsAdmin title={title} />
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
