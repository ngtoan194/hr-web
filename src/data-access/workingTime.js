import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        client.requestApi("get", API.workingTime.search +"?page="+param.page+"&size="+param.size, {}, (s, e) => {
            if(cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.workingTime.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    }
}