import React, { useState } from "react";
import { useFormik } from "formik";
import { ApiPostNoAuth } from "../../../../helpers/API/ApiData";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  email: "",
};

function ForgotPassword() {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const [isRequested] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Email is Required"),
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
        email: values.email,
        isForgot: true
      };

      await ApiPostNoAuth("admin/verify-email", data)
        .then((res) => {
          if (res?.data?.result === 0) {
            setSubmitting(false);
            setTimeout(function () {
              toast.success("Email sent Successfully");
            }, 50);
            localStorage.setItem("forpassEmail", res.data.payload.email);
            history.push("/auth/enter-otp");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          setStatus("Please Enter Registed Email");
        });

    },
  }
  );

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
            <h3 className="font-size-h1">Forgotten Password ?</h3>
            <div className="text-muted font-weight-bold">
              Please enter your email address. We will send you an email to
              reset your password.
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
                type="email"
                placeholder="Enter email"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "email"
                )}`}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </div>

            {/* <div className="form-group fv-plugins-icon-container">
              <select
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "role"
                )}`}
                name="role"
                {...formik.getFieldProps("role")}
              >
                <option>Select Role...</option>
                <option value="admin">Admin </option>
                <option value="doctor">Doctor</option>
              
              </select>
              {formik.touched.role && formik.errors.role ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.role}</div>
                </div>
              ) : null}
            </div> */}

            <div className="form-group d-flex flex-wrap flex-center">
              <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                disabled={formik.isSubmitting}
              >
                Send
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

export default ForgotPassword;
