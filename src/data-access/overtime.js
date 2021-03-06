import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + -1) +
            (param.confirm || param.confirm === 0 ? '&confirm=' + param.confirm : '') +
            (param.employeesId ? '&employeesId=' + param.employeesId : '') +
            (param.startDayOT ? '&startDayOT=' + param.startDayOT : '') +
            (param.endDayOT ? '&endDayOT=' + param.endDayOT : '')
        client.requestApi("get", API.overtime.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.overtime.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(id, param, cb) {
        client.requestApi("DELETE", API.overtime.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, cb) {
        client.requestApi("PUT", API.overtime.update + '/' + param.id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    }
}