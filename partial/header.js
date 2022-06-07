import {useState} from "react";
import styles from '../styles/partial/Header.module.scss'
import { useRouter } from 'next/router'
import useDeviceDetect from "../hookCustom/isMobile";
export default function Header ({keySearch}) {
    const router = useRouter()
    const [search, setSearch] = useState(keySearch ? keySearch : '')
    const [cursor, setCursor] = useState(-1)
    const [focusSearch, setFocusSearch] = useState(false)
    const [resultSearch, setResultSearch] = useState( [] )
    let logo = "https://lh3.googleusercontent.com/-Ek4DEtaFP9g/YJKpC2nAc9I/AAAAAAAAAbg/HNosGL9I2hYBQdnFtNdwO5BKVyi6xkqOwCLcBGAsYHQ/h86/Asset%2B7logo.png"
    const {isMobile} = useDeviceDetect()
    if(isMobile) return (
        <div className={styles.header_mobile}>
            <div className={styles.top_header}>
                <div className={styles.action}>Voucher</div>
                <img onClick={() => router.push('/')} src={logo} alt="" width={100}/>
                <div className={styles.action}>
                    <div><i className={'fas fa-bell'}/></div>
                    <div><i className={'fas fa-shopping-bag'}/></div>
                </div>
            </div>
            <div onClick={() => router.push('/search/0')} className={styles.search}>
                <span>Tìm kiếm sản phẩm</span>
            </div>
        </div>
    )
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div onClick={() => router.push('/admin')} className={styles.wrapper_logo}>
                        <img src={logo} alt=""/>
                    </div>
                    <div className={styles.wrapper_search}>
                        <input
                            onFocus={() => setFocusSearch(true)}
                            onKeyDown={(e) => {
                                if (e.which === 13) {
                                    if(search) router.push( `/search/${search}` )
                                }
                                if (e.keyCode === 38 && cursor > -1) {
                                    setCursor(cursor - 1)
                                } else if (e.keyCode === 40 && cursor < resultSearch.length - 1) {
                                    setCursor(cursor + 1)
                                }
                            }}
                            type="text"
                            placeholder={'Tìm kiếm sản phầm'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {resultSearch && <ResultSearch resultSearch={resultSearch}/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ResultSearch = ({resultSearch}) => {
    return (
        <div>
            {/*{resultSearch.map((e) => {*/}
            {/*    return(*/}

            {/*    )*/}
            {/*})}*/}
        </div>
    )
}
