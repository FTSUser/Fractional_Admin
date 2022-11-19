import React, { useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet } from "../../../helpers/API/ApiData";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import List from "@material-ui/core/List";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { ApiPut } from "../../../helpers/API/ApiData";
import AllInformation from "../AllInformation/AllInformation";
import moment from "moment";
import "./user.scss";

const KycRequest = () => {
  const [filteredAdmin, setFilteredAdmin] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isViewMoreUserDetails, setIsViewMoreUserDetails] = useState(false);
  const [dataViewMore, setDataViewMore] = useState({});
  const [idForEditStatus, setIdForEditStatus] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusForActive, setStatusForActive] = useState("");
  const [approveMessage, setApproveMessage] = useState("");
  const [documentDetails, setDocumentDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [viewUserInfo, setViewUserInfo] = useState(false);

  const bankDoc = dataViewMore?.bank?.includes(".pdf");
  const panDoc = dataViewMore?.PANcard?.includes(".pdf");
  const passportDoc = dataViewMore?.passport?.includes(".pdf");

  const handleClose = () => {
    setShow(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleViewMoreClose = () => {
    setIsViewMoreUserDetails(false);
    setDataViewMore({});
    setDocumentDetails({});
  };

  const handleShowInformation = (data) => {
    setDataViewMore(data);
    setViewUserInfo(true);
  };

  const handleViewUserInfoClose = () => {
    setViewUserInfo(false);
    setDataViewMore({});
    getAllAdmins();
  };


  useEffect(() => {
    getAllAdmins();
  }, [page, countPerPage , search]);

  const getAllAdmins = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(`admin/get-users?isActive=false&page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredAdmin(res?.data?.payload?.user);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `admin/get-users?isActive=false&search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredAdmin(res?.data?.payload?.user);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  const handleActiveUser = async () => {
    setIsLoaderVisible(true);
    let data = {
      isActive: statusForActive,
      description: approveMessage,
    };
    await ApiPut(`admin/activeAdmin/${idForEditStatus}`, data)
      .then((res) => {
        setIsLoaderVisible(false);
        toast.success(res?.data?.message);
        getAllAdmins();
        setStatusForActive("");
        handleModalClose();
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleEditStatus = () => {
    let data = {
      status: status,
      id: idForEditStatus,
    };
    ApiPut(`admin/block`, data)
      .then((res) => {
        if (res?.status == 200) {
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

  const onChangeAddValue = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setDocumentDetails({ ...documentDetails, [name]: value });
    } else if (
      name === "bank" ||
      name === "PANcard" ||
      name === "passport" ||
      name === "status"
    ) {
      let val = value === "true" ? true : false;
      setDocumentDetails({ ...documentDetails, [name]: val });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleFormValied = () => {
    let errors = {};
    let formValied = true;
    if (documentDetails.passport === undefined) {
      formValied = false;
      errors["passport"] =
        "Please select either approve or reject for documents.";
    }
    if (documentDetails.PANcard === undefined) {
      formValied = false;
      errors["PANcard"] = "please select either approve or reject for PANcard.";
    }
    if (documentDetails.bank === undefined) {
      formValied = false;
      errors["bank"] =
        "Please select either approve or reject for bank details.";
    }
    if (
      (documentDetails.bank === false ||
        documentDetails.PANcard === false ||
        documentDetails.passport === false) &&
      !documentDetails.description
    ) {
      formValied = false;
      errors["description"] = "plese enter the reason of rejection.";
    }
    setErrors(errors);
    return formValied;
  };

  const submitData = async (e) => {
    if (handleFormValied()) {
      let data = {
        isActive: documentDetails.status,
        isPANVerified: documentDetails.PANcard,
        isBankVerified: documentDetails.bank,
        isPassportVerified: documentDetails.passport,
        description: documentDetails.description,
      };
      await ApiPut(`admin/approve/${idForEditStatus}`, data)
        .then((res) => {
          setIdForEditStatus("");
          setDocumentDetails({});
          getAllAdmins();
          setIsViewMoreUserDetails(false);
          toast.success(res?.data?.message);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  let i = 0;
  const columns = [
    {
      name: "SNo",
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
      width: "55px",
    },
    {
      name: "Email",
      selector: "email",
      cell: (row) => {
        return (
          <>
            {row?.email ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: row?.email === "undefined" ? "-" : row?.email,
                }}
                className=""
              />
            ) : (
              <p>-</p>
            )}
          </>
        );
      },
    },
    {
      name: "Full Name",
      selector: "fullName",
      sortable: true,
    },
    {
      name: "Phone No.",
      //   selector: "phone",
      sortable: true,
      cell: (row) => {
        return <>{row?.phone === "undefined" ? <p>-</p> : row?.phone ? <p> {row?.phone}</p> : <p>-</p>}</>;
      },
    },
    {
      name: "Category",
      selector: "nationality",
      sortable: true,
      cell: (row) => {
        return <>{row?.nationality === "nri" ? "Non-Indian" : row?.nationality === "indian" ? "Indian" : ""}</>
      }
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
                  setShowModal(true);
                  setIdForEditStatus(row?._id);
                  setStatusForActive(row?.isActive == true ? false : true);
                }}
              >
                {row.isActive == true ? "Approve" : "Reject"}
              </button>
            </div>
          </>
        );
      },
      sortable: true,
      selector: (row) => row.isActive,
    },
    {
      name: "KYC Document",
      cell: (row) => {
        return (
          <>
            <div
              className="cursor-pointer pl-2"
              onClick={() => {
                handleShowInformation(row);
              }}
            >
              <Tooltip title="Show More" arrow>
                <InfoOutlinedIcon />
              </Tooltip>
            </div>
          </>
        );
      },
      sortable: true,
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
        <ToastContainer />
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">KYC request</h2>
            </div>
            <div className="col-md-5 col-sm-12">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search Users"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
          </div>

          {/* status */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want To{" "}
              {status === "active" ? "Approve" : "Reject"} this user
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
                {status === "active" ? "Approve" : "Reject"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex justify-content-between">
                Are you sure you want to{" "}
                {statusForActive === true ? "active" : "Reject"} this user ?
              </div>

              {/* <div className="form full-container">
                <div className="form-group row mb-0">
                  <p>Document:</p>
                </div>
                <div className="form-group row mr-20">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setApproveMessage(e.target.value)}
                  />
                </div>
              </div> */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={(e) => {
                  handleActiveUser();
                }}
              >
                {statusForActive === true ? "Approve" : "Reject"}
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

      {viewUserInfo ? (
        <Dialog
          fullScreen
          open={viewUserInfo}
          onClose={handleViewUserInfoClose}
        // TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleViewUserInfoClose}>
            <CloseIcon />
          </div>
          <List>
            <div>
              {viewUserInfo === true ? (
                <>
                  <AllInformation
                    dataViewMore={dataViewMore}
                    handleAllInfoClose={handleViewUserInfoClose}
                  />
                </>
              ) : null}
            </div>
          </List>
        </Dialog>
      ) : null}

      {isViewMoreUserDetails ? (
        <Dialog
          fullScreen
          open={isViewMoreUserDetails}
          onClose={handleViewMoreClose}
        >
          <div className="cus-modal-close" onClick={handleViewMoreClose}>
            <CloseIcon />
          </div>
          <List>
            <div>
              {isViewMoreUserDetails === true ? (
                <>
                  <div className="logo-alignment">
                    <img
                      src="https://i.ibb.co/mTk52hb/logo-ur-black.png"
                      width="20%"
                    />
                  </div>
                  <p className="information-title">information:</p>
                  <div className="information-div">
                    <div className="informationSection">
                      <div>
                        <p className="information-p">nationality:</p>
                        <p className="information-data">
                          {dataViewMore.nationality}
                        </p>
                        <p className="information-p">Full Name:</p>
                        <p className="information-data">
                          {dataViewMore.fullName}
                        </p>
                        <p className="information-p">Date Of Birth:</p>
                        <p className="information-data"></p>
                        <p className="information-p">Email:</p>
                        <p className="information-data">{dataViewMore.email}</p>
                        <p className="information-p">Document Number:</p>
                        <p className="information-data">
                          {dataViewMore.number}
                        </p>
                        <p className="information-p">Document Expiry Date:</p>
                        <p className="information-data">
                          {moment(dataViewMore.expiryDate).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div className="informationSection2">
                        <p className="information-p">Document issueDate: </p>
                        <p className="information-data">
                          {moment(dataViewMore.issueDate).format("DD/MM/YYYY")}
                        </p>
                        <p className="information-p">Bank Name:</p>
                        <p className="information-data">
                          {dataViewMore.bankName}
                        </p>
                        <p className="information-p"> Bank Account Number:</p>
                        <p className="information-data">
                          {dataViewMore.bankAccountNumber}
                        </p>
                        <p className="information-p">phone:</p>
                        <p className="information-data">{dataViewMore.phone}</p>
                        <p className="information-p">Bank IFSC Code:</p>
                        <p className="information-data">
                          {dataViewMore.bankIfscCode}
                        </p>
                        <p className="information-p">Bank Address:</p>
                        <p className="information-data">
                          {dataViewMore.bankAddress}
                        </p>
                        <p className="information-p"> PAN Card Number:</p>
                        <p className="information-data">
                          {dataViewMore.PANnumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  {dataViewMore?.bank ||
                    dataViewMore.PANcard ||
                    dataViewMore.passport ? (
                    <div>
                      <div className="form tableDocuments">
                        <div className="form-group row mb-0">
                          <p className="main-title">Documents:</p>
                        </div>
                        <div className="table-document">
                          <table border="2px">
                            <tr>
                              <th>Sno</th>
                              <th>Name</th>
                              <th>Document</th>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Upload PDF For {dataViewMore.dType}</td>
                              <td>
                                <div className="table_Row">
                                  <div>
                                    {passportDoc === true ? (
                                      <iframe
                                        src={dataViewMore?.passport}
                                        height="250px"
                                        width="300px"
                                      />
                                    ) : (
                                      <img
                                        src={dataViewMore?.passport}
                                        alt=""
                                        height="250px"
                                        width="300px"
                                        style={{ marginRight: "10px" }}
                                      />
                                    )}
                                  </div>
                                  <div className="approve-reject-div">
                                    <button
                                      disabled={
                                        dataViewMore?.isPassportVerified
                                      }
                                      name="passport"
                                      value={true}
                                      onClick={(e) => onChangeAddValue(e)}
                                      className="approve-btn"
                                    >
                                      {dataViewMore?.isPassportVerified
                                        ? "Approved"
                                        : "approve"}
                                    </button>
                                    {dataViewMore?.isPassportVerified ===
                                      false ||
                                      dataViewMore?.isPassportVerified ===
                                      undefined ? (
                                      <button
                                        name="passport"
                                        value={false}
                                        onClick={(e) => onChangeAddValue(e)}
                                        className="reject-btn"
                                      >
                                        reject
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                    <br />
                                    <span
                                      style={{
                                        color: "red",
                                        top: "5px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {errors["passport"]}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Upload PDF for PAN Card</td>
                              <td>
                                <div className="table_Row">
                                  <div>
                                    {panDoc === true ? (
                                      <iframe
                                        src={dataViewMore?.PANcard}
                                        height="250px"
                                        width="300px"
                                      />
                                    ) : (
                                      <img
                                        src={dataViewMore?.PANcard}
                                        alt=""
                                        height="250px"
                                        width="300px"
                                        style={{ marginRight: "10px" }}
                                      />
                                    )}
                                  </div>
                                  <div className="approve-reject-div">
                                    <button
                                      disabled={dataViewMore?.isPANVerified}
                                      name="PANcard"
                                      value={true}
                                      onClick={(e) => onChangeAddValue(e)}
                                      className="approve-btn"
                                    >
                                      {dataViewMore?.isPANVerified
                                        ? "Approved"
                                        : "approve"}
                                    </button>
                                    {dataViewMore?.isPANVerified === false ||
                                      dataViewMore?.isPANVerified ===
                                      undefined ? (
                                      <button
                                        name="PANcard"
                                        value={false}
                                        onClick={(e) => onChangeAddValue(e)}
                                        className="reject-btn"
                                      >
                                        reject
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                    <br />
                                    <span
                                      style={{
                                        color: "red",
                                        top: "5px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {errors["PANcard"]}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>Upload PDF for Bank Passbook</td>
                              <td>
                                <div className="table_Row">
                                  <div>
                                    {bankDoc === true ? (
                                      <iframe
                                        src={dataViewMore?.bank}
                                        height="250px"
                                        width="300px"
                                      />
                                    ) : (
                                      <img
                                        src={dataViewMore?.bank}
                                        alt=""
                                        height="250px"
                                        width="300px"
                                        style={{ marginRight: "10px" }}
                                      />
                                    )}
                                  </div>
                                  <div className="approve-reject-div">
                                    <button
                                      disabled={dataViewMore?.isBankVerified}
                                      name="bank"
                                      value={true}
                                      onClick={(e) => onChangeAddValue(e)}
                                      className="approve-btn"
                                    >
                                      {dataViewMore?.isBankVerified
                                        ? "Approved"
                                        : "approve"}
                                    </button>
                                    {dataViewMore?.isBankVerified === false ||
                                      dataViewMore?.isBankVerified ===
                                      undefined ? (
                                      <button
                                        name="bank"
                                        value={false}
                                        onClick={(e) => onChangeAddValue(e)}
                                        className="reject-btn"
                                      >
                                        reject
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                    <br />
                                    <span
                                      style={{
                                        color: "red",
                                        top: "5px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {errors["bank"]}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div className="reject-center">
                        {(documentDetails.PANcard === false ||
                          documentDetails.bank === false ||
                          documentDetails.passport === false) && (
                            <div>
                              <p className="rejection-title">
                                Reason of Rejection:
                              </p>
                              <textarea
                                placeholder="enter comment"
                                value={documentDetails?.description}
                                name="description"
                                className="text-area"
                                onChange={(e) => onChangeAddValue(e)}
                              ></textarea>
                              <span
                                style={{
                                  color: "red",
                                  top: "5px",
                                  fontSize: "14px",
                                }}
                              >
                                {errors["description"]}
                              </span>
                            </div>
                          )}
                        {/* <div>
                            <select name="status" onClick={(e) => onChangeAddValue(e)} >
                                <option value="" selected disabled>Select status </option>
                                <option value={true}>active</option>
                                <option value={false}>deActive</option>
                            </select>
                        </div> */}
                        {documentDetails.PANcard === false ||
                          documentDetails.bank === false ||
                          documentDetails.passport === false ? (
                          <div className="send-btn">
                            <button
                              onClick={(e) => submitData(e)}
                              className="submit-btn"
                            >
                              send
                            </button>
                          </div>
                        ) : dataViewMore?.isPANVerified === true &&
                          dataViewMore?.isBankVerified === true &&
                          dataViewMore?.isPassportVerified === true ? (
                          <div className="send-btn">
                            <button disabled className="submit-btn">
                              Approved All Document
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => submitData(e)}
                            className="submit-btn"
                          >
                            submit
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : null}{" "}
            </div>
          </List>
        </Dialog>
      ) : null}
    </>
  );
};

export default KycRequest;

