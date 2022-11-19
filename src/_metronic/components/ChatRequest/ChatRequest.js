import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet, ApiDelete } from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import moment from "moment";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

const ChatRequest = () => {
  const [filteredChatRequest, setFilteredChatRequest] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [idForDeleteAboutUs, setIdForDeleteAboutUs] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllChatRequest();
  }, [page, countPerPage , search]);

  const getAllChatRequest = async () => {
    setIsLoaderVisible(true);
    if (!search) {
      await ApiGet(
        `callRequest/getAllCallRequest?page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredChatRequest(res?.data?.payload?.callRequest);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      await ApiGet(
        `callRequest/getAllCallRequest?search=${search}&page=${page}&limit=${countPerPage}`
      )
        .then((res) => {
          setIsLoaderVisible(false);
          setFilteredChatRequest(res?.data?.payload?.callRequest);
          setCount(res?.data?.payload?.count);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleDeleteChatRequest = () => {
    ApiDelete(`callRequest/deleteCallRequest/${idForDeleteAboutUs}`)
      .then((res) => {
        if (res?.status == 200) {
          setShow(false);
          toast.success("Chat request deleted successfully");
          getAllChatRequest();
          setPage(1);
          setCount(0);
          setCountPerPage(countPerPage);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
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
          <div>
            <span>{row?.name}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "email",
      cell: (row) => {
        return (
          <div>
            <span>{row?.email}</span>
          </div>
        );
      },
      sortable: true,
      width: "400px",
      overflow: "auto",
    },
    {
      name: "Phone",
      cell: (row) => {
        return (
          <div>
            <span>{row?.phone === "undefined" || row?.phone === null ? "-" : row?.phone}</span>
          </div>
        )
      }
      // selector: "phone",
    },
    {
      name: "Property",
      cell: (row) => {
        return (
          <div>
            <span>{row.pid?.address?.name}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Type",
      selector: "requestType",
      sortable: true,
    },
    {
      name: "Request Date",
      cell: (row) => {
        return (
          <div>
            <span>{moment(row?.createdAt).format("ll")}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <>
            <div
              className="cursor-pointer"
              onClick={() => {
                setShow(true);
                setIdForDeleteAboutUs(row?._id);
              }}
            >
              <Tooltip title="Delete" arrow>
                <DeleteIcon />
              </Tooltip>
            </div>
          </>
        );
      },
      width: "90px",
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

  return (
    <>
      <div className="card p-1">
        {document.title === "About Us | OUR LEISURE HOME" && <ToastContainer />}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Chat Request </h2>
            </div>
            <div className="col">
              <div>
                <input
                  type="text"
                  className={`form-control form-control-lg form-control-solid `}
                  name="title"
                  placeholder="Search Chat Request"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this chat request ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteChatRequest();
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <DataTable
            columns={columns}
            data={filteredChatRequest}
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

export default ChatRequest;
