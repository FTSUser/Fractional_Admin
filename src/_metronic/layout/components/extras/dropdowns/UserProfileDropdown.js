/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import Auth from "../../../../../helpers/Auth";
import { getUserInfo } from "../../../../../utils/user.util";
import { useHistory } from "react-router-dom";
export function UserProfileDropdown() {
  let userInfo = getUserInfo();
  const history = useHistory();
  const Logout = async () => {
    await Auth.deauthenticateLocalUser();
    window.location.reload();
  };

  return (
    <>
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          }
        >
          <span className="text-muted font-weight-bold font-size-base d-md-inline mr-1">
            Hi,
          </span>{" "}
          {userInfo?.admin?.role === "superadmin" || userInfo?.admin?.role === "admin" ? <>
            <span className="text-dark-50 font-weight-bolder font-size-base d-md-inline mr-3">
              {userInfo?.admin?.fullName?.toUpperCase() +
                ". "}
            </span>
            {/* <span className="symbol symbol-35 red-background">
              <span className="font-size-h5 font-weight-bold">
                {userInfo?.admin?.fname[0]?.toUpperCase() +
                  ". "}
              </span>
            </span> */}
          </> : <>
            <span className="text-dark-50 font-weight-bolder font-size-base d-md-inline mr-3">
              {userInfo?.admin?.fname?.toUpperCase() +
                " "
                // +
                // userInfo?.user?.firstName[0]?.toUpperCase()
              }
            </span>
            <span className="symbol symbol-35 red-background">
              <span className="font-size-h5 font-weight-bold">
                {userInfo?.admin?.fname[0]?.toUpperCase() +
                  ". "}
              </span>
            </span> </>}
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-">
        <div className="navi navi-spacer-x-0 pt-5">


          {/* <div className="navi-footer px-8 py-3"> */}
            <button
              onClick={Logout}
              className="btn-out"
            >
              Sign Out
            </button>
          </div>
        {/* </div> */}
      </Dropdown.Menu>
    </Dropdown>
    </>
  );
}
