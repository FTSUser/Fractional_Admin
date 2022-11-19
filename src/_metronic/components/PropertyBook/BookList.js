import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { ApiGet } from '../../../helpers/API/ApiData';
import { customStyles } from '../Properties/columnDesign';
import moment from 'moment';

function BookList(props) {
    const { propertyId } = props;
    const [bookingList, setBookingList] = useState([]);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [search, setSearch] = useState("");

    useEffect(() => {
        handleGetBookingList();
    }, [propertyId]);

    const handleGetBookingList = async () => {
        setIsLoaderVisible(true);
        ApiGet(`book/getAllBook?onlyPid=${propertyId}`)
            .then((res) => {
                setBookingList(res?.data?.payload?.findBookByPid);
                setIsLoaderVisible(false);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
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
                        <p>{row?.uid?.fullName}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Booking Date From",
            cell: (row) => {
                return (
                    <>
                        <p>{moment(row?.sdate).add('days', -1).format("ll")}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Booking Date To",
            cell: (row) => {
                return (
                    <>
                        <p>{moment(row?.edate).add('days', -1).format('ll')}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Number Of Days",
            cell: (row) => {
                return (
                    <>
                        <p>{row?.daysNumber}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
    ]

    return (
        <>
            <DataTable
                columns={columns}
                data={bookingList}
                customStyles={customStyles}
                progressPending={isLoaderVisible}
                style={{
                    marginTop: "-3rem",
                }}
                progressComponent={
                    <Loader type="Puff" color="#334D52" height={30} width={30} />
                }
                highlightOnHover
                // pagination
                // paginationServer
                // paginationTotalRows={count}
                // paginationPerPage={countPerPage}
                // paginationRowsPerPageOptions={[10, 20, 25, 50, 100]}
                // paginationDefaultPage={page}
                // onChangePage={(page) => {
                //     setPage(page);
                // }}
                // onChangeRowsPerPage={(rowPerPage) => {
                //     setCountPerPage(rowPerPage);
                // }}
            />
        </>
    )
}

export default BookList