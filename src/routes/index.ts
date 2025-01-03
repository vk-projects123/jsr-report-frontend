import { lazy } from 'react';

const Reports = lazy(() => import('../pages/Report/Reports'));
const LastReports = lazy(() => import('../pages/Report/LastReports'));
const RunningReport = lazy(() => import('../pages/Report/RunningReport'));
const ViewReport = lazy(() => import('../pages/Report/ViewReport'));
// const NewReport = lazy(()=> import('../pages/Report/NewReport'));

const coreRoutes = [
  {
    path: '/last_reports',
    title: 'Last Reports',
    component: LastReports,
  },
  {
    path: '/reports/:reportType',
    title: 'Reports',
    component: Reports,
  },
  // {
  //   path: '/reports/new_report',
  //   title: 'New Report',
  //   component: NewReport,
  // },
  {
    path: '/reports/running_report/:report_id',
    title: 'Running Report',
    component: RunningReport,
  },
  {
    path: '/reports/view_report/:report_id',
    title: 'View Report',
    component: ViewReport,
  },
];

const routes = [...coreRoutes];
export default routes;
