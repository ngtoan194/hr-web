import client from '../utils/client-utils';
import API from '../config/api';
export default {
    create(params, callback) {
        client.requestApi("POST", API.role.create, params, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    search( param, cb) {
        console.log(param)
        client.requestApi("get", API.role.search + "?value="+ param.value, {}, (s, e) => {
            if(cb) {
                cb(s, e);
            }
        })
    }
}