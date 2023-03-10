import { Navigate, type RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import ActivityDetails from '../../features/activities/details/ActivityDetails'
import ActivityForm from '../../features/activities/form/ActivityForm'
import NotFound from '../../features/errors/NotFound'
import ServerError from '../../features/errors/ServerError'
import TestErrors from '../../features/errors/TestError'
import HomePage from '../../features/home/HomePage'
import LoginForm from '../../features/users/LoginForm'
import App from '../layout/App'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'activities', element: <ActivityDashboard /> },
      { path: 'createActivity', element: <ActivityForm /> },
      { path: 'activities/:id', element: <ActivityDetails key='create' /> },
      { path: 'manage/:id', element: <ActivityForm key='manage' /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'errors', element: <TestErrors /> },
      { path: 'not-found', element: <NotFound /> },
      { path: '*', element: <Navigate replace to='/not-found' /> },
      { path: 'server-error', element: <ServerError /> }
    ]
  }
]

export const router = createBrowserRouter(routes)
