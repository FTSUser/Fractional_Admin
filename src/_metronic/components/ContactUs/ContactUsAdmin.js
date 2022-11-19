import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet } from "../../../helpers/API/ApiData";
import Loader from "react-loader-spinner";
import moment from "moment";
import { getUserInfo } from "../../../utils/user.util";
import { toast } from "react-toastify";


const ContactUsAdmin = ({ title }) => {
    let userInfo = getUserInfo();
    const [contactUsData, setContactUSData] = useState([]);
    const [filteredContactUs, setFilteredContactUs] = useState({});
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [search, setSearch] = useState("");


    useEffect(() => {
        title === "Dashboard | OUR LEISURE HOME" ? document.title = title : document.title = "ContactUS | OUR LEISURE HOME"
    }, [])

    useEffect(() => {
        getAllAmeninties();
    }, [page, countPerPage]);

    const getAllAmeninties = async () => {
        setIsLoaderVisible(true);
        if (userInfo?.admin?.role === "superadmin") {
            if (!search) {
                await ApiGet(`contactus/getContactus?page=${page}&limit=${countPerPage}`)
                    .then((res) => {
                        setIsLoaderVisible(false);
                        setContactUSData(res?.data?.payload?.Contactus);
                        setFilteredContactUs(res?.data?.payload?.Contactus);
                        setCount(res?.data?.payload?.count);
                    })
                    .catch((err) => {
                        toast.error(err);
                    });
            } else {
                await ApiGet(
                    `contactus/getContactus?search=${search}&page=${page}&limit=${countPerPage}`
                )
                    .then((res) => {
                        setIsLoaderVisible(false);
                        setContactUSData(res?.data?.payload?.Contactus);
                        setFilteredContactUs(res?.data?.payload?.Contactus);
                        setCount(res?.data?.payload?.count);
                    })
                    .catch((err) => {
                        toast.error(err);
                    });
            }
        } else {
            if (!search) {
                await ApiGet(`contactus/getContactus?aid=${userInfo?.admin?.id}&page=${page}&limit=${countPerPage}`)
                    .then((res) => {
                        setIsLoaderVisible(false);
                        setContactUSData(res?.data?.payload?.Contactus);
                        setFilteredContactUs(res?.data?.payload?.Contactus);
                        setCount(res?.data?.payload?.count);
                    })
                    .catch((err) => {
                        toast.error(err);
                    });
            } else {
                await ApiGet(
                    `contactus/getContactus?aid=${userInfo?.admin?.id}&search=${search}&page=${page}&limit=${countPerPage}`
                )
                    .then((res) => {
                        setIsLoaderVisible(false);
                        setContactUSData(res?.data?.payload?.Contactus);
                        setFilteredContactUs(res?.data?.payload?.Contactus);
                        setCount(res?.data?.payload?.count);
                    })
                    .catch((err) => {
                        toast.error(err);
                    });
            }
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
            cell: (text) => <span>{moment(text).format("ll")}</span>,
        },
        {
            name: "Name",
            selector: "name",
            sortable: true,
        },
        {
            name: "Email",
            selector: "email",
            sortable: true,
        },
        {
            name: "Phone No.",
            selector: "phone",
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

    const debouncedSearchTerm = useDebounce(search, 500);

    // Hook
    function useDebounce(value, delay) {
        // State and setters for debounced value
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(
            () => {
                // Update debounced value after delay
                const handler = setTimeout(() => {
                    setDebouncedValue(value);
                }, delay);
                // Cancel the timeout if value changes (also on delay change or unmount)
                // This is how we prevent debounced value from updating if value is changed ...
                // .. within the delay period. Timeout gets cleared and restarted.
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
            getAllAmeninties();
        } else {
            setPage(1);
            setCount(0);
            setCountPerPage(countPerPage);
            getAllAmeninties();
        }
    }, [debouncedSearchTerm]);
    

    return (
        <>
            <div className="card p-1">
                <div className="p-2 mb-2">
                    <div className="row mb-4 pr-3">
                        <div className="col-md-3 col-sm-12 d-flex justify-content-between">
                            <h2 className="pl-3 pt-2">Contact Us</h2>
                        </div>
                        <div className="col-md-5 col-sm-12">
                            <div>
                                <input
                                    type="text"
                                    className={`form-control form-control-lg form-control-solid `}
                                    name="title"
                                    placeholder="Search Contact Us Data"
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>
                        </div>
                    </div>

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

export default ContactUsAdmin;
