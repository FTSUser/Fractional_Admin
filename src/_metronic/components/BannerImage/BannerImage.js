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
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AwsConfig from "../../../config/BucketConfig/BucketConfig";
import S3 from "react-aws-s3";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BannerImage = ({ getNewCount, title }) => {
  const [filteredAboutUs, setBannerImage] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dataViewMore, setDataViewMore] = useState({});
  const [isViewMoreAboutus, setIsViewMoreAboutus] = useState(false);

  const [description, setDescription] = useState("");

  //new data
  const [isAddAboutUs, setIsAddAboutUs] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [idForDeleteAboutUs, setIdForDeleteAboutUs] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const handleOnChangeAdd = (e) => {
    const { name, value } = e.target;
    setInputValueForAdd({ ...inputValueForAdd, [name]: value });
    setErrorsForAdd({ ...errorsForAdd, [name]: "" });
  };

  const handleViewMoreClose = () => {
    setIsViewMoreAboutus(false);
    setDataViewMore({});
  };

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "Banner Image | OUR LEISURE HOME");
  }, []);


  const handleAddAdminClose = () => {
    setInputValue({});
    setDescription([]);
    setIsAddAboutUs(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllBannerImage();
  }, [page, countPerPage]);

  const getAllBannerImage = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(`banner/getBanner?page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setBannerImage(res?.data?.payload?.banner);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `banner/getBanner?search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setBannerImage(res?.data?.payload?.banner);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const validateFormForBannerImage = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    if (inputValueForAdd && !inputValueForAdd.title) {
      formIsValid = false;
      errorsForAdd["title"] = "*Please Enter Title!";
    }
    if (inputValueForAdd && !inputValueForAdd.photo) {
      formIsValid = false;
      errorsForAdd["photo"] = "*Please Upload Image!";
    }

    setErrorsForAdd(errorsForAdd);
    return formIsValid;
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

  const handleAddBannerImage = (e) => {
    e.preventDefault();
    if (validateFormForBannerImage()) {
      let Data = {
        title: inputValueForAdd.title,
        photo: inputValueForAdd.photo,
      };
      ApiPost(`banner/addBanner`, Data)
        .then((res) => {
          if (res?.status === 200) {
            setIsAddAboutUs(false);
            toast.success("Banner image added successfully");
            setInputValueForAdd({});
            getAllBannerImage();
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

  const getImageArrayFromUpload = async (e) => {
    let driviniglicencephoto = await uploadS3bucket(e);

    setInputValueForAdd((cv) => {
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

  const handleDeleteAboutUs = () => {
    ApiDelete(`banner/deleteBanner/${idForDeleteAboutUs}`)
      .then((res) => {
        if (res?.status === 200) {
          setShow(false);
          toast.success("Banner image deleted successfully");
          getAllBannerImage();
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
      name: "Actions",
      cell: (row) => {
        return (
          <>
            <div
              className="cursor-pointer"
              onClick={() => {
                setShow(true);
                setIdForDeleteAboutUs(row?._id);
              }}
            >
              <Tooltip title="Delete Banner Image" arrow>
                <DeleteIcon />
              </Tooltip>
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
        {document.title === "Banner Image | OUR LEISURE HOME" && (
          <ToastContainer />
        )}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">
                Banner Image{" "}
                <span style={{ fontSize: "15px" }}>(size: 1440px x 900px)</span>
              </h2>
            </div>
            <div className="cus-medium-button-style button-height">
              <button
                onClick={() => {
                  setIsAddAboutUs(true);
                }}
              >
                Add Banner Image
              </button>
            </div>
          </div>

          {/* delete model */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this banner image ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteAboutUs();
                }}
              >
                Delete
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
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Title
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
                      handleAddBannerImage(e);
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

      {isViewMoreAboutus ? (
        <Dialog
          fullScreen
          open={isViewMoreAboutus}
          onClose={handleViewMoreClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleViewMoreClose}>
            <CloseIcon />
          </div>
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

export default BannerImage;
