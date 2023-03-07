import { RouteObject } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import App from "../layout/App";

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {path: '', element: <HomePage />},
      {path: 'activities', element: <ActivityDashboard />},
      {path: 'createActivity', element: <ActivityForm />},
      {path: 'activities/:id', element: <ActivityDetails key='create' />},
      {path: 'manage/:id', element: <ActivityForm key='manage' />},
    ]
  }
]

export const router = createBrowserRouter(routes);