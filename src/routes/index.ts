import { lazy } from 'react';

const Reports = lazy(() => import('../pages/Report/Reports'));
const LastReports = lazy(() => import('../pages/Report/LastReports'));
const RunningReport = lazy(() => import('../pages/Report/RunningReport'));
const ViewReport = lazy(() => import('../pages/Report/ViewReport'));
const PreviewReport = lazy(() => import('../pages/Report/PreviewReport'));
const ViewImages = lazy(() => import('../pages/Report/ViewImages'));
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
  {
    path: '/reports/preview_report',
    title: 'Preview Report',
    component: PreviewReport,
  },
  {
    path: '/reports/view_images',
    title: 'View Images',
    component: ViewImages,
  },
];

const routes = [...coreRoutes];
export default routes;
