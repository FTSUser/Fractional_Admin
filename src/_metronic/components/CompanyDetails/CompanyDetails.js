import React, { useEffect, useState } from "react";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const CompanyDetails = ({ title }) => {
  const [filteredAdmin, setFilteredAdmin] = useState({});
  const [contactId, setContactId] = useState("");

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "SuperAdmin | OUR LEISURE HOME");
  }, []);

  useEffect(() => {
    getAllAdmins();
  }, []);

  const getAllAdmins = async () => {
    await ApiGet(`companyDetails/getCompanyDetails`)
      .then((res) => {
        setFilteredAdmin(res?.data?.payload?.companyDetails);
        setContactId(res?.data?.payload?.companyDetails?._id);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ApiPut(`companyDetails/updateCompanyDetails/${contactId}`, filteredAdmin)
      .then((res) => {
        if (res?.status == 200) {
          toast.success("Company details updated successfully");
          getAllAdmins();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="card p-1">
        {document.title === "SuperAdmin | OUR LEISURE HOME" && (
          <ToastContainer />
        )}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Company Details</h2>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <div className="p-4 mb-20">
                <br />
                <br />
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label  h4 font-weight-bold">
                    Name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid h5 `}
                        defaultValue={filteredAdmin?.name}
                        onChange={(e) =>
                          setFilteredAdmin({
                            ...filteredAdmin,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label h4 font-weight-bold">
                    Address
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid h5 `}
                        defaultValue={filteredAdmin?.address}
                        onChange={(e) =>
                          setFilteredAdmin({
                            ...filteredAdmin,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label h4 font-weight-bold">
                    Time
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid h5 `}
                        defaultValue={filteredAdmin?.hours}
                        onChange={(e) =>
                          setFilteredAdmin({
                            ...filteredAdmin,
                            hours: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label h4 font-weight-bold">
                    Phone
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid h5 `}
                        defaultValue={filteredAdmin?.phone}
                        onChange={(e) =>
                          setFilteredAdmin({
                            ...filteredAdmin,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label h4 font-weight-bold">
                    Email
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="email"
                        className={`form-control form-control-lg form-control-solid h5 `}
                        defaultValue={filteredAdmin?.email}
                        onChange={(e) =>
                          setFilteredAdmin({
                            ...filteredAdmin,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="pl-2">
                    <Button
                      className="btn btn-success mr-2"
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                    >
                      Update Company Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
