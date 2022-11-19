import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { customStyles } from "../Properties/columnDesign";
import Loader from "react-loader-spinner";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Tooltip } from "@material-ui/core";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";

function PropertySallRequest() {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState([]);
    const [isApproveStatusModal, setIsApproveStatusModal] = useState(false);
    const [statusForActiveApprove, setStatusForActiveApprove] = useState();
    const [idForEditStatus, setIdForEditStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [inputValueForAdd, setInputValueForAdd] = useState("");
    const [requestData, setRequestData] = useState();

    useEffect(() => {
        handleGetStatus();
    }, [page, countPerPage, searchTerm]);

    const handleClose = () => {
        setIdForEditStatus("");
        setIsApproveStatusModal(false);
        setStatusForActiveApprove()
    };

    const handleEditStatus = async (statusData) => {
        setIsLoaderVisible(true);
        if (statusData === "true") {
            const data = {
                isApproved: statusData
            }
            await ApiPut(`sell/updateSell/${idForEditStatus}`, data)
                .then((res) => {
                    if (res.status === 200) {
                        handleClose();
                        handleGetStatus();
                        setRequestData();
                        toast.success("Status Updated Successfully");
                    }
                })
                .catch((err) => {
                    toast.error(err.message);
                })
        } else {
            const data = {
                isApproved: statusData,
                reason: "reason"
            }
            await ApiPut(`sell/updateSell/${idForEditStatus}`, data)
                .then((res) => {
                    if (res.status === 200) {
                        handleClose();
                        handleGetStatus();
                        setRequestData();
                        toast.success("Status Updated Successfully");
                    }
                })
                .catch((err) => {
                    toast.error(err.message);
                })
        }
    }

    const handleGetStatus = async () => {
        setIsLoaderVisible(true);
        if (!searchTerm) {
            ApiGet(`sell/getAllSell?page=${page}&limit=${countPerPage}`)
                .then(res => {
                    setFilteredStatus(res?.data?.payload?.status);
                    setCount(res?.data?.payload?.count);
                    setIsLoaderVisible(false);
                })
                .catch(err => {
                    setIsLoaderVisible(false);
                    toast.error(err.response.data.message)
                })
        } else {
            ApiGet(`sell/getAllSell?page=${page}&limit=${countPerPage}&filter=${searchTerm}`)
                .then(res => {
                    setFilteredStatus(res?.data?.payload?.status);
                    setCount(res?.data?.payload?.count);
                    setIsLoaderVisible(false);
                })
                .catch(err => {
                    setIsLoaderVisible(false);
                    toast.error(err.response.data.message)
                })
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const columns = [
        {
            name: "SNo",
            cell: (row, index) => (page - 1) * countPerPage + (index + 1),
            width: "65px",
        },
        {
            name: "Name",
            cell: (row) => {
                return (
                    <>
                        <p>{row?.pid?.address?.name}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "User Name",
            cell: (row) => {
                return (
                    <>
                        <p>{row?.uid?.fullName}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Price",
            selector: "price",
        },
        {
            name: "Request Date",
            cell: (row) => {
                return (
                    <>
                        <p>{moment(row?.createdAt).format('DD-MM-YYYY')}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Description",
            cell: (row) => {
                return (
                    <>
                        <p>{row?.description}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => {
                return (
                    <>
                        <div className="d-flex justify-content-between cus-medium-button-style">
                            {row?.isApproved === "true" ? (
                                <>
                                    Approved
                                </>
                            ) : (
                                <button
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsApproveStatusModal(true);
                                        setIdForEditStatus(row?._id);
                                        setRequestData(row);
                                    }}
                                >
                                    {row?.isApproved === "pending" ? "Action" : row?.isApproved === "true" ? "Approved" : "Rejected"}
                                </button>
                            )}
                        </div>
                    </>
                );
            },
            sortable: true,
            selector: (row) => row.isActive,
        },
    ];

    return (
        <>
            <div className="card p-1">
                <ToastContainer />
                <div className="p-2 mb-2">
                    <div className="row mb-4 pr-3">
                        <div className="col-md-2 col-sm-12 d-flex justify-content-between">
                            <h2 className="pl-3 pt-2">Exit request</h2>
                        </div>
                        <div className="col">
                            <div>
                                <input
                                    type="text"
                                    className={`form-control form-control-lg form-control-solid `}
                                    name="title"
                                    placeholder="Search"
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <Modal show={isApproveStatusModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-danger">Alert!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {requestData?.isApproved === "pending" ? (
                                "Please Approve/Reject Propety sell request !")
                                : requestData?.isApproved === "true" ? (
                                    "Are you sure you want To reject this property sell request ?")
                                    : (
                                        "Are you sure you want To approve this property sell request ?"
                                    )}

                            {/* Are you sure you want To{" "}
                            {requestData?.isApproved === "pending" ? "approve or reject the request ?" : requestData?.isApproved === "true" ? "approve this property sell request ?" : "reject this property sell request ?"} */}
                            {/* {statusForActiveApprove === true ? "Approve" : "Reject"} this property sell request ?
                            {statusForActiveApprove === false &&
                                <div className="d-flex justify-content-center">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Enter your reason"
                                        onChange={(e) => setInputValueForAdd(e.target.value)}
                                    ></textarea>
                                </div>
                            } */}
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <Button variant="secondary" onClick={handleClose}> */}
                            <Button variant="secondary" onClick={() => handleEditStatus("true")}>
                                Approve
                            </Button>
                            <Button
                                variant="danger"
                                onClick={(e) => {
                                    handleEditStatus("false");
                                }}
                            >
                                Reject
                                {/* {statusForActiveApprove === true ? "Approve" : "Reject"} */}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <DataTable
                        columns={columns}
                        data={filteredStatus}
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
        </>
    )
}

export default PropertySallRequest