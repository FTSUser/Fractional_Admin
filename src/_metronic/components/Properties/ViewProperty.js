import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { customStyles } from "./columnDesign";
import Loader from "react-loader-spinner";
import DataTable from "react-data-table-component";
import { ApiGet } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";

export default function ViewProperty(props) {
  const { dataViewMore } = props;
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [buyerData, setBuyerData] = useState({});
  const [allAmenities, setAllAmenities] = useState([]);

  useEffect(() => {
    getBuyers();
    getAmenities();
  }, []);

  const getAmenities = () => {
    ApiGet(`amenities/getAmenities?limit=1000&type=DISTINCTIVE`)
      .then((res) => {
        if (res?.data?.payload && res?.status === 200) {
          let amenities = res.data.payload.Ameninties
          let filteredAmenities = amenities.filter((rec1) => dataViewMore?.amenities.some((rec2) => rec1?._id === rec2));
          setAllAmenities(filteredAmenities);
        }
      })
      .catch((err) => {
        toast.error(err?.message, { theme: "colored" });
      });
  };

  const getBuyers = async () => {
    setIsLoaderVisible(true);
    await ApiGet(`order/getAllOrder?pid=${dataViewMore._id}`)
      .then((res) => {
        setIsLoaderVisible(false);
        setBuyerData(res?.data?.payload?.Order);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const columns5 = [
    {
      name: "SNo",
      width: "80px",
      cell: (row, index) => index + 1,
    },
    {
      name: "Image",
      width: "80px",
      cell: (row) => {
        return (
          <>
            <div className="p-3">
              <img
                className="max-w-50px zoom"
                alt="img"
                src={row?.imgPath != null ? row.imgPath : ""}
              />
            </div>
          </>
        );
      },
      wrap: true,
    },
  ];
  const columns1 = [
    {
      name: "SNo",
      cell: (row, index) => index + 1,
    },
    {
      name: "Amenity Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Amenity Type",
      selector: "type",
      sortable: true,
    },
  ];

  const columns3 = [
    {
      name: "SNo",
      width: "80px",
      cell: (row, index) => index + 1,
    },
    {
      name: "Name",
      selector: "uid.fname",
      sortable: true,
    },
    {
      name: "Email",
      selector: "uid.email",
      sortable: true,
    },
    {
      name: "Phone",
      selector: "uid.phone",
      sortable: true,
    },
  ];
  return (
    <div className="form full-container">
      <div className="form-group row">
        <p>{`Type: ${dataViewMore?.status}`}</p>
      </div>
      <div className="form-group row">
        <p>{`No. of Owners: ${dataViewMore?.ownership}`}</p>
      </div>
      <div className="form-group row">
        <p>{`Rental Yield (%) : ${dataViewMore?.rentalYield}`}</p>
      </div>
      {/* <div className="form-group row">
        <p>{`Target IRR (%): ${dataViewMore?.targetIRR}`}</p>
      </div> */}
      <div className="form-group row">
        <p>{`Total Assets Value: ${dataViewMore?.wholeHomePrice} ${dataViewMore?.priceType} `}</p>
      </div>
      <div className="form-group row">
        <p>{`Home sqft: ${dataViewMore?.sqft}`}</p>
      </div>
      <div className="form-group row mb-0">
        <p>Property Image</p>
      </div>
      <div className="form-group row mr-20">
        <DataTable
          columns={columns5}
          data={dataViewMore?.photos}
          customStyles={customStyles}
          style={{
            marginTop: "-4rem",
          }}
          progressPending={isLoaderVisible}
          progressComponent={
            <Loader type="Puff" color="#334D52" height={30} width={30} />
          }
          highlightOnHover
        />
      </div>
      <div className="form-group row">
        <p>{`Number of Baths: ${dataViewMore?.baths}`}</p>
      </div>
      <div className="form-group row">
        <p>{`Number of Beds: ${dataViewMore?.beds}`}</p>
      </div>
      <div className="form-group row">
        <p>{`Crew Contact No.: ${dataViewMore?.crewContact}`}</p>
      </div>
      <div className="form-group row mb-0">
        <p>Address</p>
      </div>
      <p>{`City: ${dataViewMore?.address?.city}`}</p>
      <p>{`Country: ${dataViewMore?.address?.country}`}</p>
      <p>{`Pincode: ${dataViewMore?.address?.pincode}`}</p>
      <p>{`State: ${dataViewMore?.address?.state}`}</p>
      <p>{`Street: ${dataViewMore?.address?.street}`}</p>
      <div className="form-group row mb-0">
        <p>About Home</p>
      </div>
      <div className="form-group row mr-20">
        <p
          dangerouslySetInnerHTML={{
            __html: dataViewMore?.aboutHome,
          }}
          className=""
        />
      </div>
      <div className="form-group row mb-0">
        <p>Amenities</p>
      </div>
      <div className="form-group row mr-20">
        <DataTable
          columns={columns1}
          data={allAmenities}
          customStyles={customStyles}
          style={{
            marginTop: "-4rem",
          }}
          progressPending={isLoaderVisible}
          progressComponent={
            <Loader type="Puff" color="#334D52" height={30} width={30} />
          }
          highlightOnHover
        />
      </div>
      {/* <div className="form-group row mb-0">
        <p>Buyers</p>
      </div>
      <div className="form-group row mr-20">
        <DataTable
          columns={columns3}
          data={buyerData}
          customStyles={customStyles}
          style={{
            marginTop: "-4rem",
          }}
          progressPending={isLoaderVisible}
          progressComponent={
            <Loader type="Puff" color="#334D52" height={30} width={30} />
          }
          highlightOnHover
        />
      </div> */}
      <div className="form-group row">
        {dataViewMore?.propertyVideo?.length > 0 && (
          <ReactPlayer
            url={dataViewMore?.propertyVideo[0]?.videoPath}
            playing={false}
            controls={true}
          />
        )}
      </div>
      <div className="form-group row">
        <iframe
          width="540"
          height="450"
          src={`https://maps.google.com/maps?q=${dataViewMore?.location?.coordinates[1]},${dataViewMore?.location?.coordinates[0]}&output=embed`}
        ></iframe>
      </div>
    </div>
  );
}
