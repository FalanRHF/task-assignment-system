import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import TaskList from './pages/TaskList';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import EmployeeList from './pages/EmployeeList';
import CompanyList from './pages/CompanyList';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Assessment from './pages/Assessment';
import Analysis from './pages/Analysis';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'employee', element: <EmployeeList /> },
      { path: 'tasks', element: <TaskList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'company', element: <CompanyList /> },
      { path: 'assessment', element: <Assessment /> },
      { path: 'analysis', element: <Analysis /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes
