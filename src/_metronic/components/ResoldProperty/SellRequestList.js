import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Loader from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import { ApiGet, ApiPost } from '../../../helpers/API/ApiData';
import { customStyles } from '../Properties/columnDesign';
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import RefundForm from '../Refund/RefundForm';
import { Dialog } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import List from "@material-ui/core/List";

function SellRequestList(props) {
    // const { propertyId } = props;
    const propertyId = props.match.params.id;
    const adminId = JSON.parse(localStorage.getItem('userinfo')).admin.id;
    const [bookingList, setBookingList] = useState([]);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [userRefundHistory, setUserRefundHistory] = useState([]);
    const [refundData, setRefundData] = useState({});
    const [propertyToken, setPropertyToken] = useState();
    const [propertyPrice, setPropertyPrice] = useState();
    const [isRefundForm, setIsRefundForm] = useState(false);
    const [isSuccessPaymentForm, setIsSuccessPaymentForm] = useState(false);
    const [userId, setUserId] = useState("");

    const history = useHistory();
    useEffect(() => {
        handleGetBookingList();
        handleGetRefundHistory();
        // handleGetHistory()
    }, [propertyId]);

    useEffect(() => {
        handleGetPropertyToken();
    }, [])



    const handleRefundForm = (e) => {
        setIsRefundForm(true)
    }

    const handleRefundFormClose = () => {
        setIsSuccessPaymentForm(false)
        setIsRefundForm(false)
    }

    const handleGetPropertyToken = async () => {
        ApiGet(`token/getAlltoken`)
            .then(res => {
                setPropertyToken(res?.data?.payload?.token?.amount);
            }).catch(err => {
                toast.error(err.response.data.message)
            })
    }

    const handleGetBookingList = async () => {
        setIsLoaderVisible(true);
        ApiGet(`admin/get-users-by-pid?pid=${propertyId}`)
            .then((res) => {
                setBookingList(res?.data?.payload?.findUsers);
                // setIsLoaderVisible(false);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
    }

    const handleChangeRefundStatus = async () => {
        let data = {
            statusName: refundData?.status,
            uid: refundData?.uid,
            pid: refundData?.pid,
        }
        await ApiPost('history/createHistory', data)
            .then((res) => {
                handleModalClose();
                handleGetBookingList();
                handleGetRefundHistory();
                toast.success("Successfully updated");
            }).catch((err) => {
                toast.error(err.response.data.message);
            })
    }

    const handleGetRefundHistory = async () => {
        setIsLoaderVisible(true);
        // ApiGet(`history/getAllHistory?statusName=Exit Approved&pid=${propertyId}`)
        await ApiGet(`history/getAllHistoryApi?pid=${propertyId}`)
            .then((res) => {
                let history = res?.data?.payload?.history
                let count = res?.data?.payload?.count;
                setUserRefundHistory(count > 0 ? history : []);
                setIsLoaderVisible(false);
                let price = res?.data?.payload?.property?.wholeHomePrice / res?.data?.payload?.property?.ownership
                setPropertyPrice(price ? price : 0);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
    }

    const handleBackPage = () => {
        history.goBack();
    }



    useEffect(() => {
        if (isSuccessPaymentForm) {
            handleChangeStatus()
        }
    }, [isSuccessPaymentForm])

    const handleChangeStatus = async (e) => {
        let data = {
            uid: userId,
            pid: propertyId,
            aid: adminId,
            paymentId: "pay_JnDOPrsZvPkv44",
            price: 0,
            type: "sold",
        };
        const result = await ApiPost("order/addOrder", data);
        let dataForStatus = {
            statusName: "Property Resold",
            uid: userId,
            pid: propertyId,
        }
        await ApiPost('history/createHistory', dataForStatus)
            .then((res) => {
                handleModalClose();
                handleGetBookingList();
                handleGetRefundHistory();
                setIsSuccessPaymentForm(false);
                setUserId("");
            }
            ).catch((err) => {
                toast.error(err.response.data.message);
            })

        try {
            if (result?.data?.result === 0) {
                handleModalClose();
                handleGetBookingList();
                handleGetRefundHistory();
                handleRefundFormClose();
                setIsSuccessPaymentForm(false);
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const handleBuyProperty = (item) => {
        let price = item?.pid?.wholeHomePrice / item?.pid?.ownership;

        const result = "data";
        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
        const { amt, id: order_id } = result;
        const options = {
            // key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            key: "rzp_test_zxRbsLCk9aPfJK", // Enter the Key ID generated from the Dashboard
            amount: price * 10000000, // Amount is in currency subunits. Default currency is INR. Hence, 10000000 refers to 100000 INR or 1 Lac
            currency: "INR",
            name: "Our Leisure Home",
            description: "Our Leisure Home Transaction",
            order_id: order_id,
            handler: async function (response) {
                let data = {
                    uid: item?.uid?._id,
                    pid: propertyId,
                    aid: adminId,
                    paymentId: response?.razorpay_payment_id,
                    price: price * 100000, // token price in lacs so multiply by 100000
                    type: "sold",
                };
                const result = await ApiPost("order/addOrder", data);
                let dataForStatus = {
                    statusName: "Property Resold",
                    uid: item?.uid?._id,
                    pid: propertyId,
                }
                await ApiPost('history/createHistory', dataForStatus)
                    .then((res) => {
                        handleModalClose();
                        handleGetBookingList();
                        handleGetRefundHistory();
                        // toast.success("Successfully updated");
                    }
                    ).catch((err) => {
                        toast.error(err.response.data.message);
                    })

                try {
                    if (result?.data?.result === 0) {
                        handleModalClose();
                        handleGetBookingList();
                        handleGetRefundHistory();
                        toast.success("Successfully updated");
                        toast.success(result.data.message);
                    } else {
                        toast.error(result.data.message);
                    }
                } catch (err) {
                    toast.error(err.message);
                }
            },
            prefill: {
                name: "Our Leisure Home",
                email: "example@example.com",
                contact: "9662169628",
            },
            notes: {
                address: "Example Corporate Office",
            },
            theme: {
                color: "#cc0001",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

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
                        <p>{row?.uid?.fullName}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Email",
            selector: "uid.email",
        },
        {
            name: "Status",
            cell: (row) => {
                return (
                    <>
                        <div className="d-flex justify-content-between cus-medium-button-style">
                            {row?.statusName === "Exit Approved" ? (
                                <>
                                    <button
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            handleRefundProcess(row);
                                        }}
                                    >
                                        {/* {row?.statusName === "Exit Approved" ? "Resold Process" : "Resold process done"} */}
                                        Resold Process
                                    </button>
                                </>
                            ) : (
                                "Resold process done"
                            )}

                        </div>
                    </>
                );
            },
            sortable: true,
            selector: (row) => row.isActive,
        },
    ]

    const handleRefundProcess = (row) => {
        let history = userRefundHistory?.find(item => item?.uid?._id == row?._id) ? true : false;
        if (!history) {
            // setShowModal(true);
            if (row?.statusName === "Exit Approved") {
                // handleBuyProperty(row);
                handleRefundForm(row);
                setUserId(row?.uid?._id);
                setRefundData({ uid: row?._id, pid: propertyId, status: "Refund Processed" });
            }
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
        setRefundData({});
    }

    return (
        <>
            <div className="card p-1">
                <ToastContainer />
                <div className="p-2 mb-2">
                    <div className="row mb-4 pr-3">
                        <div className="col-md-2 col-sm-12 d-flex">
                            <div className="back-page-arrow-mui-icon" onClick={() => handleBackPage()}>
                                <ArrowBack />
                            </div>
                            <h2 className="pl-3 pt-2">User List</h2>
                        </div>
                    </div>

                    <Modal show={showModal} onHide={handleModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-danger">Alert!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want To{" "} Refund this user?
                            {/* {status === "active" ? "Active" : "Inactive"} this user */}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModalClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={(e) => {
                                    handleChangeRefundStatus();

                                }}
                            >
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <DataTable
                        columns={columns}
                        data={userRefundHistory[0]}
                        customStyles={customStyles}
                        progressPending={isLoaderVisible}
                        style={{
                            marginTop: "-3rem",
                        }}
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
                open={isRefundForm}
                onClose={handleRefundFormClose}
            >
                <div className="cus-modal-close" onClick={handleRefundFormClose}>
                    <CloseIcon />
                </div>
                <List>
                    <RefundForm getPaymentStatus={(data) => setIsSuccessPaymentForm(data)} />
                </List>
            </Dialog>
        </>
    )
}

export default SellRequestList