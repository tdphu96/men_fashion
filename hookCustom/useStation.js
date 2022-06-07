import STORE from "../zustand/store";
import {mToast} from "../mFun";

const useStation = () => {
    const setModal = STORE.useModal(state => state.setModal)
    return async (station) => {
        try {
            setModal( {controlStation: {nameModal: 'CONTROL_STATION', data: station}} )
        } catch (e) {
            console.log( e )
            mToast( "Có lỗi xảy ra", "ERROR" )
        }
    }
}

export default useStation
