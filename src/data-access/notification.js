import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.note ? '&note=' + param.note : '') +
            (param.title ? '&title=' + param.title : '') +
            (param.id ? '&id=' + param.id : '') +
            (param.employeesId ? '&employeesId=' + param.employeesId : '')
        client.requestApi("get", API.notification.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.notification.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
}