import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Loader from 'react-loader-spinner';
import { customStyles } from '../Properties/columnDesign';
import moment from 'moment';
import { handleGetNotifications } from '../../_helpers/APIs';

function Notification() {
    const userDetails = JSON.parse(localStorage.getItem('userinfo'));
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(10);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = () => {
        handleGetNotifications(userDetails?.admin?.id, page, countPerPage)
            .then(res => {
                setNotifications(res.notification);
            })
            .catch(err => {
                toast.error(err);
            })
    }

    const columns = [
        {
            name: "SNo",
            cell: (row, index) => (page - 1) * countPerPage + (index + 1),
            width: "65px",
        },
        {
            name: "Title",
            selector: "title",
            sortable: true,
        },
        {
            name: "Description",
            selector: "description",
            sortable: true,
        },
        {
            name: "Date",
            cell: (row) => {
                return (
                    <>
                        <p>{moment(row?.createdAt).fromNow()}</p>
                    </>
                );
            },
            sortable: true,
        },
    ]

    return (
        <>
            <DataTable
                columns={columns}
                data={notifications}
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

export default Notification