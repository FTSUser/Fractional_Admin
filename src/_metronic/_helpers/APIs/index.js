import { ApiGet } from "../../../helpers/API/ApiData";

export const handleGetNotifications = async (userId, page, countPerPage) => {
    return new Promise((resolve, reject) => {
        ApiGet(`notification/getNotification/${userId}?page=${page}&count=${countPerPage}`)
            .then(res => {
                resolve(res.data.payload);
            })
            .catch(err => {
                reject(err.response.data.message);
            })
    })
}