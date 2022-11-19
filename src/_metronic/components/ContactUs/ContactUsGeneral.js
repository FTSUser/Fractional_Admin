import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet } from "../../../helpers/API/ApiData";
import Loader from "react-loader-spinner";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const ContactUsGeneral = ({ title }) => {
    const [filteredContactUs, setFilteredContactUs] = useState({});
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMessage, setShowMessage] = useState("");

    useEffect(() => {
        title === "Dashboard | OUR LEISURE HOME" ? document.title = title : document.title = "ContactUS General | OUR LEISURE HOME"
    }, [])

    useEffect(() => {
        getAllAmeninties();
    }, [page, countPerPage , search]);

    const getAllAmeninties = async () => {
        setIsLoaderVisible(true);
        if (!search) {
            await ApiGet(`contactus/getContactusadmin?page=${page}&limit=${countPerPage}`)
                .then((res) => {
                    setIsLoaderVisible(false);
                    setFilteredContactUs(res?.data?.payload?.Contactus);
                    setCount(res?.data?.payload?.count);
                })
                .catch((err) => {
                    toast.error(err);
                });
        } else {
            await ApiGet(
                `contactus/getContactusadmin?search=${search}&page=${page}&limit=${countPerPage}`
            )
                .then((res) => {
                    setIsLoaderVisible(false);
                    setFilteredContactUs(res?.data?.payload?.Contactus);
                    setCount(res?.data?.payload?.count);
                })
                .catch((err) => {
                    toast.error(err);
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
            name: "Creation Date",
            selector: "creationDate",
            cell: (row) => <span>{moment(row?.creationDate).format("ll")}</span>,
        },
        {
            name: "Full Name",
            selector: "fname",
            sortable: true,
        },
        {
            name: "Email",
            selector: "email",
            cell: (row) => {
                return (
                    <>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: row?.email,
                            }}
                            className=""
                        />
                    </>
                );
            },
        },
        {
            name: "Phone No.",
            selector: "phone",
            sortable: true,
        },
        {
            name: "Message",
            cell: (row) => {
                return (
                    <div >
                        <span onClick={() => handleMessageShowModal(row)}>{row?.message ? row?.message.substring(0, 20) + "..." : "No Message"}</span>
                    </div>
                )
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

    const handleClose = () => {
        setIsModalOpen(false);
        setShowMessage("")
    }

    const handleMessageShowModal = (row) => {
        setIsModalOpen(true);
        setShowMessage(row?.message);
    }

    return (
        <>
            <div className="card p-1">
                <div className="p-2 mb-2">
                    <div className="row mb-4 pr-3">
                        <div className="col-md-3 col-sm-12 d-flex justify-content-between">
                            <h2 className="pl-3 pt-2">Contact us Listing</h2>
                        </div>
                        <div className="col-md-5 col-sm-12">
                            <div>
                                <input
                                    type="text"
                                    className={`form-control form-control-lg form-control-solid `}
                                    name="title"
                                    placeholder="Search Contact Us"
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>
                        </div>
                    </div>

                    {isModalOpen && (
                        <Modal
                            show={true}
                            onHide={handleClose}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header>
                                <Modal.Title>
                                    Message
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <>
                                    {showMessage}
                                </>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                    <DataTable
                        columns={columns}
                        data={filteredContactUs}
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
    );
};

export default ContactUsGeneral;
