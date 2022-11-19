import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { QuickUserToggler } from "../extras/QuiclUserToggler";

export function Topbar() {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            viewSearchDisplay: objectPath.get(
                uiService.config,
                "extras.search.display"
            ),
            viewNotificationsDisplay: objectPath.get(
                uiService.config,
                "extras.notifications.display"
            ),
            viewQuickActionsDisplay: objectPath.get(
                uiService.config,
                "extras.quick-actions.display"
            ),
            viewCartDisplay: objectPath.get(
                uiService.config,
                "extras.cart.display"
            ),
            viewQuickPanelDisplay: objectPath.get(
                uiService.config,
                "extras.quick-panel.display"
            ),
            viewLanguagesDisplay: objectPath.get(
                uiService.config,
                "extras.languages.display"
            ),
            viewUserDisplay: objectPath.get(
                uiService.config,
                "extras.user.display"
            ),
        };
    }, [uiService]);

    return (
        <div className="topbar d-flex justify-content-between w-100 align-items-center">
            <div>
                {/*begin::Header Nav*/}

                {/* <NavLink className="menu-link" to="/dashboard"> */}
                {/* <span className="menu-text">Frictional Ownership | {userInfo?.admin?.role === "superadmin" && ("Super Admin")}

                    {userInfo?.admin?.role === "admin" && ("Admin")}
                </span> */}
                <div className="header-logo-alignment">
                    <img src="https://i.ibb.co/mTk52hb/logo-ur-black.png" width="60%" />
                </div>
                {/* </NavLink> */}

                {/*end::Header Nav*/}
            </div>
            <div className="d-flex align-items-center">
                {layoutProps.viewUserDisplay && <QuickUserToggler />}
            </div>
        </div>
    );
}
