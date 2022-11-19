import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet, ApiPut, ApiPost } from "../../../helpers/API/ApiData";
import Slide from "@material-ui/core/Slide";
import Loader from "react-loader-spinner";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Cms = ({ getNewCount, title }) => {
  const [filteredAdmin, setFilteredAdmin] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [idForEditStatus, setIdForEditStatus] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "SuperAdmin | OUR LEISURE HOME");
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

  const getAllAdmins = async () => {
    setIsLoaderVisible(true);
    await ApiGet(`menu/getMenus`)
      .then((res) => {
        setIsLoaderVisible(false);
        setFilteredAdmin(res?.data?.payload?.menu);
        setCount(res?.data?.payload?.count);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleEditStatus = () => {
    let data = {
      isActive: status,
    };
    ApiPut(`menu/updateMenu/${idForEditStatus}`, data)
      .then((res) => {
        if (res?.status === 200) {
          setShow(false);
          toast.success("Menu Updated Successfully");
          setStatus("");
          setIdForEditStatus("");
          getAllAdmins();
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  let i = 0;
  const columns = [
    {
      name: "SNo",
      width: "55px",
      cell: (row, index) => (page - 1) * countPerPage + (index + 1),
    },
    {
      name: "Menu",
      selector: "name",
      sortable: true,
      cell: (row) => {
        return (
          <>
            {row?.name === "home"
              ? "Home"
              : row?.name === "learnpage"
              ? "Learn"
              : row?.name === "about"
              ? "About"
              : row?.name === "properties"
              ? "Properties"
              : row?.name === "faq"
              ? "FAQs"
              : row?.name === "contact-us"
              ? "Contact"
              : ""}
          </>
        );
      },
    },
    {
      name: "Status",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between cus-medium-button-style">
              <button
                className="cursor-pointer"
                onClick={() => {
                  setShow(true);
                  setIdForEditStatus(row?._id);
                  setStatus(row?.isActive === true ? false : true);
                }}
              >
                {row?.isActive === true ? "Active" : "Inactive"}
              </button>
            </div>
          </>
        );
      },
      sortable: true,
      selector: (row) => row?.name,
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

  return (
    <>
      <div className="card p-1">
        {document.title === "SuperAdmin | OUR LEISURE HOME" && (
          <ToastContainer />
        )}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Menu</h2>
            </div>
          </div>

          {/* status */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">Alert!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to {status === true ? "active" : "inactive"}{" "}
              this menu ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant={status === true ? "success" : "danger"}
                onClick={(e) => {
                  handleEditStatus();
                }}
              >
                {status === true ? "Active" : "Inactive"}
              </Button>
            </Modal.Footer>
          </Modal>

          <DataTable
            columns={columns}
            data={filteredAdmin}
            customStyles={customStyles}
            style={{
              marginTop: "-3rem",
            }}
            progressPending={isLoaderVisible}
            progressComponent={
              <Loader type="Puff" color="#334D52" height={30} width={30} />
            }
            highlightOnHover
          />
        </div>
      </div>
    </>
  );
};

export default Cms;
