import {useRouter} from "next/router";
import Header from "../../partial/header";
import {useEffect, useState} from "react";
import NATS from "../../clientNats/clientNats";
import {paginate} from "../../mFun";
import styles from "../../styles/Search.module.scss";
import Link from "next/link";

export default function ListSearch() {
    const [page, setPage] = useState( 1 )
    const router = useRouter()
    const {keySearch} = router.query
    const [countProducts, setCountProducts] = useState( 0 )
    const [resultSearch, setResultSearch] = useState( [] )
    useEffect( () => {
        if (!keySearch) return
        (async () => {
            try {
                setResultSearch([])
                let {data} = await NATS.searchProducts( keySearch )
                setCountProducts( data?.length )
                if (data) {
                    const d = paginate( data, page )
                    if (page <= 1) setResultSearch( d )
                    else setResultSearch( resultSearch => [...resultSearch, ...d] )
                }
            } catch (e) {
                console.log( e )
            }
        })()
    }, [keySearch, page] )
    useEffect( () => {
        const handleScroll = () => {
            const bottom = (document.documentElement.scrollHeight) - document.documentElement.scrollTop <= document.documentElement.clientHeight + 1;
            if (bottom) setPage( p => p + 1 )
        }
        window.addEventListener( 'scroll', handleScroll );
        return () => window.removeEventListener( 'scroll', handleScroll );
    } );
    return (
        <div>
            <Header keySearch={keySearch ? keySearch : ''}/>
            <div className={styles.container}>
                <div className={styles.wrapper_bars}>
                    <div className={styles.bars_products}>
                        <div className={styles.title}>KẾT QUẢ TÌM KIẾM {countProducts}</div>
                    </div>
                </div>
                <div className={styles.list_products}>
                    {resultSearch?.map( (e, i) => {
                        const {_id, nameProduct, priceDrops, price, percentDrops, imageSmalls} = e
                        return (
                            <Link href={_id} key={i}>
                                <div className={styles.item_product}>
                                    <div className={styles.wrapper_image}>
                                        <img src={imageSmalls[0]} alt="" width={100} height={100}/>
                                    </div>
                                    <div className={styles.info_product}>
                                        <div className={styles.name_product}>{nameProduct}</div>
                                        <div className={styles.price_drops}>{priceDrops}</div>
                                        <div className={styles.price}>{price}</div>
                                        <div className={styles.price}>{percentDrops}</div>
                                    </div>
                                </div>
                            </Link>
                        )
                    } )}
                </div>
            </div>
        </div>
    )
}
