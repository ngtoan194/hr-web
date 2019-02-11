import { post } from 'axios';
const server_url = 'http://123.24.206.9:9215'
// const server_url = 'http://release.hr.isofh.com:9305'
// const server_url = 'http://10.0.50.121:9215'; //local hung

String.prototype.absoluteUrl = String.prototype.absolute || function (defaultValue) {
    var _this = this.toString();
    if (_this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return _this;
    if (_this.startsWith("http") || _this.startsWith("blob")) {
        return _this;
    }
    if (_this.endsWith(".jpg") || _this.endsWith(".png") || _this.endsWith(".gif")) {
        return server_url + _this + "";
    }
    if (!_this.endsWith(".jpg") || !_this.endsWith(".png") || !_this.endsWith(".gif")) {
        return defaultValue;
    }
    // if(this.startsWith("user"))
    //     return
    return server_url + _this + ""
}
export default {
    auth: "",
    // auth: localStorage.getItem('isofh').loginToken,
    serverApi: server_url,
    response: {
        ok(data, message) {
            if (!message)
                message = "";
            return {
                success: true,
                data: data,
                message: message
            }
        },
        noOk(message) {
            if (!message)
                message = "";
            return {
                success: false,
                message: message
            }
        }
    },
    uploadFile(url, file) {
        const formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': this.auth
            }
        }
        return post(url, formData, config)
    },
    requestApi(methodType, url, body, funRes) {
        console.log("Request url " + url + " with token: " + this.auth);
        var dataBody = "";
        if (!body)
            body = {};
        dataBody = JSON.stringify(body);
        this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.auth
            }, dataBody, (s, e) => {
                if (s) {
                    s.json().then(val => {
                        if (funRes)
                            funRes(val);
                    });
                }
                if (e) {
                    if (funRes)
                        funRes(undefined, e);
                }
            });
    },
    requestFetch(methodType, url, header, body, funRes) {
        console.log(body);
        let fetchParam = {
            method: methodType,
            headers: header,
        }

        if (methodType.toLowerCase() !== "get") {
            fetchParam.body = body;

        }
        return fetch(url, fetchParam).then((json) => {
            if (!json.ok) {
                if (funRes)
                    funRes(undefined, json);
            }
            else
                if (funRes)
                    funRes(json);
        }).catch((e) => {
            console.log(e);
            if (funRes)
                funRes(undefined, e);
        });
    }
}