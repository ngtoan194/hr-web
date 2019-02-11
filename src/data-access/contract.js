import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        console.log(param)
        client.requestApi("get", API.contract.search +"?page="+param.page+"&size="+param.size+"&name="+param.name+"&type="+(param.type === -1 ? '':param.type), {}, (s, e) => {
            if(cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.contract.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    }
}