import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";

// new routing
import Admin from "../_metronic/components/Roles/Admin";
import SuperAdmin from "../_metronic/components/Roles/SuperAdmin";
import User from "../_metronic/components/Roles/User";
import StandardAmenities from "../_metronic/components/Amenities/StandardAmenities";
import DistinctiveAmenities from "../_metronic/components/Amenities/DistinctiveAmenities";
import ContactUsAdmin from "../_metronic/components/ContactUs/ContactUsAdmin";
import ContactUsGeneral from "../_metronic/components/ContactUs/ContactUsGeneral";
import ContactUsforProperty from "../_metronic/components/ContactUs/ContactUsforProperty";
import Properties from "../_metronic/components/Properties/Properties";
import Faqs from "../_metronic/components/Faqs/Faqs";
import KnowMore from "../_metronic/components/KnowMore/KnowMore";
import BannerImage from "../_metronic/components/BannerImage/BannerImage";
//end

import DashboardPage from "./pages/DashboardPage";
import { getUserInfo } from "../../src/utils/user.util";
import AboutUS from "../_metronic/components/AboutUs/AboutUs";
import Cms from "../_metronic/components/Cms/Cms";
import MarketingBanner from "../_metronic/components/Banner/Banner";
import Howitworks from "../_metronic/components/Howitworks/Howitworks";
import Ourtrustedpartners from "../_metronic/components/Ourtrustedpartners/Ourtrustedpartners";
import PopularDestination from "../_metronic/components/PopularDestination/PopularDestination";
import EnjoyTheReturns from "../_metronic/components/EnjoyTheReturns/EnjoyTheReturns";

import SocialMedia from "../_metronic/components/SocialMedia/SocialMedia";
// import Logo from "../_metronic/components/Logo/Logo";
import CompanyDetails from "../_metronic/components/CompanyDetails/CompanyDetails";
import HomeDeveloper from "../_metronic/components/HomeDeveloper/HomeDeveloper";
import HomePage from "../_metronic/components/HomePage/HomePage";
import FaqCategory from "../_metronic/components/FaqCategory/FaqCategory";
import ChatRequest from "../_metronic/components/ChatRequest/ChatRequest";
import Orders from "../_metronic/components/Orders/Orders";
import AllInformation from "../_metronic/components/AllInformation/AllInformation";
import PropertyToken from "../_metronic/components/PropertyToken/PropertyToken";
import SaleProperties from "../_metronic/components/SaleProperties/SaleProperties";
import Status from "../_metronic/components/Status/Status";
import PropertySallRequest from "../_metronic/components/PropertySallRequest/PropertySallRequest";
import PropertyBook from "../_metronic/components/PropertyBook/PropertyBook";
import Refund from "../_metronic/components/Refund/Refund";
import UserList from "../_metronic/components/Refund/UserList";
import ResoldProperty from "../_metronic/components/ResoldProperty/ResoldProperty";
import SellRequestList from "../_metronic/components/ResoldProperty/SellRequestList";
import Notification from "../_metronic/components/Notification/Notification";
import KycRequest from "../_metronic/components/KycRequest/KycRequest";
import FooterDescription from "../_metronic/components/FooterDescription/EnjoyTheReturns";
// import { KycRequest } from "../_metronic/components/KycRequest/KycRequest";
export default function BasePage() {
  let userInfo = getUserInfo();

  return (
    <>
      {userInfo?.admin?.role === "superadmin" ? (
        <Suspense fallback={<LayoutSplashScreen />}>
          <Switch>
            <Redirect exact from="/" to="/dashboard" />
            <ContentRoute exact path="/dashboard" component={DashboardPage} />
            <ContentRoute exact path="/status" component={Status} />
            <ContentRoute exact path="/propertysallrequest" component={PropertySallRequest} />
            <ContentRoute exact path="/sellrequestlist/:id" component={SellRequestList} />

            <ContentRoute exact path="/propertybook" component={PropertyBook} />
            <ContentRoute exact path="/refund" component={Refund} />
            <ContentRoute exact path="/refund-user/:id" component={UserList} />
            <ContentRoute exact path="/resoldproperty" component={ResoldProperty} />
            <ContentRoute exact path="/notification" component={Notification} />
            <ContentRoute exact path="/kycrequest" component={KycRequest} />
            <ContentRoute exact path="/footerdescription" component={FooterDescription} />

            <ContentRoute
              exact
              path="/amenities/standard"
              component={StandardAmenities}
            />
            <ContentRoute
              exact
              path="/amenities/distinctive"
              component={DistinctiveAmenities}
            />
            <ContentRoute
              exact
              path="/contactUs/contactUsGeneral"
              component={ContactUsGeneral}
            />
            <ContentRoute
              exact
              path="/contactUs/contactUsforProperty"
              component={ContactUsforProperty}
            />
            {/* <ContentRoute
              exact
              path="/contactUs/contactUsAdmin"
              component={ContactUsAdmin}
            /> */}
            <ContentRoute exact path="/properties" component={Properties} />
            <ContentRoute exact path="/token" component={PropertyToken} />
            <ContentRoute
              exact
              path="/saleProperties"
              component={SaleProperties}
            />
            <ContentRoute exact path="/roles/admin" component={Admin} />
            <ContentRoute
              exact
              path="/roles/superAdmin"
              component={SuperAdmin}
            />
            <ContentRoute exact path="/roles/user" component={User} />
            <ContentRoute exact path="/faq/faqs" component={Faqs} />
            <ContentRoute exact path="/aboutus" component={AboutUS} />
            <ContentRoute
              exact
              path="/faq/faqcategory"
              component={FaqCategory}
            />
            <ContentRoute exact path="/bannerimage" component={BannerImage} />
            <ContentRoute exact path="/knowMore" component={KnowMore} />
            {/* <ContentRoute exact path="/logo" component={Logo} /> */}
            <ContentRoute exact path="/cms" component={Cms} />
            <ContentRoute
              exact
              path="/companydetails"
              component={CompanyDetails}
            />
            {/* <ContentRoute exact path="/marketingbanner" component={MarketingBanner} /> */}
            <ContentRoute exact path="/howitworks" component={Howitworks} />
            <ContentRoute
              exact
              path="/ourtrustedpartners"
              component={Ourtrustedpartners}
            />
            <ContentRoute
              exact
              path="/learnpage"
              component={PopularDestination}
            />
            <ContentRoute
              exact
              path="/learnenjoythereturns"
              component={EnjoyTheReturns}
            />
            <ContentRoute exact path="/homepage" component={HomePage} />
            <ContentRoute exact path="/chatrequest" component={ChatRequest} />
            <ContentRoute exact path="/orders" component={Orders} />
            <ContentRoute
              exact
              path="/allinformation"
              component={AllInformation}
            />

            <ContentRoute
              exact
              path="/homedeveloper"
              component={HomeDeveloper}
            />

            <ContentRoute exact path="/socialmedia" component={SocialMedia} />
            <Redirect to="error/error-v6" />
          </Switch>
        </Suspense>
      ) : null}

      {userInfo?.admin?.role === "admin" ? (
        <Suspense fallback={<LayoutSplashScreen />}>
          <Switch>
            <Redirect exact from="/" to="/dashboard" />
            <ContentRoute exact path="/dashboard" component={DashboardPage} />
            <ContentRoute exact path="/properties" component={Properties} />
            <ContentRoute
              exact
              path="/contactUsAdmin"
              component={ContactUsAdmin}
            />

            <Redirect to="error/error-v6" />
          </Switch>
        </Suspense>
      ) : null}
    </>
  );
}
