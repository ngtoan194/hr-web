import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        client.requestApi("get", API.position.search +"?page="+param.page+"&size="+param.size, {}, (s, e) => {
            if(cb) {
                cb(s, e);
            }
        })
    }
}