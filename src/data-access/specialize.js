import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        client.requestApi("get", API.specialize.search + "?page=" + param.page + "&size=" + param.size, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.specialize.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, id, cb) {
        client.requestApi("PUT", API.specialize.update + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(param, id, cb) {
        client.requestApi("DELETE", API.specialize.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    addRole(param, id, cb) {
        client.requestApi("PUT", API.specialize.add_role + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    removeRole(param, id, cb) {
        client.requestApi("PUT", API.specialize.remove_role + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    updateRole(param, id, cb) {
        client.requestApi("PUT", API.specialize.update_role + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
}