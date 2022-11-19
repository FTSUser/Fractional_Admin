import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { customStyles } from "../Properties/columnDesign";
import Loader from "react-loader-spinner";
import { Tooltip } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import StatusAdd from "./StatusAdd";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import CloseIcon from "@material-ui/icons/Close";



function Status() {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState([]);
    const [isAddStatus, setIsAddStatus] = useState(false);
    const [errorsForAdd, setErrorsForAdd] = useState({});
    const [inputValueForAdd, setInputValueForAdd] = useState({});

    useEffect(() => {
        handleGetStatus();
    }, []);

    const handleOnChangeAdd = (e) => {
        const { name, value } = e.target;
        setInputValueForAdd({ ...inputValueForAdd, [name]: value });
        setErrorsForAdd({ ...errorsForAdd, [name]: "" });
    };


    const validateForm = () => {
        let isError = false;
        const errors = {};
        if (!inputValueForAdd.name) {
            isError = true;
            errors["name"] = "Name is required";
        }
        if (!inputValueForAdd.description) {
            isError = true;
            errors["description"] = "Description is required";
        }
        setErrorsForAdd(errors);
        return isError;
    };



    const handelAddStatusDetails = async () => {
        if (validateForm()) {
        setIsLoaderVisible(true);
        ApiPost("status/addstatus", inputValueForAdd)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoaderVisible(false);
                    setIsAddStatus(false);
                    toast.success("Status Added Successfully");
                    handleGetStatus();
                }
            })
            .catch((err) => {
                setIsLoaderVisible(false);
                if (err.response.status === 400) {
                    setErrorsForAdd(err.response.data);
                }
            });
        }
    };

    const handleGetStatus = async () => {
        setIsLoaderVisible(true);
        ApiGet('status/getAllstatus')
            .then(res => {
                setFilteredStatus(res.data.payload?.status);
                setCount(res.data.payload.count);
                setIsLoaderVisible(false);
            })
            .catch(err => {
                setIsLoaderVisible(false);
                toast.error(err.response.data.message)
            })
    }

    const handleAddStatusClose = () => {
        setIsAddStatus(false);
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
                        <p>{row?.name}</p>
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
    ];
    return (
        <>
            <div className="card p-1">
                <ToastContainer />
                <div className="p-2 mb-2">
                    <div className="row mb-4 pr-3">
                        <div className="col-md-2 col-sm-12 d-flex justify-content-between">
                            <h2 className="pl-3 pt-2">Property Status</h2>
                        </div>
                        {/* <div className="d-flex col-md-4 all-button-right-alignment">
                            <div className="cus-medium-button-style button-height mobile-button-center-align mobile-view-align">
                                <button
                                    onClick={() => {
                                        setIsAddStatus(true);
                                    }}
                                >
                                    Add Status
                                </button>
                            </div>
                        </div> */}
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
            <Dialog
                fullScreen
                open={isAddStatus}
                onClose={handleAddStatusClose}
            >
                <div className="cus-modal-close" onClick={handleAddStatusClose}>
                    <CloseIcon />
                </div>
                <List>
                    {isAddStatus &&
                        <StatusAdd
                        errorsForAdd={errorsForAdd}
                        inputValueForAdd={inputValueForAdd}
                        loading={isLoaderVisible}
                        handelAddStatusDetails={handelAddStatusDetails}
                        handleOnChangeAdd={handleOnChangeAdd}
                         />
                    }
                </List>
            </Dialog>
        </>
    )
}

export default Status