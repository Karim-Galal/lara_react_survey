import { createBrowserRouter, Navigate } from "react-router-dom";
import App from './App.jsx'
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Surveys from "./pages/surveys/Surveys.jsx";
import SurveyCreate from "./pages/surveys/SurveyCreate.jsx";
import SurveyView from "./pages/surveys/SurveyView.jsx";
import SurveyEdit from "./pages/surveys/SurveyEdit.jsx";

// import GuestLayout from "components/GuestLayout.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import AppDefaultLayout from "./layouts/AppDefaultLayout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";


const router =  createBrowserRouter([

  {
    path: "/",
    element: <AppDefaultLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Navigate to='/' />,
      },
      {
        path: "/surveys",
        element: <Surveys />,
      },
      {
        path: "surveys/create",
        element: <SurveyCreate/>,
      },
      {
        path: "surveys/edit/:slug",
        element: <SurveyEdit/>,
      },
      {
        path: "surveys/:slug",
        element: <SurveyView/>,
      },
      {
      },

    ]

  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/guest",
    element: <GuestLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },

]);





export default router;
