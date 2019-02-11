import client from '../utils/client-utils';
import API from '../config/api';
export default {
    search(param, cb) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.bucketTs ? '&bucketTs=' + param.bucketTs : '&bucketTs=' + - 1) +
            (param.employeesId ? '&employeesId=' + param.employeesId : '&employeesId=' + - 1) +
            (param.name ? '&name=' + param.name : '&name=') +
            (param.fromStartTime ? '&fromStartTime=' + param.fromStartTime : '&fromStartTime=1970-01-01 00:00:00') +
            (param.toStartTime ? '&toStartTime=' + param.toStartTime : '&toStartTime=1970-01-01 00:00:00')
        client.requestApi("get", API.timeKeeping.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.timeKeeping.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
}