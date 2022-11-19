import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import { Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const KnowMore = ({ title }) => {
  const [knowMoreData, setKnowMoreData] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //new data
  const [isKnowMore, setIsKnowMore] = useState(false);
  const [idForKnowMore, setIdForKnowMore] = useState("");
  const [inputValue, setInputValue] = useState({});
  const [errors, setErrors] = useState({});
  const [idForEditStatus, setIdForEditStatus] = useState("");
  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [description, setDescription] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  useEffect(() => {
    title === "Dashboard | OUR LEISURE HOME"
      ? (document.title = title)
      : (document.title = "KnowMore | OUR LEISURE HOME");
  }, []);
  
  const handleAddAdminClose = () => {
    setInputValue({});
    setIsKnowMore(false);
    setErrors({});
  };

  useEffect(() => {
    getKnowMore();
  }, []);

  const getKnowMore = async () => {
    setIsLoaderVisible(true);
    await ApiGet(`know/getKnow`)
      .then((res) => {
        setIsLoaderVisible(false);
        setKnowMoreData(res?.data?.payload?.know);
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  const validateForm = () => {
    let formIsValid = true;
    let errors = {};
    if (inputValue && !inputValue.description) {
      formIsValid = false;
      errors["description"] = "*Please Enter Description!";
    }
    setErrors(errors);
    return formIsValid;
  };
  const handleUpdateKnowMore = (e) => {
    e.preventDefault();
    if (validateForm()) {
      ApiPut(`know/updateKnow/${idForKnowMore}`, inputValue)
        .then((res) => {
          if (res?.status == 200) {
            setIsKnowMore(false);
            toast.success(res?.data?.message);
            setInputValue({});
            getKnowMore();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err.message);
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
      name: "Name",
      selector: "name",
      width: "200px",
      sortable: true,
    },
    {
      name: "Status",
      selector: "isActive",
      cell: (row) => {
        return (
          <>
            <span>{row?.isActive === true ? "Active" : "DeActive"}</span>
          </>
        );
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "Actions",
      width: "65px",
      cell: (row) => {
        return (
          <>
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer pl-2"
                onClick={() => {
                  setIsKnowMore(true);
                  setIdForKnowMore(row._id);
                  setInputValue({
                    description: row?.description,
                    isActive: row?.isActive,
                  });
                  setDescription(row?.description);
                }}
              >
                <Tooltip title="Edit Know More" arrow>
                  <CreateIcon />
                </Tooltip>
              </div>
            </div>
          </>
        );
      },
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
        {document.title === "KnowMore | OUR LEISURE HOME" && <ToastContainer />}
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col d-flex justify-content-between">
              <h2 className="pl-3 pt-2">Know More</h2>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={knowMoreData}
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
          />
        </div>
      </div>
      {isKnowMore ? (
        <Dialog
          fullScreen
          open={isKnowMore}
          onClose={handleAddAdminClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleAddAdminClose}
              aria-label="close"
              style={{ width: "100%", justifyContent: "flex-end" }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <List>
            {isKnowMore === true ? (
              <div className="form ml-30 ">
                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    Enter Description
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <div>
                      <CKEditor
                        id="description"
                        editor={ClassicEditor}
                        value={inputValue.description}
                        data={description}
                        onChange={(descriptionData, editor) => {
                          setDescription(editor.getData());
                          setInputValue({
                            ...inputValue,
                            description: editor.getData(),
                          });
                          setErrors({ ...errors, description: "" });
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "red",
                        top: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {errors["description"]}
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xl-3 col-lg-3 col-form-label">
                    isActive
                  </label>
                  <div className="col-lg-9 col-xl-6">
                    <select
                      id="isActive"
                      name="isActive"
                      className={`form-control form-control-lg form-control-solid `}
                      onChange={(e) => handleOnChange(e)}
                    >
                      <option
                        value={true}
                        selected={
                          inputValue && inputValue?.isActive === true
                            ? true
                            : false
                        }
                      >
                        Active
                      </option>
                      <option
                        value={false}
                        selected={
                          inputValue && inputValue?.isActive === false
                            ? true
                            : false
                        }
                      >
                        De-Active
                      </option>
                    </select>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    onClick={(e) => {
                      handleUpdateKnowMore(e);
                    }}
                    className="btn btn-success mr-2"
                  >
                    <span>Update Details</span>
                    {loading && (
                      <span className="mx-3 spinner spinner-white"></span>
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </List>
        </Dialog>
      ) : null}
    </>
  );
};

export default KnowMore;
