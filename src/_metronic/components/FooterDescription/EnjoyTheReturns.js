import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import {
  ApiGet,
  ApiPut,
  ApiPost,
} from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FooterDescription = ({ getNewCount, title }) => {
  const [filteredAboutUs, setFilteredAboutUs] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dataViewMore, setDataViewMore] = useState({});
  const [isViewMoreAboutus, setIsViewMoreAboutus] = useState(false);

  const [description, setDescription] = useState("");

  //new data
  const [isUpdateAboutUs, setIsUpdateAboutUs] = useState(false);
  const [isAddAboutUs, setIsAddAboutUs] = useState(false);
  const [idForUpdateAboutUsData, setIdForUpdateAboutUsData] = useState("");
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);

  const userInfo = JSON.parse(localStorage.getItem("userinfo")).admin;
  const handleViewMoreClose = () => {
    setIsViewMoreAboutus(false);
    setDataViewMore({});
  };

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "Learn Page-Enjoy The Returns | OUR LEISURE HOME");
  }, []);

  const handleAdminUpdateClose = () => {
    setDescription("");
    setIsUpdateAboutUs(false);
  };

  const handleAddAdminClose = () => {
    setDescription([]);
    setIsAddAboutUs(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllAboutUs();
  }, [page, countPerPage]);

  const getAllAboutUs = async () => {
    setIsLoaderVisible(true);
    await ApiGet(
      `description/getDescription`
    )
      .then((res) => {
        setIsLoaderVisible(false);
        setFilteredAboutUs(res?.data?.payload?.token);
        setCount(res?.data?.payload?.count);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const validateFormForAddAdmin = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    if (!description) {
      formIsValid = false;
      errorsForAdd["description"] = "*Please Enter Description!";
    }

    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handleAddAboutUsDetails = (e) => {
    e.preventDefault();
    if (validateFormForAddAdmin()) {
      let Data = {
        uid: userInfo?.id,
        description: description,
      };
      ApiPost(`description/addDecsription`, Data)
        .then((res) => {
          if (res?.status == 200) {
            setIsAddAboutUs(false);
            toast.success(res?.data?.message);
            setDescription("");
            getAllAboutUs();
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
    if (!description) {
      formIsValid = false;
      errors["description"] = "*Please Enter Description!";
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleUpdateAboutUsDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let Data = {
        uid: userInfo?.id,
        description: description,
      };
      ApiPut(`description/updateDescription/${idForUpdateAboutUsData}`, Data)
        .then((res) => {
          if (res?.status == 200) {
            setIsUpdateAboutUs(false);
            toast.success("Learn page updated successfully");
            setDescription("");
            getAllAboutUs();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const columns = [
    {
      name: "SNo",
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
      width: "65px",
    },
    {
      name: "Description",
      selector: "description",
      cell: (row) => {
        return (
          <>
            {row?.description}
          </>
        );
      },
      sortable: true,
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
                  setIsUpdateAboutUs(true);
                  setIdForUpdateAboutUsData(row._id);

                  setDescription(row?.description);
                }}
              >
                <Tooltip title="Edit Footer Description" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
            <div
              className="cursor-pointer pl-2"
              onClick={() => {
                setIsViewMoreAboutus(true);
                setDataViewMore(row);
              }}
            >
              <Tooltip title="Show More" arrow>
                <InfoOutlinedIcon />
              </Tooltip>
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


  return (
    <>
      <div className="card p-1">
        {document.title ===
          "Learn Page-Enjoy The Returns | OUR LEISURE HOME" && (
            <ToastContainer />
          )}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Footer Description</h2>
            </div>
            {/* <div className="col-md-2  mobile-button-center-align mobile-view-align cus-medium-button-style button-height">
              <button
                onClick={() => {
                  setIsAddAboutUs(true);
                }}
              >
                Add Description
              </button>
            </div> */}
          </div>

          <DataTable
            columns={columns}
            data={filteredAboutUs}
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

      {isAddAboutUs ? (
        <Dialog
          fullScreen
          open={isAddAboutUs}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAddAdminClose}>
            <CloseIcon />
          </div>
          <List>
            {isAddAboutUs === true ? (
              <div className="form full-container">
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Description
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <textarea

                        className="form-control"
                        rows="5"
                        maxLength={300}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
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
                      {errorsForAdd["description"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handleAddAboutUsDetails(e);
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

      {isUpdateAboutUs ? (
        <Dialog
          fullScreen
          open={isUpdateAboutUs}
          onClose={handleAdminUpdateClose}
          TransitionComponent={Transition}
        >

          <div className="cus-modal-close" onClick={handleAdminUpdateClose}>
            <CloseIcon />
          </div>
          <List>
            {isUpdateAboutUs === true ? (
              <div className="form full-container ">
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Description
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <textarea
                        className="form-control"
                        rows="5"
                        maxLength={300}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
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
                      {errors["description"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handleUpdateAboutUsDetails(e);
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

      {/* view more */}

      {isViewMoreAboutus ? (
        <Dialog
          fullScreen
          open={isViewMoreAboutus}
          onClose={handleViewMoreClose}
          TransitionComponent={Transition}
        >
          {/* <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleViewMoreClose}
              aria-label="close"
              style={{ width: '100%', justifyContent: 'flex-end' }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar> */}

          <div className="cus-modal-close" onClick={handleViewMoreClose}>
            <CloseIcon />
          </div>
          <List>
            {isViewMoreAboutus === true ? (
              <div className="form full-container ">
                <div className="form-group row mb-0">
                  <p>Description:</p>
                </div>
                <div className="form-group row mr-20">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: dataViewMore?.description,
                    }}
                    className=""
                  />
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}
    </>
  );
};

export default FooterDescription;
