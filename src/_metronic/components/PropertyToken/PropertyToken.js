import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import CreateIcon from "@material-ui/icons/Create";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PropertyToken = ({ getNewCount, title }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState([]);
  const [editToken, setEditToken] = useState();
  const [isEditToken, setIsEditToken] = useState(false);
  const [editTokenId, setEditTokenId] = useState();

  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "Property Token | OUR LEISURE HOME");
  }, []);

  useEffect(() => {
    getToken();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      let val = value.replace(/[^\d.]/g, "");
      setEditToken(val);
    }
  };

  const handleUpdateTokenClose = () => {
    setEditToken({});
    setIsEditToken(false);
  };

  const getToken = async () => {
    setLoading(true);
    await ApiGet("token/getAlltoken")
      .then((res) => {
        if (res.data.result === 0) {
          setLoading(false);
          setToken([res.data.payload.token]);
        } else {
          setLoading(false);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err);
      });
  };

  const updateToken = async () => {
    let data = {
      title: "token price",
      amount: editToken,
    };
    if (!editToken) return toast.error("Please enter token price");
    setLoading(true);
    await ApiPut(`token/updatetoken/${editTokenId}`, data)
      .then((res) => {
        if (res.data.result === 0) {
          setLoading(false);
          setIsEditToken(false);
          getToken();
          // toast.success(res.data.message);
          toast.success("Property token updated successfully");
        } else {
          setLoading(false);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err);
      });
  };

  const columns = [
    {
      name: "SNo",
      cell: (row, index) => index + 1,
    },
    {
      name: "Token",
      cell: () => "Token",
    },
    {
      name: "Date",
      cell: (row) => {
        return (
          <>
            <p>{moment(row?.updatedat).format("ll")}</p>
          </>
        );
      },
    },
    {
      name: "Amount (in Lakhs)",
      selector: "amount",
    },

    {
      name: "Actions",
      width: "80px",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer pl-2"
                onClick={() => {
                  setIsEditToken(true);
                  setEditToken(row.amount);
                  setEditTokenId(row._id);
                }}
              >
                <Tooltip title="Edit Token" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
          </>
        );
      },
    },
  ];
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
        {document.title === "Property Token | OUR LEISURE HOME" && (
          <ToastContainer />
        )}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            {/* <div className="col-md-2 col-sm-12 d-flex justify-content-between"> */}
              <h2 className="pl-3 pt-2">Set Property Token Amount for users </h2>
            {/* </div> */}
          </div>

          <DataTable
            columns={columns}
            data={token}
            customStyles={customStyles}
            style={{
              marginTop: "-3rem",
            }}
            progressPending={loading}
            progressComponent={
              <Loader type="Puff" color="#334D52" height={30} width={30} />
            }
            highlightOnHover
          />
        </div>
      </div>

      {isEditToken && (
        <Dialog
          fullScreen
          open={isEditToken}
          onClose={handleUpdateTokenClose}
          TransitionComponent={Transition}
        >
          <div className="cus-modal-close" onClick={handleUpdateTokenClose}>
            <CloseIcon />
          </div>
          <List>
            <div className="form full-container">
              <div className="form-group row">
                <label className="col-xl-3 col-lg-3 col-form-label">
                  Amount (in Lakhs)
                </label>
                <div className="col-lg-9 col-xl-6">
                  <div>
                    <input
                      type="text"
                      className={`form-control form-control-lg form-control-solid `}
                      id="amount"
                      name="amount"
                      value={editToken}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <button onClick={updateToken} className="btn btn-success mr-2">
                  <span>Update Token</span>
                  {loading && (
                    <span className="mx-3 spinner spinner-white"></span>
                  )}
                </button>
              </div>
            </div>
          </List>
        </Dialog>
      )}
    </>
  );
};

export default PropertyToken;
