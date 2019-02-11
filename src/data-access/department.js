import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        client.requestApi("get", API.department.search +"?page="+param.page+"&size="+param.size, {}, (s, e) => {
            if(cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.department.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(param, id, cb) {
        client.requestApi("DELETE", API.department.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, cb) {
        client.requestApi("PUT", API.department.update + "/" + param.id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    }
}