// const ROOTURL = require('../utils/client-utils')
import ROOTURL from '../utils/client-utils'
const ROOT = ROOTURL.serverApi;
export default {
    contract: {
        create: ROOT + '/contract/create',
        search: ROOT + '/contract/search',
        delete: ROOT + '/contract/delete',
        update: ROOT + '/contract/update'
    },
    employees: {
        create: ROOT + '/employees/create',
        search: ROOT + '/employees/search',
        delete: ROOT + '/employees/delete',
        update: ROOT + '/employees/update',
        login: ROOT + '/employees/login',
        logout: ROOT + '/employees/logout',
        getFileTimeKeepingByMonth: ROOT + '/employees/get-file-time-keeping-month',
        getDetailByMonth: ROOT + '/employees/get-detail-by-month'
    },
    department: {
        create: ROOT + '/department/create',
        search: ROOT + '/department/search',
        delete: ROOT + '/department/delete',
        update: ROOT + '/department/update'
    },
    specialize: {
        create: ROOT + '/specialize/create',
        search: ROOT + '/specialize/search',
        delete: ROOT + '/specialize/delete',
        update: ROOT + '/specialize/update',
        add_role: ROOT + '/specialize/add-role',
        update_role: ROOT + '/specialize/update-role',
        remove_role: ROOT + '/specialize/remove-role'
    },
    insurrance: {
        create: ROOT + '/insurrance/create',
        search: ROOT + '/insurrance/search',
        delete: ROOT + '/insurrance/delete',
        update: ROOT + '/insurrance/update'
    },
    file: {
        create: ROOT + '/file/create',
        download: ROOT + '/file/download',
        getFiles: ROOT + '/file/get-files/',
        uploadFile: ROOT + '/file/uploadFile',
        viewFile: ROOT + '/file/viewFile/'
    },
    image: {
        create: ROOT + '/image/create',
        delete: ROOT + '/image/delete/',
        getImage: ROOT + '/image/get-images/',
        upload: ROOT + '/image/upload',
        view: ROOT + '/image/view/'
    },
    recruitment: {
        create: ROOT + '/recruitment-sources/create',
        search: ROOT + '/recruitment-sources/search',
        delete: ROOT + '/recruitment-sources/delete',
        update: ROOT + '/recruitment-sources/update'
    },
    workingTime:{
        create: ROOT + '/working-time/create',
        search: ROOT + '/working-time/search',
        delete: ROOT + '/working-time/delete',
        update: ROOT + '/working-time/update'
    },
    dayOff:{
        create: ROOT + '/day-off/create',
        search: ROOT + '/day-off/search',
        delete: ROOT + '/day-off/delete',
        update: ROOT + '/day-off/update-staus-all'
    },
    overtime: {
        create: ROOT + '/over-time/create',
        search: ROOT + '/over-time/search',
        delete: ROOT + '/over-time/delete',
        update: ROOT + '/over-time/update'
    },
    role: {
        create: ROOT + '/role/create',
        search: ROOT + '/role/search',
    },
    interview: {
        create: ROOT + '/interview/create',
        search: ROOT + '/interview/search',
        delete: ROOT + '/interview/delete',
        update: ROOT + '/interview/update',
        result: ROOT + '/interview/result-interview'

    },
    workSchedule: {
        search: ROOT + '/work-schedule/search',
        delete: ROOT + '/work-schedule/delete',
        update: ROOT + '/work-schedule/update',
        result: ROOT + '/work-schedule/result-workSchedule'
    },
    timeKeeping: {
        search: ROOT + '/time-keeping/search',
        create: ROOT + '/time-keeping/create-by-employees',
    },
    notification: {
        search: ROOT + '/notification/search',
        create: ROOT + '/notification/create',
    }
}