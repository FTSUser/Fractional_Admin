import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet, ApiPut, ApiPost } from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import { reject } from "lodash";
import AwsConfig from "../../../config/BucketConfig/BucketConfig";
import S3 from "react-aws-s3";
import { InputTextField } from "../../_helpers/InputTextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Howitworks = ({ getNewCount, title }) => {
  const [filteredAboutUs, setFilteredAboutUs] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataViewMore, setDataViewMore] = useState({});
  const [isViewMoreAboutus, setIsViewMoreAboutus] = useState(false);
  const [description, setDescription] = useState("");
  const [isUpdateAboutUs, setIsUpdateAboutUs] = useState(false);
  const [isAddAboutUs, setIsAddAboutUs] = useState(false);
  const [idForUpdateAboutUsData, setIdForUpdateAboutUsData] = useState("");
  const [inputValue, setInputValue] = useState({});
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
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

  const handleViewMoreClose = () => {
    setIsViewMoreAboutus(false);
    setDataViewMore({});
  };

  const handleAdminUpdateClose = () => {
    setInputValue({});
    setDescription("");
    setIsUpdateAboutUs(false);
  };

  const handleAddAdminClose = () => {
    setInputValue({});
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
    if (!search) {
      await ApiGet(
        `howitwork/getAllHowitwork?page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredAboutUs(res?.data?.payload?.howitwork);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `howitwork/getAllHowitwork?search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredAboutUs(res?.data?.payload?.howitwork);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

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

  const getImageArrayFromUpload = async (e) => {
    let driviniglicencephoto = await uploadS3bucket(e);
    setInputValueForAdd((cv) => {
      return { ...cv, photo: driviniglicencephoto };
    });
  };

  const validateFormForAddAdmin = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    if (inputValueForAdd && !inputValueForAdd.title) {
      formIsValid = false;
      errorsForAdd["title"] = "*Please Enter Title!";
    }
    if (!description) {
      formIsValid = false;
      errorsForAdd["description"] = "*Please Enter Description!";
    }
    if (inputValueForAdd && !inputValueForAdd.photo) {
      formIsValid = false;
      errorsForAdd["photo"] = "*Please Upload Image!";
    }

    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };

  const handleAddAboutUsDetails = (e) => {
    e.preventDefault();
    if (validateFormForAddAdmin()) {
      let Data = {
        title: inputValueForAdd.title,
        description: description,
        photo: inputValueForAdd.photo,
        isActive: false,
      };
      ApiPost(`howitwork/addAllHowitwork`, Data)
        .then((res) => {
          if (res?.status === 200) {
            setIsAddAboutUs(false);
            toast.success(res?.data?.message);
            setInputValueForAdd({});
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

  const getImageArrayFromUpdateUpload = async (e) => {
    let driviniglicencephoto = await uploadS3bucket(e);
    setInputValue((cv) => {
      return { ...cv, photo: driviniglicencephoto };
    });
  };
  const validateForm = () => {
    let formIsValid = true;
    let errors = {};
    if (inputValue && !inputValue.title) {
      formIsValid = false;
      errors["title"] = "*Please Enter Title!";
    }
    if (!description) {
      formIsValid = false;
      errors["description"] = "*Please Enter Description!";
    }
    if (inputValue && !inputValue.photo) {
      formIsValid = false;
      errors["photo"] = "*Please Upload Image!";
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleUpdateAboutUsDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let Data = {
        title: inputValue.title,
        description: description,
        photo: inputValue.photo,
        isActive: inputValue.isActive,
      };
      ApiPut(`howitwork/updateHowitwork/${idForUpdateAboutUsData}`, Data)
        .then((res) => {
          if (res?.status === 200) {
            setIsUpdateAboutUs(false);
            // toast.success(res?.data?.message);
            toast.success("Status updated successfully");
            setInputValue({});
            setDescription("");
            getAllAboutUs();
            setShow(false);
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
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      cell: (row) => {
        return (
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: row?.description,
              }}
              className=""
            />
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => {
        return (
          <>
            <div className="p-3">
              <img
                className="max-w-50px zoom"
                alt="img"
                src={row?.photo != null ? row.photo : ""}
              />
            </div>
          </>
        );
      },
      wrap: true,
    },
    {
      name: "Status",
      selector: "isActive",

      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between cus-medium-button-style">
              <button
                className="cursor-pointer"
                onClick={() => {
                  setShow(true);
                  setIdForUpdateAboutUsData(row._id);
                  setInputValue({
                    title: row?.title,
                    description: row?.description,
                    photo: row?.photo,
                    isActive: !row?.isActive,
                  });
                  setDescription(row?.description);

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
                  setIsUpdateAboutUs(true);
                  setIdForUpdateAboutUsData(row._id);
                  setInputValue({
                    title: row?.title,
                    description: row?.description,
                    photo: row?.photo,
                    isActive: row?.isActive,
                  });

                  setDescription(row?.description);
                }}
              >
                <Tooltip title="Edit How It Works" arrow>
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

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
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
      getAllAboutUs();
    } else {
      setPage(1);
      setCount(0);
      setCountPerPage(countPerPage);
      getAllAboutUs();
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="card p-1">
        {document.title === "About Us | OUR LEISURE HOME" && <ToastContainer />}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">How It Works</h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search How it works"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
          </div>

          {/* delete model */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to {status === true ? "active" : "inactive"}{" "}
              this how it works ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleUpdateAboutUsDetails(e);
                }}
              >
                {status === true ? "Active" : "Inactive"}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* end delete model */}

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
              <div className="form ml-30 ">
                <InputTextField
                  label="Enter Title"
                  type="text"
                  name="title"
                  maxLength={50}
                  value={inputValueForAdd.title}
                  onChange={(e) => handleOnChangeAdd(e)}
                  error={errorsForAdd["title"]}
                />

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Description
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <CKEditor
                        id="description"
                        editor={ClassicEditor}
                        value={inputValueForAdd.description}
                        data={description}
                        onChange={(descriptionData, editor) => {
                          setDescription(editor.getData());
                          setErrorsForAdd({ ...errorsForAdd, description: "" });
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

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Image
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="file"
                        className={`form-control form-control-lg form-control-solid `}
                        name="image"
                        onChange={(e) => {
                          getImageArrayFromUpload(e.target.files[0]);
                        }}
                        accept="image/*"
                        required
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errorsForAdd["photo"]}
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
              <div className="form ml-30 ">

                <InputTextField
                  label="Enter Title"
                  type="text"
                  name="title"
                  value={inputValue.title}
                  onChange={(e) => handleOnChange(e)}
                  error={errors["title"]}
                />

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Description
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <CKEditor
                      id="description"
                      editor={ClassicEditor}
                      value={inputValueForAdd.description}
                      data={description}
                      onChange={(descriptionData, editor) => {
                        setDescription(editor.getData());
                        setErrorsForAdd({ ...errorsForAdd, description: "" });
                      }}
                    />
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    ></span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Image
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="file"
                        className={`form-control form-control-lg form-control-solid `}
                        name="photo"
                        id="photo"
                        onChange={(e) => {
                          getImageArrayFromUpdateUpload(e.target.files[0]);
                        }}
                        accept="image/*"
                        required
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["photo"]}
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

      {isViewMoreAboutus ? (
        <Dialog
          fullScreen
          open={isViewMoreAboutus}
          onClose={handleViewMoreClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleViewMoreClose}
              aria-label="close"
              style={{ width: "100%", justifyContent: "flex-end" }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {isViewMoreAboutus === true ? (
              <div className="form ml-30 ">
                <div className="form-group row mb-0">
                  <p>Title:</p>
                </div>
                <div className="form-group row mr-20">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: dataViewMore?.title,
                    }}
                    className=""
                  />
                </div>
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
                <div className="form-group row mb-0">
                  <p>Image:</p>
                </div>
                <div className="form-group row mr-20">
                  <img
                    src={dataViewMore?.photo}
                    alt=""
                    height="256px"
                    width="256px"
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

export default Howitworks;
