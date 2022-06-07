import {connect, JSONCodec, headers, createInbox, ErrorCode} from "nats.ws";
import escapeStringRegexp from 'escape-string-regexp'
const sc = JSONCodec();
let conn = null;
let NATS = {};
NATS.init = async () => {
    try {
        const config = {
            servers: "wss://18.138.252.247:9001",
            // servers: "https://thoitrangnamgioi.click:9001",
            waitOnFirstConnect: true,
        }
        conn = await connect(config);
        console.log("nats connected " + conn.getServer())
        await conn.flush();
        // handle connection to the server is closed - should disable the ui
        conn.closed().then(async (err) => {
            if (err) {
                console.log(`the connection closed with an error ${err.message}`);
            } else {
                console.log(`the connection closed.`);
            }
        });
        (async () => {
            for await (const s of conn.status()) {
                console.log(`Received status update: ${s.type}`);
            }
        })().then();
        return conn
    } catch (e) {
        return null;
    }
};

NATS.close = async () => {
    try {
        if (!conn) return;
        await conn.close()
        conn = null;
    } catch (e) {
        console.log(e)
    }
}

NATS.drain = async () => {
    try {
        if (!conn) return;
        await conn.drain()
        conn = null;
    } catch (e) {
        console.log(e)
    }
}

NATS.headers = headers();
NATS.headers.set("token", "");
NATS.setToken = (token) => {
    try {
        NATS.headers.set("token", token)
    } catch (e) {
        console.log(e)
    }
}
NATS.request = async (topic, data=null) => {
    try {
        if (!conn) throw { error: ErrorCode.ConnectionClosed };
        const res = await conn.request(topic, sc.encode(data), {
            timeout: 30000,
            headers: NATS.headers
        })
        return sc.decode(res.data)
    } catch (err) {
        let res = { status: "error", error: "error" }
        let message = "";
        if (err.code === ErrorCode.NoResponders)
            res.error = ("no_responders")
        else if (err.code === ErrorCode.Timeout)
            res.error = ("request_time_out");
        else if (err.code === ErrorCode.ConnectionClosed)
            res.error = ("no_connect");
        else res.error = ("error");
        return res
    }
}

NATS.listenerRequest = (topic, callback) => {
    try {
        if (!conn) return console.log("no cli");
        let sub = conn.subscribe(topic);
        (async (sub) => {
            console.log(`listening for ${sub.getSubject()} requests...`);
            for await (const m of sub) {
                const data = sc.decode(m.data)
                const respondData = await callback(data)
                if (m.respond(sc.encode(respondData))) console.info(`[res] handled #${sub.getProcessed()}`);
                else console.log(`[res] #${sub.getProcessed()} ignored - no reply subject`);
            }
        })(sub)
    } catch (err) {
        let res = { status: "error", error: "error" }
        let message = "";
        if (err.code === ErrorCode.NoResponders)
            res.error = ("no_responders")
        else if (err.code === ErrorCode.Timeout)
            res.error = ("request_time_out");
        else if (err.code === ErrorCode.ConnectionClosed)
            res.error = ("no_connect");
        else res.error = ("error");
        return res
    }
}

NATS.publish = (topic, data) => {
    try {
        if (!conn) return ;
        conn.publish(topic, sc.encode(data), {
            headers: NATS.headers
        });
        // console.info("pub_"+topic, JSON.stringify(data))
    } catch (e) {
        console.log(e)
    }
}

NATS.unsubscribe = (sub) => {
    try {
        if (!conn) return;
        console.info(`${sub.getSubject()} unsubscribe...`);
        return sub.unsubscribe()
    } catch (e) {
        console.log(e)
    }
}

NATS.getHeader = (headers, key) => {
    try {
        let value = null;
        for (const [k, v] of headers) { if (k === key) value = v.toString() }
        return value
    } catch (e) {
        return null
    }
}

NATS.subscribe = (topic, callback, opt) => {
    try {
        if (!conn) return console.log("no cli");
        let options = {};
        if (opt) options = {...options, ...opt}
        let sub = conn.subscribe(topic, options);
        (async () => {
            console.log(`listening for ${sub.getSubject()} subscribe...`);
            for await (const m of sub) {
                const data = sc.decode(m.data)
                const processed = sub.getProcessed()
                callback && callback(data)
            }
        })()
        return sub
    } catch (e) {
        console.log(e)
    }
}

NATS.getProductsLis = () => {
    const subject = "db..products.snapshot"
    NATS.subscribe(subject, (res) => {
        console.log(res)
    })
}
NATS.getProducts = async (data) => {
    try {
        const subject = "db.get"
        return await NATS.request(subject, {collection: 'products', data})
    } catch (e) {
        console.log(e)
    }
}
NATS.deleteProduct = async (_id) => {
    try {
        const subject = "db.delete"
        return await NATS.request(subject, {collection: 'products', data: {_id}})
    } catch (e) {
        console.log(e)
    }
}
//{"data.imageSmalls": {$in:["https://cf.shopee.vn/file/ff5b38d8d30917654b16eb9ba7bf86a7_tn"]}}
NATS.getCountProducts = async (collection) => {
    // skip: 100, limit: 200,
    // data: {count: true, where: {'data.category': 'Áo khoác'}}
    try {
       const subject = "db.get"
       return await NATS.request(subject, {collection, data: {count: true}})
   } catch (e) {
       console.log(e)
   }
}

NATS.getCountCategoryProducts = async (collection, category) => {
    try {
        const subject = "db.get"
        return await NATS.request(subject, {collection, data: {count: true, where: {'data.category': category}}})
    } catch (e) {
        console.log(e)
    }
}

NATS.searchProducts = async (keySearch) => {
    try {
        const subject = "db.get"
        const regex = escapeStringRegexp(keySearch);
        console.log(regex)

        return await NATS.request(subject, {collection: 'products', data: {where: {"data.nameProduct": {$regex: '.' + keySearch + '.', $options: 'i' }}}})
    }catch (e) {
        console.log(e)
    }
}

// NATS.getCountCategoryProducts = async (collection, category) => {
//     try {
//         const subject = "db.get"
//         return await NATS.request(subject, {collection, data: {count: true, where: {'data.category': category}}})
//     } catch (e) {
//         console.log(e)
//     }
// }

NATS.getDetail = async (collection, id) => {
    try {
        const subject = "db.detail"
        return await NATS.request(subject, {collection, data: {_id: id}})
    } catch (e) {
        console.log(e)
    }
}
NATS.updateProduct = async (data) => {
    try {
        const subject = "db.update"
        return NATS.request( subject, {collection: "products", data} )
    } catch (e) {
        console.log(e)
    }
}

NATS.getVouchers = async () => {

}

NATS.updateVoucher = async () => {

}
export default NATS
