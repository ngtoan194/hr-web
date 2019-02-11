import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.dateStartWork ? '&dateStartWork=' + param.dateStartWork : '&dateStartWork=1970-01-01')
        client.requestApi("get", API.workSchedule.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    update(param, cb) {
        client.requestApi("PUT", API.workSchedule.update + "/" + param.id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(param, id, cb) {
        client.requestApi("DELETE", API.workSchedule.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    result(param, id, cb) {
        client.requestApi("PUT", API.workSchedule.result + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
}