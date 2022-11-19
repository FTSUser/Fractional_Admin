/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { getUserInfo } from "../../../../../utils/user.util";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  let userInfo = getUserInfo();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"
      } menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      {userInfo?.admin?.role === "superadmin" ? (
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/*begin::1 Dashboard*/}
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/dashboard",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link" to="/dashboard">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>

          {/*end::1 Engage*/}
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/roles",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/roles">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Roles</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {/* Inputs */}
                {/*begin::2 Level*/}
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/roles/superAdmin",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/roles/superAdmin">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Super Admin</span>
                  </NavLink>
                </li>

                {/* <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/roles/admin",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/roles/admin">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Admin</span>
                  </NavLink>
                </li> */}

                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/roles/user",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/roles/user">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">User</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/*end::1 Engage*/}
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/amenities",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/amenities">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Amenities</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {/* Inputs */}
                {/*begin::2 Level*/}
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/amenities/distinctive",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/amenities/distinctive">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Distinctive Amenities</span>
                  </NavLink>
                </li>

                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/amenities/standard",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/amenities/standard">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Standard Amenities</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/faq",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/faq">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">FAQs</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {/* Inputs */}
                {/*begin::2 Level*/}
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/faq/faqs",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/faq/faqs">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">FAQs</span>
                  </NavLink>
                </li>

                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/faq/faqcategory",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/faq/faqcategory">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">FAQ Category</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* contact us -> contactUsGeneral | contactUsforProperty*/}
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/contactUs",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/contactUs">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">ContactUs</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {/* Inputs */}
                {/*begin::2 Level*/}
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/contactUs/contactUsGeneral",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink
                    className="menu-link"
                    to="/contactUs/contactUsGeneral"
                  >
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Contact Us</span>
                  </NavLink>
                </li>

                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/contactUs/contactUsforProperty",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink
                    className="menu-link"
                    to="/contactUs/contactUsforProperty"
                  >
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Contact Us for Property</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/*end::1 Engage*/}
          {/* <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/contactUs",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/contactUs">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Contact Us</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/contactUs/contactUsAdmin",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink className="menu-link" to="/contactUs/contactUsAdmin">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Contact Us</span>
                  </NavLink>
                </li>

                <li
                  className={`menu-item menu-item-submenu  ${getMenuItemActive(
                    "/contactUs/contactUsGeneral",
                    false
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                >
                  <NavLink
                    className="menu-link"
                    to="/contactUs/contactUsGeneral"
                  >
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">ContactUs General</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li> */}

          {/* <li
            className={`menu-item ${getMenuItemActive(
              "/contactUs/contactUsGeneral",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/contactUs/contactUsGeneral">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Contact Us</span>
            </NavLink>
          </li> */}


          <li
            className={`menu-item ${getMenuItemActive("/properties", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/properties">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Properties</span>
            </NavLink>
          </li>



          <li
            className={`menu-item ${getMenuItemActive("/chatrequest", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/chatrequest">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Chat Request</span>
            </NavLink>
          </li>


          <li
            className={`menu-item ${getMenuItemActive("/kycrequest", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/kycrequest">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">KYC Request</span>
            </NavLink>
          </li>

          {/* <li
            className={`menu-item ${getMenuItemActive("/orders", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/orders">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Orders</span>
            </NavLink>
          </li> */}




          <li
            className={`menu-item ${getMenuItemActive("/token", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/token">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Set Property Token</span>
            </NavLink>
          </li>
          <li
            className={`menu-item ${getMenuItemActive(
              "/saleProperties",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/saleProperties">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Sold Properties</span>
            </NavLink>
          </li>

          {/* <li
            className={`menu-item ${getMenuItemActive("/status", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/status">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Property Status</span>
            </NavLink>
          </li> */}

          <li
            className={`menu-item ${getMenuItemActive("/propertybook", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/propertybook">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Visit request</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/propertysallrequest", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/propertysallrequest">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Exit request</span>
            </NavLink>
          </li>
          <li
            className={`menu-item ${getMenuItemActive("/refund", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/refund">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Refund</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/resoldproperty", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/resoldproperty">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Properties available for reselling</span>
            </NavLink>
          </li>


          <li
            className={`menu-item ${getMenuItemActive("/aboutus", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/aboutus">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">About Us</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/bannerimage", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/bannerimage">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Banner Image</span>
            </NavLink>
          </li>
          <li
            className={`menu-item ${getMenuItemActive(
              "/companydetails",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/companydetails">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Company Details</span>
            </NavLink>
          </li>
          {/* <li
            className={`menu-item ${getMenuItemActive("/logo", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/logo">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Logo</span>
            </NavLink>
          </li> */}
          <li
            className={`menu-item ${getMenuItemActive("/cms", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/cms">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Menu</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/socialmedia", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/socialmedia">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Social Media</span>
            </NavLink>
          </li>
          {/* 
          <li
            className={`menu-item ${getMenuItemActive("/marketingbanner", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/marketingbanner">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Marketing Banner</span>
            </NavLink>
          </li> */}

          <li
            className={`menu-item ${getMenuItemActive("/howitworks", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/howitworks">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">How It Works</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive(
              "/ourtrustedpartners",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/ourtrustedpartners">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Our Trusted Partners</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/knowMore", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/knowMore">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Know More</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/learnpage", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/learnpage">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Learn Page-Share the Joy</span>
            </NavLink>
          </li>
          <li
            className={`menu-item ${getMenuItemActive(
              "/learnenjoythereturns",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/learnenjoythereturns">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Learn Page-Enjoy The Returns</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive(
              "/homedeveloper",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/homedeveloper">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">
                Home Developer-WHY DEVELOPER GROUP
              </span>
            </NavLink>
          </li>
          <li
            className={`menu-item ${getMenuItemActive("/homepage", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/homepage">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">
                Home Developer-DON'T JUST WISH, OWN IT.
              </span>
            </NavLink>
          </li>
          <li
            className={`menu-item ${getMenuItemActive(
              "/footerdescription",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/footerdescription">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">
                Footer Description
              </span>
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/*begin::1 Dashboard*/}
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/dashboard",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link" to="/dashboard">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive(
              "/contactUsAdmin",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/contactUsAdmin">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">ContactUs</span>
            </NavLink>
          </li>

          <li
            className={`menu-item ${getMenuItemActive("/properties", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/properties">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                />
              </span>
              <span className="menu-text">Properties</span>
            </NavLink>
          </li>
        </ul>
      )}
      {/* end::Menu Nav */}
    </>
  );
}
