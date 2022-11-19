import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet } from "../../../helpers/API/ApiData";
import Loader from "react-loader-spinner";
import moment from "moment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { toast } from "react-toastify";
import { Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import OrderList from "./OrderList";

const SaleProperties = ({ title }) => {
  const [orders, setOrders] = useState({});
  const [propertyDetails, setPropertyDetails] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [isOrderListModal, setIsOrderListModal] = useState(false);

  const showBookingList = (row) => {
    setPropertyId(row._id);
    setIsOrderListModal(true);
  }

  const handleClose = () => {
    setIsOrderListModal(false);
    setPropertyId("");
};

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "Sale Properties | OUR LEISURE HOME");
  }, []);

  useEffect(() => {
    // getOrders();
    handleGetPropertys();
  }, [page, countPerPage]);



  const handleGetPropertys = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      ApiGet(`property/getPropertyByUid?page=${page}&limit=${countPerPage}`)
        .then(res => {
          setPropertyDetails(res?.data?.payload?.history);
          setCount(res?.data?.payload?.count);
          setIsLoaderVisible(false);
        })
        .catch(err => {
          setIsLoaderVisible(false);
          toast.error(err.response.data.message)
        })
    } else {
      ApiGet(`property/getPropertyByUid?page=${page}&limit=${countPerPage}&search=${search}`)

        .then(res => {
          setPropertyDetails(res?.data?.payload?.history);
          setCount(res?.data?.payload?.count);
          setIsLoaderVisible(false);
        }
        )
        .catch(err => {
          setIsLoaderVisible(false);
          toast.error(err.response.data.message)
        })
    }
  }

  const getOrders = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(`order/getAllOrder?page=${page}&limit=${countPerPage}`)
        .then((res) => {
          setIsLoaderVisible(false);
          setOrders(res?.data?.payload?.Order);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `order/getAllOrder?search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setOrders(res?.data?.payload?.Order);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

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

  const columns = [
    {
      name: "SNo",
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
      width: "65px",
    },
    {
      name: "Property Add Date",
      cell: (row) => {
        return (
          <>
            <p>{moment(row?.pid?.creationDate).format("ll")}</p>
          </>
        );
      },
      width: "200px",
      sortable: true,
    },
    {
      name: "Property",
      cell: (row) => <span>{row?.pid?.address?.name}</span>,
      sortable: true,
    },
    {
      name: "Ownership",
      cell: (row) => <span>{row?.pid?.ownership}</span>,
    },
    {
      name: "Intrested In",
      selector: "order",
    },
    {
      name: "Property Amount (in Lakhs)",
      cell: (row) => <span>{row?.pid?.wholeHomePrice}</span>,
      sortable: true,
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
                <Tooltip title="Show More" arrow>
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };



  return (
    <>
      <div className="card p-1">
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-md-3 col-sm-12 d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Sold Properties</h2>
            </div>
            <div className="col-md-5 col-sm-12">
            </div>
          </div>

          <DataTable
            columns={columns}
            data={propertyDetails}
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
      {isOrderListModal && (
        <Dialog
          fullScreen
          open={isOrderListModal}
          onClose={handleClose}
        >
          <div className="cus-modal-close" onClick={handleClose}>
            <CloseIcon />
          </div>
          <List>
            <OrderList propertyId={propertyId} />
          </List>
        </Dialog>
      )}
    </>
  );
};

export default SaleProperties;
