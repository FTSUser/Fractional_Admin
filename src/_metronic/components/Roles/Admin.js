import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet, ApiPut, ApiPost } from "../../../helpers/API/ApiData";
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
  const [loading, setLoading] = useState(false);

  //new data
  const [isUpdateAdmin, setIsUpdateAdmin] = useState(false);
  const [isAddAdmin, setIsAddAdmin] = useState(false);
  const [idForUpdateAdminData, setIdForUpdateAdminData] = useState("");
  const [inputValue, setInputValue] = useState({});
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [idForEditStatus, setIdForEditStatus] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");


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
    title === "Dashboard | OUR LEISURE HOME" ? document.title = title : document.title = "Admin | OUR LEISURE HOME"
  }, [])

  const handleAdminUpdateClose = () => {
    setInputValue({})
    setIsUpdateAdmin(false);
  };

  const handleAddAdminClose = () => {
    setInputValue({})
    setIsAddAdmin(false);
  };



  const handleClose = () => {
    setShow(false);
  };


  useEffect(() => {
    getAllAdmins();
  }, [page, countPerPage]);

  const getAllAdmins = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(`admin/get-admins?page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredAdmin(res?.data?.payload?.admin);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(`admin/get-admins?search=${search}&page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredAdmin(res?.data?.payload?.admin);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }

  };

  const validateFormForAddAdmin = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    if (inputValueForAdd && !inputValueForAdd.fname) {
      formIsValid = false;
      errorsForAdd["fname"] = "*Please Enter First Name!";
    }
    if (inputValueForAdd && !inputValueForAdd.lname) {
      formIsValid = false;
      errorsForAdd["lname"] = "*Please Enter Last Name!";
    }
    if (inputValueForAdd && !inputValueForAdd.phone) {
      formIsValid = false;
      errorsForAdd["phone"] = "*Please Enter Phone Number!";
    } else if (
      inputValueForAdd.phone &&
      !inputValueForAdd.phone.match(
        /^\d{10}$/
      )
    ) {
      formIsValid = false;
      errorsForAdd["phone"] = "*Please Enter vaild phone number!";
    }
    if (inputValueForAdd && !inputValueForAdd.email) {
      formIsValid = false;
      errorsForAdd["email"] = "*Please Enter Email!";
    } else if (
      inputValueForAdd.email &&
      !inputValueForAdd.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      formIsValid = false;
      errorsForAdd["email"] = "*Please Enter vaild Email!";
    }
    if (inputValueForAdd && !inputValueForAdd.password) {
      formIsValid = false;
      errorsForAdd["password"] = "*Please Enter password!";
    } else if (
      inputValueForAdd.password &&
      !inputValueForAdd.password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/
      )
    ) {
      formIsValid = false;
      errorsForAdd["password"] = "*Please Enter vaild password Format!";
      toast.error(
        "Please enter a password between 7 to 15 characters which contain one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      );
    }
    if (inputValueForAdd && !inputValueForAdd.role) {
      formIsValid = false;
      errorsForAdd["role"] = "*Please Enter Role!";
    }

    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handelAddAdminDetails = (e) => {
    e.preventDefault();
    if (validateFormForAddAdmin()) {
      ApiPost(`admin/signup`, inputValueForAdd)
        .then((res) => {
          if (res?.status == 200) {
            setIsAddAdmin(false);
            toast.success("Data Added Successfully");
            setInputValueForAdd({});
            getAllAdmins();
            { document.title === "Dashboard | OUR LEISURE HOME" && getNewCount() }
          } else {
            toast.error(res?.data?.message)
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

    if (inputValue && !inputValue.fname) {
      formIsValid = false;
      errors["fname"] = "*Please Enter First Name!";
    }
    if (inputValue && !inputValue.lname) {
      formIsValid = false;
      errors["lname"] = "*Please Enter Last Name!";
    }
    if (inputValue && !inputValue.phone) {
      formIsValid = false;
      errors["phone"] = "*Please Enter Phone Number!";
    } else if (
      inputValue.phone &&
      !inputValue.phone.match(
        /^\d{10}$/
      )
    ) {
      formIsValid = false;
      errors["phone"] = "*Please Enter vaild phone number!";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleEditStatus = () => {
    let data = {
      status: status,
      id: idForEditStatus
    }
    ApiPut(`admin/block`, data)
      .then((res) => {
        if (res?.status == 200) {
          setShow(false);
          toast.success("Status Updated Successfully");
          setStatus("");
          setIdForEditStatus("")
          getAllAdmins();
        } else {
          toast.error(res?.data?.message)
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };


  const handelUpdateAdminDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      ApiPut(`admin/updateAdmin/${idForUpdateAdminData}`, inputValue)
        .then((res) => {
          if (res?.status == 200) {
            setIsUpdateAdmin(false);
            toast.success("Data updated Successfully");
            setInputValue({});
            getAllAdmins();
          } else {
            toast.error(res?.data?.message)
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
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
      width:"55px"
    },
    {
      name: "Email",
      selector: "email",
      cell: (row) => {
          return (
            <>
              <p
                dangerouslySetInnerHTML={{
                  __html: row?.email,
                }}
                className=""
              />
            </>
          );
        },
    },
    {
      name: "First Name",
      selector: "fname",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: "lname",
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: "phone",
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
                  setShow(true)
                  setIdForEditStatus(row?._id)
                  setStatus(row?.status?.name == "active" ? "inactive" : "active")
                }}
              >
                {row?.status?.name == "active" ? "Active" : "Inactive"}
              </button>
            </div>
          </>
        );
      },
      sortable: true,
      selector: row => row?.status?.name,
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
                  setIsUpdateAdmin(true)
                  setIdForUpdateAdminData(row._id)
                  setInputValue({
                    fname: row?.fname,
                    lname: row?.lname,
                    phone: row?.phone
                  })
                }}
              >
                <Tooltip title="Edit Admin" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
          </>
        );
      },
    },
  ];
  // * Table Style
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

  //for search data

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearchTerm = useDebounce(search, 500);

  // Hook
  function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoaderVisible(true);
      setPage(1);
      setCount(0);
      setCountPerPage(countPerPage);
      getAllAdmins();
    } else {
      setPage(1);
      setCount(0);
      setCountPerPage(countPerPage);
      getAllAdmins();
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="card p-1">
        {document.title === "Admin | OUR LEISURE HOME" && <ToastContainer />}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Admin Listing</h2>
            </div>
            <div className="col-md-7 col-sm-12 mobile-view-align">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search Admins"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
            <div className="col-md-2 cus-medium-button-style mobile-view-align mobile-button-center-align button-height">
              <button onClick={() => {
                setIsAddAdmin(true)
                setInputValueForAdd({ role: "61aa0369803e260c3821ad0a" })
              }}>Add Admin</button>
            </div>
          </div>

          {/* status */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want To {status === "active" ? "Active" : "Inactive"} {" "}
              this Admin
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleEditStatus()
                }}
              >
                {status === "active" ? "Active" : "Inactive"}
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
            pagination
            paginationServer
            paginationTotalRows={count}
            paginationPerPage={countPerPage}
            paginationRowsPerPageOptions={[10, 20, 25, 50, 100]}
            paginationDefaultPage={page}
            onChangePage={(page) => {
              setPage(page);
            }}
            onChangeRowsPerPage={(rowPerPage) => {
              setCountPerPage(rowPerPage);
            }}
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
            <h2 id="unstyled-modal-title"> Update Admin</h2>
          </div>
          <List>
            {isUpdateAdmin === true ? (
              <div className="form full-container">
                {/* First Name */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    First Name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="fname"
                        name="fname"
                        value={inputValue.fname}
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
                      {errors["fname"]}
                    </span>
                  </div>
                </div>
                {/* Last Name */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Last Name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="lname"
                        name="lname"
                        value={inputValue.lname}
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

                {/* Phone Number */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Phone Number
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="number"
                        className={`form-control form-control-lg form-control-solid `}
                        id="phone"
                        name="phone"
                        value={inputValue?.phone}
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
                      {errors["phone"]}
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
                    {loading && (
                      <span className="mx-3 spinner spinner-white"></span>
                    )}
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
            <h2 id="unstyled-modal-title"> Add New Admin</h2>
          </div>
          <List>
            {isAddAdmin === true ? (
              <div className="form full-container">
                {/* First Name */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    First Name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="fname"
                        name="fname"
                        value={inputValueForAdd.fname}
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
                      {errorsForAdd["fname"]}
                    </span>
                  </div>
                </div>
                {/* Last Name */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Last Name
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="lname"
                        name="lname"
                        value={inputValueForAdd.lname}
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
                      {errorsForAdd["lname"]}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Email
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="email"
                        name="email"
                        value={inputValueForAdd.email}
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
                      {errorsForAdd["email"]}
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Phone Number
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="number"
                        className={`form-control form-control-lg form-control-solid `}
                        id="phone"
                        name="phone"
                        value={inputValueForAdd?.phone}
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
                      {errorsForAdd["phone"]}
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Password
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="password"
                        className={`form-control form-control-lg form-control-solid `}
                        id="password"
                        name="password"
                        value={inputValueForAdd?.password}
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
                      {errorsForAdd["password"]}
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
                    {loading && (
                      <span className="mx-3 spinner spinner-white"></span>
                    )}
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
