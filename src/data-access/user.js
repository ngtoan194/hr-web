import client from '../utils/client-utils';
import API from '../config/api';
var md5 = require('md5');
export default {
    search(param, cb) {

        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + -1) +
            (param.specializeId ? '&specializeId=' + param.specializeId : '') +
            (param.salaryProposed ? '&salaryProposed=' + param.salaryProposed : '') +
            (param.departmentId ? '&departmentId=' + param.departmentId : '') +
            (param.recruitmentSourcesId ? '&recruitmentSourcesId=' + param.recruitmentSourcesId : '') +
            (param.contractId ? '&contractId=' + param.contractId : '') +
            (param.insurranceId ? '&insurranceId=' + param.insurranceId : '') +
            (param.name ? '&name=' + param.name : '') +
            (param.birthDay ? '&birthDay=' + param.birthDay : '')

        client.requestApi("get", API.employees.search + parameters, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    create(param, cb) {
        client.requestApi("POST", API.employees.create, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    update(param, cb) {
        client.requestApi("PUT", API.employees.update + "/" + param.id, param, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    login(email, password, callback) {

        var body = {
            isofhMail: email,
            password: md5(password),
        }
        console.log(body)
        client.requestApi("POST", API.employees.login, body, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    logout(param, cb) {
        client.requestApi("PUT", API.employees.logout + "/" + param.id, { "device": { "os": 4, "deviceId": "", "token": "" } }, (s, e) => {
            if (cb)
                cb(s, e);
        })
    },
    getFileTimeKeepingByMonth(param, cb) {
        client.requestApi("get", API.employees.getFileTimeKeepingByMonth + "/" + param.date + "?page=" + param.page + "&size=" + param.size, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
    getDetailByMonth(param, cb) {
        client.requestApi("get", API.employees.getDetailByMonth + '/' + param.id, {}, (s, e) => {
            if (cb) {
                cb(s, e);
            }
        })
    },
}