/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import Changepassword from "../pages/changepassowrd"
import PasswordOtp from "./passwordOtp";

export function AuthPage() {
  const today = new Date().getFullYear();
  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login-grid-alignment"
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className="login-aside hero-new-banner d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"

          >

            <div className="d-flex flex-row-fluid flex-column justify-content-between">

              <div className="flex-column-auto mt-5">
                {/* <img
                  alt="Logo"
                  className="max-h-70px"
                  src={toAbsoluteUrl("/media/logos/Logo111.png")}
                /> */}
              </div>

              <div className="flex-column-fluid login-banner-image d-flex flex-column justify-content-center">
                <div>
                  <img
                    alt="Logo"
                    className=""
                    src={toAbsoluteUrl("/media/logos/white-logo.png")}
                  />
                </div>
                <h3 className="welcoe-text-style mb-5 text-white">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque eligendi iusto placeat fuga. Enim,
                  modi accusamus molestiae, nam est quo fuga mollitia similique distinctio perspiciatis inventore quos eaque, recusandae dolorem.
                </h3>
              </div>



              <div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">
                <div className="opacity-70 font-weight-bold	text-white">
                  Copyright © {" "} {today.toString()} {" "} OUR LEISURE HOME
                </div>
                <div className="d-flex"></div>
              </div>
              {/* end:: Aside footer for desktop */}
            </div>
            {/*end: Aside Container*/}
          </div>
          {/*begin::Aside*/}

          {/*begin::Content*/}
          <div className="flex-row-fluid bg-white d-flex flex-column position-relative p-14 overflow-hidden">
            {/*begin::Content header*/}
            {/* {path === "/auth/registration" ? (
              <div className="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10" onClick={() => setData()}>
                <span className="font-weight-bold text-dark-50">
                  Don't have an account yet?
                </span>
                <Link
                  to="/auth/registration"
                  className="font-weight-bold ml-2"
                  id="kt_login_signup"
                >
                  Sign Up!
                </Link>
              </div>
            ) : (
              <div className="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10">
                <span className="font-weight-bold text-dark-50">
                  already have an account yet?
                </span>
                <Link
                  to="/auth/login"
                  className="font-weight-bold ml-2"
                  id="kt_login_signup"
                >
                  Sign In!
                </Link>
              </div>
            )} */}

            {/*end::Content header*/}

            {/* begin::Content body */}
            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
              <Switch>
                <ContentRoute path="/auth/login" component={Login} />
                <ContentRoute
                  // path="/auth/forgot-password"
                  path="/admin/forgot"

                  component={ForgotPassword}
                />
                <ContentRoute
                  path="/auth/changepassword"
                  component={Changepassword}
                />
                <ContentRoute
                  path="/auth/enter-otp"
                  component={PasswordOtp}
                />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
            {/*end::Content body*/}

            {/* end::Mobile footer */}
          </div>
          {/*end::Content*/}
        </div>
        {/*end::Login*/}
      </div>
    </>
  );
}
