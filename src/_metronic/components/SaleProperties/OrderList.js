import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { ApiGet } from '../../../helpers/API/ApiData';
import { customStyles } from '../Properties/columnDesign';
import moment from 'moment';

function OrderList(props) {
    const { propertyId } = props;
    const [orderList, setOrderList] = useState([]);
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [search, setSearch] = useState("");

    useEffect(() => {
        handleGetOrderList();
    }, [propertyId]);

    const handleGetOrderList = async () => {
        setIsLoaderVisible(true);
        ApiGet(`order/getAllOrder?pid=${propertyId}&type=token`)
            .then((res) => {
                setOrderList(res?.data?.payload?.Order);
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
            name: "Buyer's Name",
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
            name: "Date",
            cell: (row) => {
                return (
                    <>
                        <p>{moment(row?.createdAt).format("ll")}</p>
                    </>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Token Amount paid by Buyer (in Lakhs)",
            cell: (row) => <span>{row?.price / 100000}</span>,
        },
    ]

    return (
        <>
            <DataTable
                columns={columns}
                data={orderList}
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
        </>
    )
}

export default OrderList