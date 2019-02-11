import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.name ? '&name=' + param.name : '') +
            (param.webSite ? '&webSite=' + param.webSite : '') +
            (param.address ? '&address=' + param.address : '') +
            (param.phoneNumber ? '&phoneNumber=' + param.phoneNumber : '') +
            (param.contact ? '&contact=' + param.contact : '') +
            (param.price ? '&price=' + param.price : '&price=' + -1) +
            (param.numberEmployee ? '&numberEmployee=' + param.numberEmployee : '&numberEmployee=' + -1)


        client.requestApi("get", API.recruitment.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.recruitment.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, cb) {
        client.requestApi("PUT", API.recruitment.update + "/" + param.id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(param, id, cb) {
        client.requestApi("DELETE", API.recruitment.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
}