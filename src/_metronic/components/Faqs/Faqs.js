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
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import CsvDownload from "react-json-to-csv";
import { ToastContainer, toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Faqs = ({ getNewCount, title }) => {
  const [filteredFaqs, setFilteredFaqs] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  //new data
  const [isUpdateFaqs, setIsUpdateFaqs] = useState(false);
  const [isAddFaqs, setIsAddFaqs] = useState(false);
  const [isAddCsv, setIsAddCsv] = useState(false);
  const [idForUpdateFaqsData, setIdForUpdateFaqsData] = useState("");
  const [inputValue, setInputValue] = useState({});
  const [inputValueForAdd, setInputValueForAdd] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsForAdd, setErrorsForAdd] = useState({});
  const [idForDeleteFaqs, setIdForDeleteFaqs] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState();
  const [dataCSV, setDataCSV] = useState([]);
  const [uploadFile, setUploadFile] = useState();

  useEffect(() => {
    let data = {
      Id: "",
      Name: "",
      Question: "",
      Answer: "",
    };
    setDataCSV((currVal) => [...currVal, data]);
  }, [filteredFaqs]);

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
      : (document.title = "FAQs | OUR LEISURE HOME");
  }, []);
  const handleAdminUpdateClose = () => {
    setInputValue({});
    setIsUpdateFaqs(false);
  };

  const handleAddAdminClose = () => {
    setInputValue({});
    setIsAddFaqs(false);
    setIsAddCsv(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllFaqs();
  }, [page, countPerPage ,search]);

  const getFaqCategory = async () => {
    await ApiGet(`faqCategory/getAllFAQCategory`)
      .then((res) => {
        setFaqCategory(res?.data?.payload?.faq);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleUploadFile = async (event) => {
    event.preventDefault();
    const dataArray = new FormData();
    dataArray.append("csv", uploadFile);
    await ApiPost("faqCategory/upload-csv", dataArray)
      .then((res) => {
        setIsAddCsv(false);
        toast.success(res?.data?.message);
        setUploadFile();
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getAllFaqs = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(`faq/getAllFAQ?page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredFaqs(res?.data?.payload?.faq);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `faq/getAllFAQ?search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredFaqs(res?.data?.payload?.faq);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const validateFormForAddFaq = () => {
    let formIsValid = true;
    let errorsForAdd = {};
    if (inputValueForAdd && !inputValueForAdd.question) {
      formIsValid = false;
      errorsForAdd["question"] = "*Please Enter Question!";
    }
    if (inputValueForAdd && !inputValueForAdd.answer) {
      formIsValid = false;
      errorsForAdd["answer"] = "*Please Enter Answer!";
    }
    if (inputValueForAdd && !inputValueForAdd.facCategoryId) {
      formIsValid = false;
      errorsForAdd["facCategoryId"] = "*Please Select FAQ Category!";
    }
    setErrorsForAdd(errorsForAdd);
    return formIsValid;
  };
  const handelAddFaqsDetails = (e) => {
    e.preventDefault();
    if (validateFormForAddFaq()) {
      let Data = {
        question: inputValueForAdd.question,
        answer: inputValueForAdd.answer,
        facCategoryId: inputValueForAdd.facCategoryId,
      };
      ApiPost(`faq/addFAQ`, Data)
        .then((res) => {
          if (res?.status == 200) {
            setIsAddFaqs(false);
            toast.success("FAQ added successfully");
            setInputValueForAdd({});
            getAllFaqs();
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
    if (inputValue && !inputValue.question) {
      formIsValid = false;
      errors["name"] = "*Please Enter Question!";
    }
    if (inputValue && !inputValue.answer) {
      formIsValid = false;
      errors["answer"] = "*Please Enter Answer!";
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleDeleteFaqs = () => {
    ApiDelete(`faq/deleteFAQ/${idForDeleteFaqs}`)
      .then((res) => {
        if (res?.status == 200) {
          setShow(false);
          toast.success("FAQ deleted successfully");
          getAllFaqs();
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

  const handelUpdateFaqsDetails = (e) => {
    e.preventDefault();
    if (validateForm()) {
      ApiPut(`faq/updateFAQ/${idForUpdateFaqsData}`, inputValue)
        .then((res) => {
          if (res?.status == 200) {
            setIsUpdateFaqs(false);
            toast.success("FAQ updated successfully");
            setInputValue({});
            getAllFaqs();
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
      name: "Category",
      cell: (row) => {
        return (
          <>
            <p>{row?.facCategoryId?.name}</p>
          </>
        );
      },
      width: "200px",
      sortable: true,
    },
    {
      name: "Question",
      selector: "question",
      width: "400px",

      cell: (row) => {
        return (
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: row?.question,
              }}
              className=""
            />
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Answer",
      selector: "answer",
      cell: (row) => {
        return (
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: row?.answer,
              }}
              className=""
            />
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Actions",
      width: "80px",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer pl-2"
                onClick={() => {
                  setIsUpdateFaqs(true);
                  setIdForUpdateFaqsData(row._id);
                  setInputValue({
                    question: row?.question,
                    answer: row?.answer,
                  });
                }}
              >
                <Tooltip title="Edit Faqs" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setShow(true);
                setIdForDeleteFaqs(row?._id);
              }}
            >
              <Tooltip title="Delete Faqs" arrow>
                <DeleteIcon />
              </Tooltip>
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="card p-1">
        {document.title === "FAQs | OUR LEISURE HOME" && <ToastContainer />}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-xl-2 col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">FAQs</h2>
            </div>
            <div className="col-xl-4 col-md-9 col-sm-12 mobile-view-align">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search FAQs"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
            <div className="d-flex col-xl-6 col-md-12 pt-md-3 pt-xl-0 justify-content-md-center flex-wrap all-button-right-alignment">
              <div className="cus-medium-button-style button-height mobile-button-center-align mobile-view-align">
                <CsvDownload
                  className={``}
                  data={dataCSV}
                  filename="Sample Excel Download.csv"
                >
                  Sample Excel Download
                </CsvDownload>
              </div>
              <div className="cus-medium-button-style button-height mobile-button-center-align mobile-view-align">
                <button
                  onClick={() => {
                    setIsAddCsv(true);
                  }}
                >
                  Export Excel
                </button>
              </div>
              <div className="cus-medium-button-style button-height mobile-button-center-align mobile-view-align">
                <button
                  onClick={() => {
                    setIsAddFaqs(true);
                    getFaqCategory();
                  }}
                >
                  Add FAQs
                </button>
              </div>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this FAQ ?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteFaqs();
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          <DataTable
            columns={columns}
            data={filteredFaqs}
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

      {isAddCsv ? (
        <Dialog
          fullScreen
          open={isAddCsv}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAddAdminClose}>
            <CloseIcon />
          </div>
          <List>
            {isAddCsv === true ? (
              <div className="form full-container">
                <form onSubmit={handleUploadFile}>
                  <div className="form-group row">
                    <label className="col-xl-3 col-lg-3 col-form-label">
                      select File
                    </label>
                    <div className="col-lg-9 col-xl-6">
                      <div>
                        <input
                          type="file"
                          name="csv"
                          className={`form-control form-control-lg form-control-solid `}
                          onChange={(e) => setUploadFile(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-center">
                    <button type="submit" className="btn btn-success mr-2">
                      <span>Add Details</span>
                      {loading && (
                        <span className="mx-3 spinner spinner-white"></span>
                      )}
                    </button>
                  </div>
                  {/* <input type="submit" /> */}
                </form>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}

      {isAddFaqs ? (
        <Dialog
          fullScreen
          open={isAddFaqs}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAddAdminClose}>
            <CloseIcon />
          </div>
          <List>
            {isAddFaqs === true ? (
              <div className="form full-container">
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Question
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="question"
                        name="question"
                        value={inputValueForAdd.question}
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
                      {errorsForAdd["question"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Answer
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="answer"
                        name="answer"
                        value={inputValueForAdd.answer}
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
                      {errorsForAdd["answer"]}
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Category
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <select
                      id="facCategoryId"
                      name="facCategoryId"
                      className={`form-control form-control-lg form-control-solid `}
                      onChange={(e) => handleOnChangeAdd(e)}
                    >
                      <option value="" disabled selected hidden>
                        Select Category
                      </option>
                      {faqCategory &&
                        faqCategory?.map((category) => {
                          return (
                            <option value={category?._id}>
                              {category?.name}
                            </option>
                          );
                        })}
                    </select>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errorsForAdd["facCategoryId"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handelAddFaqsDetails(e);
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

      {isUpdateFaqs ? (
        <Dialog
          fullScreen
          open={isUpdateFaqs}
          onClose={handleAdminUpdateClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleAdminUpdateClose}>
            <CloseIcon />
          </div>
          <List>
            {isUpdateFaqs === true ? (
              <div className="form full-container">
                {/* Ameninties Name */}
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Question
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="question"
                        name="question"
                        value={inputValue.question}
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
                      {errors["question"]}
                    </span>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Answer
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid `}
                        id="answer"
                        name="answer"
                        value={inputValue.answer}
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
                      {errors["answer"]}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handelUpdateFaqsDetails(e);
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

export default Faqs;
