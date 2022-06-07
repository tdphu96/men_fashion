import {toast} from "react-toastify";
export const paginate = (array, page, limit = 20) => array.slice( ((page - 1) * limit), ((page - 1) * limit) + limit )


export const mToast = (message, type, autoClose = 3000) => {
    const types = {
        info: toast.TYPE.INFO,
        success: toast.TYPE.SUCCESS,
        error: toast.TYPE.ERROR,
        warning: toast.TYPE.WARNING,
    }
    toast(message, {
        position: "bottom-right",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: types[type]
    });
}
