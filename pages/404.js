import styles from '../styles/NotFound.module.scss'
import {useRouter} from "next/router";
export default function NotFound () {
    const router = useRouter()
    return (
        <div className={styles.page}>
            <h2>Trang này không hiển thị</h2>
            <span>Có thể liên kết đã hỏng hoặc trang đã bị gỡ. Hãy kiểm tra xem liên kết mà bạn đang cố mở có chính xác không.</span>
            <div onClick={() =>router.push('/')}>
                Đi tới bản tin mới nhất
            </div>
            <a>Truy câp trợ giúp</a>
        </div>
    )
}
