import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { customStyles } from "../Properties/columnDesign";
import Loader from "react-loader-spinner";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";

function ResoldProperty() {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [propertyId, setPropertyId] = useState("");
    const [isBookingListModal, setIsBookingListModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        handleGetStatus();
    }, [page, countPerPage, searchTerm]);

    const handleClose = () => {
        setIsBookingListModal(false);
        setPropertyId("");
    };

    const showBookingList = (row) => {
        setPropertyId(row._id);
        history.push(`/sellrequestlist/${row._id}`);
        // setIsBookingListModal(true);
    }

    const handleGetStatus = async () => {
        setIsLoaderVisible(true);
        if (!searchTerm) {
            ApiPost(`property/getPropertys?page=${page}&limit=${countPerPage}`)
                .then(res => {
                    setFilteredStatus(res?.data?.payload?.data);
                    setCount(res?.data?.payload?.dataCount);
                    setIsLoaderVisible(false);
                })
                .catch(err => {
                    setIsLoaderVisible(false);
                    toast.error(err.response.data.message)
                })
        } else {
            ApiPost(`property/getPropertys?page=${page}&limit=${countPerPage}&search=${searchTerm}`)
                .then(res => {
                    setFilteredStatus(res?.data?.payload?.data);
                    setCount(res?.data?.payload?.dataCount);
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
            name: "Property Name",
            cell: (row) => {
                return (
                    <>
                        <p>{row?.address?.name}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Total Assets Value",
            cell: (row) => {
                return (
                    <>
                        <p>{row?.wholeHomePrice} {row?.priceType}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Ownership",
            selector: "ownership",
        },
        {
            name: "Status",
            cell: (row) => {
                return (
                    <>
                        <div className="d-flex justify-content-between cus-medium-button-style">
                            <div
                                className="cursor-pointer pl-2"
                                onClick={() => showBookingList(row)}>
                                <Tooltip title="Show Status" arrow>
                                    <VisibilityIcon />
                                </Tooltip>
                            </div>
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
                            <h2 className="pl-3 pt-2">Properties available for reselling</h2>
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

export default ResoldProperty