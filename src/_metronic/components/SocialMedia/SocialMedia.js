import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import {
  ApiGet,
  ApiPut,
  ApiPost,
  ApiDelete,
} from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import CreateIcon from "@material-ui/icons/Create";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Admin = ({ getNewCount, title }) => {
  const [filteredAdmin, setFilteredAdmin] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [isUpdateAdmin, setIsUpdateAdmin] = useState(false);
  const [isAddAdmin, setIsAddAdmin] = useState(false);
  const [idForUpdateAdminData, setIdForUpdateAdminData] = useState("");
  const [inputValue, setInputValue] = useState({});
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [idForEditStatus, setIdForEditStatus] = useState("");
  const [status, setStatus] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOnChangeAdd = (e) => {
    const { name, value } = e.target;
    setInputValueForAdd({ ...inputValueForAdd, [name]: value });
    setErrorsForAdd({ ...errorsForAdd, [name]: "" });
  };

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "Admin | OUR LEISURE HOME");
  }, []);

  const handleAdminUpdateClose = () => {
    setInputValue({});
    setIsUpdateAdmin(false);
  };

  const handleAddAdminClose = () => {
    setInputValue({});
    setIsAddAdmin(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

  const getAllAdmins = async () => {
    setIsLoaderVisible(true);
    await ApiGet(`social/getAllSocial`)
      .then((res) => {
        setIsLoaderVisible(false);
        setFilteredAdmin(res?.data?.payload?.social);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const validateFormForAddAdmin = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    if (inputValueForAdd && !inputValueForAdd.title) {
      formIsValid = false;
      errorsForAdd["title"] = "*Please Enter Title!";
    }
    if (inputValueForAdd && !inputValueForAdd.link) {
      formIsValid = false;
      errorsForAdd["link"] = "*Please Enter Link!";
    }
    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handelAddAdminDetails = (e) => {
    e.preventDefault();
    if (validateFormForAddAdmin()) {
      ApiPost(`social/addSocial`, inputValueForAdd)
        .then((res) => {
          if (res?.status === 200) {
            setIsAddAdmin(false);
            toast.success("Data Added Successfully");
            setInputValueForAdd({});
            getAllAdmins();
            {
              document.title === "Dashboard | OUR LEISURE HOME" &&
                getNewCount();
            }
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (inputValue && !inputValue.title) {
      formIsValid = false;
      errors["title"] = "*Please Enter Title!";
    }
    if (inputValue && !inputValue.link) {
      formIsValid = false;
      errors["link"] = "*Please Enter Link!";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleEditStatus = () => {
    let data = {
      isActive: status,
      title: filteredAdmin?.title,
      link: filteredAdmin?.link,
    };
    ApiPut(`social/updateSocial/${idForEditStatus}`, data)
      .then((res) => {
        if (res?.status === 200) {
          setShow(false);
          toast.success("Status Updated Successfully");
          setStatus("");
          setIdForEditStatus("");
          getAllAdmins();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handelUpdateAdminDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      ApiPut(`social/updateSocial/${idForUpdateAdminData}`, inputValue)
        .then((res) => {
          if (res?.status === 200) {
            setIsUpdateAdmin(false);
            toast.success("Social media updated successfully");
            setInputValue({});
            getAllAdmins();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  let i = 0;
  const columns = [
    {
      name: "SNo",
      cell: (row, index) => index + 1,
    },
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Link",
      selector: "link",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between cus-medium-button-style">
              <button
                className="cursor-pointer"
                onClick={() => {
                  setShow(true);
                  setIdForEditStatus(row?._id);
                  setStatus(row?.isActive === true ? false : true);
                }}
              >
                {row?.isActive === true ? "Active" : "Inactive"}
              </button>
            </div>
          </>
        );
      },
      sortable: true,
      selector: (row) => row?.name,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer pl-2"
                onClick={() => {
                  setIsUpdateAdmin(true);
                  setIdForUpdateAdminData(row._id);
                  setInputValue({
                    title: row?.title,
                    link: row?.link,
                  });
                }}
              >
                <Tooltip title="Edit Social Media" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
          </>
        );
      },
    },
  ];
  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  return (
    <>
      <div className="card p-1">
        {document.title === "Admin | OUR LEISURE HOME" && <ToastContainer />}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Social Media</h2>
            </div>
          </div>

          {/* status */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to {status === true ? "active" : "inactive"}{" "}
              this social media ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleEditStatus();
                }}
              >
                {status === true ? "Active" : "Inactive"}
              </Button>
            </Modal.Footer>
          </Modal>

          <DataTable
            columns={columns}
            data={filteredAdmin}
            customStyles={customStyles}
            style={{
              marginTop: "-3rem",
            }}
            progressPending={isLoaderVisible}
            progressComponent={
              <Loader type="Puff" color="#334D52" height={30} width={30} />
            }
            highlightOnHover
          />
        </div>
      </div>

      {isUpdateAdmin ? (
        <Dialog
          fullScreen
          open={isUpdateAdmin}
          onClose={handleAdminUpdateClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAdminUpdateClose}>
            <CloseIcon />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <h2 id="unstyled-modal-title"> Update Social Media</h2>
          </div>
          <List>
            {isUpdateAdmin === true ? (
              <div className="form ml-30 ">
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Title
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="title"
                        name="title"
                        value={inputValue.title}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["title"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Link
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="link"
                        name="link"
                        value={inputValue.link}
                        onChange={(e) => {
                          handleOnChange(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["lname"]}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handelUpdateAdminDetails(e);
                    }}
                    className="btn btn-success mr-2"
                  >
                    <span>Update Details</span>
                  </button>
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}

      {isAddAdmin ? (
        <Dialog
          fullScreen
          open={isAddAdmin}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAddAdminClose}>
            <CloseIcon />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <h2 id="unstyled-modal-title"> Add New Social</h2>
          </div>
          <List>
            {isAddAdmin === true ? (
              <div className="form ml-30 ">
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Title
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="title"
                        name="title"
                        value={inputValueForAdd.title}
                        onChange={(e) => {
                          handleOnChangeAdd(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errorsForAdd["title"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Link
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="link"
                        name="link"
                        value={inputValueForAdd.link}
                        onChange={(e) => {
                          handleOnChangeAdd(e);
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errorsForAdd["link"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handelAddAdminDetails(e);
                    }}
                    className="btn btn-success mr-2"
                  >
                    <span>Add Details</span>
                  </button>
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}
    </>
  );
};

export default Admin;
