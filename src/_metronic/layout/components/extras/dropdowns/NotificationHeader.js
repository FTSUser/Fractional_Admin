import React from 'react'
import NotificationIcon from "../../../../../_metronic/_assets/images/notification.svg";
import { useHistory } from "react-router-dom";


function NotificationHeader() {
    const history = useHistory();
    return (
        <>
            <div>
                <img onClick={() => history.push("/notification")} src={NotificationIcon} width="100%" />
            </div>
        </>
    )
}

export default NotificationHeader