import client from '../utils/client-utils';
import API from '../config/api';
export default {
    uploadFile(fileData, cb) {
        client.uploadFile(API.file.uploadFile, fileData, cb).then((s, e) => {
            s ? cb(s) : cb(e)
        })
    },
    viewFile(file, cb) {
        cb(API.file.viewFile + file)
    }, 
    downloadFile(file, cb) {
        cb(API.file.download +"/"+ file)
    }

}