import '../styles/globals.css'
import {ToastContainer} from "react-toastify";
import '../public/fontawesome/all.css'
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useState} from "react";
import NATS from "../clientNats/clientNats";
function MyApp({ Component, pageProps }) {
    const [conn, setConn] = useState(null)
    useEffect(() => {
        try {
            NATS.init().then(async (conn) => {
                setConn(conn)
            });
        }catch (e) {
            console.log(e)
        }
    }, [])
    if (!conn) return;
  return(
      <>
        <Component {...pageProps} />
        <ToastContainer
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme={'colored'}
        />
      </>
  )
}

export default MyApp
