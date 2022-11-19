import React, { useState } from "react";
import { useFormik } from "formik";
import { ApiPostNoAuth } from "../../../../helpers/API/ApiData";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import * as authUtil from "../../../../utils/auth.util";
import "react-toastify/dist/ReactToastify.css";
//import * as auth from "../_redux/authRedux";
// import { requestPassword } from "../_redux/authCrud";

const initialValues = {
  code: "",
};

function PasswordOtp() {
  const history = useHistory();
  const [code, setCode] = useState("");

  const [isRequested] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    code: Yup.string().required("This is Required feild"),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      const data = {
        code: values.code.toString(),
        email: localStorage.getItem("forpassEmail"),
      };

      await ApiPostNoAuth("admin/verify-code", data)
        .then((res) => {
          if(res.data.result === 0){
              
              setSubmitting(false);
              authUtil.setToken(res.data.payload.token);
    
              setTimeout(function () {
                toast.success("OTP Verified");
              }, 50);
              history.push("/auth/changepassword");
          }
        })
        .catch((err) => {
          setStatus("Please Enter Valid OTP");
        });
    },
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <div className="text-center pb-8">
            <h3 className="font-size-h1">Verify OTP </h3>

            <div className="pt-6">
              <img
                className="m-2"
                // src={require("../../../../_metronic/layout/components/brand/7th.png")}
                width="120px"
                // height="170px"
              ></img>
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
          >
            {formik.status && (
              <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                <div className="alert-text font-weight-bold">
                  {formik.status}
                </div>
              </div>
            )}
            <div className="form-group fv-plugins-icon-container">
              <input
                type="number"
                placeholder="Enter OTP"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "email"
                )}`}
                name="code"
                onChange={(e) => setCode(e.target.value)}
                {...formik.getFieldProps("code")}
              />
              {formik.touched.code && formik.errors.code ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.code}</div>
                </div>
              ) : null}
            </div>

            <div className="form-group d-flex flex-wrap flex-center">
              <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                disabled={formik.isSubmitting}
              >
                Verify OTP
              </button>
              <Link to="/auth">
                <button
                  type="button"
                  id="kt_login_forgot_cancel"
                  className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default PasswordOtp;
