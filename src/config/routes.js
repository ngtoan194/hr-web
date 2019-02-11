import React from 'react';
import Loadable from 'react-loadable';
import CONTANTS from "./strings";
import DefaultLayout from '../containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('../views/Dashboard'),
  loading: Loading,
});

const Cards = Loadable({
  loader: () => import('../views/Cards'),
  loading: Loading,
});

const QuanLyNhanSu = Loadable({
  loader: () => import('../views/QuanLyNhanSu/list_nhansu'),
  // loader: () => import('../views/QuanLyNhanSu/tets/Facility'),
  loading: Loading,
});

const Contract = Loadable({
  loader: () => import('../views/contract/'),
  loading: Loading,
});

const TimeKeeping = Loadable({
  loader: () => import('../views/calendar/time-keeping'),
  loading: Loading,
});
const EmployeeLeave = Loadable({
  loader: () => import('../views/calendar/employee-leave'),
  loading: Loading,
});
const OderOt = Loadable({
  loader: () => import('../views/calendar/oder-ot'),
  loading: Loading,
});
const ExportTimeKeeping = Loadable({
  loader: () => import('../views/calendar/export-time-keeping'),
  loading: Loading,
});

const Insurance = Loadable({
  loader: () => import('../views/insurance/'),
  loading: Loading,
});

const DepartMent = Loadable({
  loader: () => import('../views/QuanLyNhanSu/department/department'),
  loading: Loading,
});

const PositionCMP = Loadable({
  loader: () => import('../views/QuanLyNhanSu/specialize/'),
  loading: Loading,
});

const Recruitment = Loadable({
  loader: () => import('../views/recruitment/recruitment/'),
  loading: Loading,
});

const Interview = Loadable({
  loader: () => import('../views/recruitment/interview/'),
  loading: Loading,
});

const WorkSchedule = Loadable({
  loader: () => import('../views/recruitment/work-schedule/'),
  loading: Loading,
});

const NotificationPage = Loadable({
  loader: () => import('../views/notification/'),
  loading: Loading,
});

const EmployeeInfo = Loadable({
  loader: () => import('../views/employee/employee_info'),
  loading: Loading,
});

const OfferOT = Loadable({
  loader: () => import('../views/employee/offer_ot'),
  loading: Loading,
});

const OfferLeave = Loadable({
  loader: () => import('../views/employee/offer_leave'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: CONTANTS.DASHBOARD, component: Dashboard },
  { path: '/nhansu', exact: true, name: CONTANTS.DRAWER.HRM, component: QuanLyNhanSu },
  { path: '/nhansu/list', name: CONTANTS.DRAWER.LIST_MEMBER, component: QuanLyNhanSu },
  { path: '/nhansu/department', name: CONTANTS.DRAWER.DEPARTMENT, component: DepartMent },
  { path: '/nhansu/specialize', name: CONTANTS.DRAWER.POSITION, component: PositionCMP },
  { path: '/contract', name: CONTANTS.CONTRACT, component: Contract },
  { path: '/calendar', exact: true, name: CONTANTS.CALENDAR.CALENDAR_WORKING, component: EmployeeLeave },
  { path: '/calendar/time-keeping', name: CONTANTS.CALENDAR.TIME_KEEPING, component: TimeKeeping },
  { path: '/calendar/employee-leave', name: CONTANTS.CALENDAR.EMPLOYEELEAVE, component: EmployeeLeave },
  { path: '/calendar/oder-ot', name: CONTANTS.CALENDAR.ODEROT, component: OderOt },
  { path: '/calendar/export-time-keeping', name: CONTANTS.CALENDAR.EXPORT_TIME_KEEPING, component: ExportTimeKeeping },
  { path: '/insurance', name: CONTANTS.INSURANCE, component: Insurance },
  { path: '/recruitment/recruitment', name: CONTANTS.RECRUITMENT.RECRUITMENT, component: Recruitment },
  { path: '/recruitment/interview', name: CONTANTS.RECRUITMENT.INTERVIEW, component: Interview },
  { path: '/recruitment/work-schedule', name: CONTANTS.RECRUITMENT.WORKSCHEDULE, component: WorkSchedule },
  { path: '/notification-page', name: CONTANTS.NOTIFICATION, component: NotificationPage },
  { path: '/employee-info', name: CONTANTS.EMPLOYEE_INFO, component: EmployeeInfo },
  { path: '/offer-ot', name: CONTANTS.OFFER_OT, component: OfferOT },
  { path: '/offer-leave', name: CONTANTS.OFFER_LEAVE, component: OfferLeave },
];

export default routes;
