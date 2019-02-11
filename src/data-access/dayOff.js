import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + -1) +
            (param.reason ? '&reason=' + param.reason : '') +
            (param.status || param.status === 0 ? '&status=' + param.status : '') +
            (param.employeesId ? '&employeesId=' + param.employeesId : '') +
            (param.dayOffDate ? '&dayOffDate=' + param.dayOffDate : '')

        client.requestApi("get", API.dayOff.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.dayOff.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(id, param, cb) {
        client.requestApi("DELETE", API.dayOff.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, cb) {
        client.requestApi("POST", API.dayOff.update, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    }
}