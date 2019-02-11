import React, { Component } from 'react';
import CONTANTS from "./strings";

const data = JSON.parse(localStorage.getItem('isofh'));
let specialize = {};
if (data) {
  data.specialize ? specialize = data.specialize : specialize.name = null;
}

function getActive() {
  return specialize.name == "HR" || specialize.name == "Leader" ? false : true
}

function checkHr() {
  return specialize.name == "HR" ? false : true
}

export default {
  items: [
    {
      name: CONTANTS.DASHBOARD,
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      title: true,
      name: 'HR CMS',
      wrapper: {
        element: '',
        attributes: {
          disabled: getActive(),
          hidden: getActive(),
        },
      },
    },
    {
      name: CONTANTS.DRAWER.HRM,
      url: '/nhansu',
      icon: 'icon-speedometer',
      attributes: {
        disabled: false,
        hidden: false,
      },
      children: [
        {
          name: CONTANTS.DRAWER.LIST_MEMBER,
          url: '/nhansu/list',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
        {
          name: CONTANTS.DRAWER.DEPARTMENT,
          url: '/nhansu/department',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
        {
          name: CONTANTS.DRAWER.POSITION,
          url: '/nhansu/specialize',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
      ]
    },
    {
      name: CONTANTS.CALENDAR.CALENDAR_WORKING,
      url: '/calendar',
      icon: 'icon-speedometer',
      attributes: {
        disabled: getActive(),
        hidden: getActive(),
      },
      children: [
        {
          name: CONTANTS.CALENDAR.TIME_KEEPING,
          url: '/calendar/time-keeping',
          icon: 'icon-puzzle',
          attributes: {
            disabled: checkHr(),
            hidden: checkHr(),
          },
        },
        {
          name: CONTANTS.CALENDAR.EMPLOYEELEAVE,
          url: '/calendar/employee-leave',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
        {
          name: CONTANTS.CALENDAR.ODEROT,
          url: '/calendar/oder-ot',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
        {
          name: CONTANTS.CALENDAR.EXPORT_TIME_KEEPING,
          url: '/calendar/export-time-keeping',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        }
      ]
    },
    {
      name: CONTANTS.CONTRACT,
      url: '/contract',
      icon: 'icon-speedometer',
      attributes: {
        disabled: getActive(),
        hidden: getActive(),
      },
    },
    {
      name: CONTANTS.INSURANCE,
      url: '/insurance',
      icon: 'icon-speedometer',
      attributes: {
        disabled: getActive(),
        hidden: getActive(),
      },
    },
    {
      name: CONTANTS.RECRUITMENT.RECRUITMENT_MAIN,
      url: '/recruitment',
      icon: 'icon-speedometer',
      attributes: {
        disabled: getActive(),
        hidden: getActive(),
      },
      children: [
        {
          name: CONTANTS.RECRUITMENT.RECRUITMENT,
          url: '/recruitment/recruitment',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
        {
          name: CONTANTS.RECRUITMENT.INTERVIEW,
          url: '/recruitment/interview',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        }, {
          name: CONTANTS.RECRUITMENT.WORKSCHEDULE,
          url: '/recruitment/work-schedule',
          icon: 'icon-puzzle',
          attributes: {
            disabled: getActive(),
            hidden: getActive(),
          },
        },
      ]
    },
    {
      name: CONTANTS.NOTIFICATION,
      url: '/notification-page',
      icon: 'icon-speedometer',
      attributes: {
        disabled: getActive(),
        hidden: getActive(),
      },
    },
    {
      name: CONTANTS.EMPLOYEE_INFO,
      url: '/employee-info',
      icon: 'icon-speedometer',
    },
    {
      name: CONTANTS.OFFER_OT,
      url: '/offer-ot',
      icon: 'icon-speedometer',
    },
    {
      name: CONTANTS.OFFER_LEAVE,
      url: '/offer-leave',
      icon: 'icon-speedometer',
    },
    // {
    //   name: 'Widgets',
    //   url: '/widgets',
    //   icon: 'icon-calculator',
    //   badge: {
    //     variant: 'info',
    //     text: 'NEW',
    //   },
    // },
    // {
    //   divider: true,
    // },
    // {
    //   title: true,
    //   name: 'Extras',
    // },
    // {
    //   name: 'Pages',
    //   url: '/pages',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'Login',
    //       url: '/login',
    //       icon: 'icon-star',
    //     },
    // {
    //   name: 'Register',
    //   url: '/register',
    //   icon: 'icon-star',
    // },
    //   {
    //     name: 'Error 404',
    //     url: '/404',
    //     icon: 'icon-star',
    //   },
    //   {
    //     name: 'Error 500',
    //     url: '/500',
    //     icon: 'icon-star',
    //   },
    // ],
    // },
  ],
};
