import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import {
  ApiGet,
  ApiDelete,
  ApiPut,
  ApiPost,
} from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import AwsConfig from "../../../config/BucketConfig/BucketConfig";
import S3 from "react-aws-s3";
import { ToastContainer, toast } from "react-toastify";
import AddImage from "./AddImage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DistinctiveAmenities = ({ getNewCount, title }) => {
  const [amenintiesData, setAmenintiesData] = useState([]);
  const [filteredAmeninties, setFilteredAmeninties] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  //new data
  const [isUpdateAmeninties, setIsUpdateAmeninties] = useState(false);
  const [isAddAmeninties, setIsAddAmeninties] = useState(false);
  const [idForUpdateAmenintiesData, setIdForUpdateAmenintiesData] =
    useState("");
  const [inputValue, setInputValue] = useState({});
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [idForEditStatus, setIdForEditStatus] = useState("");
  const [idForDeleteAmeninties, setIdForDeleteAmeninties] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [editQuiz, setEditQuiz] = useState([]);
  const [iconData, setIconData] = useState("");

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
      : (document.title = "Distinctive Amenities | OUR LEISURE HOME");
  }, []);

  const handleAdminUpdateClose = () => {
    setInputValue({});
    setIsUpdateAmeninties(false);
  };

  const handleAddAdminClose = () => {
    setInputValue({});
    setIsAddAmeninties(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllAmeninties();
  }, [page, countPerPage , search]);

  const uploadS3bucket = async (file) => {
    let config = AwsConfig;
    config = {
      ...config,
      dirName: "Cerificate",
      ACL: "public-read",
    };
    const Reacts3Client = new S3(config);
    let urls;
    let f = file;

    let filename = "AboutImage(" + new Date().getTime() + ")";
    let data = await Reacts3Client.uploadFile(f, filename);
    urls = data.location;
    return urls;
  };

  useEffect(() => {
    getImageArrayFromUpload();
  }, [editQuiz]);

  const getImageArrayFromUpload = async () => {
    let file = editQuiz;

    let photos = [];
    for (let i = 0; i < file?.length; i++) {
      if (typeof file[i].icon === "string") {
        photos.push({ icon: file[i].icon });
      } else {
        let driviniglicencephoto = await uploadS3bucket(file[i].icon);
        photos.push({ icon: driviniglicencephoto });
        setIconData(driviniglicencephoto);
      }
    }
    return photos;
  };

  const getAllAmeninties = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(`amenities/getAmenities?page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setAmenintiesData(res?.data?.payload?.Ameninties);
          setFilteredAmeninties(res?.data?.payload?.Ameninties);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `amenities/getAmenities?search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setAmenintiesData(res?.data?.payload?.Ameninties);
          setFilteredAmeninties(res?.data?.payload?.Ameninties);
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
    if (inputValueForAdd && !inputValueForAdd.name) {
      formIsValid = false;
      errorsForAdd["name"] = "*Please enter name of distinctive amenity";
    }
    if (!iconData) {
      formIsValid = false;
      errorsForAdd["icon"] = "*Please upload distinctive amenity icon";
    }

    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handelAddAmenintiesDetails = async (e) => {
    // e.preventDefault();
    if (validateFormForAddAdmin()) {
      let finalIcon = iconData;
      let Data = {
        name: inputValueForAdd.name,
        type: "DISTINCTIVE",
        icon: finalIcon,
      };
      await ApiPost(`amenities/addAmenities`, Data)
        .then((res) => {
          if (res?.status == 200) {
            setIsAddAmeninties(false);
            toast.success("Distinctive amenity added successfully");
            setInputValueForAdd({});
            getAllAmeninties();
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
    if (inputValue && !inputValue.name) {
      formIsValid = false;
      errors["name"] = "*Please enter name of distinctive amenity!";
    }
    if (!iconData) {
      formIsValid = false;
      errors["icon"] = "*Please upload distinctive amenity icon";
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleDeleteAmenintie = () => {
    ApiDelete(`amenities/deleteAmenities/${idForDeleteAmeninties}`)
      .then((res) => {
        if (res?.status == 200) {
          setShow(false);
          toast.success("Distinctive amenity deleted successfully");
          getAllAmeninties();
          {
            document.title === "Dashboard | OUR LEISURE HOME" && getNewCount();
          }
          setPage(1);
          setCount(0);
          setCountPerPage(countPerPage);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const handelUpdateAmenintieDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let data = {
        icon: iconData,
        name: inputValue?.name,
      };
      ApiPut(`amenities/updateAmenities/${idForUpdateAmenintiesData}`, data)
        .then((res) => {
          if (res?.status == 200) {
            setIsUpdateAmeninties(false);
            toast.success("Distinctive amenity updated successfully");
            setInputValue({});
            getAllAmeninties();
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
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
      width: "65px",
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Type",
      selector: "type",
      sortable: true,
    },
    {
      name: "Icon",
      cell: (row) => {
        return (
          <>
            <img style={{ width: "80px" }} src={row?.icon} />
          </>
        );
      },
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
                  setIsUpdateAmeninties(true);
                  setIdForUpdateAmenintiesData(row._id);
                  setInputValue({
                    name: row?.name,
                  });
                  setEditQuiz([{ icon: row?.icon }]);
                }}
              >
                <Tooltip title="Edit Amenity" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setShow(true);
                setIdForDeleteAmeninties(row?._id);
              }}
            >
              <Tooltip title="Delete Amenity" arrow>
                <DeleteIcon />
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

  //for search data

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="card p-1">
        {document.title === "Distinctive Amenities | OUR LEISURE HOME" && (
          <ToastContainer />
        )}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Distinctive Amenities</h2>
            </div>
            <div className="col-md-7 col-sm-12 mobile-view-align">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search Distinctive Amenities"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
            <div className="col-md-2 mobile-button-center-align mobile-view-align cus-medium-button-style button-height">
              <button
                onClick={() => {
                  setIsAddAmeninties(true);
                }}
              >
                Add Distinctive Amenities
              </button>
            </div>
          </div>

          {/* delete model */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this distinctive amenity ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteAmenintie();
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          {/* end delete model */}

          <DataTable
            columns={columns}
            data={filteredAmeninties}
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

      {isAddAmeninties ? (
        <Dialog
          fullScreen
          open={isAddAmeninties}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          {/* <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleAddAdminClose}
                            aria-label="close"
                            style={{ width: '100%', justifyContent: 'flex-end' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar> */}
          <div className="cus-modal-close" onClick={handleAddAdminClose}>
            <CloseIcon />
          </div>
          <List>
            {isAddAmeninties === true ? (
              <div className="form full-container">
                {/* Name Amenintie */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Distinctive Amenity
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="name"
                        name="name"
                        value={inputValueForAdd.name}
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
                      {errorsForAdd["name"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Icon
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <AddImage
                      accept={"image/*"}
                      getCourses={(courses) => setEditQuiz(courses)}
                    />
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errorsForAdd["icon"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handelAddAmenintiesDetails(e);
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

      {isUpdateAmeninties ? (
        <Dialog
          fullScreen
          open={isUpdateAmeninties}
          onClose={handleAdminUpdateClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleAdminUpdateClose}
              aria-label="close"
              style={{ width: "100%", justifyContent: "flex-end" }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {isUpdateAmeninties === true ? (
              <div className="form full-container ">
                {/* Ameninties Name */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Distinctive Amenity
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="name"
                        name="name"
                        value={inputValue.name}
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
                      {errors["name"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Icon
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <AddImage
                      coursesEdit={editQuiz}
                      accept="image/*"
                      getCourses={(courses) => setEditQuiz(courses)}
                    />
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["icon"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handelUpdateAmenintieDetails(e);
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
    </>
  );
};

export default DistinctiveAmenities;
