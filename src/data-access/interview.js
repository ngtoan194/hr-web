import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.email ? '&email=' + param.email : '') +
            (param.result ? '&result=' + param.result : '&result=' + -1) +
            (param.name ? '&name=' + param.name : '') +
            (param.specializeId ? '&specializeId=' + param.specializeId : '&specializeId=' + -1) +
            (param.recruitmentSourcesId ? '&recruitmentSourcesId=' + param.recruitmentSourcesId : '&recruitmentSourcesId=' + -1) +
            (param.bucketTs ? '&bucketTs=' + param.bucketTs : '&bucketTs=1970-01-01')

        client.requestApi("get", API.interview.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.interview.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, cb) {
        client.requestApi("PUT", API.interview.update + "/" + param.id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    delete(param, id, cb) {
        client.requestApi("DELETE", API.interview.delete + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    resultInterview(param, id, cb) {
        client.requestApi("PUT", API.interview.result + "/" + id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
}