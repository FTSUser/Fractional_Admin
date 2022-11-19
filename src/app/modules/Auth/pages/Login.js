import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { ApiPostNoAuth } from "../../../../helpers/API/ApiData";
import * as authUtil from "../../../../utils/auth.util";
import * as userUtil from "../../../../utils/user.util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from "react-intl";


const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Email is Required"),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Password is Required"),
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
    validationSchema: LoginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const data = {
        email: values.email,
        password: values.password,
      };
      // await ApiPostNoAuth("admin/login", data)
      await ApiPostNoAuth("admin/loginSuperadmin", data)
        .then((res) => {
          try {
            if (parseInt(res.status / 200)) {
              authUtil.setToken(res.data.payload.token);
              userUtil.setUserInfo(res.data.payload);
              window.location.reload();
              setLoading(true);
              setSubmitting(false);
            } else {
              setLoading(false);
              setSubmitting(false);
              setStatus("Login Credentials are incorrect.");
              toast.error("Can't Login");
            }
          } catch (err) {
            setLoading(false);
            setSubmitting(false);
            setStatus("Error connecting to network.");
          }
        })
        .catch((err) => {
          toast.error(err);
          toast.error("Could not Login");
        });
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        {/* <h3 className="font-size-h1">
          Login Account
        </h3>
        <p className="text-muted font-weight-bold">
          Enter Your Email And Password
        </p> */}
      </div>
      {/* end::Head */}
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
      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
          ""
        )}

        <div className="form-group fv-plugins-icon-container login-form-design">
          <label>Email ID</label>
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "email"
            )}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container login-form-design">
          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
              {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
          <div>
          <Link
            // to="/auth/forgot-password"
            to="/admin/forgot"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            <span>Forget Password?</span>
            </Link>
          </div>
      
        </div>
        <div className="">
       
    
          <div className="sign-in-button-style new-btn-hover">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn  font-weight-bold`}
          >
            <span>Login</span>
          </button>
          </div>
        </div>

        {/* <div className="d-flex justify-content-center">
          <span className="font-weight-bold text-dark-50">
            Read our <Link>Onboarding Policy</Link> here.
          </span>
        </div> */}
      </form>

      {/*end::Form*/}
    </div>
  );
}
