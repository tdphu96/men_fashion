import {useEffect, useState} from "react";
import NATS from "../clientNats/clientNats";

export default function Vouchers() {
    const [vouchers, setVouchers] = useState([])
    const [search, setSearch] = useState('')
    return (
        <div>
            <input
                type="text"
                onKeyDown={(e) => {
                    if (e.which === 13) {
                        try {
                            NATS.request( 'db.get', {
                                collection: 'vouchers',
                                data: {limit: 10, where: {"data.content": {$regex: '.' + search + '.', $options: 'i'}}}
                            } ).then( r => {
                                setVouchers( r.data )
                                console.log( r.data )
                            } )
                        } catch (err) {
                            console.log( err )
                        }
                    }
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value) }
            />
            <h2>{vouchers?.length}</h2>
            {vouchers?.map((e, i) => {
                return (
                    <div key={i}>
                        <p>{e.content}</p>
                        <img src={e.image} alt="" width={40} height={40}/>
                    </div>
                )
            })}
        </div>
    )
}
